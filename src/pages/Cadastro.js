import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useNotification } from '../hooks/useNotification';
import Notification from '../components/Notification';
import { API_URL } from '../config/api';

function Cadastro() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [senha, setSenha] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const { notifications, showError, removeNotification } = useNotification();

  const isValidEmail = (email) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);

  const validatePassword = (password) => ({
    isValid: /[A-Z]/.test(password) && /[!@#$%^&*(),.?":{}|<>]/.test(password) && /\d/.test(password),
    hasUpperCase: /[A-Z]/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    hasNumber: /\d/.test(password)
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValidEmail(email)) { showError('Por favor, insira um email válido'); return; }
    const pv = validatePassword(senha);
    if (!pv.isValid) {
      showError(`A senha deve conter:${!pv.hasUpperCase ? '\n• Letra maiúscula' : ''}${!pv.hasSpecialChar ? '\n• Caractere especial' : ''}${!pv.hasNumber ? '\n• Número' : ''}`);
      return;
    }
    try {
      const response = await fetch(`${API_URL}/api/auth/cadastro`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, cpf, senha }),
      });
      if (response.ok) { setShowSuccess(true); setTimeout(() => navigate('/login'), 3000); }
      else { const err = await response.text(); showError(err || 'Erro no cadastro'); }
    } catch { showError('Erro de conexão com o servidor'); }
  };

  const input = {
    width: '100%', padding: '12px 16px', borderRadius: '10px', fontSize: '14px',
    border: `1px solid ${isDark ? '#333' : '#e8d0d4'}`,
    backgroundColor: isDark ? '#1e1e1e' : '#fdf8f8',
    color: isDark ? '#e0e0e0' : '#333', outline: 'none', boxSizing: 'border-box'
  };

  if (showSuccess) return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      backgroundColor: isDark ? '#0f0f0f' : '#f9f5f6', fontFamily: "'Inter', system-ui, sans-serif"
    }}>
      <div style={{
        textAlign: 'center', padding: '48px', maxWidth: '420px',
        backgroundColor: isDark ? '#141414' : '#fff', borderRadius: '20px',
        border: `1px solid ${isDark ? '#2a2a2a' : '#f0e6e8'}`
      }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
        <h2 style={{ color: '#c0606a', marginBottom: '12px', fontSize: '22px' }}>Cadastro realizado!</h2>
        <p style={{ color: isDark ? '#888' : '#999', fontSize: '14px', lineHeight: '1.6' }}>
          Bem-vindo(a)! Redirecionando para o login...
        </p>
      </div>
    </div>
  );

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
        width: '100%', maxWidth: '440px',
        backgroundColor: isDark ? '#141414' : '#fff',
        borderRadius: '20px', padding: '40px',
        border: `1px solid ${isDark ? '#2a2a2a' : '#f0e6e8'}`,
        boxShadow: '0 8px 40px rgba(0,0,0,0.08)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '22px', fontWeight: '700', color: isDark ? '#f0e0e2' : '#2d1518', margin: '0 0 6px' }}>Criar conta</h1>
          <p style={{ fontSize: '14px', color: isDark ? '#666' : '#999', margin: 0 }}>Além do Positivo</p>
        </div>

        <form onSubmit={handleSubmit}>
          {[
            { label: 'Nome completo', value: nome, setter: setNome, type: 'text', placeholder: 'Seu nome' },
            { label: 'Email', value: email, setter: setEmail, type: 'email', placeholder: 'seu@email.com' },
          ].map(({ label, value, setter, type, placeholder }) => (
            <div key={label} style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: isDark ? '#ccc' : '#555', marginBottom: '6px' }}>{label}</label>
              <input type={type} value={value} onChange={(e) => setter(e.target.value)} placeholder={placeholder} style={input} required />
            </div>
          ))}

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: isDark ? '#ccc' : '#555', marginBottom: '6px' }}>CPF</label>
            <input type="text" value={cpf} onChange={(e) => {
              let v = e.target.value.replace(/\D/g, '');
              v = v.replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2');
              setCpf(v);
            }} placeholder="000.000.000-00" maxLength="14" style={input} required />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: isDark ? '#ccc' : '#555', marginBottom: '6px' }}>Senha</label>
            <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} placeholder="••••••••" style={input} required />
            {senha && (
              <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {[
                  { ok: validatePassword(senha).hasUpperCase, label: 'Letra maiúscula' },
                  { ok: validatePassword(senha).hasSpecialChar, label: 'Caractere especial' },
                  { ok: validatePassword(senha).hasNumber, label: 'Número' },
                ].map(({ ok, label }) => (
                  <span key={label} style={{ fontSize: '12px', color: ok ? '#4caf50' : '#ef4444' }}>
                    {ok ? '✓' : '✗'} {label}
                  </span>
                ))}
              </div>
            )}
          </div>

          <button type="submit" style={{
            width: '100%', padding: '12px', borderRadius: '10px', border: 'none',
            backgroundColor: '#c0606a', color: 'white', fontSize: '14px', fontWeight: '600',
            cursor: 'pointer', marginBottom: '16px'
          }}>Criar conta</button>
        </form>

        <div style={{ textAlign: 'center', borderTop: `1px solid ${isDark ? '#2a2a2a' : '#f0e6e8'}`, paddingTop: '20px' }}>
          <Link to="/login" style={{ color: '#c0606a', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>
            Já tem conta? Faça login
          </Link>
        </div>
      </div>

      {notifications.map(n => (
        <Notification key={n.id} message={n.message} type={n.type} duration={n.duration} onClose={() => removeNotification(n.id)} />
      ))}
    </div>
  );
}

export default Cadastro;
