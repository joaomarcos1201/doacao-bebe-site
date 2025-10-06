import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { sanitizeInput, validateEmail, getSecureHeaders, API_BASE_URL } from '../utils/security';

function Login({ setUser }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { theme, isDark, toggleTheme } = useTheme();

  // Limpar estado quando acessar a página de login
  useEffect(() => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }, [setUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (email && senha) {
      setLoading(true);
      
      {
      // Validar entrada
      const cleanEmail = sanitizeInput(email);
      const cleanSenha = sanitizeInput(senha);
      
      if (!validateEmail(cleanEmail)) {
        alert('Email inválido');
        setLoading(false);
        return;
      }
      
      try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
          method: 'POST',
          headers: getSecureHeaders(),
          body: JSON.stringify({ email: cleanEmail, senha: cleanSenha }),
        });

        if (response.ok) {
          const data = await response.json();
          localStorage.setItem('token', data.token);
          setUser({ 
            id: data.id,
            email: data.email, 
            nome: data.nome, 
            isAdmin: data.isAdmin 
          });
          
          // Redirecionar baseado no tipo de usuário
          if (data.isAdmin) {
            navigate('/admin');
          } else {
            navigate('/home');
          }
        } else {
          const errorData = await response.text();
          alert(errorData || 'Erro no login');
        }
      } catch (error) {
        alert('Erro de conexão com o servidor');
      }
      }
      
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: isDark 
        ? 'linear-gradient(135deg, #2d1b2e 0%, #4a2c4a 50%, #6b4c6b 100%)'
        : 'linear-gradient(135deg, #ffeef0 0%, #fce4ec 30%, #f8bbd9 100%)',
      padding: window.innerWidth < 768 ? '15px' : '20px', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Elementos decorativos de fundo */}
      <div style={{
        position: 'absolute',
        top: '-50%',
        left: '-50%',
        width: '200%',
        height: '200%',
        background: isDark 
          ? 'radial-gradient(circle at 30% 20%, rgba(173, 115, 120, 0.1) 0%, transparent 50%)'
          : 'radial-gradient(circle at 70% 80%, rgba(252, 192, 203, 0.2) 0%, transparent 50%)',
        animation: 'float 20s ease-in-out infinite'
      }} />
      
      <div style={{ position: 'absolute', top: window.innerWidth < 768 ? '15px' : '30px', right: window.innerWidth < 768 ? '15px' : '30px', zIndex: 10 }}>
        <button 
          onClick={toggleTheme}
          style={{
            padding: '12px 16px',
            backgroundColor: isDark ? 'rgba(173, 115, 120, 0.2)' : 'rgba(255, 255, 255, 0.9)',
            color: theme.text,
            border: `2px solid ${isDark ? 'rgba(173, 115, 120, 0.4)' : 'rgba(252, 192, 203, 0.4)'}`,
            borderRadius: '12px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '500',
            transition: 'all 0.3s ease',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 6px 20px rgba(0,0,0,0.15)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
          }}
        >
          {isDark ? '☀️' : '🌙'}
        </button>
      </div>
      
      <div style={{ 
        backgroundColor: isDark 
          ? 'rgba(45, 27, 46, 0.95)' 
          : 'rgba(255, 255, 255, 0.95)', 
        backdropFilter: 'blur(20px)',
        padding: window.innerWidth < 768 ? '30px 25px' : '50px 40px', 
        borderRadius: '24px', 
        boxShadow: isDark 
          ? '0 25px 50px rgba(0,0,0,0.5), 0 0 0 1px rgba(173, 115, 120, 0.2)'
          : '0 25px 50px rgba(0,0,0,0.15), 0 0 0 1px rgba(252, 192, 203, 0.3)',
        width: '100%',
        maxWidth: '450px',
        color: theme.text,
        position: 'relative',
        transform: 'translateY(0)',
        transition: 'all 0.3s ease'
      }}>
        {/* Logo e título */}
        <div style={{ textAlign: 'center', marginBottom: window.innerWidth < 768 ? '30px' : '40px' }}>
          <img 
            src="logo.JPEG"
            alt="Logo Além do Positivo"
            style={{
              width: '80px',
              height: '80px',
              margin: '0 auto 20px',
              borderRadius: '50%',
              objectFit: 'cover',
              boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
              border: `3px solid ${isDark ? 'rgba(173, 115, 120, 0.3)' : 'rgba(252, 192, 203, 0.4)'}`,
              display: 'block'
            }}
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          <div style={{
            width: '80px',
            height: '80px',
            margin: '0 auto 20px',
            borderRadius: '50%',
            background: isDark 
              ? 'linear-gradient(135deg, #ad7378 0%, #6b4c6b 100%)'
              : 'linear-gradient(135deg, #ffc0cb 0%, #f8bbd9 100%)',
            display: 'none',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '32px',
            boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
            border: `3px solid ${isDark ? 'rgba(173, 115, 120, 0.3)' : 'rgba(252, 192, 203, 0.4)'}`
          }}>
            💝
          </div>
          <h1 style={{ 
            color: theme.primary, 
            margin: '0 0 8px 0', 
            fontSize: window.innerWidth < 768 ? '24px' : '28px',
            fontWeight: '700',
            letterSpacing: '-0.5px'
          }}>
            Além do Positivo
          </h1>
          <p style={{
            color: theme.textSecondary,
            margin: 0,
            fontSize: '16px',
            fontWeight: '400'
          }}>
            Faça login para continuar
          </p>
        </div>
        


        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '25px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              color: theme.text,
              fontSize: '14px',
              fontWeight: '600'
            }}>📧 Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              style={{
                width: '100%',
                padding: '16px 20px',
                border: `2px solid ${isDark ? 'rgba(173, 115, 120, 0.3)' : 'rgba(252, 192, 203, 0.3)'}`,
                borderRadius: '12px',
                backgroundColor: isDark ? 'rgba(69, 75, 96, 0.5)' : 'rgba(255, 255, 255, 0.8)',
                color: theme.text,
                fontSize: '16px',
                outline: 'none',
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = theme.primary;
                e.target.style.boxShadow = '0 4px 15px rgba(173, 115, 120, 0.2)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = isDark ? 'rgba(173, 115, 120, 0.3)' : 'rgba(252, 192, 203, 0.3)';
                e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)';
              }}
              required
            />
          </div>
          <div style={{ marginBottom: '30px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              color: theme.text,
              fontSize: '14px',
              fontWeight: '600'
            }}>🔒 Senha</label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="••••••••"
              style={{
                width: '100%',
                padding: '16px 20px',
                border: `2px solid ${isDark ? 'rgba(173, 115, 120, 0.3)' : 'rgba(252, 192, 203, 0.3)'}`,
                borderRadius: '12px',
                backgroundColor: isDark ? 'rgba(69, 75, 96, 0.5)' : 'rgba(255, 255, 255, 0.8)',
                color: theme.text,
                fontSize: '16px',
                outline: 'none',
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = theme.primary;
                e.target.style.boxShadow = '0 4px 15px rgba(173, 115, 120, 0.2)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = isDark ? 'rgba(173, 115, 120, 0.3)' : 'rgba(252, 192, 203, 0.3)';
                e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)';
              }}
              required
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            style={{
              width: '100%',
              padding: '16px 20px',
              background: loading 
                ? (isDark ? 'rgba(173, 115, 120, 0.5)' : 'rgba(252, 192, 203, 0.5)')
                : (isDark 
                  ? 'linear-gradient(135deg, #ad7378 0%, #8b5a5f 100%)'
                  : 'linear-gradient(135deg, #ffc0cb 0%, #f8bbd9 100%)'),
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginBottom: '20px',
              transition: 'all 0.3s ease',
              boxShadow: loading ? 'none' : '0 4px 15px rgba(173, 115, 120, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 20px rgba(173, 115, 120, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 15px rgba(173, 115, 120, 0.3)';
              }
            }}
          >
            {loading ? (
              <>
                <div style={{
                  width: '20px',
                  height: '20px',
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTop: '2px solid white',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
                Entrando...
              </>
            ) : (
              <>
                🚀 Entrar
              </>
            )}
          </button>
        </form>
        
        <div style={{ textAlign: 'center', borderTop: `1px solid ${isDark ? 'rgba(173, 115, 120, 0.2)' : 'rgba(252, 192, 203, 0.2)'}`, paddingTop: '25px' }}>
          <Link 
            to="/cadastro" 
            style={{ 
              color: theme.primary, 
              textDecoration: 'none', 
              marginBottom: '15px', 
              display: 'inline-block',
              fontSize: '15px',
              fontWeight: '600',
              padding: '8px 16px',
              borderRadius: '8px',
              backgroundColor: isDark ? 'rgba(173, 115, 120, 0.1)' : 'rgba(252, 192, 203, 0.1)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = isDark ? 'rgba(173, 115, 120, 0.2)' : 'rgba(252, 192, 203, 0.2)';
              e.target.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = isDark ? 'rgba(173, 115, 120, 0.1)' : 'rgba(252, 192, 203, 0.1)';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            ✨ Não tem conta? Cadastre-se
          </Link>
          <br />
          <Link 
            to="/recuperar-senha"
            style={{
              color: theme.textSecondary,
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.color = theme.primary;
              e.target.style.textDecoration = 'underline';
            }}
            onMouseLeave={(e) => {
              e.target.style.color = theme.textSecondary;
              e.target.style.textDecoration = 'none';
            }}
          >
            🔑 Esqueci minha senha
          </Link>
        </div>
        
        {/* Adicionar estilos CSS para animações */}
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes float {
            0%, 100% { transform: translate(0, 0) rotate(0deg); }
            33% { transform: translate(30px, -30px) rotate(120deg); }
            66% { transform: translate(-20px, 20px) rotate(240deg); }
          }
        `}</style>
      </div>
    </div>
  );
}

export default Login;