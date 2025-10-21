USE bd_alem_do_positivo;
GO

-- 1️⃣ Verifica se a tabela mensagens existe (com S)
IF EXISTS (SELECT * FROM sys.objects WHERE name = 'mensagens' AND type = 'U')
BEGIN
    PRINT 'Ajustando tabela mensagens para compatibilidade com backend...';

    -- ✅ 2️⃣ Remover coluna conteudo se ela não é mais usada ou duplicada com "texto"
    IF EXISTS (SELECT * FROM sys.columns WHERE Name = N'conteudo' AND Object_ID = Object_ID(N'mensagens'))
    BEGIN
        ALTER TABLE mensagens ALTER COLUMN conteudo VARCHAR(400) NULL; -- permite nulo para evitar erro imediato
        -- Caso queira remover completamente, descomente a linha abaixo:
        -- ALTER TABLE mensagens DROP COLUMN conteudo;
    END

    -- ✅ 3️⃣ Ajustar remetente_id para permitir NULL, evitando erro 400
    IF EXISTS (SELECT * FROM sys.columns WHERE Name = N'remetente_id' AND Object_ID = Object_ID(N'mensagens'))
    BEGIN
        ALTER TABLE mensagens ALTER COLUMN remetente_id INT NULL;
    END

    -- ✅ 4️⃣ Garantir que "texto" exista (coluna oficial)
    IF NOT EXISTS (SELECT * FROM sys.columns WHERE Name = N'texto' AND Object_ID = Object_ID(N'mensagens'))
    BEGIN
        ALTER TABLE mensagens ADD texto VARCHAR(400) NULL;
    END

    -- ✅ 5️⃣ Padronizar nomes de colunas para compatibilidade backend (dataMensagem, statusMensagem)
    IF EXISTS (SELECT * FROM sys.columns WHERE Name = N'data_mensagem' AND Object_ID = Object_ID(N'mensagens'))
    BEGIN
        EXEC sp_rename 'mensagens.data_mensagem', 'dataMensagem', 'COLUMN';
    END

    IF EXISTS (SELECT * FROM sys.columns WHERE Name = N'status_mensagem' AND Object_ID = Object_ID(N'mensagens'))
    BEGIN
        EXEC sp_rename 'mensagens.status_mensagem', 'statusMensagem', 'COLUMN';
    END
END
ELSE
BEGIN
    PRINT 'Tabela mensagens não encontrada. Nenhuma alteração feita.';
END
GO