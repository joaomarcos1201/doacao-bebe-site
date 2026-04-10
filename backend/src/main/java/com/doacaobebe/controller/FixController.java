package com.doacaobebe.controller;

import com.doacaobebe.entity.Produto;
import com.doacaobebe.repository.ProdutoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/fix")
@CrossOrigin(origins = "*")
public class FixController {

    @Autowired
    private ProdutoRepository produtoRepository;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @GetMapping("/categorias")
    public ResponseEntity<?> listarCategorias() {
        try {
            List<?> categorias = jdbcTemplate.queryForList("SELECT * FROM Categoria");
            return ResponseEntity.ok(categorias);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro: " + e.getMessage());
        }
    }

    @PostMapping("/fix-foto")
    public ResponseEntity<?> fixFoto() {
        try {
            jdbcTemplate.execute("ALTER TABLE Anuncio ALTER COLUMN foto VARBINARY(MAX) NULL");
            return ResponseEntity.ok("Coluna foto corrigida para VARBINARY(MAX)");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro: " + e.getMessage());
        }
    }

    @PostMapping("/seed-categorias")
    public ResponseEntity<?> seedCategorias() {
        try {
            String[][] categorias = {
                {"Roupas", "Roupas e vestuário"},
                {"Brinquedos", "Brinquedos e jogos"},
                {"Móveis", "Móveis e decoração"},
                {"Acessórios", "Acessórios diversos"},
                {"Alimentação", "Alimentos e nutrição"},
                {"Outros", "Outros itens"}
            };
            for (String[] cat : categorias) {
                try {
                    jdbcTemplate.update("INSERT INTO Categoria (nome, descricao) VALUES (?, ?)", cat[0], cat[1]);
                } catch (Exception ignored) {}
            }
            List<?> result = jdbcTemplate.queryForList("SELECT * FROM Categoria");
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro: " + e.getMessage());
        }
    }

    @PostMapping("/update-doadores")
    public ResponseEntity<String> updateDoadores() {
        try {
            List<Produto> produtos = produtoRepository.findAll();
            int updated = 0;
            
            for (Produto produto : produtos) {
                if ("Usuário Logado".equals(produto.getDoador()) || 
                    "Usuario Logado".equals(produto.getDoador()) ||
                    produto.getDoador() == null) {
                    produto.setDoador("Doador Anônimo");
                    produtoRepository.save(produto);
                    updated++;
                }
            }
            
            return ResponseEntity.ok("Atualizados " + updated + " produtos com sucesso!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao atualizar produtos: " + e.getMessage());
        }
    }
}