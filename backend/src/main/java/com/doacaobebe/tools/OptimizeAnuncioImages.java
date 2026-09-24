package com.doacaobebe.tools;

import com.doacaobebe.service.AnuncioImageOptimizer;
import java.sql.*;
import java.util.*;
import java.io.PrintStream;

/** Standalone CLI: never starts Spring or reads application.properties. Local restored SQL Server only. */
public final class OptimizeAnuncioImages {
    private static final String[] COLUMNS = {"foto", "foto2", "foto3", "foto4"};

    public static void main(String[] args) throws Exception {
        boolean apply = false, backup = false;
        List<Integer> ids = new ArrayList<>();
        for (String arg : args) {
            if (arg.equals("--apply")) apply = true;
            else if (arg.equals("--backup-confirmed")) backup = true;
            else if (arg.startsWith("--ids=")) {
                for (String id : arg.substring(6).split(",")) ids.add(Integer.valueOf(id));
            } else throw new IllegalArgumentException("Argumento desconhecido: " + arg);
        }
        if (apply && !backup) throw new IllegalArgumentException("Use --backup-confirmed somente após verificar seu backup local.");
        String database = System.getenv("IMAGE_MIGRATION_DATABASE");
        String port = System.getenv().getOrDefault("IMAGE_MIGRATION_PORT", "1433");
        if (database == null || !database.matches("[A-Za-z0-9_]+") || !port.matches("[0-9]{1,5}"))
            throw new IllegalArgumentException("Defina IMAGE_MIGRATION_DATABASE (cópia local) e uma porta válida.");
        String user = Objects.requireNonNull(System.getenv("IMAGE_MIGRATION_USER"), "Defina IMAGE_MIGRATION_USER");
        String password = Objects.requireNonNull(System.getenv("IMAGE_MIGRATION_PASSWORD"), "Defina IMAGE_MIGRATION_PASSWORD");
        // No host/URL argument: production and application datasource cannot be selected accidentally.
        String url = "jdbc:sqlserver://localhost:" + port + ";databaseName=" + database
                + ";encrypt=true;trustServerCertificate=true;loginTimeout=10";
        try (Connection connection = DriverManager.getConnection(url, user, password)) {
            run(connection, ids, apply, new AnuncioImageOptimizer(), System.out);
        }
    }

    public static void run(Connection connection, List<Integer> selected, boolean apply,
                           AnuncioImageOptimizer optimizer, PrintStream log) throws SQLException {
        if (!connection.getAutoCommit()) throw new IllegalArgumentException("Conexão deve iniciar sem transação ativa.");
        List<Integer> ids = new ArrayList<>(selected);
        if (ids.isEmpty()) {
            try (var statement = connection.createStatement(); var rows = statement.executeQuery(
                    "SELECT id FROM Anuncio ORDER BY CASE WHEN id IN (62,65) THEN 0 ELSE 1 END, id")) {
                while (rows.next()) ids.add(rows.getInt(1));
            }
        }
        log.println("id,coluna,bytes_antes,bytes_depois,status");
        for (int id : ids) {
            byte[][] before = new byte[4][], after = new byte[4][];
            try {
                try (var query = connection.prepareStatement("SELECT foto,foto2,foto3,foto4 FROM Anuncio WHERE id=?")) {
                    query.setInt(1, id);
                    try (var row = query.executeQuery()) {
                        if (!row.next()) { log.printf("%d,-,0,0,NAO_ENCONTRADO%n", id); continue; }
                        for (int i = 0; i < 4; i++) before[i] = row.getBytes(i + 1);
                    }
                }
                // Process all photos first. Any error preserves the entire original advertisement.
                for (int i = 0; i < 4; i++) {
                    after[i] = before[i];
                    if (before[i] != null && before[i].length > 0) {
                        byte[] candidate = optimizer.optimize(before[i]);
                        if (candidate.length < before[i].length) after[i] = candidate;
                    }
                }
                if (apply) {
                    connection.setAutoCommit(false);
                    for (int i = 0; i < 4; i++) if (after[i] != before[i]) {
                        // Optimistic concurrency: never overwrite a photo changed since the SELECT.
                        try (var update = connection.prepareStatement("UPDATE Anuncio SET " + COLUMNS[i]
                                + "=? WHERE id=? AND " + COLUMNS[i] + "=?")) {
                            update.setBytes(1, after[i]); update.setInt(2, id); update.setBytes(3, before[i]);
                            if (update.executeUpdate() != 1) throw new SQLException("Foto alterada concorrentemente; rollback.");
                        }
                    }
                    connection.commit();
                    connection.setAutoCommit(true);
                }
                for (int i = 0; i < 4; i++) log.printf("%d,%s,%d,%d,%s%n", id, COLUMNS[i],
                        size(before[i]), size(after[i]), before[i] == after[i] ? "MANTIDA" : apply ? "GRAVADA" : "SIMULACAO");
            } catch (Exception error) {
                if (!connection.getAutoCommit()) { connection.rollback(); connection.setAutoCommit(true); }
                // No success records are emitted for rolled-back rows. Do not log image contents or credentials.
                for (int i = 0; i < 4; i++) log.printf("%d,%s,%d,%d,ERRO_MANTIDA%n", id, COLUMNS[i], size(before[i]), size(before[i]));
                log.printf("# id=%d erro=%s%n", id, error.getMessage().replace('\n', ' ').replace('\r', ' '));
            }
        }
    }
    private static int size(byte[] bytes) { return bytes == null ? 0 : bytes.length; }
}
