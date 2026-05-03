# Miqatona System Architecture

## Overview
Miqatona runs on a containerized architecture using Docker Compose with separate environments for staging and production.

---

## Services

### 1. App (Next.js)
- Framework: Next.js (standalone output)
- Runs on: Node.js 20
- Internal port: 3000
- Exposed via: Nginx reverse proxy

### 2. Nginx (Edge Gateway)
- Handles:
  - HTTPS termination
  - HTTP → HTTPS redirect
  - Static caching
  - Reverse proxy to Next.js app
- Runs in isolated network: `edge + backend`

### 3. PostgreSQL
- Used in staging & production separately
- Data persisted via Docker volume
- Internal-only access (127.0.0.1 in staging)

---

## Networks

### backend (internal)
- App + DB communication
- NOT exposed externally

### edge
- Only Nginx exposed to internet

---

## Environments

### Staging
- Used for testing features
- Can safely break
- Uses staging DB
- Uses staging domain

### Production
- Stable release only
- No experimental changes
- Separate DB & secrets

---

## Deployment Flow

1. Develop locally
2. Push to GitHub
3. Build staging image
4. Deploy to staging VPS
5. Test fully
6. Promote same image tag to production

---

## Rule
👉 NEVER deploy directly to production without staging validation
