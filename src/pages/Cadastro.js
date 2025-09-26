import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

function Cadastro() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [telefone, setTelefone] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();
  const { theme, isDark, toggleTheme } = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (nome && email && senha) {
      try {
        const response = await fetch('http://localhost:5000/api/auth/cadastro', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ nome, email, senha }),
        });

        if (response.ok) {
          setShowSuccess(true);
          setTimeout(() => {
            navigate('/login');
          }, 3000);
        } else {
          const errorData = await response.text();
          alert(errorData || 'Erro no cadastro');
        }
      } catch (error) {
        alert('Erro de conexão com o servidor');
      }
    }
  };

  if (showSuccess) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #ffc0cb 0%, #f8d7da 100%)',
        padding: '20px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <div style={{ 
          backgroundColor: isDark ? 'rgba(105, 72, 75, 0.95)' : 'rgba(255, 255, 255, 0.95)', 
          backdropFilter: 'blur(15px)',
          padding: '50px', 
          borderRadius: '16px', 
          boxShadow: '0 12px 40px rgba(0,0,0,0.4)',
          width: '100%',
          maxWidth: '500px',
          textAlign: 'center',
          border: `2px solid ${theme.primary}`
        }}>
          <div style={{ 
            fontSize: '60px', 
            marginBottom: '20px',
            color: theme.primary 
          }}>
            ✅
          </div>
          <h2 style={{ 
            color: theme.primary, 
            marginBottom: '20px',
            fontSize: '28px'
          }}>
            Cadastro confirmado!
          </h2>
          <p style={{ 
            color: theme.text, 
            fontSize: '16px',
            lineHeight: '1.6',
            marginBottom: '30px'
          }}>
            Seu cadastro foi realizado com sucesso. Estamos felizes em ter você aqui. A partir de agora, você pode solicitar doações e encontrar o apoio que precisa.
          </p>
          <div style={{
            fontSize: '14px',
            color: theme.textSecondary
          }}>
            Redirecionando para o login...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #ffc0cb 0%, #f8d7da 100%)',
      padding: '20px', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center' 
    }}>
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
      
      <div style={{ 
        backgroundColor: isDark ? 'rgba(105, 72, 75, 0.9)' : 'rgba(255, 255, 255, 0.85)', 
        backdropFilter: 'blur(10px)',
        padding: '40px', 
        borderRadius: '12px', 
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
        width: '100%',
        maxWidth: '400px',
        color: theme.text,
        border: `1px solid ${isDark ? 'rgba(173, 115, 120, 0.3)' : 'rgba(179, 116, 122, 0.3)'}`
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px', color: theme.primary }}>
          Cadastro - Além do Positivo
        </h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: theme.text }}>Nome:</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: `1px solid ${theme.border}`,
                borderRadius: '5px',
                backgroundColor: theme.background,
                color: theme.text
              }}
              required
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: theme.text }}>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: `1px solid ${theme.border}`,
                borderRadius: '5px',
                backgroundColor: theme.background,
                color: theme.text
              }}
              required
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: theme.text }}>Telefone:</label>
            <input
              type="tel"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: `1px solid ${theme.border}`,
                borderRadius: '5px',
                backgroundColor: theme.background,
                color: theme.text
              }}
              required
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: theme.text }}>Senha:</label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: `1px solid ${theme.border}`,
                borderRadius: '5px',
                backgroundColor: theme.background,
                color: theme.text
              }}
              required
            />
          </div>
          <button 
            type="submit" 
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: theme.primary,
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              fontSize: '16px',
              cursor: 'pointer',
              marginBottom: '15px'
            }}
          >
            Cadastrar
          </button>
        </form>
        <div style={{ textAlign: 'center' }}>
          <Link to="/login" style={{ color: theme.primary, textDecoration: 'none' }}>Já tem conta? Faça login</Link>
        </div>
      </div>
    </div>
  );
}

export default Cadastro;