-- Garante que todas as colunas necessárias existam na tabela Anuncio

IF NOT EXISTS (SELECT * FROM sys.columns WHERE Name = N'categoria' AND Object_ID = Object_ID(N'Anuncio'))
    ALTER TABLE Anuncio ADD categoria VARCHAR(100) NULL;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE Name = N'estado' AND Object_ID = Object_ID(N'Anuncio'))
    ALTER TABLE Anuncio ADD estado VARCHAR(50) NULL;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE Name = N'contato' AND Object_ID = Object_ID(N'Anuncio'))
    ALTER TABLE Anuncio ADD contato VARCHAR(20) NULL;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE Name = N'cpf' AND Object_ID = Object_ID(N'Anuncio'))
    ALTER TABLE Anuncio ADD cpf VARCHAR(14) NULL;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE Name = N'doador' AND Object_ID = Object_ID(N'Anuncio'))
    ALTER TABLE Anuncio ADD doador VARCHAR(100) NULL;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE Name = N'foto' AND Object_ID = Object_ID(N'Anuncio'))
    ALTER TABLE Anuncio ADD foto VARBINARY(MAX) NULL;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE Name = N'dataAnuncio' AND Object_ID = Object_ID(N'Anuncio'))
    ALTER TABLE Anuncio ADD dataAnuncio DATETIME DEFAULT GETDATE() NULL;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE Name = N'statusAnuncio' AND Object_ID = Object_ID(N'Anuncio'))
    ALTER TABLE Anuncio ADD statusAnuncio VARCHAR(20) DEFAULT 'INATIVO' NOT NULL;

-- Verificar estrutura final
SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'Anuncio';

-- Verificar produtos cadastrados
SELECT id, nome, statusAnuncio, dataAnuncio FROM Anuncio;
