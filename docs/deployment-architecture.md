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

## Why Supabase Still Exists In Staging And Production Templates

The app currently still loads Supabase clients in runtime code.

That means the safe current posture is:
- app runtime stays Supabase-compatible
- local PostgreSQL in staging is the migration rehearsal target

The PostgreSQL cutover should happen only after the provider layer is switched cleanly.

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
docker compose --env-file .env.staging \
  -f infra/docker/compose.base.yml \
  -f infra/docker/compose.staging.yml \
  exec -T postgres psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" < /opt/miqatona/backups/backup.sql
```

## Future Cloudflare And Zero-Downtime Path

The new structure is ready for:
- Cloudflare pointing staging and production hosts at separate Nginx listeners
- GitHub Actions building and pushing immutable images
- Nginx switching between app versions after health passes
- rollback by image tag instead of rebuild
