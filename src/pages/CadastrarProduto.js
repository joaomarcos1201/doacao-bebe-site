import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { API_URL } from '../config/api';

const CATEGORIAS = [
  { value: 'roupas', label: 'Roupas' },
  { value: 'brinquedos', label: 'Brinquedos' },
  { value: 'moveis', label: 'Berco/Cama e Moveis' },
  { value: 'acessorios', label: 'Acessorios' },
  { value: 'alimentacao', label: 'Alimentacao' },
  { value: 'outros', label: 'Outros' },
];
const CONSERVACOES = ['Novo', 'Seminovo', 'Bom Estado', 'Com Marcas de Uso'];

function CadastrarProduto() {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState(false);
  const [imagem, setImagem] = useState(null);
  const [previewImg, setPreviewImg] = useState(null);

  const [form, setForm] = useState({
    nome: '', descricao: '', categoria: '', marca: '', conservacao: '',
    preco: '', peso: '', altura: '', largura: '', comprimento: '', cepOrigem: ''
  });

  const bg = isDark ? '#0f0f0f' : '#f9f5f6';
  const card = isDark ? '#141414' : '#fff';
  const border = isDark ? '#2a2a2a' : '#f0e6e8';
  const text = isDark ? '#e0e0e0' : '#333';
  const sub = isDark ? '#888' : '#666';

  const inputStyle = {
    width: '100%', padding: '12px 14px', borderRadius: '10px', fontSize: '14px',
    border: `1px solid ${border}`, backgroundColor: isDark ? '#1a1a1a' : '#f9f5f6',
    color: text, outline: 'none', boxSizing: 'border-box'
  };

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleImagem = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImagem(file);
    setPreviewImg(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro(''); setLoading(true);

    const required = ['nome', 'descricao', 'categoria', 'conservacao', 'preco', 'peso', 'altura', 'largura', 'comprimento', 'cepOrigem'];
    const missing = required.filter(k => !form[k]);
    if (missing.length > 0) { setErro('Preencha todos os campos obrigatórios.'); setLoading(false); return; }

    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (imagem) fd.append('imagem', imagem);

      const r = await fetch(`${API_URL}/api/products`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: fd
      });

      if (r.ok) setSucesso(true);
      else { const msg = await r.text(); setErro(msg || 'Erro ao cadastrar produto.'); }
    } catch { setErro('Erro de conexão. Tente novamente.'); }
    finally { setLoading(false); }
  };

  const label = (txt, required = true) => (
    <label style={{ fontSize: '12px', fontWeight: '700', color: sub, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '6px' }}>
      {txt}{required && <span style={{ color: '#ef4444' }}> *</span>}
    </label>
  );

  if (sucesso) return (
    <div style={{ minHeight: '100vh', backgroundColor: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter', system-ui, sans-serif" }}>
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>✅</div>
        <h2 style={{ fontSize: '22px', fontWeight: '800', color: text, margin: '0 0 8px' }}>Produto enviado para análise!</h2>
        <p style={{ color: sub, marginBottom: '24px' }}>O administrador irá revisar e aprovar em breve.</p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button onClick={() => navigate('/home')} style={{ padding: '12px 24px', borderRadius: '12px', border: 'none', backgroundColor: '#c0606a', color: 'white', fontSize: '14px', fontWeight: '700', cursor: 'pointer' }}>
            Ir para Home
          </button>
          <button onClick={() => { setSucesso(false); setForm({ nome: '', descricao: '', categoria: '', marca: '', conservacao: '', preco: '', peso: '', altura: '', largura: '', comprimento: '', cepOrigem: '' }); setImagem(null); setPreviewImg(null); }} style={{ padding: '12px 24px', borderRadius: '12px', border: `1px solid ${border}`, backgroundColor: 'transparent', color: text, fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
            Cadastrar Outro
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', backgroundColor: bg, fontFamily: "'Inter', system-ui, sans-serif" }}>
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        backgroundColor: isDark ? 'rgba(18,18,18,0.95)' : 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(20px)', borderBottom: `1px solid ${border}`,
        padding: '0 24px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: `1px solid ${border}`, borderRadius: '8px', padding: '8px 14px', cursor: 'pointer', color: sub, fontSize: '13px' }}>← Voltar</button>
        <span style={{ fontSize: '16px', fontWeight: '700', color: '#c0606a' }}>📸 Anunciar Produto</span>
        <div style={{ width: '80px' }} />
      </nav>

      <form onSubmit={handleSubmit} style={{ maxWidth: '600px', margin: '0 auto', padding: '32px 16px' }}>
        <div style={{ backgroundColor: card, borderRadius: '20px', border: `1px solid ${border}`, padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Foto */}
          <div>
            {label('Foto do Produto', false)}
            <label style={{ display: 'block', cursor: 'pointer' }}>
              <div style={{
                width: '100%', height: '200px', borderRadius: '12px', border: `2px dashed ${border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
                backgroundColor: isDark ? '#1a1a1a' : '#fdf0f2'
              }}>
                {previewImg ? <img src={previewImg} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <div style={{ textAlign: 'center' }}><div style={{ fontSize: '32px', marginBottom: '8px' }}>📷</div><p style={{ fontSize: '13px', color: sub, margin: 0 }}>Clique para adicionar foto</p></div>}
              </div>
              <input type="file" accept="image/*" onChange={handleImagem} style={{ display: 'none' }} />
            </label>
          </div>

          {/* Nome */}
          <div>
            {label('Nome do Produto')}
            <input value={form.nome} onChange={e => set('nome', e.target.value)} placeholder="Ex: Carrinho de bebê Burigotto" style={inputStyle} />
          </div>

          {/* Descrição */}
          <div>
            {label('Descrição')}
            <textarea value={form.descricao} onChange={e => set('descricao', e.target.value)} placeholder="Descreva o produto, defeitos, detalhes..." rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
          </div>

          {/* Categoria + Marca */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              {label('Categoria')}
              <select value={form.categoria} onChange={e => set('categoria', e.target.value)} style={inputStyle}>
                <option value="">Selecione</option>
                {CATEGORIAS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            <div>
              {label('Marca', false)}
              <input value={form.marca} onChange={e => set('marca', e.target.value)} placeholder="Ex: Burigotto" style={inputStyle} />
            </div>
          </div>

          {/* Conservação + Preço */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              {label('Estado de Conservação')}
              <select value={form.conservacao} onChange={e => set('conservacao', e.target.value)} style={inputStyle}>
                <option value="">Selecione</option>
                {CONSERVACOES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              {label('Preço (R$)')}
              <input type="number" min="0" step="0.01" value={form.preco} onChange={e => set('preco', e.target.value)} placeholder="0,00" style={inputStyle} />
            </div>
          </div>

          {/* Dimensões */}
          <div>
            {label('Dimensões para Frete')}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '10px' }}>
              {[
                { k: 'peso', p: 'Peso (kg)' },
                { k: 'altura', p: 'Altura (cm)' },
                { k: 'largura', p: 'Largura (cm)' },
                { k: 'comprimento', p: 'Comp. (cm)' },
              ].map(({ k, p }) => (
                <div key={k}>
                  <p style={{ fontSize: '11px', color: sub, margin: '0 0 4px' }}>{p}</p>
                  <input type="number" min="0" step="0.1" value={form[k]} onChange={e => set(k, e.target.value)} placeholder="0" style={inputStyle} />
                </div>
              ))}
            </div>
          </div>

          {/* CEP */}
          <div>
            {label('CEP de Origem')}
            <input
              value={form.cepOrigem}
              onChange={e => set('cepOrigem', e.target.value.replace(/\D/g, '').replace(/(\d{5})(\d)/, '$1-$2').slice(0, 9))}
              placeholder="00000-000"
              style={inputStyle}
            />
          </div>

          {erro && <p style={{ color: '#ef4444', fontSize: '13px', margin: 0 }}>{erro}</p>}

          <button type="submit" disabled={loading} style={{
            padding: '16px', borderRadius: '12px', border: 'none',
            backgroundColor: '#c0606a', color: 'white', fontSize: '15px', fontWeight: '700', cursor: 'pointer'
          }}>{loading ? 'Enviando...' : '📤 Enviar para Análise'}</button>
        </div>
      </form>
    </div>
  );
}

export default CadastrarProduto;
