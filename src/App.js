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
import TermosPrivacidade from './pages/TermosPrivacidade';
import ManualSeguranca from './pages/ManualSeguranca';
import UserStatusChecker from './components/UserStatusChecker';
import { ProdutosProvider } from './context/ProdutosContext';
import { ThemeProvider } from './context/ThemeContext';
import './App.css';
import './styles/global.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Carregar usuário do backend ao iniciar
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetch('http://localhost:7979/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else if (response.status === 400) {
          // Verificar se é conta inativa
          return response.text().then(errorText => {
            if (errorText.includes('Conta inativa')) {
              alert('⚠️ Sua conta foi desativada pelo administrador.\n\nEntre em contato conosco para mais informações.');
              throw new Error('Conta inativa');
            }
            throw new Error(errorText || 'Token inválido');
          });
        } else {
          throw new Error('Token inválido');
        }
      })
      .then(data => {
        console.log('DEBUG App - dados recebidos do backend:', data);
        const userData = {
          id: data.id,
          nome: data.nome,
          email: data.email,
          isAdmin: data.isAdmin
        };
        console.log('DEBUG App - userData criado:', userData);
        setUser(userData);
      })
      .catch(error => {
        console.error('Erro ao carregar usuário:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      });
    }
    setLoading(false);
  }, []);



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
              {user && <UserStatusChecker user={user} setUser={setUser} />}
              <Routes>
                <Route path="/login" element={<Login setUser={setUser} />} />
                <Route path="/cadastro" element={<Cadastro />} />
                <Route path="/home" element={user ? <Home user={user} setUser={setUser} /> : <Navigate to="/login" />} />
                <Route path="/admin" element={user && (user.isAdmin || user.email === 'admin@alemdopositivo.com') ? <Admin /> : <Navigate to="/login" />} />
                <Route path="/doacao" element={user ? <Doacao /> : <Navigate to="/login" />} />
                <Route path="/produto/:id" element={user ? <DetalhesProduto /> : <Navigate to="/login" />} />
                <Route path="/perfil" element={user ? <Perfil user={user} setUser={setUser} /> : <Navigate to="/login" />} />

                <Route path="/sobre-nos" element={user ? <SobreNos /> : <Navigate to="/login" />} />
                <Route path="/fale-conosco" element={user ? <FaleConosco /> : <Navigate to="/login" />} />
                <Route path="/faq" element={user ? <FAQ /> : <Navigate to="/login" />} />
                <Route path="/termos-privacidade" element={user ? <TermosPrivacidade /> : <Navigate to="/login" />} />
                <Route path="/manual-seguranca" element={user ? <ManualSeguranca /> : <Navigate to="/login" />} />

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