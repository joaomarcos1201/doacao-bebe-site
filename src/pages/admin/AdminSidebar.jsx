import React from 'react';
import { FaChartLine, FaBox, FaUsers, FaMoneyBillWave, FaReceipt, FaCog } from 'react-icons/fa';

function AdminSidebar({
  isDark,
  active,
  onNavigate,
  pendingProducts,
  pendingWithdrawals,
}) {
  const itemStyle = (id) => ({
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '12px 14px',
    borderRadius: 12,
    cursor: 'pointer',
    border: `1px solid ${active === id ? '#c0606a' : isDark ? '#2a2a2a' : '#f0e6e8'}`,
    backgroundColor: active === id ? (isDark ? '#2a1b1e' : '#fde8ec') : 'transparent',
    color: active === id ? '#c0606a' : isDark ? '#aaa' : '#666',
    fontWeight: 800,
    fontSize: 13,
    userSelect: 'none',
  });

  const badge = (count) => (
    <span
      style={{
        marginLeft: 'auto',
        padding: '4px 10px',
        borderRadius: 999,
        backgroundColor: '#c0606a',
        color: 'white',
        fontSize: 11,
        fontWeight: 900,
        border: '1px solid rgba(0,0,0,0.0)',
      }}
    >
      {count}
    </span>
  );

  return (
    <aside
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        width: 260,
        background: isDark ? 'rgba(20,20,20,0.98)' : 'rgba(255,255,255,0.98)',
        borderRight: `1px solid ${isDark ? '#2a2a2a' : '#f0e6e8'}`,
        padding: '18px 16px',
        overflowY: 'auto',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: 12,
            backgroundColor: '#c0606a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 900,
          }}
        >
          ⭐
        </div>
        <div style={{ lineHeight: 1.1 }}>
          <div style={{ fontSize: 13, fontWeight: 900, color: isDark ? '#e8d0d4' : '#c0606a' }}>
            Admin Panel
          </div>
          <div style={{ fontSize: 11, color: isDark ? '#888' : '#999', fontWeight: 700 }}>
            Além do Positivo
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={itemStyle('dashboard')} onClick={() => onNavigate('dashboard')}>
          <FaChartLine />
          Dashboard
        </div>
        <div style={itemStyle('moderacao')} onClick={() => onNavigate('moderacao')}>
          <FaBox />
          Moderação
          {pendingProducts > 0 ? badge(pendingProducts) : null}
        </div>
        <div style={itemStyle('financeiro')} onClick={() => onNavigate('financeiro')}>
          <FaMoneyBillWave />
          Financeiro
        </div>
        <div style={itemStyle('usuarios')} onClick={() => onNavigate('usuarios')}>
          <FaUsers />
          Usuários
        </div>
        <div style={{ ...itemStyle('saques'), opacity: 0.95 }} onClick={() => onNavigate('financeiro')}>
          <FaReceipt />
          Saques
          {pendingWithdrawals > 0 ? badge(pendingWithdrawals) : null}
        </div>

        <div style={{ marginTop: 8, padding: '10px 10px', borderRadius: 12, border: `1px solid ${isDark ? '#2a2a2a' : '#f0e6e8'}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontWeight: 900, fontSize: 12, color: isDark ? '#ccc' : '#666' }}>
            <FaCog />
            Módulos
          </div>
          <div style={{ marginTop: 8, fontSize: 12, color: isDark ? '#888' : '#888', fontWeight: 700, lineHeight: 1.4 }}>
            UI SaaS + fluxos admin.
          </div>
        </div>
      </div>
    </aside>
  );
}

export default AdminSidebar;

