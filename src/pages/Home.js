import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useProdutos } from '../context/ProdutosContext';
import { useTheme } from '../context/ThemeContext';
import { useCarrinho } from '../context/CarrinhoContext';

function Home({ user, setUser }) {
  const navigate = useNavigate();
  const { produtos } = useProdutos();
  const { theme, isDark, toggleTheme } = useTheme();
  const { totalItens, adicionarAoCarrinho } = useCarrinho();
  const [pesquisa, setPesquisa] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('');
  const [menuAberto, setMenuAberto] = useState(false);

  const handleLogout = () => {
    setUser(null);
    navigate('/login');
  };

  const handleContact = (produtoId) => {
    navigate(`/produto/${produtoId}`);
  };

  const produtosFiltrados = produtos.filter(produto => {
    const matchPesquisa = produto.nome.toLowerCase().includes(pesquisa.toLowerCase()) ||
                         produto.descricao.toLowerCase().includes(pesquisa.toLowerCase());
    const matchCategoria = categoriaFiltro === '' || produto.categoria === categoriaFiltro;
    return matchPesquisa && matchCategoria;
  });

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundImage: 'url(https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1920&h=1080&fit=crop)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}>
      <header style={{ 
        backgroundColor: isDark ? 'rgba(105, 72, 75, 0.9)' : 'rgba(255, 255, 255, 0.9)', 
        backdropFilter: 'blur(10px)',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)' 
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 30px', maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{ color: theme.primary, margin: 0 }}>Além do Positivo</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <button 
              onClick={toggleTheme}
              style={{
                padding: '8px',
                backgroundColor: theme.background,
                color: theme.text,
                border: `1px solid ${theme.border}`,
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              {isDark ? '☀️' : '🌙'}
            </button>
            <span style={{ color: theme.text }}>Olá, {user.nome}!</span>
            
            <div 
              onClick={() => navigate('/carrinho')}
              style={{
                position: 'relative',
                padding: '8px',
                backgroundColor: theme.background,
                color: theme.text,
                border: `1px solid ${theme.border}`,
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '18px'
              }}
            >
              🛍️
              {totalItens > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-5px',
                  right: '-5px',
                  backgroundColor: theme.primary,
                  color: 'white',
                  borderRadius: '50%',
                  width: '20px',
                  height: '20px',
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold'
                }}>
                  {totalItens}
                </span>
              )}
            </div>
            
            <div style={{ position: 'relative' }}>
              <button 
                onClick={() => setMenuAberto(!menuAberto)}
                style={{
                  padding: '8px',
                  backgroundColor: theme.background,
                  color: theme.text,
                  border: `1px solid ${theme.border}`,
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '18px'
                }}
              >
                ☰
              </button>
              
              {menuAberto && (
                <div style={{
                  position: 'fixed',
                  top: '0',
                  right: '0',
                  height: '100vh',
                  width: '280px',
                  backgroundColor: isDark ? 'rgba(105, 72, 75, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(15px)',
                  boxShadow: '-4px 0 20px rgba(0,0,0,0.3)',
                  zIndex: 99999,
                  transform: menuAberto ? 'translateX(0)' : 'translateX(100%)',
                  transition: 'transform 0.3s ease-in-out',
                  paddingTop: '80px',
                  overflowY: 'auto'
                }}>
                  <div 
                    onClick={() => { navigate('/doacao'); setMenuAberto(false); }}
                    style={{
                      padding: '20px 25px',
                      color: theme.text,
                      borderBottom: `1px solid ${theme.border}`,
                      cursor: 'pointer',
                      fontSize: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '15px',
                      transition: 'background-color 0.2s ease',
                      ':hover': {
                        backgroundColor: isDark ? 'rgba(173, 115, 120, 0.3)' : 'rgba(247, 182, 186, 0.3)'
                      }
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = isDark ? 'rgba(173, 115, 120, 0.3)' : 'rgba(247, 182, 186, 0.3)'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                  >
                    <span style={{ fontSize: '20px' }}>🎁</span>
                    <span>Doar Produto</span>
                  </div>
                  <div 
                    onClick={() => { navigate('/perfil'); setMenuAberto(false); }}
                    style={{
                      padding: '20px 25px',
                      color: theme.text,
                      borderBottom: `1px solid ${theme.border}`,
                      cursor: 'pointer',
                      fontSize: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '15px',
                      transition: 'background-color 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = isDark ? 'rgba(173, 115, 120, 0.3)' : 'rgba(247, 182, 186, 0.3)'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                  >
                    <span style={{ fontSize: '20px' }}>👤</span>
                    <span>Meu Perfil</span>
                  </div>
                  <div 
                    onClick={() => { navigate('/carrinho'); setMenuAberto(false); }}
                    style={{
                      padding: '20px 25px',
                      color: theme.text,
                      borderBottom: `1px solid ${theme.border}`,
                      cursor: 'pointer',
                      fontSize: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '15px',
                      justifyContent: 'space-between',
                      transition: 'background-color 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = isDark ? 'rgba(173, 115, 120, 0.3)' : 'rgba(247, 182, 186, 0.3)'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                      <span style={{ fontSize: '20px' }}>🛍️</span>
                      <span>Carrinho</span>
                    </div>
                    {totalItens > 0 && (
                      <span style={{
                        backgroundColor: theme.primary,
                        color: 'white',
                        borderRadius: '12px',
                        padding: '4px 8px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        minWidth: '20px',
                        textAlign: 'center'
                      }}>
                        {totalItens}
                      </span>
                    )}
                  </div>
                  <div 
                    onClick={() => { navigate('/sobre-nos'); setMenuAberto(false); }}
                    style={{
                      padding: '20px 25px',
                      color: theme.text,
                      borderBottom: user.isAdmin ? `1px solid ${theme.border}` : 'none',
                      cursor: 'pointer',
                      fontSize: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '15px',
                      transition: 'background-color 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = isDark ? 'rgba(173, 115, 120, 0.3)' : 'rgba(247, 182, 186, 0.3)'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                  >
                    <span style={{ fontSize: '20px' }}>📜</span>
                    <span>Sobre Nós</span>
                  </div>
                  {user.isAdmin && (
                    <div 
                      onClick={() => { navigate('/admin'); setMenuAberto(false); }}
                      style={{
                        padding: '20px 25px',
                        color: theme.text,
                        cursor: 'pointer',
                        fontSize: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '15px',
                        transition: 'background-color 0.2s ease'
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = isDark ? 'rgba(173, 115, 120, 0.3)' : 'rgba(247, 182, 186, 0.3)'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                    >
                      <span style={{ fontSize: '20px' }}>⚙️</span>
                      <span>Administração</span>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <button 
              onClick={handleLogout}
              style={{
                padding: '8px 16px',
                backgroundColor: theme.danger,
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Sair
            </button>
          </div>
        </div>
        <div style={{ 
          padding: '20px', 
          backgroundColor: isDark ? 'rgba(69, 75, 96, 0.8)' : 'rgba(247, 182, 186, 0.8)', 
          backdropFilter: 'blur(5px)',
          borderTop: `1px solid ${theme.border}` 
        }}>
          
          <div style={{ display: 'flex', gap: '15px', maxWidth: '800px', margin: '0 auto', flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder="🔍 Pesquisar produtos..."
              value={pesquisa}
              onChange={(e) => setPesquisa(e.target.value)}
              style={{
                flex: '1',
                minWidth: '250px',
                padding: '12px 15px',
                border: `1px solid ${theme.border}`,
                borderRadius: '25px',
                backgroundColor: isDark ? 'rgba(105, 72, 75, 0.8)' : 'rgba(255, 255, 255, 0.9)',
                color: theme.text,
                fontSize: '16px'
              }}
            />
            
            <select
              value={categoriaFiltro}
              onChange={(e) => setCategoriaFiltro(e.target.value)}
              style={{
                padding: '12px 15px',
                border: `1px solid ${theme.border}`,
                borderRadius: '25px',
                backgroundColor: isDark ? 'rgba(105, 72, 75, 0.8)' : 'rgba(255, 255, 255, 0.9)',
                color: theme.text,
                fontSize: '16px',
                minWidth: '150px'
              }}
            >
              <option value="">Todas as categorias</option>
              <option value="roupas">Roupas</option>
              <option value="brinquedos">Brinquedos</option>
              <option value="moveis">Móveis</option>
              <option value="acessorios">Acessórios</option>
              <option value="alimentacao">Alimentação</option>
              <option value="outros">Outros</option>
            </select>
          </div>
        </div>
      </header>
      
      {/* Overlay para fechar menu ao clicar fora */}
      {menuAberto && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 99998,
            opacity: menuAberto ? 1 : 0,
            transition: 'opacity 0.3s ease-in-out'
          }}
          onClick={() => setMenuAberto(false)}
        />
      )}

      <div style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto' }}>
        {produtosFiltrados.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '50px',
            backgroundColor: isDark ? 'rgba(105, 72, 75, 0.9)' : 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            color: theme.textSecondary
          }}>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>🔍</div>
            <h3 style={{ color: theme.text, marginBottom: '10px' }}>Nenhum produto encontrado</h3>
            <p>Tente ajustar sua pesquisa ou filtro de categoria</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {produtosFiltrados.map(produto => (
            <div key={produto.id} style={{
              backgroundColor: isDark ? 'rgba(105, 72, 75, 0.9)' : 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              padding: '20px',
              borderRadius: '12px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
              border: `1px solid ${isDark ? 'rgba(173, 115, 120, 0.3)' : 'rgba(179, 116, 122, 0.3)'}`,
              color: theme.text,
              position: 'relative',
              zIndex: 1
            }}>
              <h3 style={{ color: theme.primary, marginBottom: '15px' }}>{produto.nome}</h3>
              <p style={{ marginBottom: '8px', color: theme.text }}><strong>Categoria:</strong> <span style={{ textTransform: 'capitalize' }}>{produto.categoria}</span></p>
              <p style={{ marginBottom: '8px', color: theme.text }}><strong>Estado:</strong> <span style={{ textTransform: 'capitalize' }}>{produto.estado}</span></p>
              <p style={{ marginBottom: '8px', color: theme.textSecondary, lineHeight: '1.4' }}><strong>Descrição:</strong> {produto.descricao}</p>
              <p style={{ marginBottom: '15px', color: theme.text }}><strong>Doador:</strong> {produto.doador}</p>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  onClick={() => handleContact(produto.id)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    backgroundColor: theme.primary,
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  Ver Detalhes
                </button>
                <button 
                  onClick={() => adicionarAoCarrinho(produto)}
                  style={{
                    padding: '12px',
                    backgroundColor: theme.success,
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '18px'
                  }}
                >
                  🛍️
                </button>
              </div>
            </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;