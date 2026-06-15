package com.doacaobebe.dto;

public class FreteWebhookRequest {
    private String codigoRastreio;
    private String status;

    public String getCodigoRastreio() { return codigoRastreio; }
    public void setCodigoRastreio(String codigoRastreio) { this.codigoRastreio = codigoRastreio; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
