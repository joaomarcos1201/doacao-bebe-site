-- Executar na raiz do projeto: sqlcmd -S localhost -E -C -b -i backend/src/test/sql/exclusao_usuario_sqlserver.sql
-- Banco descartável exclusivo. Se o nome já existir, para sem modificar esse banco.
:On Error exit
USE master;
GO
IF DB_ID(N'Codex_UsuarioDelete_20260923_Test') IS NOT NULL
    THROW 51000, 'O banco de teste já existe. Nenhum banco existente será sobrescrito.', 1;
GO
CREATE DATABASE Codex_UsuarioDelete_20260923_Test;
GO
USE Codex_UsuarioDelete_20260923_Test;
GO
SET NOCOUNT ON;
SET XACT_ABORT ON;

-- Reproduz as colunas e FKs relevantes do schema anterior (NOT NULL no histórico).
CREATE TABLE dbo.Usuario (id INT PRIMARY KEY);
CREATE TABLE dbo.Anuncio (id INT PRIMARY KEY, vendedor_id INT NULL REFERENCES dbo.Usuario(id),
    statusVisibilidade VARCHAR(20), doador VARCHAR(100), contato VARCHAR(20), cpf VARCHAR(14));
CREATE TABLE dbo.Pedido (id BIGINT PRIMARY KEY, comprador_id INT NOT NULL REFERENCES dbo.Usuario(id),
    vendedor_id INT NOT NULL REFERENCES dbo.Usuario(id), produto_id INT NOT NULL REFERENCES dbo.Anuncio(id),
    statusPagamento VARCHAR(20), codigoRastreio VARCHAR(100), valorTotal DECIMAL(10,2));
CREATE TABLE dbo.Pagamento (id BIGINT PRIMARY KEY, pedido_id BIGINT NOT NULL REFERENCES dbo.Pedido(id), valor DECIMAL(10,2));
CREATE TABLE dbo.Carteira (id BIGINT PRIMARY KEY, usuario_id INT NOT NULL UNIQUE REFERENCES dbo.Usuario(id), saldoLiberado DECIMAL(10,2));
CREATE TABLE dbo.Favorito (id INT PRIMARY KEY, usuario_id INT NOT NULL REFERENCES dbo.Usuario(id), produto_id INT NOT NULL REFERENCES dbo.Anuncio(id));
CREATE TABLE dbo.Saque (id BIGINT PRIMARY KEY, usuario_id INT NOT NULL REFERENCES dbo.Usuario(id), valor DECIMAL(10,2));
CREATE TABLE dbo.MovimentacaoFinanceira (id BIGINT PRIMARY KEY, usuario_id INT NOT NULL REFERENCES dbo.Usuario(id),
    pedido_id BIGINT NULL REFERENCES dbo.Pedido(id), valor DECIMAL(10,2));

INSERT dbo.Usuario VALUES (1), (2), (3);
INSERT dbo.Anuncio VALUES (10, 1, 'ONLINE', 'Pessoa', '11999999999', '11111111111'), (11, 1, 'ONLINE', NULL, NULL, NULL);
INSERT dbo.Pedido VALUES (100, 2, 1, 10, 'LIBERADO', 'HISTORICO123', 110.00);
INSERT dbo.Pagamento VALUES (200, 100, 110.00);
INSERT dbo.Carteira VALUES (300, 1, 0.00);
INSERT dbo.Favorito VALUES (400, 1, 10), (401, 2, 11);
INSERT dbo.Saque VALUES (500, 1, 90.00);
INSERT dbo.MovimentacaoFinanceira VALUES (600, 1, 100, 90.00), (601, 2, 100, 110.00);
GO

-- Executa o arquivo de migration de entrega duas vezes para verificar idempotência.
:r backend/migrations/20260923_exclusao_fisica_usuario.sql
GO
:r backend/migrations/20260923_exclusao_fisica_usuario.sql
GO
IF (SELECT COUNT(*) FROM sys.foreign_keys) <> 11
    THROW 51001, 'Uma FK foi removida pela migration.', 1;
IF (SELECT COUNT(*) FROM dbo.Pedido) <> 1 OR (SELECT COUNT(*) FROM dbo.Pagamento) <> 1
    THROW 51002, 'A migration alterou dados históricos.', 1;

-- Mesma sequência de DML usada no service. Valores foram regularizados previamente.
BEGIN TRANSACTION;
DECLARE @Id INT = 1;
DELETE FROM dbo.Favorito WHERE usuario_id = @Id OR produto_id IN (SELECT id FROM dbo.Anuncio WHERE vendedor_id = @Id);
DELETE FROM dbo.Carteira WHERE usuario_id = @Id;
UPDATE dbo.Saque SET usuario_id = NULL WHERE usuario_id = @Id;
UPDATE dbo.MovimentacaoFinanceira SET usuario_id = NULL WHERE usuario_id = @Id;
UPDATE dbo.Pedido SET comprador_id = NULL WHERE comprador_id = @Id;
UPDATE dbo.Pedido SET vendedor_id = NULL WHERE vendedor_id = @Id;
DELETE a FROM dbo.Anuncio a WHERE vendedor_id = @Id AND NOT EXISTS (SELECT 1 FROM dbo.Pedido p WHERE p.produto_id = a.id);
UPDATE dbo.Anuncio SET vendedor_id = NULL, statusVisibilidade = 'REMOVIDO', doador = NULL, contato = NULL, cpf = NULL WHERE vendedor_id = @Id;
DELETE dbo.Usuario WHERE id = @Id;
COMMIT TRANSACTION;

IF EXISTS (SELECT 1 FROM dbo.Usuario WHERE id = 1)
    THROW 51003, 'O usuário não foi excluído fisicamente.', 1;
IF NOT EXISTS (SELECT 1 FROM dbo.Pedido WHERE id = 100 AND comprador_id = 2 AND vendedor_id IS NULL AND valorTotal = 110 AND codigoRastreio = 'HISTORICO123')
    THROW 51004, 'O pedido/frete ou a outra parte da compra foi alterado indevidamente.', 1;
IF NOT EXISTS (SELECT 1 FROM dbo.Pagamento WHERE id = 200 AND pedido_id = 100 AND valor = 110)
    THROW 51005, 'Pagamento não preservado.', 1;
IF NOT EXISTS (SELECT 1 FROM dbo.Saque WHERE id = 500 AND usuario_id IS NULL AND valor = 90)
    THROW 51006, 'Saque não preservado.', 1;
IF NOT EXISTS (SELECT 1 FROM dbo.MovimentacaoFinanceira WHERE id = 600 AND usuario_id IS NULL AND pedido_id = 100 AND valor = 90)
    THROW 51007, 'Movimentação não preservada.', 1;
IF NOT EXISTS (SELECT 1 FROM dbo.MovimentacaoFinanceira WHERE id = 601 AND usuario_id = 2)
    THROW 51008, 'Movimentação do outro usuário foi alterada.', 1;
IF EXISTS (SELECT 1 FROM dbo.Anuncio WHERE id = 11) OR EXISTS (SELECT 1 FROM dbo.Favorito) OR EXISTS (SELECT 1 FROM dbo.Carteira)
    THROW 51009, 'Dependências descartáveis não removidas.', 1;
IF NOT EXISTS (SELECT 1 FROM dbo.Anuncio WHERE id = 10 AND vendedor_id IS NULL AND cpf IS NULL AND contato IS NULL AND doador IS NULL AND statusVisibilidade = 'REMOVIDO')
    THROW 51010, 'Anúncio histórico não preservado/desvinculado.', 1;

-- Exclui também o comprador de um pedido cujo vendedor já está NULL.
BEGIN TRANSACTION;
UPDATE dbo.MovimentacaoFinanceira SET usuario_id = NULL WHERE usuario_id = 2;
UPDATE dbo.Pedido SET comprador_id = NULL WHERE comprador_id = 2;
DELETE dbo.Usuario WHERE id = 2;
COMMIT TRANSACTION;
IF EXISTS (SELECT 1 FROM dbo.Usuario WHERE id IN (1, 2)) OR NOT EXISTS (SELECT 1 FROM dbo.Usuario WHERE id = 3)
    THROW 51011, 'Exclusão do segundo participante inválida.', 1;
IF (SELECT COUNT(*) FROM dbo.Pedido WHERE comprador_id IS NULL AND vendedor_id IS NULL) <> 1
    THROW 51012, 'Pedido sem participantes não foi preservado.', 1;
DBCC CHECKCONSTRAINTS WITH ALL_CONSTRAINTS;
PRINT 'PASS: migration idempotente, 11 FKs mantidas, exclusão física e histórico preservado no SQL Server.';
GO
USE master;
GO
-- Somente o banco criado acima; a proteção inicial impede usar um banco preexistente.
DROP DATABASE Codex_UsuarioDelete_20260923_Test;
GO
