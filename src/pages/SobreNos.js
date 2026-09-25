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
        <span style={{ fontSize: '16px', fontWeight: '700', color: isDark ? '#e8d0d4' : '#c0606a' }}>Sobre Nós</span>
        <button onClick={toggleTheme} style={{
          width: '36px', height: '36px', borderRadius: '50%', border: `1px solid ${isDark ? '#333' : '#e8d0d4'}`,
          backgroundColor: 'transparent', cursor: 'pointer', fontSize: '16px'
        }}>{isDark ? '☀️' : '🌙'}</button>
      </nav>

      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <img src="logo-alem-do-positivo.png" alt="Logo Além do Positivo" style={{
            width: '96px', height: '84px', objectFit: 'contain', display: 'block', margin: '0 auto 20px'
          }} onError={(e) => e.target.style.display = 'none'} />
          <h1 style={{ fontSize: '36px', fontWeight: '800', color: isDark ? '#f0e0e2' : '#2d1518', margin: '0 0 12px', letterSpacing: '-1px' }}>
            Além do Positivo
          </h1>
          <p style={{ fontSize: '16px', color: isDark ? '#777' : '#999', margin: 0 }}>
            Conectando pessoas para comprar e vender
          </p>
        </div>

        {[
          {
            title: 'Sobre o Além do Positivo',
            content: 'O Além do Positivo é um marketplace que conecta pessoas interessadas em comprar e vender produtos. Aqui, vendedores cadastram seus anúncios e compradores encontram produtos, consultam seus detalhes e realizam compras pela plataforma.'
          },
          {
            title: 'Nosso Objetivo',
            content: 'Facilitar a conexão entre compradores e vendedores com uma experiência simples e organizada. Reunimos a descoberta de produtos, a compra e o acompanhamento de pedidos e vendas em um só lugar, com informações para cada etapa.'
          },
          {
            title: 'Recursos para Comprar',
            content: 'Explore os produtos disponíveis, veja fotos, descrições e preços na página de cada produto e salve seus interesses nos favoritos. No checkout, informe o CEP, consulte os valores e as opções de frete, escolha a entrega e prossiga para o pagamento PIX. Em Meus Pedidos, consulte suas compras e acompanhe os status de pagamento e envio registrados na plataforma.'
          },
          {
            title: 'Recursos para Vender',
            content: 'Cadastre produtos com fotos, descrição e preço e envie o anúncio para análise administrativa. Em Minhas Vendas, consulte as vendas realizadas e seus status de pagamento e entrega. A carteira do vendedor reúne os saldos retido e liberado, o histórico de movimentações e as solicitações de saque.'
          },
          {
            title: 'Uma Plataforma em Desenvolvimento',
            content: 'Este marketplace faz parte de um Trabalho de Conclusão de Curso (TCC). Os fluxos de PIX, frete e entrega incluem simulações para demonstrar o funcionamento da plataforma. Os valores, prazos e status apresentados nesse ambiente não devem ser interpretados como confirmação de serviços reais de pagamento ou transporte.'
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(180px, 100%), 1fr))', gap: '16px' }}>
            {[
              { n: '1', title: 'Anuncie', desc: 'Cadastre fotos, descrição e preço do produto.' },
              { n: '2', title: 'Aguarde a análise', desc: 'A administração revisa o anúncio antes de disponibilizá-lo para compra.' },
              { n: '3', title: 'Encontre produtos', desc: 'Explore os anúncios, consulte os detalhes e salve seus favoritos.' },
              { n: '4', title: 'Faça a compra', desc: 'No checkout, consulte e escolha o frete antes de gerar o PIX no fluxo do projeto.' },
              { n: '5', title: 'Acompanhe o pedido', desc: 'Em Meus Pedidos, veja os status de pagamento e as etapas de entrega registradas.' },
              { n: '6', title: 'Consulte suas vendas', desc: 'Veja os status em Minhas Vendas e os saldos e movimentações na carteira.' },
            ].map(({ n, title, desc }) => (
              <div key={n} style={{
                padding: '20px', borderRadius: '12px', textAlign: 'center',
                backgroundColor: isDark ? '#1a1a1a' : '#fdf0f2',
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
