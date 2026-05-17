#!/bin/sh
set -e

echo "Frontend entrypoint starting..."

echo "Starting frontend server on port ${PORT:-3000}..."
exec bun run start
