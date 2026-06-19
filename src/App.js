import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import Home from './pages/Home';
import Admin from './pages/Admin';
import DetalhesProduto from './pages/DetalhesProduto';
import Perfil from './pages/Perfil';
import RecuperarSenha from './pages/RecuperarSenha';
import SobreNos from './pages/SobreNos';
import FaleConosco from './pages/FaleConosco';
import FAQ from './pages/FAQ';
import Chat from './pages/Chat';
import TermosPrivacidade from './pages/TermosPrivacidade';
import BaixarApp from './pages/BaixarApp';
import ManualSeguranca from './pages/ManualSeguranca';
import Checkout from './pages/Checkout';
import MeusPedidos from './pages/MeusPedidos';
import MinhasVendas from './pages/MinhasVendas';
import CadastrarProduto from './pages/CadastrarProduto';
import Carteira from './pages/Carteira';
import UserStatusChecker from './components/UserStatusChecker';
import { ProdutosProvider } from './context/ProdutosContext';
import { ThemeProvider } from './context/ThemeContext';
import { api } from './config/api';
import './App.css';
import './styles/global.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Carregar usuário do backend ao iniciar
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) { setLoading(false); return; }

      try {
        const response = await api.me();
        if (response && response.ok) {
          const data = await response.json();
          console.log('DEBUG App - dados recebidos do backend:', data);
          const userData = { id: data.id, nome: data.nome, email: data.email, isAdmin: data.isAdmin };
          setUser(userData);
        } else {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      } catch (err) {
        console.error('Erro ao carregar usuário:', err);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        if (err.message && err.message.includes('Conta inativa')) {
          alert('⚠️ Sua conta foi desativada pelo administrador.\n\nEntre em contato conosco para mais informações.');
        }
      } finally {
        setLoading(false);
      }
    };

    loadUser();
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
                <Route path="/home" element={<Home user={user} setUser={setUser} />} />
                <Route path="/admin" element={user && (user.isAdmin || user.email === 'admin@alemdopositivo.com') ? <Admin /> : <Navigate to="/login" />} />
                <Route path="/produto/:id" element={<DetalhesProduto />} />
                <Route path="/perfil" element={user ? <Perfil user={user} setUser={setUser} /> : <Navigate to="/login" />} />

                <Route path="/checkout" element={user ? <Checkout /> : <Navigate to="/login" />} />
                <Route path="/meus-pedidos" element={user ? <MeusPedidos /> : <Navigate to="/login" />} />
                <Route path="/minhas-vendas" element={user ? <MinhasVendas /> : <Navigate to="/login" />} />
                <Route path="/cadastrar-produto" element={user ? <CadastrarProduto /> : <Navigate to="/login" />} />
                <Route path="/carteira" element={user ? <Carteira /> : <Navigate to="/login" />} />

                <Route path="/sobre-nos" element={<SobreNos />} />
                <Route path="/fale-conosco" element={<FaleConosco />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/termos-privacidade" element={<TermosPrivacidade />} />
                <Route path="/baixar-app" element={<BaixarApp />} />
                <Route path="/manual-seguranca" element={<ManualSeguranca />} />

                <Route path="/recuperar-senha" element={<RecuperarSenha />} />
                <Route path="/" element={<Navigate to="/home" />} />
              </Routes>
            </div>
          </Router>
        </ProdutosProvider>
    </ThemeProvider>
  );
}

export default App;