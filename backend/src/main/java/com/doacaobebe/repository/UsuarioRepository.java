package com.doacaobebe.repository;

import com.doacaobebe.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import java.util.Optional;
import java.util.List;
import java.time.LocalDateTime;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {
    Optional<Usuario> findByEmail(String email);
    boolean existsByEmail(String email);

    @Query("SELECT u.dataCadastro, u.statusUsuario, u.nivelAcesso FROM Usuario u " +
           "WHERE (:inicio IS NULL OR u.dataCadastro >= :inicio)")
    List<Object[]> buscarDadosDashboard(@Param("inicio") LocalDateTime inicio);
    
    @Modifying
    @Transactional
    @Query("DELETE FROM Usuario u WHERE u.id = :id")
    void deleteUsuarioById(@Param("id") Integer id);
    
    @Modifying
    @Transactional
    @Query(value = "UPDATE Usuario SET statusUsuario = :status WHERE id = :id", nativeQuery = true)
    void updateStatusUsuario(@Param("id") Integer id, @Param("status") String status);
}
