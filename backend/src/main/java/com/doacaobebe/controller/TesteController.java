package com.doacaobebe.controller;

import com.doacaobebe.dto.RedefinirSenhaRequest;
import com.doacaobebe.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/teste")
@CrossOrigin(origins = "http://localhost:3000")
public class TesteController {

    @Autowired
    private UsuarioService usuarioService;

    @PostMapping("/redefinir")
    public ResponseEntity<?> testeRedefinir(@RequestBody RedefinirSenhaRequest request) {
        try {
            usuarioService.redefinirSenha(request.getEmail(), request.getNovaSenha());
            return ResponseEntity.ok("Teste: Senha redefinida com sucesso para " + request.getEmail());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Teste: Erro - " + e.getMessage());
        }
    }
}