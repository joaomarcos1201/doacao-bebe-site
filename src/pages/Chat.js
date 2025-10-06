import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProdutos } from '../context/ProdutosContext';
import { useTheme } from '../context/ThemeContext';

function Chat() {
  const { chatId } = useParams();
  const { theme, isDark } = useTheme();
  const [mensagens, setMensagens] = useState([]);
  const [novaMensagem, setNovaMensagem] = useState('');
  const [chatInfo, setChatInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [usuario] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const messagesEndRef = useRef(null);

  useEffect(() => {
    carregarMensagens();
    const interval = setInterval(carregarMensagens, 3000); // Atualizar a cada 3 segundos
    return () => clearInterval(interval);
  }, [chatId]);

  const carregarMensagens = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`http://localhost:8080/api/chat/${chatId}/mensagens`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setMensagens(data);
        
        // Se é a primeira vez carregando, buscar info do chat
        if (loading && data.length > 0) {
          await buscarInfoChat();
        }
      }
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error);
    } finally {
      setLoading(false);
    }
  };

  const buscarInfoChat = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8080/api/chat/meus-chats', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const chats = await response.json();
        const chat = chats.find(c => c.id === parseInt(chatId));
        setChatInfo(chat);
      }
    } catch (error) {
      console.error('Erro ao buscar info do chat:', error);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [mensagens]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const enviarMensagem = async () => {
    if (!novaMensagem.trim() || !usuario) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8080/api/chat/enviar-mensagem', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          chatId: parseInt(chatId),
          conteudo: novaMensagem
        })
      });

      if (response.ok) {
        setNovaMensagem('');
        carregarMensagens(); // Recarregar mensagens
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
    }
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

  if (loading) {
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
          <h3 style={{ color: theme.primary }}>Carregando chat...</h3>
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
            to="/perfil"
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
            ← Voltar aos Meus Chats
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
              {chatInfo?.produtoNome || 'Chat'}
            </h2>
            <p style={{ 
              color: theme.textSecondary, 
              margin: 0, 
              fontSize: '14px' 
            }}>
              Chat com {chatInfo?.outroUsuarioNome || 'Usuário'}
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
              justifyContent: mensagem.remetenteId === usuario?.id ? 'flex-end' : 'flex-start'
            }}
          >
            <div style={{
              maxWidth: '70%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: mensagem.remetenteId === usuario?.id ? 'flex-end' : 'flex-start'
            }}>
              <div style={{
                backgroundColor: mensagem.remetenteId === usuario?.id 
                  ? theme.primary 
                  : (isDark ? 'rgba(105, 72, 75, 0.8)' : 'rgba(255, 255, 255, 0.9)'),
                color: mensagem.remetenteId === usuario?.id 
                  ? 'white' 
                  : theme.text,
                padding: '12px 16px',
                borderRadius: '18px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                wordWrap: 'break-word'
              }}>
                <div style={{ fontSize: '14px', lineHeight: '1.4' }}>
                  {mensagem.conteudo}
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
                <span>{mensagem.remetenteNome}</span>
                <span>•</span>
                <span>{formatarHora(mensagem.dataEnvio)}</span>
              </div>
            </div>
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