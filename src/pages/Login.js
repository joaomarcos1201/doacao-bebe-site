import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { sanitizeInput, validateEmail, getSecureHeaders } from '../utils/security';
import { API_URL } from '../config/api';

function Login({ setUser }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();

  useEffect(() => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.clear();
  }, [setUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !senha) return;
    setLoading(true);
    const cleanEmail = sanitizeInput(email);
    const cleanSenha = sanitizeInput(senha);
    if (!validateEmail(cleanEmail)) { alert('Email inválido'); setLoading(false); return; }
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST', headers: getSecureHeaders(),
        body: JSON.stringify({ email: cleanEmail, senha: cleanSenha }),
      });
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        setUser({ id: data.id, email: data.email, nome: data.nome, isAdmin: data.isAdmin });
        navigate(data.isAdmin ? '/admin' : '/home');
      } else {
        const errorData = await response.text();
        if (errorData.includes('Conta inativa')) {
          if (window.confirm('⚠️ Conta inativa. Deseja ir para a página de contato?')) navigate('/fale-conosco');
        } else { alert(errorData || 'Erro no login'); }
      }
    } catch { alert('Erro de conexão com o servidor'); }
    setLoading(false);
  };

  const input = {
    width: '100%', padding: '12px 16px', borderRadius: '10px', fontSize: '14px',
    border: `1px solid ${isDark ? '#333' : '#e8d0d4'}`,
    backgroundColor: isDark ? '#1e1e1e' : '#fdf8f8',
    color: isDark ? '#e0e0e0' : '#333', outline: 'none', boxSizing: 'border-box'
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      backgroundColor: isDark ? '#0f0f0f' : '#f9f5f6', padding: '20px',
      fontFamily: "'Inter', system-ui, sans-serif"
    }}>
      <div style={{ position: 'absolute', top: '20px', left: '20px' }}>
        <button onClick={() => navigate('/home')} style={{
          padding: '8px 16px', borderRadius: '8px', border: `1px solid ${isDark ? '#333' : '#e8d0d4'}`,
          backgroundColor: 'transparent', color: isDark ? '#aaa' : '#888', cursor: 'pointer', fontSize: '13px'
        }}>← Voltar</button>
      </div>
      <div style={{ position: 'absolute', top: '20px', right: '20px' }}>
        <button onClick={toggleTheme} style={{
          width: '36px', height: '36px', borderRadius: '50%', border: `1px solid ${isDark ? '#333' : '#e8d0d4'}`,
          backgroundColor: 'transparent', cursor: 'pointer', fontSize: '16px'
        }}>{isDark ? '☀️' : '🌙'}</button>
      </div>

      <div style={{
        width: '100%', maxWidth: '400px',
        backgroundColor: isDark ? '#141414' : '#fff',
        borderRadius: '20px', padding: '40px',
        border: `1px solid ${isDark ? '#2a2a2a' : '#f0e6e8'}`,
        boxShadow: '0 8px 40px rgba(0,0,0,0.08)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <img src="logo.jpeg" alt="Logo" style={{
            width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover',
            border: '2px solid #e8a0a8', marginBottom: '16px'
          }} onError={(e) => e.target.style.display = 'none'} />
          <h1 style={{ fontSize: '22px', fontWeight: '700', color: isDark ? '#f0e0e2' : '#2d1518', margin: '0 0 6px' }}>
            Além do Positivo
          </h1>
          <p style={{ fontSize: '14px', color: isDark ? '#666' : '#999', margin: 0 }}>Faça login para continuar</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: isDark ? '#ccc' : '#555', marginBottom: '6px' }}>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" style={input} required />
          </div>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: isDark ? '#ccc' : '#555', marginBottom: '6px' }}>Senha</label>
            <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} placeholder="••••••••" style={input} required />
          </div>
          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '12px', borderRadius: '10px', border: 'none',
            backgroundColor: '#c0606a', color: 'white', fontSize: '14px', fontWeight: '600',
            cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1,
            marginBottom: '16px'
          }}>{loading ? 'Entrando...' : 'Entrar'}</button>
        </form>

        <div style={{ textAlign: 'center', borderTop: `1px solid ${isDark ? '#2a2a2a' : '#f0e6e8'}`, paddingTop: '20px' }}>
          <Link to="/cadastro" style={{ color: '#c0606a', textDecoration: 'none', fontSize: '14px', fontWeight: '500', display: 'block', marginBottom: '10px' }}>
            Não tem conta? Cadastre-se
          </Link>
          <Link to="/recuperar-senha" style={{ color: isDark ? '#666' : '#aaa', textDecoration: 'none', fontSize: '13px' }}>
            Esqueci minha senha
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
