package com.doacaobebe.repository;

import com.doacaobebe.entity.Pedido;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.time.LocalDateTime;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PedidoRepository extends JpaRepository<Pedido, Long> {
    List<Pedido> findByCompradorIdOrderByCreatedAtDesc(Integer compradorId);
    List<Pedido> findByVendedorIdOrderByCreatedAtDesc(Integer vendedorId);
    List<Pedido> findByStatusEnvio(String statusEnvio);

    // Soft delete de Produto: verifica se existem pedidos vinculados ao produto
    boolean existsByProduto_Id(Integer produtoId);

    @Query("SELECT p.createdAt, p.statusPagamento, p.valorProduto, p.valorFrete, p.valorTotal, p.produto.categoria " +
           "FROM Pedido p WHERE (:inicio IS NULL OR p.createdAt >= :inicio)")
    List<Object[]> buscarDadosDashboard(@Param("inicio") LocalDateTime inicio);
}

