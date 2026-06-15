package com.doacaobebe.repository;

import com.doacaobebe.entity.Saque;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SaqueRepository extends JpaRepository<Saque, Long> {
    List<Saque> findByUsuarioIdOrderByDataSolicitacaoDesc(Integer usuarioId);
    List<Saque> findByStatus(String status);
}
