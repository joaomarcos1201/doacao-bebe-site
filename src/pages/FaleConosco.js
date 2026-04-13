import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { API_URL } from '../config/api';

function FaleConosco() {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const [formData, setFormData] = useState({ nome: '', email: '', telefone: '', mensagem: '' });
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/api/contato`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) { setEnviado(true); setTimeout(() => navigate('/home'), 2000); }
      else { const err = await response.text(); alert(`Erro: ${err}`); }
    } catch { alert('Erro de conexão.'); }
  };

  const input = {
    width: '100%', padding: '12px 16px', borderRadius: '10px', fontSize: '14px',
    border: `1px solid ${isDark ? '#333' : '#e8d0d4'}`,
    backgroundColor: isDark ? '#1e1e1e' : '#fdf8f8',
    color: isDark ? '#e0e0e0' : '#333', outline: 'none', boxSizing: 'border-box'
  };

  if (enviado) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: isDark ? '#0f0f0f' : '#f9f5f6' }}>
      <div style={{ textAlign: 'center', padding: '48px', backgroundColor: isDark ? '#141414' : '#fff', borderRadius: '20px', border: `1px solid ${isDark ? '#2a2a2a' : '#f0e6e8'}` }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
        <h2 style={{ color: '#c0606a', marginBottom: '8px' }}>Mensagem enviada!</h2>
        <p style={{ color: isDark ? '#888' : '#999', fontSize: '14px' }}>Retornaremos em breve.</p>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', backgroundColor: isDark ? '#0f0f0f' : '#f9f5f6', fontFamily: "'Inter', system-ui, sans-serif" }}>
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        backgroundColor: isDark ? 'rgba(18,18,18,0.95)' : 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(20px)', borderBottom: `1px solid ${isDark ? '#2a2a2a' : '#f0e6e8'}`,
        padding: '0 24px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <button onClick={() => navigate('/home')} style={{
          padding: '8px 16px', borderRadius: '8px', border: `1px solid ${isDark ? '#333' : '#e8d0d4'}`,
          backgroundColor: 'transparent', color: isDark ? '#aaa' : '#888', cursor: 'pointer', fontSize: '13px'
        }}>← Voltar</button>
        <span style={{ fontSize: '16px', fontWeight: '700', color: isDark ? '#f0c0c8' : '#c0606a' }}>Fale Conosco</span>
        <button onClick={toggleTheme} style={{
          width: '36px', height: '36px', borderRadius: '50%', border: `1px solid ${isDark ? '#333' : '#e8d0d4'}`,
          backgroundColor: 'transparent', cursor: 'pointer', fontSize: '16px'
        }}>{isDark ? '☀️' : '🌙'}</button>
      </nav>

      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: isDark ? '#f0e0e2' : '#2d1518', margin: '0 0 8px', letterSpacing: '-0.5px' }}>
             Entre em contato
          </h1>
          <p style={{ fontSize: '14px', color: isDark ? '#666' : '#999', margin: 0 }}>Estamos aqui para ajudar!</p>
        </div>

        <div style={{
          backgroundColor: isDark ? '#141414' : '#fff', borderRadius: '20px', padding: '32px',
          border: `1px solid ${isDark ? '#2a2a2a' : '#f0e6e8'}`, marginBottom: '24px'
        }}>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: isDark ? '#ccc' : '#555', marginBottom: '6px' }}>Nome *</label>
                <input type="text" name="nome" value={formData.nome} onChange={(e) => setFormData({ ...formData, nome: e.target.value })} placeholder="Seu nome" style={input} required />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: isDark ? '#ccc' : '#555', marginBottom: '6px' }}>Email *</label>
                <input type="email" name="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="seu@email.com" style={input} required />
              </div>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: isDark ? '#ccc' : '#555', marginBottom: '6px' }}>Telefone</label>
              <input type="tel" name="telefone" value={formData.telefone} onChange={(e) => setFormData({ ...formData, telefone: e.target.value })} placeholder="(11) 99999-9999" style={input} />
            </div>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: isDark ? '#ccc' : '#555', marginBottom: '6px' }}>Mensagem *</label>
              <textarea name="mensagem" value={formData.mensagem} onChange={(e) => setFormData({ ...formData, mensagem: e.target.value })}
                placeholder="Descreva sua dúvida ou sugestão..." rows="5"
                style={{ ...input, resize: 'vertical', fontFamily: 'inherit' }} required />
            </div>
            <button type="submit" style={{
              width: '100%', padding: '12px', borderRadius: '10px', border: 'none',
              backgroundColor: '#c0606a', color: 'white', fontSize: '14px', fontWeight: '600', cursor: 'pointer'
            }}>Enviar Mensagem</button>
          </form>
        </div>

        <div style={{
          backgroundColor: isDark ? '#141414' : '#fff', borderRadius: '16px', padding: '24px',
          border: `1px solid ${isDark ? '#2a2a2a' : '#f0e6e8'}`
        }}>
          <h3 style={{ fontSize: '15px', fontWeight: '700', color: isDark ? '#e0e0e0' : '#333', margin: '0 0 16px' }}>Outras formas de contato</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <span>📧</span>
            <span style={{ fontSize: '14px', color: isDark ? '#888' : '#666' }}>alemdopositivo0225@gmail.com</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span></span>
            <span style={{ fontSize: '14px', color: isDark ? '#888' : '#666' }}></span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FaleConosco;
