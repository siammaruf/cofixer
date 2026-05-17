#!/bin/sh
set -e

echo "Backend entrypoint starting..."

# Optional: Run database migrations if MIGRATE_ON_START=true
if [ "$MIGRATE_ON_START" = "true" ]; then
  echo "Running database migrations..."
  bun ./node_modules/typeorm/cli.js migration:run -d ./dist/config/db.config.js || {
    echo "Migration failed. Exiting."
    exit 1
  }
fi

echo "Starting backend server on port ${PORT:-3000}..."
exec bun dist/main.js
