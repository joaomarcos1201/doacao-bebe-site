import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { api } from '../config/api';

const STATUS_ENVIO = {
  AGUARDANDO_POSTAGEM: { label: 'Aguardando Postagem', emoji: '📦', color: '#ff9800' },
  POSTADO: { label: 'Postado', emoji: '🚚', color: '#2196f3' },
  EM_TRANSITO: { label: 'Em Trânsito', emoji: '🛣️', color: '#2196f3' },
  SAIU_ENTREGA: { label: 'Saiu para Entrega', emoji: '🏃', color: '#9c27b0' },
  ENTREGUE: { label: 'Entregue', emoji: '✅', color: '#4caf50' },
};

const STATUS_PAG = {
  PENDENTE: { label: 'Aguardando Pagamento', color: '#ff9800' },
  APROVADO: { label: 'Pago', color: '#4caf50' },
  FINALIZADO: { label: 'Finalizado', color: '#4caf50' },
  CANCELADO: { label: 'Cancelado', color: '#ef4444' },
  REJEITADO: { label: 'Recusado', color: '#ef4444' },
};

function MeusPedidos() {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);

  const bg = isDark ? '#0f0f0f' : '#f9f5f6';
  const card = isDark ? '#141414' : '#fff';
  const border = isDark ? '#2a2a2a' : '#f0e6e8';
  const text = isDark ? '#e0e0e0' : '#333';
  const sub = isDark ? '#888' : '#666';

  useEffect(() => {
    api.meusPedidos().then(setPedidos).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const formatBRL = (v) => Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

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
        }}>← Voltar</button>
        <span style={{ fontSize: '16px', fontWeight: '700', color: '#c0606a' }}>📦 Meus Pedidos</span>
        <div style={{ width: '80px' }} />
      </nav>

      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '32px 16px' }}>
        {loading ? (
          <p style={{ textAlign: 'center', color: sub }}>Carregando...</p>
        ) : pedidos.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🛍️</div>
            <p style={{ color: sub, fontSize: '15px' }}>Você ainda não fez nenhuma compra.</p>
            <button onClick={() => navigate('/home')} style={{
              marginTop: '16px', padding: '12px 24px', borderRadius: '12px', border: 'none',
              backgroundColor: '#c0606a', color: 'white', fontSize: '14px', fontWeight: '700', cursor: 'pointer'
            }}>Ver Produtos</button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {pedidos.map(pedido => {
              const envio = STATUS_ENVIO[pedido.statusEnvio] || {};
              const pag = STATUS_PAG[pedido.statusPagamento] || { label: pedido.statusPagamento, color: sub };
              return (
                <div key={pedido.id} style={{ backgroundColor: card, borderRadius: '16px', border: `1px solid ${border}`, padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <div>
                      <p style={{ fontSize: '12px', color: sub, margin: '0 0 4px' }}>Pedido #{pedido.id}</p>
                      <p style={{ fontSize: '15px', fontWeight: '700', color: text, margin: 0 }}>{pedido.produto?.nome}</p>
                    </div>
                    <span style={{ fontSize: '12px', fontWeight: '700', color: pag.color, padding: '4px 10px', borderRadius: '20px', border: `1px solid ${pag.color}`, backgroundColor: `${pag.color}15` }}>
                      {pag.label}
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                    {[
                      { label: 'Produto', valor: formatBRL(pedido.valorProduto) },
                      { label: 'Frete', valor: formatBRL(pedido.valorFrete) },
                      { label: 'Total', valor: formatBRL(pedido.valorTotal) },
                    ].map(({ label, valor }) => (
                      <div key={label} style={{ padding: '10px', borderRadius: '8px', backgroundColor: isDark ? '#1a1a1a' : '#fdf0f2', border: `1px solid ${border}`, textAlign: 'center' }}>
                        <p style={{ fontSize: '11px', color: sub, margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</p>
                        <p style={{ fontSize: '13px', fontWeight: '700', color: text, margin: 0 }}>{valor}</p>
                      </div>
                    ))}
                  </div>

                  {pedido.statusEnvio && (
                    <div style={{ padding: '12px 16px', borderRadius: '10px', backgroundColor: `${envio.color}15`, border: `1px solid ${envio.color}30`, display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '20px' }}>{envio.emoji}</span>
                      <div>
                        <p style={{ fontSize: '13px', fontWeight: '700', color: envio.color, margin: 0 }}>{envio.label}</p>
                        {pedido.codigoRastreio && (
                          <p style={{ fontSize: '12px', color: sub, margin: '2px 0 0' }}>Rastreio: <strong>{pedido.codigoRastreio}</strong></p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default MeusPedidos;
