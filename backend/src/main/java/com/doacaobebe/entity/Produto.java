package com.doacaobebe.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

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

    @Column(length = 100)
    private String categoria;

    @Column(length = 50)
    private String estado;

    @Column(length = 20)
    private String contato;

    @Column(length = 14)
    private String cpf;

    @Column(length = 100)
    private String doador;

    @Lob
    @Column(name = "foto")
    private byte[] foto;

    @Column(name = "dataAnuncio")
    private LocalDateTime dataAnuncio = LocalDateTime.now();

    @Column(nullable = false, length = 20)
    private String statusAnuncio = "EM_ANALISE";

    // Controle de visibilidade (soft delete)
    // Valores válidos: PENDENTE | ONLINE | REMOVIDO
    @Column(nullable = false, length = 20)
    private String statusVisibilidade = "ONLINE";


    // Novos campos marketplace
    @Column(precision = 10, scale = 2)
    private BigDecimal preco;

    @Column(precision = 10, scale = 3)
    private BigDecimal peso;

    @Column(precision = 10, scale = 2)
    private BigDecimal altura;

    @Column(precision = 10, scale = 2)
    private BigDecimal largura;

    @Column(precision = 10, scale = 2)
    private BigDecimal comprimento;

    @Column(length = 100)
    private String marca;

    @Column(length = 50)
    private String conservacao;

    @Column(length = 9)
    private String cepOrigem;

    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vendedor_id")
    private Usuario vendedor;

    public Produto() {}

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

    public String getStatusVisibilidade() { return statusVisibilidade; }
    public void setStatusVisibilidade(String statusVisibilidade) { this.statusVisibilidade = statusVisibilidade; }


    public BigDecimal getPreco() { return preco; }
    public void setPreco(BigDecimal preco) { this.preco = preco; }

    public BigDecimal getPeso() { return peso; }
    public void setPeso(BigDecimal peso) { this.peso = peso; }

    public BigDecimal getAltura() { return altura; }
    public void setAltura(BigDecimal altura) { this.altura = altura; }

    public BigDecimal getLargura() { return largura; }
    public void setLargura(BigDecimal largura) { this.largura = largura; }

    public BigDecimal getComprimento() { return comprimento; }
    public void setComprimento(BigDecimal comprimento) { this.comprimento = comprimento; }

    public String getMarca() { return marca; }
    public void setMarca(String marca) { this.marca = marca; }

    public String getConservacao() { return conservacao; }
    public void setConservacao(String conservacao) { this.conservacao = conservacao; }

    public String getCepOrigem() { return cepOrigem; }
    public void setCepOrigem(String cepOrigem) { this.cepOrigem = cepOrigem; }

    public Usuario getVendedor() { return vendedor; }
    public void setVendedor(Usuario vendedor) { this.vendedor = vendedor; }
}
