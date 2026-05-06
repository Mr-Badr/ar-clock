# Miqatona Deployment Notes (Staging → Production Migration)

## Project
- App: ar-clock (Miqatona)
- Environment: staging
- Domain:
  - Production: https://miqatona.com (currently Vercel)
  - Staging: https://staging.miqatona.com (NGINX + VPS)
- Infrastructure: Docker + NGINX reverse proxy + Next.js + PostgreSQL (Docker)

---

## Current Architecture (STAGING VPS)

### Containers
- docker-app-1 → Next.js app (port 3000)
- docker-nginx-1 → reverse proxy (HTTPS termination)
- postgres → database (Docker internal network)

### Routing Flow
Internet → NGINX (443) → Next.js app (3000) → PostgreSQL

---

## Working Status (as of today)

### Working
- ✅ NGINX reverse proxy working
- ✅ HTTPS working on staging.miqatona.com
- ✅ App reachable via nginx → app:3000
- ✅ Database connection working
- ✅ Health endpoint responding internally:
  /api/health → ok (via docker network)

### External Issues Observed
- ⚠️ DNS resolution issues inside app container (EAI_AGAIN for google.com)
- ⚠️ Some external fetch calls failing inside container
- ⚠️ Rate limiting triggered in NGINX (`api_limit`)
- ⚠️ Some 503 errors during high request bursts
- ⚠️ Memory warning in health check (RSS ~481MB, high heap usage ~97%)

---

## Known Problems

### 1. Container DNS issue
- fetch() inside docker-app fails for external domains
- Error: EAI_AGAIN google.com
- Likely causes:
  - Docker DNS config issue
  - systemd-resolved / host resolver conflict
  - missing fallback DNS (8.8.8.8 / 1.1.1.1)

---

### 2. NGINX rate limiting
- zone: api_limit
- rate: 50r/s (currently)
- bursts cause 503 errors under load

---

### 3. Architecture inconsistency
- Production still on Vercel
- Staging on VPS (correct direction)
- Supabase still used in production path

---

## What is already correct (IMPORTANT)

- Docker network communication works (nginx → app)
- Database is internal and reachable
- TLS termination is stable
- Reverse proxy routing is clean
- App health endpoint works internally

---

## Migration Goal

We want:

### Phase 1 (CURRENT)
- Stabilize staging VPS
- Fix DNS inside containers
- Remove fetch failures
- Remove 503 spikes
- Ensure logs are clean and observable

### Phase 2
- Fully validate staging under load
- Ensure zero external dependency failure
- Add monitoring + alerting

### Phase 3
- Move production from Vercel → VPS
- Keep rollback strategy ready
- Zero downtime migration

---

## Next Technical Steps (TODO)

### High priority
- [ ] Fix Docker DNS resolution (app container)
- [ ] Add fallback DNS (1.1.1.1 / 8.8.8.8)
- [ ] Stabilize external fetch calls
- [ ] Review NGINX rate limit strategy

### Medium priority
- [ ] Improve observability logs (structured logs)
- [ ] Add request tracing IDs everywhere
- [ ] Memory optimization (Node heap usage)

### Later
- [ ] Production migration plan
- [ ] Blue/green deployment setup
- [ ] Backup + rollback system

---

## Critical Observations

- NGINX is stable but too strict under burst traffic
- App is healthy internally but unstable externally (DNS)
- Infrastructure is correct, but runtime environment is incomplete

---

## Notes

- DO NOT touch production (Vercel) yet
- Staging must be fully stable before migration
- Every fix must be tested inside docker network first
