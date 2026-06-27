import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  Check,
  CheckCircle2,
  ChevronDown,
  Clipboard,
  CreditCard,
  ExternalLink,
  Home,
  Loader2,
  MapPin,
  Package,
  ShoppingBag,
  Truck,
  XCircle,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { api } from '../config/api';
import Notification from '../components/Notification';
import ConfirmDialog from '../components/ConfirmDialog';
import { useNotification } from '../hooks/useNotification';
import { useConfirm } from '../hooks/useConfirm';

const STATUS_ENVIO = {
  AGUARDANDO_POSTAGEM: { label: 'Produto separado', color: '#2196f3' },
  POSTADO: { label: 'Enviado', color: '#f59e0b' },
  EM_TRANSITO: { label: 'Em transito', color: '#eab308' },
  SAIU_ENTREGA: { label: 'Saiu para entrega', color: '#9c27b0' },
  ENTREGUE: { label: 'Entregue', color: '#166534' },
};

const STATUS_PAG = {
  PENDENTE: { label: 'Aguardando Pagamento', color: '#ff9800' },
  APROVADO: { label: 'Pago', color: '#4caf50' },
  FINALIZADO: { label: 'Finalizado', color: '#4caf50' },
  CANCELADO: { label: 'Cancelado', color: '#ef4444' },
  REJEITADO: { label: 'Recusado', color: '#ef4444' },
};

const TRACKING_STEPS = [
  { key: 'PEDIDO_CONFIRMADO', label: 'Pedido confirmado', Icon: Package, color: '#c0606a' },
  { key: 'PAGAMENTO_APROVADO', label: 'Pagamento aprovado', Icon: CreditCard, color: '#4caf50' },
  { key: 'AGUARDANDO_POSTAGEM', label: 'Produto separado', Icon: ShoppingBag, color: '#2196f3' },
  { key: 'POSTADO', label: 'Enviado', Icon: Truck, color: '#f59e0b' },
  { key: 'EM_TRANSITO', label: 'Em transito', Icon: MapPin, color: '#eab308' },
  { key: 'SAIU_ENTREGA', label: 'Saiu para entrega', Icon: Truck, color: '#9c27b0' },
  { key: 'ENTREGUE', label: 'Entregue', Icon: Home, color: '#166534' },
];

const PROBLEM_STATUSES = ['CANCELADO', 'REJEITADO', 'ESTORNADO', 'PROBLEMA', 'EXTRAVIADO'];
const HIDDEN_ORDER_STATUSES = ['CANCELADO', 'DEVOLVIDO'];

const pedidoVisivel = (pedido) => {
  const statusPagamento = (pedido.statusPagamento || '').toUpperCase();
  const statusEnvio = (pedido.statusEnvio || '').toUpperCase();
  return !HIDDEN_ORDER_STATUSES.includes(statusPagamento) && !HIDDEN_ORDER_STATUSES.includes(statusEnvio);
};

function MeusPedidos() {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pedidoAberto, setPedidoAberto] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [cancelandoId, setCancelandoId] = useState(null);
  const { notifications, showSuccess, showError, removeNotification } = useNotification();
  const { confirmState, showConfirm, handleConfirm, handleCancel } = useConfirm();

  const bg = isDark ? '#0f0f0f' : '#f9f5f6';
  const card = isDark ? '#141414' : '#fff';
  const cardSoft = isDark ? '#1a1a1a' : '#fdf0f2';
  const border = isDark ? '#2a2a2a' : '#f0e6e8';
  const text = isDark ? '#e0e0e0' : '#333';
  const sub = isDark ? '#888' : '#666';

  useEffect(() => {
    api.meusPedidos()
      .then(data => setPedidos(Array.isArray(data) ? data.filter(pedidoVisivel) : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const formatBRL = (v) => Number(v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const formatDate = (value) => {
    if (!value) return 'Nao informado';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return 'Nao informado';
    return date.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
  };

  const getCurrentStepIndex = (pedido) => {
    const statusPagamento = (pedido.statusPagamento || '').toUpperCase();
    const statusEnvio = (pedido.statusEnvio || '').toUpperCase();

    if (statusPagamento === 'FINALIZADO' || statusEnvio === 'ENTREGUE') return 6;
    if (statusEnvio) {
      const envioIndex = TRACKING_STEPS.findIndex(step => step.key === statusEnvio);
      if (envioIndex >= 0) return envioIndex;
    }
    if (statusPagamento === 'APROVADO') return 1;
    return 0;
  };

  const getStatusAtual = (pedido) => {
    const statusPagamento = (pedido.statusPagamento || '').toUpperCase();
    const statusEnvio = (pedido.statusEnvio || '').toUpperCase();
    if (PROBLEM_STATUSES.includes(statusPagamento) || PROBLEM_STATUSES.includes(statusEnvio)) {
      return { label: 'Atencao necessaria', color: '#ef4444', Icon: AlertTriangle };
    }
    if (STATUS_ENVIO[statusEnvio]) {
      return { ...STATUS_ENVIO[statusEnvio], Icon: TRACKING_STEPS[getCurrentStepIndex(pedido)]?.Icon || Package };
    }
    return { ...(STATUS_PAG[statusPagamento] || { label: statusPagamento || 'Pedido confirmado', color: '#c0606a' }), Icon: Package };
  };

  const getTrackingUrl = (pedido) =>
    pedido.urlRastreamento || pedido.trackingUrl || pedido.rastreamentoUrl || pedido.linkRastreamento || '';

  const copiarRastreio = async (pedido) => {
    if (!pedido.codigoRastreio) return;
    try {
      await navigator.clipboard.writeText(pedido.codigoRastreio);
      setCopiedId(pedido.id);
      setTimeout(() => setCopiedId(null), 1800);
    } catch {}
  };

  const abrirTransportadora = (pedido) => {
    const url = getTrackingUrl(pedido);
    if (url) window.open(url, '_blank', 'noopener,noreferrer');
  };

  const podeCancelarPedido = (pedido) => {
    const statusPagamento = (pedido.statusPagamento || '').toUpperCase();
    const statusEnvio = (pedido.statusEnvio || '').toUpperCase();
    return !['FINALIZADO', 'CANCELADO', 'DEVOLVIDO'].includes(statusPagamento) &&
      !['ENTREGUE', 'CANCELADO', 'DEVOLVIDO'].includes(statusEnvio);
  };

  const solicitarCancelamento = (pedido) => {
    showConfirm(
      'Cancelar pedido',
      'Tem certeza de que deseja cancelar este pedido? Esta ação não poderá ser desfeita.',
      () => cancelarPedido(pedido),
      'Confirmar Cancelamento',
      'Voltar'
    );
  };

  const cancelarPedido = async (pedido) => {
    setCancelandoId(pedido.id);
    try {
      await api.cancelarPedido(pedido.id);
      setPedidos(prev => prev.filter(item => item.id !== pedido.id));
      setPedidoAberto(prev => (prev === pedido.id ? null : prev));
      showSuccess('Pedido cancelado com sucesso.');
    } catch (error) {
      showError(error.message || 'Não foi possível cancelar o pedido.');
    } finally {
      setCancelandoId(null);
    }
  };

  const renderTimeline = (pedido) => {
    const currentIndex = getCurrentStepIndex(pedido);
    const hasProblem = PROBLEM_STATUSES.includes((pedido.statusPagamento || '').toUpperCase()) ||
      PROBLEM_STATUSES.includes((pedido.statusEnvio || '').toUpperCase());
    const progress = hasProblem ? 100 : (currentIndex / (TRACKING_STEPS.length - 1)) * 100;

    return (
      <div className="pedido-timeline-wrap" style={{ '--pedido-progress-height': `${progress}%` }}>
        <div
          className="pedido-timeline-line"
          style={{ backgroundColor: isDark ? '#2a2a2a' : '#f0e6e8' }}
        >
          <div
            className="pedido-timeline-progress"
            style={{ backgroundColor: hasProblem ? '#ef4444' : '#c0606a', width: `${progress}%` }}
          />
        </div>

        {TRACKING_STEPS.map((step, index) => {
          const Icon = step.Icon;
          const completed = !hasProblem && index < currentIndex;
          const current = !hasProblem && index === currentIndex;
          const disabled = hasProblem ? index > 0 : index > currentIndex;
          const color = completed || current ? step.color : sub;

          return (
            <div key={step.key} className={`pedido-timeline-step ${disabled ? 'is-disabled' : ''}`}>
              <div
                className="pedido-step-icon"
                style={{
                  color,
                  backgroundColor: completed || current ? `${step.color}18` : (isDark ? '#141414' : '#fff'),
                  borderColor: completed || current ? step.color : border,
                  boxShadow: current ? `0 0 0 4px ${step.color}20` : 'none',
                }}
              >
                {completed ? <Check size={16} strokeWidth={3} /> : <Icon size={16} strokeWidth={2.2} />}
              </div>
              <span style={{ color: completed || current ? text : sub, fontWeight: current ? 800 : 700 }}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  const renderAcompanhamento = (pedido) => {
    const statusAtual = getStatusAtual(pedido);
    const StatusIcon = statusAtual.Icon || Package;
    const trackingUrl = getTrackingUrl(pedido);
    const ultimaAtualizacao = pedido.updatedAt || pedido.dataAtualizacao || pedido.createdAt;

    return (
      <div className="pedido-track-section" style={{ borderTop: `1px solid ${border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '18px' }}>
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: 800, color: text, margin: '0 0 4px' }}>Acompanhar Pedido</h3>
            <p style={{ fontSize: '12px', color: sub, margin: 0 }}>Atualizacao visual baseada nos dados do pedido.</p>
          </div>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '7px',
              fontSize: '12px',
              fontWeight: 800,
              color: statusAtual.color,
              padding: '7px 12px',
              borderRadius: '999px',
              border: `1px solid ${statusAtual.color}45`,
              backgroundColor: `${statusAtual.color}15`,
              whiteSpace: 'nowrap',
            }}
          >
            <StatusIcon size={14} />
            {statusAtual.label}
          </span>
        </div>

        {renderTimeline(pedido)}

        <div className="pedido-envio-grid">
          {[
            { label: 'Codigo de rastreio', value: pedido.codigoRastreio || 'Ainda nao gerado' },
            { label: 'Transportadora', value: pedido.transportadora || 'Nao informada' },
            { label: 'Data da compra', value: formatDate(pedido.createdAt) },
            { label: 'Ultima atualizacao', value: formatDate(ultimaAtualizacao) },
          ].map(info => (
            <div
              key={info.label}
              className="pedido-info-card"
              style={{ backgroundColor: cardSoft, border: `1px solid ${border}` }}
            >
              <p style={{ fontSize: '11px', color: sub, margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 800 }}>{info.label}</p>
              <p style={{ fontSize: '13px', color: text, margin: 0, fontWeight: 700, overflowWrap: 'anywhere' }}>{info.value}</p>
            </div>
          ))}
        </div>

        <div className="pedido-action-row">
          <button
            onClick={() => copiarRastreio(pedido)}
            disabled={!pedido.codigoRastreio}
            className="pedido-action-btn"
            style={{
              border: `1px solid ${pedido.codigoRastreio ? '#c0606a' : border}`,
              backgroundColor: pedido.codigoRastreio ? '#c0606a' : 'transparent',
              color: pedido.codigoRastreio ? '#fff' : sub,
              cursor: pedido.codigoRastreio ? 'pointer' : 'not-allowed',
            }}
          >
            {copiedId === pedido.id ? <CheckCircle2 size={15} /> : <Clipboard size={15} />}
            {copiedId === pedido.id ? 'Codigo copiado' : 'Copiar codigo de rastreio'}
          </button>
          <button
            onClick={() => abrirTransportadora(pedido)}
            disabled={!trackingUrl}
            className="pedido-action-btn"
            style={{
              border: `1px solid ${trackingUrl ? '#f59e0b' : border}`,
              backgroundColor: trackingUrl ? '#fff7ed' : 'transparent',
              color: trackingUrl ? '#b45309' : sub,
              cursor: trackingUrl ? 'pointer' : 'not-allowed',
            }}
          >
            <ExternalLink size={15} />
            Rastrear na transportadora
          </button>
        </div>
      </div>
    );
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: bg, fontFamily: "'Inter', system-ui, sans-serif" }}>
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        backgroundColor: isDark ? 'rgba(18,18,18,0.95)' : 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(20px)', borderBottom: `1px solid ${border}`,
        padding: '0 24px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <button onClick={() => navigate('/home')} style={{
          background: 'none', border: `1px solid ${border}`, borderRadius: '8px',
          padding: '8px 14px', cursor: 'pointer', color: sub, fontSize: '13px'
        }}>Voltar</button>
        <span style={{ fontSize: '16px', fontWeight: '700', color: '#c0606a' }}>Meus Pedidos</span>
        <div style={{ width: '80px' }} />
      </nav>

      <div style={{ maxWidth: '980px', margin: '0 auto', padding: '32px 16px' }}>
        {loading ? (
          <div className="pedido-loading" style={{ backgroundColor: card, border: `1px solid ${border}` }}>
            <Loader2 size={24} color="#c0606a" className="pedido-loader-icon" />
            <p style={{ color: sub, fontSize: '14px', fontWeight: 700, margin: 0 }}>Carregando seus pedidos...</p>
          </div>
        ) : pedidos.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <ShoppingBag size={48} color="#c0606a" style={{ marginBottom: '16px' }} />
            <p style={{ color: sub, fontSize: '15px' }}>Voce ainda nao fez nenhuma compra.</p>
            <button onClick={() => navigate('/home')} style={{
              marginTop: '16px', padding: '12px 24px', borderRadius: '12px', border: 'none',
              backgroundColor: '#c0606a', color: 'white', fontSize: '14px', fontWeight: '700', cursor: 'pointer'
            }}>Ver Produtos</button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {pedidos.map(pedido => {
              const pag = STATUS_PAG[pedido.statusPagamento] || { label: pedido.statusPagamento || 'Pedido', color: sub };
              const aberto = pedidoAberto === pedido.id;
              return (
                <div
                  key={pedido.id}
                  className="pedido-card"
                  style={{ backgroundColor: card, borderRadius: '16px', border: `1px solid ${border}`, padding: '20px' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '16px' }}>
                    <div>
                      <p style={{ fontSize: '12px', color: sub, margin: '0 0 4px' }}>Pedido #{pedido.id}</p>
                      <p style={{ fontSize: '15px', fontWeight: '700', color: text, margin: 0 }}>{pedido.produto?.nome}</p>
                    </div>
                    <span style={{ fontSize: '12px', fontWeight: '700', color: pag.color, padding: '4px 10px', borderRadius: '20px', border: `1px solid ${pag.color}`, backgroundColor: `${pag.color}15`, whiteSpace: 'nowrap' }}>
                      {pag.label}
                    </span>
                  </div>

                  <div className="pedido-values-grid">
                    {[
                      { label: 'Produto', valor: formatBRL(pedido.valorProduto) },
                      { label: 'Frete', valor: formatBRL(pedido.valorFrete) },
                      { label: 'Total', valor: formatBRL(pedido.valorTotal) },
                    ].map(({ label, valor }) => (
                      <div key={label} style={{ padding: '10px', borderRadius: '8px', backgroundColor: cardSoft, border: `1px solid ${border}`, textAlign: 'center' }}>
                        <p style={{ fontSize: '11px', color: sub, margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</p>
                        <p style={{ fontSize: '13px', fontWeight: '700', color: text, margin: 0 }}>{valor}</p>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => setPedidoAberto(aberto ? null : pedido.id)}
                    className="pedido-toggle-btn"
                    style={{
                      color: '#c0606a',
                      border: `1px solid ${border}`,
                      backgroundColor: isDark ? '#1a1a1a' : '#fff',
                    }}
                  >
                    {aberto ? 'Ocultar acompanhamento' : 'Abrir acompanhamento'}
                    <ChevronDown size={16} style={{ transform: aberto ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.25s ease' }} />
                  </button>

                  {podeCancelarPedido(pedido) && (
                    <button
                      onClick={() => solicitarCancelamento(pedido)}
                      disabled={cancelandoId === pedido.id}
                      className="pedido-cancel-btn"
                    >
                      {cancelandoId === pedido.id ? <Loader2 size={15} className="pedido-loader-icon" /> : <XCircle size={15} />}
                      {cancelandoId === pedido.id ? 'Cancelando...' : 'Cancelar Pedido'}
                    </button>
                  )}

                  {aberto && renderAcompanhamento(pedido)}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {notifications.map(n => (
        <Notification key={n.id} message={n.message} type={n.type} duration={n.duration} onClose={() => removeNotification(n.id)} />
      ))}
      <ConfirmDialog
        isOpen={confirmState.isOpen}
        title={confirmState.title}
        message={confirmState.message}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        confirmText={confirmState.confirmText}
        cancelText={confirmState.cancelText}
      />
    </div>
  );
}

export default MeusPedidos;
