import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home({ user, setUser }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    navigate('/login');
  };

  const produtos = [
    {
      id: 1,
      nome: 'Carrinho de Bebê',
      categoria: 'Bebê',
      descricao: 'Carrinho em ótimo estado, usado por 6 meses',
      doador: 'Maria Silva',
      contato: '(11) 99999-9999'
    },
    {
      id: 2,
      nome: 'Roupas de Gestante - Tamanho M',
      categoria: 'Gestante',
      descricao: 'Lote com 10 peças variadas',
      doador: 'Ana Santos',
      contato: '(11) 88888-8888'
    },
    {
      id: 3,
      nome: 'Berço Portátil',
      categoria: 'Bebê',
      descricao: 'Berço desmontável, fácil de transportar',
      doador: 'João Oliveira',
      contato: '(11) 77777-7777'
    },
    {
      id: 4,
      nome: 'Kit Amamentação',
      categoria: 'Gestante',
      descricao: 'Bomba tira-leite e acessórios',
      doador: 'Carla Lima',
      contato: '(11) 66666-6666'
    },
    {
      id: 5,
      nome: 'Roupas de Bebê 0-6 meses',
      categoria: 'Bebê',
      descricao: 'Lote com 20 peças variadas',
      doador: 'Patricia Costa',
      contato: '(11) 55555-5555'
    },
    {
      id: 6,
      nome: 'Cadeirinha para Carro',
      categoria: 'Bebê',
      descricao: 'Cadeirinha grupo 0+, até 13kg',
      doador: 'Roberto Alves',
      contato: '(11) 44444-4444'
    }
  ];

  const handleContact = (contato) => {
    alert(`Entre em contato: ${contato}`);
  };

  return (
    <div>
      <header className="header">
        <div className="nav">
          <h1>Além do Positivo</h1>
          <div>
            <span>Olá, {user.nome}!</span>
            <button className="logout-btn" onClick={handleLogout}>Sair</button>
          </div>
        </div>
      </header>

      <div className="products-grid">
        {produtos.map(produto => (
          <div key={produto.id} className="product-card">
            <h3>{produto.nome}</h3>
            <p><strong>Categoria:</strong> {produto.categoria}</p>
            <p><strong>Descrição:</strong> {produto.descricao}</p>
            <p><strong>Doador:</strong> {produto.doador}</p>
            <button 
              className="contact-btn"
              onClick={() => handleContact(produto.contato)}
            >
              Entrar em Contato
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;