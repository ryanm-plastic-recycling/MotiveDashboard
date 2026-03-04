#!/usr/bin/env bash
set -euo pipefail
cp -n .env.example .env || true
docker compose up -d postgres
pnpm install
pnpm prisma generate
pnpm prisma migrate dev --name init
pnpm prisma db seed
echo "Bootstrap complete. Run: pnpm dev"
