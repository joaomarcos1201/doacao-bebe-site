import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

function BaixarApp() {
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: isDark ? '#0a0a0a' : '#f9f5f6', fontFamily: "'Inter', system-ui, sans-serif" }}>
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        backgroundColor: isDark ? 'rgba(10,10,10,0.92)' : 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(20px)', borderBottom: `1px solid ${isDark ? '#2a2a2a' : '#f0e6e8'}`,
        padding: '0 24px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <button onClick={() => navigate('/home')} style={{
          padding: '8px 16px', borderRadius: '8px', border: `1px solid ${isDark ? '#333' : '#e8d0d4'}`,
          backgroundColor: 'transparent', color: isDark ? '#aaa' : '#888', cursor: 'pointer', fontSize: '13px'
        }}>← Voltar</button>
        <span style={{ fontSize: '16px', fontWeight: '700', color: isDark ? '#e8d0d4' : '#c0606a' }}>Baixar App</span>
        <button onClick={toggleTheme} style={{
          width: '36px', height: '36px', borderRadius: '50%', border: `1px solid ${isDark ? '#333' : '#e8d0d4'}`,
          backgroundColor: 'transparent', cursor: 'pointer', fontSize: '16px'
        }}>{isDark ? '☀️' : '🌙'}</button>
      </nav>

      <div style={{ maxWidth: '560px', margin: '0 auto', padding: '64px 24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <img src="logo.jpeg" alt="Logo" style={{
          width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover',
          border: '3px solid #e8a0a8', marginBottom: '24px'
        }} onError={(e) => e.target.style.display = 'none'} />

        <div style={{
          display: 'inline-block', padding: '5px 14px', borderRadius: '20px',
          backgroundColor: isDark ? 'rgba(232,138,162,0.15)' : 'rgba(232,138,162,0.12)',
          border: '1px solid rgba(232,138,162,0.3)',
          color: '#E88AA2', fontSize: '12px', fontWeight: '600',
          marginBottom: '20px', letterSpacing: '0.8px'
        }}>EM BREVE</div>

        <h1 style={{
          fontSize: '32px', fontWeight: '900', color: isDark ? '#f5e0e2' : '#1a1a2e',
          margin: '0 0 16px', letterSpacing: '-1px'
        }}>Nosso app está chegando! 🎉</h1>

        <p style={{
          fontSize: '15px', color: isDark ? '#888' : '#6B7280',
          lineHeight: '1.7', margin: '0 0 48px'
        }}>
          Em breve você poderá fazer suas doações diretamente pelo aplicativo.<br />
          Fique de olho, está quase pronto!
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Google Play */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '16px',
            padding: '20px 24px', borderRadius: '16px',
            backgroundColor: isDark ? '#111111' : '#fff',
            border: `1px solid ${isDark ? '#2a2a2a' : '#f0e6e8'}`,
            opacity: 0.5, cursor: 'not-allowed'
          }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill={isDark ? '#aaa' : '#555'}>
              <path d="M3 20.5v-17c0-.83 1-.83 1.5-.5l15 8.5-15 8.5C3.5 20.5 3 21.33 3 20.5z"/>
            </svg>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '11px', color: isDark ? '#666' : '#999', fontWeight: '500' }}>Disponível em breve na</div>
              <div style={{ fontSize: '17px', fontWeight: '700', color: isDark ? '#e0e0e0' : '#1a1a2e' }}>Google Play</div>
            </div>
          </div>

          {/* App Store */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '16px',
            padding: '20px 24px', borderRadius: '16px',
            backgroundColor: isDark ? '#111111' : '#fff',
            border: `1px solid ${isDark ? '#2a2a2a' : '#f0e6e8'}`,
            opacity: 0.5, cursor: 'not-allowed'
          }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill={isDark ? '#aaa' : '#555'}>
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
            </svg>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '11px', color: isDark ? '#666' : '#999', fontWeight: '500' }}>Disponível em breve na</div>
              <div style={{ fontSize: '17px', fontWeight: '700', color: isDark ? '#e0e0e0' : '#1a1a2e' }}>App Store</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BaixarApp;
