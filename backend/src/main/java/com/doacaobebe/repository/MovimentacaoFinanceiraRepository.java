package com.doacaobebe.repository;

import com.doacaobebe.entity.MovimentacaoFinanceira;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface MovimentacaoFinanceiraRepository extends JpaRepository<MovimentacaoFinanceira, Long> {
    List<MovimentacaoFinanceira> findByUsuarioIdOrderByCreatedAtDesc(Integer usuarioId);

    @Query("SELECT COALESCE(SUM(m.valor), 0) FROM MovimentacaoFinanceira m " +
           "WHERE m.tipo = 'COMISSAO' AND (:inicio IS NULL OR m.createdAt >= :inicio)")
    BigDecimal somarComissoesDashboard(@Param("inicio") LocalDateTime inicio);
}
