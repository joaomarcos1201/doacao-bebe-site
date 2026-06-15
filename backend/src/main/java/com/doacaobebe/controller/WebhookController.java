package com.doacaobebe.controller;

import com.doacaobebe.dto.FreteWebhookRequest;
import com.doacaobebe.dto.MercadoPagoWebhookRequest;
import com.doacaobebe.service.PedidoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "*")
public class WebhookController {

    @Autowired
    private PedidoService pedidoService;

    @PostMapping("/api/webhooks/mercadopago")
    public ResponseEntity<String> mercadoPago(@RequestBody MercadoPagoWebhookRequest body) {
        try {
            if (body.getData() == null || body.getData().getId() == null) {
                return ResponseEntity.ok("ignored");
            }

            String mpId = body.getData().getId();
            String action = body.getAction();

            if ("payment.updated".equals(action) || "payment.created".equals(action)) {
                // Para mock: o status vem no action type
                // Em produção: consultar API do MP com o mpId para obter status real
                String status = body.getType() != null ? body.getType() : "approved";

                switch (status.toLowerCase()) {
                    case "approved" -> pedidoService.processarPagamentoAprovado(mpId);
                    case "rejected", "cancelled", "refunded" ->
                            pedidoService.processarPagamentoRejeitadoOuCancelado(mpId, status);
                }
            }

            return ResponseEntity.ok("ok");
        } catch (Exception e) {
            return ResponseEntity.ok("error: " + e.getMessage());
        }
    }

    @PostMapping("/api/webhooks/shipping")
    public ResponseEntity<String> shipping(@RequestBody FreteWebhookRequest body) {
        try {
            pedidoService.atualizarRastreamento(body.getCodigoRastreio(), body.getStatus().toUpperCase());
            return ResponseEntity.ok("ok");
        } catch (Exception e) {
            return ResponseEntity.ok("error: " + e.getMessage());
        }
    }
}
