package com.doacaobebe.repository;

import com.doacaobebe.entity.Pedido;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PedidoRepository extends JpaRepository<Pedido, Long> {
    List<Pedido> findByCompradorIdOrderByCreatedAtDesc(Integer compradorId);
    List<Pedido> findByVendedorIdOrderByCreatedAtDesc(Integer vendedorId);
    List<Pedido> findByStatusEnvio(String statusEnvio);

    // Soft delete de Produto: verifica se existem pedidos vinculados ao produto
    boolean existsByProduto_Id(Integer produtoId);
}

