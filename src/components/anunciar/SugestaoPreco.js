import React from 'react';

export default function SugestaoPreco({ preco, onChange, precoSugerido, isDark }) {
  const border = isDark ? '#2a2a2a' : '#f0e6e8';
  const text = isDark ? '#e0e0e0' : '#333';
  const sub = isDark ? '#888' : '#888';
  const inputBg = isDark ? '#141414' : '#fdf5f6';

  const precoNum = parseFloat(preco) || 0;
  const abaixo = precoSugerido && precoNum > 0 && precoNum < precoSugerido.min * 0.5;
  const acima = precoSugerido && precoNum > precoSugerido.max * 1.5;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* Card de sugestão */}
      {precoSugerido && (
        <div style={{
          backgroundColor: isDark ? '#0a1a2a' : '#f0f9ff',
          border: `1px solid ${isDark ? '#1a3a5a' : '#bae6fd'}`,
          borderRadius: '14px', padding: '16px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <span style={{ fontSize: '18px' }}>🤖</span>
            <span style={{ fontSize: '13px', fontWeight: '700', color: isDark ? '#7dd3fc' : '#0369a1' }}>
              Sugestão de preço baseada em anúncios semelhantes
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '11px', color: sub, fontWeight: '600', marginBottom: '2px' }}>SUGERIDO</div>
              <div style={{ fontSize: '24px', fontWeight: '800', color: '#c0606a' }}>
                R$ {precoSugerido.sugerido}
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '11px', color: sub, fontWeight: '600', marginBottom: '6px' }}>FAIXA RECOMENDADA</div>
              <div style={{
                height: '6px', borderRadius: '99px',
                background: `linear-gradient(90deg, ${isDark ? '#1a3a5a' : '#bae6fd'}, #c0606a, ${isDark ? '#1a3a5a' : '#bae6fd'})`,
                position: 'relative', marginBottom: '4px',
              }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: sub }}>
                <span>R$ {precoSugerido.min}</span>
                <span>R$ {precoSugerido.max}</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => onChange(String(precoSugerido.sugerido))}
            style={{
              marginTop: '10px', padding: '6px 14px', borderRadius: '8px',
              border: `1px solid ${isDark ? '#1a3a5a' : '#bae6fd'}`,
              backgroundColor: 'transparent', color: isDark ? '#7dd3fc' : '#0369a1',
              fontSize: '12px', fontWeight: '600', cursor: 'pointer',
            }}
          >
            Usar preço sugerido
          </button>
        </div>
      )}

      {/* Input de preço */}
      <div>
        <label style={{ fontSize: '12px', fontWeight: '700', color: sub, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '6px' }}>
          Seu Preço (R$) <span style={{ color: '#ef4444' }}>*</span>
        </label>
        <div style={{ position: 'relative' }}>
          <span style={{
            position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
            fontSize: '15px', fontWeight: '700', color: sub,
          }}>R$</span>
          <input
            type="number"
            min="0"
            step="0.01"
            value={preco}
            onChange={e => onChange(e.target.value)}
            placeholder="0,00"
            style={{
              width: '100%', padding: '14px 14px 14px 42px', borderRadius: '10px',
              fontSize: '18px', fontWeight: '700',
              border: `1px solid ${abaixo || acima ? '#f59e0b' : border}`,
              backgroundColor: inputBg, color: text, outline: 'none',
              boxSizing: 'border-box', fontFamily: 'inherit',
            }}
          />
        </div>
        {abaixo && (
          <p style={{ fontSize: '12px', color: '#f59e0b', margin: '6px 0 0' }}>
            ⚠️ Preço muito abaixo da média. Verifique se está correto.
          </p>
        )}
        {acima && (
          <p style={{ fontSize: '12px', color: '#f59e0b', margin: '6px 0 0' }}>
            ⚠️ Preço muito acima da média. Pode dificultar a venda.
          </p>
        )}
      </div>
    </div>
  );
}
