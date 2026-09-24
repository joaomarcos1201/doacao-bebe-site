import React, { useCallback, useRef, useState } from 'react';
import { Camera, Upload, X, Star, Plus } from 'lucide-react';

const MAX_FOTOS = 4;

export default function UploadFotos({ fotos, onChange, isDark }) {
  const inputRef = useRef();
  const [dragging, setDragging] = useState(false);
  const [erro, setErro] = useState('');

  const border = isDark ? '#2a2a2a' : '#E5E7EB';
  const sub = isDark ? '#666' : '#9CA3AF';
  const bg = isDark ? '#141414' : '#F9FAFB';

  const adicionarArquivos = useCallback((files) => {
    const novos = Array.from(files);
    if (fotos.length + novos.length > MAX_FOTOS) { setErro('Selecione no máximo quatro fotos.'); return; }
    if (novos.some(f => !['image/jpeg', 'image/png'].includes(f.type))) { setErro('Envie fotos JPEG ou PNG.'); return; }
    if (novos.some(f => f.size === 0 || f.size > 10 * 1024 * 1024)) { setErro('Cada foto deve ter conteúdo e no máximo 10 MiB.'); return; }
    setErro('');
    onChange([...fotos, ...novos]);
  }, [fotos, onChange]);

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    adicionarArquivos(e.dataTransfer.files);
  }, [adicionarArquivos]);

  const remover = (idx) => onChange(fotos.filter((_, i) => i !== idx));
  const principal = fotos[0] ? URL.createObjectURL(fotos[0]) : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Zona de drop */}
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => fotos.length < MAX_FOTOS && inputRef.current.click()}
        style={{
          width: '100%',
          height: principal ? '280px' : '220px',
          borderRadius: '16px',
          border: `2px dashed ${dragging ? '#c0606a' : border}`,
          backgroundColor: dragging
            ? (isDark ? '#2a1a1c' : '#FFF0F2')
            : (principal ? 'transparent' : bg),
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: fotos.length < MAX_FOTOS ? 'pointer' : 'default',
          overflow: 'hidden', position: 'relative',
          transition: 'all 0.2s ease',
        }}
      >
        {principal ? (
          <>
            <img src={principal} alt="principal" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 50%)',
            }} />
            <div style={{
              position: 'absolute', bottom: '12px', left: '12px',
              display: 'flex', alignItems: 'center', gap: '6px',
              backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: '8px',
              padding: '5px 10px',
            }}>
              <Star size={12} color="#F48FB1" fill="#F48FB1" />
              <span style={{ color: '#fff', fontSize: '11px', fontWeight: '700' }}>Foto principal</span>
            </div>
            <div style={{
              position: 'absolute', bottom: '12px', right: '12px',
              backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: '8px',
              padding: '5px 10px', color: '#fff', fontSize: '11px', fontWeight: '600',
            }}>
              {fotos.length}/{MAX_FOTOS}
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '24px', pointerEvents: 'none' }}>
            <div style={{
              width: '56px', height: '56px', borderRadius: '14px',
              backgroundColor: isDark ? '#2a2a2a' : '#FFF0F2',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px',
            }}>
              <Upload size={24} color="#c0606a" strokeWidth={1.5} />
            </div>
            <p style={{ fontSize: '15px', fontWeight: '700', color: isDark ? '#e0e0e0' : '#374151', margin: '0 0 6px' }}>
              Arraste as fotos aqui
            </p>
            <p style={{ fontSize: '13px', color: sub, margin: '0 0 16px' }}>
              ou clique para selecionar · até {MAX_FOTOS} fotos
            </p>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              backgroundColor: isDark ? '#2a2a2a' : '#fff',
              border: `1px solid ${border}`, borderRadius: '8px',
              padding: '8px 16px',
            }}>
              <Camera size={14} color="#c0606a" strokeWidth={2} />
              <span style={{ fontSize: '13px', fontWeight: '600', color: '#c0606a' }}>Selecionar fotos</span>
            </div>
          </div>
        )}
      </div>

      <input ref={inputRef} type="file" accept="image/jpeg,image/png" multiple style={{ display: 'none' }} onChange={e => { adicionarArquivos(e.target.files); e.target.value = ''; }} />
      {erro && <p role="alert" style={{ color: '#b42318' }}>{erro}</p>}

      {/* Miniaturas */}
      {fotos.length > 0 && (
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {fotos.map((f, i) => (
            <div key={i} style={{ position: 'relative', width: '76px', height: '76px' }}>
              <img
                src={URL.createObjectURL(f)}
                alt={`foto-${i}`}
                style={{
                  width: '76px', height: '76px', objectFit: 'cover',
                  borderRadius: '12px',
                  border: i === 0 ? '2px solid #c0606a' : `1px solid ${border}`,
                  transition: 'border-color 0.2s',
                }}
              />
              {i === 0 && (
                <div style={{
                  position: 'absolute', bottom: 4, left: 4,
                  backgroundColor: '#c0606a', borderRadius: '4px',
                  padding: '2px 5px',
                }}>
                  <Star size={8} color="#fff" fill="#fff" />
                </div>
              )}
              <button
                onClick={e => { e.stopPropagation(); remover(i); }}
                style={{
                  position: 'absolute', top: -6, right: -6,
                  width: '22px', height: '22px', borderRadius: '50%',
                  border: '2px solid #fff', backgroundColor: '#374151',
                  color: '#fff', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
                  padding: 0,
                }}
              >
                <X size={10} strokeWidth={3} />
              </button>
            </div>
          ))}
          {fotos.length < MAX_FOTOS && (
            <button
              onClick={() => inputRef.current.click()}
              style={{
                width: '76px', height: '76px', borderRadius: '12px',
                border: `2px dashed ${border}`, backgroundColor: 'transparent',
                cursor: 'pointer', color: sub,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '4px',
                transition: 'border-color 0.2s, background-color 0.2s',
              }}
            >
              <Plus size={18} strokeWidth={1.5} />
              <span style={{ fontSize: '10px', fontWeight: '600' }}>Adicionar</span>
            </button>
          )}
        </div>
      )}

      {fotos.length === 0 && (
        <p style={{ fontSize: '12px', color: sub, textAlign: 'center', margin: 0 }}>
          Fotos bem iluminadas ajudam a IA a identificar melhor o produto
        </p>
      )}
    </div>
  );
}
