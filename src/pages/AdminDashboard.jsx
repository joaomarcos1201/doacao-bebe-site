import React, { useEffect, useMemo, useState } from 'react';
import { FaSyncAlt, FaUsers, FaBox, FaChartLine, FaDollarSign, FaExclamationCircle } from 'react-icons/fa';
import { api, API_URL } from '../config/api';
import { useTheme } from '../context/ThemeContext';
import { useProdutos } from '../context/ProdutosContext';
import AdminMetricsCards from '../pages/admin/AdminMetricsCards';
import AdminProductsTable from '../pages/admin/AdminProductsTable';
import AdminFinanceTable from '../pages/admin/AdminFinanceTable';
import ProductDetailsModal from '../pages/admin/ProductDetailsModal';
import AdminSidebar from '../pages/admin/AdminSidebar';
import AdminTopbar from '../pages/admin/AdminTopbar';

const formatBRL = (v) => Number(v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

function AdminDashboard() {
  const { isDark } = useTheme();
  const { produtos, carregarProdutos } = useProdutos();

  const [activeSection, setActiveSection] = useState('dashboard');

  // Finance / Metrics
  const [usuariosCount, setUsuariosCount] = useState(0);
  const [pedidos, setPedidos] = useState([]);
  const [saques, setSaques] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal product
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // System status badge (ONLINE/OFFLINE)
  const [backendOnline, setBackendOnline] = useState(true);

  const produtosPendentes = useMemo(
    () => produtos.filter(p => ['EM_ANALISE'].includes(p.statusAnuncio)),
    [produtos]
  );

  const produtosAprovados = useMemo(
    () => produtos.filter(p => ['APROVADO', 'DISPONIVEL', 'ATIVO'].includes(p.statusAnuncio)),
    [produtos]
  );

  const taxaPlataforma = 0.10; // deve refletir CarteiraService.COMISSAO_PERCENTUAL

  const faturamentoBruto = useMemo(() => {
    // Soma apenas pedidos com pagamento FINALIZADO
    // (pedido.valorTotal no model)
    return pedidos
      .filter(p => (p.statusPagamento || '').toUpperCase() === 'FINALIZADO')
      .reduce((acc, p) => acc + Number(p.valorTotal || 0), 0);
  }, [pedidos]);

  const lucroPlataforma = useMemo(() => {
    // CarteiraService usa 10% sobre valorProduto (não total com frete)
    // Aqui calculamos a mesma base aproximada:
    return pedidos
      .filter(p => (p.statusPagamento || '').toUpperCase() === 'FINALIZADO')
      .reduce((acc, p) => {
        const base = Number(p.valorProduto || 0);
        return acc + base * taxaPlataforma;
      }, 0);
  }, [pedidos]);

  const totalVendas = useMemo(() => {
    return pedidos.filter(p => (p.statusPagamento || '').toUpperCase() === 'FINALIZADO').length;
  }, [pedidos]);

  const vendasPorDia = useMemo(() => {
    // Agrupamento simples últimos 7 dias pela createdAt do pedido
    const days = 7;
    const now = new Date();
    const buckets = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      buckets.push({ key: d.toISOString().slice(0, 10), label: d.toLocaleDateString('pt-BR') });
    }
    const map = new Map(buckets.map(b => [b.key, 0]));

    pedidos
      .filter(p => (p.statusPagamento || '').toUpperCase() === 'FINALIZADO')
      .forEach(p => {
        const dt = p.createdAt ? new Date(p.createdAt) : null;
        if (!dt) return;
        const k = dt.toISOString().slice(0, 10);
        if (map.has(k)) map.set(k, map.get(k) + 1);
      });

    return buckets.map(b => ({ ...b, value: map.get(b.key) || 0 }));
  }, [pedidos]);

  const carregarTudo = async () => {
    setLoading(true);
    try {
      setBackendOnline(true);

      // Usuários
      const rUsuarios = await fetch(`${API_URL}/api/usuarios`);
      const usuarios = rUsuarios.ok ? await rUsuarios.json() : [];
      setUsuariosCount(usuarios.length);

      // Pedidos admin
      const pedidosResp = await api.todosPedidos();
      setPedidos(Array.isArray(pedidosResp) ? pedidosResp : []);

      // Saques admin
      const saquesResp = await api.todosSaques();
      setSaques(Array.isArray(saquesResp) ? saquesResp : []);

      // Produtos
      await carregarProdutos();
    } catch (e) {
      setBackendOnline(false);
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarTudo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refresh = async () => {
    await carregarTudo();
  };

  const openProduct = (produto) => {
    setSelectedProduct(produto);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: isDark ? '#0f0f0f' : '#f9f5f6', color: isDark ? '#e8d0d4' : '#333' }}>
      <AdminSidebar
        isDark={isDark}
        active={activeSection}
        onNavigate={setActiveSection}
        pendingProducts={produtosPendentes.length}
        pendingWithdrawals={saques.filter(s => s.status === 'PENDENTE').length}
      />

      <div style={{ marginLeft: 260 }}>
        <AdminTopbar
          isDark={isDark}
          backendOnline={backendOnline}
          onRefresh={refresh}
        />

        <div style={{ maxWidth: 1300, margin: '0 auto', padding: '28px 22px 40px' }}>
          {activeSection === 'dashboard' && (
            <>
              <AdminMetricsCards
                isDark={isDark}
                totalVendas={totalVendas}
                faturamentoBruto={faturamentoBruto}
                lucroPlataforma={lucroPlataforma}
                usuariosCount={usuariosCount}
                pendingProducts={produtosPendentes.length}
                pendingWithdrawals={saques.filter(s => s.status === 'PENDENTE').length}
                taxaPlataforma={taxaPlataforma}
                vendasPorDia={vendasPorDia}
              />

              <div style={{ height: 18 }} />

              <div style={{ background: isDark ? '#141414' : '#fff', border: `1px solid ${isDark ? '#2a2a2a' : '#f0e6e8'}`, borderRadius: 20, padding: 18 }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 12 }}>
                  <FaExclamationCircle color={isDark ? '#ff9800' : '#c0606a'} />
                  <h2 style={{ margin: 0, fontSize: 15, fontWeight: 800 }}>Aprovação rápida</h2>
                </div>
                <AdminProductsTable
                  isDark={isDark}
                  produtos={produtosPendentes}
                  onView={openProduct}
                  compact
                />
              </div>
            </>
          )}

          {activeSection === 'moderacao' && (
            <div style={{ background: isDark ? '#141414' : '#fff', border: `1px solid ${isDark ? '#2a2a2a' : '#f0e6e8'}`, borderRadius: 20, padding: 18 }}>
              <AdminProductsTable
                isDark={isDark}
                produtos={produtosPendentes}
                onView={openProduct}
              />
            </div>
          )}

          {activeSection === 'financeiro' && (
            <div style={{ background: isDark ? '#141414' : '#fff', border: `1px solid ${isDark ? '#2a2a2a' : '#f0e6e8'}`, borderRadius: 20, padding: 18 }}>
              <AdminFinanceTable
                isDark={isDark}
                pedidos={pedidos}
                onReleased={() => {
                  carregarTudo();
                }}
              />
            </div>
          )}

          {activeSection === 'usuarios' && (
            <div style={{ background: isDark ? '#141414' : '#fff', border: `1px solid ${isDark ? '#2a2a2a' : '#f0e6e8'}`, borderRadius: 20, padding: 18 }}>
              <h2 style={{ margin: 0, fontSize: 16, fontWeight: 900 }}>Em breve</h2>
              <p style={{ marginTop: 8, color: isDark ? '#888' : '#666', fontSize: 13 }}>Este módulo já pode ser evoluído usando /api/usuarios existentes.</p>
            </div>
          )}
        </div>
      </div>

      <ProductDetailsModal
        isDark={isDark}
        open={modalOpen}
        produto={selectedProduct}
        onClose={closeModal}
        onApprove={async (produtoId) => {
          // Regra: abrir modal e então aprovar/rejeitar
          // Use endpoints já existentes (produtos context)
          // Aprovar produto deve setar APROVADO; depois o backend/refletores mostrarão ONLINE se aplicável.
          await api.alterarStatusProduto(produtoId, 'APROVADO');
          await carregarProdutos();
          closeModal();
          await carregarTudo();
        }}
        onReject={async (produtoId) => {
          await api.alterarStatusProduto(produtoId, 'REPROVADO');
          await carregarProdutos();
          closeModal();
          await carregarTudo();
        }}
      />
    </div>
  );
}

export default AdminDashboard;

