package com.doacaobebe.repository;

import com.doacaobebe.entity.Mensagem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface MensagemRepository extends JpaRepository<Mensagem, Long> {
    
    @Modifying
    @Transactional
    @Query(value = "INSERT INTO Mensagem (dataMensagem, emissor, email, telefone, texto, statusMensagem) VALUES (GETDATE(), :emissor, :email, :telefone, :texto, 'ATIVO')", nativeQuery = true)
    void inserirMensagem(@Param("emissor") String emissor, @Param("email") String email, @Param("telefone") String telefone, @Param("texto") String texto);
}