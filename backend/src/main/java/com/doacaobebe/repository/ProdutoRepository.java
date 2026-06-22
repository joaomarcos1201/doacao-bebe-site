package com.doacaobebe.repository;

import com.doacaobebe.entity.Produto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProdutoRepository extends JpaRepository<Produto, Integer> {
    List<Produto> findByStatusAnuncio(String statusAnuncio);
    List<Produto> findByStatusAnuncioOrderByDataAnuncioDesc(String statusAnuncio);

    // Bloqueia itens removidos em consultas públicas/Admin
    List<Produto> findByStatusAnuncioOrderByDataAnuncioDescAndStatusVisibilidadeNot(String statusAnuncio, String statusVisibilidade);

    // fallback para evitar retorno de REMOVIDO ao listar todos
    List<Produto> findAllByStatusVisibilidadeNot(String statusVisibilidade);

    // opcional: helper para o listar /todos
    List<Produto> findAllByStatusVisibilidadeNotOrderByDataAnuncioDesc(String statusVisibilidade);

}

