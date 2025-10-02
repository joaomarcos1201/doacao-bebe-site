import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

function FAQ() {
  const { theme, isDark, toggleTheme } = useTheme();
  const [perguntaAberta, setPerguntaAberta] = useState(null);

  const perguntas = [
    {
      id: 1,
      pergunta: "Como funciona o sistema de doações?",
      resposta: "Nosso sistema conecta pessoas que desejam doar produtos para bebês com famílias que precisam. Você pode cadastrar produtos para doação ou buscar itens disponíveis. Todos os produtos passam por aprovação antes de serem publicados."
    },
    {
      id: 2,
      pergunta: "Como posso doar um produto?",
      resposta: "Para doar, faça login em sua conta, clique em 'Doar Produto' no menu, preencha o formulário com as informações do item (nome, categoria, descrição, estado e contato). Após aprovação do administrador, seu produto ficará visível para interessados."
    },
    {
      id: 3,
      pergunta: "Como entro em contato com quem está doando?",
      resposta: "Ao encontrar um produto de interesse, clique em 'Entrar em Contato'. Você será direcionado para o WhatsApp do doador com uma mensagem pré-definida. A partir daí, vocês podem combinar os detalhes da doação."
    },
    {
      id: 4,
      pergunta: "Preciso pagar alguma taxa para usar o site?",
      resposta: "Não! Nosso serviço é 100% gratuito. Não cobramos taxas para cadastro, doação ou busca de produtos. Nossa missão é facilitar a solidariedade entre famílias."
    },
    {
      id: 5,
      pergunta: "Que tipos de produtos posso doar?",
      resposta: "Aceitamos diversos produtos para bebês e gestantes: roupas, brinquedos, móveis (berços, carrinhos), acessórios (mamadeiras, chupetas), produtos de alimentação e outros itens relacionados. Todos devem estar em bom estado de conservação."
    },
    {
      id: 6,
      pergunta: "Como sei se minha doação foi aprovada?",
      resposta: "Após cadastrar um produto, ele passa por análise do administrador. Você pode acompanhar o status na sua área de perfil. Produtos aprovados ficam visíveis na página principal para outros usuários."
    },
    {
      id: 7,
      pergunta: "Posso editar ou remover minha doação?",
      resposta: "Sim! Você pode gerenciar suas doações através do seu perfil. É possível editar informações ou remover produtos que já foram doados ou não estão mais disponíveis."
    },
    {
      id: 8,
      pergunta: "Como garantir a segurança nas trocas?",
      resposta: "Recomendamos sempre encontros em locais públicos e seguros. Verifique as informações do produto antes do encontro. Nossa plataforma facilita o contato, mas a responsabilidade pela transação é dos usuários envolvidos."
    },
    {
      id: 9,
      pergunta: "Posso doar produtos usados?",
      resposta: "Sim! Aceitamos produtos novos, semi-novos e usados, desde que estejam em bom estado de conservação e funcionamento. Seja honesto sobre o estado do produto na descrição."
    },
    {
      id: 10,
      pergunta: "Como posso ajudar o projeto além de doar produtos?",
      resposta: "Você pode divulgar nossa plataforma para outras famílias, seguir nossas redes sociais, dar feedback sobre melhorias e participar de nossa comunidade solidária. Toda ajuda é bem-vinda!"
    }
  ];

  const togglePergunta = (id) => {
    setPerguntaAberta(perguntaAberta === id ? null : id);
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #ffc0cb 0%, #f8d7da 100%)',
      padding: window.innerWidth < 768 ? '15px' : '20px'
    }}>
      <div style={{ position: 'absolute', top: window.innerWidth < 768 ? '15px' : '20px', right: window.innerWidth < 768 ? '15px' : '20px' }}>
        <button 
          onClick={toggleTheme}
          style={{
            padding: '12px',
            backgroundColor: isDark ? 'rgba(105, 72, 75, 0.9)' : 'rgba(255, 255, 255, 0.9)',
            color: theme.text,
            border: `1px solid ${theme.border}`,
            borderRadius: '10px',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            transition: 'all 0.2s ease'
          }}
        >
          {isDark ? '☀️' : '🌙'}
        </button>
      </div>
      
      <div style={{ maxWidth: '900px', margin: '0 auto', paddingTop: window.innerWidth < 768 ? '50px' : '60px' }}>
        <div style={{ marginBottom: '30px' }}>
          <Link 
            to="/home" 
            style={{ 
              color: theme.primary, 
              textDecoration: 'none',
              fontSize: '16px',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s ease'
            }}
          >
            ← Voltar ao Início
          </Link>
        </div>
        
        <div style={{
          background: isDark ? 'linear-gradient(135deg, rgba(105, 72, 75, 0.95) 0%, rgba(173, 115, 120, 0.95) 100%)' : 'linear-gradient(135deg, white 0%, #ffc0cb 100%)',
          backdropFilter: 'blur(15px)',
          padding: window.innerWidth < 768 ? '25px' : '40px',
          borderRadius: '20px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.15), 0 8px 25px rgba(0,0,0,0.1)',
          border: '1px solid #ffc0cb'
        }}>
          <div style={{ textAlign: 'center', marginBottom: window.innerWidth < 768 ? '30px' : '40px' }}>
            <h1 style={{ 
              color: theme.primary, 
              fontSize: window.innerWidth < 768 ? '26px' : '32px', 
              fontWeight: '700',
              marginBottom: '8px',
              letterSpacing: '-0.5px'
            }}>
              Perguntas Frequentes
            </h1>
            <p style={{ 
              color: theme.textSecondary, 
              fontSize: '16px',
              margin: 0
            }}>
              Tire suas dúvidas sobre como usar nossa plataforma
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {perguntas.map((item) => (
              <div 
                key={item.id}
                style={{
                  background: isDark ? 'rgba(173, 115, 120, 0.2)' : 'rgba(252, 192, 203, 0.2)',
                  borderRadius: '12px',
                  border: `1px solid ${isDark ? 'rgba(173, 115, 120, 0.3)' : 'rgba(252, 192, 203, 0.3)'}`,
                  overflow: 'hidden',
                  transition: 'all 0.3s ease'
                }}
              >
                <button
                  onClick={() => togglePergunta(item.id)}
                  style={{
                    width: '100%',
                    padding: '20px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '15px',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = isDark ? 'rgba(173, 115, 120, 0.1)' : 'rgba(252, 192, 203, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'transparent';
                  }}
                >
                  <h3 style={{
                    color: theme.text,
                    fontSize: '16px',
                    fontWeight: '600',
                    margin: 0,
                    lineHeight: '1.4'
                  }}>
                    {item.pergunta}
                  </h3>
                  <span style={{
                    color: theme.primary,
                    fontSize: '20px',
                    fontWeight: 'bold',
                    transform: perguntaAberta === item.id ? 'rotate(45deg)' : 'rotate(0deg)',
                    transition: 'transform 0.3s ease',
                    flexShrink: 0
                  }}>
                    +
                  </span>
                </button>
                
                {perguntaAberta === item.id && (
                  <div style={{
                    padding: '0 20px 20px 20px',
                    borderTop: `1px solid ${isDark ? 'rgba(173, 115, 120, 0.2)' : 'rgba(252, 192, 203, 0.2)'}`,
                    animation: 'fadeIn 0.3s ease'
                  }}>
                    <p style={{
                      color: theme.textSecondary,
                      fontSize: '15px',
                      lineHeight: '1.6',
                      margin: '15px 0 0 0'
                    }}>
                      {item.resposta}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div style={{ 
            marginTop: '40px', 
            padding: '25px', 
            background: isDark ? 'rgba(173, 115, 120, 0.2)' : 'rgba(252, 192, 203, 0.2)', 
            borderRadius: '15px',
            border: `1px solid ${isDark ? 'rgba(173, 115, 120, 0.3)' : 'rgba(252, 192, 203, 0.3)'}`,
            textAlign: 'center'
          }}>
            <h3 style={{ 
              color: theme.primary, 
              marginBottom: '15px',
              fontSize: '18px',
              fontWeight: '600'
            }}>
              Não encontrou sua resposta?
            </h3>
            <p style={{
              color: theme.text,
              fontSize: '15px',
              marginBottom: '20px',
              lineHeight: '1.5'
            }}>
              Entre em contato conosco através do nosso canal de atendimento
            </p>
            <Link
              to="/fale-conosco"
              style={{
                display: 'inline-block',
                padding: '12px 24px',
                backgroundColor: theme.primary,
                color: 'white',
                textDecoration: 'none',
                borderRadius: '10px',
                fontSize: '15px',
                fontWeight: '600',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 15px rgba(173, 115, 120, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#9a6b70';
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 20px rgba(173, 115, 120, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = theme.primary;
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 15px rgba(173, 115, 120, 0.3)';
              }}
            >
              Fale Conosco
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default FAQ;