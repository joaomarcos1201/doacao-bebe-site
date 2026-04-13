import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProdutos } from '../context/ProdutosContext';
import { useTheme } from '../context/ThemeContext';
import { useNotification } from '../hooks/useNotification';
import Notification from '../components/Notification';
import { API_URL } from '../config/api';

function Doacao() {
  const [produto, setProduto] = useState('');
  const [categoria, setCategoria] = useState('');
  const [descricao, setDescricao] = useState('');
  const [estado, setEstado] = useState('');
  const [contato, setContato] = useState('');
  const [cpf, setCpf] = useState('');
  const [nomeDoador, setNomeDoador] = useState('');
  const [imagem, setImagem] = useState('');
  const [imagemArquivo, setImagemArquivo] = useState(null);
  const { carregarProdutos } = useProdutos();
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const { notifications, showSuccess, removeNotification } = useNotification();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!produto || !categoria || !descricao || !estado || !contato || !cpf || !nomeDoador) return;
    try {
      const formData = new FormData();
      formData.append('nome', produto);
      formData.append('categoria', categoria);
      formData.append('descricao', descricao);
      formData.append('estado', estado);
      formData.append('contato', contato);
      formData.append('cpf', cpf);
      formData.append('doador', nomeDoador);
      if (imagemArquivo) formData.append('imagem', imagemArquivo);

      const response = await fetch(`${API_URL}/api/produtos`, { method: 'POST', body: formData });
      if (response.ok) {
        await carregarProdutos();
        showSuccess('Produto enviado para aprovação!');
        setProduto(''); setCategoria(''); setDescricao(''); setEstado('');
        setContato(''); setCpf(''); setNomeDoador(''); setImagem(''); setImagemArquivo(null);
        navigate('/home');
      } else {
        const err = await response.text();
        alert('Erro: ' + err);
      }
    } catch { alert('Erro de conexão com o servidor'); }
  };

  const input = {
    width: '100%', padding: '12px 16px', borderRadius: '10px', fontSize: '14px',
    border: `1px solid ${isDark ? '#333' : '#e8d0d4'}`,
    backgroundColor: isDark ? '#1e1e1e' : '#fdf8f8',
    color: isDark ? '#e0e0e0' : '#333', outline: 'none', boxSizing: 'border-box'
  };

  const label = { display: 'block', fontSize: '13px', fontWeight: '600', color: isDark ? '#ccc' : '#555', marginBottom: '6px' };

  return (
    <div style={{
      minHeight: '100vh', backgroundColor: isDark ? '#0f0f0f' : '#f9f5f6',
      fontFamily: "'Inter', system-ui, sans-serif"
    }}>
      {/* Navbar */}
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
        <span style={{ fontSize: '16px', fontWeight: '700', color: isDark ? '#f0c0c8' : '#c0606a' }}>Doar Produto</span>
        <button onClick={toggleTheme} style={{
          width: '36px', height: '36px', borderRadius: '50%', border: `1px solid ${isDark ? '#333' : '#e8d0d4'}`,
          backgroundColor: 'transparent', cursor: 'pointer', fontSize: '16px'
        }}>{isDark ? '☀️' : '🌙'}</button>
      </nav>

      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '32px 24px' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: isDark ? '#f0e0e2' : '#2d1518', margin: '0 0 8px', letterSpacing: '-0.5px' }}>
            🎁 Fazer uma doação
          </h1>
          <p style={{ fontSize: '14px', color: isDark ? '#666' : '#999', margin: 0 }}>
            Ajude outras famílias compartilhando o que você não usa mais
          </p>
        </div>

        <div style={{
          backgroundColor: isDark ? '#141414' : '#fff', borderRadius: '20px', padding: '32px',
          border: `1px solid ${isDark ? '#2a2a2a' : '#f0e6e8'}`,
          boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
        }}>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={label}>Nome do Produto *</label>
                <input type="text" value={produto} onChange={(e) => setProduto(e.target.value)} placeholder="Ex: Carrinho de bebê" style={input} required />
              </div>
              <div>
                <label style={label}>Categoria *</label>
                <select value={categoria} onChange={(e) => setCategoria(e.target.value)} style={input} required>
                  <option value="">Selecione</option>
                  <option value="roupas">👕 Roupas</option>
                  <option value="brinquedos">🧸 Brinquedos</option>
                  <option value="moveis">🪑 Móveis</option>
                  <option value="acessorios">🎒 Acessórios</option>
                  <option value="alimentacao">🍼 Alimentação</option>
                  <option value="outros">📦 Outros</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={label}>Descrição *</label>
              <textarea value={descricao} onChange={(e) => setDescricao(e.target.value)}
                placeholder="Descreva o produto: tamanho, cor, condições de uso..." rows="3"
                style={{ ...input, resize: 'vertical', fontFamily: 'inherit' }} required />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={label}>Estado do Produto *</label>
                <select value={estado} onChange={(e) => setEstado(e.target.value)} style={input} required>
                  <option value="">Selecione</option>
                  <option value="novo">✨ Novo</option>
                  <option value="seminovo">👍 Semi-novo</option>
                  <option value="usado">📦 Usado</option>
                </select>
              </div>
              <div>
                <label style={label}>WhatsApp *</label>
                <input type="tel" value={contato} onChange={(e) => setContato(e.target.value)} placeholder="(11) 99999-9999" style={input} required />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={label}>Seu Nome *</label>
                <input type="text" value={nomeDoador} onChange={(e) => setNomeDoador(e.target.value)} placeholder="Nome completo" style={input} required />
              </div>
              <div>
                <label style={label}>CPF *</label>
                <input type="text" value={cpf} onChange={(e) => {
                  let v = e.target.value.replace(/\D/g, '');
                  v = v.replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2');
                  setCpf(v);
                }} placeholder="000.000.000-00" maxLength="14" style={input} required />
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={label}>Foto do Produto (opcional)</label>
              <input type="file" accept="image/*" onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setImagemArquivo(file);
                  const reader = new FileReader();
                  reader.onload = (ev) => setImagem(ev.target.result);
                  reader.readAsDataURL(file);
                }
              }} style={{ ...input, cursor: 'pointer' }} />
              {imagem && (
                <div style={{ marginTop: '12px' }}>
                  <img src={imagem} alt="Preview" style={{
                    width: '120px', height: '120px', objectFit: 'cover',
                    borderRadius: '10px', border: `2px solid ${isDark ? '#333' : '#e8d0d4'}`
                  }} />
                </div>
              )}
            </div>

            <button type="submit" style={{
              width: '100%', padding: '14px', borderRadius: '10px', border: 'none',
              backgroundColor: '#c0606a', color: 'white', fontSize: '15px', fontWeight: '600', cursor: 'pointer'
            }}>Enviar Doação</button>
          </form>
        </div>

        {/* Como funciona */}
        <div style={{
          marginTop: '24px', padding: '24px', borderRadius: '16px',
          backgroundColor: isDark ? '#141414' : '#fff',
          border: `1px solid ${isDark ? '#2a2a2a' : '#f0e6e8'}`
        }}>
          <h3 style={{ fontSize: '15px', fontWeight: '700', color: isDark ? '#f0e0e2' : '#2d1518', margin: '0 0 16px' }}>Como funciona?</h3>
          {[
            { n: '1', text: 'Preencha o formulário com os dados do produto' },
            { n: '2', text: 'Aguarde a aprovação do administrador' },
            { n: '3', text: 'Interessados entrarão em contato via WhatsApp' },
          ].map(({ n, text }) => (
            <div key={n} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
              <span style={{
                width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#c0606a',
                color: 'white', fontSize: '12px', fontWeight: '700',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
              }}>{n}</span>
              <span style={{ fontSize: '14px', color: isDark ? '#888' : '#666' }}>{text}</span>
            </div>
          ))}
        </div>
      </div>

      {notifications.map(n => (
        <Notification key={n.id} message={n.message} type={n.type} duration={n.duration} onClose={() => removeNotification(n.id)} />
      ))}
    </div>
  );
}

export default Doacao;
