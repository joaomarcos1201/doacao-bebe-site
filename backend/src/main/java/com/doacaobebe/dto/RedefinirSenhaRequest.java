package com.doacaobebe.dto;

public class RedefinirSenhaRequest {
    private String email;
    private String novaSenha;

    public RedefinirSenhaRequest() {}

    public RedefinirSenhaRequest(String email, String novaSenha) {
        this.email = email;
        this.novaSenha = novaSenha;
    }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getNovaSenha() { return novaSenha; }
    public void setNovaSenha(String novaSenha) { this.novaSenha = novaSenha; }
}