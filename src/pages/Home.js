import React, { useState, useEffect } from 'react';
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
    localStorage.removeItem('user');
    localStorage.removeItem('token');
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
    const isAprovado = produto.status === 'aprovado';
    return matchPesquisa && matchCategoria && isAprovado;
  });

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #ffc0cb 0%, #f8d7da 100%)'
    }}>
      <header style={{ 
        background: isDark ? 'linear-gradient(135deg, rgba(105, 72, 75, 0.98) 0%, rgba(173, 115, 120, 0.98) 100%)' : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(252, 192, 203, 0.7) 100%)', 
        backdropFilter: 'blur(25px)',
        boxShadow: '0 12px 40px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.06)',
        borderBottom: `1px solid ${isDark ? 'rgba(173, 115, 120, 0.3)' : 'rgba(252, 192, 203, 0.4)'}`,
        position: 'sticky',
        top: 0,
        zIndex: 1000
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 20px', flexWrap: 'wrap', gap: '10px' }}>
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
            <h1 style={{ 
              color: theme.primary, 
              margin: 0, 
              fontSize: '24px',
              fontWeight: '700',
              letterSpacing: '-0.5px',
              fontFamily: 'system-ui, -apple-system, sans-serif'
            }}>Além do Positivo</h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <button 
              onClick={toggleTheme}
              style={{
                padding: '10px 12px',
                backgroundColor: isDark ? 'rgba(173, 115, 120, 0.2)' : 'rgba(252, 192, 203, 0.2)',
                color: theme.text,
                border: `1px solid ${isDark ? 'rgba(173, 115, 120, 0.4)' : 'rgba(252, 192, 203, 0.4)'}`,
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontSize: '16px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = isDark ? 'rgba(173, 115, 120, 0.3)' : 'rgba(252, 192, 203, 0.3)';
                e.target.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = isDark ? 'rgba(173, 115, 120, 0.2)' : 'rgba(252, 192, 203, 0.2)';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              {isDark ? '☀️' : '🌙'}
            </button>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              padding: '8px 12px',
              backgroundColor: isDark ? 'rgba(173, 115, 120, 0.15)' : 'rgba(252, 192, 203, 0.15)',
              borderRadius: '8px',
              border: `1px solid ${isDark ? 'rgba(173, 115, 120, 0.2)' : 'rgba(252, 192, 203, 0.2)'}`
            }}>
              <span style={{ fontSize: '16px' }}>👤</span>
              <span style={{ 
                color: theme.text, 
                fontSize: '14px', 
                fontWeight: '500'
              }}>Olá, {user.nome}!</span>
            </div>
            

            
            <div style={{ position: 'relative' }}>
              <button 
                onClick={() => setMenuAberto(!menuAberto)}
                style={{
                  padding: '10px 12px',
                  backgroundColor: isDark ? 'rgba(173, 115, 120, 0.2)' : 'rgba(252, 192, 203, 0.2)',
                  color: theme.text,
                  border: `1px solid ${isDark ? 'rgba(173, 115, 120, 0.4)' : 'rgba(252, 192, 203, 0.4)'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = isDark ? 'rgba(173, 115, 120, 0.3)' : 'rgba(252, 192, 203, 0.3)';
                  e.target.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = isDark ? 'rgba(173, 115, 120, 0.2)' : 'rgba(252, 192, 203, 0.2)';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                ☰
              </button>
            </div>
            
            <button 
              onClick={handleLogout}
              style={{
                padding: '8px 16px',
                backgroundColor: 'transparent',
                color: theme.textSecondary,
                border: `1px solid ${isDark ? 'rgba(173, 115, 120, 0.3)' : 'rgba(252, 192, 203, 0.3)'}`,
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '500',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = isDark ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.05)';
                e.target.style.color = '#ef4444';
                e.target.style.borderColor = '#ef4444';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = theme.textSecondary;
                e.target.style.borderColor = isDark ? 'rgba(173, 115, 120, 0.3)' : 'rgba(252, 192, 203, 0.3)';
              }}
            >
              Sair
            </button>
          </div>
        </div>
        <div style={{ 
          padding: '24px', 
          backgroundColor: isDark ? 'rgba(69, 75, 96, 0.6)' : 'rgba(247, 182, 186, 0.4)', 
          backdropFilter: 'blur(15px)',
          borderTop: `1px solid ${isDark ? 'rgba(173, 115, 120, 0.2)' : 'rgba(252, 192, 203, 0.2)'}` 
        }}>
          <div style={{ display: 'flex', gap: '15px', maxWidth: '800px', margin: '0 auto', flexWrap: 'wrap', flexDirection: window.innerWidth < 768 ? 'column' : 'row' }}>
            <input
              type="text"
              placeholder="🔍 Pesquisar produtos..."
              value={pesquisa}
              onChange={(e) => setPesquisa(e.target.value)}
              style={{
                flex: '1',
                minWidth: window.innerWidth < 768 ? '100%' : '280px',
                padding: '14px 20px',
                border: `2px solid ${isDark ? 'rgba(173, 115, 120, 0.3)' : 'rgba(252, 192, 203, 0.4)'}`,
                borderRadius: '12px',
                backgroundColor: isDark ? 'rgba(105, 72, 75, 0.8)' : 'rgba(255, 255, 255, 0.95)',
                color: theme.text,
                fontSize: '15px',
                fontWeight: '500',
                outline: 'none',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = theme.primary;
                e.target.style.boxShadow = '0 6px 20px rgba(173, 115, 120, 0.15)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = isDark ? 'rgba(173, 115, 120, 0.3)' : 'rgba(252, 192, 203, 0.4)';
                e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)';
              }}
            />
            <select
              value={categoriaFiltro}
              onChange={(e) => setCategoriaFiltro(e.target.value)}
              style={{
                padding: '14px 20px',
                border: `2px solid ${isDark ? 'rgba(173, 115, 120, 0.3)' : 'rgba(252, 192, 203, 0.4)'}`,
                borderRadius: '12px',
                backgroundColor: isDark ? 'rgba(105, 72, 75, 0.8)' : 'rgba(255, 255, 255, 0.95)',
                color: theme.text,
                fontSize: '15px',
                fontWeight: '500',
                minWidth: window.innerWidth < 768 ? '100%' : '180px',
                outline: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
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
              <span style={{ fontWeight: 'bold' }}>Doar Produto</span>
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
              <span style={{ fontWeight: 'bold' }}>Meu Perfil</span>
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
              <span style={{ fontWeight: 'bold' }}>Sobre Nós</span>
            </div>
            <div 
              onClick={() => { navigate('/fale-conosco'); setMenuAberto(false); }}
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
              <span style={{ fontWeight: 'bold' }}>Fale Conosco</span>
            </div>
            <div 
              onClick={() => { navigate('/faq'); setMenuAberto(false); }}
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
              <span style={{ fontWeight: 'bold' }}>FAQ</span>
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
                <span style={{ fontWeight: 'bold' }}>Administração</span>
              </div>
            )}
          </div>
        </>
      )}

      <div style={{ 
        padding: window.innerWidth < 768 ? '20px 15px 0' : '40px 30px 0', 
        maxWidth: '1200px', 
        margin: '0 auto' 
      }}>
        {/* Carrossel de Produtos Principais */}
        <ProductCarousel produtos={produtosFiltrados.slice(0, 5)} theme={theme} isDark={isDark} handleContact={handleContact} />
        
        <div style={{ padding: '0 0 30px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '25px',
            padding: '0 10px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <span style={{
                color: theme.textSecondary,
                fontSize: '16px',
                fontWeight: '500'
              }}>
                {produtosFiltrados.length} produto{produtosFiltrados.length !== 1 ? 's' : ''} encontrado{produtosFiltrados.length !== 1 ? 's' : ''}
              </span>
              {(pesquisa || categoriaFiltro) && (
                <button
                  onClick={() => {
                    setPesquisa('');
                    setCategoriaFiltro('');
                  }}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: 'transparent',
                    color: theme.primary,
                    border: `1px solid ${theme.primary}`,
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: '500',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = theme.primary;
                    e.target.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.color = theme.primary;
                  }}
                >
                  Limpar filtros
                </button>
              )}
            </div>
          </div>
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
          <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth < 768 ? '1fr' : 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
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
                  backgroundColor: isDark ? 'rgba(173, 115, 120, 0.2)' : 'rgba(252, 192, 203, 0.2)', 
                  color: theme.text, 
                  padding: '6px 12px', 
                  borderRadius: '12px', 
                  fontSize: '11px', 
                  fontWeight: '600',
                  textTransform: 'capitalize',
                  border: `1px solid ${isDark ? 'rgba(173, 115, 120, 0.3)' : 'rgba(252, 192, 203, 0.3)'}`
                }}>{produto.categoria}</span>
                <span style={{ 
                  backgroundColor: produto.estado === 'novo' ? 'rgba(34, 197, 94, 0.1)' : produto.estado === 'seminovo' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(245, 158, 11, 0.1)', 
                  color: produto.estado === 'novo' ? '#059669' : produto.estado === 'seminovo' ? '#2563eb' : '#d97706', 
                  padding: '6px 12px', 
                  borderRadius: '12px', 
                  fontSize: '11px', 
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  border: `1px solid ${produto.estado === 'novo' ? 'rgba(34, 197, 94, 0.2)' : produto.estado === 'seminovo' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(245, 158, 11, 0.2)'}`
                }}>{produto.estado}</span>
              </div>
              <p style={{ 
                marginBottom: '12px', 
                color: theme.textSecondary, 
                lineHeight: '1.5', 
                fontSize: '14px'
              }}>{produto.descricao}</p>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '20px',
                padding: '8px 12px',
                backgroundColor: isDark ? 'rgba(173, 115, 120, 0.1)' : 'rgba(252, 192, 203, 0.1)',
                borderRadius: '8px',
                border: `1px solid ${isDark ? 'rgba(173, 115, 120, 0.2)' : 'rgba(252, 192, 203, 0.2)'}`
              }}>
                <span style={{ fontSize: '14px' }}>👤</span>
                <span style={{ 
                  color: theme.textSecondary, 
                  fontSize: '12px',
                  fontWeight: '500'
                }}>Doado por</span>
                <span style={{ 
                  color: theme.text, 
                  fontSize: '13px',
                  fontWeight: '600'
                }}>{produto.doador}</span>
              </div>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <button 
                  onClick={() => handleContact(produto.id)}
                  style={{
                    width: '100%',
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
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                    <span>💬</span>
                    <span>Entrar em Contato</span>
                  </span>
                </button>
              </div>
            </div>
            ))}
          </div>
        )}
        </div>
      </div>
      
      {/* Footer */}
      <footer style={{
        marginTop: '50px',
        padding: '30px 20px',
        background: isDark ? 'linear-gradient(135deg, rgba(105, 72, 75, 0.95) 0%, rgba(173, 115, 120, 0.95) 100%)' : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(252, 192, 203, 0.7) 100%)',
        backdropFilter: 'blur(25px)',
        borderTop: `1px solid ${isDark ? 'rgba(173, 115, 120, 0.3)' : 'rgba(252, 192, 203, 0.4)'}`
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          textAlign: 'center'
        }}>
          <p style={{
            color: theme.textSecondary,
            fontSize: '14px',
            margin: '0 0 10px 0'
          }}>
            © 2024 Além do Positivo. Todos os direitos reservados.
          </p>
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              to="/termos-privacidade"
              style={{
                color: theme.primary,
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.textDecoration = 'underline';
              }}
              onMouseLeave={(e) => {
                e.target.style.textDecoration = 'none';
              }}
            >
              Termos de Privacidade
            </Link>
            <Link
              to="/manual-seguranca"
              style={{
                color: theme.primary,
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.textDecoration = 'underline';
              }}
              onMouseLeave={(e) => {
                e.target.style.textDecoration = 'none';
              }}
            >
              Manual de Segurança
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Componente do Carrossel
function ProductCarousel({ produtos, theme, isDark, handleContact }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (produtos.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => 
          prevIndex === produtos.length - 1 ? 0 : prevIndex + 1
        );
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [produtos.length]);

  if (produtos.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        marginBottom: window.innerWidth < 768 ? '30px' : '50px',
        padding: window.innerWidth < 768 ? '30px 15px' : '40px 20px',
        background: isDark ? 'linear-gradient(135deg, rgba(105, 72, 75, 0.3) 0%, rgba(173, 115, 120, 0.2) 100%)' : 'linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(252, 192, 203, 0.3) 100%)',
        borderRadius: '20px',
        backdropFilter: 'blur(10px)',
        border: `1px solid ${isDark ? 'rgba(173, 115, 120, 0.2)' : 'rgba(252, 192, 203, 0.3)'}`
      }}>
        <h2 style={{
          fontSize: window.innerWidth < 768 ? '28px' : '36px',
          fontWeight: '700',
          color: theme.primary,
          marginBottom: '16px'
        }}>
          Doações Disponíveis
        </h2>
        <p style={{
          fontSize: '18px',
          color: theme.textSecondary,
          margin: 0
        }}>
          Nenhum produto disponível no momento
        </p>
      </div>
    );
  }

  const currentProduct = produtos[currentIndex];

  return (
    <div style={{
      marginBottom: window.innerWidth < 768 ? '30px' : '50px',
      position: 'relative',
      overflow: 'hidden',
      borderRadius: '20px',
      background: isDark ? 'linear-gradient(135deg, rgba(105, 72, 75, 0.3) 0%, rgba(173, 115, 120, 0.2) 100%)' : 'linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(252, 192, 203, 0.3) 100%)',
      backdropFilter: 'blur(10px)',
      border: `1px solid ${isDark ? 'rgba(173, 115, 120, 0.2)' : 'rgba(252, 192, 203, 0.3)'}`
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        padding: window.innerWidth < 768 ? '30px 20px' : '40px 30px',
        gap: '30px',
        flexDirection: window.innerWidth < 768 ? 'column' : 'row'
      }}>
        <div style={{ flex: 1, textAlign: window.innerWidth < 768 ? 'center' : 'left' }}>
          <h2 style={{
            fontSize: window.innerWidth < 768 ? '24px' : '32px',
            fontWeight: '700',
            color: theme.primary,
            marginBottom: '12px'
          }}>
            {currentProduct.nome}
          </h2>
          <p style={{
            fontSize: '16px',
            color: theme.textSecondary,
            marginBottom: '20px',
            lineHeight: '1.5'
          }}>
            {currentProduct.descricao}
          </p>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', justifyContent: window.innerWidth < 768 ? 'center' : 'flex-start' }}>
            <span style={{
              backgroundColor: isDark ? 'rgba(173, 115, 120, 0.3)' : 'rgba(252, 192, 203, 0.3)',
              color: theme.text,
              padding: '6px 12px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: '600'
            }}>
              {currentProduct.categoria}
            </span>
            <span style={{
              backgroundColor: currentProduct.estado === 'novo' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(59, 130, 246, 0.2)',
              color: currentProduct.estado === 'novo' ? '#059669' : '#2563eb',
              padding: '6px 12px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: '600'
            }}>
              {currentProduct.estado}
            </span>
          </div>
          <button
            onClick={() => handleContact(currentProduct.id)}
            style={{
              padding: '12px 24px',
              backgroundColor: theme.primary,
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '14px',
              transition: 'all 0.2s ease'
            }}
          >
            Ver Detalhes
          </button>
        </div>
        
        <div style={{ position: 'relative' }}>
          {currentProduct.imagem ? (
            <img
              src={currentProduct.imagem}
              alt={currentProduct.nome}
              style={{
                width: window.innerWidth < 768 ? '200px' : '250px',
                height: window.innerWidth < 768 ? '150px' : '180px',
                objectFit: 'cover',
                borderRadius: '12px',
                boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
              }}
            />
          ) : (
            <div style={{
              width: window.innerWidth < 768 ? '200px' : '250px',
              height: window.innerWidth < 768 ? '150px' : '180px',
              backgroundColor: isDark ? 'rgba(69, 75, 96, 0.6)' : 'rgba(247, 182, 186, 0.6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '12px',
              color: theme.textSecondary,
              fontSize: '14px'
            }}>
              Sem imagem
            </div>
          )}
        </div>
      </div>
      
      {/* Indicadores */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '8px',
        paddingBottom: '20px'
      }}>
        {produtos.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              border: 'none',
              backgroundColor: index === currentIndex ? theme.primary : (isDark ? 'rgba(173, 115, 120, 0.3)' : 'rgba(252, 192, 203, 0.3)'),
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default Home;