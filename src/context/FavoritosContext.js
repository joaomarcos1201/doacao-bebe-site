import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../config/api';

const FavoritosContext = createContext();

export const useFavoritos = () => useContext(FavoritosContext);

export const FavoritosProvider = ({ children, user }) => {
  const [favoritosIds, setFavoritosIds] = useState(new Set());

  const carregar = useCallback(async () => {
    if (!localStorage.getItem('token')) { setFavoritosIds(new Set()); return; }
    try {
      const ids = await api.favoritosIds();
      setFavoritosIds(new Set(Array.isArray(ids) ? ids : []));
    } catch {
      setFavoritosIds(new Set());
    }
  }, []);

  useEffect(() => { carregar(); }, [user, carregar]);

  const toggleFavorito = async (produtoId) => {
    if (!localStorage.getItem('token')) return false;
    const jaFavoritado = favoritosIds.has(produtoId);
    // Otimista: atualiza UI imediatamente
    setFavoritosIds(prev => {
      const next = new Set(prev);
      jaFavoritado ? next.delete(produtoId) : next.add(produtoId);
      return next;
    });
    try {
      jaFavoritado
        ? await api.desfavoritarProduto(produtoId)
        : await api.favoritarProduto(produtoId);
    } catch {
      // Reverter em caso de erro
      setFavoritosIds(prev => {
        const next = new Set(prev);
        jaFavoritado ? next.add(produtoId) : next.delete(produtoId);
        return next;
      });
    }
    return !jaFavoritado;
  };

  const isFavoritado = (produtoId) => favoritosIds.has(produtoId);

  return (
    <FavoritosContext.Provider value={{ favoritosIds, toggleFavorito, isFavoritado, carregar }}>
      {children}
    </FavoritosContext.Provider>
  );
};
