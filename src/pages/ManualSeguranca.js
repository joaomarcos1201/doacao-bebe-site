import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

function ManualSeguranca() {
  const { theme, isDark, toggleTheme } = useTheme();

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: isDark ? 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%)' : 'linear-gradient(135deg, #ffc0cb 0%, #f8d7da 100%)',
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
            Manual de Segurança
          </h1>
          
          <div style={{ lineHeight: '1.8', fontSize: '16px', color: theme.text }}>
            

            <section style={{ marginBottom: '30px' }}>
              <h2 style={{ color: theme.primary, marginBottom: '15px', fontSize: '1.5rem' }}>
              1. Verificação de Produtos
              </h2>
              <ul style={{ marginLeft: '20px', marginBottom: '15px' }}>
                <li style={{ marginBottom: '8px' }}>Inspecione cuidadosamente o estado dos produtos</li>
                <li style={{ marginBottom: '8px' }}>Verifique se não há peças quebradas ou soltas</li>
                <li style={{ marginBottom: '8px' }}>Verifique se não há sinais de roupas rasgadas ou manchadas</li>
                <li style={{ marginBottom: '8px' }}>Para produtos eletrônicos, teste o funcionamento</li>
                <li style={{ marginBottom: '8px' }}>Confirme se o produto atende às normas de segurança</li>
              </ul>
            </section>

            <section style={{ marginBottom: '30px' }}>
              <h2 style={{ color: theme.primary, marginBottom: '15px', fontSize: '1.5rem' }}>
                2. Comunicação Segura
              </h2>
              <ul style={{ marginLeft: '20px', marginBottom: '15px' }}>
                
                <li style={{ marginBottom: '8px' }}>Não compartilhe informações pessoais desnecessárias</li>
                <li style={{ marginBottom: '8px' }}>Desconfie de pedidos urgentes ou pressão para encontros imediatos (se possível não se encontre com ninguém pessoalmente)</li>
                <li style={{ marginBottom: '8px' }}>Mantenha conversas respeitosas e cordiais</li>
              </ul>
            </section>

         

            <section style={{ marginBottom: '30px' }}>
              <h2 style={{ color: theme.primary, marginBottom: '15px', fontSize: '1.5rem' }}>
                3. Proteção de Dados
              </h2>
              <ul style={{ marginLeft: '20px', marginBottom: '15px' }}>
                <li style={{ marginBottom: '8px' }}>Use senhas fortes e únicas para sua conta</li>
                <li style={{ marginBottom: '8px' }}>Não compartilhe suas credenciais de login</li>
                <li style={{ marginBottom: '8px' }}>Faça logout ao usar computadores públicos</li>
                <li style={{ marginBottom: '8px' }}>Mantenha seu perfil atualizado com informações precisas</li>
              </ul>
            </section>

            <section style={{ marginBottom: '30px' }}>
              <h2 style={{ color: theme.primary, marginBottom: '15px', fontSize: '1.5rem' }}>
                4. Para Famílias com Crianças
              </h2>
              <ul style={{ marginLeft: '20px', marginBottom: '15px' }}>
                <li style={{ marginBottom: '8px' }}>Verifique se brinquedos não possuem peças pequenas (risco de engasgo)</li>
              
                <li style={{ marginBottom: '8px' }}>Higienize todos os itens antes do uso</li>
                <li style={{ marginBottom: '8px' }}>Teste a estabilidade de móveis e equipamentos</li>
              </ul>
            </section>

            <section style={{ marginBottom: '30px' }}>
              <h2 style={{ color: theme.primary, marginBottom: '15px', fontSize: '1.5rem' }}>
                5. Como Reportar Problemas
              </h2>
              <p style={{ marginBottom: '15px' }}>
                Se você encontrar algum comportamento suspeito ou inadequado:
              </p>
              <ul style={{ marginLeft: '20px', marginBottom: '15px' }}>
                <li style={{ marginBottom: '8px' }}>Entre em contato conosco imediatamente</li>
                <li style={{ marginBottom: '8px' }}>Forneça detalhes específicos da situação</li>
                <li style={{ marginBottom: '8px' }}>Preserve evidências (capturas de tela, mensagens)</li>
                <li style={{ marginBottom: '8px' }}>Em casos graves, procure as autoridades competentes</li>
              </ul>
            </section>

            <div style={{ 
              textAlign: 'center', 
              padding: '25px', 
              backgroundColor: isDark ? 'rgba(173, 115, 120, 0.3)' : 'rgba(173, 115, 120, 0.2)', 
              borderRadius: '8px',
              border: `1px solid ${theme.primary}`,
              marginTop: '30px'
            }}>
              <h3 style={{ color: theme.primary, marginBottom: '15px' }}>
                Emergência
              </h3>
              <p style={{ marginBottom: '15px', fontWeight: 'bold' }}>
                Em caso de emergência, ligue imediatamente para:
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', flexWrap: 'wrap' }}>
                <div>
                  <strong>Polícia Militar:</strong> 190
                </div>
                <div>
                  <strong>Bombeiros:</strong> 193
                </div>
              </div>
              <p style={{ margin: '15px 0 0 0', fontSize: '14px', color: theme.textSecondary }}>
                Sua segurança é nossa prioridade. Sempre confie em seus instintos.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManualSeguranca;