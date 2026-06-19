// Função para interceptar respostas HTTP e tratar contas inativas
export const handleHttpResponse = async (response, navigate, setUser) => {
  // Mapear códigos comuns para ações amigáveis
  try {
    if (response.status === 400) {
      const t = await response.text().catch(() => 'Requisição inválida');
      alert(t || 'Requisição inválida');
      return null;
    }

    if (response.status === 401) {
      alert('Credenciais inválidas ou sessão expirada. Faça login novamente.');
      setUser(null);
      localStorage.removeItem('token');
      navigate('/login');
      return null;
    }

    if (response.status === 403) {
      const errorData = await response.json().catch(() => ({}));
      const msg = (errorData && (errorData.error || errorData.message)) || 'Acesso negado.';
      alert(msg.includes('Conta inativa') ? 'Sua conta foi desativada. Entre em contato com o administrador.' : msg);
      setUser(null);
      localStorage.removeItem('token');
      navigate('/login');
      return null;
    }

    if (response.status === 500) {
      alert('Erro interno no servidor. Tente novamente mais tarde.');
      return null;
    }

    if (!response.ok) {
      const txt = await response.text().catch(() => 'Erro na requisição');
      alert(txt || 'Erro na requisição');
      return null;
    }
  } catch (e) {
    console.error('Erro ao processar resposta HTTP:', e);
    return null;
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