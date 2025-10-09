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
    @Query(value = "INSERT INTO mensagens (nome, email, assunto, mensagem, conteudo) VALUES (:nome, :email, :assunto, :mensagem, :conteudo)", nativeQuery = true)
    void inserirMensagem(@Param("nome") String nome, @Param("email") String email, @Param("assunto") String assunto, @Param("mensagem") String mensagem, @Param("conteudo") String conteudo);
}