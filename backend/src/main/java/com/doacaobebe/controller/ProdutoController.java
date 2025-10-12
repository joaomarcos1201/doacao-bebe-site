package com.doacaobebe.controller;

import com.doacaobebe.dto.ProdutoRequest;
import com.doacaobebe.entity.Produto;
import com.doacaobebe.repository.ProdutoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/produtos")
@CrossOrigin(origins = "http://localhost:3000")
public class ProdutoController {

    @Autowired
    private ProdutoRepository produtoRepository;

    @PostMapping
    public ResponseEntity<String> cadastrarProduto(
            @RequestParam("nome") String nome,
            @RequestParam("categoria") String categoria,
            @RequestParam("descricao") String descricao,
            @RequestParam("estado") String estado,
            @RequestParam("contato") String contato,
            @RequestParam("cpf") String cpf,
            @RequestParam("doador") String doador,
            @RequestParam(value = "imagem", required = false) MultipartFile imagem) {
        try {
            String imagemBase64 = null;
            if (imagem != null && !imagem.isEmpty()) {
                byte[] imagemBytes = imagem.getBytes();
                imagemBase64 = "data:" + imagem.getContentType() + ";base64," + 
                              java.util.Base64.getEncoder().encodeToString(imagemBytes);
            }

            Produto produto = new Produto(
                nome,
                categoria,
                descricao,
                estado,
                contato,
                cpf,
                imagemBase64,
                doador != null ? doador : "Doador Anônimo"
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

    @GetMapping("/{id}/imagem")
    public ResponseEntity<String> obterImagem(@PathVariable Long id) {
        try {
            Produto produto = produtoRepository.findById(id).orElse(null);
            if (produto != null && produto.getImagem() != null) {
                return ResponseEntity.ok(produto.getImagem());
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}