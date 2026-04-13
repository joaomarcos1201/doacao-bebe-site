import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

function FAQ() {
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [aberta, setAberta] = useState(null);

  const perguntas = [
    { id: 1, q: 'Como funciona o sistema de doações?', r: 'Nosso sistema conecta pessoas que desejam doar produtos para bebês com famílias que precisam. Você pode cadastrar produtos para doação ou buscar itens disponíveis. Todos os produtos passam por aprovação antes de serem publicados.' },
    { id: 2, q: 'Como posso doar um produto?', r: 'Clique em "Doar Produto" no menu, preencha o formulário com as informações do item. Após aprovação do administrador, seu produto ficará visível para interessados.' },
    { id: 3, q: 'Como entro em contato com quem está doando?', r: 'Ao encontrar um produto de interesse, clique em "Ver Detalhes" e depois em "Entrar em Contato via WhatsApp". Vocês combinam os detalhes diretamente.' },
    { id: 4, q: 'Preciso pagar alguma taxa?', r: 'Não! Nosso serviço é 100% gratuito. Não cobramos taxas para cadastro, doação ou busca de produtos.' },
    { id: 5, q: 'Que tipos de produtos posso doar?', r: 'Roupas, brinquedos, móveis (berços, carrinhos), acessórios, produtos de alimentação e outros itens para bebês. Todos devem estar em bom estado de conservação.' },
    { id: 6, q: 'Como sei se minha doação foi aprovada?', r: 'Após cadastrar um produto, ele passa por análise do administrador. Produtos aprovados ficam visíveis na página principal.' },
    { id: 7, q: 'Posso doar produtos usados?', r: 'Sim! Aceitamos produtos novos, semi-novos e usados, desde que estejam em bom estado. Seja honesto sobre o estado do produto na descrição.' },
    { id: 8, q: 'Como garantir a segurança nas trocas?', r: 'Recomendamos sempre encontros em locais públicos e seguros. Nossa plataforma facilita o contato, mas a responsabilidade pela transação é dos usuários envolvidos.' },
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
        <span style={{ fontSize: '16px', fontWeight: '700', color: isDark ? '#f0c0c8' : '#c0606a' }}>FAQ</span>
        <button onClick={toggleTheme} style={{
          width: '36px', height: '36px', borderRadius: '50%', border: `1px solid ${isDark ? '#333' : '#e8d0d4'}`,
          backgroundColor: 'transparent', cursor: 'pointer', fontSize: '16px'
        }}>{isDark ? '☀️' : '🌙'}</button>
      </nav>

      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: isDark ? '#f0e0e2' : '#2d1518', margin: '0 0 8px', letterSpacing: '-0.5px' }}>
            ❓ Perguntas Frequentes
          </h1>
          <p style={{ fontSize: '14px', color: isDark ? '#666' : '#999', margin: 0 }}>Tire suas dúvidas sobre a plataforma</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '32px' }}>
          {perguntas.map((item) => (
            <div key={item.id} style={{
              backgroundColor: isDark ? '#141414' : '#fff', borderRadius: '12px',
              border: `1px solid ${aberta === item.id ? '#c0606a' : (isDark ? '#2a2a2a' : '#f0e6e8')}`,
              overflow: 'hidden', transition: 'border-color 0.2s'
            }}>
              <button onClick={() => setAberta(aberta === item.id ? null : item.id)} style={{
                width: '100%', padding: '18px 20px', backgroundColor: 'transparent', border: 'none',
                textAlign: 'left', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px'
              }}>
                <span style={{ fontSize: '15px', fontWeight: '600', color: isDark ? '#e0e0e0' : '#333', lineHeight: '1.4' }}>{item.q}</span>
                <span style={{
                  color: '#c0606a', fontSize: '20px', fontWeight: '300', flexShrink: 0,
                  transform: aberta === item.id ? 'rotate(45deg)' : 'rotate(0)', transition: 'transform 0.2s'
                }}>+</span>
              </button>
              {aberta === item.id && (
                <div style={{ padding: '0 20px 18px', borderTop: `1px solid ${isDark ? '#2a2a2a' : '#f0e6e8'}` }}>
                  <p style={{ fontSize: '14px', color: isDark ? '#888' : '#666', lineHeight: '1.7', margin: '14px 0 0' }}>{item.r}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={{
          backgroundColor: isDark ? '#141414' : '#fff', borderRadius: '16px', padding: '28px',
          border: `1px solid ${isDark ? '#2a2a2a' : '#f0e6e8'}`, textAlign: 'center'
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', color: isDark ? '#e0e0e0' : '#333', margin: '0 0 8px' }}>Não encontrou sua resposta?</h3>
          <p style={{ fontSize: '14px', color: isDark ? '#666' : '#999', margin: '0 0 20px' }}>Entre em contato com nossa equipe</p>
          <Link to="/fale-conosco" style={{
            padding: '10px 24px', borderRadius: '10px', backgroundColor: '#c0606a',
            color: 'white', textDecoration: 'none', fontSize: '14px', fontWeight: '600'
          }}>Fale Conosco</Link>
        </div>
      </div>
    </div>
  );
}

export default FAQ;
