import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, MapPin, ChevronDown, Moon, Sun, Menu, LogOut, LogIn, X, Clock, Grid2x2, Shirt, Bed, Baby, Soup, Ellipsis } from 'lucide-react';
import { useProdutos } from '../context/ProdutosContext';
import { useTheme } from '../context/ThemeContext';

function Home({ user, setUser }) {
  const navigate = useNavigate();
  const { produtos, removerProduto } = useProdutos();
  const { theme, isDark, toggleTheme } = useTheme();
  const [pesquisa, setPesquisa] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('');
  const [menuAberto, setMenuAberto] = useState(false);
  const [estadoFiltro, setEstadoFiltro] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);

  const estados = ['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO'];

  const placeholders = ['Buscar Roupas...', 'Buscar Brinquedos...', 'Buscar Acessórios...'];
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const [placeholderVisible, setPlaceholderVisible] = useState(true);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderVisible(false);
      setTimeout(() => {
        setPlaceholderIdx(prev => (prev + 1) % 3);
        setPlaceholderVisible(true);
      }, 400);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

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
    { value: 'roupas', label: 'Roupas' },
    { value: 'brinquedos', label: 'Brinquedos' },
    { value: 'moveis', label: 'Móveis' },
    { value: 'acessorios', label: 'Acessórios' },
    { value: 'alimentacao', label: 'Alimentação' },
    { value: 'outros', label: 'Outros' },
  ];

  const categoriaLabel = {
    roupas: '🧺 Roupas',
    brinquedos: '🪀 Brinquedos',
    moveis: '🪑 Móveis',
    acessorios: '🍼 Acessórios',
    alimentacao: '🥣 Alimentação',
    outros: '📦 Outros',
  };

  const menuItems = [
    { label: 'Meu Perfil', path: '/perfil', authRequired: true },
    { label: 'Sobre Nós', path: '/sobre-nos' },
    { label: 'Fale Conosco', path: '/fale-conosco' },
    { label: 'FAQ', path: '/faq' },
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: isDark
        ? '#0f0f0f'
        : 'linear-gradient(160deg, #fff7f9 0%, #fdf0f3 40%, #fce8ed 100%)',
      fontFamily: "'Inter', system-ui, sans-serif"
    }}>

      {/* NAVBAR */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 1000,
        backgroundColor: isDark ? 'rgba(10,10,10,0.85)' : 'rgba(255,250,252,0.75)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(232,138,162,0.18)'}`,
        padding: '0 28px',
        height: '64px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        boxShadow: isDark ? '0 4px 24px rgba(0,0,0,0.4)' : '0 4px 24px rgba(232,138,162,0.1)'
      }}>

        {/* LOGO */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          <img src="logo.jpeg" alt="Logo" style={{
            width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover',
            border: '2px solid rgba(232,138,162,0.5)'
          }} onError={(e) => e.target.style.display = 'none'} />
          <span style={{
            fontSize: '16px', fontWeight: '700',
            color: isDark ? '#f0c0c8' : '#c0606a',
            letterSpacing: '-0.3px', whiteSpace: 'nowrap'
          }}>Além do Positivo</span>
        </div>

        {/* BARRA DE PESQUISA */}
        <div style={{ position: 'relative', flex: 1, maxWidth: '480px', margin: '0 20px' }}>
          <div style={{
            display: 'flex', alignItems: 'center',
            backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.9)',
            border: `1.5px solid ${searchFocused ? '#E88AA2' : (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(232,138,162,0.25)')}`,
            borderRadius: '999px',
            boxShadow: searchFocused ? '0 0 0 3px rgba(232,138,162,0.15)' : 'none',
            transition: 'all 0.25s ease',
            height: '42px',
            overflow: 'visible'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', flex: 1, padding: '0 12px 0 18px', position: 'relative', overflow: 'hidden', height: '100%' }}>
              <input
                type="text"
                value={pesquisa}
                onChange={(e) => setPesquisa(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setTimeout(() => setSearchFocused(false), 150)}
                style={{
                  border: 'none', outline: 'none', background: 'transparent',
                  fontSize: '13.5px', color: isDark ? '#f0f0f0' : '#374151',
                  width: '100%', fontFamily: "'Inter', system-ui, sans-serif",
                  WebkitAppearance: 'none', appearance: 'none', boxShadow: 'none',
                  padding: '0', margin: '0', position: 'relative', zIndex: 2
                }}
              />
              {!pesquisa && (
                <span style={{
                  position: 'absolute', left: '18px', top: '50%',
                  transform: placeholderVisible ? 'translateY(-50%)' : 'translateY(-70%)',
                  opacity: placeholderVisible ? 1 : 0,
                  transition: 'opacity 0.35s ease, transform 0.35s ease',
                  fontSize: '13.5px', color: isDark ? '#555' : '#c0a0a8',
                  pointerEvents: 'none', whiteSpace: 'nowrap', zIndex: 1
                }}>
                  {placeholders[placeholderIdx]}
                </span>
              )}
            </div>

            <div style={{ width: '1px', height: '20px', backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(232,138,162,0.2)', flexShrink: 0 }} />

            <div style={{ display: 'flex', alignItems: 'center', padding: '0 10px', gap: '4px', flexShrink: 0 }}>
              <MapPin size={13} color={isDark ? '#666' : '#E88AA2'} strokeWidth={2} />
              <select
                value={estadoFiltro}
                onChange={(e) => setEstadoFiltro(e.target.value)}
                style={{
                  border: 'none', outline: 'none', background: 'transparent',
                  fontSize: '12px', fontWeight: '500',
                  color: isDark ? '#999' : '#6B7280',
                  cursor: 'pointer', fontFamily: "'Inter', system-ui, sans-serif",
                  maxWidth: '88px',
                  WebkitAppearance: 'none', appearance: 'none', boxShadow: 'none'
                }}
              >
                <option value="">Todo Brasil</option>
                {estados.map(uf => <option key={uf} value={uf}>{uf}</option>)}
              </select>
              <ChevronDown size={12} color={isDark ? '#666' : '#E88AA2'} strokeWidth={2.5} />
            </div>

            <div style={{ width: '1px', height: '20px', backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(232,138,162,0.2)', flexShrink: 0 }} />

            <button onClick={() => {}} style={{
              height: '40px', width: '44px',
              background: 'linear-gradient(135deg, #E88AA2 0%, #d4708a 100%)',
              color: 'white', border: 'none', cursor: 'pointer',
              borderRadius: '0 999px 999px 0',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'opacity 0.2s', flexShrink: 0
            }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.85'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            >
              <Search size={15} color="white" strokeWidth={2.5} />
            </button>
          </div>

          {searchFocused && (
            <div style={{
              position: 'absolute', top: '46px', left: 0,
              width: '100%', backgroundColor: isDark ? 'rgba(20,20,20,0.97)' : 'rgba(255,255,255,0.98)',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(232,138,162,0.2)'}`,
              borderRadius: '16px',
              boxShadow: '0 8px 32px rgba(232,138,162,0.15)',
              backdropFilter: 'blur(12px)',
              zIndex: 9999, overflow: 'hidden'
            }}>
              <div style={{ padding: '10px 16px 6px', fontSize: '10px', fontWeight: '700',
                color: isDark ? '#555' : '#E88AA2', letterSpacing: '1px', textTransform: 'uppercase'
              }}>Recentes</div>
              {['Roupas femininas', 'Sofá', 'Bicicleta', 'Tênis', 'Eletrônicos'].map((item) => (
                <div key={item} onMouseDown={() => setPesquisa(item)}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '9px 16px', cursor: 'pointer', transition: 'background 0.15s' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = isDark ? 'rgba(255,255,255,0.05)' : '#FFF0F4'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <span style={{ fontSize: '13px', color: isDark ? '#ccc' : '#6B7280' }}>{item}</span>
                  <X size={10} color={isDark ? '#444' : '#ddd'} strokeWidth={2} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* AÇÕES DIREITA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>

          {/* Botão tema */}
          <button onClick={toggleTheme} style={{
            width: '34px', height: '34px', borderRadius: '10px',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(232,138,162,0.25)'}`,
            backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(232,138,162,0.08)',
            cursor: 'pointer', fontSize: '15px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.2s'
          }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(232,138,162,0.15)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(232,138,162,0.08)'}
>            {isDark ? <Sun size={16} color="#f0c060" strokeWidth={2} /> : <Moon size={16} color="#c0606a" strokeWidth={2} />}
          </button>

          {user && (
            <span style={{
              fontSize: '12px', color: isDark ? '#aaa' : '#c0606a',
              padding: '5px 12px',
              backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(232,138,162,0.1)',
              borderRadius: '20px',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(232,138,162,0.2)'}`,
              fontWeight: '500'
            }}>Olá, {user.nome}!</span>
          )}

          {/* Menu hambúrguer */}
          <button onClick={() => setMenuAberto(!menuAberto)} style={{
            width: '34px', height: '34px', borderRadius: '10px',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(232,138,162,0.25)'}`,
            backgroundColor: menuAberto
              ? (isDark ? 'rgba(232,138,162,0.15)' : 'rgba(232,138,162,0.12)')
              : (isDark ? 'rgba(255,255,255,0.05)' : 'rgba(232,138,162,0.08)'),
            cursor: 'pointer',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '4px',
            transition: 'all 0.2s', padding: '0'
          }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(232,138,162,0.15)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = menuAberto ? (isDark ? 'rgba(232,138,162,0.15)' : 'rgba(232,138,162,0.12)') : (isDark ? 'rgba(255,255,255,0.05)' : 'rgba(232,138,162,0.08)')}
          >
            <Menu size={16} color={isDark ? '#ccc' : '#c0606a'} strokeWidth={2} />
          </button>

          {/* Entrar / Sair */}
          {user ? (
            <button onClick={handleLogout} style={{
              padding: '7px 16px', borderRadius: '10px',
              border: '1px solid rgba(239,68,68,0.4)', backgroundColor: 'transparent',
              color: '#ef4444', cursor: 'pointer', fontSize: '13px', fontWeight: '500',
              transition: 'all 0.2s'
            }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.08)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>Sair <LogOut size={13} /></button>
          ) : (
            <button onClick={() => navigate('/login')} style={{
              padding: '7px 20px', borderRadius: '10px',
              border: 'none',
              background: 'linear-gradient(135deg, #E88AA2 0%, #c0606a 100%)',
              color: 'white', cursor: 'pointer', fontSize: '13px', fontWeight: '600',
              boxShadow: '0 4px 14px rgba(232,138,162,0.4)',
              transition: 'all 0.2s'
            }}
              onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.88'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >Entrar</button>
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
          : 'linear-gradient(160deg, #fff0f4 0%, #fde4ec 60%, #fcd8e4 100%)',
        padding: '0px 48px 60px',
        borderBottom: `1px solid ${isDark ? '#2a1518' : 'rgba(232,138,162,0.15)'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: '40px', overflow: 'hidden', position: 'relative'
      }}>
        {/* Círculos decorativos */}
        <div style={{ position: 'absolute', top: '-60px', right: '320px', width: '200px', height: '200px', borderRadius: '50%', backgroundColor: 'rgba(232,138,162,0.1)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-40px', right: '200px', width: '140px', height: '140px', borderRadius: '50%', backgroundColor: 'rgba(232,138,162,0.08)', pointerEvents: 'none' }} />

        {/* Lado esquerdo */}
        <div style={{ flex: 1, maxWidth: '620px' }}>
          <h1 style={{
            fontSize: 'clamp(28px, 3.5vw, 48px)', fontWeight: '900',
            color: isDark ? '#f5e0e2' : '#1a1a2e',
            margin: '0', lineHeight: '1.2', letterSpacing: '-1px'
          }}>
            Compre ou anuncie seu<br /><span style={{ color: '#E88AA2', fontStyle: 'italic' }}>produto próximo a sua região</span>
          </h1>

          <p style={{
            fontSize: '15px', color: isDark ? '#9a7a7e' : '#6B7280',
            margin: '16px 0 32px', lineHeight: '1.7', maxWidth: '420px'
          }}>Encontre roupas, móveis e tudo o que precisa para seu bebê perto de você. Simples, rápido e seguro.</p>

          <button onClick={() => navigate('/doacao')} style={{
            padding: '14px 28px', borderRadius: '50px',
            backgroundColor: '#E88AA2', color: 'white',
            border: 'none', fontSize: '15px', fontWeight: '600',
            cursor: 'pointer', boxShadow: '0 4px 20px rgba(232,138,162,0.4)',
            transition: 'all 0.2s', display: 'inline-flex', alignItems: 'center', gap: '8px'
          }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#d4708a'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#E88AA2'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="1.5">
              <path d="M12 5v14M5 12h14" strokeLinecap="round"/>
            </svg>
            Anunciar agora
          </button>



          {/* Mini features */}
          <div style={{ display: 'flex', flexDirection: 'row', gap: '70px', marginTop: '120px' }}>
            {[
              { icon: '🏷️', title: 'Preços justos', sub: 'Negocie diretamente com o vendedor' },
              { icon: '✦', title: 'Seguro e confiável', sub: 'Anúncios verificados com cuidado' },
              { icon: '⌂', title: 'Perto de você', sub: 'Compre e venda na sua região' },
            ].map(f => (
              <div key={f.title} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <span style={{ fontSize: '18px', color: '#E88AA2', marginTop: '2px' }}>{f.icon}</span>
                <div>
                  <div style={{ fontSize: '15px', fontWeight: '700', color: isDark ? '#eee' : '#1a1a2e' }}>{f.title}</div>
                  <div style={{ fontSize: '13px', color: isDark ? '#777' : '#9CA3AF', lineHeight: '1.5', marginTop: '4px' }}>{f.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Lado direito — imagem decorativa */}
        <div style={{
          width: '420px', height: '480px', flexShrink: 0,
          borderRadius: '32px', overflow: 'hidden',
          boxShadow: '0 8px 40px rgba(232,138,162,0.2)'
        }}>
          <img
            src="mae-bebe.jpg"
            alt="produtos seminovos"
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}
          />
        </div>
      </div>

      {/* FILTROS */}
      <div style={{
        backgroundColor: isDark ? '#141414' : 'rgba(255,255,255,0.7)',
        backdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${isDark ? '#2a2a2a' : 'rgba(232,138,162,0.12)'}`,
        padding: '20px 32px'
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center' }}>
            {[{ value: '', label: 'Todos', icon: <Grid2x2 size={18} strokeWidth={1.8} /> }, { value: 'roupas', label: 'Roupas', icon: <Shirt size={18} strokeWidth={1.8} /> }, { value: 'brinquedos', label: 'Brinquedos', icon: <Baby size={18} strokeWidth={1.8} /> }, { value: 'moveis', label: 'Móveis', icon: <Bed size={18} strokeWidth={1.8} /> }, { value: 'acessorios', label: 'Acessórios', icon: <Baby size={18} strokeWidth={1.8} /> }, { value: 'alimentacao', label: 'Alimentação', icon: <Soup size={18} strokeWidth={1.8} /> }, { value: 'outros', label: 'Outros', icon: <Ellipsis size={18} strokeWidth={1.8} /> }].map(cat => (
              <button key={cat.value} onClick={() => setCategoriaFiltro(cat.value)} style={{
                padding: '8px 16px', borderRadius: '12px', fontSize: '13px',
                fontWeight: '500', cursor: 'pointer', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '7px',
                border: `1.5px solid ${categoriaFiltro === cat.value ? '#E88AA2' : (isDark ? '#2a2a2a' : '#F0F0F0')}`,
                backgroundColor: categoriaFiltro === cat.value ? 'rgba(232,138,162,0.1)' : (isDark ? '#1a1a1a' : '#fff'),
                color: categoriaFiltro === cat.value ? '#E88AA2' : (isDark ? '#aaa' : '#6B7280'),
                transition: 'all 0.18s ease',
                boxShadow: categoriaFiltro === cat.value ? '0 2px 12px rgba(232,138,162,0.2)' : '0 1px 4px rgba(0,0,0,0.04)'
              }}
                onMouseEnter={(e) => { if (categoriaFiltro !== cat.value) e.currentTarget.style.borderColor = '#F8D7E3'; }}
                onMouseLeave={(e) => { if (categoriaFiltro !== cat.value) e.currentTarget.style.borderColor = isDark ? '#2a2a2a' : '#F0F0F0'; }}
              >
                <span style={{ color: categoriaFiltro === cat.value ? '#E88AA2' : (isDark ? '#aaa' : '#9CA3AF'), display: 'flex' }}>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* COMO FUNCIONA */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '56px 32px 0' }}>
        <h2 style={{ fontSize: '26px', fontWeight: '800', color: isDark ? '#f0e0e2' : '#1a1a2e', margin: '0 0 6px', letterSpacing: '-0.5px' }}>Como funciona</h2>
        <p style={{ fontSize: '14px', color: isDark ? '#666' : '#9CA3AF', margin: '0 0 32px' }}>Três passos simples para comprar ou vender</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '56px' }}>
          {[
            {
              num: '1', title: 'Anuncie seu item', desc: 'Tire fotos, defina o preço e publique em segundos.',
              svg: (
                <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                  <rect width="80" height="80" rx="20" fill="#fde8f0"/>
                  <rect x="20" y="30" width="40" height="28" rx="5" fill="#f5b8ce" stroke="#e88aa2" strokeWidth="1.5"/>
                  <rect x="20" y="26" width="40" height="8" rx="4" fill="#e88aa2"/>
                  <line x1="40" y1="26" x2="40" y2="58" stroke="#d4708a" strokeWidth="1.5"/>
                  <path d="M33 20 Q40 15 47 20" stroke="#e88aa2" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                </svg>
              )
            },
            {
              num: '2', title: 'Encontre o que quer', desc: 'Busque roupas, móveis e objetos seminovos perto de você.',
              svg: (
                <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                  <rect width="80" height="80" rx="20" fill="#fde8f0"/>
                  <circle cx="40" cy="28" r="10" fill="#f5b8ce" stroke="#e88aa2" strokeWidth="1.5"/>
                  <path d="M22 58 Q22 44 40 44 Q58 44 58 58" fill="#f5b8ce" stroke="#e88aa2" strokeWidth="1.5"/>
                  <circle cx="27" cy="35" r="6" fill="#fde8f0" stroke="#e88aa2" strokeWidth="1.2"/>
                  <circle cx="53" cy="35" r="6" fill="#fde8f0" stroke="#e88aa2" strokeWidth="1.2"/>
                </svg>
              )
            },
            {
              num: '3', title: 'Negocie e feche', desc: 'Entre em contato pelo WhatsApp e combine a entrega ou retirada.',
              svg: (
                <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                  <rect width="80" height="80" rx="20" fill="#fde8f0"/>
                  <path d="M40 55 L19 36 Q14 28 22 23 Q30 18 37 26 L40 29 L43 26 Q50 18 58 23 Q66 28 61 36 Z" fill="#f5b8ce" stroke="#e88aa2" strokeWidth="1.5" strokeLinejoin="round"/>
                  <circle cx="40" cy="44" r="5" fill="#e88aa2" opacity="0.5"/>
                </svg>
              )
            },
          ].map(step => (
            <div key={step.num} style={{
              backgroundColor: isDark ? '#161616' : '#fff',
              borderRadius: '22px',
              padding: '28px 24px',
              border: `1px solid ${isDark ? '#222' : 'rgba(248,215,227,0.7)'}`,
              boxShadow: isDark ? '0 2px 16px rgba(0,0,0,0.3)' : '0 4px 24px rgba(232,138,162,0.09)',
              display: 'flex', alignItems: 'center', gap: '20px',
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute', top: '18px', left: '18px',
                width: '28px', height: '28px', borderRadius: '50%',
                backgroundColor: '#E88AA2', color: 'white',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '12px', fontWeight: '800', flexShrink: 0,
                boxShadow: '0 2px 8px rgba(232,138,162,0.4)'
              }}>{step.num}</div>
              <div style={{ flexShrink: 0, marginTop: '8px' }}>{step.svg}</div>
              <div>
                <div style={{ fontSize: '16px', fontWeight: '700', color: isDark ? '#f0e0e2' : '#1a1a2e', marginBottom: '8px' }}>{step.title}</div>
                <div style={{ fontSize: '13.5px', color: isDark ? '#777' : '#9CA3AF', lineHeight: '1.65' }}>{step.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
            {/* PRODUTOS */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 24px' }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: '24px'
        }}>
          <span style={{ fontSize: '14px', color: isDark ? '#666' : '#999' }}>
            {produtosFiltrados.length} {produtosFiltrados.length === 1 ? 'anúncio encontrado' : 'anúncios encontrados'}
          </span>
        </div>

        {produtosFiltrados.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '80px 20px',
            backgroundColor: isDark ? '#141414' : '#fff',
            borderRadius: '16px', border: `1px solid ${isDark ? '#2a2a2a' : '#f0e6e8'}`
          }}>

            <h3 style={{ color: isDark ? '#e0e0e0' : '#333', marginBottom: '8px' }}>Nenhum anúncio encontrado</h3>
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
                backgroundColor: isDark ? '#161616' : '#ffffff',
                borderRadius: '20px',
                border: `1px solid ${isDark ? '#222' : 'rgba(248,215,227,0.6)'}`,
                overflow: 'hidden', cursor: 'pointer',
                transition: 'all 0.22s ease',
                boxShadow: isDark
                  ? '0 2px 12px rgba(0,0,0,0.3)'
                  : '0 2px 16px rgba(232,138,162,0.08)'
              }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.boxShadow = isDark
                    ? '0 16px 40px rgba(0,0,0,0.4)'
                    : '0 16px 40px rgba(232,138,162,0.18)';
                  e.currentTarget.style.borderColor = '#E88AA2';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = isDark
                    ? '0 2px 12px rgba(0,0,0,0.3)'
                    : '0 2px 16px rgba(232,138,162,0.08)';
                  e.currentTarget.style.borderColor = isDark ? '#222' : 'rgba(248,215,227,0.6)';
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
                    <span style={{ fontSize: '14px', opacity: 0.4, color: isDark ? '#666' : '#bbb' }}>Sem imagem</span>
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
                      }}>{categoriaLabel[produto.categoria] || produto.categoria}</span>
                    )}
                    {produto.condicao || produto.estado ? (
                      <span style={{
                        padding: '3px 10px', borderRadius: '20px', fontSize: '11px',
                        fontWeight: '600', textTransform: 'capitalize',
                        backgroundColor: isDark ? '#1a2a1a' : '#e8f5e9',
                        color: '#4caf50'
                      }}>{produto.condicao || produto.estado}</span>
                    ) : null}
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
                  >Ver Anúncio</button>
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
