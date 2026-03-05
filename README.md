# Transportation Dashboard

Next.js + Prisma + Postgres dashboard for transportation/load operations. The app ships with demo seed data and now supports ingesting live data from Motive via API-key sync.

## Prerequisites

- Node.js 20+
- Docker + Docker Compose
- `pnpm` 10.30.3

## Required manual setup steps

```bash
corepack enable
corepack prepare pnpm@10.30.3 --activate
```

If install scripts are blocked:

```bash
pnpm approve-builds
```

## Environment setup

```bash
cp .env.example .env
```

### `.env` sections

- **DB**: `DATABASE_URL`
- **Auth/demo user**: `AUTH_ENABLED`, `NEXTAUTH_URL`, `NEXTAUTH_SECRET`, `DEMO_USER_EMAIL`, `DEMO_USER_PASSWORD`
- **Maps**: `NEXT_PUBLIC_MAPBOX_TOKEN` (optional)
- **Sentry**: `SENTRY_DSN`, `SENTRY_ENVIRONMENT`, `SENTRY_AUTH_TOKEN`, `SENTRY_ORG`, `SENTRY_PROJECT` (all optional)
- **Motive**: `MOTIVE_ENABLED`, `MOTIVE_BASE_URL`, `MOTIVE_API_KEY`, `MOTIVE_SYNC_LOOKBACK_DAYS`, `MOTIVE_PAGE_SIZE`

No Motive credentials are hardcoded; sync uses env vars only.

## DB bootstrap

```bash
docker compose up -d
pnpm install
pnpm db:migrate
pnpm db:seed
```

## Run app

```bash
pnpm dev
```

Open http://localhost:3000/dashboard

## Data sources

### Demo mode (default)
- Keep `MOTIVE_ENABLED=false`
- Use seeded data via `pnpm db:seed`

### Motive mode
1. Set in `.env`:
   - `MOTIVE_ENABLED=true`
   - `MOTIVE_API_KEY=<your key>`
2. Run sync:

```bash
pnpm motive:sync
```

The dashboard APIs continue to read from Postgres regardless of whether rows came from seed or Motive.

## Scripts

- `pnpm db:up` / `pnpm db:down`
- `pnpm db:migrate`
- `pnpm db:seed`
- `pnpm motive:sync`
- `pnpm test`
- `pnpm test:e2e`

## Accounts needed for optional integrations

- **Mapbox**: only if you want Mapbox token present (UI otherwise falls back to Leaflet/OSM)
- **Sentry**: only if you want error tracking
- **Motive**: required for live sync

## Troubleshooting

- **Leaflet tiles look broken/scattered**
  - Confirm `leaflet/dist/leaflet.css` is globally loaded.
  - Ensure global CSS includes: `.leaflet-container img { max-width: none !important; }`.
- **`pnpm` install blocked**
  - Run `pnpm approve-builds`.
- **Motive sync exits early**
  - Check `MOTIVE_ENABLED=true` and `MOTIVE_API_KEY`.
- **Auth redirect loops**
  - Set `NEXTAUTH_URL` and `NEXTAUTH_SECRET`, then clear cookies.
