# Docker Strategy

We use layered Docker Compose files:

## 1. base.yml
Contains:
- core services
- nginx
- networks
- shared config

## 2. staging.yml
Contains:
- staging database
- environment overrides
- image overrides

## 3. production.yml
Contains:
- production database
- production secrets
- hardened configuration

---

## Rule
Always run with BOTH base + environment file:

```bash
docker compose -f base.yml -f staging.yml up -d
