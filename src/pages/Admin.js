import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useNotification } from '../hooks/useNotification';
import { useConfirm } from '../hooks/useConfirm';
import Notification from '../components/Notification';
import ConfirmDialog from '../components/ConfirmDialog';

function Admin() {
  const { theme, isDark, toggleTheme } = useTheme();
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, ativos: 0, inativos: 0, admins: 0 });
  const { notifications, showSuccess, showError, removeNotification } = useNotification();
  const { confirmState, showConfirm, handleConfirm, handleCancel } = useConfirm();

  useEffect(() => {
    carregarUsuarios();
  }, []);

  const carregarUsuarios = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/usuarios');
      if (response.ok) {
        const data = await response.json();
        setUsuarios(data);
        
        // Calcular estatísticas
        const total = data.length;
        const ativos = data.filter(u => u.status === 'ativo').length;
        const inativos = data.filter(u => u.status === 'inativo').length;
        const admins = data.filter(u => u.isAdmin).length;
        setStats({ total, ativos, inativos, admins });
      } else {
        showError('Não foi possível carregar a lista de usuários.');
      }
    } catch (error) {
      showError('Erro de conexão. Verifique sua internet e tente novamente.');
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
        showSuccess('Status do usuário alterado com sucesso!');
        carregarUsuarios();
      } else {
        showError('Não foi possível alterar o status do usuário.');
      }
    } catch (error) {
      showError('Erro de conexão. Verifique sua internet e tente novamente.');
    }
  };

  const removerUsuario = async (id) => {
    showConfirm(
      'Remover Usuário',
      'Esta ação não pode ser desfeita. Tem certeza que deseja remover este usuário?',
      async () => {
        try {
          const response = await fetch(`http://localhost:5000/api/usuarios/${id}`, {
            method: 'DELETE',
          });
          if (response.ok) {
            showSuccess('Usuário removido com sucesso!');
            carregarUsuarios();
          } else {
            showError('Não foi possível remover o usuário.');
          }
        } catch (error) {
          showError('Erro de conexão. Verifique sua internet e tente novamente.');
        }
      },
      'Remover',
      'Cancelar'
    );
  };

  const toggleAdmin = async (id, isAdmin) => {
    const acao = isAdmin ? 'remover privilégios de administrador' : 'promover a administrador';
    showConfirm(
      'Alterar Privilégios',
      `Tem certeza que deseja ${acao} deste usuário?`,
      async () => {
        try {
          const response = await fetch(`http://localhost:5000/api/usuarios/${id}/admin`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ isAdmin: !isAdmin }),
          });
          
          if (response.ok) {
            showSuccess('Privilégios de administrador alterados com sucesso!');
            carregarUsuarios();
          } else {
            showError('Não foi possível alterar os privilégios do usuário.');
          }
        } catch (error) {
          showError('Erro de conexão. Verifique sua internet e tente novamente.');
        }
      },
      'Confirmar',
      'Cancelar'
    );
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: theme.background, padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: theme.text, fontSize: '18px' }}>Carregando usuários...</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #ffc0cb 0%, #f8d7da 100%)' }}>
      {/* Header */}
      <div style={{
        backgroundColor: theme.cardBackground,
        padding: '20px 40px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        borderBottom: `1px solid ${theme.border}`
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <Link to="/home" style={{ color: theme.primary, textDecoration: 'none', fontSize: '16px' }}>← Voltar</Link>
            <h1 style={{ color: theme.primary, margin: 0, fontSize: '28px' }}>⚙️ Painel Administrativo</h1>
          </div>
          <button 
            onClick={toggleTheme}
            style={{
              padding: '12px',
              backgroundColor: theme.background,
              color: theme.text,
              border: `1px solid ${theme.border}`,
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            {isDark ? '☀️' : '🌙'}
          </button>
        </div>
      </div>

      <div style={{ padding: '40px', maxWidth: '1400px', margin: '0 auto' }}>
        {/* Dashboard Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '40px' }}>
          <div style={{
            backgroundColor: theme.cardBackground,
            padding: '25px',
            borderRadius: '12px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
            border: `1px solid ${theme.border}`,
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '32px', marginBottom: '10px' }}>👥</div>
            <h3 style={{ color: theme.primary, margin: '0 0 5px 0', fontSize: '24px' }}>{stats.total}</h3>
            <p style={{ color: theme.textSecondary, margin: 0 }}>Total de Usuários</p>
          </div>
          
          <div style={{
            backgroundColor: theme.cardBackground,
            padding: '25px',
            borderRadius: '12px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
            border: `1px solid ${theme.border}`,
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '32px', marginBottom: '10px' }}>✅</div>
            <h3 style={{ color: theme.success, margin: '0 0 5px 0', fontSize: '24px' }}>{stats.ativos}</h3>
            <p style={{ color: theme.textSecondary, margin: 0 }}>Usuários Ativos</p>
          </div>
          
          <div style={{
            backgroundColor: theme.cardBackground,
            padding: '25px',
            borderRadius: '12px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
            border: `1px solid ${theme.border}`,
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '32px', marginBottom: '10px' }}>❌</div>
            <h3 style={{ color: theme.danger, margin: '0 0 5px 0', fontSize: '24px' }}>{stats.inativos}</h3>
            <p style={{ color: theme.textSecondary, margin: 0 }}>Usuários Inativos</p>
          </div>
          
          <div style={{
            backgroundColor: theme.cardBackground,
            padding: '25px',
            borderRadius: '12px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
            border: `1px solid ${theme.border}`,
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '32px', marginBottom: '10px' }}>👑</div>
            <h3 style={{ color: theme.primary, margin: '0 0 5px 0', fontSize: '24px' }}>{stats.admins}</h3>
            <p style={{ color: theme.textSecondary, margin: 0 }}>Administradores</p>
          </div>
        </div>

        {/* Tabela de Usuários */}
        <div style={{
          backgroundColor: theme.cardBackground,
          borderRadius: '12px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
          border: `1px solid ${theme.border}`,
          overflow: 'hidden'
        }}>
          <div style={{ padding: '25px 30px', borderBottom: `1px solid ${theme.border}` }}>
            <h2 style={{ color: theme.text, margin: 0, fontSize: '22px' }}>📋 Gerenciamento de Usuários</h2>
          </div>
          <div style={{ padding: '0 30px 30px 30px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: isDark ? 'rgba(69, 75, 96, 0.5)' : 'rgba(247, 182, 186, 0.2)' }}>
                  <th style={{ padding: '15px', textAlign: 'left', color: theme.text, fontWeight: '600', fontSize: '14px' }}>👤 USUÁRIO</th>
                  <th style={{ padding: '15px', textAlign: 'left', color: theme.text, fontWeight: '600', fontSize: '14px' }}>📧 EMAIL</th>
                  <th style={{ padding: '15px', textAlign: 'center', color: theme.text, fontWeight: '600', fontSize: '14px' }}>📊 STATUS</th>
                  <th style={{ padding: '15px', textAlign: 'center', color: theme.text, fontWeight: '600', fontSize: '14px' }}>👑 ADMIN</th>
                  <th style={{ padding: '15px', textAlign: 'center', color: theme.text, fontWeight: '600', fontSize: '14px' }}>⚡ AÇÕES</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((usuario, index) => (
                  <tr key={usuario.id} style={{ 
                    borderBottom: `1px solid ${theme.border}`,
                    backgroundColor: index % 2 === 0 ? 'transparent' : (isDark ? 'rgba(69, 75, 96, 0.2)' : 'rgba(247, 182, 186, 0.1)')
                  }}>
                    <td style={{ padding: '15px', color: theme.text, fontSize: '15px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ 
                          width: '35px', 
                          height: '35px', 
                          borderRadius: '50%', 
                          backgroundColor: theme.primary, 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          color: 'white',
                          fontSize: '14px',
                          fontWeight: 'bold'
                        }}>
                          {usuario.nome.charAt(0).toUpperCase()}
                        </div>
                        {usuario.nome}
                      </div>
                    </td>
                    <td style={{ padding: '15px', color: theme.textSecondary, fontSize: '14px' }}>{usuario.email}</td>
                    <td style={{ padding: '15px', textAlign: 'center' }}>
                      <span style={{ 
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        backgroundColor: usuario.status === 'ativo' ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)',
                        color: usuario.status === 'ativo' ? '#4CAF50' : '#F44336',
                        border: `1px solid ${usuario.status === 'ativo' ? '#4CAF50' : '#F44336'}`
                      }}>
                        {usuario.status === 'ativo' ? '✅ ATIVO' : '❌ INATIVO'}
                      </span>
                    </td>
                    <td style={{ padding: '15px', textAlign: 'center' }}>
                      {usuario.isAdmin ? (
                        <span style={{ fontSize: '18px' }}>👑</span>
                      ) : (
                        <span style={{ color: theme.textSecondary, fontSize: '14px' }}>—</span>
                      )}
                    </td>
                    <td style={{ padding: '15px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <button 
                          onClick={() => toggleStatus(usuario.id)}
                          style={{ 
                            padding: '6px 12px',
                            backgroundColor: usuario.status === 'ativo' ? '#FF9800' : '#4CAF50',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            fontSize: '11px',
                            fontWeight: '600',
                            transition: 'all 0.2s'
                          }}
                          onMouseOver={(e) => e.target.style.opacity = '0.8'}
                          onMouseOut={(e) => e.target.style.opacity = '1'}
                        >
                          {usuario.status === 'ativo' ? '⏸️' : '▶️'}
                        </button>
                        <button 
                          onClick={() => toggleAdmin(usuario.id, usuario.isAdmin)}
                          style={{ 
                            padding: '6px 12px',
                            backgroundColor: usuario.isAdmin ? '#9C27B0' : '#2196F3',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            fontSize: '11px',
                            fontWeight: '600',
                            transition: 'all 0.2s'
                          }}
                          onMouseOver={(e) => e.target.style.opacity = '0.8'}
                          onMouseOut={(e) => e.target.style.opacity = '1'}
                          title={usuario.isAdmin ? 'Remover Admin' : 'Promover Admin'}
                        >
                          {usuario.isAdmin ? '👑❌' : '👑➕'}
                        </button>
                        <button 
                          onClick={() => removerUsuario(usuario.id)}
                          style={{ 
                            padding: '6px 12px',
                            backgroundColor: '#F44336',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            fontSize: '11px',
                            fontWeight: '600',
                            transition: 'all 0.2s'
                          }}
                          onMouseOver={(e) => e.target.style.opacity = '0.8'}
                          onMouseOut={(e) => e.target.style.opacity = '1'}
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Notificações */}
      {notifications.map(notification => (
        <Notification
          key={notification.id}
          message={notification.message}
          type={notification.type}
          duration={notification.duration}
          onClose={() => removeNotification(notification.id)}
        />
      ))}

      {/* Diálogo de Confirmação */}
      <ConfirmDialog
        isOpen={confirmState.isOpen}
        title={confirmState.title}
        message={confirmState.message}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        confirmText={confirmState.confirmText}
        cancelText={confirmState.cancelText}
      />
    </div>
  );
}

export default Admin;