package com.doacaobebe.dto;

public class AlterarSenhaRequest {
    private Long id;
    private String senhaAtual;
    private String novaSenha;

    public AlterarSenhaRequest() {}

    public AlterarSenhaRequest(Long id, String senhaAtual, String novaSenha) {
        this.id = id;
        this.senhaAtual = senhaAtual;
        this.novaSenha = novaSenha;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getSenhaAtual() { return senhaAtual; }
    public void setSenhaAtual(String senhaAtual) { this.senhaAtual = senhaAtual; }
    
    public String getNovaSenha() { return novaSenha; }
    public void setNovaSenha(String novaSenha) { this.novaSenha = novaSenha; }
}