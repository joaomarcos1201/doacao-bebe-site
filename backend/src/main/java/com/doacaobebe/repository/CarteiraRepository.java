package com.doacaobebe.repository;

import com.doacaobebe.entity.Carteira;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CarteiraRepository extends JpaRepository<Carteira, Long> {
    Optional<Carteira> findByUsuarioId(Integer usuarioId);
}
