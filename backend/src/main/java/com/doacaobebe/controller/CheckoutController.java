package com.doacaobebe.controller;

import com.doacaobebe.dto.CheckoutRequest;
import com.doacaobebe.dto.CheckoutResponse;
import com.doacaobebe.entity.Usuario;
import com.doacaobebe.repository.UsuarioRepository;
import com.doacaobebe.service.JwtService;
import com.doacaobebe.service.PedidoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/checkout")
@CrossOrigin(origins = "*")
public class CheckoutController {

    @Autowired
    private PedidoService pedidoService;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @PostMapping
    public ResponseEntity<?> iniciarCheckout(
            @RequestBody CheckoutRequest request,
            @RequestHeader("Authorization") String authHeader) {
        try {
            String email = jwtService.extractEmail(authHeader.replace("Bearer ", ""));
            Usuario comprador = usuarioRepository.findByEmail(email)
                    .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado."));

            CheckoutResponse response = pedidoService.iniciarCheckout(request, comprador.getId());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
