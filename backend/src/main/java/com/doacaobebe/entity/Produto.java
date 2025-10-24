package com.doacaobebe.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "Anuncio")
public class Produto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nome;

    @Column(nullable = false, length = 400)
    private String descricao;

    @Column(name = "dataAnuncio", nullable = false)
    private LocalDateTime dataAnuncio = LocalDateTime.now();

    @Column(name = "foto")
    private byte[] foto;

    @Column(name = "telefone")
    private String telefone;

    @Column(name = "condicao", nullable = false, length = 100)
    private String condicao;

    @Column(name = "cidade", nullable = false)
    private String cidade = "São Paulo";

    @Column(name = "uf", nullable = false)
    private String uf = "SP";

    @Column(name = "fumante")
    private String fumante;

    @Column(name = "com_pet")
    private String comPet;

    @Column(name = "motivo", nullable = false, length = 100)
    private String motivo = "Doacao";

    @Column(name = "usuario_id", nullable = false)
    private Integer usuarioId = 1;

    @Column(name = "categoria_id", nullable = false)
    private Integer categoriaId = 1;

    @Column(name = "statusAnuncio", nullable = false, length = 20)
    private String statusAnuncio = "INATIVO";

    @Column(name = "categoria")
    private String categoria;

    @Column(name = "contato", nullable = false)
    private String contato;

    @Column(name = "cpf")
    private String cpf;

    @Column(name = "data_criacao")
    private LocalDateTime dataCriacao = LocalDateTime.now();

    @Column(name = "doador")
    private String doador;

    @Column(name = "estado")
    private String estado;

    @Column(name = "status")
    private String status;

    // Construtores
    public Produto() {}

    public Produto(String nome, String descricao, String estado, String contato) {
        this.nome = nome;
        this.descricao = descricao;
        this.estado = estado;
        this.contato = contato;
    }

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }

    public LocalDateTime getDataAnuncio() { return dataAnuncio; }
    public void setDataAnuncio(LocalDateTime dataAnuncio) { this.dataAnuncio = dataAnuncio; }

    public byte[] getFoto() { return foto; }
    public void setFoto(byte[] foto) { this.foto = foto; }

    public String getTelefone() { return telefone; }
    public void setTelefone(String telefone) { this.telefone = telefone; }

    public String getCondicao() { return condicao; }
    public void setCondicao(String condicao) { this.condicao = condicao; }

    public String getCidade() { return cidade; }
    public void setCidade(String cidade) { this.cidade = cidade; }

    public String getUf() { return uf; }
    public void setUf(String uf) { this.uf = uf; }

    public String getFumante() { return fumante; }
    public void setFumante(String fumante) { this.fumante = fumante; }

    public String getComPet() { return comPet; }
    public void setComPet(String comPet) { this.comPet = comPet; }

    public String getMotivo() { return motivo; }
    public void setMotivo(String motivo) { this.motivo = motivo; }

    public Integer getUsuarioId() { return usuarioId; }
    public void setUsuarioId(Integer usuarioId) { this.usuarioId = usuarioId; }

    public Integer getCategoriaId() { return categoriaId; }
    public void setCategoriaId(Integer categoriaId) { this.categoriaId = categoriaId; }

    public String getStatusAnuncio() { return statusAnuncio; }
    public void setStatusAnuncio(String statusAnuncio) { this.statusAnuncio = statusAnuncio; }

    public String getCategoria() { return categoria; }
    public void setCategoria(String categoria) { this.categoria = categoria; }

    public String getContato() { return contato; }
    public void setContato(String contato) { this.contato = contato; }

    public String getCpf() { return cpf; }
    public void setCpf(String cpf) { this.cpf = cpf; }

    public LocalDateTime getDataCriacao() { return dataCriacao; }
    public void setDataCriacao(LocalDateTime dataCriacao) { this.dataCriacao = dataCriacao; }

    public String getDoador() { return doador; }
    public void setDoador(String doador) { this.doador = doador; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}