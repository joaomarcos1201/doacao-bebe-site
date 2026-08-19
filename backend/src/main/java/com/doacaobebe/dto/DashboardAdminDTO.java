package com.doacaobebe.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public record DashboardAdminDTO(
        String periodo,
        Map<String, Long> usuarios,
        Map<String, Long> produtos,
        Map<String, Long> pedidos,
        FinanceiroDTO financeiro,
        List<QuantidadePeriodoDTO> usuariosPorPeriodo,
        List<QuantidadePeriodoDTO> produtosPorPeriodo,
        List<QuantidadePeriodoDTO> pedidosPorPeriodo,
        List<ValoresPeriodoDTO> valoresPorPeriodo,
        List<DistribuicaoDTO> statusProdutos,
        List<DistribuicaoDTO> statusPedidos,
        List<DistribuicaoDTO> categoriasAnuncios,
        List<DistribuicaoDTO> categoriasVendas
) {
    public record FinanceiroDTO(
            BigDecimal valorProdutosVendidos,
            BigDecimal valorFretes,
            BigDecimal valorTotalPedidos,
            BigDecimal saldoRetidoAtual,
            BigDecimal saldoLiberadoAtual,
            BigDecimal totalComissoes,
            long totalSaques,
            BigDecimal valorTotalSaques,
            long saquesPendentes,
            long saquesAprovados,
            long saquesRejeitados
    ) {}

    public record QuantidadePeriodoDTO(String data, long quantidade) {}
    public record ValoresPeriodoDTO(String data, BigDecimal produtos, BigDecimal frete, BigDecimal total) {}
    public record DistribuicaoDTO(String nome, long quantidade) {}
}
