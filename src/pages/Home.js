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
        backgroundColor: isDark ? 'rgba(15,15,15,0.97)' : 'rgba(255,252,253,0.92)',
        backdropFilter: 'blur(24px)',
        borderBottom: `1px solid ${isDark ? '#1e1e1e' : 'rgba(232,138,162,0.15)'}`,
        padding: '0 32px',
        height: '68px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        boxShadow: isDark ? 'none' : '0 1px 24px rgba(232,138,162,0.07)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img src="logo.jpeg" alt="Logo" style={{
            width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover',
            border: '2px solid #e8a0a8'
          }} onError={(e) => e.target.style.display = 'none'} />
          <span style={{
            fontSize: '18px', fontWeight: '700',
            color: isDark ? '#f0c0c8' : '#c0606a',
            letterSpacing: '-0.3px', whiteSpace: 'nowrap'
          }}>Além do Positivo</span>
          {/* BARRA DE PESQUISA */}
          <div style={{ position: 'relative' }}>
            <div style={{
              display: 'flex', alignItems: 'center',
              backgroundColor: isDark ? '#1a1a1a' : '#ffffff',
              border: `1.5px solid ${searchFocused ? '#E88AA2' : (isDark ? '#2a2a2a' : '#F8D7E3')}`,
              borderRadius: '999px',
              boxShadow: searchFocused
                ? '0 4px 24px rgba(232,138,162,0.22)'
                : '0 2px 16px rgba(232,138,162,0.1)',
              transition: 'all 0.25s ease',
              height: '46px',
              minWidth: '460px',
              overflow: 'visible'
            }}>

              {/* input */}
              <div style={{ display: 'flex', alignItems: 'center', flex: 1, padding: '0 12px 0 20px', position: 'relative', overflow: 'hidden', height: '100%' }}>
                <input
                  type="text"
                  value={pesquisa}
                  onChange={(e) => setPesquisa(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setTimeout(() => setSearchFocused(false), 150)}
                  style={{
                    border: 'none', outline: 'none', background: 'transparent',
                    fontSize: '14px', color: isDark ? '#f0f0f0' : '#374151',
                    width: '100%', fontFamily: "'Inter', system-ui, sans-serif",
                    WebkitAppearance: 'none', MozAppearance: 'none',
                    appearance: 'none', boxShadow: 'none',
                    borderRadius: '0', padding: '0', margin: '0',
                    position: 'relative', zIndex: 2
                  }}
                />
                {!pesquisa && (
                  <span style={{
                    position: 'absolute', left: '20px', top: '50%',
                    transform: placeholderVisible ? 'translateY(-50%)' : 'translateY(-70%)',
                    opacity: placeholderVisible ? 1 : 0,
                    transition: 'opacity 0.35s ease, transform 0.35s ease',
                    fontSize: '14px', color: isDark ? '#666' : '#E88AA2',
                    fontFamily: "'Inter', system-ui, sans-serif",
                    pointerEvents: 'none', whiteSpace: 'nowrap', zIndex: 1
                  }}>
                    {placeholders[placeholderIdx]}
                  </span>
                )}
              </div>

              {/* Divisor */}
              <div style={{ width: '1px', height: '22px', backgroundColor: isDark ? '#333' : '#e0e0e0', flexShrink: 0 }} />

              {/* Localização + Estado */}
              <div style={{ display: 'flex', alignItems: 'center', padding: '0 10px', gap: '5px', flexShrink: 0 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke={isDark ? '#888' : '#E88AA2'} strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                <select
                  value={estadoFiltro}
                  onChange={(e) => setEstadoFiltro(e.target.value)}
                  style={{
                    border: 'none', outline: 'none', background: 'transparent',
                    fontSize: '13px', fontWeight: '500',
                    color: isDark ? '#bbb' : '#6B7280',
                    cursor: 'pointer', fontFamily: "'Inter', system-ui, sans-serif",
                    maxWidth: '96px',
                    WebkitAppearance: 'none', MozAppearance: 'none',
                    appearance: 'none', boxShadow: 'none'
                  }}
                >
                  <option value="">Todo Brasil</option>
                  {estados.map(uf => (
                    <option key={uf} value={uf}>{uf}</option>
                  ))}
                </select>
                {/* seta dropdown */}
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
                  stroke={isDark ? '#888' : '#E88AA2'} strokeWidth="2.5">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </div>

              {/* Divisor */}
              <div style={{ width: '1px', height: '22px', backgroundColor: isDark ? '#333' : '#F8D7E3', flexShrink: 0 }} />

              {/* Botão lupa */}
              <button
                onClick={() => {}}
                style={{
                  height: '44px', width: '48px',
                  backgroundColor: '#E88AA2',
                  color: 'white', border: 'none', cursor: 'pointer',
                  borderRadius: '0 999px 999px 0',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'background-color 0.2s',
                  flexShrink: 0
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#d4708a'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#E88AA2'}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                  <circle cx="11" cy="11" r="8"/>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
              </button>
            </div>

            {/* DROPDOWN RECENTES */}
            {searchFocused && (
              <div style={{
                position: 'absolute', top: '48px', left: 0,
                width: '100%', backgroundColor: isDark ? '#1c1c1c' : '#fff',
                border: `1px solid ${isDark ? '#333' : '#F8D7E3'}`,
                borderRadius: '12px',
                boxShadow: '0 4px 20px rgba(232,138,162,0.12)',
                zIndex: 9999, overflow: 'hidden'
              }}>
                <div style={{
                  padding: '10px 16px 6px',
                  fontSize: '11px', fontWeight: '600',
                  color: isDark ? '#666' : '#E88AA2',
                  letterSpacing: '0.6px', textTransform: 'uppercase'
                }}>Recentes</div>
                {['Roupas de bebê', 'Brinquedos', 'Berço', 'Carrinho', 'Acessórios'].map((item) => (
                  <div
                    key={item}
                    onMouseDown={() => setPesquisa(item)}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '9px 16px', cursor: 'pointer',
                      transition: 'background 0.15s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = isDark ? '#2a2a2a' : '#FFF0F4'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                        stroke={isDark ? '#555' : '#F8D7E3'} strokeWidth="1.8">
                        <circle cx="12" cy="12" r="10"/>
                        <polyline points="12 6 12 12 16 14"/>
                      </svg>
                      <span style={{ fontSize: '13.5px', color: isDark ? '#ddd' : '#6B7280' }}>{item}</span>
                    </div>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
                      stroke={isDark ? '#444' : '#F8D7E3'} strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18"/>
                      <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </div>
                ))}
              </div>
            )}
          </div>
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
        <div style={{ flex: 1, maxWidth: '520px' }}>
          <div style={{
            display: 'inline-block', padding: '5px 14px', borderRadius: '20px',
            backgroundColor: isDark ? 'rgba(232,138,162,0.15)' : 'rgba(232,138,162,0.12)',
            border: '1px solid rgba(232,138,162,0.3)',
            color: '#E88AA2', fontSize: '12px', fontWeight: '600',
            marginBottom: '20px', letterSpacing: '0.8px'
          }}>DOAÇÕES PARA BEBÊS</div>

          <h1 style={{
            fontSize: 'clamp(40px, 5vw, 64px)', fontWeight: '900',
            color: isDark ? '#f5e0e2' : '#1a1a2e',
            margin: '0', lineHeight: '1.1', letterSpacing: '-2px'
          }}>
            Conectando quem doa com <span style={{ color: '#E88AA2', fontStyle: 'italic' }}>quem precisa</span>
          </h1>

          <p style={{
            fontSize: '15px', color: isDark ? '#9a7a7e' : '#6B7280',
            margin: '16px 0 32px', lineHeight: '1.7', maxWidth: '420px'
          }}>Encontre itens para bebês doados por famílias da sua região.<br />Tudo gratuito, com amor.</p>

          <button onClick={() => navigate('/baixar-app')} style={{
            padding: '14px 28px', borderRadius: '50px',
            backgroundColor: '#E88AA2', color: 'white',
            border: 'none', fontSize: '15px', fontWeight: '600',
            cursor: 'pointer', boxShadow: '0 4px 20px rgba(232,138,162,0.4)',
            transition: 'all 0.2s', display: 'inline-flex', alignItems: 'center', gap: '8px'
          }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#d4708a'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#E88AA2'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="1">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            Quero doar
          </button>



          {/* Mini features */}
          <div style={{ display: 'flex', flexDirection: 'row', gap: '70px', marginTop: '120px' }}>
            {[
              { icon: '♡', title: 'Tudo gratuito', sub: 'Sem custo para quem precisa' },
              { icon: '✦', title: 'Seguro e confiável', sub: 'Doações verificadas com carinho' },
              { icon: '⌂', title: 'Comunidade solidária', sub: 'Famílias ajudando outras famílias' },
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
            src="https://images.unsplash.com/photo-1492725764893-90b379c2b6e7?w=840&q=80&fit=crop&crop=faces"
            alt="mae-bebe.png"
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
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
            {[{ value: '', label: 'Todos', icon: '⊞' }, { value: 'roupas', label: 'Roupas', icon: '👕' }, { value: 'brinquedos', label: 'Brinquedos', icon: '🧸' }, { value: 'moveis', label: 'Móveis', icon: '🛏' }, { value: 'acessorios', label: 'Acessórios', icon: '🍼' }, { value: 'alimentacao', label: 'Alimentação', icon: '🥣' }, { value: 'outros', label: 'Outros', icon: '···' }].map(cat => (
              <button key={cat.value} onClick={() => setCategoriaFiltro(cat.value)} style={{
                padding: '12px 20px', borderRadius: '16px', fontSize: '13px',
                fontWeight: '500', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
                border: `1.5px solid ${categoriaFiltro === cat.value ? '#E88AA2' : (isDark ? '#2a2a2a' : '#F0F0F0')}`,
                backgroundColor: categoriaFiltro === cat.value ? 'rgba(232,138,162,0.1)' : (isDark ? '#1a1a1a' : '#fff'),
                color: categoriaFiltro === cat.value ? '#E88AA2' : (isDark ? '#aaa' : '#6B7280'),
                transition: 'all 0.18s ease', minWidth: '80px',
                boxShadow: categoriaFiltro === cat.value ? '0 2px 12px rgba(232,138,162,0.2)' : '0 1px 4px rgba(0,0,0,0.04)'
              }}
                onMouseEnter={(e) => { if (categoriaFiltro !== cat.value) e.currentTarget.style.borderColor = '#F8D7E3'; }}
                onMouseLeave={(e) => { if (categoriaFiltro !== cat.value) e.currentTarget.style.borderColor = isDark ? '#2a2a2a' : '#F0F0F0'; }}
              >
                <span style={{ fontSize: '20px' }}>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* COMO FUNCIONA */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '48px 32px 0' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '800', color: isDark ? '#f0e0e2' : '#1a1a2e', margin: '0 0 6px' }}>Como funciona</h2>
        <p style={{ fontSize: '14px', color: isDark ? '#777' : '#9CA3AF', margin: '0 0 28px' }}>Três passos simples para transformar vidas</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '48px' }}>
          {[
            { num: '1', emoji: '📦', title: 'Doe itens', desc: 'Separe itens que seu bebê não usa mais e doe com carinho.' },
            { num: '2', emoji: '👨‍👩‍👧', title: 'Encontre famílias', desc: 'Famílias que precisam encontram o que seu bebê precisa.' },
            { num: '3', emoji: '💝', title: 'Ajude quem precisa', desc: 'Seu gesto transforma o dia e a vida de outras famílias.' },
          ].map(step => (
            <div key={step.num} style={{
              backgroundColor: isDark ? '#161616' : '#fff',
              borderRadius: '20px', padding: '28px 24px',
              border: `1px solid ${isDark ? '#222' : 'rgba(248,215,227,0.6)'}`,
              boxShadow: isDark ? '0 2px 12px rgba(0,0,0,0.3)' : '0 2px 16px rgba(232,138,162,0.08)',
              display: 'flex', alignItems: 'flex-start', gap: '16px'
            }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '50%',
                backgroundColor: '#E88AA2', color: 'white',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '13px', fontWeight: '700', flexShrink: 0
              }}>{step.num}</div>
              <div>
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>{step.emoji}</div>
                <div style={{ fontSize: '15px', fontWeight: '700', color: isDark ? '#f0e0e2' : '#1a1a2e', marginBottom: '6px' }}>{step.title}</div>
                <div style={{ fontSize: '13px', color: isDark ? '#777' : '#9CA3AF', lineHeight: '1.6' }}>{step.desc}</div>
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
            {produtosFiltrados.length} {produtosFiltrados.length === 1 ? 'item encontrado' : 'itens encontrados'}
          </span>
        </div>

        {produtosFiltrados.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '80px 20px',
            backgroundColor: isDark ? '#141414' : '#fff',
            borderRadius: '16px', border: `1px solid ${isDark ? '#2a2a2a' : '#f0e6e8'}`
          }}>

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
