import React from 'react';
import { createRoot } from 'react-dom/client';
import { act } from 'react-dom/test-utils';
import Home from './Home';

jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn(),
  Link: ({ children }) => <span>{children}</span>,
}));
jest.mock('../context/ThemeContext', () => ({ useTheme: () => ({ isDark: false, theme: {}, toggleTheme: jest.fn() }) }));
jest.mock('../config/api', () => ({ API_URL: 'http://test', api: {} }));
jest.mock('../components/CardProduto', () => ({ produto }) => <div>{produto.nome}</div>);

test('Home consulta disponíveis e remove produto após atualizar ao receber foco', async () => {
  global.IS_REACT_ACT_ENVIRONMENT = true;
  const originalFetch = global.fetch;
  global.fetch = jest.fn()
    .mockResolvedValueOnce({ ok: true, json: async () => [{ id: 1, nome: 'Carrinho teste', categoria: 'outros', statusAnuncio: 'DISPONIVEL' }] })
    .mockResolvedValueOnce({ ok: true, json: async () => [] });
  const container = document.createElement('div');
  const root = createRoot(container);
  try {
    await act(async () => { root.render(<Home user={null} setUser={() => {}} />); });
    expect(global.fetch).toHaveBeenCalledWith('http://test/api/products', { cache: 'no-store' });
    expect(container.textContent).toContain('Carrinho teste');
    await act(async () => { window.dispatchEvent(new Event('focus')); });
    expect(container.textContent).not.toContain('Carrinho teste');
  } finally {
    act(() => root.unmount());
    global.fetch = originalFetch;
    delete global.IS_REACT_ACT_ENVIRONMENT;
  }
});
