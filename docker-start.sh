#!/bin/sh

echo "🚀 Starting Node.js Backend Server on port 3001..."

# Run database setup non-blocking in background so Nginx starts immediately
(
  cd /app/server
  echo "📦 Initializing Prisma client & schema..."
  ./node_modules/.bin/prisma generate || true
  
  if [ -n "$DATABASE_URL" ]; then
    echo "💾 Applying database schema to PostgreSQL..."
    ./node_modules/.bin/prisma db push --skip-generate || true
    ./node_modules/.bin/tsx seed.ts || true
  else
    echo "⚠️ DATABASE_URL not defined. Skipping DB migrations."
  fi

  echo "⚡ Starting Express server..."
  ./node_modules/.bin/tsx src/index.ts
) &

echo "🌐 Starting Nginx Web Server on port 80..."
exec nginx -g "daemon off;"
