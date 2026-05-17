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

# Optional: Run database seeds if SEED_ON_START=true
if [ "$SEED_ON_START" = "true" ]; then
  echo "Running database seeds..."
  node dist/database/seeders/seed.helper.js || {
    echo "Seeding failed. Exiting."
    exit 1
  }
fi

echo "Starting backend server on port ${PORT:-3000}..."
exec bun dist/main.js
