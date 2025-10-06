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
              Meu Perfil
            </h1>
            <p style={{ 
              color: theme.textSecondary, 
              fontSize: '16px',
              margin: 0
            }}>
              Gerencie suas informações pessoais e configurações
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
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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

            <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth < 768 ? '1fr' : '1fr 1fr', gap: '20px', marginBottom: '25px' }}>
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  color: theme.text,
                  fontWeight: '600',
                  fontSize: '14px'
                }}>Telefone</label>
                <input
                  type="tel"
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
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

              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  color: theme.text,
                  fontWeight: '600',
                  fontSize: '14px'
                }}>Endereço</label>
                <input
                  type="text"
                  value={endereco}
                  onChange={(e) => setEndereco(e.target.value)}
                  placeholder="Rua, número, bairro, cidade"
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
            </div>

            <div style={{ 
              marginTop: '40px',
              marginBottom: '30px', 
              padding: '25px', 
              background: isDark ? 'rgba(173, 115, 120, 0.2)' : 'rgba(252, 192, 203, 0.2)', 
              borderRadius: '15px',
              border: `1px solid ${isDark ? 'rgba(173, 115, 120, 0.3)' : 'rgba(252, 192, 203, 0.3)'}`
            }}>
              <h3 style={{ 
                color: theme.primary, 
                marginBottom: '20px',
                fontSize: '18px',
                fontWeight: '600'
              }}>
                Alterar Senha
              </h3>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  color: theme.text,
                  fontWeight: '600',
                  fontSize: '14px'
                }}>Senha Atual</label>
                <input
                  type="password"
                  value={senhaAtual}
                  onChange={(e) => setSenhaAtual(e.target.value)}
                  placeholder="Digite sua senha atual"
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

              <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth < 768 ? '1fr' : '1fr 1fr', gap: '20px' }}>
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '8px', 
                    color: theme.text,
                    fontWeight: '600',
                    fontSize: '14px'
                  }}>Nova Senha</label>
                  <input
                    type="password"
                    value={novaSenha}
                    onChange={(e) => setNovaSenha(e.target.value)}
                    placeholder="Digite a nova senha"
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

                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '8px', 
                    color: theme.text,
                    fontWeight: '600',
                    fontSize: '14px'
                  }}>Confirmar Nova Senha</label>
                  <input
                    type="password"
                    value={confirmarSenha}
                    onChange={(e) => setConfirmarSenha(e.target.value)}
                    placeholder="Confirme a nova senha"
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
              </div>
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
              Salvar Alterações
            </button>
          </form>

          <div style={{ 
            marginTop: '30px', 
            padding: '25px', 
            background: isDark ? 'rgba(173, 115, 120, 0.2)' : 'rgba(252, 192, 203, 0.2)', 
            borderRadius: '15px',
            border: `1px solid ${isDark ? 'rgba(173, 115, 120, 0.3)' : 'rgba(252, 192, 203, 0.3)'}`
          }}>
            <h3 style={{ 
              color: theme.primary, 
              marginBottom: '15px',
              fontSize: '18px',
              fontWeight: '600'
            }}>
              Dicas de Segurança
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: window.innerWidth < 768 ? 'flex-start' : 'center', gap: '12px' }}>
                <span style={{ 
                  backgroundColor: theme.primary, 
                  color: 'white', 
                  borderRadius: '50%', 
                  width: '24px', 
                  height: '24px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  fontSize: '12px', 
                  fontWeight: 'bold',
                  flexShrink: 0
                }}>1</span>
                <p style={{ margin: 0, color: theme.text, fontSize: '14px', lineHeight: '1.4' }}>Use uma senha forte com pelo menos 8 caracteres</p>
              </div>
              <div style={{ display: 'flex', alignItems: window.innerWidth < 768 ? 'flex-start' : 'center', gap: '12px' }}>
                <span style={{ 
                  backgroundColor: theme.primary, 
                  color: 'white', 
                  borderRadius: '50%', 
                  width: '24px', 
                  height: '24px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  fontSize: '12px', 
                  fontWeight: 'bold',
                  flexShrink: 0
                }}>2</span>
                <p style={{ margin: 0, color: theme.text, fontSize: '14px', lineHeight: '1.4' }}>Mantenha suas informações sempre atualizadas</p>
              </div>
              <div style={{ display: 'flex', alignItems: window.innerWidth < 768 ? 'flex-start' : 'center', gap: '12px' }}>
                <span style={{ 
                  backgroundColor: theme.primary, 
                  color: 'white', 
                  borderRadius: '50%', 
                  width: '24px', 
                  height: '24px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  fontSize: '12px', 
                  fontWeight: 'bold',
                  flexShrink: 0
                }}>3</span>
                <p style={{ margin: 0, color: theme.text, fontSize: '14px', lineHeight: '1.4' }}>Nunca compartilhe sua senha com outras pessoas</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Perfil;