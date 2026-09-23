package com.doacaobebe.service;

import com.doacaobebe.dto.AuthResponse;
import com.doacaobebe.dto.CadastroRequest;
import com.doacaobebe.dto.LoginRequest;
import com.doacaobebe.entity.Usuario;
import com.doacaobebe.entity.Carteira;
import com.doacaobebe.entity.Pedido;
import com.doacaobebe.entity.Pagamento;
import com.doacaobebe.entity.Saque;
import com.doacaobebe.entity.MovimentacaoFinanceira;
import jakarta.persistence.LockModeType;
import java.util.Set;
import java.util.Locale;
import com.doacaobebe.repository.UsuarioRepository;
import com.doacaobebe.repository.ProdutoRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.transaction.annotation.Transactional;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ProdutoRepository produtoRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;
    
    @Autowired
    private JdbcTemplate jdbcTemplate;
    
    @PersistenceContext
    private EntityManager entityManager;

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
            
            // Limpar cache do JPA e buscar status atualizado diretamente do banco
            String statusAtualizado = jdbcTemplate.queryForObject(
                "SELECT statusUsuario FROM Usuario WHERE email = ?", 
                String.class, 
                loginRequest.getEmail()
            );
            
            System.out.println("=== DEBUG LOGIN ===");
            System.out.println("Usuario: " + usuario.getNome());
            System.out.println("Email: " + usuario.getEmail());
            System.out.println("Status do banco: [" + statusAtualizado + "]");
            
            // Verificar se o usuário está inativo (case-insensitive e trim)
            String statusLimpo = statusAtualizado != null ? statusAtualizado.trim().toUpperCase() : "";
            System.out.println("Status limpo: [" + statusLimpo + "]");
            
            if (!"ATIVO".equals(statusLimpo)) {
                System.out.println("*** BLOQUEANDO LOGIN - USUARIO INATIVO ***");
                throw new RuntimeException("Conta inativa. Entre em contato com o administrador.");
            }
            
            System.out.println("Status OK, continuando login...");
            
            if (passwordEncoder.matches(loginRequest.getSenha(), usuario.getSenha())) {
                System.out.println("Senha correta, gerando token...");
                String token = jwtService.generateToken(usuario.getEmail());
                return new AuthResponse(token, usuario.getId(), usuario.getNome(), 
                                      usuario.getEmail(), usuario.getIsAdmin());
            } else {
                System.out.println("Senha incorreta!");
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

    // Remove máscara do CPF (000.000.000-00 → 00000000000)
    usuario.setCpf(cadastroRequest.getCpf().replaceAll("\\D", ""));

    usuario.setSenha(passwordEncoder.encode(cadastroRequest.getSenha()));

    //  CAMPOS OBRIGATÓRIOS DO BANCO
    usuario.setNivelAcesso("USER");
    usuario.setStatusUsuario("ATIVO");
    usuario.setDataCadastro(java.time.LocalDateTime.now());

    //  obrigatório no banco (ajuste temporário)
    usuario.setDataNascimento(java.time.LocalDate.of(2000, 1, 1));

    usuario = usuarioRepository.save(usuario);

    String token = jwtService.generateToken(usuario.getEmail());

    return new AuthResponse(
        token,
        usuario.getId(),
        usuario.getNome(),
        usuario.getEmail(),
        usuario.getIsAdmin()
    );
}
    public List<Usuario> listarTodos() {
        return usuarioRepository.findAll();
    }

    public Usuario exigirAdministrador(String authorization) {
        if (authorization == null || !authorization.startsWith("Bearer ")) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Autenticação obrigatória.");
        }
        final String email;
        try {
            email = jwtService.extractEmail(authorization.substring(7));
            if (email == null || email.isBlank()) throw new IllegalArgumentException();
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Sessão inválida ou expirada.");
        }
        Usuario administrador = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Sessão inválida."));
        if (!Boolean.TRUE.equals(administrador.getIsAdmin()) || !contaAtiva(administrador)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Apenas administradores ativos podem realizar esta operação.");
        }
        return administrador;
    }

    private boolean contaAtiva(Usuario usuario) {
        return "ATIVO".equalsIgnoreCase(usuario.getStatusUsuario() == null ? "" : usuario.getStatusUsuario().trim());
    }

    private Usuario buscarParaDesativacao(Integer id, Usuario administrador) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado."));
        if (usuario.getId().equals(administrador.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Você não pode desativar a própria conta.");
        }
        if (Boolean.TRUE.equals(usuario.getIsAdmin())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Não é permitido desativar outro administrador.");
        }
        return usuario;
    }

    @Transactional
    public Usuario alterarStatus(Integer id, String authorization) {
        Usuario usuario = buscarParaDesativacao(id, exigirAdministrador(authorization));
        if (contaAtiva(usuario)) {
            desativar(usuario);
        } else {
            usuario.setStatusUsuario("ATIVO");
            usuarioRepository.save(usuario);
            // Reativar a conta não republica automaticamente os anúncios retirados.
        }
        return usuario;
    }

    @Transactional
    public void remover(Integer id, String authorization) {
        Usuario administrador = exigirAdministrador(authorization);
        Usuario usuario = usuarioRepository.buscarParaExclusao(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado."));
        if (usuario.getId().equals(administrador.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Você não pode excluir a própria conta.");
        }
        if (Boolean.TRUE.equals(usuario.getIsAdmin())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Não é permitido excluir outro administrador.");
        }

        validarPendenciasFinanceiras(id);

        // Favoritos da conta e dos anúncios que serão retirados não são histórico financeiro.
        executarExclusao("DELETE FROM Favorito f WHERE f.usuario.id = :id OR f.produto.id IN " +
                "(SELECT p.id FROM Produto p WHERE p.vendedor.id = :id)", id);
        executarExclusao("DELETE FROM Carteira c WHERE c.usuario.id = :id", id);

        // NULL substitui somente o vínculo pessoal, nunca o registro histórico.
        executarExclusao("UPDATE Saque s SET s.usuario = NULL WHERE s.usuario.id = :id", id);
        executarExclusao("UPDATE MovimentacaoFinanceira m SET m.usuario = NULL WHERE m.usuario.id = :id", id);
        executarExclusao("UPDATE Pedido p SET p.comprador = NULL WHERE p.comprador.id = :id", id);
        executarExclusao("UPDATE Pedido p SET p.vendedor = NULL WHERE p.vendedor.id = :id", id);

        // Anúncios usados por qualquer pedido continuam existindo como parte do histórico.
        executarExclusao("DELETE FROM Produto p WHERE p.vendedor.id = :id AND NOT EXISTS " +
                "(SELECT pedido.id FROM Pedido pedido WHERE pedido.produto.id = p.id)", id);
        executarExclusao("UPDATE Produto p SET p.vendedor = NULL, p.statusVisibilidade = 'REMOVIDO', " +
                "p.doador = NULL, p.contato = NULL, p.cpf = NULL WHERE p.vendedor.id = :id", id);

        // Bulk JPQL não sincroniza entidades já carregadas no contexto.
        entityManager.flush();
        entityManager.clear();
        usuario = usuarioRepository.findById(id).orElseThrow();
        usuarioRepository.delete(usuario);
        usuarioRepository.flush(); // A violação de FK deve ocorrer antes de responder sucesso.
    }

    private void executarExclusao(String jpql, Integer id) {
        entityManager.createQuery(jpql).setParameter("id", id).executeUpdate();
    }

    private <T> List<T> dependenciasBloqueadas(String jpql, Class<T> tipo, Integer id) {
        return entityManager.createQuery(jpql, tipo).setParameter("id", id)
                .setLockMode(LockModeType.PESSIMISTIC_WRITE).getResultList();
    }

    private String normalizarStatus(String status) {
        return status == null ? "" : status.trim().toUpperCase(Locale.ROOT);
    }

    private void validarPendenciasFinanceiras(Integer id) {
        for (Carteira carteira : dependenciasBloqueadas("FROM Carteira c WHERE c.usuario.id = :id", Carteira.class, id)) {
            if (carteira.getSaldoRetido() == null || carteira.getSaldoLiberado() == null ||
                    carteira.getSaldoRetido().signum() != 0 || carteira.getSaldoLiberado().signum() != 0) {
                throw new ResponseStatusException(HttpStatus.CONFLICT,
                        "A conta possui saldo na carteira. Regularize os valores antes de excluir o usuário.");
            }
        }
        for (Saque saque : dependenciasBloqueadas("FROM Saque s WHERE s.usuario.id = :id", Saque.class, id)) {
            if (!Set.of("APROVADO", "REJEITADO").contains(normalizarStatus(saque.getStatus()))) {
                throw new ResponseStatusException(HttpStatus.CONFLICT,
                        "A conta possui saque pendente. Resolva o saque antes de excluir o usuário.");
            }
        }
        for (MovimentacaoFinanceira mov : dependenciasBloqueadas(
                "FROM MovimentacaoFinanceira m WHERE m.usuario.id = :id", MovimentacaoFinanceira.class, id)) {
            if ("RETIDO".equals(normalizarStatus(mov.getStatus()))) {
                throw new ResponseStatusException(HttpStatus.CONFLICT,
                        "A conta possui movimentação financeira retida. Regularize a operação antes da exclusão.");
            }
        }
        for (Pedido pedido : dependenciasBloqueadas(
                "FROM Pedido p WHERE p.comprador.id = :id OR p.vendedor.id = :id OR p.produto.vendedor.id = :id", Pedido.class, id)) {
            String status = normalizarStatus(pedido.getStatusPagamento());
            String envio = normalizarStatus(pedido.getStatusEnvio());
            if (!Set.of("LIBERADO", "REJEITADO", "CANCELADO", "ESTORNADO", "REJECTED", "CANCELLED", "CANCELED", "REFUNDED").contains(status) ||
                    (!envio.isEmpty() && !Set.of("ENTREGUE", "CANCELADO", "DEVOLVIDO").contains(envio))) {
                throw new ResponseStatusException(HttpStatus.CONFLICT,
                        "A conta participa do pedido #" + pedido.getId() + " ainda não encerrado. Conclua ou regularize a operação antes da exclusão.");
            }
            List<Pagamento> pagamentos = entityManager.createQuery("FROM Pagamento p WHERE p.pedido.id = :pedido", Pagamento.class)
                    .setParameter("pedido", pedido.getId()).setLockMode(LockModeType.PESSIMISTIC_WRITE).getResultList();
            for (Pagamento pagamento : pagamentos) {
                String situacao = normalizarStatus(pagamento.getStatus());
                boolean liquidado = "LIBERADO".equals(status) && "APROVADO".equals(situacao);
                if (!liquidado && !Set.of("REJEITADO", "CANCELADO", "ESTORNADO", "REJECTED", "CANCELLED", "CANCELED", "REFUNDED").contains(situacao)) {
                    throw new ResponseStatusException(HttpStatus.CONFLICT,
                            "O pedido #" + pedido.getId() + " possui pagamento sem conciliação. Regularize o pagamento antes da exclusão.");
                }
            }
        }
    }

    private void desativar(Usuario usuario) {
        usuario.setStatusUsuario("INATIVO");
        usuarioRepository.saveAndFlush(usuario);
        produtoRepository.ocultarAnunciosDoUsuario(usuario.getId());
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

    @Transactional
    public Usuario atualizarMeuNome(String emailAutenticado, String nome) {
        String nomeLimpo = nome == null ? "" : nome.strip();
        if (nomeLimpo.isBlank() || nomeLimpo.length() > 100) {
            throw new org.springframework.web.server.ResponseStatusException(
                    org.springframework.http.HttpStatus.BAD_REQUEST, "Informe um nome de 1 a 100 caracteres.");
        }
        Usuario usuario = usuarioRepository.findByEmail(emailAutenticado)
                .orElseThrow(() -> new org.springframework.web.server.ResponseStatusException(
                        org.springframework.http.HttpStatus.UNAUTHORIZED, "Usuário não encontrado."));
        if (!"ATIVO".equalsIgnoreCase(usuario.getStatusUsuario() == null ? "" : usuario.getStatusUsuario().trim())) {
            throw new org.springframework.web.server.ResponseStatusException(
                    org.springframework.http.HttpStatus.FORBIDDEN, "Conta inativa.");
        }
        usuario.setNome(nomeLimpo);
        return usuarioRepository.save(usuario);
    }
    public Usuario atualizarDados(Integer id, Usuario usuarioAtualizado) {
        Usuario usuario = usuarioRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        
        usuario.setNome(usuarioAtualizado.getNome());
        usuario.setEmail(usuarioAtualizado.getEmail());
        
        return usuarioRepository.save(usuario);
    }

    public void alterarSenha(Integer id, String senhaAtual, String novaSenha) {
        Usuario usuario = usuarioRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        
        if (!passwordEncoder.matches(senhaAtual, usuario.getSenha())) {
            throw new RuntimeException("Senha atual incorreta");
        }
        
        usuario.setSenha(passwordEncoder.encode(novaSenha));
        usuarioRepository.save(usuario);
    }

    public Usuario alterarPrivilegiosAdmin(Integer id, Boolean isAdmin) {
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
        
        // Verificar status diretamente do banco
        String statusAtualizado = jdbcTemplate.queryForObject(
            "SELECT statusUsuario FROM Usuario WHERE email = ?", 
            String.class, 
            email
        );
        
        System.out.println("DEBUG - Usuario encontrado: " + usuario.getNome());
        System.out.println("DEBUG - Status do banco: [" + statusAtualizado + "]");
        
        // Bloquear se inativo (case-insensitive e trim)
        String statusLimpo = statusAtualizado != null ? statusAtualizado.trim().toUpperCase() : "";
        System.out.println("DEBUG - Status limpo: [" + statusLimpo + "]");
        
        if (!"ATIVO".equals(statusLimpo)) {
            System.out.println("*** BLOQUEANDO ACESSO - USUARIO INATIVO ***");
            throw new RuntimeException("Conta inativa. Entre em contato com o administrador.");
        }
        
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
    
    public String checkUserStatus(String email) {
        Usuario usuario = usuarioRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        
        return "Usuario: " + usuario.getNome() + 
               ", Email: " + usuario.getEmail() + 
               ", Status: [" + usuario.getStatusUsuario() + "]" +
               ", ID: " + usuario.getId();
    }
    
    public String debugUserStatus(String email) {
        // Buscar via JPA
        Usuario usuario = usuarioRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        
        // Buscar diretamente do banco via JDBC
        String statusBanco = jdbcTemplate.queryForObject(
            "SELECT statusUsuario FROM Usuario WHERE email = ?", 
            String.class, 
            email
        );
        
        return "=== DEBUG STATUS ===\n" +
               "Via JPA - Status: [" + usuario.getStatusUsuario() + "]\n" +
               "Via JDBC - Status: [" + statusBanco + "]\n" +
               "Usuario: " + usuario.getNome() + "\n" +
               "ID: " + usuario.getId();
    }
    
    @Transactional
    public String forceInactiveStatus(String email) {
        // Forçar status INATIVO para debug
        int rowsAffected = jdbcTemplate.update(
            "UPDATE Usuario SET statusUsuario = 'INATIVO' WHERE email = ?", 
            email
        );
        
        // Limpar cache
        entityManager.clear();
        
        // Verificar resultado
        String statusFinal = jdbcTemplate.queryForObject(
            "SELECT statusUsuario FROM Usuario WHERE email = ?", 
            String.class, 
            email
        );
        
        return "Forçado INATIVO - Linhas afetadas: " + rowsAffected + 
               ", Status final: [" + statusFinal + "]";
    }
    
    @Transactional
    public String simpleToggleStatus(Integer id) {
        // Método simples usando apenas JDBC
        String statusAtual = jdbcTemplate.queryForObject(
            "SELECT statusUsuario FROM Usuario WHERE id = ?", 
            String.class, 
            id
        );
        
        String novoStatus = "ATIVO".equals(statusAtual.trim()) ? "INATIVO" : "ATIVO";
        
        jdbcTemplate.update(
            "UPDATE Usuario SET statusUsuario = ? WHERE id = ?", 
            novoStatus, id
        );
        
        String statusFinal = jdbcTemplate.queryForObject(
            "SELECT statusUsuario FROM Usuario WHERE id = ?", 
            String.class, 
            id
        );
        
        return "Status alterado de [" + statusAtual + "] para [" + statusFinal + "]";
    }
}
