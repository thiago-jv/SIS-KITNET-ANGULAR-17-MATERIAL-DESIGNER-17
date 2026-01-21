#!/bin/sh
set -e
# If Docker secret is present, export it as environment variable before starting the app
if [ -f /run/secrets/db_password ]; then
  export SPRING_DATASOURCE_PASSWORD="$(cat /run/secrets/db_password)"
fi

exec java -jar /app/app.jar
