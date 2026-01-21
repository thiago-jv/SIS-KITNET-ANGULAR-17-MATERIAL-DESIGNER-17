#!/bin/sh
set -e
# If Docker secret is present, export it as environment variable before starting the app
if [ -f /run/secrets/db_password ]; then
  export SPRING_DATASOURCE_PASSWORD="$(cat /run/secrets/db_password)"
fi

# Allow passing JVM opts via env var
if [ -n "$JAVA_OPTS" ]; then
  exec java $JAVA_OPTS -jar /app/app.jar
else
  exec java -Xms256m -Xmx512m -jar /app/app.jar
fi
