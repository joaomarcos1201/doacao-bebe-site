-- Script para verificar estrutura do banco de dados

-- Verificar se as tabelas existem
SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'doacao_bebe_bancodedados';

-- Verificar estrutura da tabela usuarios
DESCRIBE usuarios;

-- Verificar estrutura da tabela produtos  
DESCRIBE produtos;

-- Verificar estrutura da tabela chats
DESCRIBE chats;

-- Verificar estrutura da tabela mensagens
DESCRIBE mensagens;

-- Verificar dados existentes
SELECT COUNT(*) as total_usuarios FROM usuarios;
SELECT COUNT(*) as total_produtos FROM produtos;
SELECT COUNT(*) as total_chats FROM chats;
SELECT COUNT(*) as total_mensagens FROM mensagens;

-- Verificar alguns usuários
SELECT id, nome, email, is_admin FROM usuarios LIMIT 5;

-- Verificar alguns produtos
SELECT id, nome, categoria, doador, status FROM produtos LIMIT 5;