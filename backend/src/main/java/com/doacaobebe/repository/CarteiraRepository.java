package com.doacaobebe.repository;

import com.doacaobebe.entity.Carteira;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.math.BigDecimal;
import org.springframework.data.jpa.repository.Query;

public interface CarteiraRepository extends JpaRepository<Carteira, Long> {
    Optional<Carteira> findByUsuarioId(Integer usuarioId);

    @Query("SELECT COALESCE(SUM(c.saldoRetido), 0), COALESCE(SUM(c.saldoLiberado), 0) FROM Carteira c")
    Object[] buscarSaldosDashboard();
}
