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
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
        String email = jwtService.extractEmail(authHeader.replace("Bearer ", ""));
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
            if (admin == null || !admin.getIsAdmin()) {
                return ResponseEntity.status(403).body("Acesso negado (ADMIN necessário)." );
            }

            Pedido pedido = pedidoRepository.findById(id).orElse(null);
            if (pedido == null) {
                return ResponseEntity.notFound().body("Pedido não encontrado." );
            }

            // Regras aprovadas:
            // validar:
            // statusPagamento == "PAGO" e statusPedido == "FINALIZADO"
            // Observação: no model atual não existe statusPedido separado; usamos statusPagamento == FINALIZADO
            // se existir um campo dedicado no futuro, ajustamos.
            if (!"PAGO".equalsIgnoreCase(pedido.getStatusPagamento())) {
                return ResponseEntity.badRequest().body("Pagamento não está em PAGO." );
            }
            if (!"FINALIZADO".equalsIgnoreCase(pedido.getStatusPagamento())) {
                return ResponseEntity.badRequest().body("Pedido não está em FINALIZADO." );
            }

            // chama lógica existente
            carteiraService.liberarSaldo(pedido.getVendedor(), pedido, pedido.getValorProduto());

            // atualiza pedido
            pedido.setStatusPagamento("LIBERADO");
            pedidoRepository.save(pedido);

            return ResponseEntity.ok("Pagamento liberado com sucesso." );
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao liberar pagamento: " + e.getMessage());
        }
    }
}

