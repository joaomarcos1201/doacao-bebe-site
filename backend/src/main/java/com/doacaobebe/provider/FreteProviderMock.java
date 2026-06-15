package com.doacaobebe.provider;

import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
@Profile("!prod")
public class FreteProviderMock implements FreteProvider {

    @Override
    public BigDecimal calcularFrete(String cepOrigem, String cepDestino, BigDecimal peso,
                                    BigDecimal altura, BigDecimal largura, BigDecimal comprimento) {
        // Mock: frete fixo de R$ 15,00 para testes
        // Substituir por integração real com Melhor Envio quando disponível
        return new BigDecimal("15.00");
    }

    @Override
    public String gerarEtiqueta(Long pedidoId, String cepOrigem, String cepDestino,
                                String nomeRemetente, String nomeDestinatario) {
        // Mock: código de rastreio fictício para testes
        return "MOCK" + pedidoId + "BR";
    }
}
