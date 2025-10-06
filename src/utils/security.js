// Utilitários de segurança para o frontend

// Sanitizar entrada do usuário
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .replace(/[<>]/g, '') // Remove < e >
    .replace(/javascript:/gi, '') // Remove javascript:
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
};

// Validar email
export const validateEmail = (email) => {
  const emailRegex = /^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  return emailRegex.test(email);
};

// Validar senha forte
export const validatePassword = (password) => {
  return password.length >= 8 && 
         /[A-Z]/.test(password) && 
         /[a-z]/.test(password) && 
         /[0-9]/.test(password);
};

// Headers seguros para requisições
export const getSecureHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// URL base segura
export const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://seu-dominio.com/api' 
  : 'http://localhost:8080/api';