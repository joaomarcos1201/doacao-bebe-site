package com.doacaobebe.repository;

import com.doacaobebe.entity.Favorito;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FavoritoRepository extends JpaRepository<Favorito, Integer> {
    List<Favorito> findByUsuarioId(Integer usuarioId);
    Optional<Favorito> findByUsuarioIdAndProdutoId(Integer usuarioId, Integer produtoId);
    boolean existsByUsuarioIdAndProdutoId(Integer usuarioId, Integer produtoId);
    void deleteByUsuarioIdAndProdutoId(Integer usuarioId, Integer produtoId);
}
