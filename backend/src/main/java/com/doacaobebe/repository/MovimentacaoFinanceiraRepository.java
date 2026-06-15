package com.doacaobebe.repository;

import com.doacaobebe.entity.MovimentacaoFinanceira;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MovimentacaoFinanceiraRepository extends JpaRepository<MovimentacaoFinanceira, Long> {
    List<MovimentacaoFinanceira> findByUsuarioIdOrderByCreatedAtDesc(Integer usuarioId);
}
