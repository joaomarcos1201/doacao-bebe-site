package com.doacaobebe.repository;

import com.doacaobebe.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByEmail(String email);
    boolean existsByEmail(String email);
    
    @Modifying
    @Transactional
    @Query("DELETE FROM Usuario u WHERE u.id = :id")
    void deleteUsuarioById(@Param("id") Long id);
}