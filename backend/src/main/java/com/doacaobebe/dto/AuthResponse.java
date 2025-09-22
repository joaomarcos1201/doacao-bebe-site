package com.doacaobebe.dto;

public class AuthResponse {
    private String token;
    private String tipo = "Bearer";
    private Long id;
    private String nome;
    private String email;
    private Boolean isAdmin;

    public AuthResponse(String token, Long id, String nome, String email, Boolean isAdmin) {
        this.token = token;
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.isAdmin = isAdmin;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    
    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }
    
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public Boolean getIsAdmin() { return isAdmin; }
    public void setIsAdmin(Boolean isAdmin) { this.isAdmin = isAdmin; }
}