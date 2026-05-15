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

## Important architecture note

There are two nginx worlds on the VPS and they are not the same thing:

- repo-managed docker nginx examples
  - path: `/opt/miqatona/infra/nginx/...`
  - these are reference files inside the repo checkout
  - editing them does not automatically change the live public site
- live system nginx
  - path: `/etc/nginx/...`
  - this is what actually serves `https://miqatona.com`
  - this is the config that matters for public production cutover

If `nginx -T` shows `/etc/nginx/sites-enabled/...`, treat `/etc/nginx/...` as the real source of truth for the live site.

## Decide the active and inactive slot first

Before every deploy, find which production slot is live right now.

```bash
sudo grep -n "upstream miqatona_active" -A 2 /etc/nginx/sites-available/miqatona.conf
curl -sS http://127.0.0.1:3010/api/health
curl -sS http://127.0.0.1:3020/api/health
```

How to read it:

- if `miqatona_active` points to `127.0.0.1:3010`
  - blue is active
  - green is inactive
  - deploy the new build to green on `3020`
- if `miqatona_active` points to `127.0.0.1:3020`
  - green is active
  - blue is inactive
  - deploy the new build to blue on `3010`

Use these names throughout the deploy:

- `ACTIVE_SLOT`
  - the slot currently receiving public traffic
- `INACTIVE_SLOT`
  - the safe slot where we start the new build first
- `ACTIVE_PORT`
  - `3010` or `3020`
- `INACTIVE_PORT`
  - the other production port

This runbook is about switching traffic from `ACTIVE_SLOT` to `INACTIVE_SLOT` only after direct smoke tests pass.

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

## Step 3: start the inactive slot

Choose the right compose file based on which slot is inactive.

If green is inactive:

```bash
cd /opt/miqatona/infra/docker/production
docker compose --env-file /opt/miqatona/env/production.env -f compose.base.yml -f compose.green.yml up -d app_green
```

If blue is inactive:

```bash
cd /opt/miqatona/infra/docker/production
docker compose --env-file /opt/miqatona/env/production.env -f compose.base.yml -f compose.blue.yml up -d app_blue
```

What we want to see:
- the inactive container starts
- production Postgres stays healthy

## Step 4: verify the inactive slot before public cutover

If green is inactive, test `3020`:

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

If blue is inactive, test `3010`:

```bash
docker ps --format "table {{.Names}}\t{{.Image}}\t{{.Ports}}\t{{.Status}}" | grep miqatona-prod-blue
docker logs --tail 100 miqatona-prod-blue
curl -sS http://127.0.0.1:3010/api/health?full=1
curl -I -sS http://127.0.0.1:3010/
curl -I -sS http://127.0.0.1:3010/holidays/kuwait-national-day
curl -I -sS http://127.0.0.1:3010/holidays/hajj-season
curl -I -sS http://127.0.0.1:3010/time-now/libya
curl -I -sS http://127.0.0.1:3010/time-now/egypt/suez/opengraph-image
```

What we want to see:
- health returns `ok: true`
- event page returns `200`
- known SEO-sensitive holiday page returns `200`
- known old `too big header` route returns `200`
- known old OG-image route returns `200`

Stop here if any of these fail.

## Step 5: switch nginx to the inactive slot

Edit the active upstream:

```bash
sudo nano /etc/nginx/sites-available/miqatona.conf
```

If blue is active and green is ready, change:

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

If green is active and blue is ready, change the other direction:

```nginx
upstream miqatona_active {
    server 127.0.0.1:3020;
}
```

To:

```nginx
upstream miqatona_active {
    server 127.0.0.1:3010;
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
2. point `miqatona_active` back to the previously active port
3. validate nginx
4. reload nginx

```bash
sudo nano /etc/nginx/sites-available/miqatona.conf
sudo nginx -t
sudo systemctl reload nginx
```

The previously active slot should stay alive until the new slot has proven stable.

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

## OG-image rules for production nginx

These URLs are crawled by Google because they are declared in page metadata:

- `openGraph.images`
- `twitter.images`

So Google did not invent those image URLs randomly. We published them, and Google later retried them after earlier `5xx` responses.

Production nginx should treat OG-image routes specially:

- long read timeout
- no indexing
- same upstream slot as the parent page
- never route staging OG traffic into production

Target shape for the live nginx `location ~* /opengraph-image` block:

If your live config includes `/etc/nginx/snippets/proxy-common.conf` and that snippet already sets `proxy_read_timeout` / `proxy_send_timeout`, do not repeat those directives in the same `location` block or `nginx -t` will fail with a duplicate-directive error.

In that common setup, the safest production OG block is a dedicated inline block like this:

```nginx
location ~* /opengraph-image {
    proxy_pass http://miqatona_active;

    proxy_http_version 1.1;

    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header X-Forwarded-Host $host;

    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection $connection_upgrade;

    proxy_buffer_size 128k;
    proxy_buffers 8 128k;
    proxy_connect_timeout 10s;
    proxy_buffering off;
    proxy_request_buffering off;
    proxy_redirect off;
    gzip off;

    add_header X-Robots-Tag "noindex, nofollow, noarchive" always;

    proxy_read_timeout 120s;
    proxy_send_timeout 120s;
}
```

After changing production nginx, always run:

```bash
sudo nginx -t
sudo systemctl reload nginx
curl -I -sS https://miqatona.com/time-now/egypt/suez/opengraph-image
```

What we want to see:

- `HTTP/1.1 200 OK`
- `Content-Type: image/png`
- `X-Robots-Tag: noindex, nofollow, noarchive`

## Known lessons from the May 14, 2026 cutover

- GHCR did not provide `ghcr.io/mr-badr/ar-clock:prod`
- safe local promotion from `:staging` to `:prod` worked
- green started correctly on `3020`
- nginx switch to green succeeded
- the old repeated Open-Meteo `Link` header disappeared after the new build went live
- a fresh green-era OG-image error still appeared for `/time-now/yemen/aden/opengraph-image`, so OG-image monitoring must continue after each deploy
