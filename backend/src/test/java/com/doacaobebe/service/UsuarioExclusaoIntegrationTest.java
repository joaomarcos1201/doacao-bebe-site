package com.doacaobebe.service;

import com.doacaobebe.config.JwtAuthenticationFilter;
import com.doacaobebe.controller.*;
import com.doacaobebe.entity.*;
import com.doacaobebe.repository.*;
import jakarta.persistence.EntityManager;
import org.junit.jupiter.api.*;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.*;
import org.springframework.transaction.support.TransactionTemplate;
import java.math.BigDecimal;
import java.util.*;
import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@DataJpaTest(showSql = false, properties = {
    "spring.jpa.hibernate.ddl-auto=create-drop",
    "spring.jpa.database-platform=org.hibernate.dialect.H2Dialect",
    "spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.H2Dialect",
    "logging.level.org.hibernate.SQL=WARN",
    "jwt.secret=chave-apenas-para-testes-de-exclusao-1234567890",
    "jwt.expiration=60000"
})
@Import({UsuarioService.class, JwtService.class, UsuarioController.class, AuthController.class,
    ProdutoController.class, JwtAuthenticationFilter.class})
@Transactional(propagation = Propagation.NOT_SUPPORTED)
class UsuarioExclusaoIntegrationTest {
    @Autowired UsuarioRepository usuarios;
    @Autowired ProdutoRepository produtos;
    @Autowired EntityManager em;
    @Autowired JdbcTemplate jdbc;
    @Autowired JwtService jwt;
    @Autowired UsuarioController controller;
    @Autowired AuthController auth;
    @Autowired ProdutoController catalogo;
    @Autowired JwtAuthenticationFilter filtro;
    @Autowired PlatformTransactionManager manager;
    @MockBean PasswordEncoder encoder;
    @MockBean EmailService email;
    TransactionTemplate tx;
    MockMvc mvc;
    Usuario admin, alvo, outro;
    String authorization;

    @BeforeEach void preparar() {
        tx = new TransactionTemplate(manager);
        tx.executeWithoutResult(s -> {
            admin = criarUsuario("Admin"); admin.setNivelAcesso("ADMIN");
            alvo = criarUsuario("Alvo"); outro = criarUsuario("Outro");
        });
        authorization = "Bearer " + jwt.generateToken(admin.getEmail());
        when(encoder.matches("senha", "hash")).thenReturn(true);
        mvc = MockMvcBuilders.standaloneSetup(controller, auth, catalogo).addFilters(filtro).build();
    }

    Usuario criarUsuario(String nome) {
        return usuarios.save(new Usuario(nome, UUID.randomUUID() + "@test", "11111111111", "hash"));
    }

    Produto produto(Usuario vendedor, String estado) {
        Produto p = new Produto(); p.setNome("Carrinho"); p.setDescricao("Teste");
        p.setVendedor(vendedor); p.setStatusAnuncio(estado); p.setPreco(new BigDecimal("100.00"));
        p.setCpf("11111111111"); p.setDoador("Nome pessoal"); p.setContato("11999999999");
        return produtos.saveAndFlush(p);
    }

    Pedido pedido(String papel, String estado) {
        Produto p = produto(papel.equals("vendedor") ? alvo : outro, "VENDIDO");
        Pedido pedido = new Pedido(); pedido.setProduto(p);
        pedido.setComprador(papel.equals("comprador") ? alvo : outro); pedido.setVendedor(p.getVendedor());
        pedido.setStatusPagamento(estado); pedido.setStatusEnvio("ENTREGUE");
        pedido.setCodigoRastreio("HISTORICO123"); pedido.setValorTotal(new BigDecimal("110.00"));
        em.persist(pedido); return pedido;
    }

    void excluir() throws Exception {
        mvc.perform(delete("/api/usuarios/{id}", alvo.getId()).header("Authorization", authorization))
            .andExpect(status().isOk()).andExpect(jsonPath("$.message").value("Usuário excluído com sucesso."));
        assertThat(usuarios.existsById(alvo.getId())).isFalse();
        assertThat(jdbc.queryForObject("SELECT COUNT(*) FROM Usuario WHERE id = ?", Integer.class, alvo.getId())).isZero();
        // Verificação real das sete FKs: nenhuma referência inválida, inclusive de terceiros.
        for (String[] fk : List.of(new String[]{"Anuncio", "vendedor_id"}, new String[]{"Pedido", "comprador_id"},
                new String[]{"Pedido", "vendedor_id"}, new String[]{"Carteira", "usuario_id"},
                new String[]{"Favorito", "usuario_id"}, new String[]{"Saque", "usuario_id"},
                new String[]{"MovimentacaoFinanceira", "usuario_id"})) {
            assertThat(jdbc.queryForObject("SELECT COUNT(*) FROM " + fk[0] + " t LEFT JOIN Usuario u ON u.id = t." +
                fk[1] + " WHERE t." + fk[1] + " IS NOT NULL AND u.id IS NULL", Integer.class)).isZero();
        }
        for (String[] fk : List.of(new String[]{"Pagamento", "pedido_id", "Pedido"},
                new String[]{"MovimentacaoFinanceira", "pedido_id", "Pedido"},
                new String[]{"Pedido", "produto_id", "Anuncio"}, new String[]{"Favorito", "produto_id", "Anuncio"})) {
            assertThat(jdbc.queryForObject("SELECT COUNT(*) FROM " + fk[0] + " t LEFT JOIN " + fk[2] + " p ON p.id = t." +
                fk[1] + " WHERE t." + fk[1] + " IS NOT NULL AND p.id IS NULL", Integer.class)).isZero();
        }
    }

    @Test void semRelacionamentosRemoveUsuarioDoBancoEDaListagem() throws Exception {
        excluir();
        mvc.perform(get("/api/usuarios")).andExpect(status().isOk())
            .andExpect(jsonPath("$[?(@.id == " + alvo.getId() + ")]").isEmpty());
        mvc.perform(delete("/api/usuarios/{id}", alvo.getId()).header("Authorization", authorization)).andExpect(status().isNotFound());
        assertThat(usuarios.existsById(outro.getId())).isTrue();
    }

    @Test void favoritoDoUsuarioRemovidoSemApagarProdutoDeTerceiro() throws Exception {
        Integer produtoId = tx.execute(s -> {
            Produto p = produto(outro, "DISPONIVEL"); em.persist(new Favorito(alvo, p)); em.persist(new Favorito(admin, p)); return p.getId();
        });
        excluir();
        assertThat(produtos.existsById(produtoId)).isTrue();
        assertThat(jdbc.queryForObject("SELECT COUNT(*) FROM Favorito WHERE usuario_id = ?", Integer.class, admin.getId())).isEqualTo(1);
    }

    @ParameterizedTest
    @ValueSource(strings = {"ATIVO", "DISPONIVEL", "APROVADO", "EM_ANALISE", "INATIVO", "RESERVADO", "VENDIDO"})
    void anuncioSemPedidosEFavoritosDeTerceirosSaoRemovidos(String estado) throws Exception {
        Produto p = tx.execute(s -> {
            Produto novo = produto(alvo, estado); em.persist(new Favorito(outro, novo)); return novo;
        });
        excluir();
        assertThat(produtos.existsById(p.getId())).isFalse();
        assertThat(jdbc.queryForObject("SELECT COUNT(*) FROM Favorito WHERE produto_id = ?", Integer.class, p.getId())).isZero();
    }

    @ParameterizedTest
    @ValueSource(strings = {"comprador", "vendedor"})
    void pedidoPagamentoFreteSaquesEMovimentacoesPreservadosSemUsuario(String papel) throws Exception {
        Long pedidoId = tx.execute(s -> {
            Pedido pedido = pedido(papel, "LIBERADO");
            Pagamento pagamento = new Pagamento(); pagamento.setPedido(pedido); pagamento.setStatus("APROVADO");
            pagamento.setMercadoPagoId("historico-" + pedido.getId()); pagamento.setValor(new BigDecimal("110.00")); em.persist(pagamento);
            Carteira carteira = new Carteira(); carteira.setUsuario(alvo); em.persist(carteira);
            Saque saque = new Saque(); saque.setUsuario(alvo); saque.setStatus("APROVADO"); saque.setValor(new BigDecimal("90.00")); em.persist(saque);
            MovimentacaoFinanceira mov = new MovimentacaoFinanceira(); mov.setUsuario(alvo); mov.setPedido(pedido);
            mov.setTipo("VENDA"); mov.setStatus("LIBERADO"); mov.setValor(new BigDecimal("90.00")); em.persist(mov);
            MovimentacaoFinanceira deTerceiro = new MovimentacaoFinanceira(); deTerceiro.setUsuario(outro); deTerceiro.setPedido(pedido);
            deTerceiro.setStatus("LIBERADO"); em.persist(deTerceiro);
            return pedido.getId();
        });
        Map<String, Integer> antes = contagensHistoricas();
        excluir();
        assertThat(contagensHistoricas()).isEqualTo(antes);
        tx.executeWithoutResult(s -> {
            Pedido pedido = em.find(Pedido.class, pedidoId);
            assertThat(pedido.getStatusPagamento()).isEqualTo("LIBERADO"); assertThat(pedido.getStatusEnvio()).isEqualTo("ENTREGUE");
            assertThat(pedido.getCodigoRastreio()).isEqualTo("HISTORICO123"); assertThat(pedido.getValorTotal()).isEqualByComparingTo("110");
            assertThat(papel.equals("comprador") ? pedido.getComprador() : pedido.getVendedor()).isNull();
            assertThat((papel.equals("comprador") ? pedido.getVendedor() : pedido.getComprador()).getId()).isEqualTo(outro.getId());
            Pagamento pg = em.createQuery("FROM Pagamento WHERE pedido.id = :id", Pagamento.class).setParameter("id", pedidoId).getSingleResult();
            assertThat(pg.getStatus()).isEqualTo("APROVADO"); assertThat(pg.getValor()).isEqualByComparingTo("110");
            List<MovimentacaoFinanceira> movimentos = em.createQuery("FROM MovimentacaoFinanceira WHERE pedido.id = :id", MovimentacaoFinanceira.class)
                    .setParameter("id", pedidoId).getResultList();
            assertThat(movimentos.stream().filter(m -> m.getUsuario() == null)).hasSize(1);
            assertThat(movimentos.stream().filter(m -> m.getUsuario() != null && m.getUsuario().getId().equals(outro.getId()))).hasSize(1);
            if (papel.equals("vendedor")) {
                assertThat(pedido.getProduto().getVendedor()).isNull(); assertThat(pedido.getProduto().getStatusVisibilidade()).isEqualTo("REMOVIDO");
                assertThat(pedido.getProduto().getCpf()).isNull(); assertThat(pedido.getProduto().getDoador()).isNull(); assertThat(pedido.getProduto().getContato()).isNull();
            }
        });
        // Mesmo com um papel já NULL, é possível excluir o outro sem perder o pedido.
        alvo = outro;
        excluir();
        tx.executeWithoutResult(s -> {
            Pedido pedido = em.find(Pedido.class, pedidoId);
            assertThat(pedido.getComprador()).isNull(); assertThat(pedido.getVendedor()).isNull();
        });
    }

    Map<String, Integer> contagensHistoricas() {
        Map<String, Integer> contagens = new HashMap<>();
        for (String tabela : List.of("Pedido", "Pagamento", "Saque", "MovimentacaoFinanceira"))
            contagens.put(tabela, jdbc.queryForObject("SELECT COUNT(*) FROM " + tabela, Integer.class));
        return contagens;
    }

    @ParameterizedTest
    @ValueSource(strings = {"Carteira", "Saque", "MovimentacaoFinanceira"})
    void dependenciasIsoladasSaoTratadas(String entidade) throws Exception {
        Long id = tx.execute(s -> {
            if (entidade.equals("Carteira")) { Carteira c = new Carteira(); c.setUsuario(alvo); em.persist(c); return c.getId(); }
            if (entidade.equals("Saque")) { Saque saque = new Saque(); saque.setUsuario(alvo); saque.setValor(BigDecimal.TEN); saque.setStatus("REJEITADO"); em.persist(saque); return saque.getId(); }
            MovimentacaoFinanceira m = new MovimentacaoFinanceira(); m.setUsuario(alvo); m.setValor(BigDecimal.TEN); m.setStatus("SACADO"); em.persist(m); return m.getId();
        });
        excluir();
        if (entidade.equals("Carteira")) assertThat(jdbc.queryForObject("SELECT COUNT(*) FROM Carteira WHERE id = ?", Integer.class, id)).isZero();
        else assertThat(jdbc.queryForObject("SELECT COUNT(*) FROM " + entidade + " WHERE id = ? AND usuario_id IS NULL", Integer.class, id)).isEqualTo(1);
    }

    @ParameterizedTest
    @ValueSource(strings = {"saldoLiberado", "saldoRetido", "saquePendente", "movimentacaoRetida", "pedidoPendente", "pagamentoPendente", "pagamentoAprovadoSemEstorno", "envioEmAndamento"})
    void impedimentoFinanceiroRealRetorna409SemExcluirNada(String impedimento) throws Exception {
        tx.executeWithoutResult(s -> {
            switch (impedimento) {
                case "saldoLiberado", "saldoRetido" -> {
                    Carteira c = new Carteira(); c.setUsuario(alvo);
                    if (impedimento.equals("saldoRetido")) c.setSaldoRetido(BigDecimal.TEN); else c.setSaldoLiberado(BigDecimal.TEN);
                    em.persist(c);
                }
                case "saquePendente" -> { Saque saque = new Saque(); saque.setUsuario(alvo); saque.setValor(BigDecimal.TEN); em.persist(saque); }
                case "movimentacaoRetida" -> { MovimentacaoFinanceira m = new MovimentacaoFinanceira(); m.setUsuario(alvo); m.setStatus("RETIDO"); em.persist(m); }
                case "pedidoPendente" -> pedido("comprador", "PENDENTE");
                case "envioEmAndamento" -> pedido("vendedor", "LIBERADO").setStatusEnvio("EM_TRANSITO");
                default -> {
                    Pedido pedido = pedido("vendedor", "CANCELADO"); Pagamento p = new Pagamento(); p.setPedido(pedido);
                    p.setStatus(impedimento.equals("pagamentoPendente") ? "PENDENTE" : "APROVADO"); em.persist(p);
                }
            }
        });
        Map<String, Integer> antes = contagensHistoricas();
        mvc.perform(delete("/api/usuarios/{id}", alvo.getId()).header("Authorization", authorization))
            .andExpect(status().isConflict()).andExpect(jsonPath("$.message").isNotEmpty());
        assertThat(usuarios.findById(alvo.getId()).orElseThrow().getStatusUsuario()).isEqualTo("ATIVO");
        assertThat(contagensHistoricas()).isEqualTo(antes);
    }

    @Test void fkDesconhecidaRetorna409EFazRollbackCompleto() throws Exception {
        Integer produtoId = tx.execute(s -> {
            Produto p = produto(alvo, "ATIVO"); em.persist(new Favorito(outro, p));
            Carteira c = new Carteira(); c.setUsuario(alvo); em.persist(c);
            pedido("comprador", "LIBERADO"); return p.getId();
        });
        jdbc.execute("CREATE TABLE DependenciaLegada (id INT PRIMARY KEY, usuario_id INT REFERENCES Usuario(id))");
        try {
            jdbc.update("INSERT INTO DependenciaLegada VALUES (1, ?)", alvo.getId());
            mvc.perform(delete("/api/usuarios/{id}", alvo.getId()).header("Authorization", authorization))
                .andExpect(status().isConflict()).andExpect(jsonPath("$.message").value(org.hamcrest.Matchers.containsString("dependência não resolvida")));
            assertThat(usuarios.existsById(alvo.getId())).isTrue(); assertThat(produtos.existsById(produtoId)).isTrue();
            assertThat(jdbc.queryForObject("SELECT COUNT(*) FROM Favorito WHERE produto_id = ?", Integer.class, produtoId)).isEqualTo(1);
            assertThat(jdbc.queryForObject("SELECT COUNT(*) FROM Carteira WHERE usuario_id = ?", Integer.class, alvo.getId())).isEqualTo(1);
            assertThat(jdbc.queryForObject("SELECT COUNT(*) FROM Pedido WHERE comprador_id = ?", Integer.class, alvo.getId())).isEqualTo(1);
        } finally { jdbc.execute("DROP TABLE DependenciaLegada"); }
    }

    @Test void schemaSemMigrationRetorna409EFazRollback() throws Exception {
        Long pedidoId = tx.execute(s -> pedido("comprador", "LIBERADO").getId());
        // Simula um schema antigo em uma coluna auxiliar, sem alterar os históricos dos outros testes.
        jdbc.execute("ALTER TABLE Pedido ADD CONSTRAINT ExigeCompradorTeste CHECK (id <> " + pedidoId + " OR comprador_id IS NOT NULL)");
        try {
            mvc.perform(delete("/api/usuarios/{id}", alvo.getId()).header("Authorization", authorization)).andExpect(status().isConflict());
            assertThat(usuarios.existsById(alvo.getId())).isTrue();
        } finally { jdbc.execute("ALTER TABLE Pedido DROP CONSTRAINT ExigeCompradorTeste"); }
    }

    @Test void inexistenteRetorna404() throws Exception {
        mvc.perform(delete("/api/usuarios/2147483647").header("Authorization", authorization))
            .andExpect(status().isNotFound()).andExpect(jsonPath("$.message").value("Usuário não encontrado."));
    }

    @Test void loginAtivoFuncionaEExclusaoBloqueiaLoginMeETokenAnterior() throws Exception {
        String body = "{\"email\":\"" + alvo.getEmail() + "\",\"senha\":\"senha\"}";
        mvc.perform(post("/api/auth/login").contentType("application/json").content(body)).andExpect(status().isOk());
        String tokenAnterior = "Bearer " + jwt.generateToken(alvo.getEmail());
        excluir();
        mvc.perform(post("/api/auth/login").contentType("application/json").content(body))
            .andExpect(status().isBadRequest()).andExpect(content().string(org.hamcrest.Matchers.containsString("Credenciais inválidas")));
        mvc.perform(get("/api/auth/me").header("Authorization", tokenAnterior)).andExpect(status().isBadRequest());
        mvc.perform(get("/api/usuarios").header("Authorization", tokenAnterior)).andExpect(status().isUnauthorized());
    }

    @ParameterizedTest
    @ValueSource(strings = {"INATIVO", "EXCLUIDO", "BLOQUEADO", " inativo "})
    void statusContinuaBloqueandoLoginESemImpedirExclusao(String estado) throws Exception {
        tx.executeWithoutResult(s -> usuarios.findById(alvo.getId()).orElseThrow().setStatusUsuario(estado));
        mvc.perform(post("/api/auth/login").contentType("application/json")
            .content("{\"email\":\"" + alvo.getEmail() + "\",\"senha\":\"senha\"}"))
            .andExpect(status().isBadRequest()).andExpect(content().string(org.hamcrest.Matchers.containsString("Conta inativa")));
        excluir();
    }

    @Test void protegePropriaContaOutroAdminENaoAutorizados() throws Exception {
        tx.executeWithoutResult(s -> usuarios.findById(outro.getId()).orElseThrow().setNivelAcesso("ADMIN"));
        for (Integer id : List.of(admin.getId(), outro.getId())) {
            mvc.perform(delete("/api/usuarios/{id}", id).header("Authorization", authorization)).andExpect(status().isForbidden());
            mvc.perform(put("/api/usuarios/{id}/status", id).header("Authorization", authorization)).andExpect(status().isForbidden());
            assertThat(usuarios.existsById(id)).isTrue();
        }
        mvc.perform(delete("/api/usuarios/{id}", alvo.getId())).andExpect(status().isUnauthorized());
        mvc.perform(delete("/api/usuarios/{id}", alvo.getId()).header("Authorization", "Bearer invalido")).andExpect(status().isUnauthorized());
        mvc.perform(delete("/api/usuarios/{id}", outro.getId()).header("Authorization", "Bearer " + jwt.generateToken(alvo.getEmail())))
            .andExpect(status().isForbidden());
        mvc.perform(put("/api/usuarios/{id}/admin", alvo.getId()).contentType("application/json").content("{\"isAdmin\":true}"))
            .andExpect(status().isUnauthorized());
    }

    @Test void pausarEAtivarContinuamSeparadosDaExclusao() throws Exception {
        Produto p = tx.execute(s -> produto(alvo, "ATIVO"));
        for (String estado : List.of("INATIVO", "ATIVO")) {
            mvc.perform(put("/api/usuarios/{id}/status", alvo.getId()).header("Authorization", authorization))
                .andExpect(status().isOk()).andExpect(jsonPath("$.statusUsuario").value(estado));
            assertThat(usuarios.existsById(alvo.getId())).isTrue();
            assertThat(produtos.findById(p.getId()).orElseThrow().getStatusVisibilidade()).isEqualTo("REMOVIDO");
        }
    }
}
