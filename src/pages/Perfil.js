import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useNotification } from '../hooks/useNotification';
import Notification from '../components/Notification';
import { API_URL } from '../config/api';

function Perfil({ user, setUser }) {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const [nome, setNome] = useState(user?.nome || '');
  const [email, setEmail] = useState(user?.email || '');
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const { notifications, showError, removeNotification } = useNotification();

  const validatePassword = (p) => ({
    isValid: /[A-Z]/.test(p) && /[!@#$%^&*(),.?":{}|<>]/.test(p) && /\d/.test(p),
    hasUpperCase: /[A-Z]/.test(p),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(p),
    hasNumber: /\d/.test(p)
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (novaSenha && novaSenha !== confirmarSenha) { showError('As senhas não coincidem!'); return; }
    if (novaSenha && !validatePassword(novaSenha).isValid) { showError('A senha não atende aos requisitos.'); return; }
    try {
      const updateResponse = await fetch(`${API_URL}/api/usuarios/${user.id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email }),
      });
      if (!updateResponse.ok) throw new Error('Erro ao atualizar dados');
      if (novaSenha) {
        const senhaResponse = await fetch(`${API_URL}/api/usuarios/alterar-senha`, {
          method: 'PUT', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: user.id, senhaAtual, novaSenha }),
        });
        if (!senhaResponse.ok) { const err = await senhaResponse.text(); throw new Error(err || 'Erro ao alterar senha'); }
      }
      setUser({ ...user, nome, email });
      alert('Perfil atualizado com sucesso!');
      setSenhaAtual(''); setNovaSenha(''); setConfirmarSenha('');
    } catch (error) { alert('Erro: ' + error.message); }
  };

  const input = {
    width: '100%', padding: '12px 16px', borderRadius: '10px', fontSize: '14px',
    border: `1px solid ${isDark ? '#333' : '#e8d0d4'}`,
    backgroundColor: isDark ? '#1e1e1e' : '#fdf8f8',
    color: isDark ? '#e0e0e0' : '#333', outline: 'none', boxSizing: 'border-box'
  };
  const label = { display: 'block', fontSize: '13px', fontWeight: '600', color: isDark ? '#ccc' : '#555', marginBottom: '6px' };

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
        <span style={{ fontSize: '16px', fontWeight: '700', color: isDark ? '#f0c0c8' : '#c0606a' }}>Meu Perfil</span>
        <button onClick={toggleTheme} style={{
          width: '36px', height: '36px', borderRadius: '50%', border: `1px solid ${isDark ? '#333' : '#e8d0d4'}`,
          backgroundColor: 'transparent', cursor: 'pointer', fontSize: '16px'
        }}>{isDark ? '☀️' : '🌙'}</button>
      </nav>

      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '40px 24px' }}>
        {/* Avatar */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#c0606a',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '32px', fontWeight: '700', color: 'white', margin: '0 auto 12px'
          }}>{user?.nome?.charAt(0).toUpperCase()}</div>
          <h2 style={{ fontSize: '20px', fontWeight: '700', color: isDark ? '#f0e0e2' : '#2d1518', margin: '0 0 4px' }}>{user?.nome}</h2>
          <p style={{ fontSize: '14px', color: isDark ? '#666' : '#999', margin: 0 }}>{user?.email}</p>
        </div>

        {/* Dados pessoais */}
        <div style={{
          backgroundColor: isDark ? '#141414' : '#fff', borderRadius: '20px', padding: '28px',
          border: `1px solid ${isDark ? '#2a2a2a' : '#f0e6e8'}`, marginBottom: '16px'
        }}>
          <h3 style={{ fontSize: '15px', fontWeight: '700', color: isDark ? '#e0e0e0' : '#333', margin: '0 0 20px' }}>Dados Pessoais</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={label}>Nome *</label>
                <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} style={input} required />
              </div>
              <div>
                <label style={label}>Email *</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={input} required />
              </div>
            </div>

            <div style={{
              backgroundColor: isDark ? '#1a1a1a' : '#fdf8f8', borderRadius: '12px', padding: '20px',
              border: `1px solid ${isDark ? '#2a2a2a' : '#f0e6e8'}`, marginBottom: '20px'
            }}>
              <h4 style={{ fontSize: '14px', fontWeight: '700', color: isDark ? '#ccc' : '#555', margin: '0 0 16px' }}>Alterar Senha</h4>
              <div style={{ marginBottom: '12px' }}>
                <label style={label}>Senha Atual</label>
                <input type="password" value={senhaAtual} onChange={(e) => setSenhaAtual(e.target.value)} placeholder="••••••••" style={input} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={label}>Nova Senha</label>
                  <input type="password" value={novaSenha} onChange={(e) => setNovaSenha(e.target.value)} placeholder="••••••••" style={input} />
                  {novaSenha && (
                    <div style={{ marginTop: '6px' }}>
                      {[
                        { ok: validatePassword(novaSenha).hasUpperCase, label: 'Maiúscula' },
                        { ok: validatePassword(novaSenha).hasSpecialChar, label: 'Especial' },
                        { ok: validatePassword(novaSenha).hasNumber, label: 'Número' },
                      ].map(({ ok, label: l }) => (
                        <span key={l} style={{ fontSize: '11px', color: ok ? '#4caf50' : '#ef4444', display: 'block' }}>
                          {ok ? '✓' : '✗'} {l}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <label style={label}>Confirmar</label>
                  <input type="password" value={confirmarSenha} onChange={(e) => setConfirmarSenha(e.target.value)} placeholder="••••••••" style={input} />
                </div>
              </div>
            </div>

            <button type="submit" style={{
              width: '100%', padding: '12px', borderRadius: '10px', border: 'none',
              backgroundColor: '#c0606a', color: 'white', fontSize: '14px', fontWeight: '600', cursor: 'pointer'
            }}>Salvar Alterações</button>
          </form>
        </div>

        {/* Dicas */}
        <div style={{
          backgroundColor: isDark ? '#141414' : '#fff', borderRadius: '16px', padding: '24px',
          border: `1px solid ${isDark ? '#2a2a2a' : '#f0e6e8'}`
        }}>
          <h3 style={{ fontSize: '14px', fontWeight: '700', color: isDark ? '#e0e0e0' : '#333', margin: '0 0 14px' }}>🔒 Dicas de Segurança</h3>
          {['Use uma senha forte com pelo menos 8 caracteres', 'Mantenha suas informações sempre atualizadas', 'Nunca compartilhe sua senha com outras pessoas'].map((tip, i) => (
            <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', marginBottom: '8px' }}>
              <span style={{
                width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#c0606a',
                color: 'white', fontSize: '11px', fontWeight: '700', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>{i + 1}</span>
              <span style={{ fontSize: '13px', color: isDark ? '#888' : '#666' }}>{tip}</span>
            </div>
          ))}
        </div>
      </div>

      {notifications.map(n => (
        <Notification key={n.id} message={n.message} type={n.type} duration={n.duration} onClose={() => removeNotification(n.id)} />
      ))}
    </div>
  );
}

export default Perfil;
