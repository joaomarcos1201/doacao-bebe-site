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
    background: isDark ? '#0f1419' : '#ffffff',
    cardBackground: isDark ? '#1e2328' : '#ffffff',
    text: isDark ? '#e6e6e6' : '#2d2d2d',
    textSecondary: isDark ? '#a0a0a0' : '#666666',
    border: isDark ? '#3e4147' : '#dddddd',
    primary: isDark ? '#ff6b9d' : '#AD7378',
    success: '#28a745',
    danger: '#dc3545',
    whatsapp: '#25D366',
    inputBg: isDark ? '#2a2d33' : '#ffffff',
    inputBorder: isDark ? '#4a4d53' : '#dddddd'
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};