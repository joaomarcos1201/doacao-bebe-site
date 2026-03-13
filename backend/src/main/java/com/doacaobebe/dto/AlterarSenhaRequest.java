package com.doacaobebe.dto;

public class AlterarSenhaRequest {
    private Integer id;
    private String senhaAtual;
    private String novaSenha;

    public AlterarSenhaRequest() {}

    public AlterarSenhaRequest(Integer id, String senhaAtual, String novaSenha) {
        this.id = id;
        this.senhaAtual = senhaAtual;
        this.novaSenha = novaSenha;
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    
    public String getSenhaAtual() { return senhaAtual; }
    public void setSenhaAtual(String senhaAtual) { this.senhaAtual = senhaAtual; }
    
    public String getNovaSenha() { return novaSenha; }
    public void setNovaSenha(String novaSenha) { this.novaSenha = novaSenha; }
}