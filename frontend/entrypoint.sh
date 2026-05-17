#!/bin/sh
set -e

echo "Frontend entrypoint starting..."

echo "Starting frontend server on port ${PORT:-3000}..."
exec ./node_modules/.bin/react-router-serve ./build/server/index.js
