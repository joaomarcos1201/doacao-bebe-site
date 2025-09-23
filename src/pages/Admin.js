import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

function Admin() {
  const { theme, isDark, toggleTheme } = useTheme();
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarUsuarios();
  }, []);

  const carregarUsuarios = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/usuarios');
      if (response.ok) {
        const data = await response.json();
        setUsuarios(data);
      } else {
        alert('Erro ao carregar usuários');
      }
    } catch (error) {
      alert('Erro de conexão com o servidor');
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/usuarios/${id}/status`, {
        method: 'PUT',
      });
      if (response.ok) {
        carregarUsuarios();
      } else {
        alert('Erro ao alterar status do usuário');
      }
    } catch (error) {
      alert('Erro de conexão com o servidor');
    }
  };

  const removerUsuario = async (id) => {
    if (window.confirm('Tem certeza que deseja remover este usuário?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/usuarios/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          carregarUsuarios();
        } else {
          alert('Erro ao remover usuário');
        }
      } catch (error) {
        alert('Erro de conexão com o servidor');
      }
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: theme.background, padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: theme.text, fontSize: '18px' }}>Carregando usuários...</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: theme.background, padding: '20px' }}>
      <div style={{ position: 'absolute', top: '20px', right: '20px' }}>
        <button 
          onClick={toggleTheme}
          style={{
            padding: '10px',
            backgroundColor: theme.cardBackground,
            color: theme.text,
            border: `1px solid ${theme.border}`,
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          {isDark ? '☀️' : '🌙'}
        </button>
      </div>
      
      <div style={{ maxWidth: '1000px', margin: '0 auto', paddingTop: '60px' }}>
        <div style={{ marginBottom: '20px' }}>
          <Link to="/home" style={{ color: theme.primary, textDecoration: 'none' }}>← Voltar ao Início</Link>
        </div>
        
        <div style={{
          backgroundColor: theme.cardBackground,
          padding: '30px',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          border: `1px solid ${theme.border}`
        }}>
          <h2 style={{ textAlign: 'center', marginBottom: '30px', color: theme.primary }}>
            Painel Administrativo
          </h2>
      
          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ color: theme.text, marginBottom: '20px' }}>Controle de Usuários</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: theme.background, borderRadius: '8px', overflow: 'hidden' }}>
              <thead>
                <tr style={{ backgroundColor: theme.border }}>
                  <th style={{ padding: '10px', border: `1px solid ${theme.border}`, color: theme.text }}>Nome</th>
                  <th style={{ padding: '10px', border: `1px solid ${theme.border}`, color: theme.text }}>Email</th>
                  <th style={{ padding: '10px', border: `1px solid ${theme.border}`, color: theme.text }}>Status</th>
                  <th style={{ padding: '10px', border: `1px solid ${theme.border}`, color: theme.text }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map(usuario => (
                  <tr key={usuario.id}>
                    <td style={{ padding: '10px', border: `1px solid ${theme.border}`, color: theme.text }}>{usuario.nome}</td>
                    <td style={{ padding: '10px', border: `1px solid ${theme.border}`, color: theme.text }}>{usuario.email}</td>
                    <td style={{ padding: '10px', border: `1px solid ${theme.border}` }}>
                      <span style={{ 
                        color: usuario.status === 'ativo' ? theme.success : theme.danger,
                        fontWeight: 'bold'
                      }}>
                        {usuario.status}
                      </span>
                    </td>
                    <td style={{ padding: '10px', border: `1px solid ${theme.border}` }}>
                      <button 
                        onClick={() => toggleStatus(usuario.id)}
                        style={{ 
                          marginRight: '10px', 
                          padding: '5px 10px',
                          backgroundColor: theme.primary,
                          color: 'white',
                          border: 'none',
                          borderRadius: '3px',
                          cursor: 'pointer'
                        }}
                      >
                        {usuario.status === 'ativo' ? 'Desativar' : 'Ativar'}
                      </button>
                      <button 
                        onClick={() => removerUsuario(usuario.id)}
                        style={{ 
                          padding: '5px 10px',
                          backgroundColor: theme.danger,
                          color: 'white',
                          border: 'none',
                          borderRadius: '3px',
                          cursor: 'pointer'
                        }}
                      >
                        Remover
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Admin;