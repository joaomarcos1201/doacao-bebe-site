package com.doacaobebe.controller;

import com.doacaobebe.entity.Produto;
import com.doacaobebe.repository.ProdutoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/fix")
@CrossOrigin(origins = "http://localhost:3000")
public class FixController {

    @Autowired
    private ProdutoRepository produtoRepository;

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