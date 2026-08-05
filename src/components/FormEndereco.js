import React, { useEffect, useRef, useState } from 'react';
import { formatarCep, validarFormatoCep, consultarCep } from '../utils/cep';

const CAMPOS = [
  { key: 'logradouro', label: 'Rua / Avenida',   placeholder: 'Ex: Rua das Flores',      col: 'full', autoFill: true  },
  { key: 'numero',     label: 'Número',           placeholder: 'Ex: 123',                 col: 'half', autoFill: false },
  { key: 'complemento',label: 'Complemento',      placeholder: 'Apto, Bloco, Casa…',      col: 'half', autoFill: false },
  { key: 'bairro',     label: 'Bairro',           placeholder: 'Ex: Centro',              col: 'full', autoFill: true  },
  { key: 'cidade',     label: 'Cidade',           placeholder: '',                        col: 'half', autoFill: true  },
  { key: 'estado',     label: 'Estado',           placeholder: '',                        col: 'half', autoFill: true  },
];

const inputBase = (isDark, border, text, hasError, readOnly) => ({
  width: '100%',
  padding: '11px 12px',
  borderRadius: '10px',
  fontSize: '14px',
  border: `1.5px solid ${hasError ? '#ef4444' : border}`,
  backgroundColor: readOnly
    ? (isDark ? '#1e1e1e' : '#f3f3f3')
    : (isDark ? '#1a1a1a' : '#fff'),
  color: readOnly ? (isDark ? '#666' : '#999') : text,
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.2s',
  cursor: readOnly ? 'default' : 'text',
});

function Campo({ campo, value, onChange, isDark, border, text, sub, erro, autoFilled }) {
  const readOnly = campo.autoFill && autoFilled && !!value;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <label style={{ fontSize: '12px', fontWeight: '600', color: sub, display: 'flex', alignItems: 'center', gap: '4px' }}>
        {campo.label}
        {campo.key !== 'complemento' && <span style={{ color: '#ef4444' }}>*</span>}
        {readOnly && (
          <span style={{ fontSize: '10px', color: '#4caf50', fontWeight: '700', marginLeft: '4px' }}>
            ✓ preenchido automaticamente
          </span>
        )}
      </label>
      <input
        value={value}
        onChange={e => onChange(campo.key, e.target.value)}
        placeholder={campo.placeholder}
        readOnly={readOnly}
        style={inputBase(isDark, border, text, !!erro, readOnly)}
        onFocus={e => { if (!readOnly) e.target.style.borderColor = '#c0606a'; }}
        onBlur={e => { e.target.style.borderColor = erro ? '#ef4444' : border; }}
      />
      {erro && <span style={{ fontSize: '11px', color: '#ef4444' }}>{erro}</span>}
    </div>
  );
}

function Spinner({ border }) {
  return (
    <span style={{
      display: 'inline-block', width: '14px', height: '14px', flexShrink: 0,
      border: `2px solid ${border}`, borderTopColor: '#c0606a',
      borderRadius: '50%', animation: 'spin 0.7s linear infinite',
    }} />
  );
}

/**
 * FormEndereco
 * Props:
 *   cep, onCepChange — controle externo do CEP
 *   endereco, onEnderecoChange — objeto { logradouro, numero, complemento, bairro, cidade, estado }
 *   onEnderecoValido(endereco) — chamado quando todos os campos obrigatórios estão preenchidos
 *   isDark, border, text, sub — tema
 *   erroCep, onErroCep — controle externo do erro de CEP
 */
function FormEndereco({ cep, onCepChange, endereco, onEnderecoChange, onEnderecoValido, isDark, border, text, sub, erroCep, onErroCep }) {
  const [buscando, setBuscando] = useState(false);
  const [autoFilled, setAutoFilled] = useState(false);
  const [errosCampos, setErrosCampos] = useState({});
  const ultimoCep = useRef('');

  // Busca automática ao completar 8 dígitos
  useEffect(() => {
    const numeros = cep.replace(/\D/g, '');
    if (numeros.length !== 8 || numeros === ultimoCep.current) return;
    ultimoCep.current = numeros;

    const buscar = async () => {
      setBuscando(true);
      onErroCep('');
      setAutoFilled(false);
      const resultado = await consultarCep(cep);
      setBuscando(false);
      if (!resultado.valido) { onErroCep(resultado.erro); return; }
      const { logradouro, bairro, cidade, estado } = resultado.endereco;
      onEnderecoChange({ ...endereco, logradouro, bairro, cidade, estado, numero: '', complemento: '' });
      setAutoFilled(true);
    };
    buscar();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cep]);

  const handleCampo = (key, value) => {
    onEnderecoChange({ ...endereco, [key]: value });
    if (errosCampos[key]) setErrosCampos(prev => ({ ...prev, [key]: '' }));
  };

  const validar = () => {
    const obrigatorios = CAMPOS.filter(c => c.key !== 'complemento').map(c => c.key);
    const erros = {};
    obrigatorios.forEach(k => { if (!endereco[k]?.trim()) erros[k] = 'Campo obrigatório'; });
    setErrosCampos(erros);
    return Object.keys(erros).length === 0;
  };

  const handleConfirmar = () => {
    if (validar()) onEnderecoValido(endereco);
  };

  const cepCompleto = validarFormatoCep(cep);

  return (
    <div>
      {/* Campo CEP */}
      <div style={{ marginBottom: '16px' }}>
        <label style={{ fontSize: '12px', fontWeight: '600', color: sub, display: 'block', marginBottom: '4px' }}>
          CEP <span style={{ color: '#ef4444' }}>*</span>
        </label>
        <div style={{ position: 'relative' }}>
          <input
            value={cep}
            onChange={e => { onCepChange(formatarCep(e.target.value)); onErroCep(''); setAutoFilled(false); ultimoCep.current = ''; }}
            placeholder="00000-000"
            maxLength={9}
            style={{
              ...inputBase(isDark, border, text, !!erroCep, false),
              paddingRight: buscando ? '40px' : '12px',
              fontSize: '16px', fontWeight: '600', letterSpacing: '2px',
            }}
            onFocus={e => { e.target.style.borderColor = '#c0606a'; }}
            onBlur={e => { e.target.style.borderColor = erroCep ? '#ef4444' : border; }}
          />
          {buscando && (
            <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)' }}>
              <Spinner border={border} />
            </span>
          )}
        </div>
        {erroCep && <p style={{ fontSize: '12px', color: '#ef4444', margin: '4px 0 0' }}>{erroCep}</p>}
        <a
          href="https://buscacepinter.correios.com.br/app/endereco/index.php"
          target="_blank" rel="noopener noreferrer"
          style={{ fontSize: '12px', color: '#c0606a', textDecoration: 'none', opacity: 0.85, display: 'inline-block', marginTop: '4px' }}
          onMouseEnter={e => e.target.style.textDecoration = 'underline'}
          onMouseLeave={e => e.target.style.textDecoration = 'none'}
        >Não sei meu CEP</a>
      </div>

      {/* Campos de endereço — aparecem após CEP válido */}
      {cepCompleto && !erroCep && (
        <div style={{ animation: 'fadeSlideIn 0.25s ease' }}>
          {/* Linha: rua */}
          <div style={{ marginBottom: '12px' }}>
            <Campo campo={CAMPOS[0]} value={endereco.logradouro || ''} onChange={handleCampo}
              isDark={isDark} border={border} text={text} sub={sub}
              erro={errosCampos.logradouro} autoFilled={autoFilled} />
          </div>

          {/* Linha: número + complemento */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
            {[CAMPOS[1], CAMPOS[2]].map(c => (
              <Campo key={c.key} campo={c} value={endereco[c.key] || ''} onChange={handleCampo}
                isDark={isDark} border={border} text={text} sub={sub}
                erro={errosCampos[c.key]} autoFilled={autoFilled} />
            ))}
          </div>

          {/* Linha: bairro */}
          <div style={{ marginBottom: '12px' }}>
            <Campo campo={CAMPOS[3]} value={endereco.bairro || ''} onChange={handleCampo}
              isDark={isDark} border={border} text={text} sub={sub}
              erro={errosCampos.bairro} autoFilled={autoFilled} />
          </div>

          {/* Linha: cidade + estado */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px', gap: '12px', marginBottom: '20px' }}>
            {[CAMPOS[4], CAMPOS[5]].map(c => (
              <Campo key={c.key} campo={c} value={endereco[c.key] || ''} onChange={handleCampo}
                isDark={isDark} border={border} text={text} sub={sub}
                erro={errosCampos[c.key]} autoFilled={autoFilled} />
            ))}
          </div>

          <button
            onClick={handleConfirmar}
            disabled={buscando}
            style={{
              width: '100%', padding: '14px', borderRadius: '12px', border: 'none',
              backgroundColor: '#c0606a', color: '#fff', fontSize: '15px', fontWeight: '700',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            }}
          >
            {buscando ? <><Spinner border="rgba(255,255,255,0.4)" /> Buscando endereço...</> : 'Confirmar Endereço →'}
          </button>
        </div>
      )}
    </div>
  );
}

export default FormEndereco;
