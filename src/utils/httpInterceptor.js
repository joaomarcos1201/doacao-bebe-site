// Função para interceptar respostas HTTP e tratar contas inativas
export const handleHttpResponse = async (response, navigate, setUser) => {
  if (response.status === 403) {
    const errorData = await response.json().catch(() => ({}));
    if (errorData.error && errorData.error.includes('Conta inativa')) {
      alert('Sua conta foi desativada. Entre em contato com o administrador.');
      setUser(null);
      localStorage.removeItem('token');
      navigate('/login');
      return null;
    }
  }
  return response;
};

// Função para fazer requisições com interceptação automática
export const fetchWithInterceptor = async (url, options = {}, navigate, setUser) => {
  try {
    const response = await fetch(url, options);
    const interceptedResponse = await handleHttpResponse(response, navigate, setUser);
    return interceptedResponse;
  } catch (error) {
    console.error('Erro na requisição:', error);
    throw error;
  }
};