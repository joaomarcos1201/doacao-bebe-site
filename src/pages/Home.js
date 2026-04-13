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
    localStorage.removeItem('token');
    navigate('/home');
  };

  const produtosFiltrados = produtos.filter(produto => {
    const matchPesquisa = produto.nome.toLowerCase().includes(pesquisa.toLowerCase()) ||
                         produto.descricao.toLowerCase().includes(pesquisa.toLowerCase());
    const matchCategoria = categoriaFiltro === '' || produto.categoria === categoriaFiltro;
    const isAprovado = produto.statusAnuncio === 'ATIVO';
    return matchPesquisa && matchCategoria && isAprovado;
  });

  const categorias = [
    { value: 'roupas', label: 'Roupas', emoji: '👕' },
    { value: 'brinquedos', label: 'Brinquedos', emoji: '🧸' },
    { value: 'moveis', label: 'Móveis', emoji: '🪑' },
    { value: 'acessorios', label: 'Acessórios', emoji: '🎒' },
    { value: 'alimentacao', label: 'Alimentação', emoji: '🍼' },
    { value: 'outros', label: 'Outros', emoji: '📦' },
  ];

  const menuItems = [
    { label: 'Doar Produto', emoji: '🎁', path: '/doacao' },
    { label: 'Meu Perfil', emoji: '👤', path: '/perfil', authRequired: true },
    { label: 'Sobre Nós', emoji: '💜', path: '/sobre-nos' },
    { label: 'Fale Conosco', emoji: '💬', path: '/fale-conosco' },
    { label: 'FAQ', emoji: '❓', path: '/faq' },
  ];

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: isDark ? '#0f0f0f' : '#f9f5f6',
      fontFamily: "'Inter', system-ui, sans-serif"
    }}>

      {/* NAVBAR */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 1000,
        backgroundColor: isDark ? 'rgba(18,18,18,0.95)' : 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${isDark ? '#2a2a2a' : '#f0e6e8'}`,
        padding: '0 24px',
        height: '64px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img src="logo.jpeg" alt="Logo" style={{
            width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover',
            border: '2px solid #e8a0a8'
          }} onError={(e) => e.target.style.display = 'none'} />
          <span style={{
            fontSize: '18px', fontWeight: '700',
            color: isDark ? '#f0c0c8' : '#c0606a',
            letterSpacing: '-0.3px'
          }}>Além do Positivo</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button onClick={toggleTheme} style={{
            width: '36px', height: '36px', borderRadius: '50%',
            border: `1px solid ${isDark ? '#333' : '#e8d0d4'}`,
            backgroundColor: 'transparent', cursor: 'pointer', fontSize: '16px',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>{isDark ? '☀️' : '🌙'}</button>

          {user && (
            <span style={{
              fontSize: '13px', color: isDark ? '#aaa' : '#888',
              padding: '6px 12px',
              backgroundColor: isDark ? '#1e1e1e' : '#fdf0f2',
              borderRadius: '20px',
              border: `1px solid ${isDark ? '#333' : '#f0d8dc'}`
            }}>Olá, {user.nome}!</span>
          )}

          <button onClick={() => setMenuAberto(!menuAberto)} style={{
            width: '36px', height: '36px', borderRadius: '8px',
            border: `1px solid ${isDark ? '#333' : '#e8d0d4'}`,
            backgroundColor: menuAberto ? (isDark ? '#2a2a2a' : '#fdf0f2') : 'transparent',
            cursor: 'pointer', fontSize: '18px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: isDark ? '#ccc' : '#888'
          }}>☰</button>

          {user ? (
            <button onClick={handleLogout} style={{
              padding: '8px 16px', borderRadius: '8px',
              border: '1px solid #ef4444', backgroundColor: 'transparent',
              color: '#ef4444', cursor: 'pointer', fontSize: '13px', fontWeight: '500'
            }}>Sair</button>
          ) : (
            <button onClick={() => navigate('/login')} style={{
              padding: '8px 20px', borderRadius: '8px',
              border: 'none', backgroundColor: '#c0606a',
              color: 'white', cursor: 'pointer', fontSize: '13px', fontWeight: '600'
            }}>Entrar</button>
          )}
        </div>
      </nav>

      {/* MENU LATERAL */}
      {menuAberto && (
        <>
          <div onClick={() => setMenuAberto(false)} style={{
            position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)',
            zIndex: 9998, backdropFilter: 'blur(2px)'
          }} />
          <div style={{
            position: 'fixed', top: 0, right: 0, height: '100vh', width: '260px',
            backgroundColor: isDark ? '#141414' : '#fff',
            borderLeft: `1px solid ${isDark ? '#2a2a2a' : '#f0e6e8'}`,
            zIndex: 9999, paddingTop: '72px', overflowY: 'auto',
            boxShadow: '-8px 0 32px rgba(0,0,0,0.15)'
          }}>
            <div style={{ padding: '8px' }}>
              {menuItems.map((item) => (
                <div key={item.path} onClick={() => { navigate(item.path); setMenuAberto(false); }}
                  style={{
                    padding: '12px 16px', borderRadius: '10px', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '12px',
                    color: isDark ? '#e0e0e0' : '#333',
                    marginBottom: '4px',
                    transition: 'background 0.15s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = isDark ? '#1e1e1e' : '#fdf0f2'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <span style={{ fontSize: '18px' }}>{item.emoji}</span>
                  <span style={{ fontSize: '15px', fontWeight: '500' }}>{item.label}</span>
                </div>
              ))}
              {(user?.isAdmin || user?.email === 'admin@alemdopositivo.com') && (
                <div onClick={() => { navigate('/admin'); setMenuAberto(false); }}
                  style={{
                    padding: '12px 16px', borderRadius: '10px', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '12px',
                    color: '#c0606a', marginTop: '8px',
                    borderTop: `1px solid ${isDark ? '#2a2a2a' : '#f0e6e8'}`,
                    paddingTop: '16px'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = isDark ? '#1e1e1e' : '#fdf0f2'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <span style={{ fontSize: '18px' }}>⚙️</span>
                  <span style={{ fontSize: '15px', fontWeight: '600' }}>Administração</span>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* HERO */}
      <div style={{
        background: isDark
          ? 'linear-gradient(135deg, #1a0a0c 0%, #2d1518 100%)'
          : 'linear-gradient(135deg, #fff0f2 0%, #fde8ec 100%)',
        padding: '60px 24px 50px',
        textAlign: 'center',
        borderBottom: `1px solid ${isDark ? '#2a1518' : '#f5d8dc'}`
      }}>
        <div style={{
          display: 'inline-block', padding: '6px 16px', borderRadius: '20px',
          backgroundColor: isDark ? 'rgba(192,96,106,0.15)' : 'rgba(192,96,106,0.1)',
          border: '1px solid rgba(192,96,106,0.3)',
          color: '#c0606a', fontSize: '13px', fontWeight: '600',
          marginBottom: '20px', letterSpacing: '0.5px'
        }}>💜 DOAÇÕES PARA BEBÊS</div>
        <h1 style={{
          fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: '800',
          color: isDark ? '#f5e0e2' : '#2d1518',
          margin: '0 0 16px', lineHeight: '1.2', letterSpacing: '-1px'
        }}>Conectando quem doa<br />com quem precisa</h1>
        <p style={{
          fontSize: '16px', color: isDark ? '#9a7a7e' : '#9a6870',
          maxWidth: '480px', margin: '0 auto 32px', lineHeight: '1.6'
        }}>Encontre itens para bebês doados por famílias da sua região. Tudo gratuito, com amor.</p>
        <button onClick={() => navigate('/doacao')} style={{
          padding: '14px 32px', borderRadius: '12px',
          backgroundColor: '#c0606a', color: 'white',
          border: 'none', fontSize: '15px', fontWeight: '600',
          cursor: 'pointer', boxShadow: '0 4px 20px rgba(192,96,106,0.4)',
          transition: 'all 0.2s'
        }}
          onMouseEnter={(e) => { e.target.style.backgroundColor = '#a85058'; e.target.style.transform = 'translateY(-2px)'; }}
          onMouseLeave={(e) => { e.target.style.backgroundColor = '#c0606a'; e.target.style.transform = 'translateY(0)'; }}
        >🎁 Quero Doar</button>
      </div>

      {/* FILTROS */}
      <div style={{
        backgroundColor: isDark ? '#141414' : '#fff',
        borderBottom: `1px solid ${isDark ? '#2a2a2a' : '#f0e6e8'}`,
        padding: '16px 24px'
      }}>
        <div style={{
          maxWidth: '900px', margin: '0 auto',
          display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center'
        }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
            <span style={{
              position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
              fontSize: '16px', pointerEvents: 'none'
            }}>🔍</span>
            <input
              type="text" placeholder="Pesquisar produtos..."
              value={pesquisa} onChange={(e) => setPesquisa(e.target.value)}
              style={{
                width: '100%', padding: '10px 14px 10px 42px',
                borderRadius: '10px', fontSize: '14px',
                border: `1px solid ${isDark ? '#333' : '#e8d0d4'}`,
                backgroundColor: isDark ? '#1e1e1e' : '#fdf8f8',
                color: isDark ? '#e0e0e0' : '#333', outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button onClick={() => setCategoriaFiltro('')} style={{
              padding: '8px 14px', borderRadius: '20px', fontSize: '13px',
              fontWeight: '500', cursor: 'pointer', border: '1px solid',
              borderColor: categoriaFiltro === '' ? '#c0606a' : (isDark ? '#333' : '#e8d0d4'),
              backgroundColor: categoriaFiltro === '' ? '#c0606a' : 'transparent',
              color: categoriaFiltro === '' ? 'white' : (isDark ? '#aaa' : '#666')
            }}>Todos</button>
            {categorias.map(cat => (
              <button key={cat.value} onClick={() => setCategoriaFiltro(cat.value)} style={{
                padding: '8px 14px', borderRadius: '20px', fontSize: '13px',
                fontWeight: '500', cursor: 'pointer', border: '1px solid',
                borderColor: categoriaFiltro === cat.value ? '#c0606a' : (isDark ? '#333' : '#e8d0d4'),
                backgroundColor: categoriaFiltro === cat.value ? '#c0606a' : 'transparent',
                color: categoriaFiltro === cat.value ? 'white' : (isDark ? '#aaa' : '#666')
              }}>{cat.emoji} {cat.label}</button>
            ))}
          </div>
        </div>
      </div>

      {/* PRODUTOS */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 24px' }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: '24px'
        }}>
          <span style={{ fontSize: '14px', color: isDark ? '#666' : '#999' }}>
            {produtosFiltrados.length} {produtosFiltrados.length === 1 ? 'item encontrado' : 'itens encontrados'}
          </span>
        </div>

        {produtosFiltrados.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '80px 20px',
            backgroundColor: isDark ? '#141414' : '#fff',
            borderRadius: '16px', border: `1px solid ${isDark ? '#2a2a2a' : '#f0e6e8'}`
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
            <h3 style={{ color: isDark ? '#e0e0e0' : '#333', marginBottom: '8px' }}>Nenhum item encontrado</h3>
            <p style={{ color: isDark ? '#666' : '#999', fontSize: '14px' }}>Tente ajustar os filtros ou a pesquisa</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '20px'
          }}>
            {produtosFiltrados.map(produto => (
              <div key={produto.id} style={{
                backgroundColor: isDark ? '#141414' : '#fff',
                borderRadius: '16px',
                border: `1px solid ${isDark ? '#2a2a2a' : '#f0e6e8'}`,
                overflow: 'hidden', cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
              }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 12px 32px rgba(192,96,106,0.15)';
                  e.currentTarget.style.borderColor = '#e8a0a8';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
                  e.currentTarget.style.borderColor = isDark ? '#2a2a2a' : '#f0e6e8';
                }}
              >
                {/* Imagem */}
                <div style={{
                  height: '180px', overflow: 'hidden',
                  backgroundColor: isDark ? '#1e1e1e' : '#fdf0f2',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  {produto.foto ? (
                    <img
                      src={`data:image/jpeg;base64,${produto.foto}`}
                      alt={produto.nome}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <span style={{ fontSize: '48px', opacity: 0.3 }}>📦</span>
                  )}
                </div>

                {/* Conteúdo */}
                <div style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', gap: '6px', marginBottom: '10px', flexWrap: 'wrap' }}>
                    {produto.categoria && (
                      <span style={{
                        padding: '3px 10px', borderRadius: '20px', fontSize: '11px',
                        fontWeight: '600', textTransform: 'capitalize',
                        backgroundColor: isDark ? '#2a1518' : '#fde8ec',
                        color: '#c0606a'
                      }}>{produto.categoria}</span>
                    )}
                    {produto.condicao && (
                      <span style={{
                        padding: '3px 10px', borderRadius: '20px', fontSize: '11px',
                        fontWeight: '600', textTransform: 'capitalize',
                        backgroundColor: isDark ? '#1a2a1a' : '#e8f5e9',
                        color: '#4caf50'
                      }}>{produto.condicao}</span>
                    )}
                  </div>

                  <h3 style={{
                    fontSize: '16px', fontWeight: '700', margin: '0 0 8px',
                    color: isDark ? '#f0e0e2' : '#2d1518'
                  }}>{produto.nome}</h3>

                  <p style={{
                    fontSize: '13px', color: isDark ? '#777' : '#999',
                    margin: '0 0 16px', lineHeight: '1.5',
                    display: '-webkit-box', WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical', overflow: 'hidden'
                  }}>{produto.descricao}</p>

                  <button onClick={() => navigate(`/produto/${produto.id}`)} style={{
                    width: '100%', padding: '10px',
                    backgroundColor: '#c0606a', color: 'white',
                    border: 'none', borderRadius: '10px',
                    fontSize: '13px', fontWeight: '600', cursor: 'pointer',
                    transition: 'background 0.2s'
                  }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#a85058'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#c0606a'}
                  >Ver Detalhes</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FOOTER */}
      <footer style={{
        borderTop: `1px solid ${isDark ? '#2a2a2a' : '#f0e6e8'}`,
        padding: '32px 24px',
        backgroundColor: isDark ? '#0f0f0f' : '#fff',
        textAlign: 'center'
      }}>
        <p style={{ color: isDark ? '#444' : '#bbb', fontSize: '13px', margin: '0 0 12px' }}>
          © 2024 Além do Positivo. Todos os direitos reservados.
        </p>
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
          <Link to="/termos-privacidade" style={{ color: '#c0606a', fontSize: '13px', textDecoration: 'none' }}>Termos de Privacidade</Link>
          <Link to="/manual-seguranca" style={{ color: '#c0606a', fontSize: '13px', textDecoration: 'none' }}>Manual de Segurança</Link>
        </div>
      </footer>
    </div>
  );
}

export default Home;
