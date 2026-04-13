import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useNotification } from '../hooks/useNotification';
import { useConfirm } from '../hooks/useConfirm';
import { useProdutos } from '../context/ProdutosContext';
import Notification from '../components/Notification';
import ConfirmDialog from '../components/ConfirmDialog';
import { API_URL } from '../config/api';

function Admin() {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, ativos: 0, inativos: 0, admins: 0 });
  const [aba, setAba] = useState('usuarios');
  const [mensagens, setMensagens] = useState([]);
  const [menuAberto, setMenuAberto] = useState(null);
  const { produtos, aprovarProduto, rejeitarProduto, removerProduto } = useProdutos();
  const { notifications, showSuccess, showError, removeNotification } = useNotification();
  const { confirmState, showConfirm, handleConfirm, handleCancel } = useConfirm();

  const produtosPendentes = produtos.filter(p => p.statusAnuncio === 'INATIVO');
  const produtosAprovados = produtos.filter(p => p.statusAnuncio === 'ATIVO');

  useEffect(() => { carregarUsuarios(); carregarMensagens(); }, []);
  useEffect(() => {
    const handler = (e) => { if (menuAberto && !e.target.closest('td')) setMenuAberto(null); };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [menuAberto]);

  const carregarMensagens = async () => {
    try {
      const r = await fetch(`${API_URL}/api/contato`);
      if (r.ok) setMensagens(await r.json());
    } catch {}
  };

  const carregarUsuarios = async () => {
    try {
      const r = await fetch(`${API_URL}/api/usuarios`);
      if (r.ok) {
        const data = await r.json();
        setUsuarios(data);
        setStats({
          total: data.length,
          ativos: data.filter(u => u.statusUsuario === 'ATIVO' || u.statusUsuario === null).length,
          inativos: data.filter(u => u.statusUsuario === 'INATIVO').length,
          admins: data.filter(u => u.nivelAcesso === 'ADMIN').length,
        });
      } else showError('Não foi possível carregar usuários.');
    } catch { showError('Erro de conexão.'); }
    finally { setLoading(false); }
  };

  const toggleStatus = async (id) => {
    try {
      const r = await fetch(`${API_URL}/api/usuarios/${id}/status`, { method: 'PUT' });
      if (r.ok) { showSuccess('Status alterado!'); carregarUsuarios(); }
      else showError('Erro ao alterar status.');
    } catch { showError('Erro de conexão.'); }
  };

  const removerUsuario = (id) => showConfirm('Remover Usuário', 'Esta ação não pode ser desfeita.', async () => {
    try {
      const r = await fetch(`${API_URL}/api/usuarios/${id}`, { method: 'DELETE' });
      if (r.ok) { showSuccess('Usuário removido!'); carregarUsuarios(); }
      else showError('Erro ao remover usuário.');
    } catch { showError('Erro de conexão.'); }
  }, 'Remover', 'Cancelar');

  const toggleAdmin = (id, isAdmin) => showConfirm('Alterar Privilégios', `Deseja ${isAdmin ? 'remover' : 'conceder'} privilégios de admin?`, async () => {
    try {
      const r = await fetch(`${API_URL}/api/usuarios/${id}/admin`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isAdmin: !isAdmin }),
      });
      if (r.ok) { showSuccess('Privilégios alterados!'); carregarUsuarios(); }
      else showError('Erro ao alterar privilégios.');
    } catch { showError('Erro de conexão.'); }
  }, 'Confirmar', 'Cancelar');

  const card = (value, label, color, emoji) => (
    <div style={{
      backgroundColor: isDark ? '#141414' : '#fff', borderRadius: '16px', padding: '24px',
      border: `1px solid ${isDark ? '#2a2a2a' : '#f0e6e8'}`, textAlign: 'center'
    }}>
      <div style={{ fontSize: '28px', marginBottom: '8px' }}>{emoji}</div>
      <div style={{ fontSize: '28px', fontWeight: '800', color, marginBottom: '4px' }}>{value}</div>
      <div style={{ fontSize: '13px', color: isDark ? '#666' : '#999' }}>{label}</div>
    </div>
  );

  const tabBtn = (id, label) => (
    <button key={id} onClick={() => setAba(id)} style={{
      padding: '10px 20px', borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: 'pointer',
      border: `1px solid ${aba === id ? '#c0606a' : (isDark ? '#333' : '#e8d0d4')}`,
      backgroundColor: aba === id ? '#c0606a' : 'transparent',
      color: aba === id ? 'white' : (isDark ? '#aaa' : '#666')
    }}>{label}</button>
  );

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: isDark ? '#0f0f0f' : '#f9f5f6' }}>
      <div style={{ color: isDark ? '#888' : '#999', fontSize: '16px' }}>Carregando...</div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', backgroundColor: isDark ? '#0f0f0f' : '#f9f5f6', fontFamily: "'Inter', system-ui, sans-serif" }}>
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        backgroundColor: isDark ? 'rgba(18,18,18,0.95)' : 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(20px)', borderBottom: `1px solid ${isDark ? '#2a2a2a' : '#f0e6e8'}`,
        padding: '0 24px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <button onClick={() => navigate('/home')} style={{
          padding: '8px 16px', borderRadius: '8px', border: `1px solid ${isDark ? '#333' : '#e8d0d4'}`,
          backgroundColor: 'transparent', color: isDark ? '#aaa' : '#888', cursor: 'pointer', fontSize: '13px'
        }}>← Voltar</button>
        <span style={{ fontSize: '16px', fontWeight: '700', color: isDark ? '#f0c0c8' : '#c0606a' }}>⚙️ Administração</span>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={toggleTheme} style={{
            width: '36px', height: '36px', borderRadius: '50%', border: `1px solid ${isDark ? '#333' : '#e8d0d4'}`,
            backgroundColor: 'transparent', cursor: 'pointer', fontSize: '16px'
          }}>{isDark ? '☀️' : '🌙'}</button>
          <button onClick={() => { localStorage.clear(); navigate('/login'); }} style={{
            padding: '8px 16px', borderRadius: '8px', border: '1px solid #ef4444',
            backgroundColor: 'transparent', color: '#ef4444', cursor: 'pointer', fontSize: '13px', fontWeight: '500'
          }}>Sair</button>
        </div>
      </nav>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
        {/* Abas */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '28px', flexWrap: 'wrap' }}>
          {tabBtn('usuarios', `👥 Usuários (${stats.total})`)}
          {tabBtn('produtos', `📦 Produtos (${produtosPendentes.length} pendentes)`)}
          {tabBtn('mensagens', `💬 Mensagens (${mensagens.length})`)}
        </div>

        {/* ABA USUÁRIOS */}
        {aba === 'usuarios' && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', marginBottom: '28px' }}>
              {card(stats.total, 'Total', '#c0606a', '👥')}
              {card(stats.ativos, 'Ativos', '#4caf50', '✅')}
              {card(stats.inativos, 'Inativos', '#ef4444', '⛔')}
              {card(stats.admins, 'Admins', '#ff9800', '⭐')}
            </div>
            <div style={{
              backgroundColor: isDark ? '#141414' : '#fff', borderRadius: '20px',
              border: `1px solid ${isDark ? '#2a2a2a' : '#f0e6e8'}`, overflow: 'hidden'
            }}>
              <div style={{ padding: '20px 24px', borderBottom: `1px solid ${isDark ? '#2a2a2a' : '#f0e6e8'}` }}>
                <h2 style={{ fontSize: '16px', fontWeight: '700', color: isDark ? '#e0e0e0' : '#333', margin: 0 }}>Gerenciamento de Usuários</h2>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
                  <thead>
                    <tr style={{ backgroundColor: isDark ? '#1a1a1a' : '#fdf8f8' }}>
                      {['Usuário', 'Email', 'Status', 'Nível', 'Ações'].map(h => (
                        <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: isDark ? '#666' : '#999', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {usuarios.map((u) => (
                      <tr key={u.id} style={{ borderTop: `1px solid ${isDark ? '#2a2a2a' : '#f0e6e8'}` }}>
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{
                              width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#c0606a',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              color: 'white', fontSize: '13px', fontWeight: '700', flexShrink: 0
                            }}>{u.nome.charAt(0).toUpperCase()}</div>
                            <span style={{ fontSize: '14px', fontWeight: '600', color: isDark ? '#e0e0e0' : '#333' }}>{u.nome}</span>
                          </div>
                        </td>
                        <td style={{ padding: '14px 16px', fontSize: '13px', color: isDark ? '#888' : '#666' }}>{u.email}</td>
                        <td style={{ padding: '14px 16px' }}>
                          <span style={{
                            padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700',
                            backgroundColor: (u.statusUsuario === 'ATIVO' || !u.statusUsuario) ? 'rgba(76,175,80,0.1)' : 'rgba(244,67,54,0.1)',
                            color: (u.statusUsuario === 'ATIVO' || !u.statusUsuario) ? '#4caf50' : '#ef4444',
                            border: `1px solid ${(u.statusUsuario === 'ATIVO' || !u.statusUsuario) ? '#4caf50' : '#ef4444'}`
                          }}>{(u.statusUsuario === 'ATIVO' || !u.statusUsuario) ? 'ATIVO' : 'INATIVO'}</span>
                        </td>
                        <td style={{ padding: '14px 16px', fontSize: '13px', color: u.nivelAcesso === 'ADMIN' ? '#ff9800' : (isDark ? '#666' : '#aaa') }}>
                          {u.nivelAcesso === 'ADMIN' ? '⭐ Admin' : 'Usuário'}
                        </td>
                        <td style={{ padding: '14px 16px', position: 'relative' }}>
                          <button onClick={() => setMenuAberto(menuAberto === u.id ? null : u.id)} style={{
                            background: 'none', border: `1px solid ${isDark ? '#333' : '#e8d0d4'}`, cursor: 'pointer',
                            padding: '6px 10px', borderRadius: '6px', color: isDark ? '#aaa' : '#888', fontSize: '16px'
                          }}>⋯</button>
                          {menuAberto === u.id && (
                            <div style={{
                              position: 'absolute', top: '100%', right: '16px',
                              backgroundColor: isDark ? '#1e1e1e' : '#fff',
                              border: `1px solid ${isDark ? '#333' : '#e8d0d4'}`,
                              borderRadius: '10px', boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                              zIndex: 1000, minWidth: '160px', overflow: 'hidden'
                            }}>
                              {[
                                { label: (u.statusUsuario === 'ATIVO' || !u.statusUsuario) ? 'Pausar' : 'Ativar', action: () => { toggleStatus(u.id); setMenuAberto(null); }, color: isDark ? '#e0e0e0' : '#333' },
                                { label: u.nivelAcesso === 'ADMIN' ? 'Remover Admin' : 'Promover Admin', action: () => { toggleAdmin(u.id, u.nivelAcesso === 'ADMIN'); setMenuAberto(null); }, color: isDark ? '#e0e0e0' : '#333' },
                                { label: 'Excluir', action: () => { removerUsuario(u.id); setMenuAberto(null); }, color: '#ef4444' },
                              ].map(({ label, action, color }) => (
                                <button key={label} onClick={action} style={{
                                  width: '100%', padding: '12px 16px', border: 'none', background: 'none',
                                  textAlign: 'left', cursor: 'pointer', color, fontSize: '14px'
                                }}
                                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = isDark ? '#2a2a2a' : '#fdf8f8'}
                                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                >{label}</button>
                              ))}
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* ABA PRODUTOS */}
        {aba === 'produtos' && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', marginBottom: '28px' }}>
              {card(produtosPendentes.length, 'Pendentes', '#ff9800', '⏳')}
              {card(produtosAprovados.length, 'Aprovados', '#4caf50', '✅')}
            </div>

            {produtosPendentes.length > 0 && (
              <div style={{
                backgroundColor: isDark ? '#141414' : '#fff', borderRadius: '20px',
                border: `1px solid ${isDark ? '#2a2a2a' : '#f0e6e8'}`, marginBottom: '20px', overflow: 'hidden'
              }}>
                <div style={{ padding: '20px 24px', borderBottom: `1px solid ${isDark ? '#2a2a2a' : '#f0e6e8'}` }}>
                  <h2 style={{ fontSize: '16px', fontWeight: '700', color: isDark ? '#e0e0e0' : '#333', margin: 0 }}>⏳ Aguardando Aprovação</h2>
                </div>
                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {produtosPendentes.map(p => (
                    <div key={p.id} style={{
                      padding: '20px', borderRadius: '12px',
                      border: `1px solid ${isDark ? '#2a2a2a' : '#f0e6e8'}`,
                      backgroundColor: isDark ? '#1a1a1a' : '#fdf8f8',
                      display: 'flex', gap: '16px', alignItems: 'flex-start'
                    }}>
                      <div style={{
                        width: '80px', height: '80px', borderRadius: '10px', flexShrink: 0,
                        backgroundColor: isDark ? '#2a2a2a' : '#f0e6e8',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden'
                      }}>
                        {p.foto ? <img src={`data:image/jpeg;base64,${p.foto}`} alt={p.nome} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          : <span style={{ fontSize: '24px', opacity: 0.3 }}>📦</span>}
                      </div>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ fontSize: '15px', fontWeight: '700', color: isDark ? '#e0e0e0' : '#333', margin: '0 0 6px' }}>{p.nome}</h3>
                        <p style={{ fontSize: '13px', color: isDark ? '#888' : '#666', margin: '0 0 12px', lineHeight: '1.5' }}>{p.descricao}</p>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button onClick={() => { aprovarProduto(p.id); showSuccess('Produto aprovado!'); }} style={{
                            padding: '8px 16px', borderRadius: '8px', border: 'none',
                            backgroundColor: '#4caf50', color: 'white', fontSize: '13px', fontWeight: '600', cursor: 'pointer'
                          }}>✓ Aprovar</button>
                          <button onClick={() => showConfirm('Rejeitar Produto', 'Tem certeza?', () => { rejeitarProduto(p.id); showSuccess('Produto rejeitado.'); }, 'Rejeitar', 'Cancelar')} style={{
                            padding: '8px 16px', borderRadius: '8px', border: 'none',
                            backgroundColor: '#ef4444', color: 'white', fontSize: '13px', fontWeight: '600', cursor: 'pointer'
                          }}>✗ Rejeitar</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{
              backgroundColor: isDark ? '#141414' : '#fff', borderRadius: '20px',
              border: `1px solid ${isDark ? '#2a2a2a' : '#f0e6e8'}`, overflow: 'hidden'
            }}>
              <div style={{ padding: '20px 24px', borderBottom: `1px solid ${isDark ? '#2a2a2a' : '#f0e6e8'}` }}>
                <h2 style={{ fontSize: '16px', fontWeight: '700', color: isDark ? '#e0e0e0' : '#333', margin: 0 }}>✅ Produtos Aprovados ({produtosAprovados.length})</h2>
              </div>
              <div style={{ padding: '20px' }}>
                {produtosAprovados.length === 0 ? (
                  <p style={{ textAlign: 'center', color: isDark ? '#666' : '#aaa', fontSize: '14px', padding: '20px' }}>Nenhum produto aprovado ainda.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {produtosAprovados.map(p => (
                      <div key={p.id} style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        padding: '14px 16px', borderRadius: '10px',
                        border: `1px solid ${isDark ? '#2a2a2a' : '#f0e6e8'}`,
                        backgroundColor: isDark ? '#1a1a1a' : '#fdf8f8'
                      }}>
                        <div>
                          <span style={{ fontSize: '14px', fontWeight: '600', color: isDark ? '#e0e0e0' : '#333' }}>{p.nome}</span>
                          <span style={{ fontSize: '12px', color: isDark ? '#666' : '#aaa', marginLeft: '8px' }}>{p.categoria}</span>
                        </div>
                        <button onClick={() => showConfirm('Remover Produto', 'Tem certeza?', () => { removerProduto(p.id); showSuccess('Produto removido!'); }, 'Remover', 'Cancelar')} style={{
                          padding: '6px 12px', borderRadius: '6px', border: '1px solid #ef4444',
                          backgroundColor: 'transparent', color: '#ef4444', fontSize: '12px', fontWeight: '600', cursor: 'pointer'
                        }}>Remover</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* ABA MENSAGENS */}
        {aba === 'mensagens' && (
          <div style={{
            backgroundColor: isDark ? '#141414' : '#fff', borderRadius: '20px',
            border: `1px solid ${isDark ? '#2a2a2a' : '#f0e6e8'}`, overflow: 'hidden'
          }}>
            <div style={{ padding: '20px 24px', borderBottom: `1px solid ${isDark ? '#2a2a2a' : '#f0e6e8'}` }}>
              <h2 style={{ fontSize: '16px', fontWeight: '700', color: isDark ? '#e0e0e0' : '#333', margin: 0 }}>Mensagens de Contato ({mensagens.length})</h2>
            </div>
            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {mensagens.length === 0 ? (
                <p style={{ textAlign: 'center', color: isDark ? '#666' : '#aaa', fontSize: '14px', padding: '20px' }}>Nenhuma mensagem recebida.</p>
              ) : mensagens.map(m => (
                <div key={m.id} style={{
                  padding: '20px', borderRadius: '12px',
                  border: `1px solid ${isDark ? '#2a2a2a' : '#f0e6e8'}`,
                  backgroundColor: isDark ? '#1a1a1a' : '#fdf8f8'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div>
                      <h3 style={{ fontSize: '15px', fontWeight: '700', color: isDark ? '#e0e0e0' : '#333', margin: '0 0 4px' }}>{m.emissor}</h3>
                      <p style={{ fontSize: '13px', color: isDark ? '#888' : '#666', margin: 0 }}>📧 {m.email}{m.telefone && ` · 📱 ${m.telefone}`}</p>
                    </div>
                    <span style={{ fontSize: '12px', color: isDark ? '#555' : '#bbb' }}>{new Date(m.dataMensagem).toLocaleString('pt-BR')}</span>
                  </div>
                  <p style={{ fontSize: '14px', color: isDark ? '#aaa' : '#555', lineHeight: '1.6', margin: '0 0 14px', padding: '12px', borderRadius: '8px', backgroundColor: isDark ? '#141414' : '#fff' }}>{m.texto}</p>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => window.open(`mailto:${m.email}?subject=Re: Sua mensagem`)} style={{
                      padding: '8px 14px', borderRadius: '8px', border: 'none',
                      backgroundColor: '#c0606a', color: 'white', fontSize: '13px', fontWeight: '600', cursor: 'pointer'
                    }}>📧 Responder</button>
                    {m.telefone && (
                      <button onClick={() => window.open(`https://wa.me/${m.telefone.replace(/\D/g, '')}?text=Olá ${m.emissor}!`)} style={{
                        padding: '8px 14px', borderRadius: '8px', border: 'none',
                        backgroundColor: '#25D366', color: 'white', fontSize: '13px', fontWeight: '600', cursor: 'pointer'
                      }}>💬 WhatsApp</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {notifications.map(n => (
        <Notification key={n.id} message={n.message} type={n.type} duration={n.duration} onClose={() => removeNotification(n.id)} />
      ))}
      <ConfirmDialog isOpen={confirmState.isOpen} title={confirmState.title} message={confirmState.message}
        onConfirm={handleConfirm} onCancel={handleCancel} confirmText={confirmState.confirmText} cancelText={confirmState.cancelText} />
    </div>
  );
}

export default Admin;
