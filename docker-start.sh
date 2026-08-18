#!/bin/sh

export DATABASE_URL="${DATABASE_URL:-postgresql://postgres:postgrespassword@localhost:5432/defensoria_db?schema=public}"

echo "🚀 Starting Node.js Backend Server on port 3001..."
echo "📊 Database URL configured: $DATABASE_URL"

(
  cd /app/server
  echo "📦 Initializing Prisma client & schema..."
  ./node_modules/.bin/prisma generate || true

  echo "💾 Applying database schema..."
  ./node_modules/.bin/prisma db push --skip-generate || true

  echo "🌱 Seeding initial users and historical data..."
  ./node_modules/.bin/tsx prisma/seed.ts || true

  echo "⚡ Starting Express server..."
  ./node_modules/.bin/tsx src/index.ts
) &

echo "🌐 Starting Nginx Web Server on port 80..."
exec nginx -g "daemon off;"
