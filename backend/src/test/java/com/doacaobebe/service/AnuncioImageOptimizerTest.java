package com.doacaobebe.service;

import org.junit.jupiter.api.Test;
import javax.imageio.*;
import java.awt.image.BufferedImage;
import java.io.*;
import java.nio.file.*;
import java.util.Random;
import static org.junit.jupiter.api.Assertions.*;

class AnuncioImageOptimizerTest {
    private final AnuncioImageOptimizer optimizer = new AnuncioImageOptimizer();

    static BufferedImage fixture(int w, int h, boolean alpha) {
        var image = new BufferedImage(w, h, alpha ? BufferedImage.TYPE_INT_ARGB : BufferedImage.TYPE_INT_RGB);
        var random = new Random(62);
        for (int y = 0; y < h; y++) for (int x = 0; x < w; x++) {
            int noise = random.nextInt(30);
            int r = Math.min(255, x * 220 / w + noise), g = Math.min(255, y * 220 / h + noise);
            image.setRGB(x, y, ((alpha && x < w / 3 ? 100 : 255) << 24) | (r << 16) | (g << 8) | (70 + noise));
        }
        return image;
    }

    public static byte[] bytes(BufferedImage image, String format) throws Exception {
        var output = new ByteArrayOutputStream();
        var writer = ImageIO.getImageWritersByFormatName(format).next();
        try (var stream = ImageIO.createImageOutputStream(output)) {
            writer.setOutput(stream);
            var params = writer.getDefaultWriteParam();
            if (format.equals("jpeg")) {
                params.setCompressionMode(ImageWriteParam.MODE_EXPLICIT);
                params.setCompressionQuality(1f);
            }
            writer.write(null, new IIOImage(image, null, null), params);
        } finally { writer.dispose(); }
        return output.toByteArray();
    }

    private byte[] check(String name, byte[] input, int w, int h) throws Exception {
        byte[] result = optimizer.optimize(input);
        BufferedImage image = ImageIO.read(new ByteArrayInputStream(result));
        assertEquals(w, image.getWidth()); assertEquals(h, image.getHeight());
        assertTrue(result.length <= AnuncioImageOptimizer.MAX_OUTPUT_BYTES);
        Path dir = Path.of("target", "image-test-results"); Files.createDirectories(dir);
        Files.write(dir.resolve(name + "-before.img"), input);
        Files.write(dir.resolve(name + "-after.img"), result);
        System.out.printf("IMAGE %s: %d -> %d bytes (%dx%d)%n", name, input.length, result.length, w, h);
        assertArrayEquals(result, optimizer.optimize(result), "Second pass must preserve optimized image");
        return result;
    }

    @Test void largeLandscapeJpegAndPortraitPng() throws Exception {
        byte[] jpeg = bytes(fixture(3600, 2400, false), "jpeg");
        assertTrue(check("large-jpeg", jpeg, 1600, 1067).length < jpeg.length / 4);
        byte[] png = bytes(fixture(1400, 2100, false), "png");
        assertTrue(check("portrait-png", png, 1067, 1600).length < png.length / 4);
    }
    @Test void smallImagesAreNotUpscaledOrRecompressed() throws Exception {
        for (String format : new String[]{"jpeg", "png"}) {
            byte[] input = bytes(fixture(160, 90, false), format);
            assertArrayEquals(input, check("small-" + format, input, 160, 90));
        }
    }
    @Test void transparencySurvivesResize() throws Exception {
        var source = new BufferedImage(2000, 1000, BufferedImage.TYPE_INT_ARGB);
        var g = source.createGraphics(); g.setColor(new java.awt.Color(40, 80, 160, 100));
        g.fillRect(0, 0, 2000, 1000); g.dispose();
        byte[] output = check("transparent-png", bytes(source, "png"), 1600, 800);
        assertEquals(137, output[0] & 255);
        assertEquals(100, ImageIO.read(new ByteArrayInputStream(output)).getRGB(100,100) >>> 24);
    }
    @Test void invalidFormatsAndInputLimits() throws Exception {
        for (byte[] input : new byte[][]{new byte[0], "not an image".getBytes(), new byte[10*1024*1024+1],
                bytes(fixture(20, 20, false), "gif"), bytes(fixture(12001, 1, false), "png")})
            assertThrows(IllegalArgumentException.class, () -> optimizer.optimize(input));
        assertThrows(IllegalArgumentException.class, () -> optimizer.optimize(null));
    }
    @Test void highEntropyTransparentOutputIsRejectedWithoutFlattening() throws Exception {
        byte[] input = bytes(fixture(1500, 1500, true), "png");
        assertTrue(input.length < AnuncioImageOptimizer.MAX_INPUT_BYTES);
        assertThrows(IllegalArgumentException.class, () -> optimizer.optimize(input));
    }
    @Test void rejectsPixelBombBeforeDecodingAndTruncatedJpeg() throws Exception {
        byte[] png = bytes(fixture(10,10,false),"png");
        java.nio.ByteBuffer.wrap(png).putInt(16,8000).putInt(20,8000);
        var crc = new java.util.zip.CRC32(); crc.update(png,12,17);
        java.nio.ByteBuffer.wrap(png).putInt(29,(int)crc.getValue());
        var error=assertThrows(IllegalArgumentException.class,()->optimizer.optimize(png));
        assertTrue(error.getMessage().contains("40 megapixels"));
        byte[] jpeg=bytes(fixture(100,100,false),"jpeg");
        assertThrows(IllegalArgumentException.class,()->optimizer.optimize(java.util.Arrays.copyOf(jpeg,jpeg.length/2)));
    }
    @Test void allEightExifTransforms() {
        BufferedImage src = new BufferedImage(3,2,BufferedImage.TYPE_INT_RGB);
        int v = 1;
        for (int y=0;y<2;y++) for(int x=0;x<3;x++) src.setRGB(x,y,v++);
        int[][] expected = {{1,2,3,4,5,6},{3,2,1,6,5,4},{6,5,4,3,2,1},{4,5,6,1,2,3},
                {1,4,2,5,3,6},{4,1,5,2,6,3},{6,3,5,2,4,1},{3,6,2,5,1,4}};
        for(int o=1;o<=8;o++) {
            var result=AnuncioImageOptimizer.orient(src,o);
            assertEquals(o>=5?2:3,result.getWidth());
            int i=0;
            for(int y=0;y<result.getHeight();y++) for(int x=0;x<result.getWidth();x++)
                assertEquals(expected[o-1][i++],result.getRGB(x,y)&0xffffff);
        }
    }
    @Test void readsExifFromActualJpeg() throws Exception {
        byte[] jpeg = bytes(fixture(120,80,false),"jpeg");
        byte[] exif = {69,120,105,102,0,0,73,73,42,0,8,0,0,0,1,0,18,1,3,0,1,0,0,0,6,0,0,0,0,0,0,0};
        var out = new ByteArrayOutputStream(); out.write(jpeg,0,2);
        out.write(255);out.write(225);out.write(0);out.write(exif.length+2);out.write(exif);out.write(jpeg,2,jpeg.length-2);
        check("exif-6",out.toByteArray(),80,120);
    }
}
