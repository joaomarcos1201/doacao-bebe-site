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
      imagem: 'https://voyageinfantil.com.br/cdn/shop/files/z01bfqcxq37wx2ew807pjm2pa0mk.png?v=1739392467'
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
      nome: 'Berço Portátil ',
      categoria: 'moveis',
      descricao: 'Berço portátil com estrutura reforçada, sistema de montagem rápida e colchão incluso. Ideal para viagens e uso doméstico.',
      estado: 'seminovo',
      doador: 'João Oliveira',
      contato: '(11) 77777-7777',
      imagem: 'https://abramais.vteximg.com.br/arquivos/ids/220680/berco-portatil-hello-cinza-risca-diagonal.jpg?v=638436066808600000'
    },
    {
      id: 4,
      nome: 'Brinquedos',
      categoria: 'brinquedos',
      descricao: 'Kit com diversos brinquedos educativos e de entretenimento para bebês e crianças pequenas.',
      estado: 'Novo',
      doador: 'simone Menezes',
      contato: '(11) 66666-6666',
      imagem: 'https://a-static.mlcdn.com.br/1500x1500/kit-brinquedos-educativos-de-madeira-primeira-infancia-aramado-pedagogico-sensoriais-bebe-infantil-brinque-e-leia/brinqueeleia/13438465083/dd04c8fcc517710a96588637e2c7c4fe.jpeg'
    },
    {
      id: 5,
      nome: 'Mochila Maternidade',
      categoria: 'acessorios',
      descricao: 'Mochila espaçosa com múltiplos compartimentos, ganchos para carrinho. Ideal para passeios.',
      estado: 'novo',
      doador: 'Fernanda Costa',
      contato: '(11) 33333-3333',
      imagem: 'https://cdn.awsli.com.br/600x700/1553/1553321/produto/285443956/mochila-funcional-77117079b8354b374c9bfcb25327de39b9b6d15d-zngso87pko.jpg'
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

  const removerProduto = (produtoId) => {
    setProdutos(prev => prev.filter(produto => produto.id !== produtoId));
  };

  return (
    <ProdutosContext.Provider value={{ produtos, adicionarProduto, removerProduto }}>
      {children}
    </ProdutosContext.Provider>
  );
};