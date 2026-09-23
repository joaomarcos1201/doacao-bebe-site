-- SOMENTE LEITURA. Usar na instância real antes da migration/publicação.
-- Lista inclusive FKs que não estejam mapeadas no código JPA.
SELECT fk.name AS constraint_name,
       OBJECT_SCHEMA_NAME(fkc.parent_object_id) AS schema_name,
       OBJECT_NAME(fkc.parent_object_id) AS tabela,
       col.name AS coluna,
       col.is_nullable,
       fk.delete_referential_action_desc,
       fk.is_disabled,
       fk.is_not_trusted
FROM sys.foreign_keys fk
JOIN sys.foreign_key_columns fkc ON fkc.constraint_object_id = fk.object_id
JOIN sys.columns col ON col.object_id = fkc.parent_object_id AND col.column_id = fkc.parent_column_id
WHERE OBJECT_NAME(fkc.referenced_object_id) IN ('Usuario', 'Anuncio', 'Pedido')
ORDER BY fkc.referenced_object_id, tabela, coluna;

-- Contagem de TODAS as referências diretas para o ID investigado, sem expor dados pessoais.
DECLARE @UsuarioId INT = 48;
DECLARE @Schema SYSNAME, @Tabela SYSNAME, @Coluna SYSNAME, @Sql NVARCHAR(MAX);
DECLARE referencias CURSOR LOCAL FAST_FORWARD FOR
    SELECT OBJECT_SCHEMA_NAME(fkc.parent_object_id), OBJECT_NAME(fkc.parent_object_id), col.name
    FROM sys.foreign_key_columns fkc
    JOIN sys.columns col ON col.object_id = fkc.parent_object_id AND col.column_id = fkc.parent_column_id
    JOIN sys.columns ref ON ref.object_id = fkc.referenced_object_id AND ref.column_id = fkc.referenced_column_id
    WHERE OBJECT_NAME(fkc.referenced_object_id) = 'Usuario' AND ref.name = 'id';
OPEN referencias;
FETCH NEXT FROM referencias INTO @Schema, @Tabela, @Coluna;
WHILE @@FETCH_STATUS = 0
BEGIN
    SET @Sql = N'SELECT @NomeTabela AS tabela, @NomeColuna AS coluna, COUNT_BIG(*) AS referencias FROM '
        + QUOTENAME(@Schema) + N'.' + QUOTENAME(@Tabela) + N' WHERE ' + QUOTENAME(@Coluna) + N' = @Id';
    EXEC sp_executesql @Sql, N'@Id INT, @NomeTabela NVARCHAR(257), @NomeColuna SYSNAME',
        @Id = @UsuarioId, @NomeTabela = @Tabela, @NomeColuna = @Coluna;
    FETCH NEXT FROM referencias INTO @Schema, @Tabela, @Coluna;
END;
CLOSE referencias;
DEALLOCATE referencias;
