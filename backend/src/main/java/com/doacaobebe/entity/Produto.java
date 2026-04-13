package com.doacaobebe.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "Anuncio")
public class Produto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 100)
    private String nome;

    @Column(nullable = false, length = 400)
    private String descricao;

    @Column(nullable = false, length = 100)
    private String categoria;

    @Column(nullable = false, length = 50)
    private String estado;

    @Column(nullable = false, length = 20)
    private String contato;

    @Column(nullable = false, length = 14)
    private String cpf;

    @Column(nullable = false, length = 100)
    private String doador;

    @Lob
    @Column(name = "foto")
    private byte[] foto;

    @Column(name = "dataAnuncio")
    private LocalDateTime dataAnuncio = LocalDateTime.now();

    @Column(nullable = false, length = 20)
    private String statusAnuncio = "INATIVO";

    // CONSTRUTOR
    public Produto() {}

    // GETTERS E SETTERS

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }

    public String getCategoria() { return categoria; }
    public void setCategoria(String categoria) { this.categoria = categoria; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }

    public String getContato() { return contato; }
    public void setContato(String contato) { this.contato = contato; }

    public String getCpf() { return cpf; }
    public void setCpf(String cpf) { this.cpf = cpf; }

    public String getDoador() { return doador; }
    public void setDoador(String doador) { this.doador = doador; }

    public byte[] getFoto() { return foto; }
    public void setFoto(byte[] foto) { this.foto = foto; }

    public LocalDateTime getDataAnuncio() { return dataAnuncio; }
    public void setDataAnuncio(LocalDateTime dataAnuncio) { this.dataAnuncio = dataAnuncio; }

    public String getStatusAnuncio() { return statusAnuncio; }
    public void setStatusAnuncio(String statusAnuncio) { this.statusAnuncio = statusAnuncio; }
}