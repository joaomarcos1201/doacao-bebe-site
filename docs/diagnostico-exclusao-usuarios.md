# Exclusão de usuários — diagnóstico e correção

## Evidência e limite do diagnóstico

O fluxo anterior era `Admin.js → DELETE /api/usuarios/{id} → UsuarioController.remover → UsuarioService.remover → UsuarioRepository.deleteUsuarioById`.
O repository executava `DELETE FROM Usuario u WHERE u.id = :id`, sem tratar dependências. Esse DELETE JPQL em massa não percorre relacionamentos JPA para remover dependentes. A entidade Usuario não tem coleções inversas ou cascade de remoção.

O service capturava qualquer exceção, perdia a causa ao construir outra RuntimeException e imprimia somente sua mensagem. O controller convertia qualquer falha em 400. O frontend descartava o corpo da resposta e mostrava um erro genérico.

Antes de alterar o código da aplicação, o DELETE anterior foi reproduzido em H2 com as entidades reais. Os sete testes de FK confirmaram `DataIntegrityViolationException`, causada por `org.hibernate.exception.ConstraintViolationException`, com SQLState `23503`. Exemplo do log local:

```text
Referential integrity constraint violation:
"FKCR65763YAB6WAGJIX4ADWVBK3: PUBLIC.ANUNCIO FOREIGN KEY(VENDEDOR_ID) REFERENCES PUBLIC.USUARIO(ID)"
delete from Usuario where id=? [23503-224]
```

Não havia log do backend de produção nem credenciais/conexão de banco disponíveis na sessão. `frontend.log` não contém a exceção do DELETE. Portanto, **a constraint e os registros específicos que bloquearam o usuário 48 no Render não foram confirmados**. Não foi executado DELETE contra produção. As FKs a seguir são comprovadas pelo modelo e pelos testes, não uma consulta ao banco do Render. O trecho do log ou corpo original da resposta 400 foi solicitado para fechar essa identificação.

## Mapa dos relacionamentos

| Entidade / tabela | Vínculo com Usuario | Exclusão física com dependentes |
| --- | --- | --- |
| Produto / Anuncio | `vendedor_id`, ManyToOne, aceita nulo | Bloqueada enquanto a FK aponta para o usuário |
| Pedido | `comprador_id`, ManyToOne, obrigatório | Bloqueada |
| Pedido | `vendedor_id`, ManyToOne, obrigatório | Bloqueada |
| Carteira | `usuario_id`, OneToOne, obrigatório e único | Bloqueada, inclusive com saldo zero |
| Favorito | `usuario_id`, ManyToOne, obrigatório | Bloqueada |
| Saque | `usuario_id`, ManyToOne, obrigatório | Bloqueada |
| MovimentacaoFinanceira | `usuario_id`, ManyToOne, obrigatório | Bloqueada |
| Pagamento | Indireto: `pedido_id → Pedido → Usuario` | Preservar Pedido e seus vínculos |
| Frete | Campos de envio/rastreio no Pedido; não existe entidade/tabela Frete no modelo | Preservar Pedido |
| Mensagem | Nome/email como texto; sem relacionamento JPA com Usuario | Sem bloqueio por FK no modelo |

MovimentacaoFinanceira também aponta para Pedido; Favorito aponta para Anuncio. Nenhum cascade de remoção foi adicionado.

## Estratégia implementada

- Todos os usuários comuns são desativados logicamente, mesmo sem dependências. Evita um comportamento destrutivo diferente conforme o histórico.
- `statusUsuario = INATIVO` e retirada de anúncios ocorrem na mesma transação. Falha nos anúncios desfaz a mudança da conta.
- Os anúncios não vendidos/não reservados recebem `statusVisibilidade = REMOVIDO`. Seus registros e `statusAnuncio` permanecem. Catálogo e checkout já consultam essa visibilidade.
- Anúncios VENDIDO e RESERVADO mantêm seus estados históricos. Eles já não entram no catálogo de disponíveis. Aprovação/reclassificação de anúncios de vendedor inativo é bloqueada.
- Pedidos, pagamentos, carteira, saques, favoritos e movimentações permanecem vinculados ao mesmo ID. Nenhum saldo é zerado ou transferido.
- A ação Pausar usa a mesma regra. Reativar a conta não republica automaticamente anúncios retirados.
- A listagem existente do Admin contém ativos e inativos: a conta continua visível como INATIVO e deixa de contar como ativa. O frontend recarrega usuários e produtos após desativação.
- Login e `/api/auth/me` aceitam apenas ATIVO (normalizando espaços e caixa). O filtro também bloqueia tokens anteriores de contas não ativas nas rotas que já verifica. O comportamento de autenticação de contas ativas permanece.
- DELETE e alteração de status exigem token válido de administrador ativo. Própria conta e outros administradores são protegidos. A rota de privilégios também exige administrador e impede alteração dos próprios privilégios, evitando contornar a proteção pelo fluxo do Admin.
- Esta alteração não é uma revisão geral de segurança de todos os endpoints legados/diagnósticos.

## Contrato do endpoint

`DELETE /api/usuarios/{id}`, com `Authorization: Bearer <token>` de administrador ativo.

| Resultado | HTTP | Corpo |
| --- | --- | --- |
| Desativado ou já inativo | 200 | `{"message":"Conta desativada. Pedidos, pagamentos e saldo foram preservados."}` |
| ID inexistente | 404 | Mensagem de usuário não encontrado |
| Sem token/token inválido ou expirado | 401 | Mensagem de autenticação/sessão |
| Não administrador, conta inativa, própria conta ou outro admin | 403 | Mensagem explicando o bloqueio |
| Falha inesperada | 500 | Mensagem pública sem SQL; stack trace completo no log do backend |

O filtro legado usa `error` em vez de `message`; o frontend lê ambos e também respostas em texto. Nenhuma resposta HTTP de erro gera notificação de sucesso.

## Testes executados

Backend: `mvn -f backend/pom.xml test` — **36 testes, zero falhas/erros**.

- UsuarioForeignKeyTest: 7 casos, um para cada FK direta (incluindo ambos os papéis em Pedido), reproduzindo a falha do DELETE físico.
- UsuarioDesativacaoIntegrationTest: 20 casos, com banco H2, JPA, transações reais, JWT assinado e endpoints via MockMvc. Cobre conta sem anúncios, idempotência, sete estados de anúncio, comprador/vendedor com pedido e pagamento, saldo, saques, favoritos, movimentações, histórico de frete, inexistente, login ativo/inativo, estados bloqueados, token anterior, permissões, Pausar/Ativar e rollback.
- VendaIntegrationTest: 6 casos, incluindo os 4 anteriores. Casos novos verificam bloqueio de novo checkout com manutenção do pedido/pagamento pendente e entrega/liberação de saldo de venda paga após desativação do vendedor.
- MeuPerfilTest: 3 testes anteriores mantidos e aprovados.

Frontend: `npm test -- --watchAll=false --runInBand` — **7 testes aprovados** (6 do Admin, 1 anterior da Home). Cobre envio do token, atualização da listagem/status, recarga dos produtos, mensagens JSON/texto/corpo vazio, ausência de falso sucesso e proteção visual de administradores.

`npm run build` concluído com sucesso, com avisos de lint em código preexistente e base Browserslist desatualizada. `git diff --check` sem erros.

Testes isolados não substituem uma validação contra o schema real de produção. Carteiras com saldo permanecem armazenadas; o titular inativo fica sem acesso até intervenção administrativa/reativação. PIX pendentes são preservados; não foi adicionada rotina de cancelamento, estorno ou conciliação financeira.

## Arquivos alterados

Aplicação:

- `backend/src/main/java/com/doacaobebe/service/UsuarioService.java`
- `backend/src/main/java/com/doacaobebe/controller/UsuarioController.java`
- `backend/src/main/java/com/doacaobebe/repository/ProdutoRepository.java`
- `backend/src/main/java/com/doacaobebe/controller/ProdutoController.java`
- `backend/src/main/java/com/doacaobebe/config/JwtAuthenticationFilter.java`
- `src/pages/Admin.js`

Testes/documentação:

- `backend/src/test/java/com/doacaobebe/service/UsuarioForeignKeyTest.java` (novo)
- `backend/src/test/java/com/doacaobebe/service/UsuarioDesativacaoIntegrationTest.java` (novo)
- `backend/src/test/java/com/doacaobebe/service/VendaIntegrationTest.java`
- `src/pages/Admin.test.js` (novo)
- `docs/diagnostico-exclusao-usuarios.md` (este relatório)

## Banco e publicação

Nenhuma migração, coluna, FK ou alteração de cascade necessária. Reutiliza `Usuario.statusUsuario` e `Anuncio.statusVisibilidade`. A coluna legada `Usuario.status` não é usada por este fluxo e não foi alterada. Nenhum dado de produção foi modificado e não houve deploy.
