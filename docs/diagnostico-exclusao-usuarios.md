# Exclusão física de usuários — relatório da correção

## Resultado

`DELETE /api/usuarios/{id}` executa **DELETE físico da linha de Usuario**, depois de resolver suas dependências, dentro de uma única transação. Não altera `statusUsuario` no fluxo de exclusão. A ação do Admin é novamente **Excluir usuário**, inclusive para contas já inativas.

A funcionalidade Pausar/Ativar continua sendo uma operação separada. Não houve deploy nem alteração no banco da aplicação.

## 1. Causa original e evidência

O fluxo original chamava `UsuarioRepository.deleteUsuarioById`, com JPQL `DELETE FROM Usuario u WHERE u.id = :id`, antes de resolver FKs. O banco recusava excluir uma linha ainda referenciada. O service embrulhava a exceção em RuntimeException; o controller transformava qualquer falha em 400; o frontend ignorava a mensagem retornada.

O teste `UsuarioForeignKeyTest` reproduz separadamente as sete referências diretas e confirma `DataIntegrityViolationException`, com causa Hibernate `ConstraintViolationException`/SQLState 23503 em H2. A ordem da nova exclusão e a migration também foram verificadas no SQL Server local 15.0.2000.5, em banco descartável.

**Limite:** não foi disponibilizado o log do DELETE original do usuário 48 no Render. Portanto, não é possível afirmar qual das FKs foi a primeira a falhar para esse ID em produção. Não foi executado DELETE contra o Render. O diagnóstico de violação de FK é comprovado no modelo/testes; a constraint específica de produção continua não confirmada.

## 2. Inventário completo encontrado no projeto

Foram pesquisadas todas as entidades e repositories, controllers/services com SQL/JDBC, arquivos SQL e configurações de schema. O projeto não utiliza Flyway/Liquibase. Antes desta correção, o único SQL versionado era `backend/auditoria-produtos-pagos.sql`; as tabelas são gerenciadas com `ddl-auto=update` e existe SQL legado de Categoria/Anuncio em DataInitializer/FixController.

| FK direta para Usuario | Mapeamento | Tratamento |
| --- | --- | --- |
| Anuncio.vendedor_id | ManyToOne, já aceitava NULL | Remove anúncio sem pedido; desvincula e oculta anúncio histórico |
| Pedido.comprador_id | ManyToOne, anteriormente NOT NULL | Passa a aceitar NULL; preserva pedido e outra parte da compra |
| Pedido.vendedor_id | ManyToOne, anteriormente NOT NULL | Passa a aceitar NULL; preserva pedido e outra parte da venda |
| Carteira.usuario_id | OneToOne, NOT NULL, UNIQUE | Remove somente carteira com ambos os saldos zerados |
| Favorito.usuario_id | ManyToOne, NOT NULL | Remove favoritos da conta |
| Saque.usuario_id | ManyToOne, anteriormente NOT NULL | Passa a aceitar NULL; preserva saques resolvidos |
| MovimentacaoFinanceira.usuario_id | ManyToOne, anteriormente NOT NULL | Passa a aceitar NULL; preserva valores/tipos/datas e vínculo com pedido |

Outras quatro FKs do grafo:

- Favorito.produto_id → Anuncio.id: remove também favoritos de terceiros sobre os anúncios retirados desse vendedor.
- Pedido.produto_id → Anuncio.id: anúncio usado por pedido é mantido, nunca apagado.
- Pagamento.pedido_id → Pedido.id: pagamento e pedido são mantidos.
- MovimentacaoFinanceira.pedido_id → Pedido.id: ambos são mantidos, inclusive movimentações de terceiros no mesmo pedido.

Total: **sete FKs diretas para Usuario e quatro adicionais no grafo**, onze no modelo. Mensagem não tem FK para Usuario; nome/email são texto. Não existe entidade Frete: rastreio, transportadora, CEP e valores ficam no Pedido. Categoria não acrescenta FK para Usuario no código/schema versionado encontrado.

O script somente leitura `backend/migrations/auditoria_fks_usuario.sql` consulta os metadados reais do SQL Server e conta referências para o ID investigado. Ele permite verificar também tabelas não mapeadas em JPA. Não foi executado contra produção.

## 3. Ordem transacional

1. Validar token e administrador ativo; localizar e bloquear a linha alvo para exclusão.
2. Recusar própria conta e outro administrador (403).
3. Bloquear/inspecionar carteira, saques, movimentações, pedidos de compra/venda e pagamentos vinculados, antes de qualquer alteração.
4. Apagar favoritos do usuário e favoritos que apontam para seus anúncios.
5. Apagar sua carteira, somente se os dois saldos forem zero.
6. Desvincular o usuário de Saque e MovimentacaoFinanceira (`usuario_id = NULL`).
7. Desvincular comprador/vendedor nos Pedidos (`NULL` apenas no papel do usuário excluído).
8. Apagar anúncios do vendedor que não tenham nenhum pedido.
9. Nos anúncios históricos restantes: `vendedor_id = NULL`, `statusVisibilidade = REMOVIDO`, limpar campos legados doador/contato/CPF. Manter ID, conteúdo do produto, preço e status da venda.
10. Limpar o contexto JPA após os updates em massa; recarregar e executar `usuarioRepository.delete(usuario)` + `flush()`.
11. Confirmar a transação antes de retornar sucesso.

Não há CascadeType.REMOVE novo nem exclusão de Pedido/Pagamento. Qualquer falha desfaz todos os passos, inclusive favoritos/carteira/anúncios já tratados. O teste de FK legada força uma falha no último DELETE e comprova esse rollback.

## 4. Dados apagados e preservados

**Apagados:** linha de Usuario (incluindo seus dados pessoais, senha e foto), carteira zerada, favoritos da conta, favoritos sobre anúncios retirados e anúncios sem pedidos.

**Preservados:** pedidos, pagamentos, histórico de frete, anúncios associados a pedidos, saques resolvidos, movimentações financeiras, valores, datas, IDs e relações entre os históricos. As referências para o usuário removido ficam NULL. Relações de outros usuários continuam intactas.

Mensagem permanece independente; esta operação não pretende apagar toda ocorrência textual de dados pessoais em mensagens, descrições ou payloads de pagamento. Não usa uma conta fictícia para substituir o usuário removido.

## 5. Impedimentos reais: 409, sem perda de valores

A conta NÃO é apagada enquanto existir:

- Saldo retido/liberado diferente de zero (ou saldo desconhecido) na carteira.
- Saque pendente/não resolvido.
- Movimentação financeira RETIDO.
- Pedido ainda aberto ou envio em andamento.
- Pagamento pendente ou aprovado sem liquidação/estorno compatível com o pedido.

No modelo atual, essas operações ainda dependem do titular para saque, liquidação ou entrega. Apagar sua identidade nesse momento impediria concluir o fluxo com segurança. A API explica o motivo; após regularizar a operação, a exclusão física pode ser repetida. O teste de venda completa faz checkout, pagamento, entrega, liberação administrativa, saque real e só então exclui o vendedor.

Uma FK desconhecida/schema sem a migration também retorna 409 com orientação para verificar migration e logs, fazendo rollback. Conflitos de bloqueio concorrente retornam 409. Erros inesperados continuam 500 com mensagem pública e stack trace no backend, nunca 400 genérico para integridade.

## 6. Endpoint, Admin e autenticação

| Situação | HTTP |
| --- | --- |
| Registro de Usuario apagado | 200 + `{"message":"Usuário excluído com sucesso."}` |
| Usuário não encontrado, inclusive repetir exclusão já concluída | 404 |
| Token ausente/inválido/expirado | 401 |
| Usuário comum, admin inativo, própria conta ou outro administrador | 403 |
| Pendência financeira, dependência não resolvida ou conflito concorrente | 409 |
| Falha inesperada | 500 |

Admin envia Bearer token, solicita confirmação de exclusão definitiva, remove a linha após sucesso e recarrega usuários, produtos, pedidos e saques. Lê mensagens JSON (`message`/`error`) ou texto e não anuncia sucesso em resposta HTTP de erro. Históricos com relação NULL exibem “Conta excluída”.

Os checks de status no login/filtro foram mantidos porque continuam necessários ao Pausar/Ativar e ao bloqueio de contas. DELETE não os usa como substituto da exclusão. Login de conta apagada falha por usuário inexistente; o filtro rejeita token cujo usuário não existe mais. Fluxos consumidores das relações opcionais receberam guardas para evitar NullPointerException/reprocessamento indevido de histórico. Webhook repetido de entrega não reabre financeiro LIBERADO.

## 7. Migration necessária

Arquivo: `backend/migrations/20260923_exclusao_fisica_usuario.sql`.

Altera quatro colunas INT de NOT NULL para NULL: Pedido.comprador_id, Pedido.vendedor_id, Saque.usuario_id e MovimentacaoFinanceira.usuario_id. Mantém todas as FKs e não remove dados. Anuncio.vendedor_id já era opcional. Carteira/Favorito continuam obrigatórios.

**Aplicação manual antes da futura publicação**, pois não existe executor de migrations no projeto. Não confiar em `ddl-auto=update` para relaxar NOT NULL. O script valida nomes no schema dbo, é transacional/idempotente e fornece a consulta de conferência. Deve ser adaptado se a instância real usar outro schema.

Foi aplicado duas vezes em banco descartável local, criado pelo teste e removido ao terminar. Não foi aplicado no banco da aplicação/Render. Não há rollback automático para NOT NULL depois de existirem históricos desvinculados; isso exigiria uma política explícita de recuperação de identidade.

## 8. Testes e evidências

Backend: `mvn -f backend/pom.xml clean test` — 48 testes, zero falhas/erros na primeira execução completa. A suíte foi reexecutada após reforçar o cenário de saque real/reentrega de webhook.

- UsuarioExclusaoIntegrationTest: 32 casos. Banco H2 com JPA, transações reais, JWT e MockMvc. Cobre os quinze cenários solicitados, sete estados de anúncio, exclusão dos dois participantes em sequência, FK inválida desconhecida, schema incompatível, rollback, pendências financeiras, status separado e login.
- UsuarioForeignKeyTest: 7 casos reproduzindo as falhas do DELETE físico sem tratamento prévio.
- VendaIntegrationTest: 6 casos, com fluxo completo de pagamento/frete/carteira/saque e histórico após exclusão, além das regressões anteriores.
- MeuPerfilTest: 3 testes anteriores preservados.

Cada exclusão bem-sucedida no teste de integração consulta diretamente `SELECT COUNT(*) FROM Usuario WHERE id = ?` e exige zero. Também verifica todas as onze FKs por LEFT JOIN para confirmar ausência de referências inválidas.

Frontend: `npm test -- --watchAll=false --runInBand` — 9 testes aprovados (8 Admin, 1 Home). Verifica remoção da linha/contagem, conta previamente inativa, mensagens de erro, token e proteção visual de administradores.

SQL Server local: `sqlcmd -S localhost -E -C -b -f 65001 -i backend/src/test/sql/exclusao_usuario_sqlserver.sql` — aprovado. Reproduz as onze FKs e colunas relevantes do schema antigo, aplica o arquivo real de migration duas vezes, executa DML de exclusão de vendedor/comprador, verifica valores e usa `DBCC CHECKCONSTRAINTS`. Não é uma cópia do banco de produção. O banco `Codex_UsuarioDelete_20260923_Test` é criado exclusivamente pelo teste e removido ao final; o teste para se esse nome já existir.

## 9. Arquivos alterados nesta correção

Backend:

- `service/UsuarioService.java`: exclusão transacional, validações financeiras e ordem das dependências.
- `repository/UsuarioRepository.java`: consulta com bloqueio do usuário.
- `controller/UsuarioController.java`: sucesso de exclusão e erros 409/500 com logs.
- `entity/Pedido.java`, `entity/Saque.java`, `entity/MovimentacaoFinanceira.java`: relacionamentos históricos opcionais.
- `config/JwtAuthenticationFilter.java`: bloqueio de sessão cujo usuário foi apagado.
- `service/PedidoService.java`, `service/FreteService.java`, `service/SaqueService.java`: tratamento de históricos desvinculados.
- `controller/AdminOrderController.java`, `controller/ProdutoController.java`: bloqueio de reprocessamento/republicação de históricos sem usuário.

Os caminhos acima são relativos a `backend/src/main/java/com/doacaobebe/`.

Frontend:

- `src/pages/Admin.js`
- `src/pages/MinhasVendas.js`
- `src/pages/Admin.test.js`

Migration/testes/documentação:

- `backend/migrations/20260923_exclusao_fisica_usuario.sql` (novo)
- `backend/migrations/auditoria_fks_usuario.sql` (novo)
- `backend/src/test/sql/exclusao_usuario_sqlserver.sql` (novo)
- `backend/src/test/java/com/doacaobebe/service/UsuarioExclusaoIntegrationTest.java` (substitui UsuarioDesativacaoIntegrationTest)
- `backend/src/test/java/com/doacaobebe/service/VendaIntegrationTest.java`
- `docs/diagnostico-exclusao-usuarios.md` (este relatório atualizado)

**Confirmação:** no código corrigido, sucesso de `DELETE /api/usuarios/{id}` significa que a linha foi removida da tabela Usuario; não significa INATIVO. Nenhum deploy foi realizado.
