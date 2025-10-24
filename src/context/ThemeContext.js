import React, { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme deve ser usado dentro de ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem('darkMode', JSON.stringify(newTheme));
  };

  const theme = {
    background: isDark ? '#0f0f23' : '#ffffff',
    cardBackground: isDark ? '#1a1a2e' : '#ffffff',
    text: isDark ? '#e2e8f0' : '#1a1a1a',
    textSecondary: isDark ? '#94a3b8' : '#4a4a4a',
    border: isDark ? '#334155' : '#cccccc',
    primary: isDark ? '#f472b6' : '#8B4A6B',
    primaryHover: isDark ? '#ec4899' : '#7a4160',
    success: '#22c55e',
    danger: '#ef4444',
    whatsapp: '#25D366',
    inputBg: isDark ? '#1e293b' : '#ffffff',
    inputBorder: isDark ? '#475569' : '#cccccc',
    headerBg: isDark ? 'rgba(15, 15, 35, 0.95)' : 'rgba(255, 255, 255, 0.95)',
    cardBg: isDark ? 'rgba(26, 26, 46, 0.95)' : 'rgba(255, 255, 255, 0.95)',
    footerBg: isDark ? 'rgba(15, 15, 35, 0.98)' : 'rgba(255, 255, 255, 0.95)'
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};