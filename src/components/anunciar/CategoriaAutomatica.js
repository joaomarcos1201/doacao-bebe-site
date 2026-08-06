import React from 'react';
import { CATEGORIAS_MAP } from '../../services/iaService';

export default function CategoriaAutomatica({ categoria, subcategoria, sugestoes, confianca, onChange, isDark }) {
  const border = isDark ? '#2a2a2a' : '#f0e6e8';
  const text = isDark ? '#e0e0e0' : '#333';
  const sub = isDark ? '#888' : '#888';
  const bg = isDark ? '#1a1a1a' : '#fdf5f6';

  const subcats = categoria ? (CATEGORIAS_MAP[categoria]?.subcategorias || []) : [];
  const baixaConfianca = confianca < 0.7;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Badge de confiança */}
      {confianca > 0 && (
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          backgroundColor: baixaConfianca ? (isDark ? '#2a2200' : '#fffbeb') : (isDark ? '#0a2a1a' : '#f0fdf4'),
          border: `1px solid ${baixaConfianca ? '#f59e0b' : '#22c55e'}`,
          borderRadius: '99px', padding: '4px 12px', alignSelf: 'flex-start',
          fontSize: '12px', fontWeight: '600',
          color: baixaConfianca ? '#f59e0b' : '#16a34a',
        }}>
          {baixaConfianca ? '⚠️' : '✅'}
          {baixaConfianca
            ? `Confiança baixa (${Math.round(confianca * 100)}%) — confirme a categoria`
            : `IA identificou com ${Math.round(confianca * 100)}% de confiança`}
        </div>
      )}

      {/* Sugestões quando confiança baixa */}
      {baixaConfianca && sugestoes?.length > 0 && (
        <div>
          <p style={{ fontSize: '13px', color: sub, margin: '0 0 8px', fontWeight: '600' }}>
            Sugestões da IA — escolha a mais adequada:
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {sugestoes.map((s, i) => (
              <button
                key={i}
                onClick={() => onChange({ categoria: s.categoria, subcategoria: s.subcategoria })}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '12px 14px', borderRadius: '12px', cursor: 'pointer',
                  border: `1px solid ${categoria === s.categoria ? '#c0606a' : border}`,
                  backgroundColor: categoria === s.categoria ? (isDark ? '#2a1a1c' : '#fff0f2') : bg,
                  color: text, fontSize: '14px', fontWeight: '600', textAlign: 'left',
                  transition: 'all 0.15s',
                }}
              >
                <span style={{ fontSize: '20px' }}>{CATEGORIAS_MAP[s.categoria]?.icon}</span>
                <div>
                  <div>{CATEGORIAS_MAP[s.categoria]?.label}</div>
                  <div style={{ fontSize: '12px', color: sub, fontWeight: '400' }}>{s.subcategoria}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Grid de categorias */}
      <div>
        <label style={{ fontSize: '12px', fontWeight: '700', color: sub, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '8px' }}>
          Categoria <span style={{ color: '#ef4444' }}>*</span>
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
          {Object.entries(CATEGORIAS_MAP).map(([key, val]) => (
            <button
              key={key}
              onClick={() => onChange({ categoria: key, subcategoria: '' })}
              style={{
                padding: '10px 6px', borderRadius: '12px', cursor: 'pointer',
                border: `1px solid ${categoria === key ? '#c0606a' : border}`,
                backgroundColor: categoria === key ? (isDark ? '#2a1a1c' : '#fff0f2') : bg,
                color: categoria === key ? '#c0606a' : text,
                fontSize: '12px', fontWeight: categoria === key ? '700' : '500',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
                transition: 'all 0.15s',
              }}
            >
              <span style={{ fontSize: '20px' }}>{val.icon}</span>
              <span style={{ lineHeight: '1.2', textAlign: 'center' }}>{val.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Subcategoria */}
      {subcats.length > 0 && (
        <div>
          <label style={{ fontSize: '12px', fontWeight: '700', color: sub, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '8px' }}>
            Subcategoria <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {subcats.map(s => (
              <button
                key={s}
                onClick={() => onChange({ categoria, subcategoria: s })}
                style={{
                  padding: '8px 14px', borderRadius: '99px', cursor: 'pointer',
                  border: `1px solid ${subcategoria === s ? '#c0606a' : border}`,
                  backgroundColor: subcategoria === s ? '#c0606a' : bg,
                  color: subcategoria === s ? '#fff' : text,
                  fontSize: '13px', fontWeight: '600',
                  transition: 'all 0.15s',
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
