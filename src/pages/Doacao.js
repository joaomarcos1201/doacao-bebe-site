import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useProdutos } from '../context/ProdutosContext';
import { useTheme } from '../context/ThemeContext';
import { useNotification } from '../hooks/useNotification';
import Notification from '../components/Notification';

function Doacao() {
  const [produto, setProduto] = useState('');
  const [categoria, setCategoria] = useState('');
  const [descricao, setDescricao] = useState('');
  const [estado, setEstado] = useState('');
  const [contato, setContato] = useState('');
  const [imagem, setImagem] = useState('');
  const [imagemArquivo, setImagemArquivo] = useState(null);
  const { adicionarProduto } = useProdutos();
  const navigate = useNavigate();
  const { theme, isDark, toggleTheme } = useTheme();
  const { notifications, showSuccess, removeNotification } = useNotification();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (produto && categoria && descricao && estado && contato) {
      try {
        const response = await fetch('http://localhost:8080/api/produtos', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            nome: produto,
            categoria,
            descricao,
            estado,
            contato,
            imagem
          }),
        });

        if (response.ok) {
          showSuccess('Produto enviado para aprovação! Será analisado pelo administrador antes de aparecer no site.');
          setProduto('');
          setCategoria('');
          setDescricao('');
          setEstado('');
          setContato('');
          setImagem('');
          setImagemArquivo(null);
          navigate('/home');
        } else {
          const errorData = await response.text();
          alert(errorData || 'Erro ao cadastrar produto');
        }
      } catch (error) {
        alert('Erro de conexão com o servidor');
      }
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #ffc0cb 0%, #f8d7da 100%)', padding: window.innerWidth < 768 ? '15px' : '20px' }}>
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
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h1 style={{ 
              color: theme.primary, 
              fontSize: window.innerWidth < 768 ? '26px' : '32px', 
              fontWeight: '700',
              marginBottom: '8px',
              letterSpacing: '-0.5px'
            }}>
              Doar Produto
            </h1>
            <p style={{ 
              color: theme.textSecondary, 
              fontSize: '16px',
              margin: 0
            }}>
              Ajude outras famílias compartilhando o que você não usa mais
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
                }}>Nome do Produto *</label>
                <input
                  type="text"
                  value={produto}
                  onChange={(e) => setProduto(e.target.value)}
                  placeholder="Ex: Carrinho de bebê"
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
                }}>Categoria *</label>
                <select
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
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
                >
                  <option value="">Selecione uma categoria</option>
                  <option value="roupas">Roupas</option>
                  <option value="brinquedos">Brinquedos</option>
                  <option value="moveis">Móveis</option>
                  <option value="acessorios">Acessórios</option>
                  <option value="alimentacao">Alimentação</option>
                  <option value="outros">Outros</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '25px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                color: theme.text,
                fontWeight: '600',
                fontSize: '14px'
              }}>Descrição *</label>
              <textarea
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Descreva o produto: tamanho, cor, condições de uso, etc."
                rows="4"
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

            <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth < 768 ? '1fr' : '1fr 1fr', gap: '20px', marginBottom: '25px' }}>
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  color: theme.text,
                  fontWeight: '600',
                  fontSize: '14px'
                }}>Estado do Produto *</label>
                <select
                  value={estado}
                  onChange={(e) => setEstado(e.target.value)}
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
                >
                  <option value="">Selecione o estado</option>
                  <option value="novo">Novo</option>
                  <option value="seminovo">Semi-novo</option>
                  <option value="usado">Usado (bom estado)</option>
                </select>
              </div>

              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  color: theme.text,
                  fontWeight: '600',
                  fontSize: '14px'
                }}>Contato (WhatsApp) *</label>
                <input
                  type="tel"
                  value={contato}
                  onChange={(e) => setContato(e.target.value)}
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
              }}>📷 Imagem do Produto (opcional)</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setImagemArquivo(file);
                    const reader = new FileReader();
                    reader.onload = (event) => setImagem(event.target.result);
                    reader.readAsDataURL(file);
                  }
                }}
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
                  cursor: 'pointer'
                }}
                onFocus={(e) => e.target.style.borderColor = theme.primary}
                onBlur={(e) => e.target.style.borderColor = isDark ? 'rgba(173, 115, 120, 0.3)' : 'rgba(252, 192, 203, 0.5)'}
              />
              {imagem && (
                <div style={{ marginTop: '15px', textAlign: 'center' }}>
                  <img 
                    src={imagem} 
                    alt="Preview" 
                    style={{ 
                      width: '150px', 
                      height: '150px', 
                      objectFit: 'cover', 
                      borderRadius: '12px',
                      border: `2px solid ${theme.primary}`,
                      boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                    }}
                  />
                  <p style={{ 
                    color: theme.textSecondary, 
                    fontSize: '14px', 
                    marginTop: '8px',
                    margin: '8px 0 0 0'
                  }}>Preview da imagem selecionada</p>
                </div>
              )}
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
              🎁 Cadastrar Doação
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
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              ✨ Como funciona?
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
                  fontWeight: 'bold' 
                }}>1</span>
                <p style={{ margin: 0, color: theme.text, fontSize: '14px' }}>Preencha o formulário com os dados do produto</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
                  fontWeight: 'bold' 
                }}>2</span>
                <p style={{ margin: 0, color: theme.text, fontSize: '14px' }}>Aguarde a aprovação do administrador</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
                  fontWeight: 'bold' 
                }}>3</span>
                <p style={{ margin: 0, color: theme.text, fontSize: '14px' }}>Interessados entrarão em contato via WhatsApp</p>
              </div>
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
  </div>
</div>
  );
}

export default Doacao;