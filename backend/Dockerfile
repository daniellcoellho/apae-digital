# ---- Etapa 1: build (JDK 21 + Maven) ----
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app

# Cache de dependencias: copia so o pom primeiro
COPY pom.xml .
RUN mvn -B dependency:go-offline

# Copia o codigo e empacota (sem rodar testes aqui; testes rodam em etapa/CI dedicada)
COPY src ./src
RUN mvn -B clean package -DskipTests

# ---- Etapa 2: runtime (apenas JRE 21) ----
FROM eclipse-temurin:21-jre-alpine AS runtime
WORKDIR /app

# Usuario nao-root. Cria o diretorio de uploads ja com dono "app":
# um volume nomeado novo herda o dono/representacao desse mountpoint da imagem.
RUN addgroup -S app && adduser -S app -G app \
    && mkdir -p /app/uploads \
    && chown -R app:app /app/uploads
USER app

COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080
# Sem perfil fixo: o banco vem de DB_URL/DB_USER/DB_PASSWORD (perfil default).
# O docker-compose local ativa o perfil "docker" explicitamente.
# JVM ajustada para instancias pequenas (512 MB, CPU fracionada) de planos gratuitos:
# heap limitado a 300 MB (sobra para metaspace/threads), GC serial e JIT C1 para subir mais rapido.
ENV JAVA_TOOL_OPTIONS="-XX:+UseSerialGC -XX:TieredStopAtLevel=1 -Xss512k"
ENTRYPOINT ["java", "-Xmx300m", "-jar", "app.jar"]
