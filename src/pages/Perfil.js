import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

function Perfil({ user, setUser }) {
  const navigate = useNavigate();
  const { theme, isDark, toggleTheme } = useTheme();
  const [nome, setNome] = useState(user?.nome || '');
  const [email, setEmail] = useState(user?.email || '');
  const [telefone, setTelefone] = useState('');
  const [endereco, setEndereco] = useState('');
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (novaSenha && novaSenha !== confirmarSenha) {
      alert('As senhas não coincidem!');
      return;
    }

    try {
      // Atualizar dados básicos
      const updateResponse = await fetch(`http://localhost:5000/api/usuarios/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nome, email }),
      });

      if (!updateResponse.ok) {
        throw new Error('Erro ao atualizar dados');
      }

      // Alterar senha se fornecida
      if (novaSenha) {
        const senhaResponse = await fetch('http://localhost:5000/api/usuarios/alterar-senha', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            id: user.id,
            senhaAtual: senhaAtual,
            novaSenha: novaSenha 
          }),
        });

        if (!senhaResponse.ok) {
          const errorText = await senhaResponse.text();
          throw new Error(errorText || 'Erro ao alterar senha');
        }
      }

      setUser({ ...user, nome, email });
      alert('Perfil atualizado com sucesso!');
      setSenhaAtual('');
      setNovaSenha('');
      setConfirmarSenha('');
    } catch (error) {
      alert('Erro: ' + error.message);
    }
  };

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
      
      <div style={{ maxWidth: '600px', margin: '0 auto', paddingTop: '60px' }}>
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
          <h2 style={{ textAlign: 'center', marginBottom: '30px', color: theme.primary }}>
            Meu Perfil
          </h2>
          
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', color: theme.text }}>Nome:</label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: `1px solid ${theme.border}`,
                  borderRadius: '5px',
                  backgroundColor: isDark ? 'rgba(69, 75, 96, 0.8)' : 'rgba(247, 182, 186, 0.3)',
                  color: theme.text
                }}
                required
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', color: theme.text }}>Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: `1px solid ${theme.border}`,
                  borderRadius: '5px',
                  backgroundColor: isDark ? 'rgba(69, 75, 96, 0.8)' : 'rgba(247, 182, 186, 0.3)',
                  color: theme.text
                }}
                required
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', color: theme.text }}>Telefone:</label>
              <input
                type="tel"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                placeholder="(11) 99999-9999"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: `1px solid ${theme.border}`,
                  borderRadius: '5px',
                  backgroundColor: isDark ? 'rgba(69, 75, 96, 0.8)' : 'rgba(247, 182, 186, 0.3)',
                  color: theme.text
                }}
              />
            </div>

            <div style={{ marginBottom: '30px' }}>
              <label style={{ display: 'block', marginBottom: '5px', color: theme.text }}>Endereço:</label>
              <textarea
                value={endereco}
                onChange={(e) => setEndereco(e.target.value)}
                placeholder="Rua, número, bairro, cidade"
                rows="3"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: `1px solid ${theme.border}`,
                  borderRadius: '5px',
                  backgroundColor: isDark ? 'rgba(69, 75, 96, 0.8)' : 'rgba(247, 182, 186, 0.3)',
                  color: theme.text,
                  resize: 'vertical'
                }}
              />
            </div>

            <hr style={{ border: `1px solid ${theme.border}`, margin: '30px 0' }} />

            <h3 style={{ color: theme.primary, marginBottom: '20px' }}>Alterar Senha</h3>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', color: theme.text }}>Senha Atual:</label>
              <input
                type="password"
                value={senhaAtual}
                onChange={(e) => setSenhaAtual(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: `1px solid ${theme.border}`,
                  borderRadius: '5px',
                  backgroundColor: isDark ? 'rgba(69, 75, 96, 0.8)' : 'rgba(247, 182, 186, 0.3)',
                  color: theme.text
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', color: theme.text }}>Nova Senha:</label>
              <input
                type="password"
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: `1px solid ${theme.border}`,
                  borderRadius: '5px',
                  backgroundColor: isDark ? 'rgba(69, 75, 96, 0.8)' : 'rgba(247, 182, 186, 0.3)',
                  color: theme.text
                }}
              />
            </div>

            <div style={{ marginBottom: '30px' }}>
              <label style={{ display: 'block', marginBottom: '5px', color: theme.text }}>Confirmar Nova Senha:</label>
              <input
                type="password"
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: `1px solid ${theme.border}`,
                  borderRadius: '5px',
                  backgroundColor: isDark ? 'rgba(69, 75, 96, 0.8)' : 'rgba(247, 182, 186, 0.3)',
                  color: theme.text
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
                fontSize: '16px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Salvar Alterações
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Perfil;