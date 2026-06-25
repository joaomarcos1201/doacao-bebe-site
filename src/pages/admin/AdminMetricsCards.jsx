import React from 'react';
import { FaUsers, FaBox, FaChartLine, FaDollarSign, FaMoneyBillWave } from 'react-icons/fa';

function BarChartSimple({ isDark, data }) {
  const max = Math.max(1, ...data.map(d => d.value));

  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end', height: 160 }}>
        {data.map(d => {
          const pct = d.value / max;
          return (
            <div key={d.key} style={{ flex: 1, textAlign: 'center' }}>
              <div
                style={{
                  height: `${Math.max(6, Math.round(pct * 100))}%`,
                  background: isDark ? '#2a1b1e' : '#fde8ec',
                  border: `1px solid ${isDark ? '#c0606a' : '#c0606a'}`,
                  borderRadius: 10,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 12,
                  fontWeight: 900,
                  color: isDark ? '#c0606a' : '#c0606a',
                }}
                title={`${d.label}: ${d.value}`}
              >
                {d.value}
              </div>
              <div style={{ marginTop: 8, fontSize: 11, fontWeight: 800, color: isDark ? '#888' : '#888' }}>
                {d.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function AdminMetricsCards({
  isDark,
  totalVendas,
  faturamentoBruto,
  lucroPlataforma,
  usuariosCount,
  pendingProducts,
  pendingWithdrawals,
  taxaPlataforma,
  vendasPorDia,
}) {
  const card = (bgEmoji, title, value, icon, color) => (
    <div
      style={{
        backgroundColor: isDark ? '#141414' : '#fff',
        border: `1px solid ${isDark ? '#2a2a2a' : '#f0e6e8'}`,
        borderRadius: 18,
        padding: 18,
        boxShadow: isDark ? 'none' : '0 10px 30px rgba(192,96,106,0.06)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 14,
              border: `1px solid ${isDark ? '#2a2a2a' : '#f0e6e8'}`,
              background: isDark ? '#141414' : '#fde8ec',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: color,
              fontWeight: 900,
            }}
          >
            {icon}
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 900, color: isDark ? '#aaa' : '#888', textTransform: 'uppercase', letterSpacing: 0.6 }}>
              {title}
            </div>
            <div style={{ fontSize: 12, color: isDark ? '#888' : '#888', fontWeight: 800 }}>{bgEmoji}</div>
          </div>
        </div>
      </div>
      <div style={{ fontSize: 26, fontWeight: 1000, color }}>{value}</div>
    </div>
  );

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 18 }}>
        {card('⭐ Total', 'Total de Vendas', totalVendas, <FaBox />, '#c0606a')}
        {card('💰 Bruto', 'Faturamento Bruto', `R$ ${faturamentoBruto.toFixed(2)}`, <FaDollarSign />, '#4caf50')}
        {card(`Taxa ${Math.round(taxaPlataforma * 100)}%`, 'Lucro da Plataforma', `R$ ${lucroPlataforma.toFixed(2)}`, <FaChartLine />, '#2196f3')}
        {card('👥 Ativos', 'Usuários', usuariosCount, <FaUsers />, '#ff9800')}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, alignItems: 'start' }}>
        <div
          style={{
            backgroundColor: isDark ? '#141414' : '#fff',
            border: `1px solid ${isDark ? '#2a2a2a' : '#f0e6e8'}`,
            borderRadius: 20,
            padding: 18,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <FaChartLine color={isDark ? '#c0606a' : '#c0606a'} />
              <h2 style={{ margin: 0, fontSize: 15, fontWeight: 1000 }}>Crescimento de vendas (últimos 7 dias)</h2>
            </div>
            <div style={{ fontSize: 12, color: isDark ? '#888' : '#888', fontWeight: 900 }}>Contagem por dia</div>
          </div>
          <BarChartSimple isDark={isDark} data={vendasPorDia} />
        </div>

        <div
          style={{
            backgroundColor: isDark ? '#141414' : '#fff',
            border: `1px solid ${isDark ? '#2a2a2a' : '#f0e6e8'}`,
            borderRadius: 20,
            padding: 18,
          }}
        >
          <h3 style={{ margin: 0, fontSize: 14, fontWeight: 1000 }}>Pendências</h3>

          <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ padding: 14, borderRadius: 14, border: `1px solid ${isDark ? '#2a2a2a' : '#f0e6e8'}` }}>
              <div style={{ fontSize: 12, fontWeight: 1000, color: isDark ? '#aaa' : '#888' }}>Produtos pendentes</div>
              <div style={{ marginTop: 6, fontSize: 22, fontWeight: 1000, color: '#ff9800' }}>{pendingProducts}</div>
            </div>
            <div style={{ padding: 14, borderRadius: 14, border: `1px solid ${isDark ? '#2a2a2a' : '#f0e6e8'}` }}>
              <div style={{ fontSize: 12, fontWeight: 1000, color: isDark ? '#aaa' : '#888' }}>Saques pendentes</div>
              <div style={{ marginTop: 6, fontSize: 22, fontWeight: 1000, color: '#4caf50' }}>{pendingWithdrawals}</div>
            </div>

            <div style={{ padding: 14, borderRadius: 14, border: `1px solid ${isDark ? '#2a2a2a' : '#f0e6e8'}`, background: isDark ? '#1a1a1a' : '#fdf0f2' }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <FaMoneyBillWave color={isDark ? '#4caf50' : '#4caf50'} />
                <div>
                  <div style={{ fontSize: 12, fontWeight: 1000, color: isDark ? '#aaa' : '#888' }}>Taxa plataforma</div>
                  <div style={{ marginTop: 4, fontSize: 18, fontWeight: 1000, color: '#2196f3' }}>{Math.round(taxaPlataforma * 100)}%</div>
                </div>
              </div>
              <div style={{ marginTop: 8, fontSize: 12, color: isDark ? '#888' : '#666', fontWeight: 800, lineHeight: 1.4 }}>
                Cálculo baseado em CarteiraService (COMISSAO_PERCENTUAL).
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

