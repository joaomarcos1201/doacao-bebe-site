import React, { useState } from 'react';
import { Package, ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';

function GaleriaImagem({ fotos, isDark, border }) {
  const [idx, setIdx] = useState(0);
  const [zoom, setZoom] = useState(false);
  const src = fotos[idx];

  if (!src) return (
    <div style={{ width: '100%', aspectRatio: '1', borderRadius: '16px', backgroundColor: isDark ? '#1e1e1e' : '#F9FAFB', border: `1px solid ${border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Package size={48} color={isDark ? '#333' : '#ddd'} strokeWidth={1} />
    </div>
  );

  return (
    <>
      <div style={{ position: 'relative' }}>
        <div
          onClick={() => setZoom(true)}
          style={{ width: '100%', aspectRatio: '1', borderRadius: '16px', overflow: 'hidden', border: `1px solid ${border}`, cursor: 'zoom-in', position: 'relative', backgroundColor: isDark ? '#1a1a1a' : '#fff' }}
        >
          <img src={src} alt="produto" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
            onMouseEnter={e => e.target.style.transform = 'scale(1.04)'}
            onMouseLeave={e => e.target.style.transform = 'scale(1)'}
          />
          <div style={{ position: 'absolute', bottom: '10px', right: '10px', backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: '8px', padding: '5px 8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <ZoomIn size={13} color="#fff" strokeWidth={2} />
            <span style={{ color: '#fff', fontSize: '11px', fontWeight: '600' }}>Ampliar</span>
          </div>
          {fotos.length > 1 && (
            <>
              <button onClick={e => { e.stopPropagation(); setIdx(i => (i - 1 + fotos.length) % fotos.length); }}
                style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', width: '32px', height: '32px', borderRadius: '50%', border: 'none', backgroundColor: 'rgba(0,0,0,0.5)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ChevronLeft size={16} color="#fff" strokeWidth={2.5} />
              </button>
              <button onClick={e => { e.stopPropagation(); setIdx(i => (i + 1) % fotos.length); }}
                style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', width: '32px', height: '32px', borderRadius: '50%', border: 'none', backgroundColor: 'rgba(0,0,0,0.5)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ChevronRight size={16} color="#fff" strokeWidth={2.5} />
              </button>
            </>
          )}
        </div>

        {fotos.length > 1 && (
          <div style={{ display: 'flex', gap: '8px', marginTop: '10px', overflowX: 'auto', paddingBottom: '4px' }}>
            {fotos.map((f, i) => (
              <div key={i} onClick={() => setIdx(i)}
                style={{ flexShrink: 0, width: '64px', height: '64px', borderRadius: '10px', overflow: 'hidden', cursor: 'pointer', border: `2px solid ${i === idx ? '#c0606a' : border}`, transition: 'border-color 0.2s' }}>
                <img src={f} alt={`foto ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            ))}
          </div>
        )}
      </div>

      {zoom && (
        <div onClick={() => setZoom(false)} style={{ position: 'fixed', inset: 0, zIndex: 9999, backgroundColor: 'rgba(0,0,0,0.92)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <button onClick={() => setZoom(false)} style={{ position: 'absolute', top: '16px', right: '16px', width: '36px', height: '36px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.2)', backgroundColor: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={16} color="#fff" strokeWidth={2} />
          </button>
          {fotos.length > 1 && (
            <>
              <button onClick={e => { e.stopPropagation(); setIdx(i => (i - 1 + fotos.length) % fotos.length); }}
                style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', width: '40px', height: '40px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.2)', backgroundColor: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ChevronLeft size={20} color="#fff" strokeWidth={2} />
              </button>
              <button onClick={e => { e.stopPropagation(); setIdx(i => (i + 1) % fotos.length); }}
                style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', width: '40px', height: '40px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.2)', backgroundColor: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ChevronRight size={20} color="#fff" strokeWidth={2} />
              </button>
            </>
          )}
          <img src={src} alt="zoom" style={{ maxWidth: '90vw', maxHeight: '90vh', objectFit: 'contain', borderRadius: '8px' }} onClick={e => e.stopPropagation()} />
          {fotos.length > 1 && (
            <div style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '6px' }}>
              {fotos.map((_, i) => (
                <div key={i} onClick={e => { e.stopPropagation(); setIdx(i); }}
                  style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: i === idx ? '#fff' : 'rgba(255,255,255,0.35)', cursor: 'pointer', transition: 'background 0.2s' }} />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default GaleriaImagem;
