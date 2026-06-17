# =============================================================
# STAGE 1 — Build com Maven + Java 17
# =============================================================
FROM maven:3.9.6-eclipse-temurin-17 AS build

WORKDIR /app

# Copia o pom.xml primeiro para aproveitar cache de dependências
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copia o restante do código e gera o JAR
COPY src ./src
RUN mvn clean package -DskipTests -B

# =============================================================
# STAGE 2 — Runtime com OpenJDK 17 Slim
# =============================================================
FROM eclipse-temurin:17-jre-jammy

WORKDIR /app

# Copia apenas o JAR gerado no stage anterior
COPY --from=build /app/target/*.jar app.jar

# Expõe a porta padrão (o Render sobrescreve via variável PORT)
EXPOSE 8080

# Inicia a aplicação
ENTRYPOINT ["java", "-jar", "app.jar"]
