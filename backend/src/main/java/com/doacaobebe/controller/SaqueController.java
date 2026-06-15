package com.doacaobebe.controller;

import com.doacaobebe.dto.SaqueRequest;
import com.doacaobebe.entity.Saque;
import com.doacaobebe.entity.Usuario;
import com.doacaobebe.repository.UsuarioRepository;
import com.doacaobebe.service.JwtService;
import com.doacaobebe.service.SaqueService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/withdrawals")
@CrossOrigin(origins = "*")
public class SaqueController {

    @Autowired
    private SaqueService saqueService;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @PostMapping
    public ResponseEntity<?> solicitar(
            @RequestBody SaqueRequest request,
            @RequestHeader("Authorization") String authHeader) {
        try {
            Usuario usuario = extrairUsuario(authHeader);
            Saque saque = saqueService.solicitarSaque(usuario.getId(), request.getValor());
            return ResponseEntity.ok(saque);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<Saque>> meusSaques(@RequestHeader("Authorization") String authHeader) {
        Usuario usuario = extrairUsuario(authHeader);
        return ResponseEntity.ok(saqueService.listarPorUsuario(usuario.getId()));
    }

    @GetMapping("/admin")
    public ResponseEntity<List<Saque>> todos() {
        return ResponseEntity.ok(saqueService.listarTodos());
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> resolver(@PathVariable Long id, @RequestParam boolean aprovado) {
        try {
            return ResponseEntity.ok(saqueService.resolverSaque(id, aprovado));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    private Usuario extrairUsuario(String authHeader) {
        String email = jwtService.extractEmail(authHeader.replace("Bearer ", ""));
        return usuarioRepository.findByEmail(email).orElseThrow();
    }
}
