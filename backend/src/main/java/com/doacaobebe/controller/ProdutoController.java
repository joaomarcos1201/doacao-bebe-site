package com.doacaobebe.controller;

import com.doacaobebe.service.AnuncioImageOptimizer;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import com.doacaobebe.entity.Produto;
import com.doacaobebe.entity.Usuario;
import com.doacaobebe.repository.ProdutoRepository;
import com.doacaobebe.repository.UsuarioRepository;
import com.doacaobebe.service.JwtService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Locale;

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
    private AnuncioImageOptimizer imageOptimizer;

    @PostMapping
    public ResponseEntity<?> cadastrarProduto(
            @RequestParam("nome") String nome,
            @RequestParam("descricao") String descricao,
            @RequestParam("categoria") String categoria,
            @RequestParam("marca") String marca,
            @RequestParam("conservacao") String conservacao,
            @RequestParam("preco") java.math.BigDecimal preco,
            @RequestParam(value = "peso", required = false) java.math.BigDecimal peso,
            @RequestParam(value = "altura", required = false) java.math.BigDecimal altura,
            @RequestParam(value = "largura", required = false) java.math.BigDecimal largura,
            @RequestParam(value = "comprimento", required = false) java.math.BigDecimal comprimento,
            @RequestParam("cepOrigem") String cepOrigem,
            @RequestParam(value = "imagem", required = false) MultipartFile imagem,
            @RequestParam(value = "imagem_1", required = false) MultipartFile imagem1,
            @RequestParam(value = "imagem_2", required = false) MultipartFile imagem2,
            @RequestParam(value = "imagem_3", required = false) MultipartFile imagem3,
            @RequestHeader("Authorization") String authHeader,
            MultipartHttpServletRequest request) {

        try {
            validarFotos(request);
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
                produto.setFoto(imageOptimizer.optimize(imagem.getBytes()));
            }
            if (imagem1 != null && !imagem1.isEmpty()) {
                produto.setFoto2(imageOptimizer.optimize(imagem1.getBytes()));
            }
            if (imagem2 != null && !imagem2.isEmpty()) {
                produto.setFoto3(imageOptimizer.optimize(imagem2.getBytes()));
            }
            if (imagem3 != null && !imagem3.isEmpty()) {
                produto.setFoto4(imageOptimizer.optimize(imagem3.getBytes()));
            }

            produtoRepository.save(produto);
            return ResponseEntity.ok("Produto cadastrado e enviado para análise.");

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body("Erro ao cadastrar produto: " + e.getMessage());
        }
    }

    private void validarFotos(MultipartHttpServletRequest request) {
        var allowed = java.util.Set.of("imagem", "imagem_1", "imagem_2", "imagem_3");
        int count = 0;
        for (var entry : request.getMultiFileMap().entrySet()) {
            if (!allowed.contains(entry.getKey()) || entry.getValue().size() > 1)
                throw new IllegalArgumentException("Envie ate quatro fotos, uma por campo imagem/imagem_1/imagem_2/imagem_3.");
            for (var file : entry.getValue()) {
                if (file.isEmpty()) throw new IllegalArgumentException("Arquivo de foto vazio.");
                if (file.getSize() > AnuncioImageOptimizer.MAX_INPUT_BYTES)
                    throw new IllegalArgumentException("Cada foto deve ter no maximo 10 MiB.");
                count++;
            }
        }
        if (count > 4) throw new IllegalArgumentException("Maximo de quatro fotos.");
    }

    @GetMapping
    public ResponseEntity<List<Produto>> listarDisponiveis() {
        return ResponseEntity.ok(
                produtoRepository.findByStatusAnuncioInAndStatusVisibilidadeNotOrderByDataAnuncioDesc(
                        List.of("DISPONIVEL", "ATIVO", "APROVADO"),
                        "REMOVIDO"
                )
        );
    }

    @GetMapping("/todos")
    public ResponseEntity<List<Produto>> listarTodos() {
        return ResponseEntity.ok(
                produtoRepository.findAllByStatusVisibilidadeNot("REMOVIDO")
        );
    }

    @GetMapping("/meus")
    public ResponseEntity<?> meusAnuncios(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.replace("Bearer ", "");
            String email = jwtService.extractEmail(token);

            Usuario usuario = usuarioRepository.findByEmail(email)
                    .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado."));

            long totalAnuncios = produtoRepository.countByVendedorId(usuario.getId());
            boolean jaAnunciou = totalAnuncios > 0;

            return ResponseEntity.ok(java.util.Map.of(
                    "totalAnuncios", totalAnuncios,
                    "jaAnunciou", jaAnunciou
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao consultar anúncios do usuário: " + e.getMessage());
        }
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
    @org.springframework.transaction.annotation.Transactional
    public ResponseEntity<String> alterarStatus(
            @PathVariable Integer id,
            @RequestParam String status,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401).body("Autenticação necessária.");
        }
        try {
            String token = authHeader.substring(7);
            String email = jwtService.extractEmail(token);
            Usuario usuario = usuarioRepository.findByEmail(email).orElse(null);
            if (usuario == null || !Boolean.TRUE.equals(usuario.getIsAdmin())) {
                return ResponseEntity.status(403).body("Acesso negado (ADMIN necessário).");
            }
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Token inválido.");
        }

        Produto produto = produtoRepository.buscarParaCompra(id).orElse(null);

        if (produto == null) {
            return ResponseEntity.notFound().build();
        }

        if ("VENDIDO".equals(produto.getStatusAnuncio())) {
            return ResponseEntity.badRequest().body("Produto vendido não pode ser republicado ou reclassificado.");
        }
        if (produto.getVendedor() == null && "REMOVIDO".equals(produto.getStatusVisibilidade())) {
            return ResponseEntity.status(409).body("Anúncio histórico sem vendedor não pode ser republicado.");
        }
        if (produto.getVendedor() != null && !"ATIVO".equalsIgnoreCase(
                produto.getVendedor().getStatusUsuario() == null ? "" : produto.getVendedor().getStatusUsuario().trim())) {
            return ResponseEntity.status(409).body("Anúncios de contas inativas não podem ser aprovados ou reclassificados.");
        }
        produto.setStatusAnuncio(normalizarStatus(status));
        produtoRepository.save(produto);

        return ResponseEntity.ok("Status atualizado para: " + produto.getStatusAnuncio());
    }

    private String normalizarStatus(String status) {
        String statusNormalizado = status == null ? "" : status.trim().toUpperCase(Locale.ROOT);
        if ("APROVADO".equals(statusNormalizado)) {
            return "DISPONIVEL";
        }
        if ("REJEITADO".equals(statusNormalizado)) {
            return "REPROVADO";
        }
        return statusNormalizado;
    }

    @PutMapping("/{id}/nome")
    public ResponseEntity<String> alterarNome(
            @PathVariable Integer id,
            @RequestParam String nome,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) return ResponseEntity.status(401).body("Autenticação necessária.");
        try {
            String email = jwtService.extractEmail(authHeader.substring(7));
            Usuario usuario = usuarioRepository.findByEmail(email).orElse(null);
            if (usuario == null || !Boolean.TRUE.equals(usuario.getIsAdmin())) return ResponseEntity.status(403).body("Acesso negado.");
        } catch (Exception e) { return ResponseEntity.status(401).body("Token inválido."); }
        Produto produto = produtoRepository.findById(id).orElse(null);
        if (produto == null) return ResponseEntity.notFound().build();
        produto.setNome(nome);
        produtoRepository.save(produto);
        return ResponseEntity.ok("Nome atualizado.");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> remover(@PathVariable Integer id,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401).build();
        }
        try {
            String email = jwtService.extractEmail(authHeader.substring(7));
            Usuario usuario = usuarioRepository.findByEmail(email).orElse(null);
            if (usuario == null || !Boolean.TRUE.equals(usuario.getIsAdmin())) {
                return ResponseEntity.status(403).build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(401).build();
        }

        Produto produto = produtoRepository.findById(id).orElse(null);
        if (produto == null) {
            return ResponseEntity.status(404).body("Produto não encontrado. ID=" + id);
        }

        produto.setStatusVisibilidade("REMOVIDO");
        produtoRepository.save(produto);
        return ResponseEntity.ok("Produto removido com sucesso");
    }
}
