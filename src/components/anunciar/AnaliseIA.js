import React, { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';

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
  const border = isDark ? '#2a2a2a' : '#E5E7EB';
  const sub = isDark ? '#666' : '#9CA3AF';
  const text = isDark ? '#e0e0e0' : '#374151';
  const skeletonBg = isDark ? '#2a2a2a' : '#F3F4F6';
  const skeletonShine = isDark ? '#333' : '#E5E7EB';

  return (
    <div style={{
      backgroundColor: bg, borderRadius: '20px',
      border: `1px solid ${border}`, padding: '32px 28px',
      textAlign: 'center',
    }}>
      <div style={{
        width: '64px', height: '64px', borderRadius: '16px',
        background: 'linear-gradient(135deg, #F48FB1, #c0606a)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 20px',
        animation: 'iaPulse 1.4s ease-in-out infinite',
      }}>
        <Sparkles size={28} color="#fff" strokeWidth={1.5} />
      </div>

      <h3 style={{ fontSize: '17px', fontWeight: '700', color: text, margin: '0 0 6px' }}>
        IA analisando suas fotos
      </h3>
      <p style={{ fontSize: '13px', color: '#c0606a', fontWeight: '600', margin: '0 0 24px', minHeight: '20px' }}>
        {ETAPAS[etapa]}
      </p>

      <div style={{
        width: '100%', height: '4px', borderRadius: '99px',
        backgroundColor: isDark ? '#2a2a2a' : '#F3F4F6', overflow: 'hidden', marginBottom: '28px',
      }}>
        <div style={{
          height: '100%', borderRadius: '99px',
          background: 'linear-gradient(90deg, #F48FB1, #c0606a)',
          width: `${progresso}%`, transition: 'width 0.35s ease',
        }} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', textAlign: 'left' }}>
        {[...Array(4)].map((_, i) => (
          <div key={i} style={{ backgroundColor: skeletonBg, borderRadius: '12px', padding: '14px' }}>
            <div style={{
              height: '8px', borderRadius: '6px', marginBottom: '10px',
              backgroundColor: skeletonShine, width: '55%',
              animation: 'skeletonShimmer 1.5s ease-in-out infinite',
            }} />
            <div style={{
              height: '12px', borderRadius: '6px',
              backgroundColor: isDark ? '#333' : '#E5E7EB', width: '80%',
              animation: `skeletonShimmer 1.5s ease-in-out infinite ${i * 0.15}s`,
            }} />
          </div>
        ))}
      </div>

      <style>{`
        @keyframes iaPulse {
          0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(192,96,106,0.3); }
          50% { transform: scale(1.06); box-shadow: 0 0 0 10px rgba(192,96,106,0); }
        }
        @keyframes skeletonShimmer {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
