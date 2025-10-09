-- Script para adicionar coluna CPF na tabela Usuario
-- Execute este script no banco de dados SQL Server

USE [doacao_bebe_bancodedados];
GO

-- Adicionar coluna CPF na tabela Usuario
ALTER TABLE Usuario
ADD cpf CHAR(11) NOT NULL DEFAULT '';
GO

-- Opcional: Criar índice para melhorar performance nas consultas por CPF
CREATE INDEX IX_Usuario_CPF ON Usuario(cpf);
GO

PRINT 'Coluna CPF adicionada com sucesso na tabela Usuario';