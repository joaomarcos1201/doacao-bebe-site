-- Script para atualizar produtos existentes que têm "Usuário Logado" como doador
-- Execute este script no banco de dados para corrigir os dados antigos

UPDATE produtos 
SET doador = 'Doador Anônimo' 
WHERE doador = 'Usuário Logado' OR doador = 'Usuario Logado';

-- Verificar os produtos atualizados
SELECT id, nome, doador, data_criacao 
FROM produtos 
ORDER BY data_criacao DESC;