package com.doacaobebe.entity;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.math.BigDecimal;

@Entity
@Table(name = "Carteira")
public class Carteira {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false, unique = true)
    private Usuario usuario;

    @Column(precision = 10, scale = 2)
    private BigDecimal saldoRetido = BigDecimal.ZERO;

    @Column(precision = 10, scale = 2)
    private BigDecimal saldoLiberado = BigDecimal.ZERO;

    public Carteira() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }

    public BigDecimal getSaldoRetido() { return saldoRetido; }
    public void setSaldoRetido(BigDecimal saldoRetido) { this.saldoRetido = saldoRetido; }

    public BigDecimal getSaldoLiberado() { return saldoLiberado; }
    public void setSaldoLiberado(BigDecimal saldoLiberado) { this.saldoLiberado = saldoLiberado; }
}
