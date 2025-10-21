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
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const theme = {
    background: '#ffffff',
    cardBackground: '#ffffff',
    text: isDark ? '#ffffff' : '#1a1a1a',
    textSecondary: isDark ? '#cccccc' : '#4a4a4a',
    border: isDark ? '#4a4a4a' : '#cccccc',
    primary: isDark ? '#ff85a2' : '#8B4A6B',
    success: '#22c55e',
    danger: '#ef4444',
    whatsapp: '#25D366',
    inputBg: isDark ? '#3a3a3a' : '#ffffff',
    inputBorder: isDark ? '#5a5a5a' : '#cccccc'
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};