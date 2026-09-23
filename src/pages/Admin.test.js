import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import Admin from './Admin';

const mockSuccess = jest.fn();
const mockError = jest.fn();
const mockCarregarProdutos = jest.fn().mockResolvedValue();
const mockConfirm = jest.fn((titulo, mensagem, action) => action());
jest.mock('react-router-dom', () => ({ useNavigate: () => jest.fn() }));
jest.mock('../context/ThemeContext', () => ({ useTheme: () => ({ isDark: false, toggleTheme: jest.fn() }) }));
jest.mock('../hooks/useNotification', () => ({ useNotification: () => ({ notifications: [], showSuccess: mockSuccess, showError: mockError, removeNotification: jest.fn() }) }));
jest.mock('../hooks/useConfirm', () => ({ useConfirm: () => ({ confirmState: {}, showConfirm: mockConfirm }) }));
jest.mock('../context/ProdutosContext', () => ({ useProdutos: () => ({ produtos: [], carregarProdutos: mockCarregarProdutos }) }));
jest.mock('../components/admin/AdminDashboard', () => () => null);
jest.mock('../components/ConfirmDialog', () => () => null);
jest.mock('../config/api', () => ({ API_URL: 'http://test', api: { todosPedidos: async () => [], todosSaques: async () => [] } }));

let container, root, originalFetch, usuario, resposta;
const click = async texto => {
  const botao = [...container.querySelectorAll('button')].find(b => b.textContent === texto);
  expect(botao).toBeDefined();
  await act(async () => { botao.dispatchEvent(new MouseEvent('click', { bubbles: true })); });
};

beforeEach(() => {
  jest.clearAllMocks();
  mockConfirm.mockImplementation((titulo, mensagem, action) => action());
  mockCarregarProdutos.mockResolvedValue();
  global.IS_REACT_ACT_ENVIRONMENT = true;
  originalFetch = global.fetch;
  localStorage.setItem('token', 'admin-token');
  usuario = { id: 48, nome: 'Pessoa Teste', email: 'teste@example.test', nivelAcesso: 'USER', statusUsuario: 'ATIVO' };
  resposta = { ok: true, text: async () => JSON.stringify({ message: 'Conta desativada. Histórico preservado.' }) };
  global.fetch = jest.fn(async (url, options) => {
    if (options?.method === 'DELETE') {
      if (resposta.ok) usuario = { ...usuario, statusUsuario: 'INATIVO' };
      return resposta;
    }
    return { ok: true, json: async () => url.endsWith('/api/usuarios') ? [{ ...usuario }] : [] };
  });
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
  global.fetch = originalFetch;
  localStorage.clear();
  delete global.IS_REACT_ACT_ENVIRONMENT;
});

const abrirUsuarios = async () => {
  await act(async () => root.render(<Admin />));
  await click('Usuários (1)');
  await click('⋯');
};

test('desativa com token, mostra mensagem e atualiza status/listagem e produtos', async () => {
  await abrirUsuarios();
  await click('Desativar conta');
  expect(global.fetch).toHaveBeenCalledWith('http://test/api/usuarios/48', {
    method: 'DELETE', headers: { Authorization: 'Bearer admin-token' },
  });
  expect(mockConfirm.mock.calls[0][1]).toContain('saldo serão preservados');
  expect(mockSuccess).toHaveBeenCalledWith('Conta desativada. Histórico preservado.');
  expect(mockError).not.toHaveBeenCalled();
  expect(global.fetch.mock.calls.filter(([url]) => url === 'http://test/api/usuarios')).toHaveLength(2);
  expect(container.querySelector('tbody').textContent).toContain('INATIVO');
  expect(mockCarregarProdutos).toHaveBeenCalledTimes(1);
});

test.each([
  ['JSON', JSON.stringify({ message: 'Usuário não encontrado.' }), 'Usuário não encontrado.'],
  ['texto', 'Operação não permitida.', 'Operação não permitida.'],
  ['filtro', JSON.stringify({ error: 'Conta inativa.' }), 'Conta inativa.'],
  ['vazio', '', 'Erro ao desativar conta.'],
])('erro %s mostra mensagem da API sem sucesso ou atualização indevida', async (_, corpo, mensagem) => {
  resposta = { ok: false, text: async () => corpo };
  await abrirUsuarios();
  await click('Desativar conta');
  expect(mockError).toHaveBeenCalledWith(mensagem);
  expect(mockSuccess).not.toHaveBeenCalled();
  expect(mockCarregarProdutos).not.toHaveBeenCalled();
  expect(container.querySelector('tbody').textContent).toContain('ATIVO');
  expect(global.fetch.mock.calls.filter(([url]) => url === 'http://test/api/usuarios')).toHaveLength(1);
});

test('não oferece desativar ou pausar administrador', async () => {
  usuario.nivelAcesso = 'ADMIN';
  await abrirUsuarios();
  expect(container.textContent).not.toContain('Desativar conta');
  expect(container.textContent).not.toContain('Pausar');
});
