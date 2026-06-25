import React, { useMemo, useState } from 'react';

function ModalBackdrop({ open, onClose, isDark }) {
  if (!open) return null;
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.55)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
      }}
    />
  );
}

export default function ProductDetailsModal({
  isDark,
  open,
  produto,
  onClose,
  onApprove,
  onReject,
}) {
  const [imgIndex, setImgIndex] = useState(0);

  const images = useMemo(() => {
    if (!produto) return [];
    // Backend atual expõe apenas foto (byte[]). Usamos como carrossel com 1 imagem.
    if (produto.foto) return [`data:image/jpeg;base64,${produto.foto}`];
    return [];
  }, [produto]);

  const canAct = !!produto;

  const bg = isDark ? '#0f0f0f' : '#fff';
  const card = isDark ? '#141414' : '#fff';
  const border = isDark ? '#2a2a2a' : '#f0e6e8';
  const text = isDark ? '#e0e0e0' : '#333';
  const sub = isDark ? '#888' : '#666';

  if (!open || !produto) return null;

  const status = (produto.statusAnuncio || '').toUpperCase();

  return (
    <>
      <ModalBackdrop open={open} onClose={onClose} isDark={isDark} />

      <div
        role="dialog"
        aria-modal="true"
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 10001,
          width: 'min(1040px, 96vw)',
          background: card,
          border: `1px solid ${border}`,
          borderRadius: 20,
          boxShadow: '0 18px 70px rgba(0,0,0,0.25)',
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ padding: '16px 18px', borderBottom: `1px solid ${border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 1000, color: text }}>Detalhes do Produto</div>
            <div style={{ fontSize: 12, fontWeight: 900, color: sub, marginTop: 4 }}>Status atual: {status}</div>
          </div>
          <button
            onClick={onClose}
            style={{
              padding: '10px 12px',
              borderRadius: 12,
              border: `1px solid ${border}`,
              background: 'transparent',
              cursor: 'pointer',
              color: sub,
              fontWeight: 1000,
            }}
          >
            👁️ Fechar
          </button>
        </div>

        <div style={{ padding: 18, display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 16, alignItems: 'start' }}>
          <div>
            <div style={{ borderRadius: 16, overflow: 'hidden', border: `1px solid ${border}`, background: bg }}>
              {images.length > 0 ? (
                <img
                  src={images[imgIndex]}
                  alt={produto.nome}
                  style={{ width: '100%', height: 340, objectFit: 'cover', display: 'block' }}
                />
              ) : (
                <div style={{ height: 340, display: 'flex', alignItems: 'center', justifyContent: 'center', color: sub, fontWeight: 1000 }}>
                  Sem imagem
                </div>
              )}
            </div>

            {images.length > 1 && (
              <div style={{ display: 'flex', gap: 10, marginTop: 12, justifyContent: 'center' }}>
                {images.map((src, idx) => (
                  <button
                    key={src + idx}
                    onClick={() => setImgIndex(idx)}
                    style={{
                      width: 54,
                      height: 40,
                      borderRadius: 12,
                      border: `1px solid ${idx === imgIndex ? '#c0606a' : border}`,
                      background: idx === imgIndex ? '#fde8ec' : 'transparent',
                      cursor: 'pointer',
                      overflow: 'hidden',
                    }}
                  >
                    <img src={src} alt="thumb" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', marginBottom: 10 }}>
              <span style={{ padding: '4px 12px', borderRadius: 999, fontSize: 12, fontWeight: 1000, background: isDark ? '#2d1518' : '#fde8ec', color: '#c0606a', border: `1px solid ${border}` }}>
                {produto.categoria || 'Categoria'}
              </span>
              {produto.marca && (
                <span style={{ padding: '4px 12px', borderRadius: 999, fontSize: 12, fontWeight: 1000, background: isDark ? '#1a1a1a' : '#f5f5f5', color: isDark ? '#aaa' : '#666', border: `1px solid ${border}` }}>
                  Marca: {produto.marca}
                </span>
              )}
            </div>

            <h2 style={{ margin: '0 0 10px', fontSize: 22, fontWeight: 1000, color: text }}>{produto.nome}</h2>
            <div style={{ fontSize: 13, fontWeight: 1000, color: sub, marginBottom: 12 }}>
              Preço: <span style={{ color: '#c0606a' }}>R$ {Number(produto.preco || 0).toFixed(2)}</span>
            </div>

            <div style={{ background: isDark ? '#1a1a1a' : '#fdf0f2', border: `1px solid ${border}`, borderRadius: 16, padding: 14, marginBottom: 14 }}>
              <div style={{ fontSize: 12, fontWeight: 1000, color: sub, marginBottom: 8 }}>Condição</div>
              <div style={{ fontSize: 13, fontWeight: 900, color: text }}>{produto.conservacao || 'N/A'}</div>
            </div>

            <div style={{ background: isDark ? '#1a1a1a' : '#fff', border: `1px solid ${border}`, borderRadius: 16, padding: 14, marginBottom: 14 }}>
              <div style={{ fontSize: 12, fontWeight: 1000, color: sub, marginBottom: 8 }}>Descrição completa</div>
              <div style={{ fontSize: 13, color: isDark ? '#ccc' : '#444', lineHeight: 1.65, whiteSpace: 'pre-wrap' }}>
                {produto.descricao}
              </div>
            </div>

            <div style={{ background: isDark ? '#1a1a1a' : '#fff', border: `1px solid ${border}`, borderRadius: 16, padding: 14 }}>
              <div style={{ fontSize: 12, fontWeight: 1000, color: sub, marginBottom: 8 }}>Dados do anunciante</div>
              <div style={{ fontSize: 13, fontWeight: 1000, color: text }}>
                {produto.vendedor?.nome || '—'}
              </div>
              <div style={{ fontSize: 12, color: sub, fontWeight: 900, marginTop: 4 }}>
                {produto.vendedor?.email || '—'}
              </div>
              <div style={{ fontSize: 12, color: sub, fontWeight: 900, marginTop: 6 }}>
                Data: {produto.dataAnuncio ? new Date(produto.dataAnuncio).toLocaleDateString('pt-BR') : '—'}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
              <button
                onClick={() => onApprove(produto.id)}
                disabled={!canAct}
                style={{
                  flex: 1,
                  padding: '12px 14px',
                  borderRadius: 14,
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: '#4caf50',
                  color: 'white',
                  fontWeight: 1000,
                }}
              >
                ✅ Aprovar produto
              </button>
              <button
                onClick={() => onReject(produto.id)}
                disabled={!canAct}
                style={{
                  flex: 1,
                  padding: '12px 14px',
                  borderRadius: 14,
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: '#ef4444',
                  color: 'white',
                  fontWeight: 1000,
                }}
              >
                ❌ Recusar produto
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

