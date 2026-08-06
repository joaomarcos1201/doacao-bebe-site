import React from 'react';
import { Camera, Tag, Info, Search, Send } from 'lucide-react';

const ETAPAS = [
  { label: 'Fotos', Icon: Camera },
  { label: 'Categoria', Icon: Tag },
  { label: 'Informações', Icon: Info },
  { label: 'Revisão', Icon: Search },
  { label: 'Publicar', Icon: Send },
];

export default function BarraProgresso({ etapaAtual, isDark }) {
  const trackColor = isDark ? '#2a2a2a' : '#E5E7EB';
  const sub = isDark ? '#555' : '#9CA3AF';

  return (
    <div style={{ marginBottom: '32px', padding: '0 4px' }}>
      <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
        {/* Linha de fundo */}
        <div style={{
          position: 'absolute', top: '18px', left: '18px', right: '18px',
          height: '2px', backgroundColor: trackColor, zIndex: 0,
        }} />
        {/* Linha de progresso */}
        <div style={{
          position: 'absolute', top: '18px', left: '18px',
          height: '2px', zIndex: 1, transition: 'width 0.4s ease',
          background: 'linear-gradient(90deg, #F48FB1, #c0606a)',
          width: etapaAtual === 0 ? '0%' : `${(etapaAtual / (ETAPAS.length - 1)) * 100}%`,
        }} />

        {ETAPAS.map(({ label, Icon }, i) => {
          const done = i < etapaAtual;
          const active = i === etapaAtual;
          return (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2 }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.3s ease',
                backgroundColor: done ? '#c0606a' : active ? '#fff' : (isDark ? '#1a1a1a' : '#fff'),
                border: active ? '2px solid #c0606a' : done ? '2px solid #c0606a' : `2px solid ${trackColor}`,
                boxShadow: active ? '0 0 0 4px rgba(192,96,106,0.15)' : 'none',
              }}>
                <Icon
                  size={15}
                  strokeWidth={2}
                  color={done ? '#fff' : active ? '#c0606a' : sub}
                />
              </div>
              <span style={{
                fontSize: '10px', fontWeight: active ? '700' : '500',
                color: active ? '#c0606a' : done ? '#c0606a' : sub,
                marginTop: '6px', transition: 'color 0.3s', letterSpacing: '0.3px',
              }}>
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
