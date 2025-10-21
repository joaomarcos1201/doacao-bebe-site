-- Script para remover a coluna respondido da tabela Mensagem
-- Execute este script no banco de dados

-- Verificar se a coluna existe antes de tentar remover
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
           WHERE TABLE_NAME = 'Mensagem' AND COLUMN_NAME = 'respondido')
BEGIN
    ALTER TABLE Mensagem DROP COLUMN respondido;
    PRINT 'Coluna respondido removida com sucesso';
END
ELSE
BEGIN
    PRINT 'Coluna respondido não existe na tabela';
END