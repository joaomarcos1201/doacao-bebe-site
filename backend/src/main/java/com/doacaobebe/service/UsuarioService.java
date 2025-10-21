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
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    // Cache temporário para códigos de recuperação (em produção, usar Redis)
    private final Map<String, CodigoRecuperacao> codigosRecuperacao = new ConcurrentHashMap<>();

    private static class CodigoRecuperacao {
        String codigo;
        LocalDateTime expiracao;
        
        CodigoRecuperacao(String codigo) {
            this.codigo = codigo;
            this.expiracao = LocalDateTime.now().plus(10, ChronoUnit.MINUTES);
        }
        
        boolean isValido() {
            return LocalDateTime.now().isBefore(expiracao);
        }
    }

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
        usuario.setCpf(cadastroRequest.getCpf());
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
        
        String statusAtual = usuario.getStatusUsuario();
        if (statusAtual == null || statusAtual.equals("ATIVO")) {
            usuario.setStatusUsuario("INATIVO");
        } else {
            usuario.setStatusUsuario("ATIVO");
        }
        return usuarioRepository.save(usuario);
    }

    public void remover(Long id) {
        try {
            if (!usuarioRepository.existsById(id)) {
                throw new RuntimeException("Usuário não encontrado");
            }
            usuarioRepository.deleteUsuarioById(id);
        } catch (Exception e) {
            System.err.println("Erro ao remover usuário: " + e.getMessage());
            throw new RuntimeException("Erro ao remover usuário: " + e.getMessage());
        }
    }

    public void redefinirSenha(String email, String novaSenha) {
        System.out.println("DEBUG: Redefinindo senha para usuário");
        Usuario usuario = usuarioRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        
        System.out.println("DEBUG: Usuário encontrado");
        String senhaEncriptada = passwordEncoder.encode(novaSenha);
        
        usuario.setSenha(senhaEncriptada);
        usuarioRepository.save(usuario);
        System.out.println("DEBUG: Senha atualizada com sucesso");
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

    public Usuario alterarPrivilegiosAdmin(Long id, Boolean isAdmin) {
        System.out.println("DEBUG: Alterando privilégios de usuário");
        
        Usuario usuario = usuarioRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        
        System.out.println("DEBUG: Usuário encontrado, atualizando privilégios");
        
        usuario.setNivelAcesso(isAdmin ? "ADMIN" : "USER");
        Usuario usuarioSalvo = usuarioRepository.save(usuario);
        
        System.out.println("DEBUG: Privilégios atualizados com sucesso");
        
        return usuarioSalvo;
    }

    public boolean emailExiste(String email) {
        return usuarioRepository.findByEmail(email).isPresent();
    }

    public void salvarCodigoRecuperacao(String email, String codigo) {
        codigosRecuperacao.put(email, new CodigoRecuperacao(codigo));
    }

    public boolean verificarCodigoRecuperacao(String email, String codigo) {
        CodigoRecuperacao codigoSalvo = codigosRecuperacao.get(email);
        if (codigoSalvo != null && codigoSalvo.isValido() && codigoSalvo.codigo.equals(codigo)) {
            codigosRecuperacao.remove(email); // Remove após uso
            return true;
        }
        return false;
    }

    public AuthResponse getUserByEmail(String email) {
        Usuario usuario = usuarioRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        
        System.out.println("DEBUG - Usuario encontrado: " + usuario.getNome());
        System.out.println("DEBUG - NivelAcesso: " + usuario.getNivelAcesso());
        System.out.println("DEBUG - IsAdmin: " + usuario.getIsAdmin());
        
        String token = jwtService.generateToken(usuario.getEmail());
        AuthResponse response = new AuthResponse(token, usuario.getId(), usuario.getNome(), 
                              usuario.getEmail(), usuario.getIsAdmin());
        
        System.out.println("DEBUG - AuthResponse isAdmin: " + response.getIsAdmin());
        return response;
    }

    public void criarUsuarioAdmin() {
        String email = "admin@alemdopositivo.com";
        if (!usuarioRepository.existsByEmail(email)) {
            Usuario admin = new Usuario();
            admin.setNome("Administrador");
            admin.setEmail(email);
            admin.setCpf("00000000000");
            admin.setSenha(passwordEncoder.encode("admin123"));
            admin.setNivelAcesso("ADMIN");
            admin.setStatusUsuario("ATIVO");
            usuarioRepository.save(admin);
            System.out.println("Usuário admin criado com sucesso!");
        } else {
            // Atualizar usuário existente para garantir que tenha CPF
            Usuario admin = usuarioRepository.findByEmail(email).orElse(null);
            if (admin != null && admin.getCpf() == null) {
                admin.setCpf("00000000000");
                usuarioRepository.save(admin);
                System.out.println("CPF do admin atualizado!");
            }
            System.out.println("Usuário admin já existe!");
        }
    }
}