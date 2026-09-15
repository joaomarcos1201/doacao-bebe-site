package com.doacaobebe.repository;

import com.doacaobebe.entity.Produto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.time.LocalDateTime;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

@Repository
public interface ProdutoRepository extends JpaRepository<Produto, Integer> {
    @org.springframework.data.jpa.repository.Lock(jakarta.persistence.LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT p FROM Produto p WHERE p.id = :id")
    java.util.Optional<Produto> buscarParaCompra(@Param("id") Integer id);
    List<Produto> findByStatusAnuncio(String statusAnuncio);
    List<Produto> findByStatusAnuncioOrderByDataAnuncioDesc(String statusAnuncio);
    List<Produto> findByStatusAnuncioInAndStatusVisibilidadeNotOrderByDataAnuncioDesc(List<String> statusAnuncio, String statusVisibilidade);
    long countByVendedorId(Integer vendedorId);

    // statusAnuncio = parâmetro, statusVisibilidade != parâmetro, ordena por dataAnuncio desc
    List<Produto> findByStatusAnuncioAndStatusVisibilidadeNotOrderByDataAnuncioDesc(String statusAnuncio, String statusVisibilidade);



    // fallback para evitar retorno de REMOVIDO ao listar todos
    List<Produto> findAllByStatusVisibilidadeNot(String statusVisibilidade);

    // helper para o listar /todos com ordenação
    List<Produto> findAllByStatusVisibilidadeNotOrderByDataAnuncioDesc(String statusVisibilidade);

    @Query("SELECT p.dataAnuncio, p.statusAnuncio, p.statusVisibilidade, p.categoria, v.id " +
           "FROM Produto p LEFT JOIN p.vendedor v WHERE (:inicio IS NULL OR p.dataAnuncio >= :inicio)")
    List<Object[]> buscarDadosDashboard(@Param("inicio") LocalDateTime inicio);

}


