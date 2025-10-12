package com.doacaobebe.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "Anuncio")
public class Anuncio {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false)
    private String categoria;

    @Column(columnDefinition = "TEXT")
    private String descricao;

    @Column(nullable = false)
    private String estado;

    @Column(nullable = false)
    private String contato;

    @Column(nullable = true)
    private String cpf;

    @Column(name = "foto")
    private String foto;

    @Column(nullable = false)
    private String doador;

    @Column(nullable = false)
    private String status = "pendente";

    @Column(name = "data_criacao")
    private LocalDateTime dataCriacao = LocalDateTime.now();

    // Construtores
    public Anuncio() {}

    public Anuncio(String nome, String categoria, String descricao, String estado, String contato, String cpf, String foto, String doador) {
        this.nome = nome;
        this.categoria = categoria;
        this.descricao = descricao;
        this.estado = estado;
        this.contato = contato;
        this.cpf = cpf;
        this.foto = foto;
        this.doador = doador;
    }

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getCategoria() { return categoria; }
    public void setCategoria(String categoria) { this.categoria = categoria; }

    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }

    public String getContato() { return contato; }
    public void setContato(String contato) { this.contato = contato; }

    public String getCpf() { return cpf; }
    public void setCpf(String cpf) { this.cpf = cpf; }

    public String getFoto() { return foto; }
    public void setFoto(String foto) { this.foto = foto; }

    public String getDoador() { return doador; }
    public void setDoador(String doador) { this.doador = doador; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getDataCriacao() { return dataCriacao; }
    public void setDataCriacao(LocalDateTime dataCriacao) { this.dataCriacao = dataCriacao; }
}