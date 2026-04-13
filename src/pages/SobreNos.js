import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

function SobreNos() {
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

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
        <span style={{ fontSize: '16px', fontWeight: '700', color: isDark ? '#f0c0c8' : '#c0606a' }}>Sobre Nós</span>
        <button onClick={toggleTheme} style={{
          width: '36px', height: '36px', borderRadius: '50%', border: `1px solid ${isDark ? '#333' : '#e8d0d4'}`,
          backgroundColor: 'transparent', cursor: 'pointer', fontSize: '16px'
        }}>{isDark ? '☀️' : '🌙'}</button>
      </nav>

      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <img src="logo.jpeg" alt="Logo" style={{
            width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover',
            border: '3px solid #e8a0a8', marginBottom: '20px'
          }} onError={(e) => e.target.style.display = 'none'} />
          <h1 style={{ fontSize: '36px', fontWeight: '800', color: isDark ? '#f0e0e2' : '#2d1518', margin: '0 0 12px', letterSpacing: '-1px' }}>
            Além do Positivo
          </h1>
          <p style={{ fontSize: '16px', color: isDark ? '#777' : '#999', margin: 0 }}>
            Conectando famílias através da solidariedade
          </p>
        </div>

        {[
          {
            title: 'Nossa História',
            content: 'O Além do Positivo nasceu da necessidade de conectar famílias que precisam de apoio durante a gravidez e primeiros anos de vida do bebê com pessoas dispostas a ajudar através de doações. Fundado em 2024, nosso projeto surgiu da observação de que muitas famílias enfrentam dificuldades para adquirir itens essenciais para bebês, enquanto outras possuem produtos em bom estado que não utilizam mais.'
          },
          {
            title: 'Nosso Objetivo',
            content: 'Criar uma ponte solidária entre quem pode doar e quem precisa receber, promovendo solidariedade comunitária, sustentabilidade e apoio à maternidade. Acreditamos que pequenos gestos podem transformar vidas.'
          },
          {
            title: 'Nossa Visão',
            content: 'Queremos ser a plataforma de referência para doações de itens infantis, criando uma comunidade onde a generosidade e a gratidão caminham juntas, construindo um futuro melhor para nossas crianças.'
          }
        ].map(({ title, content }) => (
          <div key={title} style={{
            backgroundColor: isDark ? '#141414' : '#fff', borderRadius: '16px', padding: '28px',
            border: `1px solid ${isDark ? '#2a2a2a' : '#f0e6e8'}`, marginBottom: '16px'
          }}>
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#c0606a', margin: '0 0 12px' }}>{title}</h2>
            <p style={{ fontSize: '15px', color: isDark ? '#888' : '#666', lineHeight: '1.7', margin: 0 }}>{content}</p>
          </div>
        ))}

        <div style={{
          backgroundColor: isDark ? '#141414' : '#fff', borderRadius: '16px', padding: '28px',
          border: `1px solid ${isDark ? '#2a2a2a' : '#f0e6e8'}`, marginBottom: '32px'
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#c0606a', margin: '0 0 20px' }}>Como Funciona</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
            {[
              { n: '1', title: 'Doar', desc: 'Cadastre produtos que não usa mais' },
              { n: '2', title: 'Buscar', desc: 'Encontre produtos que precisa' },
              { n: '3', title: 'Conectar', desc: 'Fale com o doador via WhatsApp' },
            ].map(({ n, title, desc }) => (
              <div key={n} style={{
                padding: '20px', borderRadius: '12px', textAlign: 'center',
                backgroundColor: isDark ? '#1a1a1a' : '#fdf8f8',
                border: `1px solid ${isDark ? '#2a2a2a' : '#f0e6e8'}`
              }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#c0606a',
                  color: 'white', fontSize: '16px', fontWeight: '700',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px'
                }}>{n}</div>
                <h3 style={{ fontSize: '15px', fontWeight: '700', color: isDark ? '#e0e0e0' : '#333', margin: '0 0 6px' }}>{title}</h3>
                <p style={{ fontSize: '13px', color: isDark ? '#666' : '#999', margin: 0 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/doacao" style={{
            padding: '12px 28px', borderRadius: '10px', backgroundColor: '#c0606a',
            color: 'white', textDecoration: 'none', fontSize: '14px', fontWeight: '600'
          }}>🎁 Fazer uma Doação</Link>
          <Link to="/home" style={{
            padding: '12px 28px', borderRadius: '10px', border: '1px solid #c0606a',
            color: '#c0606a', textDecoration: 'none', fontSize: '14px', fontWeight: '600',
            backgroundColor: 'transparent'
          }}>Ver Produtos</Link>
        </div>
      </div>
    </div>
  );
}

export default SobreNos;
