# syntax=docker/dockerfile:1.7

FROM node:20-bookworm-slim AS base

ENV NEXT_TELEMETRY_DISABLED=1
WORKDIR /app

RUN apt-get update \
 && apt-get install -y --no-install-recommends openssl ca-certificates \
 && rm -rf /var/lib/apt/lists/*

# -----------------------
# BUILD STAGE (FIXED)
# -----------------------
FROM base AS builder

ARG APP_VERSION=dev

ENV APP_VERSION=${APP_VERSION} \
    NEXT_TELEMETRY_DISABLED=1 \
    NEXT_OUTPUT_MODE=standalone

COPY package*.json ./

RUN npm ci

ENV NODE_ENV=production
COPY . .

RUN npm run build

# -----------------------
# RUNTIME STAGE
# -----------------------
FROM base AS runner

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    HOSTNAME=0.0.0.0 \
    PORT=3000

WORKDIR /app

RUN groupadd --system --gid 1001 nodejs \
 && useradd --system --uid 1001 --gid nodejs nextjs \
 && mkdir -p /app/.next/cache \
 && chown -R nextjs:nodejs /app

# FIXED COPY SOURCE (builder now exists)
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

# -----------------------
# FIXED HEALTHCHECK (SAFE)
# -----------------------

HEALTHCHECK --interval=30s --timeout=10s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:3000/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
CMD ["node", "server.js"]
