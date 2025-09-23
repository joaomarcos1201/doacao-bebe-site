package com.doacaobebe.controller;

import com.doacaobebe.dto.AuthResponse;
import com.doacaobebe.dto.CadastroRequest;
import com.doacaobebe.dto.LoginRequest;
import com.doacaobebe.dto.RedefinirSenhaRequest;
import com.doacaobebe.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private UsuarioService usuarioService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            AuthResponse response = usuarioService.login(loginRequest);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro no login: " + e.getMessage());
        }
    }

    @PostMapping("/cadastro")
    public ResponseEntity<?> cadastro(@RequestBody CadastroRequest cadastroRequest) {
        try {
            AuthResponse response = usuarioService.cadastrar(cadastroRequest);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro no cadastro: " + e.getMessage());
        }
    }

    @PutMapping("/redefinir-senha")
    public ResponseEntity<?> redefinirSenha(@RequestBody RedefinirSenhaRequest request) {
        try {
            usuarioService.redefinirSenha(request.getEmail(), request.getNovaSenha());
            return ResponseEntity.ok("Senha redefinida com sucesso");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao redefinir senha: " + e.getMessage());
        }
    }
}