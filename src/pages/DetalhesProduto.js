import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { API_URL, api } from '../config/api';

function DetalhesProduto() {
  const { id } = useParams();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [produto, setProduto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cepFrete, setCepFrete] = useState('');
  const [frete, setFrete] = useState(null);
  const [calcFrete, setCalcFrete] = useState(false);
  const [loadFrete, setLoadFrete] = useState(false);

  const bg = isDark ? '#0f0f0f' : '#f9f5f6';
  const card = isDark ? '#141414' : '#fff';
  const border = isDark ? '#2a2a2a' : '#f0e6e8';
  const text = isDark ? '#f0e0e2' : '#2d1518';
  const sub = isDark ? '#888' : '#666';

  useEffect(() => {
    fetch(`${API_URL}/api/products/${id}`)
      .then(r => r.ok ? r.json() : null)
      .then(setProduto)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const formatBRL = (v) => Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const calcularFrete = async () => {
    if (cepFrete.replace(/\D/g, '').length !== 8) return;
    setLoadFrete(true);
    try {
      const data = await api.calcularFrete(produto.id, cepFrete.replace(/\D/g, ''));
      setFrete(data.valorFrete);
    } catch {}
    finally { setLoadFrete(false); }
  };

  const handleComprar = () => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/login'); return; }
    navigate('/checkout', { state: { produto } });
  };

  const nav = (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100,
      backgroundColor: isDark ? 'rgba(18,18,18,0.95)' : 'rgba(255,255,255,0.95)',
      backdropFilter: 'blur(20px)', borderBottom: `1px solid ${border}`,
      padding: '0 24px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
    }}>
      <button onClick={() => navigate('/home')} style={{
        padding: '8px 16px', borderRadius: '8px', border: `1px solid ${border}`,
        backgroundColor: 'transparent', color: sub, cursor: 'pointer', fontSize: '13px'
      }}>← Voltar</button>
      <button onClick={toggleTheme} style={{
        width: '36px', height: '36px', borderRadius: '50%', border: `1px solid ${border}`,
        backgroundColor: 'transparent', cursor: 'pointer', fontSize: '16px'
      }}>{isDark ? '☀️' : '🌙'}</button>
    </nav>
  );

  if (loading) return (
    <div style={{ minHeight: '100vh', backgroundColor: bg }}>{nav}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 64px)' }}>
        <p style={{ color: sub }}>Carregando...</p>
      </div>
    </div>
  );

  if (!produto) return (
    <div style={{ minHeight: '100vh', backgroundColor: bg, fontFamily: "'Inter', system-ui, sans-serif" }}>
      {nav}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 64px)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
          <h2 style={{ color: text }}>Produto não encontrado</h2>
        </div>
      </div>
    </div>
  );

  const disponivel = produto.statusAnuncio === 'DISPONIVEL';

  return (
    <div style={{ minHeight: '100vh', backgroundColor: bg, fontFamily: "'Inter', system-ui, sans-serif" }}>
      {nav}
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px', alignItems: 'start' }}>

          {/* Imagem */}
          <div style={{
            borderRadius: '20px', overflow: 'hidden',
            backgroundColor: card, border: `1px solid ${border}`,
            aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            {produto.foto
              ? <img src={`data:image/jpeg;base64,${produto.foto}`} alt={produto.nome} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : <span style={{ fontSize: '64px', opacity: 0.2 }}>📦</span>}
          </div>

          {/* Informações */}
          <div>
            {/* Tags */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
              {produto.categoria && (
                <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', backgroundColor: isDark ? '#2d1518' : '#fde8ec', color: '#c0606a' }}>{produto.categoria}</span>
              )}
              {produto.conservacao && (
                <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', backgroundColor: isDark ? '#1a2a1a' : '#e8f5e9', color: '#4caf50' }}>{produto.conservacao}</span>
              )}
              {produto.marca && (
                <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', backgroundColor: isDark ? '#1a1a2a' : '#e8eaf6', color: '#5c6bc0' }}>{produto.marca}</span>
              )}
            </div>

            <h1 style={{ fontSize: '26px', fontWeight: '800', color: text, margin: '0 0 8px', letterSpacing: '-0.5px' }}>{produto.nome}</h1>

            {/* Preço */}
            {produto.preco && (
              <div style={{ margin: '0 0 20px' }}>
                <p style={{ fontSize: '32px', fontWeight: '800', color: '#c0606a', margin: 0 }}>{formatBRL(produto.preco)}</p>
                <p style={{ fontSize: '12px', color: sub, margin: '4px 0 0' }}>+ frete calculado abaixo</p>
              </div>
            )}

            {/* Descrição */}
            <div style={{ padding: '16px', borderRadius: '12px', marginBottom: '16px', backgroundColor: isDark ? '#1a1a1a' : '#fdf0f2', border: `1px solid ${border}` }}>
              <p style={{ fontSize: '13px', color: sub, margin: '0 0 4px', fontWeight: '600' }}>Descrição</p>
              <p style={{ fontSize: '14px', color: isDark ? '#ccc' : '#444', margin: 0, lineHeight: '1.6' }}>{produto.descricao}</p>
            </div>

            {/* Calcular frete */}
            {disponivel && (
              <div style={{ padding: '16px', borderRadius: '12px', marginBottom: '16px', backgroundColor: isDark ? '#1a1a1a' : '#fdf0f2', border: `1px solid ${border}` }}>
                <p style={{ fontSize: '13px', color: sub, margin: '0 0 10px', fontWeight: '600' }}>📦 Calcular Frete</p>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    value={cepFrete}
                    onChange={e => { setCepFrete(e.target.value.replace(/\D/g, '').replace(/(\d{5})(\d)/, '$1-$2').slice(0, 9)); setFrete(null); }}
                    placeholder="00000-000"
                    style={{ flex: 1, padding: '10px 12px', borderRadius: '8px', fontSize: '14px', border: `1px solid ${border}`, backgroundColor: isDark ? '#2a2a2a' : '#fff', color: text, outline: 'none' }}
                  />
                  <button onClick={calcularFrete} disabled={loadFrete} style={{ padding: '10px 16px', borderRadius: '8px', border: 'none', backgroundColor: '#c0606a', color: 'white', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}>
                    {loadFrete ? '...' : 'Calcular'}
                  </button>
                </div>
                {frete !== null && (
                  <p style={{ fontSize: '14px', color: '#4caf50', fontWeight: '700', margin: '10px 0 0' }}>
                    Frete: {formatBRL(frete)}
                    {produto.preco && <span style={{ color: sub, fontWeight: '400' }}> · Total: {formatBRL(Number(produto.preco) + Number(frete))}</span>}
                  </p>
                )}
              </div>
            )}

            {/* Botão comprar */}
            {disponivel ? (
              <button onClick={handleComprar} style={{
                width: '100%', padding: '16px', borderRadius: '12px', border: 'none',
                backgroundColor: '#c0606a', color: 'white', fontSize: '16px', fontWeight: '800',
                cursor: 'pointer', boxShadow: '0 4px 16px rgba(192,96,106,0.35)', letterSpacing: '0.5px'
              }}>
                🛒 COMPRAR AGORA
              </button>
            ) : (
              <div style={{ padding: '16px', borderRadius: '12px', textAlign: 'center', backgroundColor: isDark ? '#1a1a1a' : '#f5f5f5', border: `1px solid ${border}` }}>
                <p style={{ color: sub, fontSize: '14px', fontWeight: '600', margin: 0 }}>
                  {produto.statusAnuncio === 'RESERVADO' ? '⏳ Produto Reservado' : produto.statusAnuncio === 'VENDIDO' ? '✅ Produto Vendido' : '🔍 Em Análise'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetalhesProduto;
