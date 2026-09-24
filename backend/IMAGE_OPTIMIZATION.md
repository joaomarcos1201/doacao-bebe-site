# Otimização das fotos de anúncios

## Diagnóstico e contrato

`POST /api/products` recebe multipart: `imagem`, `imagem_1`, `imagem_2`, `imagem_3`.
O controlador copiava `MultipartFile.getBytes()` diretamente para `Produto.foto/foto2/foto3/foto4`.
`Produto` mapeia a tabela `Anuncio`; as fotos são `byte[]` com `@Lob`, em colunas binárias
do SQL Server (`VARBINARY(MAX)` no esquema existente). Nenhuma alteração de esquema foi introduzida.
Os GETs serializam esses bytes como Base64. Base64 aumenta o tráfego JSON, mas **não** é
a causa do tamanho binário no banco: os originais, inclusive resolução e metadados, eram preservados integralmente.

`NovoProdutoRequest` não participa desse upload e não contém fotos; permaneceu intacto.
Não há endpoint de edição de fotos neste backend: os PUTs de anúncio alteram nome ou status.
Qualquer futuro endpoint de substituição de fotos deve chamar `AnuncioImageOptimizer` antes de salvar.
O site permitia oito arquivos, embora somente quatro campos fossem persistidos. Agora permite quatro,
e o backend rejeita campos extras, arquivos vazios e nomes de campo duplicados.

## Política implementada

| Item | Valor |
|---|---|
| Maior lado de saída | 1600 px |
| Proporção | Preservada, arredondamento de no máximo 1 px, sem ampliar imagens pequenas |
| Entrada | JPEG ou PNG estático, reconhecidos pelo conteúdo, não pela extensão/MIME informado |
| Arquivo de entrada | Até 10 MiB (10.485.760 bytes) por foto |
| Resolução de entrada | Até 40.000.000 pixels e 12.000 px em cada lado, verificados antes da decodificação |
| Quantidade | Até quatro fotos por anúncio |
| Multipart total | 41 MiB, incluindo os quatro arquivos e campos; arquivos temporários em disco |
| Saída por foto | Até 1 MiB (1.048.576 bytes); acima disso rejeita sem salvar o anúncio |
| Foto opaca que precisa de processamento | JPEG qualidade 0,88 e tabelas Huffman otimizadas |
| Transparência efetivamente usada | PNG, preservando alpha, compressão sem perda após redimensionamento |
| Orientação | EXIF 1–8, inclusive espelhamentos; metadados não reaplicados após transformação |
| Imagens já pequenas | Até 350 KiB, até 1600 px e sem rotação: bytes preservados após validação completa |
| Segunda passagem | JPEG produzido aqui tem comentário de identificação; preservado após revalidação dos limites e decodificação |

JPEG 88 é uma escolha conservadora dentro da faixa solicitada, equilibrando tamanho e detalhe.
O algoritmo usa redução progressiva e interpolação bicúbica. PNG opaco pequeno também pode ser
mantido integralmente para evitar transformação sem necessidade. Se a codificação aumentar o
tamanho e não houver rotação/redimensionamento obrigatório, preserva o original **somente dentro do limite de saída**.
PNG transparente detalhado pode ultrapassar 1 MiB: nesse caso o sistema pede outra imagem,
sem achatar o fundo ou baixar automaticamente a qualidade.

Não foi adotado WebP: os clientes existentes assumem JPEG nas URLs Base64, e não há execução
Android/iOS nesta validação para demonstrar suporte sem ressalvas. JPEG e PNG mantêm os formatos
já utilizados. No React, `anuncioImage` agora declara corretamente JPEG ou PNG nas telas de produto.

O app em `../doacao-bebe-mobile` foi inspecionado: Expo 57, React Native 0.86.3,
quatro fotos em `useAnnounceForm`, mesmos nomes multipart e `Image` com URI Base64.
O app não foi modificado. JPEG otimizado conserva o contrato e o formato esperado.
Para PNG, o app ainda declara `image/jpeg` nas URIs, como fazia antes: a decodificação foi validada
no navegador, **não em dispositivos nativos**. Antes de publicar, testar PNG transparente em Android e iOS;
se necessário, aplicar a mesma detecção de prefixo `iVBORw0KGgo` usada no helper do site.
Não confundir uma viewport de celular no Chrome com validação React Native.

Referências técnicas: [compressão no ImageIO Java 17](https://docs.oracle.com/en/java/javase/17/docs/api/java.desktop/javax/imageio/ImageWriteParam.html)
e [metadata-extractor](https://github.com/drewnoakes/metadata-extractor), usado para ler EXIF.

## Testes locais e medidas

Foram usados arquivos sintéticos determinísticos; **não** são as fotos reais dos anúncios 62 e 65.

| Caso | Antes (bytes) | Depois (bytes) | Dimensão final |
|---|---:|---:|---|
| JPEG horizontal grande | 7.093.175 | 276.271 | 1600 × 1067 |
| PNG opaco vertical → JPEG | 7.176.790 | 425.580 | 1067 × 1600 |
| JPEG com EXIF 6 | 9.643 | 3.429 | 80 × 120 |
| PNG transparente | 9.675 | 6.888 | 1600 × 800 |
| JPEG pequeno | 14.311 | 14.311 | 160 × 90 |
| PNG pequeno | 39.872 | 39.872 | 160 × 90 |

12 testes novos Java aprovados: JPEG/PNG, vertical/horizontal, pequeno/grande, alpha,
oito transformações EXIF e EXIF real embutido, segunda passagem sem alteração,
arquivo inválido/truncado, GIF recusado, excesso de bytes/lado/pixels, saída transparente
acima do limite, quatro fotos, campos extras/duplicados, erro na quarta foto sem gravação parcial,
simulação sem escrita, execução transacional e rollback forçado no segundo UPDATE.
Os 48 testes Java preexistentes também passaram. Os testes de persistência usam H2 em memória;
**a rotina não foi executada contra SQL Server ou fotos existentes**.
React: 10 testes aprovados. Build aprovado com avisos preexistentes de lint/Browserslist.

O teste de navegador serve o build real em endereço local, simula a API e bloqueia conexões
externas. Verifica a decodificação das quatro imagens na página `/produto/62` e a galeria
em desktop e viewport estreita. As capturas ficam em `target/image-test-results`.
Foi corrigida a classe `det-grid`, ausente no container da página, que impedia a regra
responsiva existente de exibir corretamente a galeria em telas estreitas.

As medidas demonstram economia e funcionamento, não uma garantia universal de equivalência
visual. Avaliar as fotos reais de roupas/texturas/letras da cópia local em tamanho normal e no zoom
antes de aplicar em qualquer base definitiva. Os originais continuam necessários no backup.

### Reproduzir os testes

Java 17, Maven e dependências do projeto instalados:

```powershell
cd backend
mvn test
cd ..
$env:CI = 'true'
npm test -- --watchAll=false --runInBand
Remove-Item Env:CI
npm run build
node scripts/test-anuncio-images.cjs
```

O teste de navegador usa Chrome instalado no caminho padrão Windows e `ws`, disponível na árvore
do react-scripts. Para outro executável, definir `IMAGE_TEST_CHROME`. Não usa perfil pessoal do Chrome.

## Otimização MANUAL de imagens existentes

`com.doacaobebe.tools.OptimizeAnuncioImages` é um programa independente, sem endpoint,
sem `CommandLineRunner` e sem inicialização Spring. **Não lê `application.properties`**.
Somente conecta a `localhost`, com banco, porta e credenciais fornecidos explicitamente.
Não aceita URL nem hostname da Somee. Não executar túneis de produção na porta local selecionada.

Sem `--apply`, apenas lê, processa em memória e registra a simulação. O programa não grava
arquivos de imagens reais. A gravação exige `--apply --backup-confirmed`.
Sem filtro, busca todos os IDs, priorizando **62 e 65**, e carrega um anúncio por vez.
O SQL altera exclusivamente `foto`, `foto2`, `foto3`, `foto4` de `Anuncio`.

Para cada anúncio:

1. Lê as quatro fotos e gera/valida candidatas em memória.
2. Se qualquer foto falhar, preserva o anúncio inteiro e registra `ERRO_MANTIDA`.
3. Só considera substituições estritamente menores. Nulos e vazios existentes são mantidos.
4. Em modo de gravação, abre transação, atualiza apenas colunas com redução e compara os
   bytes originais no `WHERE` para não sobrescrever alteração concorrente.
5. Qualquer erro ou conflito reverte todas as alterações desse anúncio; outros anúncios continuam.
6. Registra `id,coluna,bytes_antes,bytes_depois,status` somente depois do commit ou da simulação.

### Procedimento seguro na cópia local

1. Faça e verifique seu backup. Restaure em uma instância SQL Server **local**, com nome distinto,
   por exemplo `AlemPositivo_Imagens_Teste`. Não aponte o servidor Spring para produção durante o teste.
2. Preferencialmente use um login local autorizado a ler `Anuncio` e atualizar apenas suas quatro
   colunas de fotos. Não necessita permissão de DDL ou de alteração nas outras tabelas.
3. Compile a ferramenta sem inicializar o aplicativo:

```powershell
cd backend
mvn -DskipTests compile dependency:build-classpath '-Dmdep.outputFile=target/image-classpath.txt'
$imageClasspath = 'target/classes;' + (Get-Content target/image-classpath.txt -Raw).Trim()
$env:IMAGE_MIGRATION_DATABASE = 'AlemPositivo_Imagens_Teste'
$env:IMAGE_MIGRATION_PORT = '1433'
$env:IMAGE_MIGRATION_USER = Read-Host 'Login do SQL Server local'
$imageCredential = Get-Credential -UserName $env:IMAGE_MIGRATION_USER -Message 'Credencial da copia LOCAL'
$env:IMAGE_MIGRATION_PASSWORD = $imageCredential.GetNetworkCredential().Password
```

4. Simule primeiro os anúncios prioritários, sem gravar:

```powershell
java -cp $imageClasspath com.doacaobebe.tools.OptimizeAnuncioImages --ids=62,65 |
  Tee-Object -FilePath target/imagens-62-65-simulacao.csv
```

5. Revise os tamanhos e erros. Após verificar o backup da cópia local, aplique **apenas nessa cópia**:

```powershell
java -cp $imageClasspath com.doacaobebe.tools.OptimizeAnuncioImages --ids=62,65 --apply --backup-confirmed |
  Tee-Object -FilePath target/imagens-62-65-aplicacao.csv
```

6. Abra site e app contra o backend configurado para a cópia local. Compare as quatro fotos,
   orientação, transparência, zoom e textura. Nunca iniciar o backend para esse teste com seu
   datasource de produção ainda configurado. Use `ddl-auto=none` na cópia restaurada.
7. Depois da inspeção, simule todos e, se satisfatório, aplique em todos **na cópia local**:

```powershell
java -cp $imageClasspath com.doacaobebe.tools.OptimizeAnuncioImages |
  Tee-Object -FilePath target/imagens-todas-simulacao.csv
java -cp $imageClasspath com.doacaobebe.tools.OptimizeAnuncioImages --apply --backup-confirmed |
  Tee-Object -FilePath target/imagens-todas-aplicacao.csv
Remove-Item Env:IMAGE_MIGRATION_PASSWORD
```

Procure `ERRO_MANTIDA` nos relatórios, mesmo se o programa terminar normalmente.
Fotos legadas acima de 10 MiB ou fora dos formatos/limites são mantidas e sinalizadas;
não existe fallback que grave conteúdo inválido ou reduza agressivamente a qualidade.
Guarde o backup e os relatórios; para desfazer o teste, restaure a cópia local a partir do backup.
Uma futura aplicação em produção exige uma etapa deliberada posterior; esta ferramenta bloqueia
hosts remotos por construção. Nenhuma execução ou deploy de produção foi realizada.

Consulta somente de leitura para comparar os bytes na cópia SQL Server:

```sql
SELECT id,
  COALESCE(DATALENGTH(foto), 0) AS foto_bytes,
  COALESCE(DATALENGTH(foto2), 0) AS foto2_bytes,
  COALESCE(DATALENGTH(foto3), 0) AS foto3_bytes,
  COALESCE(DATALENGTH(foto4), 0) AS foto4_bytes
FROM Anuncio
WHERE id IN (62, 65)
ORDER BY id;
```

A redução dos BLOBs libera espaço interno reutilizável; não promete reduzir os 30 MB já
alocados ao arquivo de dados. Nenhum `SHRINK`, alteração de esquema ou limpeza financeira foi adicionado.

## Arquivos alterados/adicionados

- `backend/pom.xml`: leitor de EXIF metadata-extractor 2.19.0.
- `backend/src/main/java/com/doacaobebe/service/AnuncioImageOptimizer.java`: processamento e limites.
- `backend/src/main/java/com/doacaobebe/controller/ProdutoController.java`: integração nas quatro fotos e quantidade.
- `backend/src/main/java/com/doacaobebe/controller/AnuncioUploadExceptionHandler.java`: resposta HTTP 413 para excesso multipart.
- `backend/src/main/resources/application.properties`: limite total e armazenamento temporário multipart.
- `backend/src/main/java/com/doacaobebe/tools/OptimizeAnuncioImages.java`: CLI manual local.
- `backend/src/test/java/com/doacaobebe/service/AnuncioImageOptimizerTest.java`: processamento e medições.
- `backend/src/test/java/com/doacaobebe/service/AnuncioImageUploadTest.java`: endpoints multipart.
- `backend/src/test/java/com/doacaobebe/service/AnuncioImageMigrationTest.java`: transações H2 e simulação.
- `backend/src/test/java/com/doacaobebe/service/VendaIntegrationTest.java` e `UsuarioExclusaoIntegrationTest.java`: somente inclusão do novo serviço no contexto de teste existente.
- `src/components/anunciar/UploadFotos.js`: quatro fotos, formatos e bytes.
- `src/utils/anuncioImage.js` e `anuncioImage.test.js`: MIME das imagens Base64.
- `src/components/CardProduto.js`, `src/pages/Admin.js`, `src/pages/Checkout.js`, `src/pages/DetalhesProduto.js`,
  `src/pages/admin/AdminProductsTable.jsx`, `src/pages/admin/ProductDetailsModal.jsx`: uso do helper; classe responsiva na página de detalhes.
- `scripts/test-anuncio-images.cjs`: verificação local no navegador.
- `backend/IMAGE_OPTIMIZATION.md`: este guia.

Entidades, serviços, dados e histórico de Pedido, Pagamento, Carteira, Saque, Usuario e Categoria
não foram modificados. Ajustes em testes existentes apenas fornecem a nova dependência do controlador.
