#!/bin/sh
set -e

echo "🚀 Iniciando Backend Node.js en puerto 3001..."
cd /app/server
npx prisma generate
npx prisma db push --skip-generate || true
npx tsx seed.ts || true
npx tsx src/index.ts &

echo "🌐 Iniciando Nginx en puerto 80..."
exec nginx -g "daemon off;"
