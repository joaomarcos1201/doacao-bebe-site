package com.doacaobebe.service;

import com.doacaobebe.dto.AuthResponse;
import com.doacaobebe.dto.CadastroRequest;
import com.doacaobebe.dto.LoginRequest;
import com.doacaobebe.entity.Usuario;
import com.doacaobebe.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    public AuthResponse login(LoginRequest loginRequest) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(loginRequest.getEmail());
        
        if (usuarioOpt.isPresent()) {
            Usuario usuario = usuarioOpt.get();
            if (passwordEncoder.matches(loginRequest.getSenha(), usuario.getSenha())) {
                String token = jwtService.generateToken(usuario.getEmail());
                return new AuthResponse(token, usuario.getId(), usuario.getNome(), 
                                      usuario.getEmail(), usuario.getIsAdmin());
            }
        }
        throw new RuntimeException("Credenciais inválidas");
    }

    public AuthResponse cadastrar(CadastroRequest cadastroRequest) {
        if (usuarioRepository.existsByEmail(cadastroRequest.getEmail())) {
            throw new RuntimeException("Email já cadastrado");
        }

        Usuario usuario = new Usuario();
        usuario.setNome(cadastroRequest.getNome());
        usuario.setEmail(cadastroRequest.getEmail());
        usuario.setSenha(passwordEncoder.encode(cadastroRequest.getSenha()));
        
        usuario = usuarioRepository.save(usuario);
        
        String token = jwtService.generateToken(usuario.getEmail());
        return new AuthResponse(token, usuario.getId(), usuario.getNome(), 
                              usuario.getEmail(), usuario.getIsAdmin());
    }

    public List<Usuario> listarTodos() {
        return usuarioRepository.findAll();
    }

    public Usuario alterarStatus(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        
        usuario.setStatus(usuario.getStatus().equals("ativo") ? "inativo" : "ativo");
        return usuarioRepository.save(usuario);
    }

    public void remover(Long id) {
        usuarioRepository.deleteById(id);
    }

    public void redefinirSenha(String email, String novaSenha) {
        System.out.println("DEBUG: Redefinindo senha para email: " + email);
        Usuario usuario = usuarioRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        
        System.out.println("DEBUG: Usuário encontrado: " + usuario.getNome());
        String senhaEncriptada = passwordEncoder.encode(novaSenha);
        System.out.println("DEBUG: Nova senha encriptada: " + senhaEncriptada.substring(0, 10) + "...");
        
        usuario.setSenha(senhaEncriptada);
        usuarioRepository.save(usuario);
        System.out.println("DEBUG: Senha salva no banco com sucesso");
    }

    public Usuario atualizarDados(Long id, Usuario usuarioAtualizado) {
        Usuario usuario = usuarioRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        
        usuario.setNome(usuarioAtualizado.getNome());
        usuario.setEmail(usuarioAtualizado.getEmail());
        
        return usuarioRepository.save(usuario);
    }

    public void alterarSenha(Long id, String senhaAtual, String novaSenha) {
        Usuario usuario = usuarioRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        
        if (!passwordEncoder.matches(senhaAtual, usuario.getSenha())) {
            throw new RuntimeException("Senha atual incorreta");
        }
        
        usuario.setSenha(passwordEncoder.encode(novaSenha));
        usuarioRepository.save(usuario);
    }
}