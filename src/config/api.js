// Detecta automaticamente se está no Codespaces ou localhost
const getApiUrl = () => {
  // Se estiver no Codespaces
  if (window.location.hostname.includes('github.dev') || 
      window.location.hostname.includes('githubpreview.dev') ||
      window.location.hostname.includes('app.github.dev')) {
    // Pega a URL base do Codespaces e troca a porta
    const baseUrl = window.location.origin.replace('-3000', '-7979');
    return baseUrl;
  }
  
  // Localhost
  return process.env.REACT_APP_API_URL || 'http://localhost:7979';
};

export const API_URL = getApiUrl();

console.log('🔧 API URL configurada:', API_URL);
