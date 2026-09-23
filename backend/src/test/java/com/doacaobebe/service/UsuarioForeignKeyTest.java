package com.doacaobebe.service;

import com.doacaobebe.entity.*;
import com.doacaobebe.repository.UsuarioRepository;
import jakarta.persistence.EntityManager;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.dao.DataIntegrityViolationException;
import static org.assertj.core.api.Assertions.*;

@DataJpaTest(showSql = false, properties = {
    "spring.jpa.hibernate.ddl-auto=create-drop",
    "spring.jpa.database-platform=org.hibernate.dialect.H2Dialect",
    "spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.H2Dialect"
})
class UsuarioForeignKeyTest {
    @Autowired UsuarioRepository usuarios;
    @Autowired EntityManager em;

    @ParameterizedTest
    @ValueSource(strings = {"Produto", "PedidoComprador", "PedidoVendedor", "Carteira", "Favorito", "Saque", "MovimentacaoFinanceira"})
    void deleteFisicoFalhaComCadaVinculo(String vinculo) {
        Usuario alvo = usuarios.save(new Usuario("Alvo", "alvo@test", "11111111111", "hash"));
        Usuario outro = usuarios.save(new Usuario("Outro", "outro@test", "22222222222", "hash"));
        Produto produto = new Produto();
        produto.setNome("Carrinho"); produto.setDescricao("Teste");
        produto.setVendedor(vinculo.equals("Produto") ? alvo : outro);
        em.persist(produto);
        switch (vinculo) {
            case "PedidoComprador", "PedidoVendedor" -> {
                Pedido pedido = new Pedido(); pedido.setProduto(produto);
                pedido.setComprador(vinculo.equals("PedidoComprador") ? alvo : outro);
                pedido.setVendedor(vinculo.equals("PedidoVendedor") ? alvo : outro);
                em.persist(pedido);
            }
            case "Carteira" -> { Carteira c = new Carteira(); c.setUsuario(alvo); em.persist(c); }
            case "Favorito" -> em.persist(new Favorito(alvo, produto));
            case "Saque" -> { Saque s = new Saque(); s.setUsuario(alvo); s.setValor(java.math.BigDecimal.TEN); em.persist(s); }
            case "MovimentacaoFinanceira" -> { MovimentacaoFinanceira m = new MovimentacaoFinanceira(); m.setUsuario(alvo); em.persist(m); }
        }
        em.flush();
        assertThatThrownBy(() -> usuarios.deleteUsuarioById(alvo.getId()))
                .isInstanceOf(DataIntegrityViolationException.class)
                .hasMessageContaining("Referential integrity constraint violation");
    }
}
