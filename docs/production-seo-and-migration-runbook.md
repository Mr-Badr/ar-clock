# Production SEO And Migration Runbook

This runbook is the safe bridge between the current live setup and the future VPS move.

Current live posture:
- Keep `Vercel + Supabase` as the active production stack.
- Keep `https://miqatona.com` as the only canonical host.
- Keep `https://miqatona.com/sitemap-index.xml` as the main Search Console submission.
- Do not switch the runtime database layer yet.
- Use the new live-geo provider bridge so future DB work changes one provider instead of many app files.

## Current Safe State

What stays unchanged right now:
- The app still reads the same Supabase environment variables.
- The live SEO model still uses the same canonical URLs, robots rules, and sitemap routes.
- Docker and PostgreSQL files added in this repo are only preparation files. They do nothing until you explicitly use them.
- The geo query layer still behaves the same in production, but direct live DB access is now centralized behind one provider bridge.

## Architecture Notes For The Future Migration

Current safe architecture:
- Public SEO pages are mostly snapshot-first and cache-first.
- Optional live geo DB reads are behind `ENABLE_LIVE_GEO_DB`.
- The live geo provider name is exposed by `/api/health`.
- The current provider is still `supabase`.

Why this matters:
- The app no longer needs database-specific logic spread across multiple feature files.
- When you later move to PostgreSQL on Hetzner, the goal is to swap the provider implementation instead of rewriting page code.
- SEO-critical routes, metadata, robots, and sitemap generation stay independent from the hosting move.

## Live SEO Audit

Run this against production after deploys:

```bash
npm run seo:audit:live
```

Useful variants:

```bash
npm run seo:audit -- --base=https://miqatona.com --limit=50
npm run seo:audit -- --base=https://miqatona.com --out=reports/seo-audit/live.json
```

What the audit checks:
- `robots.txt` is reachable and references `/sitemap-index.xml`
- the root sitemap index is reachable
- every child sitemap listed in the root index is reachable
- sitemap URLs resolve on the live canonical host
- audited pages return `200`
- audited pages expose a canonical tag
- canonical tags match the final live URL
- pages are not accidentally marked `noindex`
- pages include a `<title>` and meta description

Recommended workflow:
1. Deploy.
2. Run the live audit.
3. Fix any `http-*`, `canonical-mismatch`, `missing-canonical`, or `meta-noindex` findings first.
4. Only after that submit or revalidate in Search Console.

## Search Console Steady-State

Recommended long-term submission:
- `https://miqatona.com/sitemap-index.xml`

Temporary diagnostic submissions only if needed:
- `https://miqatona.com/sitemap.xml`
- `https://miqatona.com/calculators/sitemap.xml`
- `https://miqatona.com/economie/sitemap.xml`
- `https://miqatona.com/holidays/sitemap.xml`
- `https://miqatona.com/time-difference/sitemap.xml`
- `https://miqatona.com/time-now/sitemap.xml`
- `https://miqatona.com/mwaqit-al-salat/sitemap.xml`
- `https://miqatona.com/date/sitemaps/static`
- `https://miqatona.com/date/sitemaps/countries`
- `https://miqatona.com/date/sitemaps/calendars`

Do not treat these as primary submissions:
- `/date/gregorian/sitemap.xml`
- `/date/hijri/sitemap.xml`

Those are intentionally not the main submitted URL sets in bridge mode.

## Cloudflare While Still On Vercel

Safe settings while Vercel stays the origin:
- Keep DNS records as `DNS only` unless you deliberately move proxying in front of Vercel later.
- Keep SSL mode at `Full (strict)`.
- Keep `Always Use HTTPS` enabled.
- Keep Brotli/compression enabled.
- Do not add Cloudflare HTML caching or APO in front of Vercel right now.

Safe settings when Hetzner becomes the origin later:
- Keep proxying simple during cutover.
- Prefer `DNS only` first while validating the new origin.
- Re-enable proxying only after HTTPS, redirects, and sitemap URLs are confirmed.

## Docker And Hetzner Bridge

The repo now includes:
- [Dockerfile](../Dockerfile)
- [.dockerignore](../.dockerignore)
- [.env.local.example](../.env.local.example)
- [infra/env/staging.env.example](../infra/env/staging.env.example)
- [infra/env/production.env.example](../infra/env/production.env.example)
- [infra/docker/compose.base.yml](../infra/docker/compose.base.yml)
- [infra/docker/compose.staging.yml](../infra/docker/compose.staging.yml)
- [infra/docker/compose.production.yml](../infra/docker/compose.production.yml)
- [infra/nginx/nginx.conf](../infra/nginx/nginx.conf)
- [infra/nginx/templates/site.conf.template](../infra/nginx/templates/site.conf.template)
- [docs/deployment-architecture.md](./deployment-architecture.md)

Important:
- These files are `opt-in`.
- They do not change the current live environment.
- The staging `postgres` container is only a preparation step for later.
- The current app still expects Supabase credentials in production unless you intentionally migrate the query layer.
- `nginx` is now the reverse-proxy layer for the VPS path.

### Docker build

Standalone Docker build is enabled only when `NEXT_OUTPUT_MODE=standalone` is set.

Example:

```bash
docker build --build-arg NEXT_OUTPUT_MODE=standalone -t miqatona-app .
```

### Hetzner compose boot

Copy the env template first:

```bash
cp infra/env/production.env.example .env.production
```

App plus Nginx, still using Supabase:

```bash
docker compose --env-file .env.production \
  -f infra/docker/compose.base.yml \
  -f infra/docker/compose.production.yml \
  up -d --build
```

App plus local PostgreSQL container for staging the next phase:

```bash
docker compose --env-file .env.staging \
  -f infra/docker/compose.base.yml \
  -f infra/docker/compose.staging.yml \
  up -d --build
```

## Hetzner VPS Checklist

### 1. Provision the server

- Create an Ubuntu 24.04 VPS in Hetzner Cloud.
- Attach an SSH key during server creation.
- Allocate a floating IP if you want easier rollback later.
- Point a temporary preview subdomain first if you want a safer dress rehearsal.

### 2. Harden the host

Run these basics before app deployment:

```bash
apt update && apt upgrade -y
apt install -y curl git ufw fail2ban ca-certificates
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable
```

Recommended:
- create a non-root deploy user
- disable password SSH logins
- keep automatic security updates enabled

### 3. Install Docker and Compose

Use Docker's official repository, then verify:

```bash
docker --version
docker compose version
```

### 4. Prepare the app directory

Recommended server path:

```bash
mkdir -p /opt/miqatona/production
cd /opt/miqatona/production
git clone <your-repo-url> current
cd current
cp infra/env/production.env.example .env.production
```

### 5. Fill `.env.production`

Before first boot, set:
- `NEXT_PUBLIC_SITE_URL=https://miqatona.com`
- `NEXT_PUBLIC_BASE_URL=https://miqatona.com`
- `NGINX_SERVER_NAME=miqatona.com www.miqatona.com`
- `NGINX_CANONICAL_HOST=miqatona.com`
- current live Supabase keys
- `REVALIDATE_SECRET`
- any analytics/ads values you actively use

Do not switch `DATABASE_URL` yet.

### 6. First boot on Hetzner

Start with the current working architecture:

```bash
docker compose --env-file .env.production \
  -f infra/docker/compose.base.yml \
  -f infra/docker/compose.production.yml \
  up -d --build
```

Then verify:

```bash
curl -I https://miqatona.com
curl -L https://miqatona.com/api/health
curl -L https://miqatona.com/robots.txt
curl -L https://miqatona.com/sitemap-index.xml
```

### 7. Production validation before traffic cutover

Check these manually:
- homepage loads
- `/mwaqit-al-salat`
- `/time-now`
- `/time-difference`
- `/holidays`
- key city pages
- search dialog works
- `robots.txt` is correct
- sitemap index is correct
- canonical URLs still point to `https://miqatona.com`
- `www` redirects to apex correctly

Then run:

```bash
npm run seo:audit:live
```

### 8. DNS cutover

When Hetzner is ready:
- update the apex `A` record to the Hetzner IP
- update `www` to point to the same origin or redirect through DNS/proxy policy
- lower DNS TTL before the cutover window if possible
- keep Vercel live until the new origin is fully healthy

### 9. Rollback plan

Keep rollback simple:
- do not delete the Vercel project during cutover
- keep old env values intact
- keep the previous DNS target recorded
- if critical issues appear, point DNS back to Vercel immediately

## Database Migration Plan

Current state:
- Supabase remains the production database path.
- The app is prepared for a provider swap later, but no runtime DB migration is active yet.

Recommended future DB migration:
1. Keep the app running on Supabase while you provision PostgreSQL on Hetzner.
2. Export schema and data from Supabase.
3. Restore them into PostgreSQL.
4. Build and test a PostgreSQL provider implementation behind the same live-geo bridge.
5. Run parity checks between Supabase and PostgreSQL responses.
6. Switch only after parity is confirmed.

Important:
- do not change route behavior during the DB migration
- do not change canonical URLs
- do not change sitemap structure
- do not mix DB migration and hosting cutover in one risky step unless you already validated both separately

## Observability And Operations

On Hetzner, monitor at least:
- container restarts
- memory pressure
- disk usage
- TLS state in the Nginx or edge layer you place in front of the app later
- app health via `/api/health`
- response times on sitemap and top landing pages

Useful commands:

```bash
docker compose --env-file .env.production -f infra/docker/compose.base.yml -f infra/docker/compose.production.yml ps
docker compose --env-file .env.production -f infra/docker/compose.base.yml -f infra/docker/compose.production.yml logs -f app
docker compose --env-file .env.production -f infra/docker/compose.base.yml -f infra/docker/compose.production.yml logs -f nginx
docker stats
```

Backup notes for the later PostgreSQL phase:
- enable regular logical dumps
- test restore, not just backup creation
- keep at least one off-server backup copy

## Zero-Downtime Migration Path

Phase 1:
- Keep Vercel live.
- Deploy a mirror copy on Hetzner using the same public domain settings and the same Supabase credentials.
- Confirm `/api/health`, `/robots.txt`, `/sitemap-index.xml`, and key pages match.

Phase 2:
- Put the Hetzner app behind Nginx.
- Keep `NEXT_PUBLIC_SITE_URL=https://miqatona.com`.
- Keep the same `www -> apex` redirect behavior.
- Keep the same sitemap and robots URLs.

Phase 3:
- Prepare PostgreSQL data on the server.
- Add or migrate an app-side database adapter only after data parity is confirmed.
- Switch traffic only after SEO and indexability checks pass on the new origin.

Phase 4:
- Re-run `npm run seo:audit:live`
- Re-check Google Search Console coverage and structured data
- Monitor 5xx, slow pages, and crawl issues after cutover

## Migration Rules That Protect SEO

Never change these during the hosting migration:
- canonical URLs
- public route structure
- sitemap URLs
- robots rules
- `www` redirect behavior
- Arabic page titles and metadata strategy
- published event slugs
- country and city slug format
- Search Console property and verification setup

If hosting changes but URLs stay the same, Google should treat it as a hosting migration, not a site move.
