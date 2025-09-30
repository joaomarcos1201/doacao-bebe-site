package com.doacaobebe.repository;

import com.doacaobebe.entity.Produto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProdutoRepository extends JpaRepository<Produto, Long> {
    List<Produto> findByStatus(String status);
    List<Produto> findByStatusOrderByDataCriacaoDesc(String status);
}