# Miqatona App + VPS Context

Last updated: 2026-05-14

This file is the shared context snapshot for future sessions. Read this first before re-analyzing the full project.

## What Miqatona is

- Arabic Next.js 16.1.6 app using App Router, React 19, `cacheComponents`, and `output: 'standalone'`.
- Main product areas:
  - `/holidays/*`
  - `/time-now/*`
  - `/mwaqit-al-salat/*`
  - `/time-difference/*`
  - `/date/*`
  - `/calculators/*`
- SEO matters a lot because the app is under Google indexing / ads review pressure.
- Production stack is Hetzner VPS + nginx + Docker blue/green + PostgreSQL + Prisma 7.

## Current repo stabilization work

These fixes are already present in the local repo worktree and should be treated as in-progress stabilization, not random edits.

### SEO / Search Console fixes already implemented in repo

- `src/lib/db/queries/countries.ts`
  - `getCountryBySlug()` was changed to return `null` instead of throwing.
- `src/app/holidays/[slug]/opengraph-image.jsx`
  - hardened around async `searchParams` and fallback handling.
- `src/lib/holidays-engine.js`
  - Event schema got a `performer` field.
  - Gregorian Arabic date formatting now uses Arabic labels with Latin digits.
- `src/components/holidays/GlobalSchemas.jsx`
  - `/holidays` FAQ JSON-LD was cleaned up.
- `src/app/date/.../page.tsx`
  - nested / duplicate FAQPage schema was reduced on date pages.
- `next.config.js`
  - invalid `experimental.dynamicIO` was removed.
  - `compress: false` is set because nginx is the front proxy.
  - redirects for `/&` and `/%26` were added.
- `infra/nginx/snippets/proxy-common.conf`
  - upgraded for Next.js streaming and larger upstream headers.
- `infra/nginx/conf.d/default.conf`
  - aligned with the proxy snippet changes.
- `infra/nginx/templates/site.conf.template`
  - risky site-wide `X-Robots-Tag` behavior was removed.

### Holiday rendering hardening already implemented in repo

- `src/lib/hijri-resolver.js`
  - holiday SSR no longer depends on a live remote Hijri API.
  - resolution is now local and deterministic.
- `src/lib/holidays/runtime-data.js`
- `src/app/holidays/data.js`
- `src/components/holidays/data/faqItems.js`
  - these were updated so holiday runtime data passes stable date context through the page pipeline.
- `src/lib/holidays/page-model.js`
  - holiday notes / model text was updated to match the local Hijri resolver.

### Holiday page shell / blank-page fix already implemented in repo

- `src/app/holidays/[slug]/page.jsx`
  - now renders from `getHolidayPageCriticalData()` first instead of waiting for the full holiday payload.
- `src/lib/holidays/page-data.js`
  - split into:
    - `getHolidayPageCriticalData()`
    - `getHolidayPageCountryDates()`
    - `getHolidayPageData()`
- `src/app/holidays/[slug]/CountryDatesSection.jsx`
  - new deferred section with its own fallback and error handling.
- `src/app/holidays/[slug]/HolidayDetailsSections.jsx`
  - accepts a `countryDatesSlot` so slower content can stream independently.

Goal of this split:
- user sees event hero / countdown / main copy immediately
- slower data should fail per section, not as a blank full page
- Google should never see navbar/footer only when the page itself is valid

## Local verification status

These checks passed locally after the current repo changes:

- `npm run lint`
- `npm run typecheck`
- `npm run test:unit`

Additional local findings:

- a targeted webpack build for the holiday slug page completed successfully:
  - `npx next build --webpack --experimental-app-only --debug-build-paths 'src/app/holidays/[slug]/page.jsx'`
- local dev render of `/holidays/kuwait-national-day` returned `200` and rendered real event HTML content, not only layout shell
- `next start` is not the right boot mode for this project because `output: 'standalone'` is enabled
- correct production boot style should be `node .next/standalone/server.js` or an equivalent image entrypoint

Caveat:
- a broader full webpack app-only build still failed with a generic webpack error, so the whole app is not yet proven fully production-clean from the local sandbox alone

## Real VPS facts from the pasted terminal logs

These points come from the user’s real copied terminal output files.

There were two same-day snapshots:

- an earlier stressed snapshot
- a later cleaner snapshot with much better free disk

Prefer the latest values below unless a section explicitly mentions the earlier snapshot.

- host: `miqatona-staging-vps`
- OS: Ubuntu 24.04.4 LTS
- kernel: `6.8.0-107-generic`
- provider: Hetzner
- disk now looks healthy:
  - `/` is `38G`
  - about `7.9G` used
  - about `28G` free
- RAM is still a concern:
  - total about `3.7GiB`
  - used about `3.0GiB`
  - free about `179MiB`
  - available about `798MiB`
  - swap `2.0GiB`, with about `1.5GiB` already used

Earlier snapshot note:

- earlier logs showed only about `9.1G` free disk
- earlier logs showed less available memory
- current disk pressure is much better, but swap pressure is still significant

This is important because low free memory + active swap can amplify nginx / Node instability under crawler load.

## Live VPS layout observed

- `/opt/miqatona/apps/staging/current`
  - contains a full app checkout with docs, infra, prisma, scripts, tests
- `/opt/miqatona/infra/docker/production`
  - contains:
    - `compose.base.yml`
    - `compose.blue.yml`
    - `compose.green.yml`
    - `compose.prod.yml`
- `/opt/miqatona/infra/nginx/sites-available/miqatona.conf`
  - live nginx site config for production
- important distinction:
  - the host nginx process is currently reading `/etc/nginx/sites-enabled/*`
  - it is not automatically reading the repo nginx files from `/opt/miqatona/apps/staging/current/infra/...`
  - the repo configs appear to have been copied into system nginx at some point and then drifted

## Important production / staging container snapshot from logs

Earlier snapshot:

- `docker-app-1` was healthy
- `miqatona-prod-blue` was unhealthy
- `docker-postgres-1` was healthy
- `miqatona-prod-postgres` was healthy

Latest confirmed state:

- `miqatona-prod-blue` was restarted successfully
- `miqatona-prod-blue` now resolves `miqatona-prod-postgres`
- `http://127.0.0.1:3010/api/health?full=1` now returns:
  - `"ok": true`
  - `"readiness": "ready"`
  - version `2026.05.07-prod-1`
- there is currently no `miqatona-prod-green` container
- port `3020` is not serving anything
- staging app appears to be the separate container `docker-app-1`
- staging app on `127.0.0.1:3000` reports version `2026.05.08-staging-1`
- staging DB auth was repaired successfully
- staging `http://127.0.0.1:3000/api/health?full=1` now returns:
  - `"ok": true`
  - `"readiness": "ready"`
  - version `2026.05.08-staging-1`
- host nginx config test now passes:
  - `nginx: configuration file /etc/nginx/nginx.conf test is successful`
- host nginx reload succeeded after cleanup
- staging public checks now pass:
  - `https://staging.miqatona.com/` -> `200`
  - `https://staging.miqatona.com/holidays/kuwait-national-day` -> `200`
  - `https://staging.miqatona.com/holidays/kuwait-national-day/opengraph-image` -> `200`
- production spot checks still pass:
  - `https://miqatona.com/` -> `200`
  - `https://miqatona.com/holidays/kuwait-national-day/opengraph-image` -> `200`

This strongly suggests staging and production-style containers are coexisting on the same VPS, and that blue is the only current production app container.

Earlier stressed `docker stats --no-stream` snapshot:

- `miqatona-prod-blue`
  - CPU about `60.82%`
  - memory about `1.551GiB / 3.73GiB`
- `docker-app-1`
  - memory about `81.37MiB / 768MiB`
- `miqatona-prod-postgres`
  - memory about `8.191MiB / 3.73GiB`
- `docker-postgres-1`
  - memory about `22.25MiB / 3.73GiB`

Interpretation of earlier stressed snapshot:

- `miqatona-prod-blue` was by far the most stressed container
- repeated DB retry failures were likely contributing to its CPU and memory usage

Latest production app health snapshot from port `3010` after restart:

- endpoint:
  - `http://127.0.0.1:3010/api/health?full=1`
- result:
  - `"ok": true`
  - `"readiness": "ready"`
  - version: `2026.05.07-prod-1`
- DB check:
  - status `ok`
  - provider `postgres`
  - latency about `347ms`
- memory check:
  - `rssMb: 208`
  - `heapUsedMb: 105`
  - `heapTotalMb: 138`
  - `heapUsageRatio: 0.76`
- external APIs:
  - `open-meteo` and `ip-api` were both healthy

Interpretation of latest snapshot:

- blue is currently healthy after restart
- the DB connectivity issue was real, but is not actively failing after the restart
- the problem should still be treated as infra drift because it previously failed and then recovered only after intervention
- staging is a separate app target that is now healthy on port `3000`, but still not a safe canary because nginx routing drift is unresolved

## Confirmed real VPS problems

### 1. Production app had real Postgres connectivity instability

Confirmed from `docker logs miqatona-prod-blue`:

- repeated Prisma failures:
  - `Can't reach database server at miqatona-prod-postgres`
- failing Prisma calls include:
  - `$queryRawUnsafe()`
  - `country.findUnique()`
  - `city.findFirst()`

Why this mattered:

- this directly explained production instability and some empty / failed pages during the unhealthy period
- it also explained why the blue container became unhealthy
- it was not only an app bug; there was a real runtime / infra failure state around DB access

Evidence gathered across the follow-up commands:

- `DATABASE_URL` inside `miqatona-prod-blue` is:
  - `postgresql://miqatona:startaymz1598753@miqatona-prod-postgres:5432/miqatona_prod`
- `docker network connect production_miqatona_prod miqatona-prod-blue` returned:
  - `endpoint with name miqatona-prod-blue already exists in network production_miqatona_prod`
- `docker exec miqatona-prod-blue getent hosts miqatona-prod-postgres` returned:
  - `172.20.0.2 miqatona-prod-postgres`
- after restarting `miqatona-prod-blue`, `/api/health?full=1` returned `ready`

Current interpretation:

- the hostname and credentials are correct
- blue is currently able to resolve and reach Postgres
- the earlier failing state was real, but the follow-up evidence suggests stale container / network / runtime state rather than a permanent wrong `DATABASE_URL`
- future recreations still need to preserve the intended compose network attachment so this does not regress

Additional live symptom from blue logs:

- `Error: failed to pipe response`
- cause:
  - `RuntimeError: memory access out of bounds`

Interpretation:

- this looks like a secondary crash symptom from the earlier unhealthy period
- it should be watched, but it is no longer enough by itself to say blue is currently broken

Operational takeaway:

- blue should be treated as recovered but fragile
- future recreations must preserve the intended compose network attachment

### 2. Country lookup errors were hitting production

Confirmed from `docker logs miqatona-prod-blue`:

- errors like:
  - `Country not found: <encoded Arabic slug>`

Examples seen in logs:

- Russia / Moscow encoded slug
- Eritrea encoded slug

This matches the earlier bug in `getCountryBySlug()` throwing instead of returning `null`.

Repo status:
- this has already been fixed locally in `src/lib/db/queries/countries.ts`
- production still needs the fixed build deployed

### 3. nginx is rejecting some Next.js responses because headers are too large

Confirmed from nginx error logs:

- `upstream sent too big header while reading response header from upstream`

Affected live pages in the logs included:

- `/holidays/hajj-season`
- `/holidays/independence-day-morocco`
- `/time-now/libya`

Interpretation:

- the upstream response headers from Next.js are too large for the current live nginx buffers
- this can come from large metadata / `Link` headers / preloads / response header volume
- this issue is real and live, not theoretical

Repo status:

- local repo already increased:
  - `proxy_buffer_size 128k`
  - `proxy_buffers 8 128k`
- live VPS must be updated to match

### 4. nginx is still seeing upstreams close early on OG routes

Confirmed from nginx error logs:

- `upstream prematurely closed connection while reading response header from upstream`

Examples from the real logs:

- `/time-now/egypt/suez/opengraph-image`
- `/time-now/libya/opengraph-image`
- `/time-now/morocco/casablanca/opengraph-image`
- `/time-now/tunisia/opengraph-image`
- `/time-now/iraq/al-basrah-al-qadimah/opengraph-image`

Interpretation:

- OG image routes are still one of the most fragile runtime paths
- this is consistent with GSC 5xx complaints on `*/opengraph-image`

Repo status:

- OG hardening was already started locally
- production still needs the new build plus nginx alignment

### 5. Live nginx production site config is drifted from the repo

From `sudo nginx -T` in the latest logs:

- production upstreams are defined as:
  - `miqatona_blue -> 127.0.0.1:3010`
  - `miqatona_green -> 127.0.0.1:3020`
  - `miqatona_active -> 127.0.0.1:3010`
- comment says:
  - `# GREEN ACTIVE NOW`
  - but the active upstream actually points to port `3010`, which is blue
- production `location /` uses inline proxy settings instead of including the repo snippet
- current live production proxy block includes:
  - `proxy_set_header Connection "";`
  - `proxy_connect_timeout 5s;`
  - `proxy_send_timeout 30s;`
  - `proxy_read_timeout 30s;`
  - `proxy_buffering off;`
- current live production block does not visibly include the newer repo-side hardening such as:
  - `proxy_buffer_size 128k`
  - `proxy_buffers 8 128k`
  - `proxy_request_buffering off`
  - `proxy_redirect off`
  - `gzip off`
  - `X-Forwarded-Host`

Why this matters:

- active traffic is on blue right now
- the comment about green is misleading and should not be trusted
- the repo and live nginx behavior are now out of sync
- the missing header-buffer directives match the live `upstream sent too big header` errors

Extra implication:

- even though blue is currently healthy, production is effectively single-target right now

### 6. Staging nginx / upstream config is also unstable

Real log examples showed:

- `connect() failed (111: Connection refused)` to `127.0.0.1:8081`
- earlier staging errors with:
  - `host not found in upstream "app"`
  - `172.18.0.3:3000` unreachable
  - buffered temp-file warnings for RSC requests

Interpretation:

- staging infra changed over time and still has configuration drift
- staging and production issues should not be mixed mentally; both exist

Latest user-confirmed state:

- `https://staging.miqatona.com/` currently returns `502`
- there is no `miqatona-prod-green` container right now
- `curl` to port `3020` fails
- staging nginx config is split and inconsistent:
  - HTTPS staging block proxies `/` to `127.0.0.1:3000`
  - HTTPS staging `location ~* /opengraph-image` proxies to `miqatona_active` (production), which is wrong
  - separate `sites-enabled/staging.miqatona.com` HTTP config still proxies to `127.0.0.1:8081`

Interpretation:

- staging is broken because nginx config drifted across multiple files and upstream targets
- staging is currently not a reliable validation environment

Latest staging-specific evidence from direct checks:

- `docker logs --tail 100 docker-app-1` showed:
  - a full Node / V8 fatal error:
    - `FATAL ERROR: Ineffective mark-compacts near heap limit Allocation failed - JavaScript heap out of memory`
  - repeated:
    - `Error: Failed to find Server Action "x". This request might be from an older or newer deployment.`
- `http://127.0.0.1:3000/api/health` returned:
  - version `2026.05.08-staging-1`
  - `readiness: "not-ready"`
  - database failure:
    - PostgreSQL error code `28P01`
    - `password authentication failed for user "miqatona"`
- `http://127.0.0.1:3000/api/health?full=1` returned the same DB auth failure and memory warning:
  - `heapUsageRatio: 0.94`
- `docker exec docker-app-1 printenv | grep '^DATABASE_URL='` showed:
  - `postgresql://miqatona:startaymz1598753@postgres:5432/miqatona_staging`
- `/opt/miqatona/env/staging.env` confirms the same staging credentials:
  - `POSTGRES_DB=miqatona_staging`
  - `POSTGRES_USER=miqatona`
  - `POSTGRES_PASSWORD=startaymz1598753`
  - `DATABASE_URL=postgresql://miqatona:startaymz1598753@postgres:5432/miqatona_staging`
- `docker exec docker-postgres-1 printenv | grep '^POSTGRES_'` confirmed the same values inside the staging Postgres container
- `docker ps` confirms the staging stack currently includes:
  - `docker-app-1` on host port `3000`
  - `docker-postgres-1` as the staging Postgres container
- `/etc/nginx/sites-available/staging.miqatona.com` still proxies plain HTTP staging traffic to:
  - `http://127.0.0.1:8081`
- `nginx -T` confirms the HTTPS staging block:
  - proxies `/` to `http://127.0.0.1:3000`
  - incorrectly proxies `location ~* /opengraph-image` to `miqatona_active` (production)
- current host `/etc/nginx/nginx.conf` also lacks the repo-style:
  - `map $http_upgrade $connection_upgrade { ... }`
- this matters because the hardened repo `proxy-common.conf` uses:
  - `proxy_set_header Connection $connection_upgrade;`
- so copying the repo snippet onto the VPS requires either:
  - also adding the `map` to host `nginx.conf`, or
  - simplifying the live snippet to avoid that variable

Staging nginx cleanup completed successfully:

- host `nginx.conf` now has the required `$connection_upgrade` map
- host `/etc/nginx/snippets/proxy-common.conf` was updated to the hardened version
- `/etc/nginx/sites-available/miqatona.conf` now serves production only
- `/etc/nginx/sites-available/staging.miqatona.com` now serves staging only
- staging `opengraph-image` requests no longer proxy into production
- the old live `8081` staging hop is no longer the active public path

Latest smoke-test results after nginx cleanup:

- staging:
  - `/holidays/hajj-season` -> `200`
  - `/holidays/independence-day-morocco` -> `200`
  - `/time-now/libya` -> `200`
  - `/time-now/egypt/suez/opengraph-image` -> `200`
  - `X-Robots-Tag: noindex, nofollow, noarchive` is present as expected
- production:
  - `/holidays/hajj-season` -> `200`
  - `/time-now/libya` -> `200`
  - `/time-now/egypt/suez/opengraph-image` -> `200`

Important nuance from the nginx error log:

- the `tail -n 100` output pasted after these checks still mostly shows older failures from before the successful nginx cleanup and smoke tests
- the timestamps in that pasted tail stop before the later successful `10:30` checks
- this means the log proves the historical problem was real, but does not yet prove there are new failures after the current fix

New app-side finding:

- `next.config.js` was adding a manual response header:
  - `Link: <https://api.open-meteo.com>; rel=preconnect`
- this is unnecessary because the app already has HTML/head-level resource hints where needed
- it also contributes to oversized response headers on pages that already emit many `Link` headers
- this header was removed locally in the repo and should be included in the next deploy

Interpretation of latest staging evidence:

- staging app had both routing and DB issues
- staging DB auth is now repaired and the app is currently healthy on `127.0.0.1:3000`
- staging has already restarted after a heap OOM and still shows high heap usage
- staging is also seeing stale / mixed client requests that trigger the Server Action mismatch error

This means staging has at least three separate issues:

1. nginx routing drift between `3000`, `8081`, and production upstreams
2. runtime instability / memory pressure under real traffic
3. stale / mixed deployment traffic that triggers Server Action mismatches

Likely root cause of the staging DB auth failure:

- the app env and `staging.env` agree on the password
- therefore the most likely problem is that `docker-postgres-1` was initialized earlier with a different password
- changing `POSTGRES_PASSWORD` in env after a Postgres volume already exists does not retroactively change the DB user password
- attempted repair using:
  - `docker exec -u postgres docker-postgres-1 psql -d miqatona_staging -c "ALTER USER miqatona ..."`
  - failed with:
    - `FATAL: role "postgres" does not exist`
- this strongly suggests the staging Postgres container was initialized with `POSTGRES_USER=miqatona` as the primary DB superuser, not the default `postgres` role
- successful repair path:
  - `docker exec docker-postgres-1 psql -U miqatona -d miqatona_staging -c "ALTER USER miqatona WITH PASSWORD 'startaymz1598753';"`
  - after that, `http://127.0.0.1:3000/api/health?full=1` became ready
  - DB status `ok`
  - DB latency about `32ms`
  - external APIs `ok`
  - memory still warns with `heapUsageRatio: 0.97`

### 7. Deployment mix / stale client action artifacts exist

Confirmed from production app logs:

- `Error: Failed to find Server Action "x". This request might be from an older or newer deployment.`

Interpretation:

- users or crawlers are sometimes hitting a mixed deployment state
- possible causes:
  - old JS assets / HTML mismatch after deploy
  - aggressive cache with new server build
  - blue/green swap without fully aligned assets or sticky requests

This is important because it can create random broken behavior even when the code is otherwise correct.

It is now confirmed in both environments:

- production logs showed it earlier
- staging `docker-app-1` is still emitting it now

## Most important current root causes

Ordered by likely production impact right now:

1. app-side response headers are still too large on some pages, even though nginx buffering is now improved
2. OG routes are still fragile under real crawler traffic and need broader validation, even though the tested staging and production sample URLs now return `200`
3. mixed deployment / stale server action state has been seen in both production and staging logs
4. holiday page rendering is better locally now, but still needs broader production validation
5. production DB connectivity previously failed and should be treated as fragile, even though blue is currently healthy after restart
6. staging has already hit Node heap OOM and should be treated as memory-sensitive

## Important config mismatch to remember

The repo and the VPS both contain multiple compose sources.

### Production compose variants seen in logs

- `/opt/miqatona/infra/docker/production/compose.base.yml`
  - uses:
    - container name `miqatona-prod-postgres`
    - network `miqatona_prod`
- `/opt/miqatona/infra/docker/production/compose.prod.yml`
  - uses:
    - network `backend`
    - no explicit `container_name` for postgres in the same pattern

This remains a clue for why deployments can drift, but it is not enough by itself to claim the current running blue app is mis-networked.

Latest concrete conclusion from live inspect + restart:

- `miqatona-prod-blue` can currently resolve `miqatona-prod-postgres`
- `miqatona-prod-blue` can currently pass `/api/health?full=1`
- the earlier Postgres failure was real, but the current live state after restart is healthy
- compose / deployment drift is still a risk because the VPS contains multiple overlapping compose patterns

## Health endpoint status

Repo file:

- `src/app/api/health/route.js`

Current local behavior:

- shallow `/api/health` does not force a DB check anymore
- deep checks only run with `?full=1`

Why that matters:

- this reduces healthcheck noise and prevents Docker health probes from hammering a broken DB connection every time

Production still needs this deployed.

## What future sessions should assume

- The local repo already contains many stabilization edits not yet guaranteed deployed.
- The live VPS issues are real and confirmed by user-provided terminal logs.
- Do not treat Search Console errors as purely historical; nginx logs show that some of the underlying failures are still live.
- Blue production is currently healthy after restart, but the environment should still be treated as fragile because:
  - live nginx proxy settings are still drifted from the repo
  - OG routes and mixed-deployment symptoms were seen in real logs
- Staging app health is currently restored at `127.0.0.1:3000`, and staging public routing is now working again.
- Staging is now usable for validation, but memory pressure and stale Server Action traffic should still be watched.

## Highest-value next commands to ask the user for on the VPS

If a future session needs to continue from here, ask for these exact commands and nothing broader unless needed:

### DB / container networking

```bash
docker exec miqatona-prod-blue printenv | grep '^DATABASE_URL='
docker inspect miqatona-prod-blue --format '{{json .NetworkSettings.Networks}}'
docker inspect miqatona-prod-postgres --format '{{json .NetworkSettings.Networks}}'
docker exec miqatona-prod-blue getent hosts miqatona-prod-postgres
docker exec miqatona-prod-blue node -e "fetch('http://127.0.0.1:3000/api/health?full=1').then(r=>r.text().then(t=>console.log(r.status,t))).catch(e=>console.error(e))"
```

Useful emergency fix commands if the diagnosis is already accepted:

```bash
docker network connect production_miqatona_prod miqatona-prod-blue
docker exec miqatona-prod-blue getent hosts miqatona-prod-postgres
docker restart miqatona-prod-blue
```

Preferred clean recreation path:

```bash
cd /opt/miqatona/infra/docker/production
docker compose -f compose.base.yml -f compose.blue.yml up -d --force-recreate app_blue
docker inspect miqatona-prod-blue --format '{{json .NetworkSettings.Networks}}'
docker exec miqatona-prod-blue getent hosts miqatona-prod-postgres
```

### nginx live config verification

```bash
sudo cat /etc/nginx/snippets/proxy-common.conf
sudo cat /etc/nginx/nginx.conf
sudo cat /opt/miqatona/infra/nginx/sites-available/miqatona.conf
sudo nginx -t
```

### Green / staging verification

```bash
docker logs --tail 100 miqatona-prod-green
docker inspect miqatona-prod-green --format '{{json .NetworkSettings.Networks}}'
curl -sS --max-time 5 http://127.0.0.1:3020/api/health
curl -sS --max-time 5 http://127.0.0.1:3020/api/health?full=1
docker logs --tail 100 docker-app-1
docker exec docker-app-1 printenv | grep '^DATABASE_URL='
curl -sS --max-time 5 http://127.0.0.1:3000/api/health
curl -sS --max-time 5 http://127.0.0.1:3000/api/health?full=1
sudo cat /etc/nginx/sites-enabled/staging.miqatona.com
sudo nginx -T | grep -n "staging.miqatona.com" -A 40 -B 10
```

### Live response verification

```bash
curl -I https://miqatona.com/holidays/hajj-season
curl -I https://miqatona.com/time-now/libya
curl -I https://miqatona.com/time-now/egypt/suez/opengraph-image
curl -s https://miqatona.com/api/health?full=1
```

### App logs after a fresh request

```bash
docker logs --tail 200 miqatona-prod-blue
sudo tail -n 200 /var/log/nginx/error.log
```

## Recommended next remediation order

1. Confirm the live prod startup command is compatible with `output: 'standalone'`.
2. Redeploy the current repo fixes, including the removal of the manual Open-Meteo `Link` header in `next.config.js`.
3. Recheck:
   - `/holidays/hajj-season`
   - `/holidays/independence-day-morocco`
   - `/time-now/libya`
   - one affected OG image URL
4. Run broader staging smoke checks across holiday, time-now, and prayer routes.
5. Then revisit remaining Search Console buckets.

## Current Search Console bucket assessment

These assessments are based on:

- the local repo state on `2026-05-14`
- live curl checks performed on `2026-05-14`
- the user-provided Search Console screenshots, most of which were last updated between `2026-05-08` and `2026-05-10`

### Bucket-by-bucket status

- `Missing field "performer"` on Events:
  - fixed in code
  - `src/lib/holidays-engine.js` now emits `performer` in `buildEventSchema()`
  - this should clear after deploy + recrawl / validation

- `Duplicate field "FAQPage"` on `/holidays`:
  - fixed in code
  - `/holidays` now keeps FAQ JSON-LD consolidated in `src/components/holidays/GlobalSchemas.jsx`
  - the page file explicitly documents that it must not emit a second FAQPage graph

- `Redirect error` for `https://www.miqatona.com/&`:
  - fixed in code
  - `next.config.js` now redirects both `/&` and `/%26`
  - still needs live post-deploy validation against the production host

- `Page with redirect`:
  - mostly expected, not a bug
  - examples such as `http://www.miqatona.com/`, `https://www.miqatona.com/`, and `http://miqatona.com/` should remain redirecting to the canonical HTTPS apex host

- `Excluded by 'noindex' tag`:
  - mixed bucket
  - some examples are expected noindex redirect/helper pages, such as `/date/calendar` and `/date/calendar/hijri`
  - however example day pages like `/date/2025/02/01` and `/date/hijri/1453/08/23` are indexable in the current repo code
  - therefore this bucket is partly stale historical data and should improve after recrawl if production stays clean

- `Server error (5xx)` on `*/opengraph-image`:
  - code-side hardening is in place locally
  - live sample routes now return `200`
  - production nginx is also healthier now
  - but this bucket should not be considered fully closed until the current repo is deployed and error logs stay quiet afterward

- `Crawled - currently not indexed`:
  - not automatically a bug
  - the sample URLs shown in screenshots are mostly normal content routes that appear indexable in the current repo
  - this bucket is usually a crawl/quality/freshness decision by Google and often lags fixes by days or weeks

- `Discovered - currently not indexed`:
  - not automatically a bug
  - the sample URLs include calculators and date calendar year pages, which look valid in the current repo
  - this status should improve only after Google sees stable, consistently fast, fully rendered pages over time

### Biggest remaining live risk before deploy

- production still emits very large `Link` response headers on some pages like `/time-now/libya` and `/holidays/hajj-season`
- the local repo now removes one unnecessary global Open-Meteo `Link` header from `next.config.js`
- that cleanup is not live until the current repo is deployed

### Additional crawl-signal fixes added locally on 2026-05-14

- important internal date links no longer use `rel="nofollow"`
  - removed from:
    - `src/components/date/YearlyCalendar.tsx`
    - `src/components/date/HijriYearlyCalendar.tsx`
    - `src/components/date/EventDayLink.tsx`
    - `src/app/date/page.tsx`
    - `src/app/date/calendar/[year]/page.tsx`
    - `src/app/date/today/gregorian/page.tsx`
    - `src/app/date/today/hijri/page.tsx`
  - rationale:
    - Search Console examples for `Discovered - currently not indexed` and `Crawled - currently not indexed` include canonical `/date/...` pages
    - these pages should not be internally marked `nofollow` if we want Google to treat them as real index candidates

- daily date sitemaps are no longer intentionally empty
  - `src/app/date/gregorian/sitemap.xml/route.ts` now emits a rolling Gregorian day-page window
  - `src/app/date/hijri/sitemap.xml/route.ts` now emits a rolling Hijri day-page window
  - `src/app/date/sitemap.xml/route.ts` now includes both daily date sitemap leaves
  - `src/lib/seo/site-architecture.js` now includes both daily date sitemap leaves in the root sitemap index set
  - rationale:
    - before this change, the repo explicitly withheld canonical day pages from submitted sitemaps
    - that decision aligns poorly with the current business goal of getting these pages indexed cleanly for Search and Ads review

- verification after the above patch:
  - `npm run typecheck` passed
  - `npm run lint` passed
  - `npm run test:unit` passed with `74/74`
  - sitemap tests now explicitly verify that both Gregorian and Hijri daily date sitemaps publish canonical date URLs

### Calculators / economy impressions audit on 2026-05-14

- user concern:
  - calculator and economy pages were not showing up much in Search Console impressions over recent days

- calculator routes audit result:
  - no major technical indexing blocker was found in the current repo
  - calculator hubs and detail pages are already:
    - included in `src/app/calculators/sitemap.js`
    - promoted in the root sitemap architecture via `src/lib/seo/site-architecture.js`
    - linked from the homepage, footer, and guides hub
    - using `buildCanonicalMetadata()` with index/follow robots directives
  - conclusion:
    - calculator impression weakness currently looks more like crawl lag / ranking / demand, not a clear noindex-style bug

- economy routes audit result:
  - a real first-render SEO weakness was found
  - economy pages were using `getCachedEconomyPageSnapshot()` from `src/lib/economy/page-snapshots.server.js`
  - that helper previously passed `initialNowIso: null` into the main client-rendered economy sections
  - effect:
    - on the first server render, major economy surfaces could fall back to generic loading copy before hydration
    - this weakens the HTML that crawlers see immediately and can reduce relevance / impression opportunity for economy pages

- economy first-render fix added locally:
  - `src/lib/economy/page-snapshots.server.js`
    - now seeds `initialNowIso` from `getCachedNowIso()` with `ECONOMY_FALLBACK_NOW_ISO` as fallback
    - `getEconomyPageServerState()` now reuses the seeded snapshot time instead of recalculating separately
  - `src/lib/economy/page-helpers.js`
    - `STATIC_ECONOMY_PAGE_STATE.initialNowIso` now uses `ECONOMY_FALLBACK_NOW_ISO` instead of `null`
  - `tests/economy-market-engine.test.ts`
    - now verifies the initial economy page state always includes a usable fallback timestamp

- verification after the economy first-render fix:
  - `npm run typecheck` passed
  - `npm run lint` passed
  - `npm run test:unit` passed with `74/74`

- practical meaning:
  - calculators are mostly waiting on crawl / recrawl / ranking
  - economy pages had one real SSR SEO weakness and it is now fixed locally, pending deploy

### Thin-content hardening on 2026-05-14

- user concern:
  - external review feedback warned that many programmatic pages still feel too repetitive
  - highest-risk examples were the large `time-now` route family plus the site-wide footer copy

- main code-side fixes added locally:
  - new shared helper: `src/lib/time-now-content.js`
    - computes concrete timezone facts from real data instead of placeholder copy
    - exposes:
      - current UTC offset labels
      - UTC relation sentences (`تسبق` / `تتأخر` / same as Greenwich)
      - DST observation copy based on January vs July offsets
      - current local Gregorian/Hijri date labels
      - same-current-offset country discovery
  - `src/components/time-now/TimeNowFAQ.jsx`
    - no longer generates generic repeated FAQ text internally
    - now accepts page-built FAQ items so country and city pages can emit different, factual answers
  - `src/app/time-now/[country]/[city]/page.jsx`
    - replaced `sameOffsetCountries = []` placeholder with real same-offset country discovery
    - FAQ JSON-LD now reuses the richer rendered FAQ items
    - SEO prose no longer talks like an SEO template; now references actual dates, UTC relation, and related same-offset countries
    - internal discovery copy was rewritten to be user-facing instead of “this page should not stay isolated in the sitemap”
  - `src/app/time-now/[country]/page.jsx`
    - same placeholder removal for same-offset countries
    - country FAQ now differs from city FAQ and references capital / city coverage
    - country prose now includes real UTC relation, local dates, and same-offset country context
  - `src/components/time-now/SameTimezoneCountries.jsx`
    - wording now correctly says “same current offset” instead of implying the exact same IANA timezone
  - `src/components/layout/Footer.jsx`
    - shortened the brand paragraph and directory note so the footer reads less like a repeated marketing block across every page

- practical effect:
  - high-scale `time-now` pages now contain more page-specific factual content, less repeated boilerplate, and one more meaningful internal-linking section
  - this directly addresses the “thin templated content at scale” concern better than adding more generic prose

- verification after thin-content hardening:
  - `npm run typecheck` passed
  - `npm run lint` passed
  - `npm run test:unit` passed with `78/78`
  - new regression coverage lives in `tests/time-now-content.test.ts`

### Build fix and broader site-positioning on 2026-05-14

- user concern:
  - local `npm run build` failed on `/time-now/china/beijing`
  - user also wanted Google to understand Miqatona as a broad Arabic utility platform, not just a time/prayer site
  - user also noted AdSense shows `ads.txt` as `Not found` even though `https://miqatona.com/ads.txt` is reachable live

- direct build root cause found:
  - `src/components/time-now/SameTimezoneCountries.jsx` was still a server component but contained `onMouseEnter` / `onMouseLeave`
  - this matches the exact Next.js App Router prerender error:
    - `Event handlers cannot be passed to Client Component props`
  - fix applied:
    - removed server-side event handlers
    - replaced them with a CSS hover rule inside the server component

- broader indexing / positioning changes applied locally:
  - `src/lib/site-config.js`
    - home title and site description now describe Miqatona as a broader platform:
      - time
      - prayer
      - date
      - holidays
      - calculators
      - economy
      - guides
    - `SITE_SCHEMA_TOPICS` now includes broader non-time sections like calculators, finance tools, holidays, guides, and tool directory
  - `src/app/layout.tsx`
    - root author metadata was widened from time/date/prayer wording to broader platform wording
  - `src/components/hero/CopyBlock.jsx`
    - homepage hero no longer reads like a pure time-page funnel
    - primary CTA now points to `/fahras`
    - added quick links to:
      - `/fahras`
      - `/calculators`
      - `/economie`
      - `/holidays`
      - `/guides`
  - `src/components/seo/SiteWideSchemas.jsx`
    - added an `ItemList` JSON-LD block for core site sections
    - this gives crawlers a clearer machine-readable map of Miqatona’s main product families
  - `src/app/page.jsx`
    - added homepage `CollectionPage` + `ItemList` JSON-LD for the core sections
    - this reinforces that the homepage is a hub for multiple tool families, not a single-function landing page

- ads.txt note:
  - repository route exists at `src/app/ads.txt/route.ts`
  - but live production nginx is configured to serve `/ads.txt` directly from `/var/www/html`
  - practical meaning:
    - the live file AdSense sees is probably not coming from the Next.js route at all
    - if AdSense still says `Not found` while the browser shows the file, the status is likely stale or tied to VPS-level serving/crawl timing rather than the app route itself

- verification after these changes:
  - `npm run test:unit` passed with `78/78`
  - `npm run lint` passed
  - `npm run typecheck` passed
  - sandbox `next build` behavior remains awkward:
    - after the `SameTimezoneCountries` fix, the earlier explicit `/time-now/china/beijing` event-handler error did not reappear
    - however the sandbox still fails to return a clean final `next build` status after the compile phase, so final end-to-end build success still needs confirmation in a normal local/VPS run

## Build and ads.txt verification on 2026-05-14

- local `npm run build` input from user showed a real prerender failure:
  - route: `/time-now/china/beijing`
  - error: `Event handlers cannot be passed to Client Component props`
  - root cause was a pure server component using inline hover handlers:
    - `src/components/time-now/SameTimezoneCountries.jsx`
- code fix applied:
  - removed `onMouseEnter` / `onMouseLeave` from `SameTimezoneCountries`
  - replaced them with CSS hover styling while keeping the component server-rendered
- follow-up build behavior:
  - the original explicit `/time-now/china/beijing` prerender error no longer reappeared
  - a subsequent build retry first hit a stale `.next/lock`
  - after removing the lock, the sandbox build again stalled after:
    - `Creating an optimized production build ...`
  - practical meaning:
    - the specific server/client boundary bug looks fixed in code
    - full build success still needs confirmation on the user's normal machine or VPS because this sandbox keeps hanging after compile start

- live ads.txt verification from outside the sandbox:
  - `https://miqatona.com/ads.txt` returned `200 OK`
  - `https://www.miqatona.com/ads.txt` returned `200 OK`
  - `http://miqatona.com/ads.txt` returned `301` to `https://miqatona.com/ads.txt`
  - `http://www.miqatona.com/ads.txt` returned `301` to `https://www.miqatona.com/ads.txt`
- interpretation:
  - AdSense "Not found" is not explained by a missing live root `ads.txt`
  - the most likely causes are stale AdSense status data or host/crawl timing lag, not a missing file
  - because production nginx serves `/ads.txt` from `/var/www/html`, the live AdSense result depends on VPS nginx/static hosting, not only on the app route inside this repo

## AdSense and DB migration audit on 2026-05-14

- AdSense verification signals already exist in the app runtime:
  - `src/app/layout.tsx`
    - adds `<meta name="google-adsense-account" ...>` when ads are enabled
    - adds preconnect hints for Google ad domains
  - `src/components/ads/AdSenseProvider.jsx`
    - loads the official AdSense script:
      - `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=...`
    - enables Auto Ads when configured
- practical meaning:
  - the extra AdSense methods the user mentioned are already implemented in the app code
  - the remaining live `ads.txt` issue is more likely Google-side delay or VPS/static-host drift than missing app integration

- Supabase migration verification result:
  - no active runtime code under `src/` still calls Supabase
  - live runtime geo/database code is Prisma + Postgres only:
    - `src/lib/db/prisma.ts`
    - `src/lib/db/live-geo-source.ts`
  - remaining Supabase references are legacy scripts/docs, not the live app:
    - `scripts/sync-location.js`
    - `scripts/generateSitemap.js`
    - several old migration/bootstrap docs

- confirmed migration architecture smell that could hide bad data:
  - before this audit, query helpers in:
    - `src/lib/db/queries/countries.ts`
    - `src/lib/db/queries/cities.ts`
  - were still preferring fallback snapshot JSON before DB results for several important runtime functions
  - this meant production could behave like:
    - snapshot first
    - Postgres second
  - even after the migration

- query-layer cleanup applied:
  - `src/lib/db/live-geo-source.ts`
    - added `loadAllCountries()`
  - `src/lib/db/queries/countries.ts`
    - `getAllCountries()` is now DB-first
    - `getCountryBySlug()` is now DB-first
    - `getCountryByCode()` is now DB-first
    - `getAllCountrySlugs()` now trusts DB slugs first when live geo is enabled
  - `src/lib/db/queries/cities.ts`
    - `getCitiesByCountry()` is now DB-first
    - `getCityBySlug()` is now DB-first
    - `getCapitalCity()` is now DB-first
    - `getAllCityParams()` now trusts DB params first when live geo is enabled
  - fallback JSON still exists, but only as a backup path when DB is disabled, empty, or throws

- why this matters for SEO/indexing:
  - country/city route generation and page resolution are now aligned with the real migrated source of truth
  - this reduces the chance of stale snapshot-only pages, mismatched route inventories, or hidden migration defects during crawler requests

- verification after the DB query-layer cleanup:
  - `npm run typecheck` passed
  - `npm run lint` passed
  - `npm run test:unit` passed (`78/78`)

## Event page hardening on 2026-05-14

- user priority clarified:
  - event pages are the highest SEO / Google Ads sensitivity area
  - a broken section must never blank the full page
  - failures should still be visible in staging/production logs

- section-isolation status:
  - `src/app/holidays/[slug]/CountryDatesSection.jsx`
    - already degrades safely:
      - catches section failure
      - logs `holiday-country-dates-section-failed`
      - returns a friendly section-level fallback UI
  - `src/app/holidays/[slug]/RelatedEvents.jsx`
    - was async and only wrapped in `Suspense`
    - `Suspense` handles loading, not failure
    - now catches its own async failures, logs `holiday-related-events-section-failed`, and returns `null`
    - practical meaning:
      - related-events lookup can no longer take down the full holiday page

- critical data logging status:
  - `src/lib/holidays/page-data.js`
    - `getHolidayPageCriticalData(slug)` now logs `holiday-page-critical-data-failed` with the slug before rethrowing
    - `getHolidayPageCountryDates(slug)` now logs `holiday-page-country-dates-data-failed` with the slug before rethrowing
  - practical meaning:
    - critical failures are now visible in logs with route context
    - non-critical section failures still degrade locally at the section boundary

- current holiday page resilience model:
  - route-critical model/data failure:
    - log explicitly
    - fail loudly so the root cause is visible
  - non-critical async section failure:
    - log explicitly
    - keep the page alive
    - return fallback UI or omit the section

- verification after the event hardening pass:
  - `npm run typecheck` passed
  - `npm run lint` passed
  - `npm run test:unit` passed (`78/78`)

Practical staging DB repair direction:

- completed successfully by changing the password inside `docker-postgres-1` to match `staging.env`
- staging nginx cleanup also completed successfully
- current remaining staging work is broader smoke testing plus monitoring memory pressure

## Related local source files worth reading first

- `docs/context/agent-tool.md`
- `docs/context/audit-2026-05-12.md`
- `infra/nginx/snippets/proxy-common.conf`
- `next.config.js`
- `src/app/api/health/route.js`
- `src/app/holidays/[slug]/page.jsx`
- `src/app/holidays/[slug]/CountryDatesSection.jsx`
- `src/lib/holidays/page-data.js`
- `src/lib/hijri-resolver.js`
- `src/lib/db/queries/countries.ts`

## Production deploy status on 2026-05-14

- safe green cutover completed
- staging image on VPS was healthy before promotion:
  - image: `ghcr.io/mr-badr/ar-clock:staging`
  - health: `ok: true`, `readiness: ready`
- GHCR did not provide `ghcr.io/mr-badr/ar-clock:prod`, so VPS used a safe local image promotion:
  - `docker tag ghcr.io/mr-badr/ar-clock:staging ghcr.io/mr-badr/ar-clock:prod`
- green was created successfully:
  - container: `miqatona-prod-green`
  - port: `3020`
- direct green smoke tests passed before public cutover:
  - `http://127.0.0.1:3020/api/health?full=1`
  - `http://127.0.0.1:3020/holidays/kuwait-national-day`
  - `http://127.0.0.1:3020/time-now/libya`
- nginx was updated so production upstream `miqatona_active` now points to `127.0.0.1:3020`
- public production smoke tests passed after cutover:
  - `https://miqatona.com/`
  - `https://miqatona.com/holidays/kuwait-national-day`
- important header improvement:
  - the repeated Open-Meteo `Link` header no longer appeared in the shown post-cutover public responses
  - remaining `link` headers were font preload headers, which are expected
- the shown nginx error log after cutover still mostly referenced upstream `127.0.0.1:3010`
  - treat those lines as historical blue-era errors, not proof that green is failing

### Immediate follow-up after cutover

- keep blue on `3010` temporarily as rollback target
- re-check nginx error logs after the cutover timestamp to confirm new `3020` traffic stays clean
- if green remains stable, blue can later be stopped or recreated cleanly
- one fresh green-era nginx error was already observed after cutover:
  - timestamp: `2026/05/14 15:46:53`
  - upstream: `http://127.0.0.1:3020`
  - route: `/time-now/yemen/aden/opengraph-image`
  - error: `upstream prematurely closed connection while reading response header from upstream`
  - practical meaning:
    - the large repeated HTML header problem improved
    - OG-image stability still needs continued monitoring on green

## New deploy documentation

- safe production steps are now documented in:
  - `docs/ci-cd/production-blue-green-runbook.md`

## OG-image hardening after green cutover

- fresh green-era failure confirmed after cutover:
  - `/time-now/yemen/aden/opengraph-image`
  - upstream `127.0.0.1:3020`
  - error: `upstream prematurely closed connection while reading response header from upstream`
- mitigation chosen in code:
  - move the riskiest OG-image routes away from live DB and live calculation work
  - use snapshot-based country/city labels instead
  - use edge runtime for the lightweight time/prayer OG-image routes
- new shared label source:
  - `src/lib/geo-og-labels.js`
- updated routes:
  - `src/app/time-now/[country]/opengraph-image.jsx`
  - `src/app/time-now/[country]/[city]/opengraph-image.jsx`
  - `src/app/mwaqit-al-salat/[country]/[city]/opengraph-image.jsx`
- practical meaning:
  - OG images for time-now and prayer pages are now much less likely to fail under crawler bursts
  - page SEO value stays on the page itself
  - social image generation no longer depends on Postgres lookups or live prayer-time calculation

## 2026-05-15 follow-up: runbook clarity + nginx OG-image policy

- `docs/ci-cd/production-blue-green-runbook.md`
  - now explains the deploy flow when blue is active and when green is active
  - now tells operators to identify the active slot first instead of assuming green is always the deploy target
  - now documents the difference between:
    - live system nginx under `/etc/nginx/...`
    - repo reference nginx files under `/opt/miqatona/infra/nginx/...`
- `infra/nginx/conf.d/default.conf`
  - OG-image location now actually sends `X-Robots-Tag: noindex, nofollow, noarchive`
  - OG-image `proxy_send_timeout` now matches the long `120s` timeout policy
- `src/app/holidays/[slug]/opengraph-image.jsx`
  - still falls back safely on failure
  - now logs `holiday-og-image-failed` with route and slug context so future Search Console `5xx` examples can be matched to real runtime failures

## 2026-05-15 follow-up: direct green/staging OG-image regression isolated

- VPS symptom:
  - direct requests to the newer app builds failed with `curl: (52) Empty reply from server`
  - examples:
    - `http://127.0.0.1:3020/time-now/kyrgyzstan/bishkek/opengraph-image`
    - `http://127.0.0.1:3000/time-now/kyrgyzstan/bishkek/opengraph-image`
  - old blue on `3010` still returned `200` for the same route
- likely cause:
  - the newer OG-image routes had been moved to `runtime = 'edge'`
  - blue-era working behavior was closer to plain Node runtime
- mitigation applied in repo:
  - switched these lightweight snapshot-based OG routes back to `runtime = 'nodejs'`
  - files:
    - `src/app/time-now/[country]/opengraph-image.jsx`
    - `src/app/time-now/[country]/[city]/opengraph-image.jsx`
    - `src/app/mwaqit-al-salat/[country]/[city]/opengraph-image.jsx`
- local verification after the runtime rollback:
  - dev server returned `200` for:
    - `/time-now/kyrgyzstan/bishkek/opengraph-image`
    - `/time-now/egypt/suez/opengraph-image`
    - `/holidays/day-of-arafa-in-usa/opengraph-image`
- practical meaning:
  - the regression appears to be tied to the edge runtime path in the newer builds, not to nginx itself
  - next safe VPS step is to rebuild/redeploy staging and green with the node-runtime OG fix, then retest direct `3000` and `3020` image routes before switching public traffic
