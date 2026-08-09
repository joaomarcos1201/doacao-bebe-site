package com.doacaobebe.controller;

import com.doacaobebe.entity.Favorito;
import com.doacaobebe.entity.Produto;
import com.doacaobebe.entity.Usuario;
import com.doacaobebe.repository.FavoritoRepository;
import com.doacaobebe.repository.ProdutoRepository;
import com.doacaobebe.repository.UsuarioRepository;
import com.doacaobebe.service.JwtService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/favoritos")
@CrossOrigin(origins = "*")
public class FavoritoController {

    @Autowired private FavoritoRepository favoritoRepository;
    @Autowired private ProdutoRepository produtoRepository;
    @Autowired private UsuarioRepository usuarioRepository;
    @Autowired private JwtService jwtService;

    private Usuario autenticar(String authHeader) {
        String email = jwtService.extractEmail(authHeader.replace("Bearer ", ""));
        return usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado."));
    }

    @GetMapping
    public ResponseEntity<?> listar(@RequestHeader("Authorization") String authHeader) {
        try {
            Usuario usuario = autenticar(authHeader);
            List<Produto> produtos = favoritoRepository.findByUsuarioId(usuario.getId())
                    .stream().map(Favorito::getProduto).collect(Collectors.toList());
            return ResponseEntity.ok(produtos);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/ids")
    public ResponseEntity<?> listarIds(@RequestHeader("Authorization") String authHeader) {
        try {
            Usuario usuario = autenticar(authHeader);
            List<Integer> ids = favoritoRepository.findByUsuarioId(usuario.getId())
                    .stream().map(f -> f.getProduto().getId()).collect(Collectors.toList());
            return ResponseEntity.ok(ids);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/{produtoId}")
    public ResponseEntity<?> adicionar(@PathVariable Integer produtoId,
                                       @RequestHeader("Authorization") String authHeader) {
        try {
            Usuario usuario = autenticar(authHeader);
            if (favoritoRepository.existsByUsuarioIdAndProdutoId(usuario.getId(), produtoId)) {
                return ResponseEntity.ok(Map.of("favoritado", true));
            }
            Produto produto = produtoRepository.findById(produtoId)
                    .orElseThrow(() -> new IllegalArgumentException("Produto não encontrado."));
            favoritoRepository.save(new Favorito(usuario, produto));
            return ResponseEntity.ok(Map.of("favoritado", true));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{produtoId}")
    @Transactional
    public ResponseEntity<?> remover(@PathVariable Integer produtoId,
                                     @RequestHeader("Authorization") String authHeader) {
        try {
            Usuario usuario = autenticar(authHeader);
            favoritoRepository.deleteByUsuarioIdAndProdutoId(usuario.getId(), produtoId);
            return ResponseEntity.ok(Map.of("favoritado", false));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
