package com.doacaobebe.controller;

import com.doacaobebe.entity.Usuario;
import com.doacaobebe.repository.UsuarioRepository;
import com.doacaobebe.service.AdminDashboardService;
import com.doacaobebe.service.JwtService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/dashboard")
@CrossOrigin(origins = "*")
public class AdminDashboardController {

    private final AdminDashboardService dashboardService;
    private final JwtService jwtService;
    private final UsuarioRepository usuarioRepository;

    public AdminDashboardController(AdminDashboardService dashboardService, JwtService jwtService,
                                    UsuarioRepository usuarioRepository) {
        this.dashboardService = dashboardService;
        this.jwtService = jwtService;
        this.usuarioRepository = usuarioRepository;
    }

    @GetMapping
    public ResponseEntity<?> buscar(@RequestParam(defaultValue = "7d") String periodo,
                                    @RequestHeader(value = "Authorization", required = false) String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401).body("Autenticação necessária.");
        }
        Usuario usuario;
        try {
            String email = jwtService.extractEmail(authHeader.substring(7));
            usuario = usuarioRepository.findByEmail(email).orElse(null);
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Token inválido.");
        }
        if (usuario == null || !Boolean.TRUE.equals(usuario.getIsAdmin())) {
            return ResponseEntity.status(403).body("Acesso negado (ADMIN necessário).");
        }
        try {
            return ResponseEntity.ok(dashboardService.buscar(periodo));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Erro ao carregar o Dashboard.");
        }
    }
}
