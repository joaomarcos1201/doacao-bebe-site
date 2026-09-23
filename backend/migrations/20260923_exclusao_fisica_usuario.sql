-- SQL Server. Executar uma vez, antes de publicar o backend com exclusão física.
-- O projeto não utiliza Flyway/Liquibase: esta migration é aplicada manualmente.
-- Idempotente, transacional, sem DELETE e sem remoção de chaves estrangeiras.
-- As quatro colunas são INT no mapeamento atual (Usuario.id é Integer).
SET XACT_ABORT ON;

BEGIN TRY
    BEGIN TRANSACTION;

    IF COL_LENGTH('dbo.Pedido', 'comprador_id') IS NULL
       OR COL_LENGTH('dbo.Pedido', 'vendedor_id') IS NULL
       OR COL_LENGTH('dbo.Saque', 'usuario_id') IS NULL
       OR COL_LENGTH('dbo.MovimentacaoFinanceira', 'usuario_id') IS NULL
        THROW 51000, 'Schema inesperado: confira as tabelas e o schema antes de aplicar a migration.', 1;

    IF EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.Pedido') AND name = 'comprador_id' AND is_nullable = 0)
        ALTER TABLE dbo.Pedido ALTER COLUMN comprador_id INT NULL;
    IF EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.Pedido') AND name = 'vendedor_id' AND is_nullable = 0)
        ALTER TABLE dbo.Pedido ALTER COLUMN vendedor_id INT NULL;
    IF EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.Saque') AND name = 'usuario_id' AND is_nullable = 0)
        ALTER TABLE dbo.Saque ALTER COLUMN usuario_id INT NULL;
    IF EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.MovimentacaoFinanceira') AND name = 'usuario_id' AND is_nullable = 0)
        ALTER TABLE dbo.MovimentacaoFinanceira ALTER COLUMN usuario_id INT NULL;

    COMMIT TRANSACTION;
END TRY
BEGIN CATCH
    IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
    THROW;
END CATCH;

-- Conferência: is_nullable deve ser 1. Nenhum dado ou FK é apagado.
SELECT OBJECT_SCHEMA_NAME(c.object_id) AS schema_name,
       OBJECT_NAME(c.object_id) AS tabela, c.name AS coluna, c.is_nullable
FROM sys.columns c
WHERE (c.object_id = OBJECT_ID('dbo.Pedido') AND c.name IN ('comprador_id', 'vendedor_id'))
   OR (c.object_id IN (OBJECT_ID('dbo.Saque'), OBJECT_ID('dbo.MovimentacaoFinanceira')) AND c.name = 'usuario_id');
