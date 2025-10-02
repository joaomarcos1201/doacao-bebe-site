import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useProdutos } from '../context/ProdutosContext';
import { useTheme } from '../context/ThemeContext';

function DetalhesProduto() {
  const { id } = useParams();
  const { produtos } = useProdutos();
  const { theme, isDark, toggleTheme } = useTheme();
  
  const produto = produtos.find(p => p.id === parseInt(id));

  if (!produto) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #ffc0cb 0%, #f8d7da 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          backgroundColor: isDark ? 'rgba(105, 72, 75, 0.95)' : 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(15px)',
          padding: '40px',
          borderRadius: '15px',
          textAlign: 'center',
          maxWidth: '500px'
        }}>
          <div style={{ marginBottom: '20px' }}>
            <Link to="/home" style={{ color: theme.primary, textDecoration: 'none', fontSize: '18px' }}>← Voltar ao Início</Link>
          </div>
          <h2 style={{ color: theme.primary }}>Produto não encontrado</h2>
        </div>
      </div>
    );
  }

  const handleWhatsApp = () => {
    const mensagem = `Olá! Tenho interesse no produto: ${produto.nome}`;
    const numero = produto.contato.replace(/\D/g, '');
    window.open(`https://wa.me/55${numero}?text=${encodeURIComponent(mensagem)}`, '_blank');
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #ffc0cb 0%, #f8d7da 100%)'
    }}>
      {/* Header com navegação */}
      <div style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        background: isDark ? 'linear-gradient(135deg, rgba(105, 72, 75, 0.95) 0%, rgba(173, 115, 120, 0.95) 100%)' : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(252, 192, 203, 0.7) 100%)',
        backdropFilter: 'blur(25px)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        borderBottom: `1px solid ${isDark ? 'rgba(173, 115, 120, 0.3)' : 'rgba(252, 192, 203, 0.4)'}`
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          padding: '15px 20px',
          maxWidth: '1400px',
          margin: '0 auto'
        }}>
          <Link to="/home" style={{ 
            color: theme.primary, 
            textDecoration: 'none', 
            fontSize: '18px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s ease'
          }}>← Voltar ao Início</Link>
          
          <button 
            onClick={toggleTheme}
            style={{
              padding: '12px',
              backgroundColor: isDark ? 'rgba(173, 115, 120, 0.2)' : 'rgba(252, 192, 203, 0.2)',
              color: theme.text,
              border: `1px solid ${isDark ? 'rgba(173, 115, 120, 0.4)' : 'rgba(252, 192, 203, 0.4)'}`,
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '16px',
              transition: 'all 0.2s ease'
            }}
          >
            {isDark ? '☀️' : '🌙'}
          </button>
        </div>
      </div>
      
      {/* Conteúdo principal */}
      <div style={{ 
        padding: '30px 20px',
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: window.innerWidth > 768 ? '1fr 1fr' : '1fr', 
          gap: window.innerWidth > 768 ? '60px' : '30px',
          alignItems: 'center',
          minHeight: '70vh'
        }}>
          {/* Seção da imagem */}
          <div style={{ 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
          }}>
            <div style={{
              background: isDark ? 'linear-gradient(135deg, rgba(105, 72, 75, 0.9) 0%, rgba(173, 115, 120, 0.9) 100%)' : 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(252, 192, 203, 0.3) 100%)',
              backdropFilter: 'blur(20px)',
              borderRadius: '24px',
              padding: window.innerWidth > 768 ? '30px' : '20px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
              border: `1px solid ${isDark ? 'rgba(173, 115, 120, 0.3)' : 'rgba(252, 192, 203, 0.4)'}`
            }}>
              {produto.imagem ? (
                <img 
                  src={produto.imagem} 
                  alt={produto.nome}
                  style={{ 
                    width: '100%',
                    maxWidth: window.innerWidth > 768 ? '500px' : '100%',
                    height: 'auto',
                    objectFit: 'cover',
                    borderRadius: '16px',
                    boxShadow: '0 12px 40px rgba(0,0,0,0.2)'
                  }}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/500x400?text=Sem+Imagem';
                  }}
                />
              ) : (
                <div style={{
                  width: window.innerWidth > 768 ? '500px' : '100%',
                  height: window.innerWidth > 768 ? '400px' : '250px',
                  backgroundColor: isDark ? 'rgba(69, 75, 96, 0.6)' : 'rgba(247, 182, 186, 0.6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '16px',
                  color: theme.textSecondary,
                  fontSize: '18px',
                  fontWeight: '500'
                }}>
                  Sem imagem disponível
                </div>
              )}
            </div>
          </div>
          
          {/* Seção das informações */}
          <div style={{ 
            background: isDark ? 'linear-gradient(135deg, rgba(105, 72, 75, 0.9) 0%, rgba(173, 115, 120, 0.9) 100%)' : 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(252, 192, 203, 0.3) 100%)',
            backdropFilter: 'blur(20px)',
            padding: window.innerWidth > 768 ? '50px' : '30px',
            borderRadius: '24px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
            border: `1px solid ${isDark ? 'rgba(173, 115, 120, 0.3)' : 'rgba(252, 192, 203, 0.4)'}`
          }}>
            <h1 style={{ 
              color: theme.primary, 
              marginBottom: '30px', 
              fontSize: window.innerWidth > 768 ? '2.5rem' : '2rem',
              fontWeight: '700',
              letterSpacing: '-1px',
              lineHeight: '1.2'
            }}>{produto.nome}</h1>
            
            <div style={{ display: 'flex', gap: '15px', marginBottom: '30px', flexWrap: 'wrap' }}>
              <span style={{ 
                backgroundColor: isDark ? 'rgba(173, 115, 120, 0.3)' : 'rgba(252, 192, 203, 0.3)', 
                color: theme.text, 
                padding: '8px 16px', 
                borderRadius: '20px', 
                fontSize: '14px', 
                fontWeight: '600',
                textTransform: 'capitalize',
                border: `1px solid ${isDark ? 'rgba(173, 115, 120, 0.4)' : 'rgba(252, 192, 203, 0.4)'}`
              }}>{produto.categoria}</span>
              
              <span style={{ 
                backgroundColor: produto.estado === 'novo' ? 'rgba(34, 197, 94, 0.2)' : produto.estado === 'seminovo' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(245, 158, 11, 0.2)', 
                color: produto.estado === 'novo' ? '#059669' : produto.estado === 'seminovo' ? '#2563eb' : '#d97706', 
                padding: '8px 16px', 
                borderRadius: '20px', 
                fontSize: '14px', 
                fontWeight: '600',
                textTransform: 'uppercase',
                border: `1px solid ${produto.estado === 'novo' ? 'rgba(34, 197, 94, 0.3)' : produto.estado === 'seminovo' ? 'rgba(59, 130, 246, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`
              }}>{produto.estado}</span>
            </div>
            
            <div style={{ 
              marginBottom: '30px',
              padding: '20px',
              backgroundColor: isDark ? 'rgba(69, 75, 96, 0.3)' : 'rgba(247, 182, 186, 0.2)',
              borderRadius: '16px',
              border: `1px solid ${isDark ? 'rgba(173, 115, 120, 0.2)' : 'rgba(252, 192, 203, 0.3)'}`
            }}>
              <h3 style={{ 
                fontSize: '18px', 
                color: theme.text,
                marginBottom: '12px',
                fontWeight: '600'
              }}>Descrição</h3>
              <p style={{ 
                lineHeight: '1.7', 
                fontSize: '16px', 
                color: theme.textSecondary,
                margin: 0
              }}>{produto.descricao}</p>
            </div>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '20px',
              padding: '16px',
              backgroundColor: isDark ? 'rgba(173, 115, 120, 0.2)' : 'rgba(252, 192, 203, 0.2)',
              borderRadius: '12px',
              border: `1px solid ${isDark ? 'rgba(173, 115, 120, 0.3)' : 'rgba(252, 192, 203, 0.3)'}`
            }}>

              <div>
                <span style={{ 
                  color: theme.textSecondary, 
                  fontSize: '14px',
                  fontWeight: '500'
                }}>Doado por</span>
                <div style={{ 
                  color: theme.text, 
                  fontSize: '16px',
                  fontWeight: '600'
                }}>{produto.doador}</div>
              </div>
            </div>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '30px',
              padding: '16px',
              backgroundColor: isDark ? 'rgba(173, 115, 120, 0.2)' : 'rgba(252, 192, 203, 0.2)',
              borderRadius: '12px',
              border: `1px solid ${isDark ? 'rgba(173, 115, 120, 0.3)' : 'rgba(252, 192, 203, 0.3)'}`
            }}>

              <div>
                <span style={{ 
                  color: theme.textSecondary, 
                  fontSize: '14px',
                  fontWeight: '500'
                }}>Contato</span>
                <div style={{ 
                  color: theme.text, 
                  fontSize: '16px',
                  fontWeight: '600'
                }}>{produto.contato}</div>
              </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth > 768 ? '1fr 1fr' : '1fr', gap: '15px' }}>
              <button 
                onClick={handleWhatsApp}
                style={{ 
                  padding: '16px 20px',
                  background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '16px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  boxShadow: '0 6px 20px rgba(37, 211, 102, 0.3)',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 25px rgba(37, 211, 102, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 6px 20px rgba(37, 211, 102, 0.3)';
                }}
              >
                <span>WhatsApp</span>
              </button>
              
              <button 
                onClick={() => window.location.href = `/chat/${produto.id}`}
                style={{ 
                  padding: '16px 20px',
                  background: `linear-gradient(135deg, ${theme.primary} 0%, #9a6b70 100%)`,
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '16px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  boxShadow: '0 6px 20px rgba(173, 115, 120, 0.3)',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 25px rgba(173, 115, 120, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 6px 20px rgba(173, 115, 120, 0.3)';
                }}
              >
                <span>Chat Interno</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetalhesProduto;