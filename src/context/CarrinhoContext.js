import React, { createContext, useContext, useState } from 'react';

const CarrinhoContext = createContext();

export const useCarrinho = () => {
  const context = useContext(CarrinhoContext);
  if (!context) {
    throw new Error('useCarrinho deve ser usado dentro de CarrinhoProvider');
  }
  return context;
};

export const CarrinhoProvider = ({ children }) => {
  const [itensCarrinho, setItensCarrinho] = useState([]);

  const adicionarAoCarrinho = (produto) => {
    const jaExiste = itensCarrinho.find(item => item.id === produto.id);
    if (!jaExiste) {
      setItensCarrinho(prev => [...prev, produto]);
    }
  };

  const removerDoCarrinho = (produtoId) => {
    setItensCarrinho(prev => prev.filter(item => item.id !== produtoId));
  };

  const limparCarrinho = () => {
    setItensCarrinho([]);
  };

  const totalItens = itensCarrinho.length;

  return (
    <CarrinhoContext.Provider value={{
      itensCarrinho,
      adicionarAoCarrinho,
      removerDoCarrinho,
      limparCarrinho,
      totalItens
    }}>
      {children}
    </CarrinhoContext.Provider>
  );
};