import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useNotification } from '../hooks/useNotification';
import { useConfirm } from '../hooks/useConfirm';
import { useProdutos } from '../context/ProdutosContext';
import Notification from '../components/Notification';
import ConfirmDialog from '../components/ConfirmDialog';

function Admin() {
  const navigate = useNavigate();
  const { theme, isDark, toggleTheme } = useTheme();
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, ativos: 0, inativos: 0, admins: 0 });
  const [abaSelecionada, setAbaSelecionada] = useState('usuarios');
  const [mensagens, setMensagens] = useState([]);
  const [menuAberto, setMenuAberto] = useState(null);
  const { produtos, aprovarProduto, rejeitarProduto, removerProduto } = useProdutos();
  const { notifications, showSuccess, showError, removeNotification } = useNotification();
  const { confirmState, showConfirm, handleConfirm, handleCancel } = useConfirm();
  
  const produtosPendentes = produtos.filter(p => p.status === 'pendente');
  const produtosAprovados = produtos.filter(p => p.status === 'aprovado');

  useEffect(() => {
    carregarUsuarios();
    carregarMensagens();
  }, []);

  // Fechar menu ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuAberto && !event.target.closest('td')) {
        setMenuAberto(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [menuAberto]);

  const carregarMensagens = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/contato');
      if (response.ok) {
        const data = await response.json();
        setMensagens(data);
      }
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error);
    }
  };



  const carregarUsuarios = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/usuarios');
      if (response.ok) {
        const data = await response.json();
        console.log('DEBUG - Dados dos usuários:', data);
        console.log('DEBUG - Primeiro usuário:', data[0]);
        setUsuarios(data);
        
        // Calcular estatísticas
        const total = data.length;
        const ativos = data.filter(u => u.statusUsuario === 'ATIVO' || u.statusUsuario === null).length;
        const inativos = data.filter(u => u.statusUsuario === 'INATIVO').length;
        const admins = data.filter(u => u.nivelAcesso === 'ADMIN').length;
        console.log('DEBUG - Stats:', { total, ativos, inativos, admins });
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
      const response = await fetch(`http://localhost:8080/api/usuarios/${id}/status`, {
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
          console.log('DEBUG - Tentando remover usuário ID:', id);
          const response = await fetch(`http://localhost:8080/api/usuarios/${id}`, {
            method: 'DELETE',
          });
          console.log('DEBUG - Status da resposta:', response.status);
          
          if (response.ok) {
            showSuccess('Usuário removido com sucesso!');
            carregarUsuarios();
          } else {
            const errorText = await response.text();
            console.log('DEBUG - Erro do servidor:', errorText);
            showError(`Não foi possível remover o usuário: ${errorText}`);
          }
        } catch (error) {
          console.error('DEBUG - Erro de conexão:', error);
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
          const response = await fetch(`http://localhost:8080/api/usuarios/${id}/admin`, {
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
        padding: window.innerWidth < 768 ? '15px 20px' : '20px 40px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        borderBottom: `1px solid ${theme.border}`
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1400px', margin: '0 auto', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <Link to="/home" style={{ color: theme.primary, textDecoration: 'none', fontSize: '16px' }}>← Voltar</Link>
            <h1 style={{ color: theme.primary, margin: 0, fontSize: window.innerWidth < 768 ? '20px' : '28px' }}>Painel Administrativo</h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
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
            <button 
              onClick={() => {
                localStorage.removeItem('user');
                localStorage.removeItem('token');
                navigate('/login');
              }}
              style={{
                padding: '12px 20px',
                backgroundColor: theme.danger,
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              Sair
            </button>
          </div>
        </div>
      </div>

      <div style={{ padding: window.innerWidth < 768 ? '20px' : '40px', maxWidth: '1400px', margin: '0 auto' }}>
        {/* Abas */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setAbaSelecionada('usuarios')}
            style={{
              padding: '12px 24px',
              backgroundColor: abaSelecionada === 'usuarios' ? theme.primary : theme.background,
              color: abaSelecionada === 'usuarios' ? 'white' : theme.text,
              border: `1px solid ${theme.border}`,
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Usuários
          </button>
          <button
            onClick={() => setAbaSelecionada('produtos')}
            style={{
              padding: '12px 24px',
              backgroundColor: abaSelecionada === 'produtos' ? theme.primary : theme.background,
              color: abaSelecionada === 'produtos' ? 'white' : theme.text,
              border: `1px solid ${theme.border}`,
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Produtos ({produtosPendentes.length} pendentes)
          </button>
          <button
            onClick={() => setAbaSelecionada('mensagens')}
            style={{
              padding: '12px 24px',
              backgroundColor: abaSelecionada === 'mensagens' ? theme.primary : theme.background,
              color: abaSelecionada === 'mensagens' ? 'white' : theme.text,
              border: `1px solid ${theme.border}`,
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Mensagens ({mensagens.length})
          </button>
        </div>

        {abaSelecionada === 'usuarios' && (
        <>
        {/* Dashboard Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth < 768 ? '1fr' : 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '40px' }}>
          <div style={{
            backgroundColor: theme.cardBackground,
            padding: '25px',
            borderRadius: '12px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
            border: `1px solid ${theme.border}`,
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '32px', marginBottom: '10px', color: theme.primary }}>▣</div>
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
            <div style={{ fontSize: '32px', marginBottom: '10px', color: theme.success }}>●</div>
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
            <div style={{ fontSize: '32px', marginBottom: '10px', color: theme.danger }}>●</div>
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
            <div style={{ fontSize: '32px', marginBottom: '10px', color: theme.primary }}>★</div>
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
            <h2 style={{ color: theme.text, margin: 0, fontSize: '22px' }}>Gerenciamento de Usuários</h2>
          </div>
          <div style={{ padding: '0 30px 30px 30px' }}>
            <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
              <thead>
                <tr style={{ backgroundColor: isDark ? 'rgba(69, 75, 96, 0.5)' : 'rgba(247, 182, 186, 0.2)' }}>
                  <th style={{ padding: '15px', textAlign: 'left', color: theme.text, fontWeight: '600', fontSize: '14px' }}>USUÁRIO</th>
                  <th style={{ padding: '15px', textAlign: 'left', color: theme.text, fontWeight: '600', fontSize: '14px' }}>EMAIL</th>
                  <th style={{ padding: '15px', textAlign: 'center', color: theme.text, fontWeight: '600', fontSize: '14px' }}>STATUS</th>
                  <th style={{ padding: '15px', textAlign: 'center', color: theme.text, fontWeight: '600', fontSize: '14px' }}>ADMIN</th>
                  <th style={{ padding: '15px', textAlign: 'center', color: theme.text, fontWeight: '600', fontSize: '14px' }}>AÇÕES</th>
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
                        backgroundColor: (usuario.statusUsuario === 'ATIVO' || usuario.statusUsuario === null) ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)',
                        color: (usuario.statusUsuario === 'ATIVO' || usuario.statusUsuario === null) ? '#4CAF50' : '#F44336',
                        border: `1px solid ${(usuario.statusUsuario === 'ATIVO' || usuario.statusUsuario === null) ? '#4CAF50' : '#F44336'}`
                      }}>
                        {(usuario.statusUsuario === 'ATIVO' || usuario.statusUsuario === null) ? 'ATIVO' : 'INATIVO'}
                      </span>
                    </td>
                    <td style={{ padding: '15px', textAlign: 'center' }}>
                      {usuario.nivelAcesso === 'ADMIN' ? (
                        <span style={{ color: theme.primary, fontSize: '16px', fontWeight: 'bold' }}>★</span>
                      ) : (
                        <span style={{ color: theme.textSecondary, fontSize: '14px' }}>—</span>
                      )}
                    </td>
                    <td style={{ padding: '15px', textAlign: 'center', position: 'relative' }}>
                      <button
                        onClick={() => setMenuAberto(menuAberto === usuario.id ? null : usuario.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '8px',
                          borderRadius: '4px',
                          color: theme.text,
                          fontSize: '16px',
                          transition: 'background-color 0.2s'
                        }}
                        onMouseOver={(e) => e.target.style.backgroundColor = theme.border}
                        onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                      >
                        ⋯
                      </button>
                      
                      {menuAberto === usuario.id && (
                        <div style={{
                          position: 'absolute',
                          top: '100%',
                          right: '10px',
                          backgroundColor: theme.cardBackground,
                          border: `1px solid ${theme.border}`,
                          borderRadius: '8px',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                          zIndex: 1000,
                          minWidth: '150px',
                          overflow: 'hidden'
                        }}>
                          <button
                            onClick={() => {
                              toggleStatus(usuario.id);
                              setMenuAberto(null);
                            }}
                            style={{
                              width: '100%',
                              padding: '12px 16px',
                              border: 'none',
                              background: 'none',
                              textAlign: 'left',
                              cursor: 'pointer',
                              color: theme.text,
                              fontSize: '14px',
                              transition: 'background-color 0.2s'
                            }}
                            onMouseOver={(e) => e.target.style.backgroundColor = theme.border}
                            onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                          >
                            {(usuario.statusUsuario === 'ATIVO' || usuario.statusUsuario === null) ? 'Pausar' : 'Ativar'}
                          </button>
                          
                          <button
                            onClick={() => {
                              toggleAdmin(usuario.id, usuario.nivelAcesso === 'ADMIN');
                              setMenuAberto(null);
                            }}
                            style={{
                              width: '100%',
                              padding: '12px 16px',
                              border: 'none',
                              background: 'none',
                              textAlign: 'left',
                              cursor: 'pointer',
                              color: theme.text,
                              fontSize: '14px',
                              transition: 'background-color 0.2s'
                            }}
                            onMouseOver={(e) => e.target.style.backgroundColor = theme.border}
                            onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                          >
                            {usuario.nivelAcesso === 'ADMIN' ? 'Remover Admin' : 'Promover Admin'}
                          </button>
                          
                          <button
                            onClick={() => {
                              removerUsuario(usuario.id);
                              setMenuAberto(null);
                            }}
                            style={{
                              width: '100%',
                              padding: '12px 16px',
                              border: 'none',
                              background: 'none',
                              textAlign: 'left',
                              cursor: 'pointer',
                              color: '#F44336',
                              fontSize: '14px',
                              transition: 'background-color 0.2s'
                            }}
                            onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(244, 67, 54, 0.1)'}
                            onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                          >
                            Excluir
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>
        </div>
        </>
        )}

        {abaSelecionada === 'produtos' && (
        <>
        {/* Cards de Produtos */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '40px' }}>
          <div style={{
            backgroundColor: theme.cardBackground,
            padding: '25px',
            borderRadius: '12px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
            border: `1px solid ${theme.border}`,
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '32px', marginBottom: '10px', color: '#FF9800' }}>⏳</div>
            <h3 style={{ color: '#FF9800', margin: '0 0 5px 0', fontSize: '24px' }}>{produtosPendentes.length}</h3>
            <p style={{ color: theme.textSecondary, margin: 0 }}>Aguardando Aprovação</p>
          </div>
          
          <div style={{
            backgroundColor: theme.cardBackground,
            padding: '25px',
            borderRadius: '12px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
            border: `1px solid ${theme.border}`,
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '32px', marginBottom: '10px', color: theme.success }}>✓</div>
            <h3 style={{ color: theme.success, margin: '0 0 5px 0', fontSize: '24px' }}>{produtosAprovados.length}</h3>
            <p style={{ color: theme.textSecondary, margin: 0 }}>Produtos Aprovados</p>
          </div>
        </div>

        {/* Produtos Pendentes */}
        {produtosPendentes.length > 0 && (
        <div style={{
          backgroundColor: theme.cardBackground,
          borderRadius: '12px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
          border: `1px solid ${theme.border}`,
          overflow: 'hidden',
          marginBottom: '30px'
        }}>
          <div style={{ padding: '25px 30px', borderBottom: `1px solid ${theme.border}` }}>
            <h2 style={{ color: theme.text, margin: 0, fontSize: '22px' }}>Produtos Aguardando Aprovação</h2>
          </div>
          <div style={{ padding: '20px' }}>
            <div style={{ display: 'grid', gap: '20px' }}>
              {produtosPendentes.map(produto => (
                <div key={produto.id} style={{
                  border: `1px solid ${theme.border}`,
                  borderRadius: '8px',
                  padding: '20px',
                  background: 'linear-gradient(135deg, #ffc0cb 0%, #f8d7da 100%)'
                }}>
                  <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                    {produto.imagem && (
                      <img 
                        src={produto.imagem} 
                        alt={produto.nome}
                        style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }}
                      />
                    )}
                    <div style={{ flex: 1 }}>
                      <h3 style={{ color: theme.text, margin: '0 0 10px 0' }}>{produto.nome}</h3>
                      <p style={{ color: theme.textSecondary, margin: '0 0 5px 0' }}><strong>Categoria:</strong> {produto.categoria}</p>
                      <p style={{ color: theme.textSecondary, margin: '0 0 5px 0' }}><strong>Estado:</strong> {produto.estado}</p>
                      <p style={{ color: theme.textSecondary, margin: '0 0 5px 0' }}><strong>Doador:</strong> {produto.doador}</p>
                      <p style={{ color: theme.textSecondary, margin: '0 0 10px 0' }}><strong>Descrição:</strong> {produto.descricao}</p>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                          onClick={() => {
                            aprovarProduto(produto.id);
                            showSuccess('Produto aprovado com sucesso!');
                          }}
                          style={{
                            padding: '8px 16px',
                            backgroundColor: theme.success,
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer'
                          }}
                        >
                          Aprovar
                        </button>
                        <button
                          onClick={() => {
                            showConfirm(
                              'Rejeitar Produto',
                              'Tem certeza que deseja rejeitar este produto? Esta ação não pode ser desfeita.',
                              () => {
                                rejeitarProduto(produto.id);
                                showSuccess('Produto rejeitado.');
                              },
                              'Rejeitar',
                              'Cancelar'
                            );
                          }}
                          style={{
                            padding: '8px 16px',
                            backgroundColor: theme.danger,
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer'
                          }}
                        >
                          Rejeitar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        )}

        {/* Produtos Aprovados */}
        <div style={{
          backgroundColor: theme.cardBackground,
          borderRadius: '12px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
          border: `1px solid ${theme.border}`,
          overflow: 'hidden'
        }}>
          <div style={{ padding: '25px 30px', borderBottom: `1px solid ${theme.border}` }}>
            <h2 style={{ color: theme.text, margin: 0, fontSize: '22px' }}>Produtos Aprovados ({produtosAprovados.length})</h2>
          </div>
          <div style={{ padding: '20px' }}>
            {produtosAprovados.length === 0 ? (
              <p style={{ color: theme.textSecondary, textAlign: 'center', padding: '20px' }}>Nenhum produto aprovado ainda.</p>
            ) : (
              <div style={{ display: 'grid', gap: '15px' }}>
                {produtosAprovados.map(produto => (
                  <div key={produto.id} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '15px',
                    border: `1px solid ${theme.border}`,
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, #ffc0cb 0%, #f8d7da 100%)'
                  }}>
                    <div>
                      <h4 style={{ color: theme.text, margin: '0 0 5px 0' }}>{produto.nome}</h4>
                      <p style={{ color: theme.textSecondary, margin: 0, fontSize: '14px' }}>Por: {produto.doador} | {produto.categoria}</p>
                    </div>
                    <button
                      onClick={() => {
                        showConfirm(
                          'Remover Produto',
                          'Tem certeza que deseja remover este produto do site?',
                          () => {
                            removerProduto(produto.id);
                            showSuccess('Produto removido com sucesso!');
                          },
                          'Remover',
                          'Cancelar'
                        );
                      }}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: theme.danger,
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      Remover
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        </>
        )}

        {abaSelecionada === 'mensagens' && (
        <div style={{
          backgroundColor: theme.cardBackground,
          borderRadius: '12px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
          border: `1px solid ${theme.border}`,
          overflow: 'hidden'
        }}>
          <div style={{ padding: '25px 30px', borderBottom: `1px solid ${theme.border}` }}>
            <h2 style={{ color: theme.text, margin: 0, fontSize: '22px' }}>Mensagens de Contato ({mensagens.length})</h2>
          </div>
          <div style={{ padding: '20px' }}>
            {mensagens.length === 0 ? (
              <p style={{ color: theme.textSecondary, textAlign: 'center', padding: '20px' }}>Nenhuma mensagem recebida ainda.</p>
            ) : (
              <div style={{ display: 'grid', gap: '20px' }}>
                {mensagens.map(mensagem => (
                  <div key={mensagem.id} style={{
                    border: `1px solid ${theme.border}`,
                    borderRadius: '8px',
                    padding: '20px',
                    background: 'linear-gradient(135deg, #ffc0cb 0%, #f8d7da 100%)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                      <div>
                        <h3 style={{ color: theme.text, margin: '0 0 5px 0', fontSize: '18px' }}>{mensagem.emissor}</h3>
                        <p style={{ color: theme.textSecondary, margin: '0 0 5px 0', fontSize: '14px' }}>
                          📧 {mensagem.email}
                        </p>
                        {mensagem.telefone && (
                          <p style={{ color: theme.textSecondary, margin: '0 0 5px 0', fontSize: '14px' }}>
                            📱 {mensagem.telefone}
                          </p>
                        )}
                      </div>
                      <span style={{ 
                        color: theme.textSecondary, 
                        fontSize: '12px',
                        backgroundColor: theme.background,
                        padding: '4px 8px',
                        borderRadius: '4px'
                      }}>
                        {new Date(mensagem.dataMensagem).toLocaleString('pt-BR')}
                      </span>
                    </div>
                    <div style={{
                      backgroundColor: theme.background,
                      padding: '15px',
                      borderRadius: '8px',
                      marginBottom: '15px'
                    }}>
                      <p style={{ color: theme.text, margin: 0, lineHeight: '1.5' }}>{mensagem.texto}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button
                        onClick={() => window.open(`mailto:${mensagem.email}?subject=Re: Sua mensagem&body=Olá ${mensagem.emissor},%0D%0A%0D%0AObrigado por entrar em contato conosco.%0D%0A%0D%0A`)}
                        style={{
                          padding: '8px 16px',
                          backgroundColor: theme.primary,
                          color: 'white',
                          border: 'none',
                          borderRadius: '5px',
                          cursor: 'pointer',
                          fontSize: '14px'
                        }}
                      >
                        📧 Responder por Email
                      </button>
                      {mensagem.telefone && (
                        <button
                          onClick={() => window.open(`https://wa.me/${mensagem.telefone.replace(/\D/g, '')}?text=Olá ${mensagem.emissor}, obrigado por entrar em contato conosco.`)}
                          style={{
                            padding: '8px 16px',
                            backgroundColor: '#25D366',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            fontSize: '14px'
                          }}
                        >
                          📱 WhatsApp
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        )}
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