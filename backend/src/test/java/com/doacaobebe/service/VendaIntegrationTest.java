package com.doacaobebe.service;

import com.doacaobebe.controller.*;
import com.doacaobebe.dto.*;
import com.doacaobebe.entity.*;
import com.doacaobebe.provider.*;
import com.doacaobebe.repository.*;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionTemplate;
import org.springframework.transaction.PlatformTransactionManager;
import java.math.BigDecimal;
import java.util.UUID;
import java.util.concurrent.*;
import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.when;

@DataJpaTest(showSql = false, properties = {
    "spring.jpa.hibernate.ddl-auto=create-drop", "spring.jpa.database-platform=org.hibernate.dialect.H2Dialect",
    "spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.H2Dialect"
})
@Import({PedidoService.class, FreteService.class, CarteiraService.class, UsuarioService.class,
    PagamentoProviderMock.class, FreteProviderMock.class, ProdutoController.class,
    SimulacaoController.class, AdminOrderController.class})
@Transactional(propagation = Propagation.NOT_SUPPORTED)
class VendaIntegrationTest {
    @Autowired PedidoService service;
    @Autowired UsuarioService usuarioService;
    @MockBean org.springframework.security.crypto.password.PasswordEncoder encoder;
    @Autowired ProdutoRepository produtos;
    @Autowired UsuarioRepository usuarios;
    @Autowired PagamentoRepository pagamentos;
    @Autowired CarteiraRepository carteiras;
    @Autowired ProdutoController catalogo;
    @Autowired SimulacaoController simulacao;
    @Autowired AdminOrderController admin;
    @Autowired PlatformTransactionManager manager;
    @MockBean JwtService jwt;
    TransactionTemplate tx;
    Usuario vendedor, comprador;
    Produto produto;

    @BeforeEach void preparar() {
        tx = new TransactionTemplate(manager);
        tx.executeWithoutResult(s -> {
            vendedor = usuarios.save(new Usuario("Vendedor", UUID.randomUUID()+"@test", "11111111111", "test"));
            comprador = usuarios.save(new Usuario("Comprador", UUID.randomUUID()+"@test", "22222222222", "test"));
            comprador.setNivelAcesso("ADMIN");
            produto = new Produto();
            produto.setNome("Carrinho"); produto.setDescricao("Teste");
            produto.setStatusAnuncio("DISPONIVEL"); produto.setPreco(new BigDecimal("100.00"));
            produto.setVendedor(vendedor); produto.setCepOrigem("01001000");
            produtos.save(produto);
        });
        when(jwt.extractEmail("test")).thenReturn(comprador.getEmail());
    }

    CheckoutResponse checkout() {
        CheckoutRequest request = new CheckoutRequest();
        request.setProdutoId(produto.getId()); request.setCepDestino("01001000");
        return service.iniciarCheckout(request, comprador.getId());
    }

    @Test void fluxoCompletoSimuladoPreservaHistoricoFreteECarteira() {
        assertThat(catalogo.listarDisponiveis().getBody()).extracting(Produto::getId).contains(produto.getId());
        CheckoutResponse compra = checkout();
        assertThat(produtos.findById(produto.getId()).orElseThrow().getStatusAnuncio()).isEqualTo("DISPONIVEL");
        assertThat(pagamentos.findByMercadoPagoId(compra.getPagamentoId()).orElseThrow().getStatus()).isEqualTo("PENDENTE");
        assertThat(simulacao.simularPagamento(compra.getPagamentoId(), "Bearer test").getStatusCode().value()).isEqualTo(200);
        assertThat(produtos.findById(produto.getId()).orElseThrow().getStatusAnuncio()).isEqualTo("VENDIDO");
        assertThat(catalogo.listarDisponiveis().getBody()).extracting(Produto::getId).doesNotContain(produto.getId());
        assertThat(catalogo.listarTodos().getBody()).extracting(Produto::getId).contains(produto.getId());
        assertThat(service.listarPedidosComprador(comprador.getId())).extracting(Pedido::getId).contains(compra.getPedidoId());
        assertThat(service.listarPedidosVendedor(vendedor.getId())).extracting(Pedido::getId).contains(compra.getPedidoId());
        assertThat(service.buscarPorId(compra.getPedidoId()).getStatusEnvio()).isEqualTo("AGUARDANDO_POSTAGEM");
        assertThat(service.buscarPorId(compra.getPedidoId()).getCodigoRastreio()).startsWith("MOCK");
        assertThatThrownBy(this::checkout).isInstanceOf(IllegalStateException.class).hasMessageContaining("não está mais disponível");
        service.processarPagamentoAprovado(compra.getPagamentoId());
        assertThat(carteiras.findByUsuarioId(vendedor.getId()).orElseThrow().getSaldoRetido()).isEqualByComparingTo("100");
        assertThat(simulacao.simularEntrega(compra.getPedidoId(), "Bearer test").getStatusCode().value()).isEqualTo(200);
        assertThat(service.buscarPorId(compra.getPedidoId()).getStatusEnvio()).isEqualTo("ENTREGUE");
        assertThat(service.buscarPorId(compra.getPedidoId()).getStatusPagamento()).isEqualTo("FINALIZADO");
        assertThat(admin.releasePayment(compra.getPedidoId(), "Bearer test").getStatusCode().value()).isEqualTo(200);
        assertThat(service.buscarPorId(compra.getPedidoId()).getStatusPagamento()).isEqualTo("LIBERADO");
        assertThat(carteiras.findByUsuarioId(vendedor.getId()).orElseThrow().getSaldoLiberado()).isEqualByComparingTo("90");
        assertThat(carteiras.findByUsuarioId(vendedor.getId()).orElseThrow().getSaldoRetido()).isEqualByComparingTo("0");
        assertThat(catalogo.alterarStatus(produto.getId(), "DISPONIVEL", "Bearer test").getStatusCode().value()).isEqualTo(400);
    }

    @Test void duasAprovacoesConcorrentesVendemUmaUnicaVez() throws Exception {
        CheckoutResponse a = checkout(), b = checkout();
        ExecutorService pool = Executors.newFixedThreadPool(2);
        CountDownLatch ready = new CountDownLatch(2), start = new CountDownLatch(1);
        try {
            java.util.List<Future<Boolean>> results = new java.util.ArrayList<>();
            for (String id : java.util.List.of(a.getPagamentoId(), b.getPagamentoId())) {
                results.add(pool.submit(() -> {
                    ready.countDown(); start.await();
                    try { service.processarPagamentoAprovado(id); return true; }
                    catch (IllegalStateException expected) { return false; }
                }));
            }
            assertThat(ready.await(5, TimeUnit.SECONDS)).isTrue(); start.countDown();
            int successes = 0;
            for (Future<Boolean> result : results) if (result.get(15, TimeUnit.SECONDS)) successes++;
            assertThat(successes).isEqualTo(1);
            assertThat(carteiras.findByUsuarioId(vendedor.getId()).orElseThrow().getSaldoRetido()).isEqualByComparingTo("100");
            assertThat(java.util.List.of(pagamentos.findByMercadoPagoId(a.getPagamentoId()).orElseThrow().getStatus(),
                pagamentos.findByMercadoPagoId(b.getPagamentoId()).orElseThrow().getStatus())).containsExactlyInAnyOrder("APROVADO", "PENDENTE");
        } finally { start.countDown(); pool.shutdownNow(); }
    }

    @Test void cancelamentoEEstornoNaoRepublicamVenda() {
        CheckoutResponse a = checkout();
        service.processarPagamentoAprovado(a.getPagamentoId());
        service.cancelarPedido(a.getPedidoId(), comprador.getId());
        service.processarPagamentoRejeitadoOuCancelado(a.getPagamentoId(), "refunded");
        assertThat(produtos.findById(produto.getId()).orElseThrow().getStatusAnuncio()).isEqualTo("VENDIDO");
        assertThatThrownBy(() -> service.processarPagamentoAprovado(a.getPagamentoId())).isInstanceOf(IllegalStateException.class);
    }

    @Test void pagamentoRejeitadoNaoVendeEProdutoRemovidoNaoPermiteCheckout() {
        CheckoutResponse a = checkout();
        service.processarPagamentoRejeitadoOuCancelado(a.getPagamentoId(), "rejected");
        assertThat(produtos.findById(produto.getId()).orElseThrow().getStatusAnuncio()).isEqualTo("DISPONIVEL");
        tx.executeWithoutResult(s -> { Produto p = produtos.findById(produto.getId()).orElseThrow(); p.setStatusVisibilidade("REMOVIDO"); });
        assertThatThrownBy(this::checkout).isInstanceOf(IllegalStateException.class);
    }

    @Test void desativarVendedorBloqueiaNovoCheckoutPreservandoPedidoEPagamentoPendentes() {
        CheckoutResponse compra = checkout();
        usuarioService.remover(vendedor.getId(), "Bearer test");
        assertThatThrownBy(this::checkout).isInstanceOf(IllegalStateException.class);
        assertThat(service.buscarPorId(compra.getPedidoId()).getStatusPagamento()).isEqualTo("PENDENTE");
        assertThat(pagamentos.findByMercadoPagoId(compra.getPagamentoId()).orElseThrow().getStatus()).isEqualTo("PENDENTE");
    }

    @Test void desativarVendedorNaoImpedeEntregaELiberacaoAdministrativaDeVendaPaga() {
        CheckoutResponse compra = checkout();
        service.processarPagamentoAprovado(compra.getPagamentoId());
        usuarioService.remover(vendedor.getId(), "Bearer test");
        assertThat(simulacao.simularEntrega(compra.getPedidoId(), "Bearer test").getStatusCode().value()).isEqualTo(200);
        assertThat(admin.releasePayment(compra.getPedidoId(), "Bearer test").getStatusCode().value()).isEqualTo(200);
        assertThat(carteiras.findByUsuarioId(vendedor.getId()).orElseThrow().getSaldoLiberado()).isEqualByComparingTo("90");
        assertThat(pagamentos.findByMercadoPagoId(compra.getPagamentoId()).orElseThrow().getStatus()).isEqualTo("APROVADO");
    }
}
