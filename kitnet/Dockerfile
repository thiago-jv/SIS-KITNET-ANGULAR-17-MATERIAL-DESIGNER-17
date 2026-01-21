FROM eclipse-temurin:17-jdk-jammy

WORKDIR /app

# Copia o JAR gerado (finalName definido como kitnet-backend)
COPY target/kitnet-backend.jar app.jar

# copy entrypoint that will load secrets at runtime
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 8080

ENTRYPOINT ["/entrypoint.sh"]
