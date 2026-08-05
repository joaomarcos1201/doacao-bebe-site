import React, { useState } from 'react';

const formatBRL = (v) => Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

function OpcaoEntrega({ opcao, selecionada, onSelecionar, isDark, border, text, sub }) {
  const gratis = opcao.gratis || opcao.valor === 0;

  return (
    <button
      onClick={() => onSelecionar(opcao.id)}
      style={{
        width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 14px', borderRadius: '10px', cursor: 'pointer', textAlign: 'left',
        border: `2px solid ${selecionada ? '#c0606a' : border}`,
        backgroundColor: selecionada
          ? (isDark ? 'rgba(192,96,106,0.12)' : 'rgba(192,96,106,0.06)')
          : (isDark ? '#1a1a1a' : '#fff'),
        transition: 'border-color 0.2s, background-color 0.2s',
        marginBottom: '8px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '20px' }}>{opcao.icone}</span>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '13px', fontWeight: '700', color: text }}>{opcao.nome}</span>
            {gratis && (
              <span style={{
                fontSize: '10px', fontWeight: '800', padding: '2px 6px', borderRadius: '4px',
                backgroundColor: '#4caf50', color: '#fff', letterSpacing: '0.5px'
              }}>GRÁTIS</span>
            )}
          </div>
          <span style={{ fontSize: '12px', color: sub }}>
            Até {opcao.prazo} dias úteis · Receba até{' '}
            <strong style={{ color: text }}>{opcao.dataFormatada}</strong>
          </span>
        </div>
      </div>
      <span style={{
        fontSize: '14px', fontWeight: '800', whiteSpace: 'nowrap', marginLeft: '8px',
        color: gratis ? '#4caf50' : '#c0606a',
      }}>
        {gratis ? 'Grátis' : formatBRL(opcao.valor)}
      </span>
    </button>
  );
}

function PainelEntrega({ endereco, opcoes, isDark, border, text, sub, onOpcaoSelecionada }) {
  const [selecionada, setSelecionada] = useState(opcoes?.[0]?.id ?? null);

  const selecionar = (id) => {
    setSelecionada(id);
    const opcao = opcoes.find(o => o.id === id);
    if (onOpcaoSelecionada) onOpcaoSelecionada(opcao);
  };

  if (!endereco || !opcoes?.length) return null;

  return (
    <div style={{
      marginTop: '16px', borderRadius: '12px', overflow: 'hidden',
      border: `1px solid ${border}`,
      backgroundColor: isDark ? '#111' : '#fff',
    }}>
      {/* Cabeçalho destino */}
      <div style={{
        padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '8px',
        borderBottom: `1px solid ${border}`,
        backgroundColor: isDark ? '#1a1a1a' : '#fdf0f2',
      }}>
        <span style={{ fontSize: '16px' }}>📍</span>
        <div>
          <span style={{ fontSize: '13px', fontWeight: '700', color: text }}>
            {endereco.cidade} – {endereco.estado}
          </span>
          {endereco.bairro && (
            <span style={{ fontSize: '12px', color: sub }}> · {endereco.bairro}</span>
          )}
          <div style={{ fontSize: '11px', color: sub, marginTop: '1px' }}>CEP {endereco.cep}</div>
        </div>
      </div>

      {/* Opções de entrega */}
      <div style={{ padding: '12px 14px' }}>
        <p style={{ fontSize: '12px', fontWeight: '700', color: sub, margin: '0 0 10px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
          Opções de entrega
        </p>
        {opcoes.map(opcao => (
          <OpcaoEntrega
            key={opcao.id}
            opcao={opcao}
            selecionada={selecionada === opcao.id}
            onSelecionar={selecionar}
            isDark={isDark} border={border} text={text} sub={sub}
          />
        ))}
      </div>
    </div>
  );
}

export default PainelEntrega;
