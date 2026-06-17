import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useProdutos } from '../context/ProdutosContext';
import { useTheme } from '../context/ThemeContext';
import { ArrowLeft, ChevronLeft, ChevronRight, MapPin, User, Tag, MessageCircle, ShoppingBag, Sun, Moon, Camera } from 'lucide-react';

function DetalhesProduto() {
  const { id } = useParams();
  const { produtos } = useProdutos();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [fotoIdx, setFotoIdx] = useState(0);

  const produto = produtos.find(p => p.id === parseInt(id));

  // Monta array de imagens (suporte a múltiplas no futuro)
  const fotos = produto?.foto ? [`data:image/jpeg;base64,${produto.foto}`] : [];

  const bg = isDark ? '#141414' : '#f5f0ee';
  const cardBg = isDark ? '#1c1c1c' : '#fdf9f7';
  const border = isDark ? '#2e2e2e' : '#e8ddd8';
  const textPrimary = isDark ? '#e8e0e0' : '#2d2020';
  const textSecondary = isDark ? '#7a7070' : '#8a7070';

  const nav = (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100,
      backgroundColor: isDark ? 'rgba(20,20,20,0.95)' : 'rgba(255,252,252,0.95)',
      backdropFilter: 'blur(20px)',
      borderBottom: `1px solid ${border}`,
      padding: '0 32px', height: '64px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between'
    }}>
      <button onClick={() => navigate('/home')} style={{
        display: 'flex', alignItems: 'center', gap: '8px',
        padding: '8px 16px', borderRadius: '10px',
        border: `1px solid ${border}`,
        backgroundColor: 'transparent', color: textSecondary,
        cursor: 'pointer', fontSize: '14px', fontWeight: '500',
        transition: 'all 0.2s'
      }}>
        <ArrowLeft size={16} /> Voltar
      </button>
      <button onClick={toggleTheme} style={{
        width: '36px', height: '36px', borderRadius: '10px',
        border: `1px solid ${border}`,
        backgroundColor: 'transparent', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        {isDark ? <Sun size={16} color="#f0c060" /> : <Moon size={16} color="#6b7280" />}
      </button>
    </nav>
  );

  if (!produto) return (
    <div style={{ minHeight: '100vh', backgroundColor: bg, fontFamily: "'Inter', system-ui, sans-serif" }}>
      {nav}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 64px)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '56px', marginBottom: '16px' }}>🔍</div>
          <h2 style={{ color: textPrimary, fontSize: '20px' }}>Produto não encontrado</h2>
          <p style={{ color: textSecondary, fontSize: '14px', marginTop: '8px' }}>Este anúncio pode ter sido removido.</p>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', backgroundColor: bg, fontFamily: "'Inter', system-ui, sans-serif" }}>
      {nav}

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>

        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
          <span style={{ fontSize: '13px', color: textSecondary, cursor: 'pointer' }} onClick={() => navigate('/home')}>Início</span>
          <span style={{ fontSize: '13px', color: textSecondary }}>/</span>
          {produto.categoria && <span style={{ fontSize: '13px', color: textSecondary, textTransform: 'capitalize' }}>{produto.categoria}</span>}
          {produto.categoria && <span style={{ fontSize: '13px', color: textSecondary }}>/</span>}
          <span style={{ fontSize: '13px', color: textPrimary, fontWeight: '500' }}>{produto.nome}</span>
        </div>

        {/* Layout duas colunas */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.6fr) minmax(0, 1fr)',
          gap: '28px',
          alignItems: 'start'
        }}>

          {/* ===== COLUNA ESQUERDA — GALERIA ===== */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

            {/* Imagem principal */}
            <div style={{
              position: 'relative',
              borderRadius: '16px',
              overflow: 'hidden',
              backgroundColor: isDark ? '#202020' : '#fdf6f6',
              border: `1px solid ${border}`,
              aspectRatio: '4/3',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              {fotos.length > 0 ? (
                <img
                  src={fotos[fotoIdx]}
                  alt={produto.nome}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                  <Camera size={48} color={isDark ? '#333' : '#d1d5db'} />
                  <span style={{ fontSize: '14px', color: textSecondary }}>Sem imagem</span>
                </div>
              )}

              {/* Botões navegação */}
              {fotos.length > 1 && (
                <>
                  <button onClick={() => setFotoIdx(i => (i - 1 + fotos.length) % fotos.length)} style={{
                    position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
                    width: '40px', height: '40px', borderRadius: '50%',
                    backgroundColor: 'rgba(255,255,255,0.9)', border: 'none',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                  }}>
                    <ChevronLeft size={20} color="#374151" />
                  </button>
                  <button onClick={() => setFotoIdx(i => (i + 1) % fotos.length)} style={{
                    position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                    width: '40px', height: '40px', borderRadius: '50%',
                    backgroundColor: 'rgba(255,255,255,0.9)', border: 'none',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                  }}>
                    <ChevronRight size={20} color="#374151" />
                  </button>
                </>
              )}

              {/* Contador de fotos */}
              {fotos.length > 0 && (
                <div style={{
                  position: 'absolute', bottom: '12px', right: '12px',
                  backgroundColor: 'rgba(0,0,0,0.55)', borderRadius: '20px',
                  padding: '4px 10px',
                  display: 'flex', alignItems: 'center', gap: '5px'
                }}>
                  <Camera size={12} color="white" />
                  <span style={{ fontSize: '12px', color: 'white', fontWeight: '500' }}>
                    {fotoIdx + 1}/{fotos.length}
                  </span>
                </div>
              )}
            </div>

            {/* Miniaturas */}
            {fotos.length > 1 && (
              <div style={{ display: 'flex', gap: '8px' }}>
                {fotos.map((f, i) => (
                  <div key={i} onClick={() => setFotoIdx(i)} style={{
                    width: '72px', height: '72px', borderRadius: '10px', overflow: 'hidden',
                    border: `2px solid ${i === fotoIdx ? '#c0606a' : border}`,
                    cursor: 'pointer', flexShrink: 0
                  }}>
                    <img src={f} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))}
              </div>
            )}

            {/* Descrição completa */}
            <div style={{
              backgroundColor: cardBg, borderRadius: '16px',
              border: `1px solid ${border}`, padding: '24px',
              boxShadow: isDark ? 'none' : '0 1px 4px rgba(0,0,0,0.06)'
            }}>
              <h2 style={{ fontSize: '16px', fontWeight: '700', color: textPrimary, margin: '0 0 12px' }}>Descrição</h2>
              <p style={{ fontSize: '14px', color: textSecondary, lineHeight: '1.75', margin: 0 }}>
                {produto.descricao}
              </p>

              {produto.estado && (
                <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: `1px solid ${border}` }}>
                  <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    <div>
                      <p style={{ fontSize: '11px', fontWeight: '600', color: textSecondary, letterSpacing: '0.8px', textTransform: 'uppercase', margin: '0 0 4px' }}>Estado</p>
                      <p style={{ fontSize: '14px', fontWeight: '600', color: textPrimary, margin: 0, textTransform: 'capitalize' }}>{produto.estado}</p>
                    </div>
                    {produto.categoria && (
                      <div>
                        <p style={{ fontSize: '11px', fontWeight: '600', color: textSecondary, letterSpacing: '0.8px', textTransform: 'uppercase', margin: '0 0 4px' }}>Categoria</p>
                        <p style={{ fontSize: '14px', fontWeight: '600', color: textPrimary, margin: 0, textTransform: 'capitalize' }}>{produto.categoria}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ===== COLUNA DIREITA — CARD DE COMPRA ===== */}
          <div style={{ position: 'sticky', top: '88px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* Card principal */}
            <div style={{
              backgroundColor: cardBg, borderRadius: '16px',
              border: `1px solid ${border}`, padding: '24px',
              boxShadow: isDark ? 'none' : '0 4px 24px rgba(0,0,0,0.07)'
            }}>
              {/* Tags */}
              <div style={{ display: 'flex', gap: '6px', marginBottom: '16px', flexWrap: 'wrap' }}>
                {produto.categoria && (
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: '4px',
                    padding: '4px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: '600',
                    backgroundColor: isDark ? '#2a1e1e' : '#fdf0f0', color: isDark ? '#c98888' : '#b87070', textTransform: 'capitalize'
                  }}>
                    <Tag size={10} /> {produto.categoria}
                  </span>
                )}
                {produto.estado && (
                  <span style={{
                    padding: '4px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: '600',
                    backgroundColor: isDark ? '#1a241a' : '#f0faf0', color: isDark ? '#6a9e6a' : '#4a8a4a', textTransform: 'capitalize'
                  }}>{produto.estado}</span>
                )}
              </div>

              {/* Título */}
              <h1 style={{ fontSize: '22px', fontWeight: '800', color: textPrimary, margin: '0 0 16px', lineHeight: '1.3', letterSpacing: '-0.3px' }}>
                {produto.nome}
              </h1>

              {/* Preço */}
              <div style={{ marginBottom: '20px' }}>
                <p style={{ fontSize: '32px', fontWeight: '800', color: isDark ? '#c08888' : '#b87070', margin: 0, letterSpacing: '-0.5px' }}>
                  {produto.preco ? `R$ ${parseFloat(produto.preco).toFixed(2).replace('.', ',')}` : 'A combinar'}
                </p>
              </div>

              <div style={{ height: '1px', backgroundColor: border, marginBottom: '20px' }} />

              {/* Vendedor */}
              {produto.doador && (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                    <div style={{
                      width: '44px', height: '44px', borderRadius: '50%',
                      background: isDark ? 'linear-gradient(135deg, #8a5555, #6a3a3a)' : 'linear-gradient(135deg, #e8a8a8, #c07878)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'white', fontSize: '16px', fontWeight: '700', flexShrink: 0
                    }}>{produto.doador.charAt(0).toUpperCase()}</div>
                    <div>
                      <p style={{ fontSize: '11px', color: textSecondary, margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '600' }}>Vendedor</p>
                      <p style={{ fontSize: '15px', fontWeight: '700', color: textPrimary, margin: 0 }}>{produto.doador}</p>
                    </div>
                    <User size={16} color={textSecondary} style={{ marginLeft: 'auto' }} />
                  </div>
                  <div style={{ height: '1px', backgroundColor: border, marginBottom: '20px' }} />
                </>
              )}

              {/* Localização */}
              {produto.contato && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
                  <MapPin size={15} color={textSecondary} />
                  <span style={{ fontSize: '13px', color: textSecondary }}>Contato: {produto.contato}</span>
                </div>
              )}

              {/* Botões */}
              <button onClick={() => navigate('/doacao')} style={{
                width: '100%', padding: '14px', borderRadius: '12px', border: 'none',
                background: isDark ? 'linear-gradient(135deg, #7a4a4a, #5a3030)' : 'linear-gradient(135deg, #dda0a0, #c07878)',
                color: 'white', fontSize: '15px', fontWeight: '600',
                cursor: 'pointer', marginBottom: '10px',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                boxShadow: isDark ? '0 4px 14px rgba(0,0,0,0.3)' : '0 4px 14px rgba(192,120,120,0.25)',
                transition: 'all 0.2s'
              }}
                onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.9'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <ShoppingBag size={17} /> Comprar
              </button>

              <button onClick={() => navigate('/chat')} style={{
                width: '100%', padding: '14px', borderRadius: '12px',
                border: `1.5px solid ${isDark ? '#333' : '#e5e7eb'}`,
                backgroundColor: 'transparent',
                color: textPrimary, fontSize: '15px', fontWeight: '600',
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                transition: 'all 0.2s'
              }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = isDark ? '#1f1f1f' : '#f9fafb'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                <MessageCircle size={17} /> Chat
              </button>
            </div>

            {/* Card segurança */}
            <div style={{
              backgroundColor: isDark ? '#1c1c1c' : '#fdf8f0',
              borderRadius: '12px',
              border: `1px solid ${isDark ? '#2e2e2e' : '#ede0cc'}`,
              padding: '16px 20px'
            }}>
              <p style={{ fontSize: '12px', fontWeight: '600', color: isDark ? '#b09070' : '#9a7050', margin: '0 0 6px' }}>⚠️ Dica de segurança</p>
              <p style={{ fontSize: '12px', color: isDark ? '#706050' : '#9a8060', margin: 0, lineHeight: '1.6' }}>
                Nunca faça pagamentos antes de ver o produto pessoalmente. Combine a entrega em local seguro.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetalhesProduto;
