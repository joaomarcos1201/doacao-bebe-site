package com.doacaobebe.controller;

import com.doacaobebe.dto.MensagemRequest;
import com.doacaobebe.entity.Mensagem;
import com.doacaobebe.repository.MensagemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/contato")
@CrossOrigin(origins = "http://localhost:3000")
public class MensagemController {
    
    @Autowired
    private MensagemRepository mensagemRepository;
    
    @PostMapping
    public ResponseEntity<?> enviarMensagem(@RequestBody MensagemRequest request) {
        try {
            String mensagemTexto = request.getMensagem();
            if (mensagemTexto == null || mensagemTexto.trim().isEmpty()) {
                mensagemTexto = "Mensagem vazia";
            }

            Mensagem msg = new Mensagem();
            msg.setDataMensagem(LocalDateTime.now());
            msg.setEmissor(request.getNome() != null ? request.getNome() : "Sem nome");
            msg.setEmail(request.getEmail() != null ? request.getEmail() : "sem@email.com");
            msg.setTelefone(request.getTelefone() != null ? request.getTelefone() : "Não informado");
            msg.setTexto(mensagemTexto);
            msg.setStatusMensagem("ATIVO");
            msg.setConteudo(mensagemTexto);
            msg.setChatId(1L);

            mensagemRepository.save(msg);
            
            return ResponseEntity.ok().body("{\"message\": \"Mensagem enviada com sucesso!\"}");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("{\"error\": \"Erro ao enviar mensagem: " + e.getMessage() + "\"}");
        }
    }
}