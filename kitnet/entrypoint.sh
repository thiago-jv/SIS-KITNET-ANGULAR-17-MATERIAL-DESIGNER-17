#!/bin/sh
set -e
# If Docker secret is present, export it as environment variable before starting the app
if [ -f /run/secrets/db_password ]; then
  export SPRING_DATASOURCE_PASSWORD="$(cat /run/secrets/db_password)"
fi

# Fail fast: if password still not set, abort startup
if [ -z "${SPRING_DATASOURCE_PASSWORD:-}" ]; then
  echo "ERROR: SPRING_DATASOURCE_PASSWORD not set and /run/secrets/db_password not found. Aborting startup." >&2
  exit 1
fi

# Allow passing JVM opts via env var
if [ -n "$JAVA_OPTS" ]; then
  exec java $JAVA_OPTS -jar /app/app.jar
else
  exec java -Xms256m -Xmx512m -jar /app/app.jar
fi
