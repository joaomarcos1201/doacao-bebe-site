import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../config/api';

function UserStatusChecker({ user, setUser }) {
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserStatus = async () => {
      const token = localStorage.getItem('token');
      if (!token || !user) return;

      try {
        const response = await api.me();
        // api.me lança erros amigáveis quando apropriado
        if (response && response.ok) return;
      } catch (err) {
        console.error('Erro ao verificar status do usuário:', err);
        if (err && err.message && err.message.includes('Conta inativa')) {
          alert('Sua conta foi desativada. Entre em contato com o administrador.');
        }
        setUser(null);
        localStorage.removeItem('token');
        navigate('/login');
      }
    };

    // Verificar status a cada 30 segundos
    const interval = setInterval(checkUserStatus, 30000);
    
    // Verificar imediatamente
    checkUserStatus();

    return () => clearInterval(interval);
  }, [user, setUser, navigate]);

  return null; // Componente não renderiza nada
}

export default UserStatusChecker;