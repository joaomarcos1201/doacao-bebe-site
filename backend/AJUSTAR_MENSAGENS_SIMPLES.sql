-- Script simplificado para ajustar tabela mensagens

-- Permitir NULL na coluna conteudo (se existir)
ALTER TABLE mensagens ALTER COLUMN conteudo VARCHAR(400) NULL;

-- Adicionar coluna texto se não existir
ALTER TABLE mensagens ADD texto VARCHAR(400) NULL;

-- Permitir NULL em remetente_id (se existir)  
ALTER TABLE mensagens ALTER COLUMN remetente_id INT NULL;

-- Renomear colunas para padrão camelCase (se existirem)
EXEC sp_rename 'mensagens.data_mensagem', 'dataMensagem', 'COLUMN';
EXEC sp_rename 'mensagens.status_mensagem', 'statusMensagem', 'COLUMN';