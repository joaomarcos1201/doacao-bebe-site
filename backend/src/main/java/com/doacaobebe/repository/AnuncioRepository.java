package com.doacaobebe.repository;

import com.doacaobebe.entity.Anuncio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AnuncioRepository extends JpaRepository<Anuncio, Long> {
    List<Anuncio> findByStatusOrderByDataCriacaoDesc(String status);
}