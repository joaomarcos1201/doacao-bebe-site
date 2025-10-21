import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

function FaleConosco() {
  const navigate = useNavigate();
  const { theme, isDark, toggleTheme } = useTheme();
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    mensagem: ''
  });
  const [enviado, setEnviado] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('Enviando dados:', formData);
    
    try {
      const response = await fetch('http://localhost:8080/api/contato', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      console.log('Status da resposta:', response.status);
      const responseText = await response.text();
      console.log('Resposta do servidor:', responseText);
      
      if (response.ok) {
        setEnviado(true);
        setTimeout(() => {
          navigate('/home');
        }, 2000);
      } else {
        alert(`Erro ${response.status}: ${responseText}`);
      }
    } catch (error) {
      console.error('Erro de conexão:', error);
      alert('Erro de conexão. Verifique se o backend está rodando na porta 8080.');
    }
  };

  if (enviado) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #ffc0cb 0%, #f8d7da 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          backgroundColor: isDark ? 'rgba(105, 72, 75, 0.95)' : 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(15px)',
          padding: '40px',
          borderRadius: '15px',
          textAlign: 'center',
          maxWidth: '400px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>✅</div>
          <h2 style={{ color: theme.primary, marginBottom: '15px' }}>Mensagem Enviada!</h2>
          <p style={{ color: theme.text }}>Obrigado pelo contato. Retornaremos em breve!</p>
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
          onClick={toggleTheme}
          style={{
            padding: '12px 16px',
            backgroundColor: isDark ? '#2a2d33' : 'rgba(255, 255, 255, 0.9)',
            color: theme.text,
            border: `2px solid ${theme.inputBorder}`,
            borderRadius: '12px',
            cursor: 'pointer',
            boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.4)' : '0 4px 12px rgba(0,0,0,0.15)',
            transition: 'all 0.2s ease',
            backdropFilter: 'blur(10px)'
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
          background: isDark ? 'linear-gradient(135deg, #1e2328 0%, #2a2d33 100%)' : 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
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
              Fale Conosco
            </h1>
            <p style={{ 
              color: theme.textSecondary, 
              fontSize: '16px',
              margin: 0
            }}>
              Estamos aqui para ajudar! Entre em contato conosco
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth < 768 ? '1fr' : '1fr 1fr', gap: '20px', marginBottom: '25px' }}>
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  color: theme.text,
                  fontWeight: '600',
                  fontSize: '14px'
                }}>Nome Completo *</label>
                <input
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  placeholder="Seu nome completo"
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    border: `2px solid ${isDark ? 'rgba(173, 115, 120, 0.3)' : 'rgba(252, 192, 203, 0.5)'}`,
                    borderRadius: '12px',
                    backgroundColor: isDark ? 'rgba(105, 72, 75, 0.3)' : 'rgba(255, 255, 255, 0.8)',
                    color: theme.text,
                    fontSize: '15px',
                    transition: 'all 0.2s ease',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = theme.primary}
                  onBlur={(e) => e.target.style.borderColor = isDark ? 'rgba(173, 115, 120, 0.3)' : 'rgba(252, 192, 203, 0.5)'}
                  required
                />
              </div>

              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  color: theme.text,
                  fontWeight: '600',
                  fontSize: '14px'
                }}>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="seu@email.com"
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    border: `2px solid ${isDark ? 'rgba(173, 115, 120, 0.3)' : 'rgba(252, 192, 203, 0.5)'}`,
                    borderRadius: '12px',
                    backgroundColor: isDark ? 'rgba(105, 72, 75, 0.3)' : 'rgba(255, 255, 255, 0.8)',
                    color: theme.text,
                    fontSize: '15px',
                    transition: 'all 0.2s ease',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = theme.primary}
                  onBlur={(e) => e.target.style.borderColor = isDark ? 'rgba(173, 115, 120, 0.3)' : 'rgba(252, 192, 203, 0.5)'}
                  required
                />
              </div>
            </div>

            <div style={{ marginBottom: '25px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                color: theme.text,
                fontWeight: '600',
                fontSize: '14px'
              }}>Telefone</label>
              <input
                type="tel"
                name="telefone"
                value={formData.telefone}
                onChange={handleChange}
                placeholder="(11) 99999-9999"
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  border: `2px solid ${isDark ? 'rgba(173, 115, 120, 0.3)' : 'rgba(252, 192, 203, 0.5)'}`,
                  borderRadius: '12px',
                  backgroundColor: isDark ? 'rgba(105, 72, 75, 0.3)' : 'rgba(255, 255, 255, 0.8)',
                  color: theme.text,
                  fontSize: '15px',
                  transition: 'all 0.2s ease',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = theme.primary}
                onBlur={(e) => e.target.style.borderColor = isDark ? 'rgba(173, 115, 120, 0.3)' : 'rgba(252, 192, 203, 0.5)'}
              />
            </div>

            <div style={{ marginBottom: '30px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                color: theme.text,
                fontWeight: '600',
                fontSize: '14px'
              }}>Mensagem *</label>
              <textarea
                name="mensagem"
                value={formData.mensagem}
                onChange={handleChange}
                placeholder="Descreva sua dúvida, sugestão ou problema..."
                rows="6"
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  border: `2px solid ${isDark ? 'rgba(173, 115, 120, 0.3)' : 'rgba(252, 192, 203, 0.5)'}`,
                  borderRadius: '12px',
                  backgroundColor: isDark ? 'rgba(105, 72, 75, 0.3)' : 'rgba(255, 255, 255, 0.8)',
                  color: theme.text,
                  fontSize: '15px',
                  transition: 'all 0.2s ease',
                  outline: 'none',
                  resize: 'vertical',
                  fontFamily: 'inherit'
                }}
                onFocus={(e) => e.target.style.borderColor = theme.primary}
                onBlur={(e) => e.target.style.borderColor = isDark ? 'rgba(173, 115, 120, 0.3)' : 'rgba(252, 192, 203, 0.5)'}
                required
              />
            </div>

            <button 
              type="submit" 
              style={{
                width: '100%',
                padding: '16px 24px',
                backgroundColor: theme.primary,
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '16px',
                cursor: 'pointer',
                fontWeight: '600',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 15px rgba(173, 115, 120, 0.3)',
                marginTop: '10px'
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
              Enviar Mensagem
            </button>
          </form>
          
          <div style={{ 
            marginTop: '30px', 
            padding: '25px', 
            background: isDark ? 'linear-gradient(135deg, #2a2d33 0%, #3e4147 100%)' : '#f8f9fa', 
            borderRadius: '15px',
            border: `1px solid ${isDark ? '#4a4d53' : '#dddddd'}`,
            boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.3)' : '0 2px 10px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ 
              color: theme.primary, 
              marginBottom: '15px',
              fontSize: '18px',
              fontWeight: '600'
            }}>
              Outras formas de contato
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '16px' }}></span>
                <span style={{ color: theme.text, fontSize: '14px' }}>alemdopositivo0225@gmail.com</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '16px' }}></span>
                <span style={{ color: theme.text, fontSize: '14px' }}></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '16px' }}></span>
                <span style={{ color: theme.text, fontSize: '14px' }}>Horário de atendimento: Segunda a Sexta, 9h às 18h</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FaleConosco;