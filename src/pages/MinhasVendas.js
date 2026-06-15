import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { api } from '../config/api';

function MinhasVendas() {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [vendas, setVendas] = useState([]);
  const [loading, setLoading] = useState(true);

  const bg = isDark ? '#0f0f0f' : '#f9f5f6';
  const card = isDark ? '#141414' : '#fff';
  const border = isDark ? '#2a2a2a' : '#f0e6e8';
  const text = isDark ? '#e0e0e0' : '#333';
  const sub = isDark ? '#888' : '#666';

  useEffect(() => {
    api.minhasVendas().then(setVendas).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const formatBRL = (v) => Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const statusColor = (s) => ({
    APROVADO: '#4caf50', FINALIZADO: '#4caf50',
    PENDENTE: '#ff9800', CANCELADO: '#ef4444', REJEITADO: '#ef4444'
  }[s] || '#888');

  const envioLabel = (s) => ({
    AGUARDANDO_POSTAGEM: '📦 Aguardando Postagem',
    POSTADO: '🚚 Postado',
    EM_TRANSITO: '🛣️ Em Trânsito',
    SAIU_ENTREGA: '🏃 Saiu para Entrega',
    ENTREGUE: '✅ Entregue',
  }[s] || s);

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
        <span style={{ fontSize: '16px', fontWeight: '700', color: '#c0606a' }}>🏷️ Minhas Vendas</span>
        <div style={{ width: '80px' }} />
      </nav>

      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '32px 16px' }}>
        {loading ? (
          <p style={{ textAlign: 'center', color: sub }}>Carregando...</p>
        ) : vendas.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏷️</div>
            <p style={{ color: sub, fontSize: '15px' }}>Você ainda não tem vendas.</p>
            <button onClick={() => navigate('/cadastrar-produto')} style={{
              marginTop: '16px', padding: '12px 24px', borderRadius: '12px', border: 'none',
              backgroundColor: '#c0606a', color: 'white', fontSize: '14px', fontWeight: '700', cursor: 'pointer'
            }}>Anunciar Produto</button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {vendas.map(venda => (
              <div key={venda.id} style={{ backgroundColor: card, borderRadius: '16px', border: `1px solid ${border}`, padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <p style={{ fontSize: '12px', color: sub, margin: '0 0 4px' }}>Pedido #{venda.id}</p>
                    <p style={{ fontSize: '15px', fontWeight: '700', color: text, margin: '0 0 4px' }}>{venda.produto?.nome}</p>
                    <p style={{ fontSize: '12px', color: sub, margin: 0 }}>Comprador: {venda.comprador?.nome}</p>
                  </div>
                  <span style={{ fontSize: '12px', fontWeight: '700', color: statusColor(venda.statusPagamento), padding: '4px 10px', borderRadius: '20px', border: `1px solid ${statusColor(venda.statusPagamento)}`, backgroundColor: `${statusColor(venda.statusPagamento)}15` }}>
                    {venda.statusPagamento}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                  <div style={{ padding: '10px', borderRadius: '8px', backgroundColor: isDark ? '#1a1a1a' : '#fdf0f2', border: `1px solid ${border}` }}>
                    <p style={{ fontSize: '11px', color: sub, margin: '0 0 4px', textTransform: 'uppercase' }}>Valor do Produto</p>
                    <p style={{ fontSize: '14px', fontWeight: '700', color: '#c0606a', margin: 0 }}>{formatBRL(venda.valorProduto)}</p>
                  </div>
                  <div style={{ padding: '10px', borderRadius: '8px', backgroundColor: isDark ? '#1a1a1a' : '#fdf0f2', border: `1px solid ${border}` }}>
                    <p style={{ fontSize: '11px', color: sub, margin: '0 0 4px', textTransform: 'uppercase' }}>Você recebe (90%)</p>
                    <p style={{ fontSize: '14px', fontWeight: '700', color: '#4caf50', margin: 0 }}>{formatBRL(venda.valorProduto * 0.9)}</p>
                  </div>
                </div>

                {venda.statusEnvio && (
                  <div style={{ padding: '10px 14px', borderRadius: '8px', backgroundColor: isDark ? '#1a1a1a' : '#f0f8f0', border: `1px solid ${border}` }}>
                    <p style={{ fontSize: '13px', color: text, margin: '0 0 2px', fontWeight: '600' }}>{envioLabel(venda.statusEnvio)}</p>
                    {venda.codigoRastreio && (
                      <p style={{ fontSize: '12px', color: sub, margin: 0 }}>Código: <strong>{venda.codigoRastreio}</strong></p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MinhasVendas;
