import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ArrowLeft, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useFavoritos } from '../context/FavoritosContext';
import { api } from '../config/api';
import CardProduto from '../components/CardProduto';

function Favoritos() {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const { carregar } = useFavoritos();
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);

  const bg = isDark ? '#0f0f0f' : '#fff7f9';
  const border = isDark ? '#2a2a2a' : 'rgba(232,138,162,0.18)';
  const text = isDark ? '#e0e0e0' : '#1a1a2e';
  const sub = isDark ? '#666' : '#9CA3AF';

  const buscar = async () => {
    setLoading(true);
    try {
      const data = await api.favoritos();
      setProdutos(Array.isArray(data) ? data : []);
    } catch {
      setProdutos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { buscar(); }, []);

  // Quando o usuário remove um favorito pelo coração, recarrega a lista
  const { favoritosIds } = useFavoritos();
  useEffect(() => {
    setProdutos(prev => prev.filter(p => favoritosIds.has(p.id)));
  }, [favoritosIds]);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: bg, fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Nav */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        backgroundColor: isDark ? 'rgba(15,15,15,0.96)' : 'rgba(255,255,255,0.96)',
        backdropFilter: 'blur(20px)', borderBottom: `1px solid ${border}`,
        padding: '0 24px', height: '60px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <button onClick={() => navigate('/home')} style={{
          display: 'flex', alignItems: 'center', gap: '6px', background: 'none',
          border: `1px solid ${border}`, borderRadius: '8px', padding: '7px 14px',
          cursor: 'pointer', color: sub, fontSize: '13px', fontWeight: '600'
        }}>
          <ArrowLeft size={14} strokeWidth={2} /> Voltar
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Heart size={16} color="#c0606a" fill="#c0606a" strokeWidth={2} />
          <span style={{ fontSize: '16px', fontWeight: '700', color: '#c0606a' }}>Meus Favoritos</span>
        </div>
        <button onClick={toggleTheme} style={{
          width: '34px', height: '34px', borderRadius: '8px', border: `1px solid ${border}`,
          backgroundColor: 'transparent', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          {isDark ? <Sun size={15} color="#f0c060" strokeWidth={2} /> : <Moon size={15} color="#c0606a" strokeWidth={2} />}
        </button>
      </nav>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '36px 24px 60px' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '80px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', border: `3px solid ${border}`, borderTopColor: '#c0606a', animation: 'spin 0.8s linear infinite' }} />
          </div>
        ) : produtos.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '80px 20px',
            backgroundColor: isDark ? '#141414' : '#fff',
            borderRadius: '20px', border: `1px solid ${border}`,
            marginTop: '20px'
          }}>
            <div style={{ marginBottom: '20px' }}>
              <Heart size={52} color={isDark ? '#333' : '#f0c0c8'} strokeWidth={1.5} />
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: '700', color: text, margin: '0 0 10px' }}>
              Nenhum favorito ainda
            </h2>
            <p style={{ fontSize: '14px', color: sub, margin: '0 0 28px', lineHeight: '1.6' }}>
              Explore os produtos e toque no coração para salvar os que você mais gostou.
            </p>
            <button onClick={() => navigate('/home')} style={{
              padding: '12px 28px', borderRadius: '50px', border: 'none',
              background: 'linear-gradient(135deg, #E88AA2, #c0606a)',
              color: '#fff', fontSize: '14px', fontWeight: '600', cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(192,96,106,0.3)'
            }}>
              Explorar produtos
            </button>
          </div>
        ) : (
          <>
            <p style={{ fontSize: '13px', color: sub, marginBottom: '24px' }}>
              {produtos.length} {produtos.length === 1 ? 'produto salvo' : 'produtos salvos'}
            </p>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: '16px'
            }}>
              {produtos.map(p => <CardProduto key={p.id} produto={p} />)}
            </div>
          </>
        )}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default Favoritos;
