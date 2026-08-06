import React from 'react';

const ETAPAS = [
  { label: 'Fotos', pct: 20 },
  { label: 'Categoria', pct: 40 },
  { label: 'Informações', pct: 60 },
  { label: 'Revisão', pct: 80 },
  { label: 'Publicar', pct: 100 },
];

export default function BarraProgresso({ etapaAtual, isDark }) {
  const pct = ETAPAS[etapaAtual]?.pct || 0;
  const border = isDark ? '#2a2a2a' : '#f0e6e8';
  const sub = isDark ? '#666' : '#aaa';

  return (
    <div style={{ marginBottom: '28px' }}>
      {/* Barra */}
      <div style={{
        width: '100%', height: '4px', borderRadius: '99px',
        backgroundColor: isDark ? '#2a2a2a' : '#f0e6e8',
        marginBottom: '10px', overflow: 'hidden',
      }}>
        <div style={{
          height: '100%', borderRadius: '99px',
          background: 'linear-gradient(90deg, #c0606a, #e8909a)',
          width: `${pct}%`, transition: 'width 0.4s ease',
        }} />
      </div>

      {/* Labels */}
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        {ETAPAS.map((e, i) => (
          <div key={i} style={{ textAlign: 'center', flex: 1 }}>
            <div style={{
              width: '24px', height: '24px', borderRadius: '50%', margin: '0 auto 4px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '11px', fontWeight: '700',
              backgroundColor: i <= etapaAtual ? '#c0606a' : (isDark ? '#2a2a2a' : '#f0e6e8'),
              color: i <= etapaAtual ? '#fff' : sub,
              transition: 'all 0.3s',
            }}>
              {i < etapaAtual ? '✓' : i + 1}
            </div>
            <div style={{
              fontSize: '10px', fontWeight: i === etapaAtual ? '700' : '400',
              color: i === etapaAtual ? '#c0606a' : sub,
              transition: 'color 0.3s',
            }}>
              {e.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
