import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

function SobreNos() {
  const { theme, isDark, toggleTheme } = useTheme();

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: isDark ? 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%)' : 'linear-gradient(135deg, #ffc0cb 0%, #f8d7da 100%)',
      padding: '20px'
    }}>
      <div 
        onClick={() => window.location.href = '/home'}
        style={{ 
          position: 'absolute', 
          top: '20px', 
          left: '20px', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '10px',
          cursor: 'pointer',
          transition: 'transform 0.2s ease'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        <img 
          src="logo.JPEG"
          alt="Logo Além do Positivo"
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            objectFit: 'cover'
          }}
        />
        <span style={{ color: theme.primary, fontWeight: 'bold', fontSize: '18px' }}>Além do Positivo</span>
      </div>
      <div style={{ position: 'absolute', top: '20px', right: '20px' }}>
        <button 
          onClick={toggleTheme}
          style={{
            padding: '10px',
            backgroundColor: isDark ? '#2a2d33' : 'rgba(255, 255, 255, 0.9)',
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
          background: isDark ? 'linear-gradient(135deg, #1e2328 0%, #2a2d33 100%)' : 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
          backdropFilter: 'blur(10px)',
          padding: '40px',
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          border: '1px solid #ffc0cb'
        }}>
          <h1 style={{ textAlign: 'center', marginBottom: '30px', color: theme.primary, fontSize: '2.5rem' }}>
            Sobre Nós
          </h1>
          
          <div style={{ lineHeight: '1.8', fontSize: '16px', color: theme.text }}>
            <section style={{ marginBottom: '30px' }}>
              <h2 style={{ color: theme.primary, marginBottom: '15px', fontSize: '1.5rem' }}>
                Nossa História
              </h2>
              <p style={{ marginBottom: '15px' }}>
                O <strong>Além do Positivo</strong> nasceu da necessidade de conectar famílias que precisam de apoio durante a gravidez e primeiros anos de vida do bebê com pessoas dispostas a ajudar através de doações.
              </p>
              <p style={{ marginBottom: '15px' }}>
                Fundado em 2024, nosso projeto surgiu da observação de que muitas famílias enfrentam dificuldades financeiras para adquirir itens essenciais para bebês, enquanto outras famílias possuem produtos em bom estado que não utilizam mais.
              </p>
            </section>

            <section style={{ marginBottom: '30px' }}>
              <h2 style={{ color: theme.primary, marginBottom: '15px', fontSize: '1.5rem' }}>
                Nosso Objetivo
              </h2>
              <p style={{ marginBottom: '15px' }}>
                Nosso principal objetivo é <strong>criar uma ponte solidária</strong> entre quem pode doar e quem precisa receber, promovendo:
              </p>
              <ul style={{ marginLeft: '20px', marginBottom: '15px' }}>
                <li style={{ marginBottom: '8px' }}><strong>Solidariedade comunitária</strong> - Fortalecer laços entre famílias</li>
                <li style={{ marginBottom: '8px' }}><strong>Sustentabilidade</strong> - Dar nova vida a produtos em bom estado</li>
                <li style={{ marginBottom: '8px' }}><strong>Apoio à maternidade</strong> - Facilitar o acesso a itens essenciais para bebês</li>
                <li style={{ marginBottom: '8px' }}><strong>Impacto social</strong> - Reduzir desigualdades e promover bem-estar</li>
              </ul>
            </section>

            <section style={{ marginBottom: '30px' }}>
              <h2 style={{ color: theme.primary, marginBottom: '15px', fontSize: '1.5rem' }}>
                Como Funciona
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                <div style={{ 
                  padding: '20px', 
                  backgroundColor: isDark ? 'rgba(69, 75, 96, 0.5)' : 'rgba(247, 182, 186, 0.3)', 
                  borderRadius: '8px',
                  border: `1px solid ${theme.border}`
                }}>
                  <h3 style={{ color: theme.primary, marginBottom: '10px' }}>1. Doar</h3>
                  <p style={{ fontSize: '14px' }}>Cadastre produtos que não usa mais e ajude outras famílias</p>
                </div>
                <div style={{ 
                  padding: '20px', 
                  backgroundColor: isDark ? 'rgba(69, 75, 96, 0.5)' : 'rgba(247, 182, 186, 0.3)', 
                  borderRadius: '8px',
                  border: `1px solid ${theme.border}`
                }}>
                  <h3 style={{ color: theme.primary, marginBottom: '10px' }}>2. Buscar</h3>
                  <p style={{ fontSize: '14px' }}>Encontre produtos que precisa através da nossa busca</p>
                </div>
                <div style={{ 
                  padding: '20px', 
                  backgroundColor: isDark ? 'rgba(69, 75, 96, 0.5)' : 'rgba(247, 182, 186, 0.3)', 
                  borderRadius: '8px',
                  border: `1px solid ${theme.border}`
                }}>
                  <h3 style={{ color: theme.primary, marginBottom: '10px' }}>3. Conectar</h3>
                  <p style={{ fontSize: '14px' }}>Entre em contato direto com o doador via WhatsApp</p>
                </div>
              </div>
            </section>

            <section style={{ marginBottom: '30px' }}>
              <h2 style={{ color: theme.primary, marginBottom: '15px', fontSize: '1.5rem' }}>
                Nossa Visão
              </h2>
              <p style={{ marginBottom: '15px' }}>
                Acreditamos que <strong>pequenos gestos podem transformar vidas</strong>. Cada produto doado representa não apenas um item material, mas um ato de amor, cuidado e esperança para uma família que está começando ou expandindo.
              </p>
              <p style={{ marginBottom: '15px' }}>
                Queremos ser a plataforma de referência para doações de itens infantis, criando uma comunidade onde a generosidade e a gratidão caminham juntas, construindo um futuro melhor para nossas crianças.
              </p>
            </section>

            <div style={{ 
              textAlign: 'center', 
              padding: '25px', 
              backgroundColor: isDark ? 'rgba(173, 115, 120, 0.3)' : 'rgba(173, 115, 120, 0.2)', 
              borderRadius: '8px',
              border: `1px solid ${theme.primary}`
            }}>
              <h3 style={{ color: theme.primary, marginBottom: '15px' }}>
                Junte-se à Nossa Missão
              </h3>
              <p style={{ marginBottom: '20px', fontStyle: 'italic' }}>
                "Juntos, podemos ir além do positivo e criar um mundo mais solidário para nossas famílias."
              </p>
              <Link 
                to="/doacao" 
                style={{
                  display: 'inline-block',
                  padding: '12px 30px',
                  backgroundColor: theme.primary,
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '25px',
                  fontWeight: 'bold',
                  marginRight: '15px'
                }}
              >
                Fazer uma Doação
              </Link>
              <Link 
                to="/home" 
                style={{
                  display: 'inline-block',
                  padding: '12px 30px',
                  backgroundColor: 'transparent',
                  color: theme.primary,
                  textDecoration: 'none',
                  border: `2px solid ${theme.primary}`,
                  borderRadius: '25px',
                  fontWeight: 'bold'
                }}
              >
                Ver Produtos
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SobreNos;