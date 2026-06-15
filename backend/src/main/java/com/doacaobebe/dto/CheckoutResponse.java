package com.doacaobebe.dto;

import java.math.BigDecimal;

public class CheckoutResponse {
    private Long pedidoId;
    private String nomeProduto;
    private BigDecimal valorProduto;
    private BigDecimal valorFrete;
    private BigDecimal valorTotal;
    private String qrCodeBase64;
    private String pixCopiaCola;
    private String pagamentoId;

    public Long getPedidoId() { return pedidoId; }
    public void setPedidoId(Long pedidoId) { this.pedidoId = pedidoId; }

    public String getNomeProduto() { return nomeProduto; }
    public void setNomeProduto(String nomeProduto) { this.nomeProduto = nomeProduto; }

    public BigDecimal getValorProduto() { return valorProduto; }
    public void setValorProduto(BigDecimal valorProduto) { this.valorProduto = valorProduto; }

    public BigDecimal getValorFrete() { return valorFrete; }
    public void setValorFrete(BigDecimal valorFrete) { this.valorFrete = valorFrete; }

    public BigDecimal getValorTotal() { return valorTotal; }
    public void setValorTotal(BigDecimal valorTotal) { this.valorTotal = valorTotal; }

    public String getQrCodeBase64() { return qrCodeBase64; }
    public void setQrCodeBase64(String qrCodeBase64) { this.qrCodeBase64 = qrCodeBase64; }

    public String getPixCopiaCola() { return pixCopiaCola; }
    public void setPixCopiaCola(String pixCopiaCola) { this.pixCopiaCola = pixCopiaCola; }

    public String getPagamentoId() { return pagamentoId; }
    public void setPagamentoId(String pagamentoId) { this.pagamentoId = pagamentoId; }
}
