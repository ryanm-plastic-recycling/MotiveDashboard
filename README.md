# Transportation Dashboard

Production-ready starter for freight/logistics operations analytics built with Next.js App Router, TypeScript, Tailwind, Prisma/PostgreSQL, Recharts, Leaflet fallback mapping, TanStack Query/Table, and route-handler APIs with Zod validation.

## Prerequisites
- Node.js 20+
- pnpm 9+
- Docker + Docker Compose

## Quick setup
```bash
cp .env.example .env
./scripts/dev-bootstrap.sh
pnpm dev
```
Open http://localhost:3000/dashboard

## Manual setup
```bash
cp .env.example .env
docker compose up -d postgres
pnpm install
pnpm prisma generate
pnpm prisma migrate dev --name init
pnpm prisma db seed
pnpm dev
```

## Feature overview
- KPI cards: total, delivered, on-time %, avg cost/mile
- Sticky global filter bar + URL state sync (shareable links)
- Time-series and breakdown charts with click-to-filter
- Interactive map (Leaflet fallback by default) with route lines and bbox updates
- Sortable loads table + CSV export + row detail drawer
- Load details page (`/loads/[id]`)
- Saved view quick actions (localStorage)
- Dark mode persistence
- Optional auth with NextAuth credentials provider
- Observability hooks: lightweight logger + optional Sentry DSN wiring

## Environment variables
See `.env.example`:
- `DATABASE_URL`: Postgres connection
- `AUTH_ENABLED`: `true/false`
- `NEXTAUTH_SECRET`
- `DEMO_USER_EMAIL`, `DEMO_USER_PASSWORD`
- `MAPBOX_TOKEN` (optional; app still runs without it)
- `SENTRY_DSN` (optional)

## Auth
If `AUTH_ENABLED=false`, dashboard is open.
If `AUTH_ENABLED=true`, middleware protects `/dashboard` and `/loads/*`; sign in via NextAuth credentials using demo env vars.

## Exporting CSV
Use the **Export CSV** button in the table panel to export currently loaded rows.

## SQL scripts
Operational SQL references are in `sql/`:
- `00_extensions.sql` PostGIS extension
- `20_indexes.sql` query-driven indexes
- `30_views_materialized.sql` daily metrics materialized view + refresh note

## Testing
```bash
pnpm test
pnpm test:e2e
```

## Troubleshooting
- **Prisma migrate fails**: verify Docker Postgres is running and `DATABASE_URL` matches credentials.
- **Map tiles not rendering**: check internet access; Leaflet uses OpenStreetMap tile endpoint.
- **E2E test fails on startup**: run `pnpm dev` once manually and retry `pnpm test:e2e`.
- **Auth redirect loops**: ensure `NEXTAUTH_SECRET` is set and clear browser cookies.
