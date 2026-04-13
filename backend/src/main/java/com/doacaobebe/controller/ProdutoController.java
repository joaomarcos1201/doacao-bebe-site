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

            // CAMPOS QUE REALMENTE EXISTEM NO BANCO
            produto.setNome(nome);
            produto.setDescricao(descricao);
            produto.setStatusAnuncio("INATIVO");

            // IMAGEM
            if (imagem != null && !imagem.isEmpty()) {
                produto.setFoto(imagem.getBytes());
            }

            // CAMPOS TEMPORÁRIOS (não vão pro banco)
            produto.setCategoria(categoria);
            produto.setEstado(estado);
            produto.setContato(contato);
            produto.setCpf(cpf);
            produto.setDoador(doador);

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
        return ResponseEntity.ok(
            produtoRepository.findByStatusAnuncioOrderByDataAnuncioDesc("ATIVO")
        );
    }

    @GetMapping("/pendentes")
    public ResponseEntity<List<Produto>> listarProdutosPendentes() {
        return ResponseEntity.ok(
            produtoRepository.findByStatusAnuncioOrderByDataAnuncioDesc("INATIVO")
        );
    }

    @PutMapping("/{id}/aprovar")
    public ResponseEntity<String> aprovarProduto(@PathVariable Long id) {
        Produto produto = produtoRepository.findById(id).orElse(null);

        if (produto == null) {
            return ResponseEntity.notFound().build();
        }

        produto.setStatusAnuncio("ATIVO");
        produtoRepository.save(produto);

        return ResponseEntity.ok("Produto aprovado com sucesso!");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> removerProduto(@PathVariable Long id) {
        produtoRepository.deleteById(id);
        return ResponseEntity.ok("Produto removido com sucesso!");
    }

    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("API Produtos funcionando!");
    }
}