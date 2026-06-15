package com.doacaobebe.dto;

import java.math.BigDecimal;

public class NovoProdutoRequest {
    private String nome;
    private String descricao;
    private String categoria;
    private String marca;
    private String conservacao;
    private BigDecimal preco;
    private BigDecimal peso;
    private BigDecimal altura;
    private BigDecimal largura;
    private BigDecimal comprimento;
    private String cepOrigem;

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }

    public String getCategoria() { return categoria; }
    public void setCategoria(String categoria) { this.categoria = categoria; }

    public String getMarca() { return marca; }
    public void setMarca(String marca) { this.marca = marca; }

    public String getConservacao() { return conservacao; }
    public void setConservacao(String conservacao) { this.conservacao = conservacao; }

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

    public String getCepOrigem() { return cepOrigem; }
    public void setCepOrigem(String cepOrigem) { this.cepOrigem = cepOrigem; }
}
