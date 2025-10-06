package com.doacaobebe.controller;

import com.doacaobebe.entity.Produto;
import com.doacaobebe.entity.Usuario;
import com.doacaobebe.repository.ProdutoRepository;
import com.doacaobebe.repository.UsuarioRepository;
import com.doacaobebe.service.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/teste")
@CrossOrigin(origins = "http://localhost:3000")
public class TesteController {

    @Autowired
    private ProdutoRepository produtoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;
    
    @Autowired
    private JwtService jwtService;

    @PostMapping("/criar-produto-teste")
    public ResponseEntity<String> criarProdutoTeste() {
        try {
            // Buscar um usuário admin para ser o doador
            Usuario admin = usuarioRepository.findByEmail("admin@alemdopositivo.com")
                .orElse(null);
            
            if (admin == null) {
                return ResponseEntity.badRequest().body("Admin não encontrado");
            }

            Produto produto = new Produto(
                "Carrinho de Bebê Teste",
                "moveis",
                "Carrinho de bebê em ótimo estado para teste do sistema de chat",
                "seminovo",
                "(11) 99999-9999",
                "000.000.000-00",
                "https://via.placeholder.com/400x300?text=Carrinho+de+Bebe",
                admin.getEmail()
            );
            produto.setStatus("aprovado");
            
            produtoRepository.save(produto);
            return ResponseEntity.ok("Produto de teste criado com sucesso! ID: " + produto.getId());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro: " + e.getMessage());
        }
    }

    @GetMapping("/info")
    public ResponseEntity<String> info() {
        long totalUsuarios = usuarioRepository.count();
        long totalProdutos = produtoRepository.count();
        
        return ResponseEntity.ok(
            "Sistema funcionando!\n" +
            "Total de usuários: " + totalUsuarios + "\n" +
            "Total de produtos: " + totalProdutos
        );
    }
    
    @PostMapping("/corrigir-produtos")
    public ResponseEntity<String> corrigirProdutos() {
        try {
            // Buscar admin
            Usuario admin = usuarioRepository.findByEmail("admin@alemdopositivo.com")
                .orElse(null);
            
            if (admin == null) {
                return ResponseEntity.badRequest().body("Admin não encontrado");
            }
            
            // Corrigir produtos com doador "Usuário Logado"
            var produtos = produtoRepository.findAll();
            int corrigidos = 0;
            
            for (var produto : produtos) {
                if ("Usuário Logado".equals(produto.getDoador())) {
                    produto.setDoador(admin.getEmail());
                    produtoRepository.save(produto);
                    corrigidos++;
                }
            }
            
            return ResponseEntity.ok("Produtos corrigidos: " + corrigidos);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro: " + e.getMessage());
        }
    }
    
    @PostMapping("/testar-jwt")
    public ResponseEntity<String> testarJwt(@RequestHeader("Authorization") String token) {
        try {
            String jwt = token.replace("Bearer ", "");
            
            if (jwtService.isTokenValid(jwt)) {
                String email = jwtService.getEmailFromToken(jwt);
                // userId não disponível no JwtService atual
                
                return ResponseEntity.ok(
                    "Token válido!\n" +
                    "Email: " + email
                );
            } else {
                return ResponseEntity.badRequest().body("Token inválido");
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao processar token: " + e.getMessage());
        }
    }
}