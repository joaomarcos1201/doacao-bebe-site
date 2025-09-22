# Instruções de Instalação - Backend Java

## Pré-requisitos

Para executar o backend, você precisa instalar:

### 1. Java 17 ou superior
- Baixe em: https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html
- Ou use OpenJDK: https://adoptium.net/

### 2. Apache Maven
- Baixe em: https://maven.apache.org/download.cgi
- Extraia o arquivo ZIP
- Adicione o diretório `bin` do Maven ao PATH do sistema

#### Como adicionar Maven ao PATH no Windows:
1. Extraia o Maven (ex: `C:\apache-maven-3.9.5`)
2. Vá em "Configurações do Sistema" > "Variáveis de Ambiente"
3. Adicione `C:\apache-maven-3.9.5\bin` à variável PATH
4. Reinicie o terminal

### 3. Verificar Instalação
```bash
java -version
mvn -version
```

## Executar o Backend

Após instalar Java e Maven:

```bash
cd backend
mvn spring-boot:run
```

O servidor será iniciado em: http://localhost:8080

## Alternativa: Usar IDE

Se preferir, você pode:
1. Abrir o projeto backend em uma IDE como IntelliJ IDEA ou Eclipse
2. Importar como projeto Maven
3. Executar a classe `DoacaoBebeApplication.java`

## Testando a API

Após iniciar o backend, você pode testar:
- GET http://localhost:8080/api/usuarios
- POST http://localhost:8080/api/auth/login
- POST http://localhost:8080/api/auth/cadastro