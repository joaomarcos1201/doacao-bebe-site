import React from 'react';

const CONSERVACOES = ['Novo', 'Seminovo', 'Bom Estado', 'Com Marcas de Uso'];
const FAIXAS = ['0 a 3 meses', '0 a 6 meses', '0 a 12 meses', '0 a 18 meses', '0 a 24 meses', '0 a 3 anos', '3 a 6 anos', 'Maternidade', 'Todas as idades'];
const CORES = ['Branco', 'Preto', 'Cinza', 'Azul', 'Rosa', 'Bege', 'Verde', 'Amarelo', 'Vermelho', 'Lilás', 'Marrom', 'Outra'];

export default function InformacoesProduto({ form, onChange, isDark }) {
  const border = isDark ? '#2a2a2a' : '#f0e6e8';
  const text = isDark ? '#e0e0e0' : '#333';
  const sub = isDark ? '#888' : '#888';
  const inputBg = isDark ? '#141414' : '#fdf5f6';

  const input = {
    width: '100%', padding: '12px 14px', borderRadius: '10px', fontSize: '14px',
    border: `1px solid ${border}`, backgroundColor: inputBg,
    color: text, outline: 'none', boxSizing: 'border-box',
    fontFamily: 'inherit',
  };

  const Label = ({ children, required }) => (
    <label style={{ fontSize: '12px', fontWeight: '700', color: sub, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '6px' }}>
      {children}{required && <span style={{ color: '#ef4444' }}> *</span>}
    </label>
  );

  const Field = ({ children, style }) => (
    <div style={style}>{children}</div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Título */}
      <Field>
        <Label required>Título do Anúncio</Label>
        <input
          value={form.nome}
          onChange={e => onChange('nome', e.target.value)}
          placeholder="Ex: Carrinho de Bebê Burigotto Cinza Seminovo"
          style={input}
          maxLength={80}
        />
        <div style={{ fontSize: '11px', color: sub, marginTop: '4px', textAlign: 'right' }}>
          {form.nome.length}/80
        </div>
      </Field>

      {/* Marca + Cor */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
        <Field>
          <Label>Marca</Label>
          <input value={form.marca} onChange={e => onChange('marca', e.target.value)} placeholder="Ex: Burigotto" style={input} />
        </Field>
        <Field>
          <Label>Cor</Label>
          <select value={form.cor} onChange={e => onChange('cor', e.target.value)} style={input}>
            <option value="">Selecione</option>
            {CORES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </Field>
      </div>

      {/* Conservação + Faixa etária */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
        <Field>
          <Label required>Estado de Conservação</Label>
          <select value={form.conservacao} onChange={e => onChange('conservacao', e.target.value)} style={input}>
            <option value="">Selecione</option>
            {CONSERVACOES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </Field>
        <Field>
          <Label>Faixa Etária</Label>
          <select value={form.faixaEtaria} onChange={e => onChange('faixaEtaria', e.target.value)} style={input}>
            <option value="">Selecione</option>
            {FAIXAS.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
        </Field>
      </div>

      {/* Descrição */}
      <Field>
        <Label required>Descrição</Label>
        <textarea
          value={form.descricao}
          onChange={e => onChange('descricao', e.target.value)}
          placeholder="Descreva o produto, estado, detalhes importantes..."
          rows={4}
          style={{ ...input, resize: 'vertical', lineHeight: '1.5' }}
        />
        {form.descricao.length < 30 && form.descricao.length > 0 && (
          <p style={{ fontSize: '11px', color: '#f59e0b', margin: '4px 0 0' }}>
            ⚠️ Descrição muito curta. Adicione mais detalhes para atrair compradores.
          </p>
        )}
      </Field>

      {/* CEP */}
      <Field>
        <Label required>CEP de Origem</Label>
        <input
          value={form.cepOrigem}
          onChange={e => onChange('cepOrigem', e.target.value.replace(/\D/g, '').replace(/(\d{5})(\d)/, '$1-$2').slice(0, 9))}
          placeholder="00000-000"
          style={input}
        />
      </Field>
    </div>
  );
}
