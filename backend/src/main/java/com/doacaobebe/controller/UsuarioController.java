package com.doacaobebe.controller;

import com.doacaobebe.dto.AlterarSenhaRequest;
import com.doacaobebe.entity.Usuario;
import com.doacaobebe.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "http://localhost:3000")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @GetMapping
    public ResponseEntity<List<Usuario>> listarTodos() {
        List<Usuario> usuarios = usuarioService.listarTodos();
        return ResponseEntity.ok(usuarios);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> alterarStatus(@PathVariable Long id) {
        try {
            Usuario usuario = usuarioService.alterarStatus(id);
            return ResponseEntity.ok(usuario);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao alterar status: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> remover(@PathVariable Long id) {
        try {
            usuarioService.remover(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao remover usuário: " + e.getMessage());
        }
    }

    @GetMapping("/teste")
    public ResponseEntity<?> teste() {
        List<Usuario> usuarios = usuarioService.listarTodos();
        return ResponseEntity.ok("Total de usuários no banco: " + usuarios.size());
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizarUsuario(@PathVariable Long id, @RequestBody Usuario usuarioAtualizado) {
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
}