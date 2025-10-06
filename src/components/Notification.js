import React, { useState, useEffect } from 'react';

const Notification = ({ message, type = 'info', duration = 4000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      default: return 'ℹ️';
    }
  };

  const getColors = () => {
    switch (type) {
      case 'success': return { bg: '#d4edda', border: '#c3e6cb', text: '#155724' };
      case 'error': return { bg: '#f8d7da', border: '#f5c6cb', text: '#721c24' };
      case 'warning': return { bg: '#fff3cd', border: '#ffeaa7', text: '#856404' };
      case 'info': return { bg: '#d1ecf1', border: '#bee5eb', text: '#0c5460' };
      default: return { bg: '#d1ecf1', border: '#bee5eb', text: '#0c5460' };
    }
  };

  const colors = getColors();

  return (
    <div
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 10000,
        backgroundColor: colors.bg,
        border: `1px solid ${colors.border}`,
        borderRadius: '8px',
        padding: '16px 20px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        minWidth: '300px',
        maxWidth: '500px',
        transform: isVisible ? 'translateX(0)' : 'translateX(100%)',
        opacity: isVisible ? 1 : 0,
        transition: 'all 0.3s ease-in-out'
      }}
    >
      <span style={{ fontSize: '20px' }}>{getIcon()}</span>
      <div style={{ color: colors.text, fontSize: '14px', fontWeight: '500', whiteSpace: 'pre-line' }}>
        {message}
      </div>
      <button
        onClick={() => {
          setIsVisible(false);
          setTimeout(onClose, 300);
        }}
        style={{
          background: 'none',
          border: 'none',
          color: colors.text,
          cursor: 'pointer',
          fontSize: '18px',
          marginLeft: 'auto',
          opacity: 0.7
        }}
      >
        ×
      </button>
    </div>
  );
};

export default Notification;