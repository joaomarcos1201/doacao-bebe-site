package com.doacaobebe.provider;

import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.UUID;

@Component
@Profile("!prod")
public class PagamentoProviderMock implements PagamentoProvider {

    @Override
    public PixResponse gerarPix(Long pedidoId, BigDecimal valor, String descricao) {
        // Mock: dados fictícios para testes
        // Substituir por integração real com Mercado Pago quando disponível
        String pagamentoId = "MOCK_MP_" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        String pixCopiaCola = "00020126580014br.gov.bcb.pix0136" + UUID.randomUUID() + "5204000053039865802BR5925ALEM DO POSITIVO6009SAO PAULO62070503***6304MOCK";
        String qrCodeBase64 = "MOCK_QRCODE_BASE64_" + pagamentoId;

        return new PixResponse(pagamentoId, qrCodeBase64, pixCopiaCola);
    }
}
