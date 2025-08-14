import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useCarrinho } from '../context/CarrinhoContext';

function Carrinho() {
  const { theme, isDark, toggleTheme } = useTheme();
  const { itensCarrinho, removerDoCarrinho, limparCarrinho } = useCarrinho();

  const handleSolicitarTodos = () => {
    if (itensCarrinho.length === 0) {
      alert('Seu carrinho está vazio!');
      return;
    }
    
    alert(`Solicitação enviada para ${itensCarrinho.length} produto(s)! Os doadores serão notificados.`);
    limparCarrinho();
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundImage: 'url(https://www.unimedfortaleza.com.br/portaluploads/uploads/2024/03/mulher-gravida-mostrando-barriga.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      padding: '20px'
    }}>
      <div style={{ position: 'absolute', top: '20px', right: '20px' }}>
        <button 
          onClick={toggleTheme}
          style={{
            padding: '10px',
            backgroundColor: isDark ? 'rgba(105, 72, 75, 0.9)' : 'rgba(255, 255, 255, 0.9)',
            color: theme.text,
            border: `1px solid ${theme.border}`,
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          {isDark ? '☀️' : '🌙'}
        </button>
      </div>
      
      <div style={{ maxWidth: '800px', margin: '0 auto', paddingTop: '60px' }}>
        <div style={{ marginBottom: '20px' }}>
          <Link to="/home" style={{ color: theme.primary, textDecoration: 'none', fontWeight: 'bold' }}>← Voltar ao Início</Link>
        </div>
        
        <div style={{
          backgroundColor: isDark ? 'rgba(105, 72, 75, 0.9)' : 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          padding: '30px',
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          border: `1px solid ${isDark ? 'rgba(173, 115, 120, 0.3)' : 'rgba(179, 116, 122, 0.3)'}`
        }}>
          <h2 style={{ textAlign: 'center', marginBottom: '30px', color: theme.primary }}>
            🛒 Meu Carrinho ({itensCarrinho.length})
          </h2>
          
          {itensCarrinho.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '50px', color: theme.textSecondary }}>
              <div style={{ fontSize: '64px', marginBottom: '20px' }}>🛒</div>
              <h3 style={{ color: theme.text, marginBottom: '10px' }}>Carrinho vazio</h3>
              <p>Adicione produtos que você gostaria de solicitar</p>
              <Link 
                to="/home" 
                style={{
                  display: 'inline-block',
                  marginTop: '20px',
                  padding: '12px 24px',
                  backgroundColor: theme.primary,
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '8px',
                  fontWeight: 'bold'
                }}
              >
                Ver Produtos
              </Link>
            </div>
          ) : (
            <>
              <div style={{ marginBottom: '30px' }}>
                {itensCarrinho.map(produto => (
                  <div key={produto.id} style={{
                    display: 'flex',
                    gap: '20px',
                    padding: '20px',
                    marginBottom: '15px',
                    backgroundColor: isDark ? 'rgba(69, 75, 96, 0.5)' : 'rgba(247, 182, 186, 0.3)',
                    borderRadius: '8px',
                    border: `1px solid ${theme.border}`
                  }}>
                    {produto.imagem ? (
                      <img 
                        src={produto.imagem} 
                        alt={produto.nome}
                        style={{ 
                          width: '80px', 
                          height: '80px', 
                          objectFit: 'cover', 
                          borderRadius: '8px',
                          border: `1px solid ${theme.border}`
                        }}
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/80x80?text=Sem+Imagem';
                        }}
                      />
                    ) : (
                      <div style={{
                        width: '80px',
                        height: '80px',
                        backgroundColor: theme.background,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '8px',
                        border: `1px solid ${theme.border}`,
                        color: theme.textSecondary,
                        fontSize: '12px'
                      }}>
                        Sem imagem
                      </div>
                    )}
                    
                    <div style={{ flex: 1 }}>
                      <h4 style={{ color: theme.primary, marginBottom: '8px' }}>{produto.nome}</h4>
                      <p style={{ color: theme.textSecondary, fontSize: '14px', marginBottom: '5px' }}>
                        <strong>Categoria:</strong> <span style={{ textTransform: 'capitalize' }}>{produto.categoria}</span>
                      </p>
                      <p style={{ color: theme.textSecondary, fontSize: '14px', marginBottom: '5px' }}>
                        <strong>Estado:</strong> <span style={{ textTransform: 'capitalize' }}>{produto.estado}</span>
                      </p>
                      <p style={{ color: theme.textSecondary, fontSize: '14px' }}>
                        <strong>Doador:</strong> {produto.doador}
                      </p>
                    </div>
                    
                    <button 
                      onClick={() => removerDoCarrinho(produto.id)}
                      style={{
                        padding: '8px 12px',
                        backgroundColor: theme.danger,
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        height: 'fit-content'
                      }}
                    >
                      Remover
                    </button>
                  </div>
                ))}
              </div>
              
              <div style={{ 
                display: 'flex', 
                gap: '15px', 
                justifyContent: 'center',
                flexWrap: 'wrap'
              }}>
                <button 
                  onClick={limparCarrinho}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: theme.textSecondary,
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '16px'
                  }}
                >
                  Limpar Carrinho
                </button>
                
                <button 
                  onClick={handleSolicitarTodos}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: theme.primary,
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: 'bold'
                  }}
                >
                  Solicitar Todos ({itensCarrinho.length})
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Carrinho;