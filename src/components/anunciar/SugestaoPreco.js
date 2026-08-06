import React, { useState } from 'react';
import { Bot, BadgeDollarSign, AlertTriangle, TrendingDown, TrendingUp } from 'lucide-react';

export default function SugestaoPreco({ preco, onChange, precoSugerido, isDark }) {
  const [focused, setFocused] = useState(false);

  const border = isDark ? '#2a2a2a' : '#E5E7EB';
  const text = isDark ? '#e0e0e0' : '#374151';
  const sub = isDark ? '#666' : '#9CA3AF';
  const inputBg = isDark ? '#141414' : '#fff';

  const precoNum = parseFloat(preco) || 0;
  const abaixo = precoSugerido && precoNum > 0 && precoNum < precoSugerido.min * 0.5;
  const acima = precoSugerido && precoNum > precoSugerido.max * 1.5;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {precoSugerido && (
        <div style={{
          backgroundColor: isDark ? '#0a1a2a' : '#F0F9FF',
          border: `1.5px solid ${isDark ? '#1a3a5a' : '#BAE6FD'}`,
          borderRadius: '14px', padding: '18px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '8px',
              backgroundColor: isDark ? '#1a3a5a' : '#E0F2FE',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Bot size={16} color={isDark ? '#7DD3FC' : '#0369A1'} strokeWidth={1.5} />
            </div>
            <span style={{ fontSize: '13px', fontWeight: '700', color: isDark ? '#7DD3FC' : '#0369A1' }}>
              Sugestão baseada em anúncios semelhantes
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: '10px', color: sub, fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Sugerido</div>
              <div style={{ fontSize: '26px', fontWeight: '800', color: '#c0606a', lineHeight: 1 }}>
                R$ {precoSugerido.sugerido}
              </div>
            </div>
            <div style={{ flex: 1, minWidth: '120px' }}>
              <div style={{ fontSize: '10px', color: sub, fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Faixa recomendada</div>
              <div style={{
                height: '4px', borderRadius: '99px',
                background: `linear-gradient(90deg, ${isDark ? '#1a3a5a' : '#BAE6FD'}, #c0606a, ${isDark ? '#1a3a5a' : '#BAE6FD'})`,
                marginBottom: '6px',
              }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: sub, fontWeight: '600' }}>
                <span>R$ {precoSugerido.min}</span>
                <span>R$ {precoSugerido.max}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onChange(String(precoSugerido.sugerido))}
            style={{
              marginTop: '14px', padding: '7px 16px', borderRadius: '8px',
              border: `1px solid ${isDark ? '#1a3a5a' : '#BAE6FD'}`,
              backgroundColor: 'transparent', color: isDark ? '#7DD3FC' : '#0369A1',
              fontSize: '12px', fontWeight: '700', cursor: 'pointer',
              transition: 'background-color 0.15s',
            }}
          >
            Usar preço sugerido
          </button>
        </div>
      )}

      <div>
        <label style={{ fontSize: '11px', fontWeight: '700', color: sub, textTransform: 'uppercase', letterSpacing: '0.6px', display: 'block', marginBottom: '7px' }}>
          Seu Preço (R$) <span style={{ color: '#EF4444' }}>*</span>
        </label>
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
            <BadgeDollarSign size={18} strokeWidth={1.8} color={sub} />
          </div>
          <input
            type="number" min="0" step="0.01"
            value={preco}
            onChange={e => onChange(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="0,00"
            style={{
              width: '100%', padding: '13px 14px 13px 42px', borderRadius: '10px',
              fontSize: '20px', fontWeight: '700',
              border: `1.5px solid ${abaixo || acima ? '#F59E0B' : focused ? '#c0606a' : border}`,
              backgroundColor: inputBg, color: text, outline: 'none',
              boxSizing: 'border-box', fontFamily: 'inherit',
              transition: 'border-color 0.2s, box-shadow 0.2s',
              boxShadow: focused ? '0 0 0 3px rgba(192,96,106,0.1)' : 'none',
            }}
          />
        </div>
        {abaixo && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#D97706', marginTop: '6px' }}>
            <TrendingDown size={13} strokeWidth={2} />
            Preço muito abaixo da média. Verifique se está correto.
          </div>
        )}
        {acima && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#D97706', marginTop: '6px' }}>
            <TrendingUp size={13} strokeWidth={2} />
            Preço muito acima da média. Pode dificultar a venda.
          </div>
        )}
      </div>
    </div>
  );
}
