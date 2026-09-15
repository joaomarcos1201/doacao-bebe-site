-- Somente leitura. Não republica, remove ou corrige dados.
-- Produtos de pedidos pagos que ainda constam como disponíveis.
SELECT a.id AS produtoId, a.statusAnuncio, p.id AS pedidoId,
       p.statusPagamento, pg.status AS statusPagamentoGateway
FROM Anuncio a
JOIN Pedido p ON p.produto_id = a.id
LEFT JOIN Pagamento pg ON pg.pedido_id = p.id
WHERE a.statusAnuncio IN ('DISPONIVEL', 'ATIVO', 'APROVADO')
  AND (p.statusPagamento IN ('APROVADO', 'FINALIZADO', 'LIBERADO')
       OR pg.status = 'APROVADO');
