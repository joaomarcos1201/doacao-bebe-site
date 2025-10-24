import React, { createContext, useContext, useState, useEffect } from 'react';

const ProdutosContext = createContext();

export const useProdutos = () => {
  const context = useContext(ProdutosContext);
  if (!context) {
    throw new Error('useProdutos deve ser usado dentro de ProdutosProvider');
  }
  return context;
};

export const ProdutosProvider = ({ children }) => {
  const [produtos, setProdutos] = useState([]);

  useEffect(() => {
    carregarProdutos();
  }, []);

  const carregarProdutos = async () => {
    try {
      const response = await fetch('http://localhost:7979/api/produtos');
      if (response.ok) {
        const data = await response.json();
        setProdutos(data);
      }
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    }
  };

  const adicionarProduto = async (novoProduto) => {
    try {
      const response = await fetch('http://localhost:7979/api/produtos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(novoProduto),
      });
      if (response.ok) {
        carregarProdutos();
      }
    } catch (error) {
      console.error('Erro ao adicionar produto:', error);
    }
  };

  const aprovarProduto = async (produtoId) => {
    try {
      const response = await fetch(`http://localhost:7979/api/produtos/${produtoId}/aprovar`, {
        method: 'PUT',
      });
      if (response.ok) {
        carregarProdutos();
      }
    } catch (error) {
      console.error('Erro ao aprovar produto:', error);
    }
  };

  const rejeitarProduto = async (produtoId) => {
    try {
      const response = await fetch(`http://localhost:7979/api/produtos/${produtoId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        carregarProdutos();
      }
    } catch (error) {
      console.error('Erro ao rejeitar produto:', error);
    }
  };

  const removerProduto = async (produtoId) => {
    try {
      const response = await fetch(`http://localhost:7979/api/produtos/${produtoId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        carregarProdutos();
      }
    } catch (error) {
      console.error('Erro ao remover produto:', error);
    }
  };

  return (
    <ProdutosContext.Provider value={{ produtos, adicionarProduto, removerProduto, aprovarProduto, rejeitarProduto }}>
      {children}
    </ProdutosContext.Provider>
  );
};