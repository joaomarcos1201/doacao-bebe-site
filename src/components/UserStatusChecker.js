import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function UserStatusChecker({ user, setUser }) {
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserStatus = async () => {
      const token = localStorage.getItem('token');
      if (!token || !user) return;

      try {
        const response = await fetch('http://localhost:7979/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.status === 403) {
          // Conta inativa
          alert('Sua conta foi desativada. Entre em contato com o administrador.');
          setUser(null);
          localStorage.removeItem('token');
          navigate('/login');
        } else if (!response.ok) {
          // Token inválido
          setUser(null);
          localStorage.removeItem('token');
          navigate('/login');
        }
      } catch (error) {
        console.error('Erro ao verificar status do usuário:', error);
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