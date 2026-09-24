package com.doacaobebe.service;

import com.drew.imaging.ImageMetadataReader;
import com.drew.metadata.exif.ExifIFD0Directory;
import org.springframework.stereotype.Service;
import javax.imageio.*;
import javax.imageio.plugins.jpeg.JPEGImageWriteParam;
import javax.imageio.stream.MemoryCacheImageInputStream;
import javax.imageio.stream.MemoryCacheImageOutputStream;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.*;
import java.util.Locale;

/** Shared by uploads and the explicitly invoked offline migration; no database access. */
@Service
public class AnuncioImageOptimizer {
    public static final int MAX_INPUT_BYTES = 10 * 1024 * 1024;
    public static final int MAX_OUTPUT_BYTES = 1024 * 1024;
    public static final int MAX_SIDE = 1600;
    public static final long MAX_PIXELS = 40_000_000;
    public static final int MAX_INPUT_SIDE = 12000;
    public static final float JPEG_QUALITY = .88f;
    private static final int ALREADY_SMALL = 350 * 1024;
    private static final byte[] JPEG_MARKER = "ADP-image-v1-q88".getBytes(java.nio.charset.StandardCharsets.US_ASCII);

    // Serializes decodes in this JVM to bound peak memory from concurrent uploads.
    public synchronized byte[] optimize(byte[] original) {
        if (original == null || original.length == 0) throw invalid("Imagem vazia.");
        if (original.length > MAX_INPUT_BYTES) throw invalid("Cada foto deve ter no máximo 10 MiB.");
        try (var input = new MemoryCacheImageInputStream(new ByteArrayInputStream(original))) {
            var readers = ImageIO.getImageReaders(input);
            if (!readers.hasNext()) throw invalid("Formato inválido. Envie JPEG ou PNG.");
            var reader = readers.next();
            BufferedImage decoded;
            String format;
            try {
                reader.setInput(input);
                format = reader.getFormatName().toLowerCase(Locale.ROOT);
                if (!format.equals("jpeg") && !format.equals("png")) throw invalid("Envie JPEG ou PNG estático.");
                int w = reader.getWidth(0), h = reader.getHeight(0);
                if (w < 1 || h < 1 || w > MAX_INPUT_SIDE || h > MAX_INPUT_SIDE || (long) w * h > MAX_PIXELS)
                    throw invalid("Resolução excedida: máximo 40 megapixels e 12000 px por lado.");
                if (format.equals("png") && animatedPng(original)) throw invalid("PNG animado não é permitido.");
                reader.addIIOReadWarningListener((source, warning) -> { throw invalid("Imagem danificada ou incompleta."); });
                decoded = reader.read(0);
            } finally { reader.dispose(); }
            int orientation = orientation(original);
            if (orientation == 1 && decoded.getWidth() <= MAX_SIDE && decoded.getHeight() <= MAX_SIDE
                    && (original.length <= ALREADY_SMALL || (original.length <= MAX_OUTPUT_BYTES && markedJpeg(original)))) return original;
            boolean alpha = hasTransparency(decoded);
            // Resize before rotating: avoid allocating a second full-resolution phone photo.
            BufferedImage resized = orient(resize(decoded, alpha), orientation);
            byte[] encoded = encode(resized, alpha);
            // Verify the encoder output before it can reach any persistence path.
            BufferedImage verified = ImageIO.read(new ByteArrayInputStream(encoded));
            if (verified == null || verified.getWidth() != resized.getWidth() || verified.getHeight() != resized.getHeight())
                throw invalid("Não foi possível validar a imagem processada.");
            boolean requiresTransform = orientation != 1 || decoded.getWidth() > MAX_SIDE || decoded.getHeight() > MAX_SIDE;
            byte[] result = !requiresTransform && original.length < encoded.length ? original : encoded;
            if (result.length > MAX_OUTPUT_BYTES) throw invalid("A foto processada excede 1 MiB. Escolha uma imagem menor; a qualidade não será reduzida automaticamente.");
            return result;
        } catch (IllegalArgumentException e) { throw e; }
        catch (Exception e) { throw new IllegalArgumentException("Não foi possível processar a foto. Envie JPEG ou PNG válido.", e); }
    }

    private int orientation(byte[] data) throws Exception {
        var metadata = ImageMetadataReader.readMetadata(new ByteArrayInputStream(data));
        var exif = metadata.getFirstDirectoryOfType(ExifIFD0Directory.class);
        Integer value = exif == null ? null : exif.getInteger(ExifIFD0Directory.TAG_ORIENTATION);
        if (value != null && (value < 1 || value > 8)) throw invalid("Orientação EXIF inválida.");
        return value == null ? 1 : value;
    }

    private boolean animatedPng(byte[] data) {
        for (int pos = 8; pos + 12 <= data.length;) {
            long len = ((long)(data[pos] & 255) << 24) | ((long)(data[pos+1] & 255) << 16)
                    | ((data[pos+2] & 255) << 8) | (data[pos+3] & 255);
            if (data[pos+4] == 'a' && data[pos+5] == 'c' && data[pos+6] == 'T' && data[pos+7] == 'L') return true;
            if (len + pos + 12 > data.length) throw invalid("PNG incompleto.");
            pos += (int) len + 12;
        }
        return false;
    }

    static BufferedImage orient(BufferedImage src, int orientation) {
        if (orientation == 1) return src;
        int w = src.getWidth(), h = src.getHeight();
        boolean swap = orientation >= 5;
        BufferedImage dst = new BufferedImage(swap ? h : w, swap ? w : h,
                src.getColorModel().hasAlpha() ? BufferedImage.TYPE_INT_ARGB : BufferedImage.TYPE_INT_RGB);
        for (int y = 0; y < h; y++) for (int x = 0; x < w; x++) {
            int dx = x, dy = y;
            switch (orientation) {
                case 2 -> dx = w - 1 - x;
                case 3 -> { dx = w - 1 - x; dy = h - 1 - y; }
                case 4 -> dy = h - 1 - y;
                case 5 -> { dx = y; dy = x; }
                case 6 -> { dx = h - 1 - y; dy = x; }
                case 7 -> { dx = h - 1 - y; dy = w - 1 - x; }
                case 8 -> { dx = y; dy = w - 1 - x; }
                default -> throw invalid("Orientação inválida.");
            }
            dst.setRGB(dx, dy, src.getRGB(x, y));
        }
        return dst;
    }

    private boolean hasTransparency(BufferedImage image) {
        if (!image.getColorModel().hasAlpha()) return false;
        for (int y = 0; y < image.getHeight(); y++) for (int x = 0; x < image.getWidth(); x++)
            if ((image.getRGB(x, y) >>> 24) != 255) return true;
        return false;
    }

    private BufferedImage resize(BufferedImage source, boolean alpha) {
        double scale = Math.min(1d, (double) MAX_SIDE / Math.max(source.getWidth(), source.getHeight()));
        int w = Math.max(1, (int) Math.round(source.getWidth() * scale));
        int h = Math.max(1, (int) Math.round(source.getHeight() * scale));
        // Progressive halving avoids aliasing on large reductions; final interpolation is bicubic.
        BufferedImage current = source;
        do {
            int nextW = Math.max(w, current.getWidth() / 2), nextH = Math.max(h, current.getHeight() / 2);
            var next = new BufferedImage(nextW, nextH, alpha ? BufferedImage.TYPE_INT_ARGB : BufferedImage.TYPE_INT_RGB);
            Graphics2D g = next.createGraphics();
            try {
                g.setComposite(AlphaComposite.Src);
                g.setRenderingHint(RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_BICUBIC);
                g.drawImage(current, 0, 0, nextW, nextH, null);
            } finally { g.dispose(); }
            current = next;
        } while (current.getWidth() != w || current.getHeight() != h);
        return current;
    }

    private byte[] encode(BufferedImage image, boolean alpha) throws IOException {
        var bytes = new ByteArrayOutputStream();
        var writer = ImageIO.getImageWritersByFormatName(alpha ? "png" : "jpeg").next();
        try (var output = new MemoryCacheImageOutputStream(bytes)) {
            writer.setOutput(output);
            var params = writer.getDefaultWriteParam();
            if (!alpha) {
                params.setCompressionMode(ImageWriteParam.MODE_EXPLICIT);
                params.setCompressionQuality(JPEG_QUALITY);
                ((JPEGImageWriteParam) params).setOptimizeHuffmanTables(true);
            }
            writer.write(null, new IIOImage(image, null, null), params);
        } finally { writer.dispose(); }
        byte[] encoded = bytes.toByteArray();
        if (alpha) return encoded;
        // A standard JPEG COM segment makes repeated uploads/migration idempotent.
        // The marker never bypasses format, pixel, byte or full decode validation.
        var marked = new ByteArrayOutputStream();
        marked.write(encoded, 0, 2);
        marked.write(255); marked.write(254);
        marked.write(0); marked.write(JPEG_MARKER.length + 2);
        marked.write(JPEG_MARKER);
        marked.write(encoded, 2, encoded.length - 2);
        return marked.toByteArray();
    }
    private boolean markedJpeg(byte[] bytes) {
        if (bytes.length < 6 + JPEG_MARKER.length || (bytes[0] & 255) != 255 || (bytes[1] & 255) != 216
                || (bytes[2] & 255) != 255 || (bytes[3] & 255) != 254 || bytes[4] != 0
                || (bytes[5] & 255) != JPEG_MARKER.length + 2) return false;
        for (int i = 0; i < JPEG_MARKER.length; i++) if (bytes[i + 6] != JPEG_MARKER[i]) return false;
        return true;
    }
    private static IllegalArgumentException invalid(String message) { return new IllegalArgumentException(message); }
}
