package com.doacaobebe.provider;

import java.math.BigDecimal;

public interface PagamentoProvider {

    PixResponse gerarPix(Long pedidoId, BigDecimal valor, String descricao);

    class PixResponse {
        private String pagamentoId;
        private String qrCodeBase64;
        private String pixCopiaCola;

        public PixResponse(String pagamentoId, String qrCodeBase64, String pixCopiaCola) {
            this.pagamentoId = pagamentoId;
            this.qrCodeBase64 = qrCodeBase64;
            this.pixCopiaCola = pixCopiaCola;
        }

        public String getPagamentoId() { return pagamentoId; }
        public String getQrCodeBase64() { return qrCodeBase64; }
        public String getPixCopiaCola() { return pixCopiaCola; }
    }
}
