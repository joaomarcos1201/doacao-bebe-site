package com.doacaobebe.dto;

public class FreteCalculoRequest {
    private Integer produtoId;
    private String cepDestino;

    public Integer getProdutoId() { return produtoId; }
    public void setProdutoId(Integer produtoId) { this.produtoId = produtoId; }

    public String getCepDestino() { return cepDestino; }
    public void setCepDestino(String cepDestino) { this.cepDestino = cepDestino; }
}
