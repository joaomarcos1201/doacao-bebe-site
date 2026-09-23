package com.doacaobebe.controller;

import com.doacaobebe.dto.AdminRequest;
import com.doacaobebe.dto.AlterarSenhaRequest;
import com.doacaobebe.entity.Usuario;
import com.doacaobebe.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import org.springframework.web.server.ResponseStatusException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioController {
    private static final Logger log = LoggerFactory.getLogger(UsuarioController.class);

    @Autowired
    private UsuarioService usuarioService;

    @GetMapping
    public ResponseEntity<List<Usuario>> listarTodos() {
        List<Usuario> usuarios = usuarioService.listarTodos();
        return ResponseEntity.ok(usuarios);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> alterarStatus(@PathVariable Integer id,
            @RequestHeader(value = "Authorization", required = false) String authorization) {
        try {
            Usuario usuario = usuarioService.alterarStatus(id, authorization);
            return ResponseEntity.ok(usuario);
        } catch (ResponseStatusException e) {
            return ResponseEntity.status(e.getStatusCode()).body(Map.of("message", e.getReason()));
        } catch (Exception e) {
            log.error("Falha ao alterar status do usuário {}", id, e);
            return ResponseEntity.internalServerError().body(Map.of("message", "Não foi possível alterar o status. Tente novamente."));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> remover(@PathVariable Integer id,
            @RequestHeader(value = "Authorization", required = false) String authorization) {
        try {
            usuarioService.remover(id, authorization);
            return ResponseEntity.ok(Map.of("message", "Conta desativada. Pedidos, pagamentos e saldo foram preservados."));
        } catch (ResponseStatusException e) {
            return ResponseEntity.status(e.getStatusCode()).body(Map.of("message", e.getReason()));
        } catch (Exception e) {
            log.error("Falha ao desativar usuário {}", id, e);
            return ResponseEntity.internalServerError().body(Map.of("message", "Não foi possível desativar a conta. Tente novamente."));
        }
    }

    @GetMapping("/teste")
    public ResponseEntity<?> teste() {
        List<Usuario> usuarios = usuarioService.listarTodos();
        return ResponseEntity.ok("Total de usuários no banco: " + usuarios.size());
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizarUsuario(@PathVariable Integer id, @RequestBody Usuario usuarioAtualizado) {
        try {
            Usuario usuario = usuarioService.atualizarDados(id, usuarioAtualizado);
            return ResponseEntity.ok(usuario);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao atualizar usuário: " + e.getMessage());
        }
    }

    @PutMapping("/alterar-senha")
    public ResponseEntity<?> alterarSenha(@RequestBody AlterarSenhaRequest request) {
        try {
            usuarioService.alterarSenha(request.getId(), request.getSenhaAtual(), request.getNovaSenha());
            return ResponseEntity.ok("Senha alterada com sucesso");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao alterar senha: " + e.getMessage());
        }
    }

    @PutMapping("/{id}/admin")
    public ResponseEntity<?> alterarPrivilegiosAdmin(@PathVariable Integer id, @RequestBody AdminRequest request,
            @RequestHeader(value = "Authorization", required = false) String authorization) {
        try {
            Usuario administrador = usuarioService.exigirAdministrador(authorization);
            if (administrador.getId().equals(id)) {
                return ResponseEntity.status(403).body(Map.of("message", "Você não pode alterar os próprios privilégios."));
            }
            Usuario usuario = usuarioService.alterarPrivilegiosAdmin(id, request.getIsAdmin());
            return ResponseEntity.ok(usuario);
        } catch (ResponseStatusException e) {
            return ResponseEntity.status(e.getStatusCode()).body(Map.of("message", e.getReason()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao alterar privilégios: " + e.getMessage());
        }
    }
}
