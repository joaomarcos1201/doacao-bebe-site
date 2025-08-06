import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Cadastro() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [telefone, setTelefone] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (nome && email && senha && telefone) {
      alert('Cadastro realizado com sucesso!');
      navigate('/login');
    }
  };

  return (
    <div className="container">
      <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#ff69b4' }}>
        Cadastro - Além do Positivo
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nome:</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Telefone:</label>
          <input
            type="tel"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Senha:</label>
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn">Cadastrar</button>
      </form>
      <div className="link">
        <Link to="/login">Já tem conta? Faça login</Link>
      </div>
    </div>
  );
}

export default Cadastro;