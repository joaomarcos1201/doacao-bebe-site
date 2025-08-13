import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import Home from './pages/Home';
import Admin from './pages/Admin';
import Doacao from './pages/Doacao';
import DetalhesProduto from './pages/DetalhesProduto';
import Perfil from './pages/Perfil';
import RecuperarSenha from './pages/RecuperarSenha';
import Carrinho from './pages/Carrinho';
import SobreNos from './pages/SobreNos';
import { ProdutosProvider } from './context/ProdutosContext';
import { ThemeProvider } from './context/ThemeContext';
import { CarrinhoProvider } from './context/CarrinhoContext';
import './App.css';

function App() {
  const [user, setUser] = useState(null);

  return (
    <ThemeProvider>
      <CarrinhoProvider>
        <ProdutosProvider>
          <Router>
            <div className="App">
              <Routes>
                <Route path="/login" element={<Login setUser={setUser} />} />
                <Route path="/cadastro" element={<Cadastro />} />
                <Route path="/home" element={user ? <Home user={user} setUser={setUser} /> : <Navigate to="/login" />} />
                <Route path="/admin" element={user ? <Admin /> : <Navigate to="/login" />} />
                <Route path="/doacao" element={user ? <Doacao /> : <Navigate to="/login" />} />
                <Route path="/produto/:id" element={user ? <DetalhesProduto /> : <Navigate to="/login" />} />
                <Route path="/perfil" element={user ? <Perfil user={user} setUser={setUser} /> : <Navigate to="/login" />} />
                <Route path="/carrinho" element={user ? <Carrinho /> : <Navigate to="/login" />} />
                <Route path="/sobre-nos" element={user ? <SobreNos /> : <Navigate to="/login" />} />
                <Route path="/recuperar-senha" element={<RecuperarSenha />} />
                <Route path="/" element={<Navigate to="/login" />} />
              </Routes>
            </div>
          </Router>
        </ProdutosProvider>
      </CarrinhoProvider>
    </ThemeProvider>
  );
}

export default App;