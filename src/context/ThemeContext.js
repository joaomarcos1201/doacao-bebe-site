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
    background: isDark ? '#454B60' : '#F7B6BA',
    cardBackground: isDark ? '#69484B' : '#ffffff',
    text: isDark ? '#F2A1A8' : '#454B60',
    textSecondary: isDark ? '#B3787D' : '#69484B',
    border: isDark ? '#AD7378' : '#B3747A',
    primary: '#AD7378',
    success: '#B3787D',
    danger: '#B3747A',
    whatsapp: '#25D366'
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};