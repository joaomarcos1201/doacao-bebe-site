import React from 'react';
import { CATEGORIAS_MAP } from '../../services/iaService';

export default function RevisaoFinal({ form, fotos, isDark }) {
  const border = isDark ? '#2a2a2a' : '#f0e6e8';
  const text = isDark ? '#e0e0e0' : '#333';
  const sub = isDark ? '#888' : '#888';
  const bg = isDark ? '#141414' : '#fdf5f6';

  const catInfo = CATEGORIAS_MAP[form.categoria];
  const principal = fotos[0] ? URL.createObjectURL(fotos[0]) : null;

  const Row = ({ label, value }) => value ? (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '10px 0', borderBottom: `1px solid ${border}` }}>
      <span style={{ fontSize: '13px', color: sub, fontWeight: '600' }}>{label}</span>
      <span style={{ fontSize: '13px', color: text, fontWeight: '600', textAlign: 'right', maxWidth: '60%' }}>{value}</span>
    </div>
  ) : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Preview principal */}
      <div style={{
        backgroundColor: isDark ? '#1a1a1a' : '#fff',
        borderRadius: '16px', border: `1px solid ${border}`, overflow: 'hidden',
      }}>
        {principal && (
          <img src={principal} alt="produto" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
        )}
        <div style={{ padding: '16px' }}>
          <h3 style={{ fontSize: '17px', fontWeight: '800', color: text, margin: '0 0 6px', lineHeight: '1.3' }}>
            {form.nome || 'Sem título'}
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            {catInfo && (
              <span style={{
                backgroundColor: isDark ? '#2a1a1c' : '#fff0f2',
                color: '#c0606a', fontSize: '12px', fontWeight: '700',
                padding: '3px 10px', borderRadius: '99px',
              }}>
                {catInfo.icon} {catInfo.label}
              </span>
            )}
            {form.subcategoria && (
              <span style={{
                backgroundColor: isDark ? '#222' : '#f5f5f5',
                color: sub, fontSize: '12px', fontWeight: '600',
                padding: '3px 10px', borderRadius: '99px',
              }}>
                {form.subcategoria}
              </span>
            )}
          </div>
          <div style={{ fontSize: '22px', fontWeight: '800', color: '#c0606a', marginTop: '12px' }}>
            R$ {parseFloat(form.preco || 0).toFixed(2).replace('.', ',')}
          </div>
        </div>
      </div>

      {/* Detalhes */}
      <div style={{ backgroundColor: isDark ? '#1a1a1a' : '#fff', borderRadius: '16px', border: `1px solid ${border}`, padding: '16px' }}>
        <h4 style={{ fontSize: '13px', fontWeight: '700', color: sub, textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 4px' }}>
          Detalhes do Produto
        </h4>
        <Row label="Marca" value={form.marca} />
        <Row label="Cor" value={form.cor} />
        <Row label="Conservação" value={form.conservacao} />
        <Row label="Faixa Etária" value={form.faixaEtaria} />
        <Row label="CEP de Origem" value={form.cepOrigem} />
        <Row label="Fotos" value={`${fotos.length} foto${fotos.length !== 1 ? 's' : ''}`} />
      </div>

      {/* Descrição */}
      {form.descricao && (
        <div style={{ backgroundColor: isDark ? '#1a1a1a' : '#fff', borderRadius: '16px', border: `1px solid ${border}`, padding: '16px' }}>
          <h4 style={{ fontSize: '13px', fontWeight: '700', color: sub, textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 8px' }}>
            Descrição
          </h4>
          <p style={{ fontSize: '14px', color: text, lineHeight: '1.6', margin: 0 }}>{form.descricao}</p>
        </div>
      )}
    </div>
  );
}
