import { API_URL } from '../config/api';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

function RecuperarSenha() {
  const { theme, isDark, toggleTheme } = useTheme();
  const [tipoRecuperacao, setTipoRecuperacao] = useState('email');
  const [contato, setContato] = useState('');
  const [enviado, setEnviado] = useState(false);
  const [loading, setLoading] = useState(false);
  const [etapa, setEtapa] = useState('enviar'); // 'enviar', 'verificar', 'redefinir'
  const [codigo, setCodigo] = useState('');
  const [codigoEnviado, setCodigoEnviado] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  const handleEnviarCodigo = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('${API_URL}/api/auth/enviar-codigo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: contato }),
      });

      if (response.ok) {
        alert('✅ Além do Positivo\n\nCódigo enviado para seu email! Verifique sua caixa de entrada.');
        setEtapa('verificar');
      } else {
        const errorText = await response.text();
        alert('❌ Além do Positivo\n\n' + (errorText || 'Não foi possível enviar o código. Verifique se o email está correto.'));
      }
    } catch (error) {
      alert('❌ Além do Positivo\n\nErro de conexão. Verifique sua internet e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerificarCodigo = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('${API_URL}/api/auth/verificar-codigo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: contato, codigo: codigo }),
      });

      if (response.ok) {
        setEtapa('redefinir');
      } else {
        const errorText = await response.text();
        alert('❌ Além do Positivo\n\n' + (errorText || 'Código incorreto!'));
      }
    } catch (error) {
      alert('❌ Além do Positivo\n\nErro de conexão. Verifique sua internet e tente novamente.');
    }
  };

  const handleRedefinirSenha = async (e) => {
    alert('TESTE: Função handleRedefinirSenha foi chamada!');
    e.preventDefault();
    if (novaSenha !== confirmarSenha) {
      alert('❌ Além do Positivo\n\nAs senhas não coincidem!');
      return;
    }
    if (novaSenha.length < 6) {
      alert('❌ Além do Positivo\n\nA senha deve ter pelo menos 6 caracteres!');
      return;
    }

    alert('DEBUG: Iniciando redefinição para email: ' + contato);

    try {
      const requestData = { 
        email: contato, 
        novaSenha: novaSenha 
      };
      alert('DEBUG: Enviando dados para API...');

      const response = await fetch('${API_URL}/api/auth/redefinir-senha', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      alert('DEBUG: Status da resposta: ' + response.status);

      if (response.ok) {
        const successData = await response.text();
        alert('DEBUG: Sucesso - ' + successData);
        alert('✅ Além do Positivo\n\nSenha redefinida com sucesso!');
        window.location.href = '/login';
      } else {
        const errorData = await response.text();
        alert('DEBUG: Erro da API - ' + errorData);
        alert('❌ Além do Positivo\n\n' + (errorData || 'Erro ao redefinir senha'));
      }
    } catch (error) {
      alert('DEBUG: Erro de conexão - ' + error.message);
      alert('❌ Além do Positivo\n\nErro de conexão com o servidor: ' + error.message);
    }
  };

  if (etapa === 'redefinir') {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #ffc0cb 0%, #f8d7da 100%)',
        padding: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          backgroundColor: isDark ? 'rgba(105, 72, 75, 0.9)' : 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(10px)',
          padding: '40px',
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          width: '100%',
          maxWidth: '450px',
          color: theme.text,
          border: `1px solid ${isDark ? 'rgba(173, 115, 120, 0.3)' : 'rgba(179, 116, 122, 0.3)'}`
        }}>
          <h2 style={{ textAlign: 'center', marginBottom: '30px', color: theme.primary }}>
            Nova Senha
          </h2>

          <form onSubmit={handleRedefinirSenha}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', color: theme.text }}>Nova Senha:</label>
              <input
                type="password"
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
                placeholder="Digite sua nova senha"
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
              <label style={{ display: 'block', marginBottom: '5px', color: theme.text }}>Confirmar Senha:</label>
              <input
                type="password"
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                placeholder="Confirme sua nova senha"
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

            <button
              type="submit"
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: theme.primary,
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                fontSize: '16px',
                cursor: 'pointer'
              }}
            >
              Redefinir Senha
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (etapa === 'verificar') {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #ffc0cb 0%, #f8d7da 100%)',
        padding: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          backgroundColor: isDark ? 'rgba(105, 72, 75, 0.9)' : 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(10px)',
          padding: '40px',
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          width: '100%',
          maxWidth: '450px',
          color: theme.text,
          border: `1px solid ${isDark ? 'rgba(173, 115, 120, 0.3)' : 'rgba(179, 116, 122, 0.3)'}`
        }}>
          <h2 style={{ textAlign: 'center', marginBottom: '30px', color: theme.primary }}>
            Verificar Código
          </h2>

          <p style={{ textAlign: 'center', marginBottom: '25px', color: theme.textSecondary }}>
            Digite o código de 6 dígitos enviado para {contato}
          </p>

          <form onSubmit={handleVerificarCodigo}>
            <div style={{ marginBottom: '20px' }}>
              <input
                type="text"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                style={{
                  width: '100%',
                  padding: '15px',
                  border: `2px solid ${theme.border}`,
                  borderRadius: '8px',
                  backgroundColor: isDark ? 'rgba(69, 75, 96, 0.8)' : 'rgba(247, 182, 186, 0.3)',
                  color: theme.text,
                  fontSize: '24px',
                  textAlign: 'center',
                  letterSpacing: '8px'
                }}
                maxLength="6"
                required
              />
            </div>

            <button
              type="submit"
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: theme.primary,
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                fontSize: '16px',
                cursor: 'pointer',
                marginBottom: '15px'
              }}
            >
              Verificar Código
            </button>
          </form>

          <div style={{ textAlign: 'center' }}>
            <button
              onClick={() => setEtapa('enviar')}
              style={{
                background: 'none',
                border: 'none',
                color: theme.primary,
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              Reenviar código
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #ffc0cb 0%, #f8d7da 100%)',
      padding: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
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

      <div style={{
        backgroundColor: isDark ? 'rgba(105, 72, 75, 0.9)' : 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(10px)',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
        width: '100%',
        maxWidth: '450px',
        color: theme.text,
        border: `1px solid ${isDark ? 'rgba(173, 115, 120, 0.3)' : 'rgba(179, 116, 122, 0.3)'}`
      }}>
        <div style={{ marginBottom: '20px' }}>
          <Link to="/login" style={{ color: theme.primary, textDecoration: 'none' }}>← Voltar ao Login</Link>
        </div>

        <h2 style={{ textAlign: 'center', marginBottom: '30px', color: theme.primary }}>
          Recuperar Senha
        </h2>



        <form onSubmit={handleEnviarCodigo}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: theme.text }}>
              Email:
            </label>
            <input
              type="email"
              value={contato}
              onChange={(e) => setContato(e.target.value)}
              placeholder="seu@email.com"
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

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: loading ? theme.textSecondary : theme.primary,
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              fontSize: '16px',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginBottom: '15px'
            }}
          >
            {loading ? 'Enviando...' : 'Enviar Código'}
          </button>
        </form>

        <div style={{
          marginTop: '20px',
          padding: '15px',
          backgroundColor: isDark ? 'rgba(69, 75, 96, 0.5)' : 'rgba(247, 182, 186, 0.3)',
          borderRadius: '8px',
          fontSize: '14px',
          color: theme.textSecondary
        }}>
          <strong>Como funciona:</strong><br />
          Enviaremos um código de 6 dígitos para seu email. Digite o código na próxima tela para redefinir sua senha.
        </div>
      </div>
    </div>
  );
}

export default RecuperarSenha;