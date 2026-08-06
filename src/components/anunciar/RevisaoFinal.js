import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Tag, ShieldCheck, Baby, MapPin, Camera, X, ChevronLeft, ChevronRight, ZoomIn, Pencil } from 'lucide-react';
import { CATEGORIAS_MAP } from '../../services/iaService';

function Lightbox({ fotos, indiceInicial, onFechar }) {
  const [idx, setIdx] = useState(indiceInicial);
  const [zoom, setZoom] = useState(false);
  const touchStartX = useRef(null);
  const urls = fotos.map(f => URL.createObjectURL(f));

  const anterior = useCallback(() => setIdx(i => (i - 1 + fotos.length) % fotos.length), [fotos.length]);
  const proxima  = useCallback(() => setIdx(i => (i + 1) % fotos.length), [fotos.length]);

  useEffect(() => {
    setZoom(false);
  }, [idx]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onFechar();
      if (e.key === 'ArrowLeft') anterior();
      if (e.key === 'ArrowRight') proxima();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onFechar, anterior, proxima]);

  const onTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) diff > 0 ? proxima() : anterior();
    touchStartX.current = null;
  };

  return (
    <div
      onClick={onFechar}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        backgroundColor: 'rgba(0,0,0,0.95)',
        display: 'flex', flexDirection: 'column',
        animation: 'lbFadeIn 0.2s ease',
      }}
    >
      <style>{`
        @keyframes lbFadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes lbSlide { from { opacity: 0; transform: scale(0.96) } to { opacity: 1; transform: scale(1) } }
        .lb-thumb:hover { opacity: 1 !important; transform: scale(1.05); }
        .lb-nav:hover { background: rgba(255,255,255,0.15) !important; }
      `}</style>

      {/* Topo */}
      <div
        onClick={e => e.stopPropagation()}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', flexShrink: 0 }}
      >
        <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', fontWeight: '600' }}>
          {idx + 1} de {fotos.length}
        </span>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setZoom(z => !z)}
            style={{ width: '36px', height: '36px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)', backgroundColor: zoom ? 'rgba(255,255,255,0.15)' : 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <ZoomIn size={16} color="#fff" strokeWidth={2} />
          </button>
          <button
            onClick={onFechar}
            style={{ width: '36px', height: '36px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)', backgroundColor: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <X size={16} color="#fff" strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* Imagem principal */}
      <div
        onClick={e => e.stopPropagation()}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', padding: '0 60px' }}
      >
        {fotos.length > 1 && (
          <button
            className="lb-nav"
            onClick={anterior}
            style={{ position: 'absolute', left: '8px', width: '44px', height: '44px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.2)', backgroundColor: 'rgba(255,255,255,0.08)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.15s', zIndex: 1 }}
          >
            <ChevronLeft size={22} color="#fff" strokeWidth={2} />
          </button>
        )}

        <img
          key={idx}
          src={urls[idx]}
          alt={`foto ${idx + 1}`}
          style={{
            maxWidth: '100%', maxHeight: '100%',
            objectFit: zoom ? 'none' : 'contain',
            borderRadius: '8px',
            cursor: zoom ? 'zoom-out' : 'zoom-in',
            transform: zoom ? 'scale(1.8)' : 'scale(1)',
            transition: 'transform 0.3s ease',
            animation: 'lbSlide 0.2s ease',
            userSelect: 'none',
          }}
          onClick={() => setZoom(z => !z)}
          draggable={false}
        />

        {fotos.length > 1 && (
          <button
            className="lb-nav"
            onClick={proxima}
            style={{ position: 'absolute', right: '8px', width: '44px', height: '44px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.2)', backgroundColor: 'rgba(255,255,255,0.08)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.15s', zIndex: 1 }}
          >
            <ChevronRight size={22} color="#fff" strokeWidth={2} />
          </button>
        )}
      </div>

      {/* Miniaturas */}
      {fotos.length > 1 && (
        <div
          onClick={e => e.stopPropagation()}
          style={{ display: 'flex', gap: '8px', justifyContent: 'center', padding: '14px 20px', flexShrink: 0, overflowX: 'auto' }}
        >
          {urls.map((url, i) => (
            <button
              key={i}
              className="lb-thumb"
              onClick={() => setIdx(i)}
              style={{
                width: '52px', height: '52px', flexShrink: 0, padding: 0, border: 'none', cursor: 'pointer',
                borderRadius: '8px', overflow: 'hidden',
                outline: i === idx ? '2px solid #F48FB1' : '2px solid transparent',
                outlineOffset: '2px',
                opacity: i === idx ? 1 : 0.45,
                transition: 'opacity 0.15s, transform 0.15s',
              }}
            >
              <img src={url} alt={`miniatura ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function RevisaoFinal({ form, fotos, isDark, onEditar }) {
  const [lightboxIdx, setLightboxIdx] = useState(null);

  const border = isDark ? '#2a2a2a' : '#E5E7EB';
  const text = isDark ? '#e0e0e0' : '#374151';
  const sub = isDark ? '#666' : '#9CA3AF';
  const cardBg = isDark ? '#1a1a1a' : '#fff';

  const catInfo = CATEGORIAS_MAP[form.categoria];
  const urls = fotos.map(f => URL.createObjectURL(f));

  const DetailRow = ({ Icon, label, value }) => value ? (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 0', borderBottom: `1px solid ${border}` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Icon size={14} strokeWidth={1.8} color={sub} />
        <span style={{ fontSize: '13px', color: sub, fontWeight: '600' }}>{label}</span>
      </div>
      <span style={{ fontSize: '13px', color: text, fontWeight: '600', textAlign: 'right', maxWidth: '55%' }}>{value}</span>
    </div>
  ) : null;

  return (
    <>
      {lightboxIdx !== null && (
        <Lightbox fotos={fotos} indiceInicial={lightboxIdx} onFechar={() => setLightboxIdx(null)} />
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Preview + galeria */}
        <div style={{ backgroundColor: cardBg, borderRadius: '16px', border: `1px solid ${border}`, overflow: 'hidden' }}>
          {urls.length > 0 ? (
            <>
              {/* Imagem principal clicável */}
              <div
                onClick={() => setLightboxIdx(0)}
                style={{ position: 'relative', height: '220px', cursor: 'zoom-in' }}
              >
                <img src={urls[0]} alt="produto" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 50%)' }} />
                <div style={{
                  position: 'absolute', bottom: '12px', right: '12px',
                  backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: '8px',
                  padding: '5px 10px', display: 'flex', alignItems: 'center', gap: '5px',
                }}>
                  <Camera size={12} color="#fff" />
                  <span style={{ color: '#fff', fontSize: '11px', fontWeight: '600' }}>
                    {fotos.length} foto{fotos.length !== 1 ? 's' : ''} · clique para ver
                  </span>
                </div>
              </div>

              {/* Miniaturas clicáveis */}
              {fotos.length > 1 && (
                <div style={{ display: 'flex', gap: '6px', padding: '10px 12px', overflowX: 'auto' }}>
                  {urls.map((url, i) => (
                    <button
                      key={i}
                      onClick={() => setLightboxIdx(i)}
                      style={{
                        width: '56px', height: '56px', flexShrink: 0, padding: 0, border: 'none',
                        borderRadius: '8px', overflow: 'hidden', cursor: 'zoom-in',
                        outline: i === 0 ? `2px solid #c0606a` : `1px solid ${border}`,
                        outlineOffset: '1px', transition: 'transform 0.15s, outline 0.15s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.06)'}
                      onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                    >
                      <img src={url} alt={`foto ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div style={{ height: '120px', backgroundColor: isDark ? '#222' : '#F9FAFB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Camera size={32} color={sub} strokeWidth={1} />
            </div>
          )}

          <div style={{ padding: '18px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '800', color: text, margin: '0 0 10px', lineHeight: '1.3' }}>
              {form.nome || 'Sem título'}
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '14px' }}>
              {catInfo && (
                <span style={{ backgroundColor: isDark ? '#2a1a1c' : '#FFF0F2', color: '#c0606a', fontSize: '12px', fontWeight: '700', padding: '4px 12px', borderRadius: '99px' }}>
                  {catInfo.label}
                </span>
              )}
              {form.subcategoria && (
                <span style={{ backgroundColor: isDark ? '#222' : '#F3F4F6', color: sub, fontSize: '12px', fontWeight: '600', padding: '4px 12px', borderRadius: '99px' }}>
                  {form.subcategoria}
                </span>
              )}
            </div>
            <div style={{ fontSize: '26px', fontWeight: '800', color: '#c0606a' }}>
              R$ {parseFloat(form.preco || 0).toFixed(2).replace('.', ',')}
            </div>
          </div>
        </div>

        {/* Detalhes */}
        <div style={{ backgroundColor: cardBg, borderRadius: '16px', border: `1px solid ${border}`, padding: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
            <p style={{ fontSize: '11px', fontWeight: '700', color: sub, textTransform: 'uppercase', letterSpacing: '0.6px', margin: 0 }}>
              Detalhes do Produto
            </p>
            {onEditar && (
              <button
                onClick={onEditar}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '6px 14px', borderRadius: '8px', border: `1.5px solid #c0606a`,
                  backgroundColor: 'transparent', color: '#c0606a',
                  fontSize: '12px', fontWeight: '700', cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#FFF0F2'; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                <Pencil size={13} strokeWidth={2} />
                Editar
              </button>
            )}
          </div>
          <DetailRow Icon={Tag} label="Marca" value={form.marca} />
          <DetailRow Icon={Tag} label="Cor" value={form.cor} />
          <DetailRow Icon={ShieldCheck} label="Conservação" value={form.conservacao} />
          <DetailRow Icon={Baby} label="Faixa Etária" value={form.faixaEtaria} />
          <DetailRow Icon={MapPin} label="CEP de Origem" value={form.cepOrigem} />
          <DetailRow Icon={Camera} label="Fotos" value={`${fotos.length} foto${fotos.length !== 1 ? 's' : ''}`} />
        </div>

        {/* Descrição */}
        {form.descricao && (
          <div style={{ backgroundColor: cardBg, borderRadius: '16px', border: `1px solid ${border}`, padding: '18px' }}>
            <p style={{ fontSize: '11px', fontWeight: '700', color: sub, textTransform: 'uppercase', letterSpacing: '0.6px', margin: '0 0 10px' }}>
              Descrição
            </p>
            <p style={{ fontSize: '14px', color: text, lineHeight: '1.7', margin: 0 }}>{form.descricao}</p>
          </div>
        )}
      </div>
    </>
  );
}
