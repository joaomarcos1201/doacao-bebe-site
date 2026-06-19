// Detecta automaticamente se está no Codespaces ou localhost,
// mas prioriza sempre a variável de ambiente REACT_APP_API_URL.
const getApiUrl = () => {
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }

  // Se estiver no Codespaces
  if (window.location.hostname.includes('github.dev') ||
      window.location.hostname.includes('githubpreview.dev') ||
      window.location.hostname.includes('app.github.dev')) {
    // Pega a URL base do Codespaces e troca a porta
    const baseUrl = window.location.origin.replace('-3000', '-7979');
    return baseUrl;
  }

  // Localhost como fallback
  return 'http://localhost:7979';
};

export const API_URL = getApiUrl();

console.log('🔧 API URL configurada:', API_URL);
const DEFAULT_TIMEOUT = 30000; // 30s

const authHeaders = () => ({
  'Authorization': `Bearer ${localStorage.getItem('token')}`,
  'Content-Type': 'application/json'
});

const fetchWithTimeout = (url, options = {}, timeout = DEFAULT_TIMEOUT) => {
  const controller = new AbortController();
  const signal = controller.signal;
  const start = Date.now();
  const timer = setTimeout(() => {
    controller.abort();
  }, timeout);

  return fetch(url, { ...options, signal })
    .then(async response => {
      const duration = Date.now() - start;
      if (duration > 5000) {
        console.warn('🟠 API slow response (possible cold start):', url, 'duration_ms=', duration);
      }

      if (response.ok) return response;

      // Ler corpo da resposta (json ou text)
      let bodyText = '';
      try {
        const ct = response.headers.get('content-type') || '';
        if (ct.includes('application/json')) {
          const json = await response.json();
          bodyText = JSON.stringify(json);
          if (json && typeof json === 'object' && (json.error || json.message)) {
            bodyText = json.error || json.message || bodyText;
          }
        } else {
          bodyText = await response.text();
        }
      } catch (e) {
        bodyText = '';
      }

      let message = bodyText || `Erro HTTP ${response.status}`;
      switch (response.status) {
        case 400:
          message = bodyText || 'Requisição inválida. Verifique os dados e tente novamente.';
          break;
        case 401:
          message = 'Credenciais inválidas ou sessão expirada. Faça login novamente.';
          break;
        case 403:
          if (bodyText && bodyText.includes('Conta inativa')) {
            message = 'Conta inativa. Entre em contato com o administrador.';
          } else {
            message = 'Acesso negado.';
          }
          break;
        case 404:
          message = 'Recurso não encontrado.';
          break;
        case 500:
          message = 'Erro interno no servidor. Tente novamente mais tarde.';
          break;
        default:
          // manter message já definido
      }

      const err = new Error(message);
      err.status = response.status;
      throw err;
    })
    .catch(err => {
      if (err.name === 'AbortError') {
        console.error('🔴 Request timed out:', url);
        throw new Error('timeout');
      }
      throw err;
    })
    .finally(() => clearTimeout(timer));
};

export const api = {
  // Auth endpoints centralizados
  login: (email, senha) =>
    fetchWithTimeout(`${API_URL}/api/auth/login`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha })
    }),

  cadastro: (nome, email, cpf, senha) =>
    fetchWithTimeout(`${API_URL}/api/auth/cadastro`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, email, cpf, senha })
    }),

  me: () =>
    fetchWithTimeout(`${API_URL}/api/auth/me`, { method: 'GET', headers: authHeaders() }),

  // Outros endpoints existentes (mantidos)
  calcularFrete: (produtoId, cepDestino) =>
    fetchWithTimeout(`${API_URL}/api/shipping/calculate`, {
      method: 'POST', headers: authHeaders(),
      body: JSON.stringify({ produtoId, cepDestino })
    }).then(r => r.json()),

  checkout: (produtoId, cepDestino) =>
    fetchWithTimeout(`${API_URL}/api/checkout`, {
      method: 'POST', headers: authHeaders(),
      body: JSON.stringify({ produtoId, cepDestino })
    }).then(r => r.json()),

  meusPedidos: () =>
    fetchWithTimeout(`${API_URL}/api/orders`, { headers: authHeaders() }).then(r => r.json()),

  minhasVendas: () =>
    fetchWithTimeout(`${API_URL}/api/orders/vendas`, { headers: authHeaders() }).then(r => r.json()),

  carteira: () =>
    fetchWithTimeout(`${API_URL}/api/wallet`, { headers: authHeaders() }).then(r => r.json()),

  historicoCarteira: () =>
    fetchWithTimeout(`${API_URL}/api/wallet/history`, { headers: authHeaders() }).then(r => r.json()),

  solicitarSaque: (valor) =>
    fetchWithTimeout(`${API_URL}/api/withdrawals`, {
      method: 'POST', headers: authHeaders(),
      body: JSON.stringify({ valor })
    }).then(r => r.json()),

  meusSaques: () =>
    fetchWithTimeout(`${API_URL}/api/withdrawals`, { headers: authHeaders() }).then(r => r.json()),

  todosSaques: () =>
    fetchWithTimeout(`${API_URL}/api/withdrawals/admin`, { headers: authHeaders() }).then(r => r.json()),

  resolverSaque: (id, aprovado) =>
    fetchWithTimeout(`${API_URL}/api/withdrawals/${id}/status?aprovado=${aprovado}`, {
      method: 'PUT', headers: authHeaders()
    }).then(r => r.json()),

  todosPedidos: () =>
    fetchWithTimeout(`${API_URL}/api/orders/admin`, { headers: authHeaders() }).then(r => r.json()),

  alterarStatusProduto: (id, status) =>
    fetchWithTimeout(`${API_URL}/api/products/${id}/status?status=${status}`, {
      method: 'PUT', headers: authHeaders()
    }).then(r => r.text()),
};
