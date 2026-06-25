import React from 'react';
import { FaSyncAlt } from 'react-icons/fa';

function AdminTopbar({ isDark, backendOnline, onRefresh }) {
  return (
    <div
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        height: 64,
        background: isDark ? 'rgba(18,18,18,0.98)' : 'rgba(255,255,255,0.98)',
        borderBottom: `1px solid ${isDark ? '#2a2a2a' : '#f0e6e8'}`,
        backdropFilter: 'blur(20px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 22px',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <div style={{ fontWeight: 900, color: isDark ? '#e8d0d4' : '#c0606a', fontSize: 14 }}>
          Admin Panel - Além do Positivo
        </div>
        <div style={{ fontSize: 12, color: isDark ? '#888' : '#888', fontWeight: 700 }}>
          Painel executivo (SaaS)
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span
          style={{
            padding: '6px 12px',
            borderRadius: 999,
            fontSize: 12,
            fontWeight: 900,
            backgroundColor: backendOnline ? 'rgba(76,175,80,0.12)' : 'rgba(239,68,68,0.12)',
            border: `1px solid ${backendOnline ? '#4caf50' : '#ef4444'}`,
            color: backendOnline ? '#4caf50' : '#ef4444',
          }}
        >
          {backendOnline ? 'ONLINE' : 'OFFLINE'} backend
        </span>

        <button
          onClick={onRefresh}
          style={{
            padding: '10px 14px',
            borderRadius: 12,
            border: `1px solid ${isDark ? '#2a2a2a' : '#f0e6e8'}`,
            background: 'transparent',
            cursor: 'pointer',
            color: isDark ? '#aaa' : '#666',
            fontWeight: 900,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <FaSyncAlt />
          Refresh
        </button>
      </div>
    </div>
  );
}

export default AdminTopbar;

