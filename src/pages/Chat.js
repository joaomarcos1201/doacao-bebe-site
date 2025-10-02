import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProdutos } from '../context/ProdutosContext';
import { useTheme } from '../context/ThemeContext';

function Chat() {
  const { produtoId } = useParams();
  const { produtos } = useProdutos();
  const { theme, isDark } = useTheme();
  const [mensagens, setMensagens] = useState([]);
  const [novaMensagem, setNovaMensagem] = useState('');
  const [usuario] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const messagesEndRef = useRef(null);

  const produto = produtos.find(p => p.id === parseInt(produtoId));

  useEffect(() => {
    // Carregar mensagens do localStorage
    const chatKey = `chat_${produtoId}`;
    const savedMessages = localStorage.getItem(chatKey);
    if (savedMessages) {
      setMensagens(JSON.parse(savedMessages));
    } else {
      // Mensagem inicial do sistema
      const mensagemInicial = {
        id: 1,
        texto: `Chat iniciado para o produto: ${produto?.nome || 'Produto'}`,
        usuario: 'Sistema',
        timestamp: new Date().toISOString(),
        isSystem: true
      };
      setMensagens([mensagemInicial]);
      localStorage.setItem(chatKey, JSON.stringify([mensagemInicial]));
    }
  }, [produtoId, produto]);

  useEffect(() => {
    scrollToBottom();
  }, [mensagens]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const enviarMensagem = () => {
    if (!novaMensagem.trim() || !usuario) return;

    const mensagem = {
      id: Date.now(),
      texto: novaMensagem,
      usuario: usuario.nome,
      timestamp: new Date().toISOString(),
      isSystem: false
    };

    const novasMensagens = [...mensagens, mensagem];
    setMensagens(novasMensagens);
    
    // Salvar no localStorage
    const chatKey = `chat_${produtoId}`;
    localStorage.setItem(chatKey, JSON.stringify(novasMensagens));
    
    setNovaMensagem('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      enviarMensagem();
    }
  };

  const formatarHora = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!produto) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #ffc0cb 0%, #f8d7da 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div style={{
          background: isDark ? 'rgba(105, 72, 75, 0.95)' : 'rgba(255, 255, 255, 0.95)',
          padding: '30px',
          borderRadius: '15px',
          textAlign: 'center'
        }}>
          <h3 style={{ color: theme.primary }}>Produto não encontrado</h3>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #ffc0cb 0%, #f8d7da 100%)',
      padding: window.innerWidth < 768 ? '15px' : '20px'
    }}>
      <div style={{ position: 'absolute', top: window.innerWidth < 768 ? '15px' : '20px', right: window.innerWidth < 768 ? '15px' : '20px' }}>
        <button 
          onClick={() => window.history.back()}
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
      
      <div style={{ maxWidth: '800px', margin: '0 auto', paddingTop: window.innerWidth < 768 ? '50px' : '60px' }}>
        <div style={{ marginBottom: '30px' }}>
          <Link 
            to={`/produto/${produtoId}`}
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
            ← Voltar ao Produto
          </Link>
        </div>
        
        <div style={{
          background: isDark ? 'linear-gradient(135deg, rgba(105, 72, 75, 0.95) 0%, rgba(173, 115, 120, 0.95) 100%)' : 'linear-gradient(135deg, white 0%, #ffc0cb 100%)',
          backdropFilter: 'blur(15px)',
          borderRadius: '20px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.15), 0 8px 25px rgba(0,0,0,0.1)',
          border: '1px solid #ffc0cb',
          overflow: 'hidden',
          height: '70vh',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Header do Chat */}
          <div style={{
            padding: '20px 25px',
            borderBottom: `1px solid ${isDark ? 'rgba(173, 115, 120, 0.3)' : 'rgba(252, 192, 203, 0.4)'}`,
            background: isDark ? 'rgba(173, 115, 120, 0.2)' : 'rgba(252, 192, 203, 0.2)'
          }}>
            <h2 style={{ 
              color: theme.primary, 
              margin: '0 0 5px 0', 
              fontSize: '20px',
              fontWeight: '700'
            }}>
              {produto.nome}
            </h2>
            <p style={{ 
              color: theme.textSecondary, 
              margin: 0, 
              fontSize: '14px' 
            }}>
              Chat com {produto.doador}
            </p>
          </div>

          {/* Área de Mensagens */}
          <div style={{
            flex: 1,
            padding: '20px',
            overflowY: 'auto'
          }}>
        {mensagens.map((mensagem) => (
          <div
            key={mensagem.id}
            style={{
              marginBottom: '15px',
              display: 'flex',
              justifyContent: mensagem.isSystem ? 'center' : 
                (mensagem.usuario === usuario?.nome ? 'flex-end' : 'flex-start')
            }}
          >
            {mensagem.isSystem ? (
              <div style={{
                backgroundColor: isDark ? 'rgba(173, 115, 120, 0.3)' : 'rgba(252, 192, 203, 0.3)',
                color: theme.textSecondary,
                padding: '8px 15px',
                borderRadius: '15px',
                fontSize: '12px',
                maxWidth: '80%',
                textAlign: 'center'
              }}>
                {mensagem.texto}
              </div>
            ) : (
              <div style={{
                maxWidth: '70%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: mensagem.usuario === usuario?.nome ? 'flex-end' : 'flex-start'
              }}>
                <div style={{
                  backgroundColor: mensagem.usuario === usuario?.nome 
                    ? theme.primary 
                    : (isDark ? 'rgba(105, 72, 75, 0.8)' : 'rgba(255, 255, 255, 0.9)'),
                  color: mensagem.usuario === usuario?.nome 
                    ? 'white' 
                    : theme.text,
                  padding: '12px 16px',
                  borderRadius: '18px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  wordWrap: 'break-word'
                }}>
                  <div style={{ fontSize: '14px', lineHeight: '1.4' }}>
                    {mensagem.texto}
                  </div>
                </div>
                <div style={{
                  fontSize: '11px',
                  color: theme.textSecondary,
                  marginTop: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}>
                  <span>{mensagem.usuario}</span>
                  <span>•</span>
                  <span>{formatarHora(mensagem.timestamp)}</span>
                </div>
              </div>
            )}
          </div>
        ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input de Mensagem */}
          <div style={{
            padding: '20px 25px',
            borderTop: `1px solid ${isDark ? 'rgba(173, 115, 120, 0.3)' : 'rgba(252, 192, 203, 0.4)'}`,
            background: isDark ? 'rgba(173, 115, 120, 0.2)' : 'rgba(252, 192, 203, 0.2)',
            display: 'flex',
            gap: '15px',
            alignItems: 'flex-end'
          }}>
        <textarea
          value={novaMensagem}
          onChange={(e) => setNovaMensagem(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Digite sua mensagem..."
          rows="1"
          style={{
            flex: 1,
            padding: '12px 15px',
            border: `2px solid ${isDark ? 'rgba(173, 115, 120, 0.3)' : 'rgba(252, 192, 203, 0.5)'}`,
            borderRadius: '20px',
            backgroundColor: isDark ? 'rgba(105, 72, 75, 0.3)' : 'rgba(255, 255, 255, 0.8)',
            color: theme.text,
            fontSize: '14px',
            outline: 'none',
            resize: 'none',
            fontFamily: 'inherit',
            maxHeight: '80px',
            minHeight: '40px'
          }}
          onFocus={(e) => e.target.style.borderColor = theme.primary}
          onBlur={(e) => e.target.style.borderColor = isDark ? 'rgba(173, 115, 120, 0.3)' : 'rgba(252, 192, 203, 0.5)'}
        />
        <button
          onClick={enviarMensagem}
          disabled={!novaMensagem.trim()}
          style={{
            padding: '12px 16px',
            backgroundColor: novaMensagem.trim() ? theme.primary : (isDark ? 'rgba(173, 115, 120, 0.3)' : 'rgba(252, 192, 203, 0.3)'),
            color: novaMensagem.trim() ? 'white' : theme.textSecondary,
            border: 'none',
            borderRadius: '20px',
            cursor: novaMensagem.trim() ? 'pointer' : 'not-allowed',
            fontSize: '14px',
            fontWeight: '600',
            transition: 'all 0.2s ease',
            minWidth: '60px'
          }}
        >
          Enviar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;