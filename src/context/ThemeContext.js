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
    background: isDark ? '#0a0a0a' : '#ffffff',
    cardBackground: isDark ? '#111111' : '#ffffff',
    text: isDark ? '#f5f5f5' : '#1a1a1a',
    textSecondary: isDark ? '#888888' : '#4a4a4a',
    border: isDark ? '#1f1f1f' : '#cccccc',
    primary: isDark ? '#E88AA2' : '#c0606a',
    primaryHover: isDark ? '#d4708a' : '#a85058',
    success: '#22c55e',
    danger: '#ef4444',
    whatsapp: '#25D366',
    inputBg: isDark ? '#161616' : '#ffffff',
    inputBorder: isDark ? '#2a2a2a' : '#cccccc',
    headerBg: isDark ? 'rgba(10,10,10,0.92)' : 'rgba(255,255,255,0.95)',
    cardBg: isDark ? 'rgba(17,17,17,0.95)' : 'rgba(255,255,255,0.95)',
    footerBg: isDark ? 'rgba(10,10,10,0.98)' : 'rgba(255,255,255,0.95)'
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};