import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Camera, Heart } from 'lucide-react';
import { useFavoritos } from '../context/FavoritosContext';
import { useTheme } from '../context/ThemeContext';

const tempoRelativo = (data) => {
  if (!data) return null;
  const diff = Math.floor((Date.now() - new Date(data)) / 1000);
  if (diff < 60) return 'agora mesmo';
  if (diff < 3600) return `há ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `há ${Math.floor(diff / 3600)}h`;
  if (diff < 172800) return 'ontem';
  if (diff < 604800) return `há ${Math.floor(diff / 86400)} dias`;
  return new Date(data).toLocaleDateString('pt-BR');
};

function CardProduto({ produto }) {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { isFavoritado, toggleFavorito } = useFavoritos();
  const [animando, setAnimando] = useState(false);

  const favoritado = isFavoritado(produto.id);
  const logado = !!localStorage.getItem('token');

  const handleFavorito = async (e) => {
    e.stopPropagation();
    if (!logado) { navigate('/login'); return; }
    const eraFavoritado = favoritado;
    setAnimando(true);
    await toggleFavorito(produto.id);
    setTimeout(() => setAnimando(false), 350);
    if (!eraFavoritado) navigate('/favoritos');
  };

  return (
    <div
      onClick={() => navigate(`/produto/${produto.id}`)}
      style={{
        backgroundColor: isDark ? '#161616' : '#ffffff',
        borderRadius: '16px',
        border: `1px solid ${isDark ? '#222' : 'rgba(248,215,227,0.6)'}`,
        overflow: 'hidden', cursor: 'pointer',
        transition: 'all 0.22s ease',
        boxShadow: isDark ? '0 2px 12px rgba(0,0,0,0.3)' : '0 2px 12px rgba(0,0,0,0.06)',
        display: 'flex', flexDirection: 'column',
        position: 'relative',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-5px)';
        e.currentTarget.style.boxShadow = isDark ? '0 12px 32px rgba(0,0,0,0.45)' : '0 12px 32px rgba(232,138,162,0.18)';
        e.currentTarget.style.borderColor = '#E88AA2';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = isDark ? '0 2px 12px rgba(0,0,0,0.3)' : '0 2px 12px rgba(0,0,0,0.06)';
        e.currentTarget.style.borderColor = isDark ? '#222' : 'rgba(248,215,227,0.6)';
      }}
    >
      {/* Imagem */}
      <div style={{ height: '190px', overflow: 'hidden', backgroundColor: isDark ? '#1e1e1e' : '#fdf0f2', flexShrink: 0, position: 'relative' }}>
        {produto.foto ? (
          <img
            src={`data:image/jpeg;base64,${produto.foto}`}
            alt={produto.nome}
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
            onMouseEnter={e => e.target.style.transform = 'scale(1.04)'}
            onMouseLeave={e => e.target.style.transform = 'scale(1)'}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Camera size={32} color={isDark ? '#333' : '#ddd'} strokeWidth={1} />
          </div>
        )}

        {/* Botão favorito */}
        <button
          onClick={handleFavorito}
          style={{
            position: 'absolute', top: '10px', right: '10px',
            width: '32px', height: '32px', borderRadius: '50%',
            border: 'none', cursor: 'pointer',
            backgroundColor: isDark ? 'rgba(20,20,20,0.75)' : 'rgba(255,255,255,0.85)',
            backdropFilter: 'blur(6px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            transform: animando ? 'scale(1.35)' : 'scale(1)',
            transition: 'transform 0.25s cubic-bezier(0.34,1.56,0.64,1)',
            zIndex: 2,
          }}
        >
          <Heart
            size={15}
            strokeWidth={2}
            color={favoritado ? '#c0606a' : (isDark ? '#888' : '#bbb')}
            fill={favoritado ? '#c0606a' : 'none'}
          />
        </button>
      </div>

      {/* Conteúdo */}
      <div style={{ padding: '12px 14px 14px', display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
        <p style={{
          fontSize: '13px', fontWeight: '600', color: isDark ? '#e0e0e0' : '#374151',
          margin: 0, lineHeight: '1.4',
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'
        }}>{produto.nome}</p>

        <p style={{ fontSize: '20px', fontWeight: '700', color: '#c0606a', margin: '4px 0 0', lineHeight: 1 }}>
          {produto.preco
            ? `R$ ${Number(produto.preco).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
            : 'Consultar'}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '6px' }}>
          <MapPin size={11} color={isDark ? '#555' : '#9CA3AF'} strokeWidth={2} />
          <span style={{ fontSize: '11px', color: isDark ? '#555' : '#9CA3AF' }}>
            {produto.cepOrigem || 'Brasil'}
          </span>
        </div>

        {produto.dataAnuncio && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={isDark ? '#444' : '#C4C4C4'} strokeWidth="2">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
            <span style={{ fontSize: '11px', color: isDark ? '#444' : '#C4C4C4' }}>{tempoRelativo(produto.dataAnuncio)}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default CardProduto;
