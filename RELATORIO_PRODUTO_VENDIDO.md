# Produto vendido após aprovação do pagamento

## 1. Fluxo anterior

O checkout criava Pedido e Pagamento PENDENTE sem reservar o produto. O PagamentoProviderMock gerava o PIX; SimulacaoController e WebhookController chamavam PedidoService.processarPagamentoAprovado. A aprovação marcava o produto RESERVADO, retinha o valor na carteira e gerava rastreio mock/AGUARDANDO_POSTAGEM. Somente a entrega marcava o produto VENDIDO e o pedido FINALIZADO. A liberação administrativa mudava o pedido para LIBERADO e aplicava a comissão existente.

## 2. Problema

A aprovação central não validava novamente a disponibilidade nem era idempotente: pagamentos de pedidos pendentes concorrentes podiam processar o mesmo produto e repetir efeitos financeiros. O site carregava /api/products/todos pelo Context e filtrava localmente, sem atualização ao retornar à Home. O mobile já utilizava o endpoint filtrado, mas seu filtro defensivo também admitia vendidos/reservados. A lista de produtos do administrador omitia vendidos.

## 3. Regra implementada

Pagamento aprovado → produto VENDIDO na mesma transação da atualização de pedido, pagamento, retenção e geração de etiqueta. O checkout pendente mantém a disponibilidade anterior. A regra permanece no serviço central e vale tanto para simulação quanto para chamadas do webhook.

## 4. Status

Reutilizado VENDIDO. statusAnuncio é String; não existe enum a migrar. O status já era usado pela entrega, detalhes e dashboard. Nenhum produto é excluído por esta regra.

## 5. Arquivos do backend

- src/main/java/com/doacaobebe/service/PedidoService.java: aprovação, idempotência, validação e bloqueios transacionais; proteção de produto removido e cancelamento concorrente.
- src/main/java/com/doacaobebe/repository/ProdutoRepository.java: busca com bloqueio pessimista de escrita.
- src/main/java/com/doacaobebe/controller/ProdutoController.java: alteração administrativa de status transacional; impede reclassificar/republicar VENDIDO.
- pom.xml: dependência de testes Spring Boot.
- src/test/java/com/doacaobebe/service/VendaIntegrationTest.java: testes de integração com H2 isolado.
- auditoria-produtos-pagos.sql: consulta somente leitura de inconsistências antigas.

## 6. Arquivos do site

- src/pages/Home.js: consulta de disponíveis independente do Context administrativo e atualização ao montar/receber foco/voltar à aba.
- src/pages/Checkout.js: apresenta a mensagem de erro retornada pelo backend.
- src/pages/DetalhesProduto.js: atualiza ao receber foco e considera REMOVIDO indisponível.
- src/pages/Admin.js: inclui RESERVADO/VENDIDO, mostra status e detalhes reais; ações de aprovação ficam restritas a EM_ANALISE.
- src/pages/Home.test.js: teste de atualização da listagem.

## 7. Arquivos do mobile

Na pasta irmã doacao-bebe-mobile:

- src/screens/HomeScreen.js.
- src/screens/ExploreScreen.js.

Ambas usam isProductAvailable e atualizam via AppState ao retornar ao primeiro plano. As alterações preexistentes de package.json, package-lock.json e OrderDetailScreen.js foram preservadas.

## 8. Banco e produtos antigos

Nenhuma migração de esquema ou correção de dados existentes. A auditoria somente leitura foi executada na base configurada em application.properties em 15/09/2026: **0 registros de produtos disponíveis associados a pedidos APROVADO/FINALIZADO/LIBERADO ou pagamentos APROVADO**. Isso representa a base e o instante consultados, não outras instalações. RESERVADO antigo permanece RESERVADO, já fora do catálogo de disponíveis.

## 9. Proteção contra compra duplicada

Checkout e aprovação bloqueiam a linha do produto até o fim da transação. A aprovação bloqueia e recarrega pagamento/pedido, verifica PENDENTE e revalida a disponibilidade do produto antes de executar efeitos. Duas aprovações de pedidos distintos disputam a mesma linha: uma vende, a outra encontra o produto indisponível e falha sem retenção/etiqueta. Repetir um pagamento APROVADO no serviço não repete efeitos nem regride um pedido entregue/liberado. Objetos são recarregados para não usar estado antigo já presente no contexto JPA do controller.

Mensagem: “Este produto não está mais disponível para compra.” O checkout continua retornando erro HTTP 400 controlado, conforme seu controller existente. O segundo PIX pendente não é cancelado automaticamente. Um futuro gateway real precisará tratar eventual cobrança externa concorrente e estorno; este projeto usa PIX mock e esta alteração protege a venda no banco.

## 10. Home do site

Consulta GET /api/products, que já filtra DISPONIVEL/ATIVO/APROVADO e exclui REMOVIDO no repository. /todos permanece disponível para administração. A Home refaz a consulta ao montar e ao retornar ao foco/aba, sem recarregar a aplicação. Não há atualização em tempo real entre dispositivos enquanto a página permanece continuamente aberta; o backend bloqueia qualquer tentativa com dados antigos.

## 11. Home do mobile

Já consultava GET /api/products. App.js usa renderização condicional: Home é desmontada ao abrir checkout/detalhes e remontada ao retornar; o useEffect existente já busca novamente. Não foi adicionado useFocusEffect, pois esse fluxo não é controlado por um navegador React Navigation. AppState cobre retorno do segundo plano. O filtro defensivo agora aceita apenas disponíveis, sem alterar os filtros dos históricos.

## 12. Cancelamento e estorno

Produto VENDIDO não é republicado ao cancelar ou receber refunded/rejected/cancelled. Foi mantida a regra legada de retornar RESERVADO para DISPONIVEL no cancelamento, limitada ao pedido que estava APROVADO; cancelar outro pedido pendente não pode liberar a reserva. Os estados ingleses do webhook e a filtragem existente de pedidos cancelados/devolvidos foram preservados. O fluxo financeiro de cancelamento/estorno não tinha compensação completa de saldo e não foi reinventado.

## 13. Testes

- **4 testes de integração passaram, zero falhas/erros**, com repositórios, serviços de frete/carteira e providers mock reais em H2; autenticação simulada nos controllers.
- Cobertura: catálogo disponível; checkout PENDENTE; simulate-payment; VENDIDO; saída do catálogo; permanência em Meus Pedidos/Minhas Vendas/admin; segundo checkout bloqueado; aprovação repetida sem duplicar retenção; simulate-delivery; ENTREGUE/FINALIZADO; liberação administrativa/LIBERADO e saldo líquido; duas aprovações concorrentes com uma única venda; cancelamento/estorno; pagamento rejeitado; produto removido; bloqueio de republicação administrativa.
- **1 teste React da Home passou**: endpoint de disponíveis, item inicial e desaparecimento após foco/nova resposta.
- **Build de produção do site passou**, com avisos de lint existentes.
- **Sintaxe JSX das duas telas mobile validada** com Babel.
- Validação visual no dispositivo/emulador e teste ponta a ponta via navegador não foram executados. A concorrência foi testada em H2, não por gravações no SQL Server real. O teste dos controllers chama seus métodos com serviços transacionais reais, sem requisições HTTP.

Comando backend usado: Maven incluído em maven.zip, `mvn -f backend/pom.xml -DforkCount=0 test`. Site: `npm test -- --watchAll=false --runInBand` e `npm run build`.

## 14. Problemas e limites encontrados

- O Maven do PATH estava indisponível pelo OneDrive. Foi extraída a distribuição já existente em maven.zip para backend/target/maven-tools; não altera arquivos versionados.
- O processo separado do Surefire falhou ao carregar uma classe; executar os testes no próprio processo Maven com -DforkCount=0 resolveu.
- O build informa variáveis/imports sem uso, dependências de hooks e Browserslist desatualizado preexistentes. O teste React também informa depreciação do act de react-dom/test-utils.
- AGENTS.md do mobile pede documentação Expo v55, consultada antes da edição, embora package.json declare Expo 57. Nenhuma dependência foi alterada nesta tarefa.
- O webhook existente ainda é uma integração mock: pressupõe approved quando type não é informado e responde HTTP 200 mesmo a erros. A verificação/autenticação de eventos de um gateway real não foi implementada nesta tarefa.
- Frete, preço, comissão, código de rastreio e liberação manual foram preservados. Não houve publicação/deploy.
