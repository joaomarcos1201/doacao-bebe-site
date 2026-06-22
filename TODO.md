# TODO

- [x] Ajustar UX do Admin para aguardar `removerProduto` antes de mostrar sucesso (evita inconsistência de UI).
- [ ] Adicionar logs e checagem no backend para o `DELETE /api/products/{id}` (realizado em ProdutoController).
- [ ] Rebuild backend e testar delete no Admin, observando logs do backend.
- [ ] Se os logs mostrarem `existe=true` e `existeDepois=false`, corrigir no front (recarga/listagem).
- [ ] Se `existe=true` e `existeDepois=true`, investigar camada de persistência/constraints e ambiente/banco.
- [ ] Se `existe=false`, validar se o Admin está exibindo IDs corretos (dados retornados em `/api/products/todos`).

