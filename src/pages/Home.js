import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useProdutos } from '../context/ProdutosContext';
import { useTheme } from '../context/ThemeContext';


function Home({ user, setUser }) {
  const navigate = useNavigate();
  const { produtos, removerProduto } = useProdutos();
  const { theme, isDark, toggleTheme } = useTheme();

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

  const handleRemoverProduto = (produtoId, nomeProduto) => {
    if (window.confirm(`Tem certeza que deseja excluir o produto "${nomeProduto}"?`)) {
      removerProduto(produtoId);
    }
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
      background: 'linear-gradient(135deg, #ffc0cb 0%, #f8d7da 100%)'
    }}>
      <header style={{ 
        backgroundColor: isDark ? 'rgba(105, 72, 75, 0.9)' : 'rgba(255, 255, 255, 0.9)', 
        backdropFilter: 'blur(10px)',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)' 
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 30px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <img 
              src="logo.JPEG"
              alt="Logo Além do Positivo"
              style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                objectFit: 'cover',
                boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                border: `2px solid ${theme.primary}`
              }}
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            <h1 style={{ color: theme.primary, margin: 0 }}>Além do Positivo</h1>
          </div>
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
      
      {/* Menu hambúrguer e overlay */}
      {menuAberto && (
        <>
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
                transition: 'background-color 0.2s ease'
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
              onClick={() => { navigate('/sobre-nos'); setMenuAberto(false); }}
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
              <span style={{ fontSize: '20px' }}>📜</span>
              <span>Sobre Nós</span>
            </div>
            <div 
              onClick={() => { navigate('/fale-conosco'); setMenuAberto(false); }}
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
              <span style={{ fontSize: '20px' }}>📞</span>
              <span>Fale Conosco</span>
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
        </>
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
              background: isDark ? 'linear-gradient(135deg, rgba(105, 72, 75, 0.95) 0%, rgba(173, 115, 120, 0.95) 100%)' : 'linear-gradient(135deg, white 0%, #ffc0cb 100%)',
              backdropFilter: 'blur(15px)',
              padding: '24px',
              borderRadius: '16px',
              boxShadow: '0 10px 40px rgba(0,0,0,0.1), 0 4px 12px rgba(0,0,0,0.05)',
              border: '1px solid #ffc0cb',
              color: theme.text,
              position: 'relative',
              zIndex: 1,
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 15px 50px rgba(0,0,0,0.15), 0 6px 18px rgba(0,0,0,0.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 10px 40px rgba(0,0,0,0.1), 0 4px 12px rgba(0,0,0,0.05)';
            }}>
              <h3 style={{ 
                color: theme.primary, 
                marginBottom: '16px', 
                fontSize: '20px', 
                fontWeight: '600',
                letterSpacing: '-0.5px'
              }}>{produto.nome}</h3>
              <div style={{ marginBottom: '16px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <span style={{ 
                  backgroundColor: isDark ? 'rgba(173, 115, 120, 0.3)' : 'rgba(252, 192, 203, 0.2)', 
                  color: theme.text, 
                  padding: '4px 12px', 
                  borderRadius: '20px', 
                  fontSize: '12px', 
                  fontWeight: '500',
                  textTransform: 'capitalize'
                }}>{produto.categoria}</span>
                <span style={{ 
                  backgroundColor: isDark ? 'rgba(179, 115, 122, 0.3)' : 'rgba(34, 197, 94, 0.1)', 
                  color: isDark ? theme.text : '#059669', 
                  padding: '4px 12px', 
                  borderRadius: '20px', 
                  fontSize: '12px', 
                  fontWeight: '500',
                  textTransform: 'capitalize'
                }}>{produto.estado}</span>
              </div>
              <p style={{ 
                marginBottom: '12px', 
                color: theme.textSecondary, 
                lineHeight: '1.5', 
                fontSize: '14px'
              }}>{produto.descricao}</p>
              <p style={{ 
                marginBottom: '20px', 
                color: theme.text, 
                fontSize: '13px',
                fontWeight: '500'
              }}>Doador: {produto.doador}</p>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <button 
                  onClick={() => handleContact(produto.id)}
                  style={{
                    flex: 1,
                    minWidth: '140px',
                    padding: '12px 20px',
                    backgroundColor: theme.primary,
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '14px',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 2px 8px rgba(173, 115, 120, 0.3)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#9a6b70';
                    e.target.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = theme.primary;
                    e.target.style.transform = 'translateY(0)';
                  }}
                >
                  Ver Detalhes
                </button>

                {user.isAdmin && (
                  <button 
                    onClick={() => handleRemoverProduto(produto.id, produto.nome)}
                    style={{
                      padding: '12px',
                      backgroundColor: '#ef4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      fontSize: '16px',
                      transition: 'all 0.2s ease',
                      boxShadow: '0 2px 8px rgba(239, 68, 68, 0.3)'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#dc2626';
                      e.target.style.transform = 'translateY(-1px)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = '#ef4444';
                      e.target.style.transform = 'translateY(0)';
                    }}
                  >
                    🗑️
                  </button>
                )}
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