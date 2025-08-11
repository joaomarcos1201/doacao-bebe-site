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
    background: isDark ? '#1a1a1a' : '#f8f9fa',
    cardBackground: isDark ? '#2d2d2d' : '#ffffff',
    text: isDark ? '#ffffff' : '#333333',
    textSecondary: isDark ? '#cccccc' : '#666666',
    border: isDark ? '#404040' : '#dddddd',
    primary: '#ff69b4',
    success: '#28a745',
    danger: '#dc3545',
    whatsapp: '#25D366'
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};