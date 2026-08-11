package com.doacaobebe.controller;

import com.doacaobebe.entity.Pagamento;
import com.doacaobebe.entity.Usuario;
import com.doacaobebe.repository.PagamentoRepository;
import com.doacaobebe.repository.UsuarioRepository;
import com.doacaobebe.service.JwtService;
import com.doacaobebe.service.PedidoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dev")
@CrossOrigin(origins = "*")
@Profile("!prod")
public class SimulacaoController {

    @Autowired
    private PedidoService pedidoService;

    @Autowired
    private PagamentoRepository pagamentoRepository;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @PostMapping("/simulate-payment/{pagamentoId}")
    public ResponseEntity<String> simularPagamento(
            @PathVariable String pagamentoId,
            @RequestHeader("Authorization") String authHeader
    ) {
        try {
            // Exige autenticação válida
            String token = authHeader.replace("Bearer ", "");
            String email = jwtService.extractEmail(token);
            usuarioRepository.findByEmail(email)
                    .orElseThrow(() -> new IllegalArgumentException("Usuário não autenticado."));

            // Aceita somente IDs MOCK_
            if (!pagamentoId.startsWith("MOCK_")) {
                return ResponseEntity.badRequest()
                        .body("Simulação disponível apenas para pagamentos MOCK_.");
            }

            // Verifica se o pagamento existe
            Pagamento pagamento = pagamentoRepository.findByMercadoPagoId(pagamentoId)
                    .orElse(null);
            if (pagamento == null) {
                return ResponseEntity.status(404)
                        .body("Pagamento não encontrado: " + pagamentoId);
            }

            // Impede reprocessamento
            if ("APROVADO".equalsIgnoreCase(pagamento.getStatus())) {
                return ResponseEntity.badRequest()
                        .body("Pagamento já foi aprovado.");
            }

            // Usa exatamente o mesmo fluxo do webhook real
            pedidoService.processarPagamentoAprovado(pagamentoId);

            return ResponseEntity.ok("Pagamento simulado com sucesso.");

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body("Erro na simulação: " + e.getMessage());
        }
    }
}
