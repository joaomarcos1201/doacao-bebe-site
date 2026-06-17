import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useProdutos } from '../context/ProdutosContext';
import { useTheme } from '../context/ThemeContext';

function DetalhesProduto() {
  const { id } = useParams();
  const { produtos } = useProdutos();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const produto = produtos.find(p => p.id === parseInt(id));

  const nav = (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100,
      backgroundColor: isDark ? 'rgba(18,18,18,0.95)' : 'rgba(255,255,255,0.95)',
      backdropFilter: 'blur(20px)', borderBottom: `1px solid ${isDark ? '#2a2a2a' : '#f0e6e8'}`,
      padding: '0 24px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
    }}>
      <button onClick={() => navigate('/home')} style={{
        padding: '8px 16px', borderRadius: '8px', border: `1px solid ${isDark ? '#333' : '#e8d0d4'}`,
        backgroundColor: 'transparent', color: isDark ? '#aaa' : '#888', cursor: 'pointer', fontSize: '13px'
      }}>← Voltar</button>
      <button onClick={toggleTheme} style={{
        width: '36px', height: '36px', borderRadius: '50%', border: `1px solid ${isDark ? '#333' : '#e8d0d4'}`,
        backgroundColor: 'transparent', cursor: 'pointer', fontSize: '16px'
      }}>{isDark ? '☀️' : '🌙'}</button>
    </nav>
  );

  if (!produto) return (
    <div style={{ minHeight: '100vh', backgroundColor: isDark ? '#0f0f0f' : '#f9f5f6', fontFamily: "'Inter', system-ui, sans-serif" }}>
      {nav}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 64px)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
          <h2 style={{ color: isDark ? '#e0e0e0' : '#333' }}>Produto não encontrado</h2>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', backgroundColor: isDark ? '#0f0f0f' : '#f9f5f6', fontFamily: "'Inter', system-ui, sans-serif" }}>
      {nav}
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px', alignItems: 'start' }}>

          {/* Imagem + Nome + Descrição */}
          <div>
            <div style={{
              borderRadius: '20px', overflow: 'hidden',
              backgroundColor: isDark ? '#141414' : '#fff',
              border: `1px solid ${isDark ? '#2a2a2a' : '#f0e6e8'}`,
              aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              {produto.foto ? (
                <img src={`data:image/jpeg;base64,${produto.foto}`} alt={produto.nome}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span style={{ fontSize: '64px', opacity: 0.2 }}>📦</span>
              )}
            </div>
            <h1 style={{ fontSize: '24px', fontWeight: '800', color: isDark ? '#f0e0e2' : '#2d1518', margin: '20px 0 8px', letterSpacing: '-0.5px' }}>
              {produto.nome}
            </h1>
            <p style={{ fontSize: '14px', color: isDark ? '#bbb' : '#555', margin: 0, lineHeight: '1.7' }}>{produto.descricao}</p>
          </div>

          {/* Informações */}
          <div style={{
            border: `1px solid ${isDark ? '#2a2a2a' : '#e8d0d4'}`,
            borderRadius: '20px',
            padding: '28px',
            backgroundColor: isDark ? '#141414' : '#fff',
            boxShadow: isDark ? '0 2px 16px rgba(0,0,0,0.3)' : '0 2px 16px rgba(232,138,162,0.08)'
          }}>
            {/* Tags */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
              {produto.categoria && (
                <span style={{
                  padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: '600',
                  backgroundColor: isDark ? '#2d1518' : '#fde8ec', color: '#c0606a', textTransform: 'capitalize'
                }}>{produto.categoria}</span>
              )}
              {produto.condicao && (
                <span style={{
                  padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: '600',
                  backgroundColor: isDark ? '#1a2a1a' : '#e8f5e9', color: '#4caf50', textTransform: 'capitalize'
                }}>{produto.condicao}</span>
              )}
            </div>

            {/* Nome */}

            {/* Divisor */}
            <div style={{ height: '1px', backgroundColor: isDark ? '#2a2a2a' : '#f0e6e8', marginBottom: '20px' }} />

            {/* Descrição */}

            {/* Preço */}
            <div style={{ marginBottom: '16px' }}>
              <p style={{ fontSize: '11px', fontWeight: '700', color: isDark ? '#666' : '#bbb', letterSpacing: '1px', textTransform: 'uppercase', margin: '0 0 6px' }}>Valor</p>
              <p style={{ fontSize: '28px', fontWeight: '800', color: '#c0606a', margin: 0 }}>
                {produto.preco ? `R$ ${parseFloat(produto.preco).toFixed(2).replace('.', ',')}` : 'A combinar'}
              </p>
            </div>

            {/* Divisor */}
            <div style={{ height: '1px', backgroundColor: isDark ? '#2a2a2a' : '#f0e6e8', marginBottom: '16px' }} />

            {/* Vendedor */}
            {produto.doador && (
              <>
                <div style={{ height: '1px', backgroundColor: isDark ? '#2a2a2a' : '#f0e6e8', marginBottom: '16px' }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#c0606a',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', fontSize: '14px', fontWeight: '700', flexShrink: 0
                  }}>{produto.doador.charAt(0).toUpperCase()}</div>
                  <div>
                    <p style={{ fontSize: '11px', color: isDark ? '#555' : '#bbb', margin: '0 0 2px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Vendedor</p>
                    <p style={{ fontSize: '14px', fontWeight: '600', color: isDark ? '#e0e0e0' : '#333', margin: 0 }}>{produto.doador}</p>
                  </div>
                </div>
              </>
            )}

            {/* Divisor */}
            <div style={{ height: '1px', backgroundColor: isDark ? '#2a2a2a' : '#f0e6e8', marginBottom: '20px' }} />

            {/* Botões */}
            <button onClick={() => navigate('/doacao')} style={{
              width: '100%', padding: '13px', borderRadius: '10px', border: 'none',
              backgroundColor: '#c0606a', color: 'white', fontSize: '14px', fontWeight: '600',
              cursor: 'pointer', marginBottom: '10px', letterSpacing: '0.3px',
              transition: 'opacity 0.2s'
            }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.88'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            >Comprar</button>
            <button onClick={() => navigate('/chat')} style={{
              width: '100%', padding: '13px', borderRadius: '10px',
              border: `1px solid ${isDark ? '#3a2020' : '#e8d0d4'}`,
              backgroundColor: 'transparent', color: isDark ? '#e0a0a8' : '#c0606a',
              fontSize: '14px', fontWeight: '600', cursor: 'pointer', letterSpacing: '0.3px',
              transition: 'background 0.2s'
            }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = isDark ? 'rgba(192,96,106,0.1)' : '#fdf0f2'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >💬 Bate-papo</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetalhesProduto;
