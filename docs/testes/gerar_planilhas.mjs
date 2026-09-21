import fs from 'node:fs/promises';
import { SpreadsheetFile, Workbook } from '@oai/artifact-tool';

const out = 'outputs/plano-testes-alem-do-positivo';
const teste = [
  ['TF001','Funcional','Catálogo de produtos','Atualizar a tela inicial e consultar produtos disponíveis.','Exibir somente produtos disponíveis e remover item que não retorne na atualização.','Catálogo atualizado corretamente.','Aprovado','Figura 1 – Teste unitário da tela inicial'],
  ['TU001','Unidade','Atualização do catálogo','Executar Home.test.js com produto inicial e evento de foco.','Chamar /api/products sem cache e atualizar a lista.','Teste unitário aprovado.','Aprovado','Figura 1 – Teste unitário da tela inicial'],
  ['TI001','Integração','Checkout, pagamento e entrega','Executar fluxoCompletoSimuladoPreservaHistoricoFreteECarteira.','Criar pedido, aprovar pagamento, marcar entrega e liberar saldo.','Fluxo integrado aprovado.','Aprovado','Figura 2 – Testes de integração de venda'],
  ['TI002','Integração','Concorrência de pagamento','Executar duasAprovacoesConcorrentesVendemUmaUnicaVez.','Apenas uma aprovação deve vender o produto e reter o saldo.','Concorrência tratada corretamente.','Aprovado','Figura 2 – Testes de integração de venda'],
  ['TI003','Integração','Cancelamento e estorno','Executar cancelamentoEEstornoNaoRepublicamVenda.','Não republicar produto vendido após cancelamento/estorno.','Produto permaneceu vendido.','Aprovado','Figura 2 – Testes de integração de venda'],
  ['TDB001','Banco de dados','Pagamento rejeitado e produto removido','Executar pagamentoRejeitadoNaoVendeEProdutoRemovidoNaoPermiteCheckout em H2.','Pagamento rejeitado mantém produto disponível; removido impede checkout.','Persistência e regras aprovadas.','Aprovado','Figura 2 – Testes de integração de venda'],
  ['TV001','Validação de dados','Cadastro com dados válidos','Cadastrar usuário de teste com nome, e-mail, CPF e senha válidos.','Criar usuário e retornar token.','Não executado: exige conta/dados de teste isolados.','Bloqueado','Captura manual necessária – cadastro'],
  ['TV002','Validação de dados','Campo obrigatório no cadastro','Enviar cadastro sem nome, e-mail, CPF ou senha.','Rejeitar os campos obrigatórios.','Não executado: requer execução controlada da API.','Bloqueado','Captura manual necessária – validação de cadastro'],
  ['TV003','Validação de dados','E-mail inválido','Enviar cadastro com formato de e-mail inválido.','Impedir o cadastro e informar a validação.','Não executado: requer execução controlada da API.','Bloqueado','Captura manual necessária – e-mail inválido'],
  ['TV004','Validação de dados','E-mail duplicado','Cadastrar e repetir o mesmo e-mail.','Rejeitar duplicidade.','Não executado: requer base isolada e limpeza de dados.','Bloqueado','Captura manual necessária – e-mail duplicado'],
  ['TV005','Validação de dados','Senha forte no frontend','Informar senha abaixo de 8 caracteres ou sem maiúscula, minúscula e número.','Impedir envio conforme validatePassword.','Validação identificada no código, sem execução isolada.','Bloqueado','Figura 4 – Inventário de funcionalidades'],
  ['TF002','Funcional','Login','Entrar com credenciais válidas de usuário de teste.','Autenticar e armazenar token/sessão.','Não executado: não foram usadas credenciais reais.','Bloqueado','Captura manual necessária – login'],
  ['TF003','Funcional','Login inválido','Entrar com senha incorreta ou usuário inexistente.','Recusar credenciais inválidas.','Não executado: não foram usadas credenciais reais.','Bloqueado','Captura manual necessária – login inválido'],
  ['TS001','Segurança','Acesso sem autenticação a rota protegida','Inspecionar a cadeia de autorização da API.','Exigir autenticação para rotas privadas.','Todas as rotas estão liberadas por permitAll.','Reprovado','Figura 3 – Inspeção de segurança'],
  ['TS002','Segurança','Permissão administrativa','Inspecionar endpoints administrativos e de depuração sem regra de papel.','Restringir criação de admin, alteração de usuário e depuração ao administrador.','Endpoints sensíveis não possuem proteção global.','Reprovado','Figura 3 – Inspeção de segurança'],
  ['TF004','Funcional','Cadastro de produto','Publicar produto com dados e fotos válidos como usuário autenticado.','Criar anúncio com status compatível com o fluxo.','Não executado: requer sessão e dados de teste.','Bloqueado','Captura manual necessária – produto cadastrado'],
  ['TV006','Validação de dados','Produto sem campo obrigatório','Enviar anúncio sem nome, descrição, preço ou categoria.','Informar erro e não persistir anúncio inválido.','Não executado: requer sessão e API em ambiente controlado.','Bloqueado','Captura manual necessária – validação de produto'],
  ['TF005','Funcional','Favoritos','Adicionar e remover produto favorito e recarregar a lista.','Persistir inclusão e remoção para o usuário autenticado.','Não executado: requer sessão de teste.','Bloqueado','Captura manual necessária – favoritos'],
  ['TF006','Funcional','Pedidos e rastreio','Consultar pedidos do comprador/vendedor após checkout.','Exibir pedido, status de envio e código de rastreio.','Coberto indiretamente pelo teste de integração; interface não executada.','Bloqueado','Figura 2 – Testes de integração de venda'],
  ['TF007','Funcional','Carteira e saque','Consultar saldo e solicitar saque dentro do saldo liberado.','Mostrar movimentações e validar saldo disponível.','Não executado: requer carteira e sessão de teste.','Bloqueado','Captura manual necessária – carteira'],
  ['TI004','Integração','Frete','Calcular frete pelo CEP de destino durante checkout.','Retornar opção/valor de frete e compor pedido.','Coberto pelo fluxo de integração com provider mock; tela não executada.','Bloqueado','Figura 2 – Testes de integração de venda'],
  ['TI005','Integração','Mensagem de contato','Enviar formulário de contato e consultar mensagens administrativas.','Persistir mensagem e apresentá-la ao administrador.','Não executado: requer API e base isolada.','Bloqueado','Captura manual necessária – mensagens'],
  ['TI006','Integração','Painel administrativo','Acessar painel, aprovar/rejeitar anúncio e consultar dashboard.','Permitir somente administrador e atualizar dados.','Não executado: bloqueado pela falha de autorização registrada em D001/D002.','Bloqueado','Figura 3 – Inspeção de segurança'],
  ['TIF001','Interface e usabilidade','Navegação principal','Avaliar caminhos de cadastro, login, catálogo, favoritos, pedidos e perfil no navegador.','Rótulos e navegação devem estar compreensíveis e acessíveis.','Não executado: requer avaliação manual em navegador.','Bloqueado','Captura manual necessária – navegação'],
  ['TR001','Responsividade e compatibilidade','Larguras desktop, notebook e celular','Testar 1440 px, 1024 px e 375 px nos navegadores suportados.','Conteúdo deve adaptar sem sobreposição ou perda de ação.','Não executado: não houve sessão de navegador/dispositivo.','Bloqueado','Captura manual necessária – responsividade']
];

const defeitos = [
  ['D001','TS001','Gravidade: Crítico. A configuração global libera todas as rotas da API.','Rotas privadas devem exigir JWT e, quando aplicável, papel de administrador.','SecurityConfig usa anyRequest().permitAll(), permitindo requisições sem autenticação.','Figura 3 – Inspeção de segurança','Aberto. Definir rotas públicas e exigir authenticated()/hasRole(\'ADMIN\') nas demais; adicionar testes de autorização.','Aberto'],
  ['D002','TS002','Gravidade: Crítico. Endpoints administrativos e de depuração estão expostos sem proteção global.','Criar administrador, alterar status e consultar dados técnicos devem exigir administrador e não ficar expostos em produção.','AuthController declara /criar-admin, /test-db, /force-inactive/{email} e outros endpoints; a regra global os libera.','Figura 3 – Inspeção de segurança','Aberto. Restringir endpoints a ADMIN e remover/desabilitar endpoints de depuração em produção; testar 401/403.','Aberto']
];

function style(sheet, headers, rows, title, subtitle) {
  sheet.showGridLines = false;
  sheet.getRange('A1:H1').merge();
  sheet.getRange('A1').values = [[title]];
  sheet.getRange('A1').format = { font: { name: 'Arial', size: 15, bold: true, color: '#1F2937' } };
  sheet.getRange('A2:H2').merge();
  sheet.getRange('A2').values = [[subtitle]];
  sheet.getRange('A2').format = { font: { name: 'Arial', size: 10, italic: true, color: '#4B5563' } };
  sheet.getRange('A4:H4').values = [headers];
  sheet.getRange(`A5:H${rows.length + 4}`).values = rows;
  const header = sheet.getRange('A4:H4');
  header.format = { fill: '#1F4E78', font: { name: 'Arial', size: 10, bold: true, color: '#FFFFFF' }, horizontalAlignment: 'center', verticalAlignment: 'center', wrapText: true };
  const body = sheet.getRange(`A5:H${rows.length + 4}`);
  body.format = { font: { name: 'Arial', size: 10, color: '#1F2937' }, verticalAlignment: 'top', wrapText: true };
  body.format.borders = { preset: 'inside', style: 'thin', color: '#D9E2F3' };
  sheet.getRange(`G5:G${rows.length + 4}`).conditionalFormats.add('containsText', { text: 'Aprovado', format: { fill: '#E2F0D9', font: { color: '#375623', bold: true } } });
  sheet.getRange(`G5:G${rows.length + 4}`).conditionalFormats.add('containsText', { text: 'Reprovado', format: { fill: '#FCE4D6', font: { color: '#C00000', bold: true } } });
  sheet.getRange(`G5:G${rows.length + 4}`).conditionalFormats.add('containsText', { text: 'Bloqueado', format: { fill: '#FFF2CC', font: { color: '#7F6000', bold: true } } });
  sheet.getRange(`A4:H${rows.length + 4}`).format.autofitRows();
  const widths = [11,17,25,47,45,43,13,36];
  widths.forEach((w, i) => sheet.getRangeByIndexes(0, i, rows.length + 4, 1).format.columnWidth = w);
  sheet.getRange('A1:H2').format.rowHeight = 22;
  sheet.freezePanes.freezeRows(4);
}

const wb1 = Workbook.create();
const s1 = wb1.worksheets.add('Resultados dos testes');
style(s1, ['ID','Tipo de teste','Funcionalidade/Item','Procedimento / Cenário','Resultado esperado','Resultado simulado','Status','Evidência'], teste, 'PLANILHA DE RESULTADOS DOS TESTES', 'Além do Positivo — execução e inspeção em 18/09/2026');
const wb2 = Workbook.create();
const s2 = wb2.worksheets.add('Defeitos encontrados');
style(s2, ['ID','Teste relacionado','Defeito encontrado','Comportamento esperado','Comportamento encontrado','Evidência','Correção','Status'], defeitos, 'RELAÇÃO DOS DEFEITOS ENCONTRADOS', 'Além do Positivo — defeitos identificados na execução e inspeção em 18/09/2026');
await fs.mkdir(out, { recursive: true });
await (await SpreadsheetFile.exportXlsx(wb1)).save(`${out}/Planilha de Testes - Além do Positivo.xlsx`);
await (await SpreadsheetFile.exportXlsx(wb2)).save(`${out}/Defeitos e Evidências - Além do Positivo.xlsx`);
for (const [wb, sheet, range] of [[wb1,'Resultados dos testes','A1:H29'], [wb2,'Defeitos encontrados','A1:H6']]) {
  const inspect = await wb.inspect({ kind: 'table', range: `${sheet}!${range}`, include: 'values,formulas', tableMaxRows: 30, tableMaxCols: 8 });
  console.log(inspect.ndjson);
  const errs = await wb.inspect({ kind: 'match', searchTerm: '#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A', options: { useRegex: true, maxResults: 20 } });
  console.log(errs.ndjson);
  const preview = await wb.render({ sheetName: sheet, range, scale: 1, format: 'png' });
  await fs.writeFile(`${out}/${sheet}.png`, new Uint8Array(await preview.arrayBuffer()));
}
