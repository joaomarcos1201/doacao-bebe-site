import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { api } from '../config/api';

function Checkout() {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { produto } = location.state || {};

  const [cep, setCep] = useState('');
  const [etapa, setEtapa] = useState('cep'); // cep | resumo | pix
  const [frete, setFrete] = useState(null);
  const [checkout, setCheckout] = useState(null);
  const [copiado, setCopiado] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  const bg = isDark ? '#0f0f0f' : '#f9f5f6';
  const card = isDark ? '#141414' : '#fff';
  const border = isDark ? '#2a2a2a' : '#f0e6e8';
  const text = isDark ? '#e0e0e0' : '#333';
  const sub = isDark ? '#888' : '#666';

  useEffect(() => { if (!produto) navigate('/home'); }, [produto, navigate]);

  const calcularFrete = async () => {
    if (cep.replace(/\D/g, '').length !== 8) { setErro('CEP inválido.'); return; }
    setLoading(true); setErro('');
    try {
      const data = await api.calcularFrete(produto.id, cep.replace(/\D/g, ''));
      setFrete(data.valorFrete);
      setEtapa('resumo');
    } catch { setErro('Erro ao calcular frete. Tente novamente.'); }
    finally { setLoading(false); }
  };

  const confirmarCompra = async () => {
    setLoading(true); setErro('');
    try {
      const data = await api.checkout(produto.id, cep.replace(/\D/g, ''));
      if (data.pedidoId) { setCheckout(data); setEtapa('pix'); }
      else setErro(data.message || 'Erro ao processar compra.');
    } catch { setErro('Erro ao processar compra. Tente novamente.'); }
    finally { setLoading(false); }
  };

  const copiarPix = () => {
    navigator.clipboard.writeText(checkout.pixCopiaCola);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 3000);
  };

  const formatBRL = (v) => Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const containerStyle = {
    minHeight: '100vh', backgroundColor: bg,
    fontFamily: "'Inter', system-ui, sans-serif",
    display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 16px'
  };

  const cardStyle = {
    backgroundColor: card, borderRadius: '20px',
    border: `1px solid ${border}`, padding: '32px',
    width: '100%', maxWidth: '480px'
  };

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={{ width: '100%', maxWidth: '480px', display: 'flex', alignItems: 'center', marginBottom: '32px', gap: '12px' }}>
        <button onClick={() => navigate(-1)} style={{
          background: 'none', border: `1px solid ${border}`, borderRadius: '8px',
          padding: '8px 14px', cursor: 'pointer', color: sub, fontSize: '13px'
        }}>← Voltar</button>
        <h1 style={{ fontSize: '18px', fontWeight: '800', color: '#c0606a', margin: 0 }}>
          {etapa === 'cep' ? 'Calcular Frete' : etapa === 'resumo' ? 'Resumo do Pedido' : '💳 Pagamento PIX'}
        </h1>
      </div>

      <div style={cardStyle}>
        {/* Produto resumido */}
        {produto && etapa !== 'pix' && (
          <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', padding: '16px', borderRadius: '12px', backgroundColor: isDark ? '#1a1a1a' : '#fdf0f2', border: `1px solid ${border}` }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '8px', backgroundColor: isDark ? '#2a2a2a' : '#f0e6e8', flexShrink: 0, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {produto.foto ? <img src={`data:image/jpeg;base64,${produto.foto}`} alt={produto.nome} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <span style={{ fontSize: '24px', opacity: 0.3 }}>📦</span>}
            </div>
            <div>
              <p style={{ fontSize: '14px', fontWeight: '700', color: text, margin: '0 0 4px' }}>{produto.nome}</p>
              <p style={{ fontSize: '18px', fontWeight: '800', color: '#c0606a', margin: 0 }}>{formatBRL(produto.preco)}</p>
            </div>
          </div>
        )}

        {/* ETAPA CEP */}
        {etapa === 'cep' && (
          <div>
            <p style={{ fontSize: '14px', color: sub, marginBottom: '16px' }}>Informe seu CEP para calcular o frete:</p>
            <input
              value={cep}
              onChange={e => setCep(e.target.value.replace(/\D/g, '').replace(/(\d{5})(\d)/, '$1-$2').slice(0, 9))}
              placeholder="00000-000"
              style={{
                width: '100%', padding: '14px 16px', borderRadius: '12px', fontSize: '18px', fontWeight: '600',
                border: `2px solid ${erro ? '#ef4444' : border}`, backgroundColor: isDark ? '#1a1a1a' : '#f9f5f6',
                color: text, outline: 'none', boxSizing: 'border-box', letterSpacing: '2px', textAlign: 'center'
              }}
            />
            {erro && <p style={{ color: '#ef4444', fontSize: '13px', marginTop: '8px' }}>{erro}</p>}
            <button onClick={calcularFrete} disabled={loading} style={{
              width: '100%', marginTop: '20px', padding: '16px', borderRadius: '12px', border: 'none',
              backgroundColor: '#c0606a', color: 'white', fontSize: '15px', fontWeight: '700', cursor: 'pointer'
            }}>{loading ? 'Calculando...' : 'Calcular Frete →'}</button>
          </div>
        )}

        {/* ETAPA RESUMO */}
        {etapa === 'resumo' && (
          <div>
            {[
              { label: 'Produto', valor: produto.preco },
              { label: 'Frete', valor: frete },
            ].map(({ label, valor }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: `1px solid ${border}` }}>
                <span style={{ fontSize: '14px', color: sub }}>{label}</span>
                <span style={{ fontSize: '14px', fontWeight: '600', color: text }}>{formatBRL(valor)}</span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 0' }}>
              <span style={{ fontSize: '16px', fontWeight: '700', color: text }}>Total</span>
              <span style={{ fontSize: '20px', fontWeight: '800', color: '#c0606a' }}>{formatBRL(Number(produto.preco) + Number(frete))}</span>
            </div>
            {erro && <p style={{ color: '#ef4444', fontSize: '13px' }}>{erro}</p>}
            <button onClick={confirmarCompra} disabled={loading} style={{
              width: '100%', marginTop: '8px', padding: '16px', borderRadius: '12px', border: 'none',
              backgroundColor: '#c0606a', color: 'white', fontSize: '15px', fontWeight: '700', cursor: 'pointer'
            }}>{loading ? 'Gerando PIX...' : '💳 Gerar PIX'}</button>
            <button onClick={() => setEtapa('cep')} style={{
              width: '100%', marginTop: '10px', padding: '12px', borderRadius: '12px', border: `1px solid ${border}`,
              backgroundColor: 'transparent', color: sub, fontSize: '14px', cursor: 'pointer'
            }}>Alterar CEP</button>
          </div>
        )}

        {/* ETAPA PIX */}
        {etapa === 'pix' && checkout && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '8px' }}>📱</div>
            <h2 style={{ fontSize: '18px', fontWeight: '800', color: text, margin: '0 0 8px' }}>Pedido #{checkout.pedidoId}</h2>
            <p style={{ fontSize: '24px', fontWeight: '800', color: '#c0606a', margin: '0 0 24px' }}>{formatBRL(checkout.valorTotal)}</p>

            <div style={{ padding: '16px', borderRadius: '12px', backgroundColor: isDark ? '#1a1a1a' : '#fdf0f2', border: `1px solid ${border}`, marginBottom: '20px' }}>
              <p style={{ fontSize: '12px', color: sub, margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '700' }}>PIX Copia e Cola</p>
              <p style={{ fontSize: '11px', color: sub, wordBreak: 'break-all', margin: '0 0 12px', lineHeight: '1.6' }}>{checkout.pixCopiaCola}</p>
              <button onClick={copiarPix} style={{
                padding: '10px 20px', borderRadius: '8px', border: 'none',
                backgroundColor: copiado ? '#4caf50' : '#c0606a',
                color: 'white', fontSize: '13px', fontWeight: '700', cursor: 'pointer', transition: 'background 0.3s'
              }}>{copiado ? '✓ Copiado!' : 'Copiar Código'}</button>
            </div>

            <p style={{ fontSize: '12px', color: sub, lineHeight: '1.6' }}>
              Após o pagamento, você receberá a confirmação automaticamente. O produto ficará reservado para você.
            </p>

            <button onClick={() => navigate('/meus-pedidos')} style={{
              width: '100%', marginTop: '20px', padding: '14px', borderRadius: '12px', border: `1px solid ${border}`,
              backgroundColor: 'transparent', color: text, fontSize: '14px', fontWeight: '600', cursor: 'pointer'
            }}>Ver Meus Pedidos →</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Checkout;
