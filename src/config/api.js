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

const authHeaders = () => ({
  'Authorization': `Bearer ${localStorage.getItem('token')}`,
  'Content-Type': 'application/json'
});

export const api = {
  calcularFrete: (produtoId, cepDestino) =>
    fetch(`${API_URL}/api/shipping/calculate`, {
      method: 'POST', headers: authHeaders(),
      body: JSON.stringify({ produtoId, cepDestino })
    }).then(r => r.json()),

  checkout: (produtoId, cepDestino) =>
    fetch(`${API_URL}/api/checkout`, {
      method: 'POST', headers: authHeaders(),
      body: JSON.stringify({ produtoId, cepDestino })
    }).then(r => r.json()),

  meusPedidos: () =>
    fetch(`${API_URL}/api/orders`, { headers: authHeaders() }).then(r => r.json()),

  minhasVendas: () =>
    fetch(`${API_URL}/api/orders/vendas`, { headers: authHeaders() }).then(r => r.json()),

  carteira: () =>
    fetch(`${API_URL}/api/wallet`, { headers: authHeaders() }).then(r => r.json()),

  historicoCarteira: () =>
    fetch(`${API_URL}/api/wallet/history`, { headers: authHeaders() }).then(r => r.json()),

  solicitarSaque: (valor) =>
    fetch(`${API_URL}/api/withdrawals`, {
      method: 'POST', headers: authHeaders(),
      body: JSON.stringify({ valor })
    }).then(r => r.json()),

  meusSaques: () =>
    fetch(`${API_URL}/api/withdrawals`, { headers: authHeaders() }).then(r => r.json()),

  todosSaques: () =>
    fetch(`${API_URL}/api/withdrawals/admin`, { headers: authHeaders() }).then(r => r.json()),

  resolverSaque: (id, aprovado) =>
    fetch(`${API_URL}/api/withdrawals/${id}/status?aprovado=${aprovado}`, {
      method: 'PUT', headers: authHeaders()
    }).then(r => r.json()),

  todosPedidos: () =>
    fetch(`${API_URL}/api/orders/admin`, { headers: authHeaders() }).then(r => r.json()),

  alterarStatusProduto: (id, status) =>
    fetch(`${API_URL}/api/products/${id}/status?status=${status}`, {
      method: 'PUT', headers: authHeaders()
    }).then(r => r.text()),
};
