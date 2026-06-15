import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { api } from '../config/api';

function Carteira() {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [carteira, setCarteira] = useState(null);
  const [historico, setHistorico] = useState([]);
  const [saques, setSaques] = useState([]);
  const [aba, setAba] = useState('historico');
  const [valorSaque, setValorSaque] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingSaque, setLoadingSaque] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  const bg = isDark ? '#0f0f0f' : '#f9f5f6';
  const card = isDark ? '#141414' : '#fff';
  const border = isDark ? '#2a2a2a' : '#f0e6e8';
  const text = isDark ? '#e0e0e0' : '#333';
  const sub = isDark ? '#888' : '#666';

  const formatBRL = (v) => Number(v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  useEffect(() => {
    Promise.all([api.carteira(), api.historicoCarteira(), api.meusSaques()])
      .then(([c, h, s]) => { setCarteira(c); setHistorico(h); setSaques(s); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const solicitarSaque = async () => {
    const valor = parseFloat(valorSaque);
    if (!valor || valor <= 0) { setErro('Informe um valor válido.'); return; }
    if (valor > carteira?.saldoLiberado) { setErro('Saldo liberado insuficiente.'); return; }
    setLoadingSaque(true); setErro(''); setSucesso('');
    try {
      await api.solicitarSaque(valor);
      setSucesso('Saque solicitado com sucesso!');
      setValorSaque('');
      const [c, s] = await Promise.all([api.carteira(), api.meusSaques()]);
      setCarteira(c); setSaques(s);
    } catch { setErro('Erro ao solicitar saque.'); }
    finally { setLoadingSaque(false); }
  };

  const statusSaque = { PENDENTE: { color: '#ff9800', label: 'Pendente' }, APROVADO: { color: '#4caf50', label: 'Aprovado' }, REJEITADO: { color: '#ef4444', label: 'Rejeitado' } };
  const tipoIcon = { VENDA: '💰', COMISSAO: '📊', SAQUE: '💸', ESTORNO: '↩️' };

  const tabBtn = (id, label) => (
    <button key={id} onClick={() => setAba(id)} style={{
      padding: '10px 20px', borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: 'pointer',
      border: `1px solid ${aba === id ? '#c0606a' : border}`,
      backgroundColor: aba === id ? '#c0606a' : 'transparent',
      color: aba === id ? 'white' : sub
    }}>{label}</button>
  );

  return (
    <div style={{ minHeight: '100vh', backgroundColor: bg, fontFamily: "'Inter', system-ui, sans-serif" }}>
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        backgroundColor: isDark ? 'rgba(18,18,18,0.95)' : 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(20px)', borderBottom: `1px solid ${border}`,
        padding: '0 24px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <button onClick={() => navigate('/home')} style={{ background: 'none', border: `1px solid ${border}`, borderRadius: '8px', padding: '8px 14px', cursor: 'pointer', color: sub, fontSize: '13px' }}>← Voltar</button>
        <span style={{ fontSize: '16px', fontWeight: '700', color: '#c0606a' }}>💼 Meus Ganhos</span>
        <div style={{ width: '80px' }} />
      </nav>

      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '32px 16px' }}>
        {loading ? <p style={{ textAlign: 'center', color: sub }}>Carregando...</p> : (
          <>
            {/* Cards de saldo */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '28px' }}>
              {[
                { label: 'Saldo Retido', valor: carteira?.saldoRetido, color: '#ff9800', emoji: '🔒' },
                { label: 'Saldo Liberado', valor: carteira?.saldoLiberado, color: '#4caf50', emoji: '✅' },
              ].map(({ label, valor, color, emoji }) => (
                <div key={label} style={{ backgroundColor: card, borderRadius: '16px', border: `1px solid ${border}`, padding: '20px', textAlign: 'center' }}>
                  <div style={{ fontSize: '28px', marginBottom: '8px' }}>{emoji}</div>
                  <div style={{ fontSize: '22px', fontWeight: '800', color, marginBottom: '4px' }}>{formatBRL(valor)}</div>
                  <div style={{ fontSize: '12px', color: sub }}>{label}</div>
                </div>
              ))}
            </div>

            {/* Solicitar saque */}
            <div style={{ backgroundColor: card, borderRadius: '16px', border: `1px solid ${border}`, padding: '20px', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: '700', color: text, margin: '0 0 14px' }}>💸 Solicitar Saque</h3>
              <p style={{ fontSize: '13px', color: sub, margin: '0 0 12px' }}>Disponível: <strong style={{ color: '#4caf50' }}>{formatBRL(carteira?.saldoLiberado)}</strong></p>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input
                  type="number" min="0" step="0.01"
                  value={valorSaque}
                  onChange={e => { setValorSaque(e.target.value); setErro(''); setSucesso(''); }}
                  placeholder="R$ 0,00"
                  style={{ flex: 1, padding: '12px 14px', borderRadius: '10px', fontSize: '14px', border: `1px solid ${border}`, backgroundColor: isDark ? '#1a1a1a' : '#f9f5f6', color: text, outline: 'none' }}
                />
                <button onClick={solicitarSaque} disabled={loadingSaque} style={{
                  padding: '12px 20px', borderRadius: '10px', border: 'none',
                  backgroundColor: '#4caf50', color: 'white', fontSize: '14px', fontWeight: '700', cursor: 'pointer', whiteSpace: 'nowrap'
                }}>{loadingSaque ? '...' : 'Solicitar'}</button>
              </div>
              {erro && <p style={{ color: '#ef4444', fontSize: '13px', marginTop: '8px' }}>{erro}</p>}
              {sucesso && <p style={{ color: '#4caf50', fontSize: '13px', marginTop: '8px' }}>{sucesso}</p>}
            </div>

            {/* Abas */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
              {tabBtn('historico', `📋 Histórico (${historico.length})`)}
              {tabBtn('saques', `💸 Saques (${saques.length})`)}
            </div>

            {/* Histórico */}
            {aba === 'historico' && (
              historico.length === 0
                ? <p style={{ textAlign: 'center', color: sub, padding: '40px 0' }}>Nenhuma movimentação ainda.</p>
                : <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {historico.map(m => (
                    <div key={m.id} style={{ backgroundColor: card, borderRadius: '12px', border: `1px solid ${border}`, padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontSize: '22px' }}>{tipoIcon[m.tipo] || '💰'}</span>
                        <div>
                          <p style={{ fontSize: '13px', fontWeight: '700', color: text, margin: '0 0 2px' }}>{m.tipo}</p>
                          <p style={{ fontSize: '11px', color: sub, margin: 0 }}>{new Date(m.createdAt).toLocaleDateString('pt-BR')}</p>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ fontSize: '15px', fontWeight: '800', color: m.valor >= 0 ? '#4caf50' : '#ef4444', margin: '0 0 2px' }}>
                          {m.valor >= 0 ? '+' : ''}{formatBRL(m.valor)}
                        </p>
                        <span style={{ fontSize: '11px', color: sub }}>{m.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
            )}

            {/* Saques */}
            {aba === 'saques' && (
              saques.length === 0
                ? <p style={{ textAlign: 'center', color: sub, padding: '40px 0' }}>Nenhum saque solicitado ainda.</p>
                : <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {saques.map(s => {
                    const st = statusSaque[s.status] || { color: sub, label: s.status };
                    return (
                      <div key={s.id} style={{ backgroundColor: card, borderRadius: '12px', border: `1px solid ${border}`, padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <p style={{ fontSize: '14px', fontWeight: '700', color: text, margin: '0 0 4px' }}>{formatBRL(s.valor)}</p>
                          <p style={{ fontSize: '11px', color: sub, margin: 0 }}>{new Date(s.dataSolicitacao).toLocaleDateString('pt-BR')}</p>
                        </div>
                        <span style={{ fontSize: '12px', fontWeight: '700', color: st.color, padding: '4px 10px', borderRadius: '20px', border: `1px solid ${st.color}`, backgroundColor: `${st.color}15` }}>{st.label}</span>
                      </div>
                    );
                  })}
                </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Carteira;
