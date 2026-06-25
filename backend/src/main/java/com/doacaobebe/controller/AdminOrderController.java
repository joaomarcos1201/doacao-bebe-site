package com.doacaobebe.controller;

import com.doacaobebe.entity.Pedido;
import com.doacaobebe.entity.Usuario;
import com.doacaobebe.repository.PedidoRepository;
import com.doacaobebe.repository.UsuarioRepository;
import com.doacaobebe.service.CarteiraService;
import com.doacaobebe.service.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/orders")
@CrossOrigin(origins = "*")
public class AdminOrderController {

    @Autowired
    private PedidoRepository pedidoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private CarteiraService carteiraService;

    private Usuario extrairUsuario(String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        String email = jwtService.extractEmail(token);
        return usuarioRepository.findByEmail(email).orElseThrow();
    }

    @Transactional
    @PutMapping("/{id}/release-payment")
    public ResponseEntity<?> releasePayment(
            @PathVariable Long id,
            @RequestHeader("Authorization") String authHeader
    ) {
        try {
            Usuario admin = extrairUsuario(authHeader);

            if (admin == null || !Boolean.TRUE.equals(admin.getIsAdmin())) {
                return ResponseEntity.status(403).body("Acesso negado (ADMIN necessário).");
            }

            Pedido pedido = pedidoRepository.findById(id).orElse(null);

            if (pedido == null) {
                return ResponseEntity.notFound().build();
            }

            // REGRA CORRETA DO FLUXO
            // só libera se estiver FINALIZADO
            if (!"FINALIZADO".equalsIgnoreCase(pedido.getStatusPagamento())) {
                return ResponseEntity.badRequest()
                        .body("Pedido não está finalizado.");
            }

            // libera saldo para o vendedor
            carteiraService.liberarSaldo(
                    pedido.getVendedor(),
                    pedido,
                    pedido.getValorProduto()
            );

            // atualiza status
            pedido.setStatusPagamento("LIBERADO");
            pedidoRepository.save(pedido);

            return ResponseEntity.ok("Pagamento liberado com sucesso.");

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body("Erro ao liberar pagamento: " + e.getMessage());
        }
    }
}