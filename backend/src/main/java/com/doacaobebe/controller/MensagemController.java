package com.doacaobebe.controller;

import com.doacaobebe.dto.MensagemRequest;
import com.doacaobebe.entity.Mensagem;
import com.doacaobebe.repository.MensagemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/contato")
@CrossOrigin(origins = "http://localhost:3000")
public class MensagemController {
    
    @Autowired
    private MensagemRepository mensagemRepository;
    
    @PostMapping
    public ResponseEntity<?> enviarMensagem(@RequestBody MensagemRequest request) {
        try {
            String conteudoMsg = request.getMensagem();
            if (conteudoMsg == null || conteudoMsg.trim().isEmpty()) {
                conteudoMsg = "Mensagem vazia";
            }
            
            mensagemRepository.inserirMensagem(
                request.getNome() != null ? request.getNome() : "Sem nome",
                request.getEmail() != null ? request.getEmail() : "sem@email.com",
                request.getAssunto() != null ? request.getAssunto() : "Sem assunto",
                conteudoMsg,
                conteudoMsg  // usando a mesma mensagem para conteudo
            );
            
            return ResponseEntity.ok().body("{\"message\": \"Mensagem enviada com sucesso!\"}");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("{\"error\": \"Erro ao enviar mensagem: " + e.getMessage() + "\"}");
        }
    }
}