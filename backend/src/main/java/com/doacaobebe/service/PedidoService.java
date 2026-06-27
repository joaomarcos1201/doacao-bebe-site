package com.doacaobebe.service;

import com.doacaobebe.dto.CheckoutRequest;
import com.doacaobebe.dto.CheckoutResponse;
import com.doacaobebe.entity.*;
import com.doacaobebe.provider.PagamentoProvider;
import com.doacaobebe.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class PedidoService {

    @Autowired
    private ProdutoRepository produtoRepository;

    @Autowired
    private PedidoRepository pedidoRepository;

    @Autowired
    private PagamentoRepository pagamentoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private FreteService freteService;

    @Autowired
    private CarteiraService carteiraService;

    @Autowired
    private PagamentoProvider pagamentoProvider;

    @Transactional
    public CheckoutResponse iniciarCheckout(CheckoutRequest request, Integer compradorId) {
        Produto produto = produtoRepository.findById(request.getProdutoId())
                .orElseThrow(() -> new IllegalArgumentException("Produto não encontrado."));

        if (!isDisponivelParaCompra(produto)) {
            throw new IllegalStateException("Produto não está disponível para compra.");
        }

        Usuario comprador = usuarioRepository.findById(compradorId)
                .orElseThrow(() -> new IllegalArgumentException("Comprador não encontrado."));

        BigDecimal valorFrete = freteService.calcularFrete(produto, request.getCepDestino());
        BigDecimal valorTotal = produto.getPreco().add(valorFrete);

        // Cria pedido
        Pedido pedido = new Pedido();
        pedido.setComprador(comprador);
        pedido.setVendedor(produto.getVendedor());
        pedido.setProduto(produto);
        pedido.setValorProduto(produto.getPreco());
        pedido.setValorFrete(valorFrete);
        pedido.setValorTotal(valorTotal);
        pedido.setCepDestino(request.getCepDestino());
        pedido.setStatusPagamento("PENDENTE");
        pedido = pedidoRepository.save(pedido);

        // Gera PIX
        PagamentoProvider.PixResponse pix = pagamentoProvider.gerarPix(
                pedido.getId(), valorTotal, "Pedido #" + pedido.getId() + " - " + produto.getNome()
        );

        // Registra pagamento
        Pagamento pagamento = new Pagamento();
        pagamento.setPedido(pedido);
        pagamento.setMercadoPagoId(pix.getPagamentoId());
        pagamento.setStatus("PENDENTE");
        pagamento.setValor(valorTotal);
        pagamentoRepository.save(pagamento);

        CheckoutResponse response = new CheckoutResponse();
        response.setPedidoId(pedido.getId());
        response.setNomeProduto(produto.getNome());
        response.setValorProduto(produto.getPreco());
        response.setValorFrete(valorFrete);
        response.setValorTotal(valorTotal);
        response.setQrCodeBase64(pix.getQrCodeBase64());
        response.setPixCopiaCola(pix.getPixCopiaCola());
        response.setPagamentoId(pix.getPagamentoId());
        return response;
    }

    @Transactional
    public void processarPagamentoAprovado(String mercadoPagoId) {
        Pagamento pagamento = pagamentoRepository.findByMercadoPagoId(mercadoPagoId)
                .orElseThrow(() -> new IllegalArgumentException("Pagamento não encontrado: " + mercadoPagoId));

        pagamento.setStatus("APROVADO");
        pagamentoRepository.save(pagamento);

        Pedido pedido = pagamento.getPedido();
        pedido.setStatusPagamento("APROVADO");

        // Reserva produto
        Produto produto = pedido.getProduto();
        produto.setStatusAnuncio("RESERVADO");
        produtoRepository.save(produto);

        // Retém saldo na carteira do vendedor
        carteiraService.reterSaldo(pedido.getVendedor(), pedido, pedido.getValorProduto());

        // Gera etiqueta de envio
        freteService.gerarEtiquetaParaPedido(pedido);

        pedidoRepository.save(pedido);
    }

    @Transactional
    public void processarPagamentoRejeitadoOuCancelado(String mercadoPagoId, String status) {
        pagamentoRepository.findByMercadoPagoId(mercadoPagoId).ifPresent(pagamento -> {
            pagamento.setStatus(status.toUpperCase());
            pagamentoRepository.save(pagamento);

            Pedido pedido = pagamento.getPedido();
            pedido.setStatusPagamento(status.toUpperCase());
            pedidoRepository.save(pedido);
        });
    }

    @Transactional
    public void atualizarRastreamento(String codigoRastreio, String novoStatus) {
        pedidoRepository.findAll().stream()
                .filter(p -> codigoRastreio.equals(p.getCodigoRastreio()))
                .findFirst()
                .ifPresent(pedido -> {
                    pedido.setStatusEnvio(novoStatus);
                    pedidoRepository.save(pedido);

                    if ("ENTREGUE".equals(novoStatus)) {
                        finalizarPedido(pedido);
                    }
                });
    }

    @Transactional
    public void finalizarPedido(Pedido pedido) {
        pedido.setStatusPagamento("FINALIZADO");
        pedido.getProduto().setStatusAnuncio("VENDIDO");
        produtoRepository.save(pedido.getProduto());
        pedidoRepository.save(pedido);

        carteiraService.liberarSaldo(pedido.getVendedor(), pedido, pedido.getValorProduto());
    }

    public List<Pedido> listarPedidosComprador(Integer compradorId) {
        return pedidoRepository.findByCompradorIdOrderByCreatedAtDesc(compradorId).stream()
                .filter(this::pedidoVisivelParaComprador)
                .toList();
    }

    public List<Pedido> listarPedidosVendedor(Integer vendedorId) {
        return pedidoRepository.findByVendedorIdOrderByCreatedAtDesc(vendedorId);
    }

    public List<Pedido> listarTodos() {
        return pedidoRepository.findAll();
    }

    public Pedido buscarPorId(Long id) {
        return pedidoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Pedido não encontrado."));
    }

    @Transactional
    public Pedido cancelarPedido(Long id, Integer compradorId) {
        Pedido pedido = buscarPorId(id);

        if (!pedido.getComprador().getId().equals(compradorId)) {
            throw new SecurityException("Pedido não pertence ao usuário autenticado.");
        }

        String statusPagamento = pedido.getStatusPagamento();
        String statusEnvio = pedido.getStatusEnvio();

        if ("CANCELADO".equalsIgnoreCase(statusPagamento) || "DEVOLVIDO".equalsIgnoreCase(statusPagamento)) {
            throw new IllegalStateException("Pedido já foi cancelado ou devolvido.");
        }

        if ("FINALIZADO".equalsIgnoreCase(statusPagamento) || "ENTREGUE".equalsIgnoreCase(statusEnvio)) {
            throw new IllegalStateException("Pedido entregue não pode ser cancelado.");
        }

        pedido.setStatusPagamento("CANCELADO");
        if (statusEnvio != null && !statusEnvio.isBlank()) {
            pedido.setStatusEnvio("CANCELADO");
        }

        Produto produto = pedido.getProduto();
        if (produto != null && "RESERVADO".equalsIgnoreCase(produto.getStatusAnuncio())) {
            produto.setStatusAnuncio("DISPONIVEL");
            produtoRepository.save(produto);
        }

        return pedidoRepository.save(pedido);
    }

    private boolean isDisponivelParaCompra(Produto produto) {
        String status = produto.getStatusAnuncio();
        return "DISPONIVEL".equals(status) || "ATIVO".equals(status) || "APROVADO".equals(status);
    }

    private boolean pedidoVisivelParaComprador(Pedido pedido) {
        String statusPagamento = pedido.getStatusPagamento();
        String statusEnvio = pedido.getStatusEnvio();
        return !"CANCELADO".equalsIgnoreCase(statusPagamento)
                && !"DEVOLVIDO".equalsIgnoreCase(statusPagamento)
                && !"CANCELADO".equalsIgnoreCase(statusEnvio)
                && !"DEVOLVIDO".equalsIgnoreCase(statusEnvio);
    }
}
