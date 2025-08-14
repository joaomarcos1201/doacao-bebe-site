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
        backgroundImage: 'url(https://www.unimedfortaleza.com.br/portaluploads/uploads/2024/03/mulher-gravida-mostrando-barriga.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
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
      backgroundImage: 'url(https://www.unimedfortaleza.com.br/portaluploads/uploads/2024/03/mulher-gravida-mostrando-barriga.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}>
      <div style={{ 
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 1000
      }}>
        <button 
          onClick={toggleTheme}
          style={{
            padding: '10px',
            backgroundColor: isDark ? 'rgba(105, 72, 75, 0.9)' : 'rgba(255, 255, 255, 0.9)',
            color: theme.text,
            border: `1px solid ${theme.border}`,
            borderRadius: '5px',
            cursor: 'pointer',
            backdropFilter: 'blur(10px)'
          }}
        >
          {isDark ? '☀️' : '🌙'}
        </button>
      </div>
      
      <div style={{ 
        minHeight: '100vh',
        backgroundColor: isDark ? 'rgba(105, 72, 75, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(15px)',
        padding: '20px'
      }}>
        <div style={{ 
          maxWidth: '100%',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          paddingTop: '60px'
        }}>
          <div style={{ marginBottom: '20px' }}>
            <Link to="/home" style={{ 
              color: theme.primary, 
              textDecoration: 'none', 
              fontSize: '18px',
              fontWeight: 'bold'
            }}>← Voltar ao Início</Link>
          </div>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '40px',
            flex: 1,
            minHeight: 'calc(100vh - 140px)'
          }}>
            <div style={{ 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%'
            }}>
              {produto.imagem ? (
                <img 
                  src={produto.imagem} 
                  alt={produto.nome}
                  style={{ 
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain',
                    borderRadius: '12px',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
                  }}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/600x400?text=Sem+Imagem';
                  }}
                />
              ) : (
                <div style={{
                  width: '80%',
                  height: '60%',
                  backgroundColor: isDark ? 'rgba(69, 75, 96, 0.8)' : 'rgba(247, 182, 186, 0.8)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '12px',
                  color: theme.textSecondary,
                  fontSize: '18px',
                  backdropFilter: 'blur(10px)'
                }}>
                  Sem imagem disponível
                </div>
              )}
            </div>
          
            <div style={{ 
              padding: '40px',
              backgroundColor: isDark ? 'rgba(105, 72, 75, 0.9)' : 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(15px)',
              borderRadius: '12px',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}>
              <h1 style={{ 
                color: theme.primary, 
                marginBottom: '40px', 
                fontSize: '3rem',
                textAlign: 'center'
              }}>{produto.nome}</h1>
            
              <div style={{ marginBottom: '25px', fontSize: '20px', color: theme.text }}>
                <strong>Categoria:</strong> <span style={{ textTransform: 'capitalize' }}>{produto.categoria}</span>
              </div>
              
              <div style={{ marginBottom: '25px', fontSize: '20px', color: theme.text }}>
                <strong>Estado:</strong> <span style={{ textTransform: 'capitalize' }}>{produto.estado}</span>
              </div>
              
              <div style={{ marginBottom: '30px' }}>
                <strong style={{ fontSize: '20px', color: theme.text }}>Descrição:</strong>
                <p style={{ marginTop: '15px', lineHeight: '1.6', fontSize: '18px', color: theme.textSecondary }}>{produto.descricao}</p>
              </div>
              
              <div style={{ marginBottom: '25px', fontSize: '20px', color: theme.text }}>
                <strong>Doador:</strong> {produto.doador}
              </div>
              
              <div style={{ marginBottom: '30px', fontSize: '20px', color: theme.text }}>
                <strong>Contato:</strong> {produto.contato}
              </div>
            
              <button 
                onClick={handleWhatsApp}
                style={{ 
                  width: '100%',
                  padding: '20px',
                  backgroundColor: '#25D366',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '20px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  marginTop: '20px',
                  boxShadow: '0 4px 15px rgba(37, 211, 102, 0.3)'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#128C7E'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#25D366'}
              >
                💬 Entrar em Contato via WhatsApp
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetalhesProduto; 