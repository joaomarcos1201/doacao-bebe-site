package com.doacaobebe.service;

import com.doacaobebe.dto.DashboardAdminDTO;
import com.doacaobebe.repository.*;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.TemporalAdjusters;
import java.util.*;

@Service
public class AdminDashboardService {

    private static final Set<String> STATUS_VENDA = Set.of("APROVADO", "FINALIZADO", "LIBERADO");
    private static final Set<String> STATUS_VENDA_CONCLUIDA = Set.of("FINALIZADO", "LIBERADO");

    private final UsuarioRepository usuarioRepository;
    private final ProdutoRepository produtoRepository;
    private final PedidoRepository pedidoRepository;
    private final CarteiraRepository carteiraRepository;
    private final MovimentacaoFinanceiraRepository movimentacaoRepository;
    private final SaqueRepository saqueRepository;

    public AdminDashboardService(UsuarioRepository usuarioRepository,
                                 ProdutoRepository produtoRepository,
                                 PedidoRepository pedidoRepository,
                                 CarteiraRepository carteiraRepository,
                                 MovimentacaoFinanceiraRepository movimentacaoRepository,
                                 SaqueRepository saqueRepository) {
        this.usuarioRepository = usuarioRepository;
        this.produtoRepository = produtoRepository;
        this.pedidoRepository = pedidoRepository;
        this.carteiraRepository = carteiraRepository;
        this.movimentacaoRepository = movimentacaoRepository;
        this.saqueRepository = saqueRepository;
    }

    public DashboardAdminDTO buscar(String periodo) {
        String periodoNormalizado = normalizarPeriodo(periodo);
        LocalDateTime inicio = calcularInicio(periodoNormalizado);

        List<Object[]> usuariosDados = usuarioRepository.buscarDadosDashboard(inicio);
        List<Object[]> produtosDados = produtoRepository.buscarDadosDashboard(inicio);
        List<Object[]> pedidosDados = pedidoRepository.buscarDadosDashboard(inicio);
        List<Object[]> saquesDados = saqueRepository.buscarDadosDashboard(inicio);

        Map<String, Long> usuarios = resumoUsuarios(usuariosDados, produtosDados);
        Map<String, Long> produtos = resumoProdutos(produtosDados);
        Map<String, Long> pedidos = resumoPedidos(pedidosDados);

        Object[] saldos = carteiraRepository.buscarSaldosDashboard();
        BigDecimal saldoRetido = valor(safeAggregate(saldos, 0));
        BigDecimal saldoLiberado = valor(safeAggregate(saldos, 1));
        BigDecimal totalComissoes = valor(movimentacaoRepository.somarComissoesDashboard(inicio)).abs();

        BigDecimal produtosVendidos = BigDecimal.ZERO;
        BigDecimal fretes = BigDecimal.ZERO;
        BigDecimal totalPedidos = BigDecimal.ZERO;
        for (Object[] dado : pedidosDados) {
            if (STATUS_VENDA.contains(status(dado[1]))) {
                produtosVendidos = produtosVendidos.add(valor(dado[2]));
                fretes = fretes.add(valor(dado[3]));
                totalPedidos = totalPedidos.add(valor(dado[4]));
            }
        }

        long saquesPendentes = contarStatus(saquesDados, "PENDENTE");
        long saquesAprovados = contarStatus(saquesDados, "APROVADO");
        long saquesRejeitados = contarStatus(saquesDados, "REJEITADO");
        BigDecimal valorSaques = saquesDados.stream()
                .map(d -> valor(d[1])).reduce(BigDecimal.ZERO, BigDecimal::add);

        DashboardAdminDTO.FinanceiroDTO financeiro = new DashboardAdminDTO.FinanceiroDTO(
                produtosVendidos, fretes, totalPedidos, saldoRetido, saldoLiberado, totalComissoes,
                saquesDados.size(), valorSaques, saquesPendentes, saquesAprovados, saquesRejeitados
        );

        return new DashboardAdminDTO(
                periodoNormalizado, usuarios, produtos, pedidos, financeiro,
                serieQuantidade(usuariosDados, 0), serieQuantidade(produtosDados, 0),
                serieQuantidade(pedidosDados, 0), serieValores(pedidosDados),
                distribuir(produtosDados, 1), distribuir(pedidosDados, 1),
                distribuir(produtosDados, 3), categoriasVendas(pedidosDados)
        );
    }

    private Map<String, Long> resumoUsuarios(List<Object[]> dados, List<Object[]> produtos) {
        Map<String, Long> r = new LinkedHashMap<>();
        r.put("total", (long) dados.size());
        r.put("ativos", contarStatus(dados, 1, "ATIVO"));
        r.put("inativos", contarStatus(dados, 1, "INATIVO"));
        r.put("administradores", contarStatus(dados, 2, "ADMIN"));
        r.put("anunciantes", produtos.stream().map(d -> d[4]).filter(Objects::nonNull).distinct().count());
        return r;
    }

    private Map<String, Long> resumoProdutos(List<Object[]> dados) {
        Map<String, Long> r = new LinkedHashMap<>();
        r.put("total", (long) dados.size());
        r.put("emAnalise", contarStatus(dados, 1, "EM_ANALISE"));
        r.put("disponiveis", contarQualquerStatus(dados, 1, Set.of("DISPONIVEL", "ATIVO", "APROVADO")));
        r.put("reservados", contarStatus(dados, 1, "RESERVADO"));
        r.put("vendidos", contarStatus(dados, 1, "VENDIDO"));
        r.put("reprovados", contarQualquerStatus(dados, 1, Set.of("REPROVADO", "REJEITADO")));
        r.put("removidosInativos", dados.stream().filter(d -> "REMOVIDO".equals(status(d[2])) || "INATIVO".equals(status(d[1]))).count());
        return r;
    }

    private Map<String, Long> resumoPedidos(List<Object[]> dados) {
        Map<String, Long> r = new LinkedHashMap<>();
        r.put("total", (long) dados.size());
        for (String s : List.of("PENDENTE", "APROVADO", "FINALIZADO", "LIBERADO", "CANCELADO", "REJEITADO", "ESTORNADO")) {
            r.put(s.toLowerCase(Locale.ROOT), contarStatus(dados, 1, s));
        }
        return r;
    }

    private List<DashboardAdminDTO.QuantidadePeriodoDTO> serieQuantidade(List<Object[]> dados, int dataIndex) {
        Map<LocalDate, Long> serie = new TreeMap<>();
        for (Object[] dado : dados) {
            if (dado[dataIndex] instanceof LocalDateTime data) serie.merge(data.toLocalDate(), 1L, Long::sum);
        }
        return serie.entrySet().stream()
                .map(e -> new DashboardAdminDTO.QuantidadePeriodoDTO(e.getKey().toString(), e.getValue())).toList();
    }

    private List<DashboardAdminDTO.ValoresPeriodoDTO> serieValores(List<Object[]> dados) {
        Map<LocalDate, BigDecimal[]> serie = new TreeMap<>();
        for (Object[] dado : dados) {
            if (!(dado[0] instanceof LocalDateTime data) || !STATUS_VENDA.contains(status(dado[1]))) continue;
            BigDecimal[] totais = serie.computeIfAbsent(data.toLocalDate(), k -> new BigDecimal[]{BigDecimal.ZERO, BigDecimal.ZERO, BigDecimal.ZERO});
            totais[0] = totais[0].add(valor(dado[2]));
            totais[1] = totais[1].add(valor(dado[3]));
            totais[2] = totais[2].add(valor(dado[4]));
        }
        return serie.entrySet().stream().map(e -> new DashboardAdminDTO.ValoresPeriodoDTO(
                e.getKey().toString(), e.getValue()[0], e.getValue()[1], e.getValue()[2])).toList();
    }

    private List<DashboardAdminDTO.DistribuicaoDTO> distribuir(List<Object[]> dados, int index) {
        Map<String, Long> valores = new HashMap<>();
        for (Object[] dado : dados) valores.merge(rotulo(dado[index]), 1L, Long::sum);
        return ordenar(valores);
    }

    private List<DashboardAdminDTO.DistribuicaoDTO> categoriasVendas(List<Object[]> dados) {
        Map<String, Long> valores = new HashMap<>();
        for (Object[] dado : dados) {
            if (STATUS_VENDA_CONCLUIDA.contains(status(dado[1]))) valores.merge(rotulo(dado[5]), 1L, Long::sum);
        }
        return ordenar(valores);
    }

    private List<DashboardAdminDTO.DistribuicaoDTO> ordenar(Map<String, Long> valores) {
        return valores.entrySet().stream().sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .map(e -> new DashboardAdminDTO.DistribuicaoDTO(e.getKey(), e.getValue())).toList();
    }

    private long contarStatus(List<Object[]> dados, String esperado) { return contarStatus(dados, 0, esperado); }
    private long contarStatus(List<Object[]> dados, int index, String esperado) {
        return dados.stream().filter(d -> esperado.equals(status(d[index]))).count();
    }
    private long contarQualquerStatus(List<Object[]> dados, int index, Set<String> esperados) {
        return dados.stream().filter(d -> esperados.contains(status(d[index]))).count();
    }

    private String normalizarPeriodo(String periodo) {
        String p = periodo == null ? "7d" : periodo.toLowerCase(Locale.ROOT);
        if (!Set.of("hoje", "7d", "30d", "mes", "total").contains(p)) {
            throw new IllegalArgumentException("Período inválido.");
        }
        return p;
    }

    private LocalDateTime calcularInicio(String periodo) {
        LocalDate hoje = LocalDate.now();
        return switch (periodo) {
            case "hoje" -> hoje.atStartOfDay();
            case "7d" -> hoje.minusDays(6).atStartOfDay();
            case "30d" -> hoje.minusDays(29).atStartOfDay();
            case "mes" -> hoje.with(TemporalAdjusters.firstDayOfMonth()).atStartOfDay();
            default -> null;
        };
    }

    private Object safeAggregate(Object[] valores, int index) {
        return valores != null && valores.length > index ? valores[index] : BigDecimal.ZERO;
    }
    private BigDecimal valor(Object v) { return v instanceof BigDecimal b ? b : BigDecimal.ZERO; }
    private String status(Object v) { return v == null ? "SEM_STATUS" : v.toString().trim().toUpperCase(Locale.ROOT); }
    private String rotulo(Object v) { return v == null || v.toString().isBlank() ? "Não informado" : v.toString(); }
}
