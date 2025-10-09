import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

function TermosPrivacidade() {
  const { theme, isDark, toggleTheme } = useTheme();

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #ffc0cb 0%, #f8d7da 100%)',
      padding: '20px'
    }}>
      <div style={{ position: 'absolute', top: '20px', right: '20px' }}>
        <button 
          onClick={toggleTheme}
          style={{
            padding: '10px',
            backgroundColor: isDark ? 'rgba(105, 72, 75, 0.9)' : 'rgba(255, 255, 255, 0.9)',
            color: theme.text,
            border: `1px solid ${theme.border}`,
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          {isDark ? '☀️' : '🌙'}
        </button>
      </div>
      
      <div style={{ maxWidth: '800px', margin: '0 auto', paddingTop: '60px' }}>
        <div style={{ marginBottom: '20px' }}>
          <Link to="/home" style={{ color: theme.primary, textDecoration: 'none', fontWeight: 'bold' }}>← Voltar ao Início</Link>
        </div>
        
        <div style={{
          backgroundColor: isDark ? 'rgba(105, 72, 75, 0.9)' : 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          padding: '40px',
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          border: `1px solid ${isDark ? 'rgba(173, 115, 120, 0.3)' : 'rgba(179, 116, 122, 0.3)'}`
        }}>
          <h1 style={{ textAlign: 'center', marginBottom: '30px', color: theme.primary, fontSize: '2.5rem' }}>
            Termos de Privacidade
          </h1>
          
          <div style={{ lineHeight: '1.8', fontSize: '16px', color: theme.text }}>
            <section style={{ marginBottom: '30px' }}>
              <h2 style={{ color: theme.primary, marginBottom: '15px', fontSize: '1.5rem' }}>
                1. Coleta de Informações
              </h2>
              <p style={{ marginBottom: '15px' }}>
                Coletamos informações que você nos fornece diretamente, como nome, email, telefone e dados de produtos para doação. Essas informações são utilizadas exclusivamente para facilitar as doações e melhorar nossos serviços.
              </p>
            </section>

            <section style={{ marginBottom: '30px' }}>
              <h2 style={{ color: theme.primary, marginBottom: '15px', fontSize: '1.5rem' }}>
                2. Uso das Informações
              </h2>
              <p style={{ marginBottom: '15px' }}>
                Utilizamos suas informações para:
              </p>
              <ul style={{ marginLeft: '20px', marginBottom: '15px' }}>
                <li style={{ marginBottom: '8px' }}>Conectar doadores e beneficiários</li>
                <li style={{ marginBottom: '8px' }}>Melhorar a experiência do usuário</li>
                <li style={{ marginBottom: '8px' }}>Enviar notificações importantes sobre doações</li>
                <li style={{ marginBottom: '8px' }}>Garantir a segurança da plataforma</li>
              </ul>
            </section>

            <section style={{ marginBottom: '30px' }}>
              <h2 style={{ color: theme.primary, marginBottom: '15px', fontSize: '1.5rem' }}>
                3. Compartilhamento de Dados
              </h2>
              <p style={{ marginBottom: '15px' }}>
                Não vendemos, alugamos ou compartilhamos suas informações pessoais com terceiros, exceto quando necessário para facilitar as doações (como compartilhar informações de contato entre doadores e beneficiários).
              </p>
            </section>

            <section style={{ marginBottom: '30px' }}>
              <h2 style={{ color: theme.primary, marginBottom: '15px', fontSize: '1.5rem' }}>
                4. Segurança dos Dados
              </h2>
              <p style={{ marginBottom: '15px' }}>
                Implementamos medidas de segurança adequadas para proteger suas informações contra acesso não autorizado, alteração, divulgação ou destruição. Suas senhas são criptografadas e armazenadas de forma segura.
              </p>
            </section>

            <section style={{ marginBottom: '30px' }}>
              <h2 style={{ color: theme.primary, marginBottom: '15px', fontSize: '1.5rem' }}>
                5. Seus Direitos
              </h2>
              <p style={{ marginBottom: '15px' }}>
                Você tem o direito de:
              </p>
              <ul style={{ marginLeft: '20px', marginBottom: '15px' }}>
                <li style={{ marginBottom: '8px' }}>Acessar suas informações pessoais</li>
                <li style={{ marginBottom: '8px' }}>Corrigir dados incorretos</li>
                <li style={{ marginBottom: '8px' }}>Solicitar a exclusão de sua conta</li>
                <li style={{ marginBottom: '8px' }}>Retirar seu consentimento a qualquer momento</li>
              </ul>
            </section>

            <section style={{ marginBottom: '30px' }}>
              <h2 style={{ color: theme.primary, marginBottom: '15px', fontSize: '1.5rem' }}>
                6. Cookies
              </h2>
              <p style={{ marginBottom: '15px' }}>
                Utilizamos cookies para melhorar sua experiência de navegação, lembrar suas preferências e analisar o uso do site. Você pode desabilitar os cookies nas configurações do seu navegador.
              </p>
            </section>

            <section style={{ marginBottom: '30px' }}>
              <h2 style={{ color: theme.primary, marginBottom: '15px', fontSize: '1.5rem' }}>
                7. Alterações nesta Política
              </h2>
              <p style={{ marginBottom: '15px' }}>
                Podemos atualizar esta política de privacidade periodicamente. Notificaremos sobre mudanças significativas através do site ou por email.
              </p>
            </section>

            <section style={{ marginBottom: '30px' }}>
              <h2 style={{ color: theme.primary, marginBottom: '15px', fontSize: '1.5rem' }}>
                8. Contato
              </h2>
              <p style={{ marginBottom: '15px' }}>
                Se você tiver dúvidas sobre esta política de privacidade, entre em contato conosco através da página "Fale Conosco" ou pelo email: privacidade@alemdopositivo.com
              </p>
            </section>

            <div style={{ 
              textAlign: 'center', 
              padding: '25px', 
              backgroundColor: isDark ? 'rgba(173, 115, 120, 0.3)' : 'rgba(173, 115, 120, 0.2)', 
              borderRadius: '8px',
              border: `1px solid ${theme.primary}`,
              marginTop: '30px'
            }}>
              <p style={{ marginBottom: '15px', fontWeight: 'bold' }}>
                Última atualização: Outubro de 2024
              </p>
              <p style={{ margin: 0, fontSize: '14px', color: theme.textSecondary }}>
                Ao usar nossos serviços, você concorda com esta política de privacidade.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TermosPrivacidade;