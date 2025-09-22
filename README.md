# Doação Bebê - Sistema Completo

Este projeto consiste em um sistema completo com frontend React e backend Java Spring Boot conectado ao banco de dados SQL Server.

## Estrutura do Projeto

```
doacao-bebe-site/
├── backend/                 # Backend Java Spring Boot
│   ├── src/
│   │   └── main/
│   │       ├── java/
│   │       │   └── com/
│   │       │       └── doacaobebe/
│   │       │           ├── entity/
│   │       │           ├── repository/
│   │       │           ├── service/
│   │       │           ├── controller/
│   │       │           ├── config/
│   │       │           └── dto/
│   │       └── resources/
│   │           └── application.properties
│   ├── pom.xml
│   └── run.bat
├── src/                     # Frontend React
└── package.json
```

## Configuração do Banco de Dados

O sistema está configurado para conectar ao banco SQL Server com as seguintes credenciais:
- **Servidor**: doacao_bebe_bancodedados.mssql.somee.com
- **Usuário**: alemdopositivo
- **Senha**: doacaobebe

## Como Executar

### 1. Executar o Backend (Java Spring Boot)

```bash
cd backend
mvn spring-boot:run
```

Ou execute o arquivo `run.bat` no Windows:
```bash
cd backend
run.bat
```

O backend será executado na porta 8080: http://localhost:8080

### 2. Executar o Frontend (React)

Em outro terminal:
```bash
npm install
npm start
```

O frontend será executado na porta 3000: http://localhost:3000

## Funcionalidades Implementadas

### Backend (API REST)
- **POST /api/auth/login** - Login de usuários
- **POST /api/auth/cadastro** - Cadastro de novos usuários
- **GET /api/usuarios** - Listar todos os usuários
- **PUT /api/usuarios/{id}/status** - Alterar status do usuário
- **DELETE /api/usuarios/{id}** - Remover usuário

### Frontend
- Login integrado com o backend
- Cadastro integrado com o backend
- Painel administrativo conectado ao backend
- Gerenciamento de usuários em tempo real

## Tecnologias Utilizadas

### Backend
- Java 17
- Spring Boot 3.2.0
- Spring Data JPA
- Spring Security
- JWT (JSON Web Tokens)
- SQL Server Driver

### Frontend
- React
- React Router
- Context API para gerenciamento de estado

## Credenciais de Administrador

Para acessar o painel administrativo:
- **Email**: admin@alemdopositivo.com
- **Senha**: admin123

## Estrutura do Banco de Dados

### Tabela: usuarios
- id (BIGINT, PRIMARY KEY, AUTO_INCREMENT)
- nome (VARCHAR, NOT NULL)
- email (VARCHAR, NOT NULL, UNIQUE)
- senha (VARCHAR, NOT NULL) - Criptografada com BCrypt
- status (VARCHAR, DEFAULT 'ativo')
- data_criacao (DATETIME, DEFAULT NOW())
- is_admin (BOOLEAN, DEFAULT false)

## Observações

1. O backend cria automaticamente as tabelas no banco de dados na primeira execução
2. As senhas são criptografadas usando BCrypt
3. O sistema utiliza JWT para autenticação
4. CORS está configurado para permitir requisições do frontend
5. O frontend armazena o token JWT no localStorage