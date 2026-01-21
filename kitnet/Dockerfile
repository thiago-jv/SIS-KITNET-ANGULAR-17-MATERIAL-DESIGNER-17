FROM eclipse-temurin:17-jdk-jammy

# Create non-root user
RUN addgroup --system appgroup && adduser --system --ingroup appgroup appuser

WORKDIR /app

# Copia o JAR gerado (finalName definido como kitnet-backend)
COPY target/kitnet-backend.jar app.jar

# copy entrypoint that will load secrets at runtime
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh && chown appuser:appgroup /app/app.jar /entrypoint.sh

USER appuser

EXPOSE 8089

ENTRYPOINT ["/entrypoint.sh"]
