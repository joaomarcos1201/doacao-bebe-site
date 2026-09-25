import React, { useEffect, useRef, useState } from 'react';
import { Loader2, AlertTriangle } from 'lucide-react';
import { formatarCep, consultarCep } from '../../utils/cep';

const CONSERVACOES = ['Novo', 'Seminovo', 'Bom Estado', 'Com Marcas de Uso'];
const FAIXAS = ['0 a 3 meses', '0 a 6 meses', '0 a 12 meses', '0 a 18 meses', '0 a 24 meses', '0 a 3 anos', '3 a 6 anos', 'Maternidade', 'Todas as idades'];
const CORES = ['Branco', 'Preto', 'Cinza', 'Azul', 'Rosa', 'Bege', 'Verde', 'Amarelo', 'Vermelho', 'Lilás', 'Marrom', 'Outra'];

export default function InformacoesProduto({ form, onChange, isDark }) {
  const [buscandoCep, setBuscandoCep] = useState(false);
  const [erroCep, setErroCep] = useState('');
  const [autoFilled, setAutoFilled] = useState(false);
  const ultimoCep = useRef('');

  const border = isDark ? '#2a2a2a' : '#E5E7EB';
  const text = isDark ? '#e0e0e0' : '#374151';
  const sub = isDark ? '#666' : '#9CA3AF';
  const inputBg = isDark ? '#141414' : '#fff';

  useEffect(() => {
    const numeros = (form.cepOrigem || '').replace(/\D/g, '');
    if (numeros.length !== 8 || numeros === ultimoCep.current) return;
    ultimoCep.current = numeros;
    const buscar = async () => {
      setBuscandoCep(true);
      setErroCep('');
      setAutoFilled(false);
      const resultado = await consultarCep(form.cepOrigem);
      setBuscandoCep(false);
      if (!resultado.valido) { setErroCep(resultado.erro); return; }
      setAutoFilled(true);
    };
    buscar();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.cepOrigem]);

  // Estilos base estáticos — não dependem de estado focused para evitar re-mount
  const base = {
    width: '100%', borderRadius: '10px', fontSize: '14px',
    border: `1.5px solid ${border}`,
    backgroundColor: inputBg, color: text, outline: 'none',
    boxSizing: 'border-box', fontFamily: 'inherit',
  };

  const Label = ({ children, required }) => (
    <label style={{ fontSize: '11px', fontWeight: '700', color: sub, textTransform: 'uppercase', letterSpacing: '0.6px', display: 'block', marginBottom: '7px' }}>
      {children}{required && <span style={{ color: '#EF4444' }}> *</span>}
    </label>
  );

  return (
    <>
      <style>{`
        .ip-input, .ip-select, .ip-textarea {
          padding: 11px 14px 11px 14px;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .ip-input:focus, .ip-select:focus, .ip-textarea:focus {
          border-color: #c0606a !important;
          box-shadow: 0 0 0 3px rgba(192,96,106,0.12) !important;
          outline: none;
        }
        .ip-select { appearance: none; cursor: pointer; }
        .ip-textarea { resize: vertical; line-height: 1.6; }
        .ip-cep-input {
          padding: 11px 80px 11px 14px;
          font-size: 15px; font-weight: 600; letter-spacing: 1px;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .ip-cep-input:focus {
          border-color: #c0606a !important;
          box-shadow: 0 0 0 3px rgba(192,96,106,0.12) !important;
          outline: none;
        }
        @keyframes ip-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>

        {/* Título */}
        <div>
          <Label required>Título do Anúncio</Label>
          <input
            className="ip-input"
            value={form.nome}
            onChange={e => onChange('nome', e.target.value)}
            placeholder="Ex: Carrinho de Bebê Burigotto Cinza Seminovo"
            style={base}
            maxLength={80}
          />
          <div style={{ fontSize: '11px', color: sub, marginTop: '4px', textAlign: 'right' }}>
            {form.nome.length}/80
          </div>
        </div>

        {/* Marca + Cor */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          <div>
            <Label>Marca</Label>
            <input
              className="ip-input"
              value={form.marca}
              onChange={e => onChange('marca', e.target.value)}
              placeholder="Ex: Burigotto"
              style={base}
            />
          </div>
          <div>
            <Label>Cor</Label>
            <select
              className="ip-select"
              value={form.cor}
              onChange={e => onChange('cor', e.target.value)}
              style={base}
            >
              <option value="">Selecione</option>
              {CORES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {/* Conservação + Faixa etária */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          <div>
            <Label required>Conservação</Label>
            <select
              className="ip-select"
              value={form.conservacao}
              onChange={e => onChange('conservacao', e.target.value)}
              style={base}
            >
              <option value="">Selecione</option>
              {CONSERVACOES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <Label>Faixa Etária</Label>
            <select
              className="ip-select"
              value={form.faixaEtaria}
              onChange={e => onChange('faixaEtaria', e.target.value)}
              style={base}
            >
              <option value="">Selecione</option>
              {FAIXAS.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
        </div>

        {/* Descrição */}
        <div>
          <Label required>Descrição</Label>
          <textarea
            className="ip-textarea"
            value={form.descricao}
            onChange={e => onChange('descricao', e.target.value)}
            placeholder="Descreva o produto, estado, detalhes importantes..."
            rows={4}
            style={base}
          />
          {form.descricao.length > 0 && form.descricao.length < 30 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#D97706', marginTop: '6px' }}>
              <AlertTriangle size={13} strokeWidth={2} />
              Descrição muito curta. Adicione mais detalhes para atrair compradores.
            </div>
          )}
        </div>

        {/* CEP */}
        <div>
          <Label required>CEP de Origem</Label>
          <div style={{ position: 'relative' }}>
            <input
              className="ip-cep-input"
              value={form.cepOrigem}
              onChange={e => {
                const v = formatarCep(e.target.value);
                onChange('cepOrigem', v);
                setErroCep('');
                setAutoFilled(false);
                ultimoCep.current = '';
              }}
              placeholder="00000-000"
              maxLength={9}
              style={{
                ...base,
                borderColor: erroCep ? '#EF4444' : autoFilled ? '#22C55E' : border,
                boxShadow: erroCep ? '0 0 0 3px rgba(239,68,68,0.1)' : autoFilled ? '0 0 0 3px rgba(34,197,94,0.1)' : 'none',
              }}
            />
            {buscandoCep && (
              <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)' }}>
                <Loader2 size={16} color="#c0606a" strokeWidth={2} style={{ animation: 'ip-spin 0.7s linear infinite' }} />
              </span>
            )}
            {autoFilled && !buscandoCep && (
              <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '11px', fontWeight: '700', color: '#22C55E' }}>
                CEP válido
              </span>
            )}
          </div>
          {erroCep && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '5px' }}>
              <AlertTriangle size={12} color="#EF4444" strokeWidth={2} />
              <span style={{ fontSize: '12px', color: '#EF4444' }}>{erroCep}</span>
            </div>
          )}
          <a
            href="https://buscacepinter.correios.com.br/app/endereco/index.php"
            target="_blank" rel="noopener noreferrer"
            style={{ fontSize: '12px', color: '#c0606a', textDecoration: 'none', display: 'inline-block', marginTop: '5px', opacity: 0.85 }}
            onMouseEnter={e => e.target.style.textDecoration = 'underline'}
            onMouseLeave={e => e.target.style.textDecoration = 'none'}
          >
            Não sei meu CEP
          </a>
        </div>

      </div>
    </>
  );
}
