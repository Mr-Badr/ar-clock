import { NextResponse } from 'next/server';

import { featureFlags } from '@/lib/feature-flags';
import { getAppVersion } from '@/lib/runtime-config';
import { logger, serializeError } from '@/lib/logger';

function ensureRateLimitStore() {
  if (!globalThis.__miqatRateLimitStore__) {
    globalThis.__miqatRateLimitStore__ = new Map();
  }

  return globalThis.__miqatRateLimitStore__;
}

function ensureRequestCounter() {
  if (typeof globalThis.__miqatRateLimitCleanupCounter__ !== 'number') {
    globalThis.__miqatRateLimitCleanupCounter__ = 0;
  }

  return globalThis.__miqatRateLimitCleanupCounter__;
}

function setRequestCounter(value) {
  globalThis.__miqatRateLimitCleanupCounter__ = value;
}

function buildHeaders(input) {
  const headers = new Headers(input || undefined);
  headers.set('X-App-Version', getAppVersion());
  return headers;
}

function attachHeaders(response, headers) {
  const resolvedHeaders = buildHeaders(headers);

  for (const [key, value] of resolvedHeaders.entries()) {
    response.headers.set(key, value);
  }

  return response;
}

function logApiInfo(message, context = {}) {
  if (!featureFlags.observabilityLogs) return;

  logger.info(message, {
    channel: 'api',
    ...context,
  });
}

function cleanupExpiredRateLimitEntries(now) {
  const counter = ensureRequestCounter() + 1;
  setRequestCounter(counter);

  if (counter % 200 !== 0) return;

  const store = ensureRateLimitStore();

  for (const [key, value] of store.entries()) {
    if (value.resetAt <= now) {
      store.delete(key);
    }
  }
}

export class ApiValidationError extends Error {
  constructor(message, issues) {
    super(message);
    this.name = 'ApiValidationError';
    this.issues = issues;
  }
}

export function json(data, init = {}) {
  return NextResponse.json(data, {
    ...init,
    headers: buildHeaders(init.headers),
  });
}

export function getRequestIp(request) {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    const [firstIp] = forwarded.split(',');
    const normalized = String(firstIp || '').trim();
    if (normalized) return normalized;
  }

  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    const normalized = String(realIp || '').trim();
    if (normalized) return normalized;
  }

  return request.ip || 'unknown';
}

function mapZodIssues(issues = []) {
  return issues.map((issue) => ({
    path: issue.path?.length ? issue.path.join('.') : 'request',
    message: issue.message,
  }));
}

export function parseSearchParams(request, schema) {
  const url = new URL(request.url);
  const rawEntries = Object.fromEntries(url.searchParams.entries());
  const parsed = schema.safeParse(rawEntries);

  if (!parsed.success) {
    throw new ApiValidationError('Invalid query parameters.', mapZodIssues(parsed.error.issues));
  }

  return parsed.data;
}

export async function parseJsonBody(request, schema) {
  let payload;

  try {
    payload = await request.json();
  } catch {
    throw new ApiValidationError('Request body must be valid JSON.', [
      { path: 'body', message: 'Malformed JSON payload.' },
    ]);
  }

  const parsed = schema.safeParse(payload);

  if (!parsed.success) {
    throw new ApiValidationError('Invalid request body.', mapZodIssues(parsed.error.issues));
  }

  return parsed.data;
}

export function applyRateLimit({
  request,
  key = 'api',
  limit = 60,
  windowMs = 60_000,
}) {
  const now = Date.now();
  cleanupExpiredRateLimitEntries(now);

  const store = ensureRateLimitStore();
  const ip = getRequestIp(request);
  const bucketKey = `${key}:${ip}`;
  const existing = store.get(bucketKey);

  const entry = existing && existing.resetAt > now
    ? existing
    : { count: 0, resetAt: now + windowMs };

  entry.count += 1;
  store.set(bucketKey, entry);

  const remaining = Math.max(0, limit - entry.count);
  const retryAfterSeconds = Math.max(1, Math.ceil((entry.resetAt - now) / 1000));
  const headers = {
    'X-RateLimit-Limit': String(limit),
    'X-RateLimit-Remaining': String(remaining),
    'X-RateLimit-Reset': String(Math.ceil(entry.resetAt / 1000)),
    'Retry-After': String(retryAfterSeconds),
  };

  return {
    ok: entry.count <= limit,
    ip,
    limit,
    windowMs,
    remaining,
    retryAfterSeconds,
    headers,
  };
}

export function handleRouteError(error, {
  route,
  requestId,
  headers,
  startedAt,
  method,
  ip,
} = {}) {
  if (error instanceof ApiValidationError) {
    logger.warn('api-validation-failed', {
      route,
      requestId,
      issues: error.issues,
    });

    const response = json(
      {
        ok: false,
        error: error.message,
        details: error.issues,
        requestId,
      },
      { status: 400, headers },
    );

    logApiInfo('api-request-completed', {
      route,
      requestId,
      method,
      ip,
      status: 400,
      durationMs: typeof startedAt === 'number' ? Date.now() - startedAt : null,
      failed: true,
    });

    return response;
  }

  logger.error('api-request-failed', {
    route,
    requestId,
    error: serializeError(error),
  });

  const response = json(
    {
      ok: false,
      error: 'Internal server error.',
      requestId,
    },
    { status: 500, headers },
  );

  logApiInfo('api-request-completed', {
    route,
    requestId,
    method,
    ip,
    status: 500,
    durationMs: typeof startedAt === 'number' ? Date.now() - startedAt : null,
    failed: true,
  });

  return response;
}

export function withApiHandler(route, handler, options = {}) {
  return async function wrappedHandler(request, context) {
    const requestId = crypto.randomUUID();
    const startedAt = Date.now();
    const method = request.method || 'GET';
    const ip = getRequestIp(request);
    const rateLimit = options.rateLimit
      ? applyRateLimit({
          request,
          key: options.rateLimit.key || route,
          limit: options.rateLimit.limit,
          windowMs: options.rateLimit.windowMs,
        })
      : null;

    logApiInfo('api-request-started', {
      route,
      requestId,
      method,
      ip,
    });

    if (rateLimit && !rateLimit.ok) {
      logger.warn('api-rate-limit-exceeded', {
        route,
        requestId,
        ip: rateLimit.ip,
        limit: rateLimit.limit,
        windowMs: rateLimit.windowMs,
      });

      const response = json(
        {
          ok: false,
          error: 'Too many requests.',
          retryAfterSeconds: rateLimit.retryAfterSeconds,
          requestId,
        },
        {
          status: 429,
          headers: {
            ...rateLimit.headers,
            'X-Request-Id': requestId,
          },
        },
      );

      logApiInfo('api-request-completed', {
        route,
        requestId,
        method,
        ip,
        status: 429,
        durationMs: Date.now() - startedAt,
        rateLimitRemaining: rateLimit.remaining,
        failed: true,
      });

      return response;
    }

    try {
      const response = await handler({
        request,
        context,
        requestId,
        rateLimit,
      });

      const finalResponse = attachHeaders(response, {
        ...rateLimit?.headers,
        'X-Request-Id': requestId,
      });

      logApiInfo('api-request-completed', {
        route,
        requestId,
        method,
        ip,
        status: finalResponse.status,
        durationMs: Date.now() - startedAt,
        rateLimitRemaining: rateLimit?.remaining ?? null,
      });

      return finalResponse;
    } catch (error) {
      return handleRouteError(error, {
        route,
        requestId,
        headers: {
          ...rateLimit?.headers,
          'X-Request-Id': requestId,
        },
        startedAt,
        method,
        ip,
      });
    }
  };
}
