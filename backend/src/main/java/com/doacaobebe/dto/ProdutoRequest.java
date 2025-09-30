package com.doacaobebe.dto;

public class ProdutoRequest {
    private String nome;
    private String categoria;
    private String descricao;
    private String estado;
    private String contato;
    private String imagem;

    // Construtores
    public ProdutoRequest() {}

    public ProdutoRequest(String nome, String categoria, String descricao, String estado, String contato, String imagem) {
        this.nome = nome;
        this.categoria = categoria;
        this.descricao = descricao;
        this.estado = estado;
        this.contato = contato;
        this.imagem = imagem;
    }

    // Getters e Setters
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

    public String getImagem() { return imagem; }
    public void setImagem(String imagem) { this.imagem = imagem; }
}