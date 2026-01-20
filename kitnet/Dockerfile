FROM openjdk:17-jdk-slim

WORKDIR /app

# Copia o JAR gerado (finalName definido como kitnet-backend)
COPY target/kitnet-backend.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
