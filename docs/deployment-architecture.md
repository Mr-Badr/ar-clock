# Deployment Architecture

This is the cleaned deployment layout for local development, VPS staging, and
future VPS production.

Current live production remains unchanged:
- frontend stays on Vercel
- database stays on Supabase
- Cloudflare keeps serving the live domain

## Canonical File Layout

Env templates:
- `.env.local.example`
- `infra/env/staging.env.example`
- `infra/env/production.env.example`

Shared infra:
- `Dockerfile`
- `infra/docker/compose.base.yml`
- `infra/docker/compose.staging.yml`
- `infra/docker/compose.production.yml`
- `infra/nginx/nginx.conf`
- `infra/nginx/templates/site.conf.template`
- `infra/nginx/snippets/*`
- `infra/postgres/init/001_geo_schema.sql`
- `prisma/schema.prisma`
- `scripts/extract-geo-import.sh`

This removes the old duplicated `compose.hetzner.yml`, `docker-compose.staging.yml`,
and Caddy-specific files.

## Environment Model

Use one codebase and three real env files:
- local: `.env.local`
- staging: `.env.staging`
- production: `.env.production`

Rules:
- keep real env files out of Git
- keep env files at the repo root on the server
- use the same Dockerfile everywhere
- switch environment behavior through config only

## VPS Folder Strategy

Recommended host layout:

```text
/opt/miqatona
├── .repo/
│   └── ar-clock.git
├── staging/
│   ├── current/
│   └── shared/
│       └── env/
│           └── .env.staging
├── production/
│   ├── current/
│   └── shared/
│       └── env/
│           └── .env.production
├── backups/
│   └── backup.sql
└── scripts/
```

Recommended Git strategy:
- one bare repo in `/opt/miqatona/.repo/ar-clock.git`
- one worktree for staging
- one worktree for production later

That keeps one source of truth and avoids duplicate clones.

## Container Architecture

Shared base stack:
- `app`: Next.js standalone runtime
- `nginx`: reverse proxy, canonical host handling, static caching, and health endpoint

Staging override:
- adds local `postgres`
- keeps staging behind Nginx on a localhost high port
- sets `X-Robots-Tag: noindex, nofollow, noarchive`

Production override:
- keeps Nginx in front of the app
- keeps runtime on Supabase until the database cutover is explicitly done
- is ready to move from a localhost high port to public port `80`

Networks:
- `edge`: host-facing reverse-proxy side
- `backend`: private internal network for Nginx, app, and database traffic

## Runtime Provider Strategy

The geo data layer now supports two runtime providers:
- `supabase`
- `postgres`

Safe first posture:
- keep `ENABLE_LIVE_GEO_DB=false`
- keep `LIVE_GEO_PROVIDER=supabase`
- boot staging and validate Docker, Nginx, and app health first

After the staging PostgreSQL import succeeds:
- set `ENABLE_LIVE_GEO_DB=true`
- set `LIVE_GEO_PROVIDER=postgres`
- restart the staging stack

This lets one codebase move from Supabase to self-hosted PostgreSQL through env
configuration instead of code duplication.

## App Database Scope

The backup from Supabase is a full platform dump, but the app-owned schema we
should move into Docker Postgres first is the `public` geo schema:
- `public.countries`
- `public.cities`
- their sequences, constraints, and indexes

The repo now includes:
- `infra/postgres/init/001_geo_schema.sql` for first-run Postgres initialization
- `prisma/schema.prisma` for the app-owned relational model
- `prisma.config.ts` for Prisma 7 CLI configuration
- `scripts/extract-geo-import.sh` to extract app-only data from the full Supabase dump

Important:
- do not import the entire Supabase dump directly into plain Docker Postgres
- Supabase-specific schemas like `auth`, `storage`, and `realtime` are not the first migration target
- the original `find_nearest_cities` RPC is not present in the dump, so the Postgres provider now replaces it with a direct nearest-city SQL query

## Database URL Split

Use two connection URLs:
- `DATABASE_URL`: app runtime inside Docker
- `PRISMA_DATABASE_URL`: Prisma CLI from the host or VPS shell

Example in staging:
- `DATABASE_URL=postgresql://miqatona:...@postgres:5432/miqatona_staging`
- `PRISMA_DATABASE_URL=postgresql://miqatona:...@127.0.0.1:5433/miqatona_staging`

This is the cleanest setup because the app talks over the Docker network while
host-side Prisma commands use the published localhost port.

## Commands

Create real env files:

```bash
cp .env.local.example .env.local
cp infra/env/staging.env.example .env.staging
cp infra/env/production.env.example .env.production
```

Local development:

```bash
npm run dev
```

Staging:

```bash
docker compose --env-file .env.staging \
  -f infra/docker/compose.base.yml \
  -f infra/docker/compose.staging.yml \
  up -d --build
```

Production on VPS later:

```bash
docker compose --env-file .env.production \
  -f infra/docker/compose.base.yml \
  -f infra/docker/compose.production.yml \
  up -d --build
```

## PostgreSQL Rehearsal In Staging

Once staging is up:

```bash
./scripts/extract-geo-import.sh /opt/miqatona/backups/backup.sql /opt/miqatona/backups/geo-import.sql
docker compose --env-file .env.staging \
  -f infra/docker/compose.base.yml \
  -f infra/docker/compose.staging.yml \
  exec -T postgres psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" < /opt/miqatona/backups/geo-import.sql
```

Then switch staging to local PostgreSQL:

```bash
nano .env.staging
```

Set:

```bash
ENABLE_LIVE_GEO_DB=true
LIVE_GEO_PROVIDER=postgres
```

Restart:

```bash
docker compose --env-file .env.staging \
  -f infra/docker/compose.base.yml \
  -f infra/docker/compose.staging.yml \
  up -d
```

## Future Cloudflare And Zero-Downtime Path

The new structure is ready for:
- Cloudflare pointing staging and production hosts at separate Nginx listeners
- GitHub Actions building and pushing immutable images
- Nginx switching between app versions after health passes
- rollback by image tag instead of rebuild
