import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useProdutos } from '../context/ProdutosContext';
import { useTheme } from '../context/ThemeContext';

function Home({ user, setUser }) {
  const navigate = useNavigate();
  const { produtos } = useProdutos();
  const { theme, isDark, toggleTheme } = useTheme();

  const handleLogout = () => {
    setUser(null);
    navigate('/login');
  };

  const handleContact = (produtoId) => {
    navigate(`/produto/${produtoId}`);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: theme.background }}>
      <header style={{ backgroundColor: theme.cardBackground, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
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
        <div style={{ textAlign: 'center', padding: '15px', backgroundColor: theme.background, borderTop: `1px solid ${theme.border}` }}>
          <Link to="/doacao" style={{ margin: '0 15px', color: theme.primary, textDecoration: 'none', fontWeight: 'bold' }}>Doar Produto</Link>
          {user.isAdmin && (
            <Link to="/admin" style={{ margin: '0 15px', color: theme.primary, textDecoration: 'none', fontWeight: 'bold' }}>Administração</Link>
          )}
        </div>
      </header>

      <div style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {produtos.map(produto => (
            <div key={produto.id} style={{
              backgroundColor: theme.cardBackground,
              padding: '20px',
              borderRadius: '12px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              border: `1px solid ${theme.border}`,
              color: theme.text
            }}>
              <h3 style={{ color: theme.primary, marginBottom: '15px' }}>{produto.nome}</h3>
              <p style={{ marginBottom: '8px', color: theme.text }}><strong>Categoria:</strong> <span style={{ textTransform: 'capitalize' }}>{produto.categoria}</span></p>
              <p style={{ marginBottom: '8px', color: theme.text }}><strong>Estado:</strong> <span style={{ textTransform: 'capitalize' }}>{produto.estado}</span></p>
              <p style={{ marginBottom: '8px', color: theme.textSecondary, lineHeight: '1.4' }}><strong>Descrição:</strong> {produto.descricao}</p>
              <p style={{ marginBottom: '15px', color: theme.text }}><strong>Doador:</strong> {produto.doador}</p>
              <button 
                onClick={() => handleContact(produto.id)}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: theme.primary,
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Entrar em Contato
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;