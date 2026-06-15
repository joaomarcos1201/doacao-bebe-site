package com.doacaobebe.provider;

import java.math.BigDecimal;

public interface FreteProvider {

    BigDecimal calcularFrete(String cepOrigem, String cepDestino, BigDecimal peso,
                             BigDecimal altura, BigDecimal largura, BigDecimal comprimento);

    String gerarEtiqueta(Long pedidoId, String cepOrigem, String cepDestino,
                         String nomeRemetente, String nomeDestinatario);
}
