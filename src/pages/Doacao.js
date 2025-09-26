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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (produto && categoria && descricao && estado && contato) {
      adicionarProduto({
        nome: produto,
        categoria,
        descricao,
        estado,
        contato,
        imagem
      });
      showSuccess('Produto enviado para aprovação! Será analisado pelo administrador antes de aparecer no site.');
      setProduto('');
      setCategoria('');
      setDescricao('');
      setEstado('');
      setContato('');
      setImagem('');
      setImagemArquivo(null);
      navigate('/home');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #ffc0cb 0%, #f8d7da 100%)', padding: '20px' }}>
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
      
      <div style={{ maxWidth: '800px', margin: '0 auto', paddingTop: '60px' }}>
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
            Doar Produto - Além do Positivo
          </h2>
      
      <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: theme.text }}>Nome do Produto:</label>
            <input
              type="text"
              value={produto}
              onChange={(e) => setProduto(e.target.value)}
              placeholder="Ex: Carrinho de bebê"
              style={{
                width: '100%',
                padding: '12px',
                border: `1px solid ${theme.border}`,
                borderRadius: '5px',
                backgroundColor: theme.background,
                color: theme.text
              }}
              required
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: theme.text }}>Categoria:</label>
            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: `1px solid ${theme.border}`,
                borderRadius: '5px',
                backgroundColor: theme.background,
                color: theme.text
              }}
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

        <div className="form-group">
          <label>Descrição:</label>
          <textarea
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Descreva o produto, tamanho, cor, etc."
            rows="4"
            required
          />
        </div>

        <div className="form-group">
          <label>Estado do Produto:</label>
          <select
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
            required
          >
            <option value="">Selecione o estado</option>
            <option value="novo">Novo</option>
            <option value="seminovo">Semi-novo</option>
            <option value="usado">Usado (bom estado)</option>
          </select>
        </div>

        <div className="form-group">
          <label>Contato (WhatsApp):</label>
          <input
            type="tel"
            value={contato}
            onChange={(e) => setContato(e.target.value)}
            placeholder="(11) 99999-9999"
            required
          />
        </div>

        <div className="form-group">
          <label>Imagem do Produto (opcional):</label>
          <div style={{ marginBottom: '10px' }}>
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
              style={{ marginBottom: '10px' }}
            />
          </div>
          <div style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>ou</div>
          <input
            type="url"
            value={imagemArquivo ? '' : imagem}
            onChange={(e) => {
              setImagem(e.target.value);
              setImagemArquivo(null);
            }}
            placeholder="https://exemplo.com/imagem.jpg"
            disabled={imagemArquivo !== null}
          />
          {imagem && (
            <div style={{ marginTop: '10px' }}>
              <img 
                src={imagem} 
                alt="Preview" 
                style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '4px' }}
              />
            </div>
          )}
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
              fontWeight: 'bold'
            }}
          >
            Cadastrar Doação
          </button>
        
      </form>

      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
        <h4 style={{ color: '#ff69b4', marginBottom: '10px' }}>Como funciona?</h4>
        <p>1. Preencha o formulário com os dados do produto</p>
        <p>2. Aguarde a aprovação do administrador</p>
        <p>3. Após aprovado, aparecerá no site para doação</p>
        <p>4. Interessados entrarão em contato com você</p>
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