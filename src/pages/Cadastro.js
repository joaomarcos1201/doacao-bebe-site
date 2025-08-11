import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

function Cadastro() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [telefone, setTelefone] = useState('');
  const navigate = useNavigate();
  const { theme, isDark, toggleTheme } = useTheme();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (nome && email && senha && telefone) {
      alert('Cadastro realizado com sucesso!');
      navigate('/login');
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: theme.background, padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
        backgroundColor: theme.cardBackground, 
        padding: '40px', 
        borderRadius: '12px', 
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '400px',
        color: theme.text
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