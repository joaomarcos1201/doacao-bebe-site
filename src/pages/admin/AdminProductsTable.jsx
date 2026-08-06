import React from 'react';

export default function AdminProductsTable({ isDark, produtos, onView, compact, backendOnline }) {
  const border = isDark ? '#2a2a2a' : '#f0e6e8';
  const sub = isDark ? '#666' : '#999';

  const statusColor = (s) => {
    const st = (s || '').toUpperCase();
    if (st === 'EM_ANALISE') return '#ff9800';
    if (st === 'APROVADO' || st === 'DISPONIVEL') return '#4caf50';
    if (st === 'REPROVADO') return '#ef4444';
    return '#2196f3';
  };

  const EmptyState = () => (
    <tr>
      <td colSpan={5} style={{ padding: '32px 18px', textAlign: 'center' }}>
        {backendOnline === false ? (
          <div>
            <div style={{ fontSize: 28, marginBottom: 8 }}>⚠️</div>
            <div style={{ fontWeight: 700, color: '#ef4444', fontSize: 14, marginBottom: 4 }}>Sem conexão com o servidor</div>
            <div style={{ color: sub, fontSize: 12 }}>O backend está offline. Reative o serviço no Render e clique em Atualizar.</div>
          </div>
        ) : (
          <div>
            <div style={{ fontSize: 28, marginBottom: 8 }}>✅</div>
            <div style={{ fontWeight: 700, color: isDark ? '#e0e0e0' : '#333', fontSize: 14, marginBottom: 4 }}>Nenhum produto pendente</div>
            <div style={{ color: sub, fontSize: 12 }}>Todos os anúncios foram revisados.</div>
          </div>
        )}
      </td>
    </tr>
  );
  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 15, fontWeight: 1000, color: isDark ? '#e0e0e0' : '#333' }}>
            Moderação de Produtos
          </h2>
          <div style={{ fontSize: 12, color: isDark ? '#888' : '#888', fontWeight: 900, marginTop: 4 }}>
            {produtos.length} itens
          </div>
        </div>
        {compact ? null : (
          <div style={{ fontSize: 12, color: isDark ? '#888' : '#888', fontWeight: 900 }}>
            Clique em VISUALIZAR para abrir detalhes completos
          </div>
        )}
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: compact ? 520 : 800 }}>
          <thead>
            <tr style={{ backgroundColor: isDark ? '#1a1a1a' : '#fdf0f2' }}>
              <th style={{ padding: '12px 14px', textAlign: 'left', fontSize: 12, fontWeight: 1000, color: isDark ? '#666' : '#999', textTransform: 'uppercase' }}>Imagem</th>
              <th style={{ padding: '12px 14px', textAlign: 'left', fontSize: 12, fontWeight: 1000, color: isDark ? '#666' : '#999', textTransform: 'uppercase' }}>Produto</th>
              <th style={{ padding: '12px 14px', textAlign: 'left', fontSize: 12, fontWeight: 1000, color: isDark ? '#666' : '#999', textTransform: 'uppercase' }}>Categoria</th>
              <th style={{ padding: '12px 14px', textAlign: 'left', fontSize: 12, fontWeight: 1000, color: isDark ? '#666' : '#999', textTransform: 'uppercase' }}>Status</th>
              <th style={{ padding: '12px 14px', textAlign: 'right', fontSize: 12, fontWeight: 1000, color: isDark ? '#666' : '#999', textTransform: 'uppercase' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {produtos.length === 0 ? (
              <EmptyState />
            ) : (
              produtos.map(p => {
                const status = (p.statusAnuncio || '').toUpperCase();
                const cor = statusColor(status);

                return (
                  <tr key={p.id} style={{ borderTop: `1px solid ${isDark ? '#2a2a2a' : '#f0e6e8'}` }}>
                    <td style={{ padding: 12 }}>
                      <div style={{ width: 48, height: 48, borderRadius: 12, overflow: 'hidden', background: isDark ? '#2a2a2a' : '#f0e6e8', border: `1px solid ${isDark ? '#2a2a2a' : '#f0e6e8'}` }}>
                        {p.foto ? (
                          <img src={`data:image/jpeg;base64,${p.foto}`} alt={p.nome} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, opacity: 0.4 }}>📦</div>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: 12 }}>
                      <div style={{ fontSize: 13, fontWeight: 1000, color: isDark ? '#e0e0e0' : '#333' }}>{p.nome}</div>
                    </td>
                    <td style={{ padding: 12 }}>
                      <div style={{ fontSize: 12, fontWeight: 900, color: isDark ? '#aaa' : '#888' }}>{p.categoria}</div>
                    </td>
                    <td style={{ padding: 12 }}>
                      <span
                        style={{
                          padding: '4px 10px',
                          borderRadius: 999,
                          fontSize: 11,
                          fontWeight: 1000,
                          backgroundColor: `${cor}15`,
                          color: cor,
                          border: `1px solid ${cor}`,
                        }}
                      >
                        {status}
                      </span>
                    </td>
                    <td style={{ padding: 12, textAlign: 'right' }}>
                      <button
                        onClick={() => onView(p)}
                        style={{
                          padding: '9px 14px',
                          borderRadius: 10,
                          border: `1px solid ${isDark ? '#2a2a2a' : '#f0e6e8'}`,
                          backgroundColor: isDark ? '#141414' : '#fff',
                          color: isDark ? '#e0e0e0' : '#333',
                          cursor: 'pointer',
                          fontWeight: 1000,
                        }}
                      >
                        VISUALIZAR
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

