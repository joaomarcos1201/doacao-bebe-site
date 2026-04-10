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
@CrossOrigin(origins = "*")
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
            Produto produto = new Produto();
            produto.setNome(nome);
            produto.setDescricao(descricao.length() > 400 ? descricao.substring(0, 400) : descricao);
            produto.setCondicao(estado);
            produto.setTelefone(contato != null && !contato.trim().isEmpty() ? contato : "(11) 99999-9999");
            produto.setCidade("São Paulo");
            produto.setUf("SP");
            produto.setMotivo("Doacao");
            produto.setUsuarioId(17);
            produto.setCategoriaId(1);
            produto.setStatusAnuncio("INATIVO");

            try {
                if (imagem != null && !imagem.isEmpty()) {
                    produto.setFoto(imagem.getBytes());
                } else {
                    produto.setFoto(null);
                }
            } catch (java.io.IOException e) {
                produto.setFoto(null);
            }

            produtoRepository.save(produto);
            return ResponseEntity.ok("Produto cadastrado com sucesso!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao cadastrar produto: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<Produto>> listarProdutos() {
        return ResponseEntity.ok(produtoRepository.findAll());
    }

    @GetMapping("/aprovados")
    public ResponseEntity<List<Produto>> listarProdutosAprovados() {
        return ResponseEntity.ok(produtoRepository.findByStatusAnuncioOrderByDataAnuncioDesc("ATIVO"));
    }

    @GetMapping("/pendentes")
    public ResponseEntity<List<Produto>> listarProdutosPendentes() {
        return ResponseEntity.ok(produtoRepository.findByStatusAnuncioOrderByDataAnuncioDesc("INATIVO"));
    }

    @PutMapping("/{id}/aprovar")
    public ResponseEntity<String> aprovarProduto(@PathVariable Long id) {
        try {
            Produto produto = produtoRepository.findById(id).orElse(null);
            if (produto != null) {
                produto.setStatusAnuncio("ATIVO");
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
}
