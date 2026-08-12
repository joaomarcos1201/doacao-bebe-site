import React from 'react';
import {
  ShoppingCart, BedDouble, Droplets, Shirt,
  Puzzle, Heart, Bath, Armchair, CheckCircle2, AlertTriangle,
} from 'lucide-react';
import { CATEGORIAS_MAP } from '../../services/iaService';

const CATEGORIA_ICONS = {
  passeio: ShoppingCart,
  quarto: BedDouble,
  higiene: Droplets,
  roupas: Shirt,
  brinquedos: Puzzle,
  maternidade: Heart,
  banho: Bath,
};

export default function CategoriaAutomatica({ categoria, subcategoria, sugestoes, confianca, onChange, isDark }) {
  const border = isDark ? '#2a2a2a' : '#E5E7EB';
  const text = isDark ? '#e0e0e0' : '#374151';
  const sub = isDark ? '#666' : '#9CA3AF';
  const bg = isDark ? '#1a1a1a' : '#F9FAFB';

  const subcats = categoria ? (CATEGORIAS_MAP[categoria]?.subcategorias || []) : [];
  const baixaConfianca = confianca < 0.7;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Badge de confiança */}
      {confianca > 0 && (
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          backgroundColor: baixaConfianca ? (isDark ? '#2a2200' : '#FFFBEB') : (isDark ? '#0a2a1a' : '#F0FDF4'),
          border: `1px solid ${baixaConfianca ? '#F59E0B' : '#22C55E'}`,
          borderRadius: '10px', padding: '10px 14px', alignSelf: 'flex-start',
          fontSize: '13px', fontWeight: '600',
          color: baixaConfianca ? '#D97706' : '#16A34A',
        }}>
          {baixaConfianca
            ? <AlertTriangle size={15} strokeWidth={2} color="#D97706" />
            : <CheckCircle2 size={15} strokeWidth={2} color="#16A34A" />}
          {baixaConfianca
            ? `Confiança baixa (${Math.round(confianca * 100)}%) — confirme a categoria`
            : `IA identificou com ${Math.round(confianca * 100)}% de confiança`}
        </div>
      )}

      {/* Sugestões */}
      {baixaConfianca && sugestoes?.length > 0 && (
        <div>
          <p style={{ fontSize: '12px', color: sub, margin: '0 0 10px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Sugestões da IA
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {sugestoes.map((s, i) => {
              const Icon = CATEGORIA_ICONS[s.categoria] || Puzzle;
              return (
                <button key={i} onClick={() => onChange({ categoria: s.categoria, subcategoria: s.subcategoria })}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '12px 16px', borderRadius: '12px', cursor: 'pointer',
                    border: `1px solid ${categoria === s.categoria ? '#c0606a' : border}`,
                    backgroundColor: categoria === s.categoria ? (isDark ? '#2a1a1c' : '#FFF0F2') : bg,
                    color: text, fontSize: '14px', fontWeight: '600', textAlign: 'left',
                    transition: 'all 0.15s',
                  }}>
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '10px',
                    backgroundColor: categoria === s.categoria ? '#c0606a' : (isDark ? '#2a2a2a' : '#F3F4F6'),
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <Icon size={16} color={categoria === s.categoria ? '#fff' : '#c0606a'} strokeWidth={1.5} />
                  </div>
                  <div>
                    <div>{CATEGORIAS_MAP[s.categoria]?.label}</div>
                    <div style={{ fontSize: '12px', color: sub, fontWeight: '400' }}>{s.subcategoria}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Grid de categorias */}
      <div>
        <label style={{ fontSize: '11px', fontWeight: '700', color: sub, textTransform: 'uppercase', letterSpacing: '0.6px', display: 'block', marginBottom: '10px' }}>
          Categoria <span style={{ color: '#EF4444' }}>*</span>
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
          {Object.entries(CATEGORIAS_MAP).map(([key, val]) => {
            const Icon = CATEGORIA_ICONS[key] || Puzzle;
            const active = categoria === key;
            return (
              <button key={key} onClick={() => onChange({ categoria: key, subcategoria: '' })}
                style={{
                  padding: '14px 8px', borderRadius: '14px', cursor: 'pointer',
                  border: `1.5px solid ${active ? '#c0606a' : border}`,
                  backgroundColor: active ? (isDark ? '#2a1a1c' : '#FFF0F2') : bg,
                  color: active ? '#c0606a' : text,
                  fontSize: '11px', fontWeight: active ? '700' : '500',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
                  transition: 'all 0.15s',
                }}>
                <Icon size={20} strokeWidth={1.5} color={active ? '#c0606a' : sub} />
                <span style={{ lineHeight: '1.3', textAlign: 'center' }}>{val.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Subcategoria */}
      {subcats.length > 0 && (
        <div>
          <label style={{ fontSize: '11px', fontWeight: '700', color: sub, textTransform: 'uppercase', letterSpacing: '0.6px', display: 'block', marginBottom: '10px' }}>
            Subcategoria <span style={{ color: '#EF4444' }}>*</span>
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {subcats.map(s => (
              <button key={s} onClick={() => onChange({ categoria, subcategoria: s })}
                style={{
                  padding: '8px 16px', borderRadius: '99px', cursor: 'pointer',
                  border: `1.5px solid ${subcategoria === s ? '#c0606a' : border}`,
                  backgroundColor: subcategoria === s ? '#c0606a' : bg,
                  color: subcategoria === s ? '#fff' : text,
                  fontSize: '13px', fontWeight: '600',
                  transition: 'all 0.15s',
                }}>
                {s}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
