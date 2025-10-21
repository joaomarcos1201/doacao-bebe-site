package com.doacaobebe.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "Mensagem")
public class Mensagem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "dataMensagem", nullable = false)
    private LocalDateTime dataMensagem;
    
    @Column(name = "emissor", nullable = false, length = 100)
    private String emissor;
    
    @Column(name = "email", nullable = false, length = 100)
    private String email;
    
    @Column(name = "telefone", length = 20)
    private String telefone;
    
    @Column(name = "texto", nullable = false, length = 400)
    private String texto;
    
    @Column(name = "statusMensagem", nullable = false, length = 10)
    private String statusMensagem;
    
    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public LocalDateTime getDataMensagem() { return dataMensagem; }
    public void setDataMensagem(LocalDateTime dataMensagem) { this.dataMensagem = dataMensagem; }
    
    public String getEmissor() { return emissor; }
    public void setEmissor(String emissor) { this.emissor = emissor; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getTelefone() { return telefone; }
    public void setTelefone(String telefone) { this.telefone = telefone; }
    
    public String getTexto() { return texto; }
    public void setTexto(String texto) { this.texto = texto; }
    
    public String getStatusMensagem() { return statusMensagem; }
    public void setStatusMensagem(String statusMensagem) { this.statusMensagem = statusMensagem; }
}