import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

function Admin() {
  const { theme, isDark, toggleTheme } = useTheme();
  const [usuarios, setUsuarios] = useState([
    { id: 1, nome: 'João Silva', email: 'joao@email.com', status: 'ativo' },
    { id: 2, nome: 'Maria Santos', email: 'maria@email.com', status: 'inativo' }
  ]);

  const toggleStatus = (id) => {
    setUsuarios(usuarios.map(user => 
      user.id === id 
        ? { ...user, status: user.status === 'ativo' ? 'inativo' : 'ativo' }
        : user
    ));
  };

  const removerUsuario = (id) => {
    setUsuarios(usuarios.filter(user => user.id !== id));
  };

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
            <tr style={{ backgroundColor: '#f5f5f5' }}>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Nome</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Email</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Status</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map(usuario => (
              <tr key={usuario.id}>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{usuario.nome}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{usuario.email}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                  <span style={{ 
                    color: usuario.status === 'ativo' ? 'green' : 'red',
                    fontWeight: 'bold'
                  }}>
                    {usuario.status}
                  </span>
                </td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                  <button 
                    onClick={() => toggleStatus(usuario.id)}
                    style={{ 
                      marginRight: '10px', 
                      padding: '5px 10px',
                      backgroundColor: '#ff69b4',
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
                      backgroundColor: '#dc3545',
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
  );
}

export default Admin;