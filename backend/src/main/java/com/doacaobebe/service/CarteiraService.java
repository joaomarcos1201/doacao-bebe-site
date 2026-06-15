package com.doacaobebe.service;

import com.doacaobebe.entity.*;
import com.doacaobebe.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
public class CarteiraService {

    private static final BigDecimal COMISSAO_PERCENTUAL = new BigDecimal("0.10");

    @Autowired
    private CarteiraRepository carteiraRepository;

    @Autowired
    private MovimentacaoFinanceiraRepository movimentacaoRepository;

    @Transactional
    public Carteira obterOuCriar(Usuario usuario) {
        return carteiraRepository.findByUsuarioId(usuario.getId())
                .orElseGet(() -> {
                    Carteira c = new Carteira();
                    c.setUsuario(usuario);
                    return carteiraRepository.save(c);
                });
    }

    @Transactional
    public void reterSaldo(Usuario vendedor, Pedido pedido, BigDecimal valorProduto) {
        Carteira carteira = obterOuCriar(vendedor);
        carteira.setSaldoRetido(carteira.getSaldoRetido().add(valorProduto));
        carteiraRepository.save(carteira);

        MovimentacaoFinanceira mov = new MovimentacaoFinanceira();
        mov.setUsuario(vendedor);
        mov.setPedido(pedido);
        mov.setTipo("VENDA");
        mov.setValor(valorProduto);
        mov.setStatus("RETIDO");
        movimentacaoRepository.save(mov);
    }

    @Transactional
    public void liberarSaldo(Usuario vendedor, Pedido pedido, BigDecimal valorProduto) {
        Carteira carteira = obterOuCriar(vendedor);

        BigDecimal comissao = valorProduto.multiply(COMISSAO_PERCENTUAL).setScale(2, RoundingMode.HALF_UP);
        BigDecimal valorLiquido = valorProduto.subtract(comissao);

        // Remove do retido e adiciona ao liberado
        carteira.setSaldoRetido(carteira.getSaldoRetido().subtract(valorProduto).max(BigDecimal.ZERO));
        carteira.setSaldoLiberado(carteira.getSaldoLiberado().add(valorLiquido));
        carteiraRepository.save(carteira);

        // Registra comissão
        MovimentacaoFinanceira movComissao = new MovimentacaoFinanceira();
        movComissao.setUsuario(vendedor);
        movComissao.setPedido(pedido);
        movComissao.setTipo("COMISSAO");
        movComissao.setValor(comissao.negate());
        movComissao.setStatus("LIBERADO");
        movimentacaoRepository.save(movComissao);

        // Atualiza movimentação de venda para liberado
        movimentacaoRepository.findByUsuarioIdOrderByCreatedAtDesc(vendedor.getId())
                .stream()
                .filter(m -> "VENDA".equals(m.getTipo()) && "RETIDO".equals(m.getStatus())
                        && pedido.equals(m.getPedido()))
                .findFirst()
                .ifPresent(m -> {
                    m.setStatus("LIBERADO");
                    movimentacaoRepository.save(m);
                });
    }

    @Transactional
    public void descontarSaque(Usuario vendedor, BigDecimal valor) {
        Carteira carteira = obterOuCriar(vendedor);
        if (carteira.getSaldoLiberado().compareTo(valor) < 0) {
            throw new IllegalArgumentException("Saldo insuficiente para saque.");
        }
        carteira.setSaldoLiberado(carteira.getSaldoLiberado().subtract(valor));
        carteiraRepository.save(carteira);

        MovimentacaoFinanceira mov = new MovimentacaoFinanceira();
        mov.setUsuario(vendedor);
        mov.setTipo("SAQUE");
        mov.setValor(valor.negate());
        mov.setStatus("SACADO");
        movimentacaoRepository.save(mov);
    }

    public Carteira obterCarteira(Usuario usuario) {
        return obterOuCriar(usuario);
    }

    public List<MovimentacaoFinanceira> obterHistorico(Integer usuarioId) {
        return movimentacaoRepository.findByUsuarioIdOrderByCreatedAtDesc(usuarioId);
    }
}
