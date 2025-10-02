import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import Home from './pages/Home';
import Admin from './pages/Admin';
import Doacao from './pages/Doacao';
import DetalhesProduto from './pages/DetalhesProduto';
import Perfil from './pages/Perfil';
import RecuperarSenha from './pages/RecuperarSenha';
import SobreNos from './pages/SobreNos';
import FaleConosco from './pages/FaleConosco';
import FAQ from './pages/FAQ';
import Chat from './pages/Chat';
import { ProdutosProvider } from './context/ProdutosContext';
import { ThemeProvider } from './context/ThemeContext';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Carregar usuário do localStorage ao iniciar
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  // Salvar usuário no localStorage quando mudar
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '24px', marginBottom: '10px' }}>🔄</div>
          <div>Carregando...</div>
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider>
        <ProdutosProvider>
          <Router>
            <div className="App">
              <Routes>
                <Route path="/login" element={<Login setUser={setUser} />} />
                <Route path="/cadastro" element={<Cadastro />} />
                <Route path="/home" element={user ? <Home user={user} setUser={setUser} /> : <Navigate to="/login" />} />
                <Route path="/admin" element={user && user.isAdmin ? <Admin /> : <Navigate to="/login" />} />
                <Route path="/doacao" element={user ? <Doacao /> : <Navigate to="/login" />} />
                <Route path="/produto/:id" element={user ? <DetalhesProduto /> : <Navigate to="/login" />} />
                <Route path="/perfil" element={user ? <Perfil user={user} setUser={setUser} /> : <Navigate to="/login" />} />

                <Route path="/sobre-nos" element={user ? <SobreNos /> : <Navigate to="/login" />} />
                <Route path="/fale-conosco" element={user ? <FaleConosco /> : <Navigate to="/login" />} />
                <Route path="/faq" element={user ? <FAQ /> : <Navigate to="/login" />} />
                <Route path="/chat/:produtoId" element={user ? <Chat /> : <Navigate to="/login" />} />
                <Route path="/recuperar-senha" element={<RecuperarSenha />} />
                <Route path="/" element={<Navigate to="/login" />} />
              </Routes>
            </div>
          </Router>
        </ProdutosProvider>
    </ThemeProvider>
  );
}

export default App;