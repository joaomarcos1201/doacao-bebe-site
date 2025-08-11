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
      <div style={{ minHeight: '100vh', backgroundColor: theme.background, padding: '20px', color: theme.text }}>
        <div style={{ position: 'absolute', top: '20px', right: '20px' }}>
          <button 
            onClick={toggleTheme}
            style={{
              padding: '10px',
              backgroundColor: theme.cardBackground,
              color: theme.text,
              border: `1px solid ${theme.border}`,
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            {isDark ? '☀️' : '🌙'}
          </button>
        </div>
        <div style={{ maxWidth: '1200px', margin: '0 auto', paddingTop: '60px' }}>
          <div style={{ marginBottom: '20px' }}>
            <Link to="/home" style={{ color: theme.primary, textDecoration: 'none' }}>← Voltar ao Início</Link>
          </div>
          <h2 style={{ textAlign: 'center', color: theme.primary }}>Produto não encontrado</h2>
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
    <div style={{ minHeight: '100vh', backgroundColor: theme.background, padding: '20px' }}>
      <div style={{ position: 'absolute', top: '20px', right: '20px' }}>
        <button 
          onClick={toggleTheme}
          style={{
            padding: '10px',
            backgroundColor: theme.cardBackground,
            color: theme.text,
            border: `1px solid ${theme.border}`,
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          {isDark ? '☀️' : '🌙'}
        </button>
      </div>
      
      <div style={{ maxWidth: '1200px', margin: '0 auto', paddingTop: '60px' }}>
        <div style={{ marginBottom: '20px' }}>
          <Link to="/home" style={{ color: theme.primary, textDecoration: 'none', fontSize: '16px' }}>← Voltar ao Início</Link>
        </div>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'minmax(300px, 1fr) 1fr', 
          gap: '40px',
          backgroundColor: theme.cardBackground,
          padding: '30px',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          border: `1px solid ${theme.border}`
        }}>
          <div>
            {produto.imagem ? (
              <img 
                src={produto.imagem} 
                alt={produto.nome}
                style={{ 
                  width: '100%', 
                  height: '400px', 
                  objectFit: 'cover', 
                  borderRadius: '8px',
                  border: `1px solid ${theme.border}`
                }}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/400x400?text=Sem+Imagem';
                }}
              />
            ) : (
              <div style={{
                width: '100%',
                height: '400px',
                backgroundColor: theme.background,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '8px',
                border: `1px solid ${theme.border}`,
                color: theme.textSecondary
              }}>
                Sem imagem disponível
              </div>
            )}
          </div>
          
          <div>
            <h1 style={{ color: theme.primary, marginBottom: '30px', fontSize: '2.5rem' }}>{produto.nome}</h1>
            
            <div style={{ marginBottom: '20px', fontSize: '18px', color: theme.text }}>
              <strong>Categoria:</strong> <span style={{ textTransform: 'capitalize' }}>{produto.categoria}</span>
            </div>
            
            <div style={{ marginBottom: '20px', fontSize: '18px', color: theme.text }}>
              <strong>Estado:</strong> <span style={{ textTransform: 'capitalize' }}>{produto.estado}</span>
            </div>
            
            <div style={{ marginBottom: '25px' }}>
              <strong style={{ fontSize: '18px', color: theme.text }}>Descrição:</strong>
              <p style={{ marginTop: '10px', lineHeight: '1.6', fontSize: '16px', color: theme.textSecondary }}>{produto.descricao}</p>
            </div>
            
            <div style={{ marginBottom: '20px', fontSize: '18px', color: theme.text }}>
              <strong>Doador:</strong> {produto.doador}
            </div>
            
            <div style={{ marginBottom: '30px', fontSize: '18px', color: theme.text }}>
              <strong>Contato:</strong> {produto.contato}
            </div>
            
            <button 
              onClick={handleWhatsApp}
              style={{ 
                width: '100%',
                padding: '15px',
                backgroundColor: theme.whatsapp,
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '18px',
                cursor: 'pointer',
                fontWeight: 'bold',
                transition: 'background-color 0.3s'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#128C7E'}
              onMouseOut={(e) => e.target.style.backgroundColor = theme.whatsapp}
            >
              💬 Entrar em Contato via WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetalhesProduto;