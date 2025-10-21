package com.doacaobebe.repository;

import com.doacaobebe.entity.Mensagem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MensagemRepository extends JpaRepository<Mensagem, Long> {
    List<Mensagem> findByStatusMensagemOrderByDataMensagemDesc(String statusMensagem);
}