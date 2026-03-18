package com.doacaobebe.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.time.LocalDate;

@Entity
@Table(name = "Usuario")
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @Column(nullable = false, length = 100)
    private String nome;
    
    @Column(nullable = false, unique = true, length = 100)
    private String email;
    
    @Column(nullable = false, length = 11)
    private String cpf;
    
    @Column(name = "dataNascimento", nullable = true)
    private LocalDate dataNascimento;
    
    @Column(nullable = false, length = 100)
    private String senha;
    
    @Column(name = "nivelAcesso", length = 10)
    private String nivelAcesso = "USER";
    
    @Column(name = "foto")
    private byte[] foto;
    
    @Column(name = "dataCadastro", nullable = false)
    private LocalDateTime dataCadastro = LocalDateTime.now();
    
    @Column(name = "statusUsuario", nullable = false, length = 20)
    private String statusUsuario = "ATIVO";

    @Column(name = "status", nullable = false, length = 20)
    private String status = "ATIVO";

    // Construtores
    public Usuario() {}
    
    public Usuario(String nome, String email, String cpf, String senha) {
        this.nome = nome;
        this.email = email;
        this.cpf = cpf;
        this.senha = senha;
        this.dataCadastro = LocalDateTime.now();
        this.statusUsuario = "ATIVO";
        this.nivelAcesso = "USER";
    }

    // Getters e Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getCpf() { return cpf; }
    public void setCpf(String cpf) { this.cpf = cpf; }
    
    public LocalDate getDataNascimento() { return dataNascimento; }
    public void setDataNascimento(LocalDate dataNascimento) { this.dataNascimento = dataNascimento; }

    public String getSenha() { return senha; }
    public void setSenha(String senha) { this.senha = senha; }
    
    public String getNivelAcesso() { return nivelAcesso; }
    public void setNivelAcesso(String nivelAcesso) { this.nivelAcesso = nivelAcesso; }
    
    public byte[] getFoto() { return foto; }
    public void setFoto(byte[] foto) { this.foto = foto; }
    
    public LocalDateTime getDataCadastro() { return dataCadastro; }
    public void setDataCadastro(LocalDateTime dataCadastro) { this.dataCadastro = dataCadastro; }
    
    public String getStatusUsuario() { return statusUsuario; }
    public void setStatusUsuario(String statusUsuario) { this.statusUsuario = statusUsuario; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public Boolean getIsAdmin() { return "ADMIN".equals(nivelAcesso); }
}