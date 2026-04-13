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

  const handleWhatsApp = () => {
    const mensagem = `Olá! Tenho interesse no produto: ${produto.nome}`;
    const numero = produto.telefone?.replace(/\D/g, '') || '';
    window.open(`https://wa.me/55${numero}?text=${encodeURIComponent(mensagem)}`, '_blank');
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: isDark ? '#0f0f0f' : '#f9f5f6', fontFamily: "'Inter', system-ui, sans-serif" }}>
      {nav}
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px', alignItems: 'start' }}>

          {/* Imagem */}
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

          {/* Informações */}
          <div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
              {produto.categoria && (
                <span style={{
                  padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600',
                  backgroundColor: isDark ? '#2a1518' : '#fde8ec', color: '#c0606a', textTransform: 'capitalize'
                }}>{produto.categoria}</span>
              )}
              {produto.condicao && (
                <span style={{
                  padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600',
                  backgroundColor: isDark ? '#1a2a1a' : '#e8f5e9', color: '#4caf50', textTransform: 'capitalize'
                }}>{produto.condicao}</span>
              )}
            </div>

            <h1 style={{ fontSize: '28px', fontWeight: '800', color: isDark ? '#f0e0e2' : '#2d1518', margin: '0 0 16px', letterSpacing: '-0.5px' }}>
              {produto.nome}
            </h1>

            <div style={{
              padding: '16px', borderRadius: '12px', marginBottom: '20px',
              backgroundColor: isDark ? '#1a1a1a' : '#fdf8f8',
              border: `1px solid ${isDark ? '#2a2a2a' : '#f0e6e8'}`
            }}>
              <p style={{ fontSize: '14px', color: isDark ? '#888' : '#666', margin: '0 0 4px', fontWeight: '600' }}>Descrição</p>
              <p style={{ fontSize: '15px', color: isDark ? '#ccc' : '#444', margin: 0, lineHeight: '1.6' }}>{produto.descricao}</p>
            </div>

            {produto.doador && (
              <div style={{
                padding: '14px 16px', borderRadius: '12px', marginBottom: '12px',
                backgroundColor: isDark ? '#1a1a1a' : '#fdf8f8',
                border: `1px solid ${isDark ? '#2a2a2a' : '#f0e6e8'}`,
                display: 'flex', alignItems: 'center', gap: '10px'
              }}>
                <span style={{ fontSize: '20px' }}>👤</span>
                <div>
                  <p style={{ fontSize: '12px', color: isDark ? '#666' : '#aaa', margin: '0 0 2px' }}>Doado por</p>
                  <p style={{ fontSize: '14px', fontWeight: '600', color: isDark ? '#e0e0e0' : '#333', margin: 0 }}>{produto.doador}</p>
                </div>
              </div>
            )}

            {produto.telefone && (
              <div style={{
                padding: '14px 16px', borderRadius: '12px', marginBottom: '24px',
                backgroundColor: isDark ? '#1a1a1a' : '#fdf8f8',
                border: `1px solid ${isDark ? '#2a2a2a' : '#f0e6e8'}`,
                display: 'flex', alignItems: 'center', gap: '10px'
              }}>
                <span style={{ fontSize: '20px' }}>📱</span>
                <div>
                  <p style={{ fontSize: '12px', color: isDark ? '#666' : '#aaa', margin: '0 0 2px' }}>Contato</p>
                  <p style={{ fontSize: '14px', fontWeight: '600', color: isDark ? '#e0e0e0' : '#333', margin: 0 }}>{produto.telefone}</p>
                </div>
              </div>
            )}

            <button onClick={handleWhatsApp} style={{
              width: '100%', padding: '14px', borderRadius: '12px', border: 'none',
              backgroundColor: '#25D366', color: 'white', fontSize: '15px', fontWeight: '600',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              boxShadow: '0 4px 16px rgba(37,211,102,0.3)'
            }}>
              <span>💬</span> Entrar em Contato via WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetalhesProduto;
