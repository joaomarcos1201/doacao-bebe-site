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
import org.springframework.boot.test.mock.mockito.SpyBean;
import org.springframework.context.annotation.Import;
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
    "jwt.secret=chave-apenas-para-testes-de-desativacao-1234567890",
    "jwt.expiration=60000"
})
@Import({UsuarioService.class, JwtService.class, UsuarioController.class, AuthController.class,
    ProdutoController.class, JwtAuthenticationFilter.class})
@Transactional(propagation = Propagation.NOT_SUPPORTED)
class UsuarioDesativacaoIntegrationTest {
    @Autowired UsuarioRepository usuarios;
    @SpyBean ProdutoRepository produtos;
    @Autowired EntityManager em;
    @Autowired UsuarioService service;
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

    Produto produto(Usuario vendedor, String status) {
        Produto p = new Produto(); p.setNome("Carrinho"); p.setDescricao("Teste");
        p.setVendedor(vendedor); p.setStatusAnuncio(status); p.setPreco(new BigDecimal("100.00"));
        return produtos.saveAndFlush(p);
    }

    void desativar(Integer id) throws Exception {
        mvc.perform(delete("/api/usuarios/{id}", id).header("Authorization", authorization))
            .andExpect(status().isOk()).andExpect(jsonPath("$.message").value(
                "Conta desativada. Pedidos, pagamentos e saldo foram preservados."));
    }

    @Test void semRelacionamentosERepeticaoMantemUsuarioInativoNaListagem() throws Exception {
        desativar(alvo.getId()); desativar(alvo.getId());
        assertThat(usuarios.findById(alvo.getId()).orElseThrow().getStatusUsuario()).isEqualTo("INATIVO");
        mvc.perform(get("/api/usuarios")).andExpect(status().isOk())
            .andExpect(jsonPath("$[?(@.id == " + alvo.getId() + ")].statusUsuario").value("INATIVO"));
    }

    @ParameterizedTest
    @ValueSource(strings = {"ATIVO", "DISPONIVEL", "APROVADO", "EM_ANALISE", "INATIVO", "RESERVADO", "VENDIDO"})
    void anunciosSaemDoCatalogoSemApagarOuReclassificarHistorico(String estado) throws Exception {
        Produto p = tx.execute(s -> produto(alvo, estado));
        Produto preservado = tx.execute(s -> produto(outro, "DISPONIVEL"));
        desativar(alvo.getId());
        Produto resultado = produtos.findById(p.getId()).orElseThrow();
        assertThat(resultado.getStatusAnuncio()).isEqualTo(estado);
        assertThat(resultado.getStatusVisibilidade()).isEqualTo(
            List.of("VENDIDO", "RESERVADO").contains(estado) ? "ONLINE" : "REMOVIDO");
        assertThat(catalogo.listarDisponiveis().getBody()).extracting(Produto::getId)
            .doesNotContain(p.getId()).contains(preservado.getId());
        int status = tx.execute(s -> catalogo.alterarStatus(p.getId(), "DISPONIVEL", authorization).getStatusCode().value());
        assertThat(status).isIn(400, 409);
    }

    @ParameterizedTest
    @ValueSource(strings = {"comprador", "vendedor"})
    void pedidosPagamentosFreteSaldoSaquesFavoritosEMovimentacoesPermanecem(String papel) throws Exception {
        Long pedidoId = tx.execute(s -> {
            Produto p = produto(papel.equals("vendedor") ? alvo : outro, "VENDIDO");
            Pedido pedido = new Pedido(); pedido.setProduto(p);
            pedido.setComprador(papel.equals("comprador") ? alvo : outro);
            pedido.setVendedor(p.getVendedor()); pedido.setStatusPagamento("LIBERADO");
            pedido.setStatusEnvio("ENTREGUE"); pedido.setCodigoRastreio("HISTORICO123");
            pedido.setValorTotal(new BigDecimal("110.00")); em.persist(pedido);
            Pagamento pagamento = new Pagamento(); pagamento.setPedido(pedido);
            pagamento.setMercadoPagoId("historico-" + pedido.getId()); pagamento.setStatus("APROVADO");
            pagamento.setValor(new BigDecimal("110.00")); em.persist(pagamento);
            Carteira carteira = new Carteira(); carteira.setUsuario(alvo);
            carteira.setSaldoRetido(new BigDecimal("100.00")); carteira.setSaldoLiberado(new BigDecimal("90.00"));
            em.persist(carteira);
            Saque saque = new Saque(); saque.setUsuario(alvo); saque.setValor(new BigDecimal("20.00")); em.persist(saque);
            MovimentacaoFinanceira mov = new MovimentacaoFinanceira(); mov.setUsuario(alvo);
            mov.setPedido(pedido); mov.setTipo("VENDA"); mov.setStatus("LIBERADO"); mov.setValor(new BigDecimal("90.00")); em.persist(mov);
            em.persist(new Favorito(alvo, p));
            return pedido.getId();
        });
        Map<String, Long> antes = contagens();
        desativar(alvo.getId());
        assertThat(contagens()).isEqualTo(antes);
        tx.executeWithoutResult(s -> {
            Pedido pedido = em.find(Pedido.class, pedidoId);
            assertThat(pedido.getStatusPagamento()).isEqualTo("LIBERADO");
            assertThat(pedido.getStatusEnvio()).isEqualTo("ENTREGUE");
            assertThat(pedido.getCodigoRastreio()).isEqualTo("HISTORICO123");
            assertThat(pedido.getValorTotal()).isEqualByComparingTo("110");
            assertThat(pedido.getComprador().getId()).isEqualTo(papel.equals("comprador") ? alvo.getId() : outro.getId());
            assertThat(pedido.getVendedor().getId()).isEqualTo(papel.equals("vendedor") ? alvo.getId() : outro.getId());
            Pagamento pg = em.createQuery("from Pagamento where pedido.id = :id", Pagamento.class).setParameter("id", pedidoId).getSingleResult();
            assertThat(pg.getStatus()).isEqualTo("APROVADO"); assertThat(pg.getValor()).isEqualByComparingTo("110");
            Carteira c = em.createQuery("from Carteira where usuario.id = :id", Carteira.class).setParameter("id", alvo.getId()).getSingleResult();
            assertThat(c.getSaldoRetido()).isEqualByComparingTo("100"); assertThat(c.getSaldoLiberado()).isEqualByComparingTo("90");
        });
    }

    Map<String, Long> contagens() {
        return tx.execute(s -> {
            Map<String, Long> counts = new HashMap<>();
            for (String entidade : List.of("Usuario", "Produto", "Pedido", "Pagamento", "Carteira", "Saque", "Favorito", "MovimentacaoFinanceira")) {
                counts.put(entidade, em.createQuery("select count(e) from " + entidade + " e", Long.class).getSingleResult());
            }
            return counts;
        });
    }

    @Test void carteiraSemPedidoPreservaSaldo() throws Exception {
        Long id = tx.execute(s -> {
            Carteira c = new Carteira(); c.setUsuario(alvo); c.setSaldoLiberado(new BigDecimal("75.50")); em.persist(c); return c.getId();
        });
        desativar(alvo.getId());
        tx.executeWithoutResult(s -> assertThat(em.find(Carteira.class, id).getSaldoLiberado()).isEqualByComparingTo("75.50"));
    }

    @Test void inexistenteRetorna404() throws Exception {
        mvc.perform(delete("/api/usuarios/2147483647").header("Authorization", authorization))
            .andExpect(status().isNotFound()).andExpect(jsonPath("$.message").value("Usuário não encontrado."));
    }

    @Test void loginAtivoFuncionaEDesativacaoBloqueiaLoginMeETokenAnterior() throws Exception {
        String body = "{\"email\":\"" + alvo.getEmail() + "\",\"senha\":\"senha\"}";
        mvc.perform(post("/api/auth/login").contentType("application/json").content(body))
            .andExpect(status().isOk()).andExpect(jsonPath("$.token").isNotEmpty());
        String tokenAnterior = "Bearer " + jwt.generateToken(alvo.getEmail());
        desativar(alvo.getId());
        mvc.perform(post("/api/auth/login").contentType("application/json").content(body))
            .andExpect(status().isBadRequest()).andExpect(content().string(org.hamcrest.Matchers.containsString("Conta inativa")));
        mvc.perform(get("/api/auth/me").header("Authorization", tokenAnterior)).andExpect(status().isBadRequest());
        mvc.perform(get("/api/usuarios").header("Authorization", tokenAnterior)).andExpect(status().isForbidden());
    }

    @ParameterizedTest
    @ValueSource(strings = {"INATIVO", "EXCLUIDO", "BLOQUEADO", " inativo "})
    void loginBloqueiaTodosEstadosNaoAtivos(String estado) throws Exception {
        tx.executeWithoutResult(s -> usuarios.findById(alvo.getId()).orElseThrow().setStatusUsuario(estado));
        mvc.perform(post("/api/auth/login").contentType("application/json")
            .content("{\"email\":\"" + alvo.getEmail() + "\",\"senha\":\"senha\"}"))
            .andExpect(status().isBadRequest()).andExpect(content().string(org.hamcrest.Matchers.containsString("Conta inativa")));
    }

    @Test void protegePropriaContaOutroAdminENaoAutorizados() throws Exception {
        tx.executeWithoutResult(s -> usuarios.findById(outro.getId()).orElseThrow().setNivelAcesso("ADMIN"));
        for (Integer id : List.of(admin.getId(), outro.getId())) {
            mvc.perform(delete("/api/usuarios/{id}", id).header("Authorization", authorization)).andExpect(status().isForbidden());
            mvc.perform(put("/api/usuarios/{id}/status", id).header("Authorization", authorization)).andExpect(status().isForbidden());
            assertThat(usuarios.findById(id).orElseThrow().getStatusUsuario()).isEqualTo("ATIVO");
        }
        mvc.perform(delete("/api/usuarios/{id}", alvo.getId())).andExpect(status().isUnauthorized());
        mvc.perform(delete("/api/usuarios/{id}", alvo.getId()).header("Authorization", "Bearer invalido")).andExpect(status().isUnauthorized());
        mvc.perform(delete("/api/usuarios/{id}", outro.getId()).header("Authorization", "Bearer " + jwt.generateToken(alvo.getEmail())))
            .andExpect(status().isForbidden());
        mvc.perform(put("/api/usuarios/{id}/admin", alvo.getId()).contentType("application/json").content("{\"isAdmin\":true}"))
            .andExpect(status().isUnauthorized());
    }

    @Test void pausarUsaMesmaRegraEReativacaoNaoRepublica() throws Exception {
        Produto p = tx.execute(s -> produto(alvo, "ATIVO"));
        for (String estado : List.of("INATIVO", "ATIVO")) {
            mvc.perform(put("/api/usuarios/{id}/status", alvo.getId()).header("Authorization", authorization))
                .andExpect(status().isOk()).andExpect(jsonPath("$.statusUsuario").value(estado));
            assertThat(produtos.findById(p.getId()).orElseThrow().getStatusVisibilidade()).isEqualTo("REMOVIDO");
        }
    }

    @Test void falhaNosAnunciosFazRollbackDaDesativacao() throws Exception {
        doThrow(new IllegalStateException("Falha simulada no banco")).when(produtos).ocultarAnunciosDoUsuario(alvo.getId());
        mvc.perform(delete("/api/usuarios/{id}", alvo.getId()).header("Authorization", authorization))
            .andExpect(status().isInternalServerError()).andExpect(jsonPath("$.message").value("Não foi possível desativar a conta. Tente novamente."));
        assertThat(usuarios.findById(alvo.getId()).orElseThrow().getStatusUsuario()).isEqualTo("ATIVO");
    }
}
