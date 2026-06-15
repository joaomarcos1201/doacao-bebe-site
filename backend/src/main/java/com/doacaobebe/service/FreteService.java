package com.doacaobebe.service;

import com.doacaobebe.entity.Pedido;
import com.doacaobebe.entity.Produto;
import com.doacaobebe.provider.FreteProvider;
import com.doacaobebe.repository.PedidoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
public class FreteService {

    @Autowired
    private FreteProvider freteProvider;

    @Autowired
    private PedidoRepository pedidoRepository;

    public BigDecimal calcularFrete(Produto produto, String cepDestino) {
        return freteProvider.calcularFrete(
                produto.getCepOrigem(),
                cepDestino,
                produto.getPeso(),
                produto.getAltura(),
                produto.getLargura(),
                produto.getComprimento()
        );
    }

    @Transactional
    public void gerarEtiquetaParaPedido(Pedido pedido) {
        String codigoRastreio = freteProvider.gerarEtiqueta(
                pedido.getId(),
                pedido.getProduto().getCepOrigem(),
                pedido.getCepDestino(),
                pedido.getVendedor().getNome(),
                pedido.getComprador().getNome()
        );

        pedido.setCodigoRastreio(codigoRastreio);
        pedido.setTransportadora("MELHOR_ENVIO");
        pedido.setStatusEnvio("AGUARDANDO_POSTAGEM");
        pedidoRepository.save(pedido);
    }
}
