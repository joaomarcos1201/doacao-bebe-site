import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

function ManualSeguranca() {
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const secoes = [
    {
      n: '1', emoji: '🔍', titulo: 'Verificação de Produtos',
      lista: ['Inspecione cuidadosamente o estado dos produtos', 'Verifique se não há peças quebradas ou soltas', 'Verifique se não há sinais de roupas rasgadas ou manchadas', 'Para produtos eletrônicos, teste o funcionamento', 'Confirme se o produto atende às normas de segurança']
    },
    {
      n: '2', emoji: '💬', titulo: 'Comunicação Segura',
      lista: ['Não compartilhe informações pessoais desnecessárias', 'Desconfie de pedidos urgentes ou pressão para encontros imediatos', 'Se possível, evite encontros presenciais', 'Mantenha conversas respeitosas e cordiais']
    },
    {
      n: '3', emoji: '🔐', titulo: 'Proteção de Dados',
      lista: ['Use senhas fortes e únicas para sua conta', 'Não compartilhe suas credenciais de login', 'Faça logout ao usar computadores públicos', 'Mantenha seu perfil atualizado com informações precisas']
    },
    {
      n: '4', emoji: '👶', titulo: 'Para Famílias com Crianças',
      lista: ['Verifique se brinquedos não possuem peças pequenas (risco de engasgo)', 'Higienize todos os itens antes do uso', 'Teste a estabilidade de móveis e equipamentos']
    },
    {
      n: '5', emoji: '🚨', titulo: 'Como Reportar Problemas',
      lista: ['Entre em contato conosco imediatamente', 'Forneça detalhes específicos da situação', 'Preserve evidências (capturas de tela, mensagens)', 'Em casos graves, procure as autoridades competentes']
    },
  ];

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
        <span style={{ fontSize: '16px', fontWeight: '700', color: isDark ? '#f0c0c8' : '#c0606a' }}>Manual de Segurança</span>
        <button onClick={toggleTheme} style={{
          width: '36px', height: '36px', borderRadius: '50%', border: `1px solid ${isDark ? '#333' : '#e8d0d4'}`,
          backgroundColor: 'transparent', cursor: 'pointer', fontSize: '16px'
        }}>{isDark ? '☀️' : '🌙'}</button>
      </nav>

      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '800', color: isDark ? '#f0e0e2' : '#2d1518', margin: '0 0 8px', letterSpacing: '-0.5px' }}>
            🛡️ Manual de Segurança
          </h1>
          <p style={{ fontSize: '14px', color: isDark ? '#666' : '#999', margin: 0 }}>
            Sua segurança é nossa prioridade. Siga estas orientações.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
          {secoes.map(({ n, emoji, titulo, lista }) => (
            <div key={n} style={{
              backgroundColor: isDark ? '#141414' : '#fff', borderRadius: '16px', padding: '24px',
              border: `1px solid ${isDark ? '#2a2a2a' : '#f0e6e8'}`
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                <span style={{ fontSize: '22px' }}>{emoji}</span>
                <h2 style={{ fontSize: '16px', fontWeight: '700', color: isDark ? '#e0e0e0' : '#333', margin: 0 }}>{titulo}</h2>
              </div>
              <ul style={{ margin: 0, paddingLeft: '20px' }}>
                {lista.map((item, i) => (
                  <li key={i} style={{ fontSize: '14px', color: isDark ? '#888' : '#666', lineHeight: '1.7', marginBottom: '4px' }}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Emergência */}
        <div style={{
          backgroundColor: isDark ? '#1a0a0a' : '#fff5f5', borderRadius: '16px', padding: '28px',
          border: '1px solid #ef4444', textAlign: 'center'
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#ef4444', margin: '0 0 16px' }}>🚨 Emergência</h3>
          <p style={{ fontSize: '14px', color: isDark ? '#aaa' : '#666', margin: '0 0 16px' }}>Em caso de emergência, ligue imediatamente para:</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '32px', flexWrap: 'wrap', marginBottom: '16px' }}>
            {[{ label: 'Polícia Militar', num: '190' }, { label: 'Bombeiros', num: '193' }, { label: 'SAMU', num: '192' }].map(({ label, num }) => (
              <div key={num} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: '800', color: '#ef4444' }}>{num}</div>
                <div style={{ fontSize: '12px', color: isDark ? '#888' : '#999' }}>{label}</div>
              </div>
            ))}
          </div>
          <p style={{ fontSize: '13px', color: isDark ? '#666' : '#aaa', margin: 0 }}>Sempre confie em seus instintos.</p>
        </div>

        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <Link to="/fale-conosco" style={{ color: '#c0606a', fontSize: '14px', fontWeight: '600', textDecoration: 'none' }}>
            Reportar um problema →
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ManualSeguranca;
