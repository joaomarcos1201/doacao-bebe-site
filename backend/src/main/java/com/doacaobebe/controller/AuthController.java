package com.doacaobebe.controller;

import com.doacaobebe.dto.AuthResponse;
import com.doacaobebe.dto.CadastroRequest;
import com.doacaobebe.dto.LoginRequest;
import com.doacaobebe.dto.RedefinirSenhaRequest;
import com.doacaobebe.service.UsuarioService;
import com.doacaobebe.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private EmailService emailService;

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

    @PostMapping("/enviar-codigo")
    public ResponseEntity<?> enviarCodigo(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            
            // Verificar se o email existe
            if (!usuarioService.emailExiste(email)) {
                return ResponseEntity.badRequest().body("Email não encontrado");
            }
            
            // Gerar código de 6 dígitos
            String codigo = String.format("%06d", (int)(Math.random() * 1000000));
            
            // Salvar código temporariamente (em produção, usar Redis ou cache)
            usuarioService.salvarCodigoRecuperacao(email, codigo);
            
            // Enviar email
            emailService.enviarCodigoRecuperacao(email, codigo);
            
            return ResponseEntity.ok("Código enviado com sucesso");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao enviar código: " + e.getMessage());
        }
    }

    @PostMapping("/verificar-codigo")
    public ResponseEntity<?> verificarCodigo(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            String codigo = request.get("codigo");
            
            if (usuarioService.verificarCodigoRecuperacao(email, codigo)) {
                return ResponseEntity.ok("Código válido");
            } else {
                return ResponseEntity.badRequest().body("Código inválido ou expirado");
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao verificar código: " + e.getMessage());
        }
    }
}