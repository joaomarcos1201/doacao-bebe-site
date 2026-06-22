package com.doacaobebe.controller;

import com.doacaobebe.dto.NovoProdutoRequest;
import com.doacaobebe.entity.Produto;
import com.doacaobebe.entity.Usuario;
import com.doacaobebe.repository.ProdutoRepository;
import com.doacaobebe.repository.UsuarioRepository;
import com.doacaobebe.repository.PedidoRepository;
import com.doacaobebe.service.JwtService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class ProdutoController {

    @Autowired
    private ProdutoRepository produtoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private PedidoRepository pedidoRepository;


    @PostMapping
    public ResponseEntity<?> cadastrarProduto(
            @RequestParam("nome") String nome,
            @RequestParam("descricao") String descricao,
            @RequestParam("categoria") String categoria,
            @RequestParam("marca") String marca,
            @RequestParam("conservacao") String conservacao,
            @RequestParam("preco") java.math.BigDecimal preco,
            @RequestParam("peso") java.math.BigDecimal peso,
            @RequestParam("altura") java.math.BigDecimal altura,
            @RequestParam("largura") java.math.BigDecimal largura,
            @RequestParam("comprimento") java.math.BigDecimal comprimento,
            @RequestParam("cepOrigem") String cepOrigem,
            @RequestParam(value = "imagem", required = false) MultipartFile imagem,
            @RequestHeader("Authorization") String authHeader) {

        try {
            String token = authHeader.replace("Bearer ", "");
            String email = jwtService.extractEmail(token);
            Usuario vendedor = usuarioRepository.findByEmail(email)
                    .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado."));

            Produto produto = new Produto();
            produto.setNome(nome);
            produto.setDescricao(descricao);
            produto.setCategoria(categoria);
            produto.setMarca(marca);
            produto.setConservacao(conservacao);
            produto.setPreco(preco);
            produto.setPeso(peso);
            produto.setAltura(altura);
            produto.setLargura(largura);
            produto.setComprimento(comprimento);
            produto.setCepOrigem(cepOrigem);
            produto.setVendedor(vendedor);
            produto.setStatusAnuncio("EM_ANALISE");

            if (imagem != null && !imagem.isEmpty()) {
                produto.setFoto(imagem.getBytes());
            }

            produtoRepository.save(produto);
            return ResponseEntity.ok("Produto cadastrado e enviado para análise.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao cadastrar produto: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<Produto>> listarDisponiveis() {
        return ResponseEntity.ok(
                produtoRepository.findByStatusAnuncioOrderByDataAnuncioDesc("DISPONIVEL")
        );
    }

    @GetMapping("/todos")
    public ResponseEntity<List<Produto>> listarTodos() {
        // Evita retornar produtos ocultados
        return ResponseEntity.ok(produtoRepository.findAllByStatusVisibilidadeNot("REMOVIDO"));
    }


    @GetMapping("/{id}")
    public ResponseEntity<?> buscarPorId(@PathVariable Integer id) {
        return produtoRepository.findById(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/pendentes")
    public ResponseEntity<List<Produto>> listarPendentes() {
        return ResponseEntity.ok(
                produtoRepository.findByStatusAnuncioOrderByDataAnuncioDesc("EM_ANALISE")
        );
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<String> alterarStatus(@PathVariable Integer id, @RequestParam String status) {
        Produto produto = produtoRepository.findById(id).orElse(null);
        if (produto == null) return ResponseEntity.notFound().build();

        produto.setStatusAnuncio(status.toUpperCase());
        produtoRepository.save(produto);
        return ResponseEntity.ok("Status atualizado para: " + status);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> remover(@PathVariable Integer id) {
        System.out.println("🗑️ DELETE /api/products/" + id + " recebido pelo ProdutoController");
        boolean existe = produtoRepository.existsById(id);
        System.out.println("🗑️ Produto existe antes do delete? " + existe);

        if (!existe) {
            return ResponseEntity.notFound().body("Produto não encontrado. ID=" + id);
        }

        // Se houver Pedido vinculado, não apagar fisicamente (evita FK)
        if (pedidoRepository.existsByProduto_Id(id)) {
            Produto produto = produtoRepository.findById(id).orElse(null);
            if (produto == null) {
                return ResponseEntity.notFound().body("Produto não encontrado. ID=" + id);
            }

            produto.setStatusVisibilidade("REMOVIDO");
            produtoRepository.save(produto);
            return ResponseEntity.ok("Produto ocultado por possuir histórico de pedidos");
        }

        produtoRepository.deleteById(id);
        System.out.println("🗑️ Delete executado para ID=" + id);

        boolean existeDepois = produtoRepository.existsById(id);
        System.out.println("🗑️ Produto existe após o delete? " + existeDepois);

        return ResponseEntity.ok("Produto removido com sucesso");
    }
}
