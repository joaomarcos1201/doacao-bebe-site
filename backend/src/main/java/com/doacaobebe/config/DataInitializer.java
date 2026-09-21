package com.doacaobebe.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public void run(String... args) {
        try {
            Integer count = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM Categoria", Integer.class);
            if (count == null || count == 0) {
                String[][] categorias = {
                    {"Roupas", "Roupas e vestuário"},
                    {"Brinquedos", "Brinquedos e jogos"},
                    {"Móveis", "Móveis e decoração"},
                    {"Acessórios", "Acessórios diversos"},
                    {"Alimentação", "Alimentos e nutrição"},
                    {"Outros", "Outros itens"}
                };
                for (String[] cat : categorias) {
                    jdbcTemplate.update("INSERT INTO Categoria (nome, descricao) VALUES (?, ?)", cat[0], cat[1]);
                }
                System.out.println("✅ Categorias inseridas com sucesso!");
            }
        } catch (Exception e) {
            System.err.println("Erro ao inicializar categorias: " + e.getMessage());
        }

        try {
            jdbcTemplate.update(
                "UPDATE Anuncio SET statusVisibilidade = 'REMOVIDO' " +
                "WHERE nome = ? AND descricao = ? AND categoria = ? AND estado = ? " +
                "AND contato = ? AND cpf = ? AND doador = ? AND vendedor_id IS NULL " +
                "AND preco IS NULL AND statusAnuncio = 'ATIVO' " +
                "AND (statusVisibilidade IS NULL OR statusVisibilidade <> 'REMOVIDO')",
                "Roupas de Bebe",
                "Conjunto de roupas para bebê de 0 a 3 meses. Inclui bodies, macacões e meias. Peças em ótimo estado, lavadas e passadas.",
                "roupas", "seminovo", "(11) 99999-0000", "000.000.000-00", "Gustavo"
            );
        } catch (Exception e) {
            System.err.println("Erro ao ocultar produto de exemplo: " + e.getMessage());
        }

    }
}
