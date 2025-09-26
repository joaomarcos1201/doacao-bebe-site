import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

function FaleConosco() {
  const navigate = useNavigate();
  const { theme, isDark } = useTheme();
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    assunto: '',
    mensagem: ''
  });
  const [enviado, setEnviado] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simular envio
    setEnviado(true);
    setTimeout(() => {
      navigate('/home');
    }, 2000);
  };

  if (enviado) {
    return (
      <div style={{
        minHeight: '100vh',
<<<<<<< HEAD
        background: 'linear-gradient(135deg, white 0%, #f8d7da 100%)',
=======
        background: 'linear-gradient(135deg, #ffc0cb 0%, #f8d7da 100%)',
>>>>>>> 5eb5bb0e7acc2e82bebc4dbe59efb663ccd71c92
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
<<<<<<< HEAD
      background: 'linear-gradient(135deg, white 0%, #f8d7da 100%)',
=======
      background: 'linear-gradient(135deg, #ffc0cb 0%, #f8d7da 100%)',
>>>>>>> 5eb5bb0e7acc2e82bebc4dbe59efb663ccd71c92
      padding: '20px'
    }}>
      <div 
        onClick={() => navigate('/home')}
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
      <div style={{
        maxWidth: '600px',
        margin: '0 auto',
        backgroundColor: isDark ? 'rgba(105, 72, 75, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(15px)',
        borderRadius: '15px',
        padding: '30px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
        marginTop: '50px'
      }}>
        <button
          onClick={() => navigate('/home')}
          style={{
            marginBottom: '20px',
            padding: '10px 15px',
            backgroundColor: 'transparent',
            color: theme.text,
            border: `1px solid ${theme.border}`,
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          ← Voltar ao Início
        </button>

        <h1 style={{ color: theme.primary, textAlign: 'center', marginBottom: '30px' }}>
          Fale Conosco
        </h1>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: theme.text, fontWeight: 'bold' }}>
              Nome *
            </label>
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '12px',
                border: `1px solid ${theme.border}`,
                borderRadius: '8px',
                backgroundColor: isDark ? 'rgba(69, 75, 96, 0.8)' : 'rgba(255, 255, 255, 0.9)',
                color: theme.text,
                fontSize: '16px'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: theme.text, fontWeight: 'bold' }}>
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '12px',
                border: `1px solid ${theme.border}`,
                borderRadius: '8px',
                backgroundColor: isDark ? 'rgba(69, 75, 96, 0.8)' : 'rgba(255, 255, 255, 0.9)',
                color: theme.text,
                fontSize: '16px'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: theme.text, fontWeight: 'bold' }}>
              Assunto *
            </label>
            <input
              type="text"
              name="assunto"
              value={formData.assunto}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '12px',
                border: `1px solid ${theme.border}`,
                borderRadius: '8px',
                backgroundColor: isDark ? 'rgba(69, 75, 96, 0.8)' : 'rgba(255, 255, 255, 0.9)',
                color: theme.text,
                fontSize: '16px'
              }}
            />
          </div>

          <div style={{ marginBottom: '30px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: theme.text, fontWeight: 'bold' }}>
              Mensagem *
            </label>
            <textarea
              name="mensagem"
              value={formData.mensagem}
              onChange={handleChange}
              required
              rows="5"
              style={{
                width: '100%',
                padding: '12px',
                border: `1px solid ${theme.border}`,
                borderRadius: '8px',
                backgroundColor: isDark ? 'rgba(69, 75, 96, 0.8)' : 'rgba(255, 255, 255, 0.9)',
                color: theme.text,
                fontSize: '16px',
                resize: 'vertical'
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '15px',
              backgroundColor: theme.primary,
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '18px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            Enviar Mensagem
          </button>
        </form>
      </div>
    </div>
  );
}

export default FaleConosco;