-- Script para corrigir usuários sem CPF
-- Execute este script no banco de dados para corrigir o problema

-- Primeiro, alterar a coluna para permitir NULL
ALTER TABLE usuarios ALTER COLUMN cpf VARCHAR(11) NULL;

-- Atualizar usuários que não têm CPF
UPDATE usuarios 
SET cpf = '00000000000' 
WHERE cpf IS NULL OR cpf = '';

-- Verificar se há usuários sem CPF
SELECT id, nome, email, cpf 
FROM usuarios 
WHERE cpf IS NULL OR cpf = '';