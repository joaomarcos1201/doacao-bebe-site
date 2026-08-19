package com.doacaobebe.repository;

import com.doacaobebe.entity.Saque;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.time.LocalDateTime;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface SaqueRepository extends JpaRepository<Saque, Long> {
    List<Saque> findByUsuarioIdOrderByDataSolicitacaoDesc(Integer usuarioId);
    List<Saque> findByStatus(String status);

    @Query("SELECT s.status, s.valor FROM Saque s WHERE (:inicio IS NULL OR s.dataSolicitacao >= :inicio)")
    List<Object[]> buscarDadosDashboard(@Param("inicio") LocalDateTime inicio);
}
