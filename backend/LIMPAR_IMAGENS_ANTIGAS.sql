-- Script para limpar dados antigos de imagens que são URLs em vez de dados binários
-- Execute este script no banco de dados para corrigir os dados

-- Primeiro, vamos ver quais produtos têm URLs como imagem
SELECT id, nome, 
       CASE 
           WHEN imagem IS NULL THEN 'NULL'
           WHEN LEN(CAST(imagem AS VARCHAR(MAX))) < 100 THEN 'Possível URL: ' + CAST(imagem AS VARCHAR(MAX))
           ELSE 'Dados binários válidos'
       END as status_imagem
FROM produtos;

-- Limpar imagens que são URLs (começam com 'http' ou são muito pequenas para serem imagens reais)
UPDATE produtos 
SET imagem = NULL 
WHERE imagem IS NOT NULL 
  AND (
    CAST(imagem AS VARCHAR(MAX)) LIKE 'http%' 
    OR CAST(imagem AS VARCHAR(MAX)) LIKE 'data:image%'
    OR LEN(CAST(imagem AS VARCHAR(MAX))) < 1000
  );

-- Verificar produtos após limpeza
SELECT id, nome, 
       CASE 
           WHEN imagem IS NULL THEN 'Sem imagem'
           ELSE 'Imagem binária válida'
       END as status_imagem
FROM produtos
ORDER BY id DESC;