import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Login({ setUser }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && senha) {
      setUser({ email, nome: email.split('@')[0] });
      navigate('/home');
    }
  };

  return (
    <div className="container">
      <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#ff69b4' }}>
        Login - Além do Positivo
      </h2>
      <form onSubmit={handleSubmit}>
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
          <label>Senha:</label>
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn">Entrar</button>
      </form>
      <div className="link">
        <Link to="/cadastro">Não tem conta? Cadastre-se</Link>
      </div>
    </div>
  );
}

export default Login;