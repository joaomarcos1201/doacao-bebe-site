import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

function Login({ setUser }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [tipoLogin, setTipoLogin] = useState('usuario');
  const [showEsqueciSenha, setShowEsqueciSenha] = useState(false);
  const navigate = useNavigate();
  const { theme, isDark, toggleTheme } = useTheme();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && senha) {
      if (tipoLogin === 'admin') {
        if (email === 'admin@alemdopositivo.com' && senha === 'admin123') {
          setUser({ email, nome: 'Administrador', isAdmin: true });
          navigate('/admin');
        } else {
          alert('Credenciais de administrador inválidas!');
        }
      } else {
        setUser({ email, nome: email.split('@')[0], isAdmin: false });
        navigate('/home');
      }
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
          Login - Além do Positivo
        </h2>
        
        <div style={{ marginBottom: '25px', textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', color: theme.text }}>
              <input
                type="radio"
                value="usuario"
                checked={tipoLogin === 'usuario'}
                onChange={(e) => setTipoLogin(e.target.value)}
                style={{ marginRight: '8px' }}
              />
              Usuário
            </label>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', color: theme.text }}>
              <input
                type="radio"
                value="admin"
                checked={tipoLogin === 'admin'}
                onChange={(e) => setTipoLogin(e.target.value)}
                style={{ marginRight: '8px' }}
              />
              Administrador
            </label>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: theme.text }}>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={tipoLogin === 'admin' ? 'Email do administrador' : 'seu@email.com'}
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
              placeholder={tipoLogin === 'admin' ? 'Senha do administrador' : 'sua senha'}
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
            {tipoLogin === 'admin' ? 'Entrar como Admin' : 'Entrar'}
          </button>
        </form>
        
        {tipoLogin === 'usuario' && (
          <div style={{ textAlign: 'center' }}>
            <Link to="/cadastro" style={{ color: theme.primary, textDecoration: 'none', marginBottom: '10px', display: 'block' }}>
              Não tem conta? Cadastre-se
            </Link>
            <button 
              onClick={() => setShowEsqueciSenha(!showEsqueciSenha)}
              style={{
                background: 'none',
                border: 'none',
                color: theme.primary,
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              Esqueci minha senha
            </button>
            {showEsqueciSenha && (
              <div style={{ marginTop: '15px', padding: '15px', backgroundColor: theme.background, borderRadius: '5px', fontSize: '14px', color: theme.textSecondary }}>
                Entre em contato conosco pelo email: suporte@alemdopositivo.com
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;