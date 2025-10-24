package com.doacaobebe.controller;

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
            System.out.println("=== DEBUG CADASTRO PRODUTO ===");
            System.out.println("Nome: " + nome);
            System.out.println("Categoria: " + categoria);
            System.out.println("Descricao: " + descricao);
            System.out.println("Estado: " + estado);
            System.out.println("Contato: " + contato);
            System.out.println("CPF: " + cpf);
            System.out.println("Doador: " + doador);
            
            Produto produto = new Produto();
            produto.setNome(nome);
            produto.setDescricao(descricao.length() > 400 ? descricao.substring(0, 400) : descricao);
            produto.setCondicao(estado);
            produto.setTelefone(contato != null && !contato.trim().isEmpty() ? contato : "(11) 99999-9999");
            produto.setContato(contato != null && !contato.trim().isEmpty() ? contato : "(11) 99999-9999");
            produto.setStatusAnuncio("INATIVO");
            
            // Campos adicionais
            produto.setCategoria(categoria);
            produto.setCpf(cpf);
            produto.setDoador(doador != null ? doador : "Doador Anônimo");
            produto.setEstado(estado);
            produto.setStatus("INATIVO");
            
            System.out.println("Tentando salvar produto...");
            produtoRepository.save(produto);
            System.out.println("Produto salvo com sucesso!");
            return ResponseEntity.ok("Produto cadastrado com sucesso!");
        } catch (Exception e) {
            System.err.println("ERRO ao cadastrar produto: " + e.getMessage());
            e.printStackTrace();
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
        List<Produto> produtos = produtoRepository.findByStatusAnuncioOrderByDataAnuncioDesc("ATIVO");
        return ResponseEntity.ok(produtos);
    }

    @GetMapping("/pendentes")
    public ResponseEntity<List<Produto>> listarProdutosPendentes() {
        List<Produto> produtos = produtoRepository.findByStatusAnuncioOrderByDataAnuncioDesc("INATIVO");
        return ResponseEntity.ok(produtos);
    }

    @PutMapping("/{id}/aprovar")
    public ResponseEntity<String> aprovarProduto(@PathVariable Long id) {
        try {
            Produto produto = produtoRepository.findById(id).orElse(null);
            if (produto != null) {
                produto.setStatusAnuncio("ATIVO");
                produto.setStatus("ATIVO");
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

    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("API Produtos funcionando na porta 7979!");
    }
    
    @GetMapping("/{id}/imagem")
    public ResponseEntity<String> obterImagem(@PathVariable Long id) {
        try {
            Produto produto = produtoRepository.findById(id).orElse(null);
            if (produto != null && produto.getFoto() != null) {
                return ResponseEntity.ok("Imagem encontrada");
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}