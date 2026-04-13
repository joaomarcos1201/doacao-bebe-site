import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { API_URL } from '../config/api';

function RecuperarSenha() {
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [etapa, setEtapa] = useState('enviar');
  const [contato, setContato] = useState('');
  const [codigo, setCodigo] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [loading, setLoading] = useState(false);

  const input = {
    width: '100%', padding: '12px 16px', borderRadius: '10px', fontSize: '14px',
    border: `1px solid ${isDark ? '#333' : '#e8d0d4'}`,
    backgroundColor: isDark ? '#1e1e1e' : '#fdf8f8',
    color: isDark ? '#e0e0e0' : '#333', outline: 'none', boxSizing: 'border-box'
  };

  const handleEnviarCodigo = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/auth/enviar-codigo`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: contato }),
      });
      if (response.ok) { setEtapa('verificar'); }
      else { const err = await response.text(); alert(err || 'Não foi possível enviar o código.'); }
    } catch { alert('Erro de conexão.'); }
    setLoading(false);
  };

  const handleVerificarCodigo = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/api/auth/verificar-codigo`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: contato, codigo }),
      });
      if (response.ok) { setEtapa('redefinir'); }
      else { const err = await response.text(); alert(err || 'Código incorreto!'); }
    } catch { alert('Erro de conexão.'); }
  };

  const handleRedefinirSenha = async (e) => {
    e.preventDefault();
    if (novaSenha !== confirmarSenha) { alert('As senhas não coincidem!'); return; }
    try {
      const response = await fetch(`${API_URL}/api/auth/redefinir-senha`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: contato, novaSenha }),
      });
      if (response.ok) { alert('Senha redefinida com sucesso!'); navigate('/login'); }
      else { const err = await response.text(); alert(err || 'Erro ao redefinir senha'); }
    } catch { alert('Erro de conexão.'); }
  };

  const card = {
    width: '100%', maxWidth: '400px', backgroundColor: isDark ? '#141414' : '#fff',
    borderRadius: '20px', padding: '40px', border: `1px solid ${isDark ? '#2a2a2a' : '#f0e6e8'}`,
    boxShadow: '0 8px 40px rgba(0,0,0,0.08)'
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      backgroundColor: isDark ? '#0f0f0f' : '#f9f5f6', padding: '20px',
      fontFamily: "'Inter', system-ui, sans-serif"
    }}>
      <div style={{ position: 'absolute', top: '20px', left: '20px' }}>
        <button onClick={() => navigate('/login')} style={{
          padding: '8px 16px', borderRadius: '8px', border: `1px solid ${isDark ? '#333' : '#e8d0d4'}`,
          backgroundColor: 'transparent', color: isDark ? '#aaa' : '#888', cursor: 'pointer', fontSize: '13px'
        }}>← Voltar ao Login</button>
      </div>
      <div style={{ position: 'absolute', top: '20px', right: '20px' }}>
        <button onClick={toggleTheme} style={{
          width: '36px', height: '36px', borderRadius: '50%', border: `1px solid ${isDark ? '#333' : '#e8d0d4'}`,
          backgroundColor: 'transparent', cursor: 'pointer', fontSize: '16px'
        }}>{isDark ? '☀️' : '🌙'}</button>
      </div>

      {etapa === 'enviar' && (
        <div style={card}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>🔐</div>
            <h1 style={{ fontSize: '22px', fontWeight: '700', color: isDark ? '#f0e0e2' : '#2d1518', margin: '0 0 6px' }}>Recuperar Senha</h1>
            <p style={{ fontSize: '14px', color: isDark ? '#666' : '#999', margin: 0 }}>Enviaremos um código para seu email</p>
          </div>
          <form onSubmit={handleEnviarCodigo}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: isDark ? '#ccc' : '#555', marginBottom: '6px' }}>Email</label>
              <input type="email" value={contato} onChange={(e) => setContato(e.target.value)} placeholder="seu@email.com" style={input} required />
            </div>
            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '12px', borderRadius: '10px', border: 'none',
              backgroundColor: '#c0606a', color: 'white', fontSize: '14px', fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1
            }}>{loading ? 'Enviando...' : 'Enviar Código'}</button>
          </form>
        </div>
      )}

      {etapa === 'verificar' && (
        <div style={card}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>📧</div>
            <h1 style={{ fontSize: '22px', fontWeight: '700', color: isDark ? '#f0e0e2' : '#2d1518', margin: '0 0 6px' }}>Verificar Código</h1>
            <p style={{ fontSize: '14px', color: isDark ? '#666' : '#999', margin: 0 }}>Código enviado para {contato}</p>
          </div>
          <form onSubmit={handleVerificarCodigo}>
            <div style={{ marginBottom: '20px' }}>
              <input type="text" value={codigo} onChange={(e) => setCodigo(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000" maxLength="6"
                style={{ ...input, fontSize: '24px', textAlign: 'center', letterSpacing: '8px' }} required />
            </div>
            <button type="submit" style={{
              width: '100%', padding: '12px', borderRadius: '10px', border: 'none',
              backgroundColor: '#c0606a', color: 'white', fontSize: '14px', fontWeight: '600', cursor: 'pointer', marginBottom: '12px'
            }}>Verificar</button>
            <button type="button" onClick={() => setEtapa('enviar')} style={{
              width: '100%', padding: '10px', borderRadius: '10px', border: `1px solid ${isDark ? '#333' : '#e8d0d4'}`,
              backgroundColor: 'transparent', color: isDark ? '#aaa' : '#888', fontSize: '13px', cursor: 'pointer'
            }}>Reenviar código</button>
          </form>
        </div>
      )}

      {etapa === 'redefinir' && (
        <div style={card}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>🔑</div>
            <h1 style={{ fontSize: '22px', fontWeight: '700', color: isDark ? '#f0e0e2' : '#2d1518', margin: '0 0 6px' }}>Nova Senha</h1>
            <p style={{ fontSize: '14px', color: isDark ? '#666' : '#999', margin: 0 }}>Escolha uma senha segura</p>
          </div>
          <form onSubmit={handleRedefinirSenha}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: isDark ? '#ccc' : '#555', marginBottom: '6px' }}>Nova Senha</label>
              <input type="password" value={novaSenha} onChange={(e) => setNovaSenha(e.target.value)} placeholder="••••••••" style={input} required />
            </div>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: isDark ? '#ccc' : '#555', marginBottom: '6px' }}>Confirmar Senha</label>
              <input type="password" value={confirmarSenha} onChange={(e) => setConfirmarSenha(e.target.value)} placeholder="••••••••" style={input} required />
            </div>
            <button type="submit" style={{
              width: '100%', padding: '12px', borderRadius: '10px', border: 'none',
              backgroundColor: '#c0606a', color: 'white', fontSize: '14px', fontWeight: '600', cursor: 'pointer'
            }}>Redefinir Senha</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default RecuperarSenha;
