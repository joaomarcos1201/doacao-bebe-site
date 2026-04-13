import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

function TermosPrivacidade() {
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const secoes = [
    { n: '1', titulo: 'Coleta de Informações', texto: 'Coletamos informações que você nos fornece diretamente, como nome, email, telefone e dados de produtos para doação. Essas informações são utilizadas exclusivamente para facilitar as doações e melhorar nossos serviços.' },
    { n: '2', titulo: 'Uso das Informações', lista: ['Conectar doadores e beneficiários', 'Melhorar a experiência do usuário', 'Enviar notificações importantes sobre doações', 'Garantir a segurança da plataforma'] },
    { n: '3', titulo: 'Compartilhamento de Dados', texto: 'Não vendemos, alugamos ou compartilhamos suas informações pessoais com terceiros, exceto quando necessário para facilitar as doações entre doadores e beneficiários.' },
    { n: '4', titulo: 'Segurança dos Dados', texto: 'Implementamos medidas de segurança adequadas para proteger suas informações contra acesso não autorizado. Suas senhas são criptografadas e armazenadas de forma segura.' },
    { n: '5', titulo: 'Seus Direitos', lista: ['Acessar suas informações pessoais', 'Corrigir dados incorretos', 'Solicitar a exclusão de sua conta', 'Retirar seu consentimento a qualquer momento'] },
    { n: '6', titulo: 'Cookies', texto: 'Utilizamos cookies para melhorar sua experiência de navegação e lembrar suas preferências. Você pode desabilitar os cookies nas configurações do seu navegador.' },
    { n: '7', titulo: 'Alterações nesta Política', texto: 'Podemos atualizar esta política periodicamente. Notificaremos sobre mudanças significativas através do site ou por email.' },
    { n: '8', titulo: 'Contato', texto: 'Se você tiver dúvidas, entre em contato através da página "Fale Conosco" ou pelo email: alemdopositivo0225@gmail.com' },
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
        <span style={{ fontSize: '16px', fontWeight: '700', color: isDark ? '#f0c0c8' : '#c0606a' }}>Termos de Privacidade</span>
        <button onClick={toggleTheme} style={{
          width: '36px', height: '36px', borderRadius: '50%', border: `1px solid ${isDark ? '#333' : '#e8d0d4'}`,
          backgroundColor: 'transparent', cursor: 'pointer', fontSize: '16px'
        }}>{isDark ? '☀️' : '🌙'}</button>
      </nav>

      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '800', color: isDark ? '#f0e0e2' : '#2d1518', margin: '0 0 8px', letterSpacing: '-0.5px' }}>
            🔒 Termos de Privacidade
          </h1>
          <p style={{ fontSize: '14px', color: isDark ? '#666' : '#999', margin: 0 }}>Última atualização: Outubro de 2024</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
          {secoes.map(({ n, titulo, texto, lista }) => (
            <div key={n} style={{
              backgroundColor: isDark ? '#141414' : '#fff', borderRadius: '16px', padding: '24px',
              border: `1px solid ${isDark ? '#2a2a2a' : '#f0e6e8'}`
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <span style={{
                  width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#c0606a',
                  color: 'white', fontSize: '12px', fontWeight: '700', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>{n}</span>
                <h2 style={{ fontSize: '16px', fontWeight: '700', color: isDark ? '#e0e0e0' : '#333', margin: 0 }}>{titulo}</h2>
              </div>
              {texto && <p style={{ fontSize: '14px', color: isDark ? '#888' : '#666', lineHeight: '1.7', margin: 0 }}>{texto}</p>}
              {lista && (
                <ul style={{ margin: 0, paddingLeft: '20px' }}>
                  {lista.map((item, i) => (
                    <li key={i} style={{ fontSize: '14px', color: isDark ? '#888' : '#666', lineHeight: '1.7', marginBottom: '4px' }}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        <div style={{
          backgroundColor: isDark ? '#141414' : '#fff', borderRadius: '16px', padding: '24px',
          border: `1px solid #c0606a`, textAlign: 'center'
        }}>
          <p style={{ fontSize: '14px', color: isDark ? '#888' : '#666', margin: '0 0 12px' }}>
            Ao usar nossos serviços, você concorda com esta política de privacidade.
          </p>
          <Link to="/fale-conosco" style={{ color: '#c0606a', fontSize: '14px', fontWeight: '600', textDecoration: 'none' }}>
            Dúvidas? Fale Conosco →
          </Link>
        </div>
      </div>
    </div>
  );
}

export default TermosPrivacidade;
