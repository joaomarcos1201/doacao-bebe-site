package com.doacaobebe.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "Favorito", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"usuario_id", "produto_id"})
})
public class Favorito {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "produto_id", nullable = false)
    private Produto produto;

    public Favorito() {}

    public Favorito(Usuario usuario, Produto produto) {
        this.usuario = usuario;
        this.produto = produto;
    }

    public Integer getId() { return id; }
    public Usuario getUsuario() { return usuario; }
    public Produto getProduto() { return produto; }
}
