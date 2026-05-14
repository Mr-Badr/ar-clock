# Production Blue/Green Deploy Runbook

This file is the current source of truth for how Miqatona production deploys are done safely on the VPS.

## Purpose

Use this runbook when we want to move new code to production without breaking the live site.

Goals:
- verify staging first
- start green without touching blue
- test green directly before public cutover
- switch nginx only after green is healthy
- keep blue alive as a rollback target

## Current production model

- `staging`
  - app container: `docker-app-1`
  - app port: `3000`
- `production blue`
  - app container: `miqatona-prod-blue`
  - app port: `3010`
- `production green`
  - app container: `miqatona-prod-green`
  - app port: `3020`
- nginx upstream switch
  - file: `/etc/nginx/sites-available/miqatona.conf`
  - active upstream name: `miqatona_active`

## Before every deploy

Check these first:

```bash
docker ps --format "table {{.Names}}\t{{.Image}}\t{{.Ports}}\t{{.Status}}"
curl -sS http://127.0.0.1:3000/api/health?full=1
curl -sS http://127.0.0.1:3010/api/health?full=1
curl -sS http://127.0.0.1:3020/api/health?full=1
```

What we want to see:
- staging is healthy
- the currently live production target is healthy
- if green is down, that is fine before deploy

Important:
- the `version` field in `/api/health` comes from runtime env and can lag behind the real code image
- do not trust that field alone as proof of what code is live

## Step 1: confirm the staging image is the one we want

```bash
docker inspect docker-app-1 --format '{{.Config.Image}}'
curl -sS http://127.0.0.1:3000/api/health?full=1
```

What we want to see:
- staging image is the expected GHCR image
- staging health returns `ok: true`

## Step 2: handle GHCR tag reality

If `ghcr.io/mr-badr/ar-clock:prod` exists and pulls successfully, use it.

```bash
docker pull ghcr.io/mr-badr/ar-clock:prod
```

If GHCR does not provide `:prod`, use the currently verified staging image as the safe promotion source:

```bash
docker tag ghcr.io/mr-badr/ar-clock:staging ghcr.io/mr-badr/ar-clock:prod
docker image ls ghcr.io/mr-badr/ar-clock
```

What we want to see:
- `:prod` and `:staging` point to the same image ID when we intentionally promote staging

## Step 3: start green

```bash
cd /opt/miqatona/infra/docker/production
docker compose --env-file /opt/miqatona/env/production.env -f compose.base.yml -f compose.green.yml up -d app_green
```

What we want to see:
- `miqatona-prod-green` starts
- production Postgres stays healthy

## Step 4: verify green before public cutover

```bash
docker ps --format "table {{.Names}}\t{{.Image}}\t{{.Ports}}\t{{.Status}}" | grep miqatona-prod-green
docker logs --tail 100 miqatona-prod-green
curl -sS http://127.0.0.1:3020/api/health?full=1
curl -I -sS http://127.0.0.1:3020/
curl -I -sS http://127.0.0.1:3020/holidays/kuwait-national-day
curl -I -sS http://127.0.0.1:3020/holidays/hajj-season
curl -I -sS http://127.0.0.1:3020/time-now/libya
curl -I -sS http://127.0.0.1:3020/time-now/egypt/suez/opengraph-image
```

What we want to see:
- health returns `ok: true`
- event page returns `200`
- known SEO-sensitive holiday page returns `200`
- known old `too big header` route returns `200`
- known old OG-image route returns `200`

Stop here if any of these fail.

## Step 5: switch nginx to green

Edit the active upstream:

```bash
sudo nano /etc/nginx/sites-available/miqatona.conf
```

Change:

```nginx
upstream miqatona_active {
    server 127.0.0.1:3010;
}
```

To:

```nginx
upstream miqatona_active {
    server 127.0.0.1:3020;
}
```

Then validate and reload:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

Do not reload if `nginx -t` fails.

## Step 6: verify the public site immediately

```bash
curl -I -sS https://miqatona.com/
curl -I -sS https://miqatona.com/holidays/kuwait-national-day
curl -I -sS https://miqatona.com/holidays/hajj-season
curl -I -sS https://miqatona.com/time-now/libya
curl -I -sS https://miqatona.com/time-now/egypt/suez/opengraph-image
curl -I -sS https://miqatona.com/ads.txt
sudo tail -n 50 /var/log/nginx/error.log
```

What we want to see:
- public pages return `200`
- `ads.txt` returns `200`
- no fresh `upstream sent too big header` for the tested routes
- no fresh `upstream prematurely closed connection` for the tested OG-image routes

Important log reading rule:
- old error lines can stay in the file
- focus on new timestamps after the cutover
- focus on upstream port
  - old blue-era errors mention `127.0.0.1:3010`
  - new green-era errors mention `127.0.0.1:3020`

## Step 7: rollback if needed

If public verification fails:

1. edit nginx again
2. point `miqatona_active` back to `127.0.0.1:3010`
3. validate nginx
4. reload nginx

```bash
sudo nano /etc/nginx/sites-available/miqatona.conf
sudo nginx -t
sudo systemctl reload nginx
```

Blue should stay alive until green has proven stable.

## After a stable cutover

Do these next:

```bash
curl -sS http://127.0.0.1:3020/api/health?full=1
sudo tail -n 100 /var/log/nginx/error.log
```

Then decide whether to:
- keep blue alive for a short safety window
- stop blue
- recreate blue later from the same known-good image

## SEO-sensitive smoke routes

Use these routes after deploy because they previously exposed real production problems:

```bash
curl -I -sS https://miqatona.com/holidays/hajj-season
curl -I -sS https://miqatona.com/holidays/independence-day-morocco
curl -I -sS https://miqatona.com/time-now/libya
curl -I -sS https://miqatona.com/time-now/egypt/suez/opengraph-image
curl -I -sS https://miqatona.com/holidays/kuwait-national-day/opengraph-image
```

## Known lessons from the May 14, 2026 cutover

- GHCR did not provide `ghcr.io/mr-badr/ar-clock:prod`
- safe local promotion from `:staging` to `:prod` worked
- green started correctly on `3020`
- nginx switch to green succeeded
- the old repeated Open-Meteo `Link` header disappeared after the new build went live
- a fresh green-era OG-image error still appeared for `/time-now/yemen/aden/opengraph-image`, so OG-image monitoring must continue after each deploy
