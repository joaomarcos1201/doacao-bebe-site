package com.doacaobebe.controller;

import com.doacaobebe.dto.ProdutoRequest;
import com.doacaobebe.entity.Produto;
import com.doacaobebe.repository.ProdutoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/produtos")
@CrossOrigin(origins = "http://localhost:3000")
public class ProdutoController {

    @Autowired
    private ProdutoRepository produtoRepository;

    @PostMapping
    public ResponseEntity<String> cadastrarProduto(@RequestBody ProdutoRequest request) {
        try {
            Produto produto = new Produto(
                request.getNome(),
                request.getCategoria(),
                request.getDescricao(),
                request.getEstado(),
                request.getContato(),
                request.getImagem(),
                "Usuário Logado"
            );
            
            produtoRepository.save(produto);
            return ResponseEntity.ok("Produto cadastrado com sucesso!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao cadastrar produto: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<Produto>> listarProdutos() {
        List<Produto> produtos = produtoRepository.findAll();
        return ResponseEntity.ok(produtos);
    }

    @GetMapping("/aprovados")
    public ResponseEntity<List<Produto>> listarProdutosAprovados() {
        List<Produto> produtos = produtoRepository.findByStatusOrderByDataCriacaoDesc("aprovado");
        return ResponseEntity.ok(produtos);
    }

    @GetMapping("/pendentes")
    public ResponseEntity<List<Produto>> listarProdutosPendentes() {
        List<Produto> produtos = produtoRepository.findByStatusOrderByDataCriacaoDesc("pendente");
        return ResponseEntity.ok(produtos);
    }

    @PutMapping("/{id}/aprovar")
    public ResponseEntity<String> aprovarProduto(@PathVariable Long id) {
        try {
            Produto produto = produtoRepository.findById(id).orElse(null);
            if (produto != null) {
                produto.setStatus("aprovado");
                produtoRepository.save(produto);
                return ResponseEntity.ok("Produto aprovado com sucesso!");
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao aprovar produto: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> removerProduto(@PathVariable Long id) {
        try {
            produtoRepository.deleteById(id);
            return ResponseEntity.ok("Produto removido com sucesso!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao remover produto: " + e.getMessage());
        }
    }
}