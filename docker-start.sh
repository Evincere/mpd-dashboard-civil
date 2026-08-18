#!/bin/sh

echo "🚀 Starting Node.js Backend Server on port 3001..."

# Run database setup non-blocking in background so Nginx starts immediately
(
  cd /app/server
  echo "📦 Initializing Prisma client & schema..."
  npx prisma generate || true
  
  if [ -n "$DATABASE_URL" ]; then
    echo "💾 Applying database schema to PostgreSQL..."
    npx prisma db push --skip-generate || true
    npx tsx seed.ts || true
  else
    echo "⚠️ DATABASE_URL not defined. Skipping DB migrations."
  fi

  echo "⚡ Starting Express server..."
  npx tsx src/index.ts
) &

echo "🌐 Starting Nginx Web Server on port 80..."
exec nginx -g "daemon off;"
