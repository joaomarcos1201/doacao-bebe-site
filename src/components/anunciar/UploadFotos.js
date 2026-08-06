import React, { useCallback, useRef, useState } from 'react';

const MAX_FOTOS = 8;

export default function UploadFotos({ fotos, onChange, isDark }) {
  const inputRef = useRef();
  const [dragging, setDragging] = useState(false);

  const border = isDark ? '#2a2a2a' : '#f0e6e8';
  const sub = isDark ? '#888' : '#888';
  const card = isDark ? '#1a1a1a' : '#fff';

  const adicionarArquivos = useCallback((files) => {
    const novos = Array.from(files).filter(f => f.type.startsWith('image/'));
    const total = [...fotos, ...novos].slice(0, MAX_FOTOS);
    onChange(total);
  }, [fotos, onChange]);

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    adicionarArquivos(e.dataTransfer.files);
  }, [adicionarArquivos]);

  const remover = (idx) => onChange(fotos.filter((_, i) => i !== idx));

  const principal = fotos[0] ? URL.createObjectURL(fotos[0]) : null;

  return (
    <div>
      {/* Zona de drop */}
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => fotos.length < MAX_FOTOS && inputRef.current.click()}
        style={{
          width: '100%', height: principal ? '260px' : '200px',
          borderRadius: '16px',
          border: `2px dashed ${dragging ? '#c0606a' : border}`,
          backgroundColor: dragging
            ? (isDark ? '#2a1a1c' : '#fff0f2')
            : (isDark ? '#141414' : '#fdf5f6'),
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: fotos.length < MAX_FOTOS ? 'pointer' : 'default',
          overflow: 'hidden', position: 'relative',
          transition: 'border-color 0.2s, background-color 0.2s',
        }}
      >
        {principal ? (
          <img src={principal} alt="principal" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ textAlign: 'center', pointerEvents: 'none' }}>
            <div style={{ fontSize: '40px', marginBottom: '10px' }}>📸</div>
            <p style={{ fontSize: '15px', fontWeight: '700', color: '#c0606a', margin: '0 0 4px' }}>
              Arraste as fotos aqui
            </p>
            <p style={{ fontSize: '13px', color: sub, margin: 0 }}>
              ou clique para selecionar · até {MAX_FOTOS} fotos
            </p>
          </div>
        )}
        {principal && (
          <div style={{
            position: 'absolute', bottom: 10, right: 10,
            backgroundColor: 'rgba(0,0,0,0.55)', borderRadius: '8px',
            padding: '4px 10px', color: '#fff', fontSize: '12px', fontWeight: '600',
          }}>
            {fotos.length}/{MAX_FOTOS} fotos
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        style={{ display: 'none' }}
        onChange={e => adicionarArquivos(e.target.files)}
      />

      {/* Miniaturas */}
      {fotos.length > 0 && (
        <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
          {fotos.map((f, i) => (
            <div key={i} style={{ position: 'relative', width: '72px', height: '72px' }}>
              <img
                src={URL.createObjectURL(f)}
                alt={`foto-${i}`}
                style={{
                  width: '72px', height: '72px', objectFit: 'cover',
                  borderRadius: '10px',
                  border: i === 0 ? '2px solid #c0606a' : `1px solid ${border}`,
                }}
              />
              {i === 0 && (
                <span style={{
                  position: 'absolute', bottom: 3, left: 3,
                  backgroundColor: '#c0606a', color: '#fff',
                  fontSize: '9px', fontWeight: '700', borderRadius: '4px', padding: '1px 4px',
                }}>CAPA</span>
              )}
              <button
                onClick={e => { e.stopPropagation(); remover(i); }}
                style={{
                  position: 'absolute', top: -6, right: -6,
                  width: '20px', height: '20px', borderRadius: '50%',
                  border: 'none', backgroundColor: '#ef4444', color: '#fff',
                  fontSize: '11px', cursor: 'pointer', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', fontWeight: '700',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
                }}
              >×</button>
            </div>
          ))}
          {fotos.length < MAX_FOTOS && (
            <button
              onClick={() => inputRef.current.click()}
              style={{
                width: '72px', height: '72px', borderRadius: '10px',
                border: `2px dashed ${border}`, backgroundColor: 'transparent',
                cursor: 'pointer', fontSize: '22px', color: sub,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >+</button>
          )}
        </div>
      )}

      {fotos.length === 0 && (
        <p style={{ fontSize: '12px', color: sub, marginTop: '8px', textAlign: 'center' }}>
          💡 Dica: fotos bem iluminadas ajudam a IA a identificar melhor o produto
        </p>
      )}
    </div>
  );
}
