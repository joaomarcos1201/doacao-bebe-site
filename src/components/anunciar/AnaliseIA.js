import React, { useEffect, useState } from 'react';

const ETAPAS = [
  'Analisando suas fotos...',
  'Identificando o produto...',
  'Detectando categoria...',
  'Verificando marca e cor...',
  'Gerando título e descrição...',
  'Sugerindo preço de mercado...',
];

export default function AnaliseIA({ isDark }) {
  const [etapa, setEtapa] = useState(0);
  const [progresso, setProgresso] = useState(0);

  useEffect(() => {
    const intervalo = setInterval(() => {
      setEtapa(e => Math.min(e + 1, ETAPAS.length - 1));
      setProgresso(p => Math.min(p + 100 / ETAPAS.length, 95));
    }, 360);
    return () => clearInterval(intervalo);
  }, []);

  const bg = isDark ? '#1a1a1a' : '#fff';
  const border = isDark ? '#2a2a2a' : '#f0e6e8';
  const sub = isDark ? '#888' : '#888';
  const text = isDark ? '#e0e0e0' : '#333';

  return (
    <div style={{
      backgroundColor: bg, borderRadius: '20px',
      border: `1px solid ${border}`, padding: '32px 28px',
      textAlign: 'center',
    }}>
      {/* Ícone animado */}
      <div style={{
        width: '72px', height: '72px', borderRadius: '50%',
        background: 'linear-gradient(135deg, #c0606a, #e8909a)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '32px', margin: '0 auto 20px',
        animation: 'iaPulse 1.4s ease-in-out infinite',
      }}>✨</div>

      <h3 style={{ fontSize: '18px', fontWeight: '800', color: text, margin: '0 0 6px' }}>
        IA analisando suas fotos
      </h3>
      <p style={{ fontSize: '14px', color: '#c0606a', fontWeight: '600', margin: '0 0 24px', minHeight: '20px' }}>
        {ETAPAS[etapa]}
      </p>

      {/* Barra de progresso */}
      <div style={{
        width: '100%', height: '6px', borderRadius: '99px',
        backgroundColor: isDark ? '#2a2a2a' : '#f0e6e8', overflow: 'hidden', marginBottom: '24px',
      }}>
        <div style={{
          height: '100%', borderRadius: '99px',
          background: 'linear-gradient(90deg, #c0606a, #e8909a)',
          width: `${progresso}%`,
          transition: 'width 0.35s ease',
        }} />
      </div>

      {/* Skeleton cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', textAlign: 'left' }}>
        {[...Array(4)].map((_, i) => (
          <div key={i} style={{
            backgroundColor: isDark ? '#222' : '#f9f5f6',
            borderRadius: '12px', padding: '14px',
          }}>
            <div style={{
              height: '10px', borderRadius: '6px', marginBottom: '8px',
              backgroundColor: isDark ? '#333' : '#ecdde0',
              width: '60%', animation: 'skeletonShimmer 1.5s ease-in-out infinite',
            }} />
            <div style={{
              height: '14px', borderRadius: '6px',
              backgroundColor: isDark ? '#2a2a2a' : '#f0e6e8',
              width: '80%', animation: 'skeletonShimmer 1.5s ease-in-out infinite 0.2s',
            }} />
          </div>
        ))}
      </div>

      <style>{`
        @keyframes iaPulse {
          0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(192,96,106,0.4); }
          50% { transform: scale(1.08); box-shadow: 0 0 0 12px rgba(192,96,106,0); }
        }
        @keyframes skeletonShimmer {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
