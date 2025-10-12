package com.doacaobebe.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "mensagens")
public class Mensagem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "dataMensagem")
    private LocalDateTime dataMensagem;
    
    @Column(name = "emissor")
    private String emissor;
    
    @Column(name = "email")
    private String email;
    
    @Column(name = "telefone")
    private String telefone;
    
    @Column(name = "texto")
    private String texto;
    
    @Column(name = "statusMensagem")
    private String statusMensagem;
    
    @Column(name = "conteudo")
    private String conteudo;
    
    @Column(name = "chat_id")
    private Long chatId;
    
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
    
    public String getConteudo() { return conteudo; }
    public void setConteudo(String conteudo) { this.conteudo = conteudo; }
    
    public Long getChatId() { return chatId; }
    public void setChatId(Long chatId) { this.chatId = chatId; }
}