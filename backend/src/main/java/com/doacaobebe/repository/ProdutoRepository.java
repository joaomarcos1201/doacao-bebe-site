package com.doacaobebe.repository;

import com.doacaobebe.entity.Produto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProdutoRepository extends JpaRepository<Produto, Integer> {
    List<Produto> findByStatusAnuncio(String statusAnuncio);
    List<Produto> findByStatusAnuncioOrderByDataAnuncioDesc(String statusAnuncio);

    // statusAnuncio = parâmetro, statusVisibilidade != parâmetro, ordena por dataAnuncio desc
    List<Produto> findByStatusAnuncioAndStatusVisibilidadeNotOrderByDataAnuncioDesc(String statusAnuncio, String statusVisibilidade);



    // fallback para evitar retorno de REMOVIDO ao listar todos
    List<Produto> findAllByStatusVisibilidadeNot(String statusVisibilidade);

    // helper para o listar /todos com ordenação
    List<Produto> findAllByStatusVisibilidadeNotOrderByDataAnuncioDesc(String statusVisibilidade);

}


