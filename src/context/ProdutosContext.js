import React, { createContext, useContext, useState } from 'react';

const ProdutosContext = createContext();

export const useProdutos = () => {
  const context = useContext(ProdutosContext);
  if (!context) {
    throw new Error('useProdutos deve ser usado dentro de ProdutosProvider');
  }
  return context;
};

export const ProdutosProvider = ({ children }) => {
  const [produtos, setProdutos] = useState([
    {
      id: 1,
      nome: 'Carrinho de Bebê',
      categoria: 'moveis',
      descricao: 'Carrinho em ótimo estado, usado por 6 meses',
      estado: 'seminovo',
      doador: 'Maria Silva',
      contato: '(11) 99999-9999',
      imagem: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400'
    },
    {
      id: 2,
      nome: 'Roupas de Gestante - Tamanho M',
      categoria: 'roupas',
      descricao: 'Lote com 10 peças variadas',
      estado: 'usado',
      doador: 'Ana Santos',
      contato: '(11) 88888-8888',
      imagem: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400'
    },
    {
      id: 3,
      nome: 'Berço Portátil',
      categoria: 'moveis',
      descricao: 'Berço desmontável, fácil de transportar',
      estado: 'seminovo',
      doador: 'João Oliveira',
      contato: '(11) 77777-7777',
      imagem: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400'
    }
  ]);

  const adicionarProduto = (novoProduto) => {
    const produto = {
      ...novoProduto,
      id: Date.now(),
      doador: 'Usuário Logado'
    };
    setProdutos(prev => [produto, ...prev]);
  };

  return (
    <ProdutosContext.Provider value={{ produtos, adicionarProduto }}>
      {children}
    </ProdutosContext.Provider>
  );
};