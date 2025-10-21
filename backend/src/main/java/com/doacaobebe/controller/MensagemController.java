package com.doacaobebe.controller;

import com.doacaobebe.dto.MensagemRequest;
import com.doacaobebe.entity.Mensagem;
import com.doacaobebe.repository.MensagemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/contato")
@CrossOrigin(origins = "http://localhost:3000")
public class MensagemController {
    
    @Autowired
    private MensagemRepository mensagemRepository;
    
    @GetMapping
    public ResponseEntity<List<Mensagem>> listarMensagens() {
        try {
            List<Mensagem> mensagens = mensagemRepository.findByStatusMensagemOrderByDataMensagemDesc("ATIVO");
            return ResponseEntity.ok(mensagens);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PostMapping
    public ResponseEntity<?> enviarMensagem(@RequestBody MensagemRequest request) {
        try {
            if (request.getMensagem() == null || request.getMensagem().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("{\"error\": \"Mensagem não pode estar vazia\"}");
            }
            if (request.getNome() == null || request.getNome().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("{\"error\": \"Nome é obrigatório\"}");
            }
            if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("{\"error\": \"Email é obrigatório\"}");
            }

            Mensagem msg = new Mensagem();
            msg.setDataMensagem(LocalDateTime.now());
            msg.setEmissor(request.getNome());
            msg.setEmail(request.getEmail());
            msg.setTelefone(request.getTelefone());
            msg.setTexto(request.getMensagem());
            msg.setStatusMensagem("ATIVO");

            mensagemRepository.save(msg);
            
            return ResponseEntity.ok().body("{\"message\": \"Mensagem enviada com sucesso!\"}");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("{\"error\": \"Erro ao enviar mensagem: " + e.getMessage() + "\"}");
        }
    }
    

}