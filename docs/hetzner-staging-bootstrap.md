# Hetzner Staging Bootstrap

This guide starts from the exact state you described:

- Docker is installed
- user `badr` exists
- `/opt/miqatona/{staging,production,backups,scripts}` already exists
- staging is the only target for now

Production stays untouched on Vercel + Supabase.

## Goal

Boot a safe staging stack on the VPS:
- Next.js app in Docker
- Nginx in front of the app
- local PostgreSQL in Docker for migration rehearsal

The app runtime still uses Supabase-compatible envs for now. Local PostgreSQL is
there for import and validation, not for the live app cutover yet.

## 1. Host Prep

Install the basic packages we need:

```bash
sudo apt update
sudo apt install -y git curl ca-certificates openssl docker-compose-plugin
```

Make sure your user can run Docker without `sudo`:

```bash
sudo usermod -aG docker badr
newgrp docker
```

Your server currently has no swap. That can make Docker builds fail on a small VPS,
so add a simple 2 GB swap file now:

```bash
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
free -h
```

## 2. Verify Docker And Compose

Run:

```bash
docker --version
docker compose version
```

If `docker compose version` fails, install the Docker Compose plugin before going further.

## 3. Prepare The Staging Working Tree

Run:

```bash
mkdir -p /opt/miqatona/staging
cd /opt/miqatona/staging
git clone https://github.com/Mr-Badr/ar-clock.git current
cd current
```

After this, your code will live in:

```bash
/opt/miqatona/staging/current
```

## 4. Create The Real Staging Env File

Inside `/opt/miqatona/staging/current`:

```bash
cp infra/env/staging.env.example .env.staging
```

Open it:

```bash
nano .env.staging
```

Set these values correctly:

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_BASE_URL`
  Use a temporary staging host if you already have one, otherwise leave the placeholder for now.
- `REVALIDATE_SECRET`
  Generate one with:
  ```bash
  openssl rand -hex 32
  ```
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
  Leave empty unless you explicitly need admin/server operations in staging.
- `POSTGRES_PASSWORD`
  Set a strong password.

Safe first values:
- `NGINX_HTTP_PORT=8081`
- `POSTGRES_HOST_PORT=5433`
- `ENABLE_LIVE_GEO_DB=false`
- `LIVE_GEO_PROVIDER=supabase`

## 5. Build And Start Staging

Run:

```bash
docker compose --env-file .env.staging \
  -f infra/docker/compose.base.yml \
  -f infra/docker/compose.staging.yml \
  up -d --build
```

## 6. Verify Containers

Run:

```bash
docker compose --env-file .env.staging \
  -f infra/docker/compose.base.yml \
  -f infra/docker/compose.staging.yml \
  ps
```

You want to see:
- `app` healthy
- `nginx` healthy
- `postgres` healthy

Then check logs:

```bash
docker compose --env-file .env.staging \
  -f infra/docker/compose.base.yml \
  -f infra/docker/compose.staging.yml \
  logs -f app
```

In a second terminal:

```bash
docker compose --env-file .env.staging \
  -f infra/docker/compose.base.yml \
  -f infra/docker/compose.staging.yml \
  logs -f nginx
```

## 7. Test From The VPS Itself

Run:

```bash
curl -I http://127.0.0.1:8081
curl http://127.0.0.1:8081/api/health
curl -I http://127.0.0.1:8081/robots.txt
curl -I http://127.0.0.1:8081/sitemap-index.xml
```

Expected:
- homepage returns `200`
- `/api/health` returns JSON
- `robots.txt` is reachable
- `sitemap-index.xml` is reachable

Because this is staging, `X-Robots-Tag` should be `noindex, nofollow, noarchive`.

## 8. Test From Your Laptop Via SSH Tunnel

From your laptop:

```bash
ssh -L 8081:127.0.0.1:8081 badr@YOUR_SERVER_IP
```

Then open:

```text
http://localhost:8081
```

This is the safest first validation before public DNS and HTTPS.

## 9. Copy The Backup To The VPS

From your laptop:

```bash
scp /home/badr/backup.sql badr@YOUR_SERVER_IP:/opt/miqatona/backups/backup.sql
```

Then on the VPS:

```bash
ls -lh /opt/miqatona/backups/backup.sql
```

## 10. Import The Backup Into Staging PostgreSQL

Run on the VPS:

```bash
cd /opt/miqatona/staging/current
docker compose --env-file .env.staging \
  -f infra/docker/compose.base.yml \
  -f infra/docker/compose.staging.yml \
  exec -T postgres \
  psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" < /opt/miqatona/backups/backup.sql
```

If your shell does not expand the variables in that form, use explicit values from `.env.staging`:

```bash
docker compose --env-file .env.staging \
  -f infra/docker/compose.base.yml \
  -f infra/docker/compose.staging.yml \
  exec -T postgres \
  psql -U miqatona -d miqatona_staging < /opt/miqatona/backups/backup.sql
```

## 11. Inspect Database State

Run:

```bash
docker compose --env-file .env.staging \
  -f infra/docker/compose.base.yml \
  -f infra/docker/compose.staging.yml \
  exec postgres psql -U miqatona -d miqatona_staging -c '\dt'
```

Then check important tables and counts before any app-side database cutover work.

## 12. Useful Day-2 Commands

Stop staging:

```bash
docker compose --env-file .env.staging \
  -f infra/docker/compose.base.yml \
  -f infra/docker/compose.staging.yml \
  down
```

Restart staging:

```bash
docker compose --env-file .env.staging \
  -f infra/docker/compose.base.yml \
  -f infra/docker/compose.staging.yml \
  up -d
```

Rebuild after pulling code changes:

```bash
git pull
docker compose --env-file .env.staging \
  -f infra/docker/compose.base.yml \
  -f infra/docker/compose.staging.yml \
  up -d --build
```

Check live resource usage:

```bash
docker stats
free -h
df -h
```

## 13. What Not To Do Yet

Do not do these yet:
- do not point Cloudflare production DNS to this VPS
- do not replace Vercel production
- do not switch the app runtime from Supabase to local PostgreSQL yet
- do not expose staging publicly before you validate it locally and over SSH tunnel

## Recommended Next Step

Once staging boots successfully, send me:

- output of `docker compose ... ps`
- output of `curl http://127.0.0.1:8081/api/health`
- any error from `docker compose ... logs app`

Then we can do the next phase together: real staging boot verification and backup import.
