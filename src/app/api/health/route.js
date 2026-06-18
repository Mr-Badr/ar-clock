import v8 from 'node:v8';

import { connection } from 'next/server';
import { z } from 'zod';

import { getLiveGeoProviderName, isLiveGeoDbEnabled } from '@/lib/db/live-geo-source';
import { getRuntimeEnvHealthSnapshot } from '@/lib/env.server';
import { logger } from '@/lib/logger';
import {
  CRITICAL_ROUTE_PROBES,
  buildRouteProbeUrl,
  evaluateRouteProbeResponse,
  resolveRouteProbeOrigin,
} from '@/lib/route-health/critical-routes';
import { getAppVersion } from '@/lib/runtime-config';
import { json, parseSearchParams, withApiHandler } from '@/lib/api/route-utils';

const querySchema = z.object({
  full: z.string().trim().optional().default('0'),
  routes: z.string().trim().optional().default('0'),
  routeTimeoutMs: z.string().trim().optional(),
  routeConcurrency: z.string().trim().optional(),
});

function isTruthy(value) {
  return ['1', 'true', 'yes', 'on'].includes(String(value || '').toLowerCase());
}

function isPrerenderConnectionError(error) {
  const message = error instanceof Error ? error.message : String(error);
  return message.includes('During prerendering, `connection()` rejects');
}

function getMemoryHealth() {
  const usage = process.memoryUsage();
  const heapStats = v8.getHeapStatistics();
  const heapLimit = heapStats.heap_size_limit;
  const heapLimitUsageRatio = heapLimit > 0 ? usage.heapUsed / heapLimit : 0;

  return {
    status: heapLimitUsageRatio >= 0.8 ? 'warn' : 'ok',
    rssMb: Math.round(usage.rss / 1024 / 1024),
    heapUsedMb: Math.round(usage.heapUsed / 1024 / 1024),
    heapTotalMb: Math.round(usage.heapTotal / 1024 / 1024),
    heapLimitMb: Math.round(heapLimit / 1024 / 1024),
    externalMb: Math.round(usage.external / 1024 / 1024),
    heapLimitUsageRatio: Number(heapLimitUsageRatio.toFixed(2)),
  };
}

function getNodeEnv() {
  return String(process.env.NODE_ENV || 'development');
}

function getRouteProbeTimeoutMs() {
  const nodeEnv = getNodeEnv();
  return nodeEnv === 'development' ? 12000 : 8000;
}

function parsePositiveInteger(value, fallback) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return Math.floor(parsed);
}

function resolveRouteProbeTimeoutMs(value) {
  return parsePositiveInteger(value, getRouteProbeTimeoutMs());
}

function getRouteProbeConcurrency() {
  const nodeEnv = getNodeEnv();
  return nodeEnv === 'development' ? 2 : 4;
}

function resolveRouteProbeConcurrency(value) {
  return parsePositiveInteger(value, getRouteProbeConcurrency());
}

function getIpApiBaseUrl(env) {
  const configuredBaseUrl = String(env?.IP_API_BASE_URL || '').replace(/\/$/, '');
  return `${configuredBaseUrl}/json/8.8.8.8?fields=status`;
}

async function checkDatabase(env, enabled) {
  if (!enabled) {
    return {
      status: 'skipped',
      reason: 'Database check disabled for shallow health probes.',
    };
  }

  const startedAt = Date.now();

  try {
    if (env.DATABASE_URL) {
      const { prisma } = await import('@/lib/db/prisma');
      await prisma.$queryRawUnsafe('SELECT 1');

      return {
        status: 'ok',
        provider: 'postgres',
        latencyMs: Date.now() - startedAt,
      };
    }

    return {
      status: 'skipped',
      reason: 'DATABASE_URL is not configured.',
    };
  } catch (error) {
    return {
      status: 'fail',
      provider: 'postgres',
      latencyMs: Date.now() - startedAt,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}


async function checkUpstream(name, url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 3000);
  const startedAt = Date.now();

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      cache: 'no-store',
      headers: {
        'User-Agent': 'miqat-healthcheck/1.0',
      },
    });

    return {
      name,
      status: response.ok ? 'ok' : 'warn',
      httpStatus: response.status,
      latencyMs: Date.now() - startedAt,
    };
  } catch (error) {
    return {
      name,
      status: 'fail',
      latencyMs: Date.now() - startedAt,
      error: error instanceof Error ? error.message : String(error),
    };
  } finally {
    clearTimeout(timeout);
  }
}

async function checkCriticalRoute(origin, probe, timeoutMs) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  const startedAt = Date.now();
  const probeUrl = buildRouteProbeUrl(origin, probe.path);

  try {
    const response = await fetch(probeUrl, {
      signal: controller.signal,
      cache: 'no-store',
      headers: {
        Accept: 'text/html',
        'User-Agent': 'miqat-healthcheck/1.0',
        'x-route-health-probe': '1',
      },
    });
    const responseBody = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') || '';
    const normalizedContentType = contentType.toLowerCase();
    const body = (
      normalizedContentType.startsWith('text/')
      || normalizedContentType.includes('json')
      || normalizedContentType.includes('xml')
    )
      ? new TextDecoder().decode(responseBody)
      : '';
    const evaluation = evaluateRouteProbeResponse({
      status: response.status,
      body,
      expectedStatus: probe.expectedStatus,
      contentType,
      expectedContentType: probe.expectedContentType,
      bodyByteLength: responseBody.byteLength,
      minimumBodyBytes: probe.minimumBodyBytes,
      requiredMarkers: probe.requiredMarkers,
      forbiddenMarkers: probe.forbiddenMarkers,
    });

    return {
      id: probe.id,
      label: probe.label,
      path: probe.path,
      status: evaluation.status,
      reason: evaluation.reason,
      marker: evaluation.marker || null,
      httpStatus: response.status,
      latencyMs: Date.now() - startedAt,
    };
  } catch (error) {
    return {
      id: probe.id,
      label: probe.label,
      path: probe.path,
      status: 'fail',
      reason: 'route-probe-threw',
      httpStatus: null,
      latencyMs: Date.now() - startedAt,
      error: error instanceof Error ? error.message : String(error),
    };
  } finally {
    clearTimeout(timeout);
  }
}

async function runWithConcurrency(items, concurrency, handler) {
  const results = new Array(items.length);
  const safeConcurrency = Math.max(1, Math.min(concurrency, items.length || 1));
  let currentIndex = 0;

  async function worker() {
    while (currentIndex < items.length) {
      const itemIndex = currentIndex;
      currentIndex += 1;
      results[itemIndex] = await handler(items[itemIndex], itemIndex);
    }
  }

  await Promise.all(
    Array.from({ length: safeConcurrency }, () => worker()),
  );

  return results;
}

export const GET = withApiHandler('/api/health', async ({ request, requestId }) => {
  try {
    await connection();
  } catch (error) {
    if (isPrerenderConnectionError(error)) {
      return json(
        {
          ok: true,
          readiness: 'build-skip',
          service: 'ar-clock',
          version: getAppVersion(),
          timestamp: new Date().toISOString(),
          requestId,
          note: 'Health checks are skipped during static export probing.',
        },
        {
          headers: {
            'Cache-Control': 'no-store, max-age=0',
          },
        },
      );
    }

    throw error;
  }

  const { full, routes, routeTimeoutMs, routeConcurrency } = parseSearchParams(request, querySchema);
  const runtimeEnv = getRuntimeEnvHealthSnapshot();
  const runDeepChecks = isTruthy(full);
  const runRouteChecks = runDeepChecks || isTruthy(routes);
  const memory = getMemoryHealth();
  const database = runtimeEnv.status === 'ok'
    ? await checkDatabase(runtimeEnv.env, runDeepChecks)
    : {
        status: 'skipped',
        reason: 'Runtime environment is invalid, so database checks were skipped.',
      };
  const routeProbeTimeoutMs = resolveRouteProbeTimeoutMs(routeTimeoutMs);
  const routeProbeConcurrency = resolveRouteProbeConcurrency(routeConcurrency);
  const routeProbeOrigin = runRouteChecks
    ? resolveRouteProbeOrigin(
        request.url,
        getNodeEnv(),
        process.env.PORT,
      )
    : null;
  const routeChecks = runRouteChecks
    ? await runWithConcurrency(
        CRITICAL_ROUTE_PROBES,
        routeProbeConcurrency,
        (probe) => checkCriticalRoute(routeProbeOrigin, probe, routeProbeTimeoutMs),
      )
    : [];
  const ipGeoLookupEnabled = runtimeEnv.status === 'ok'
    && runtimeEnv.env.ENABLE_IP_GEO_LOOKUP === 'true';
  const upstreamChecks = runDeepChecks && runtimeEnv.status === 'ok'
    ? [
        checkUpstream(
          'open-meteo',
          'https://api.open-meteo.com/v1/forecast?latitude=24.7136&longitude=46.6753&current=temperature_2m',
        ),
        ...(ipGeoLookupEnabled ? [checkUpstream(
          'ip-api',
          getIpApiBaseUrl(runtimeEnv.env),
        )] : []),
      ]
    : [];
  const upstreams = await Promise.all(upstreamChecks);
  const environment = runtimeEnv.status === 'ok'
    ? {
        status: 'ok',
        issues: [],
      }
    : {
        status: 'fail',
        issues: runtimeEnv.issues,
      };

  const upstreamFailures = upstreams.filter((item) => item.status === 'fail').length;
  const routeFailures = routeChecks.filter((item) => item.status === 'fail').length;
  const routeWarnings = routeChecks.filter((item) => item.status === 'warn').length;
  if (environment.status === 'fail') {
    logger.error('health-runtime-env-invalid', {
      channel: 'observability',
      surface: 'health',
      requestId,
      issues: environment.issues,
    });
  }
  if (routeFailures > 0) {
    logger.error('health-critical-route-probes-failed', {
      channel: 'observability',
      surface: 'health',
      requestId,
      failedRoutes: routeChecks.filter((item) => item.status === 'fail'),
    });
  } else if (routeWarnings > 0) {
    logger.warn('health-critical-route-probes-warn', {
      channel: 'observability',
      surface: 'health',
      requestId,
      warnedRoutes: routeChecks.filter((item) => item.status === 'warn'),
    });
  }
  const readiness = environment.status === 'fail'
    ? 'not-ready'
    : (runDeepChecks && database.status === 'fail')
    ? 'not-ready'
    : routeFailures > 0
      ? 'not-ready'
    : upstreamFailures > 0
      ? 'degraded'
      : 'ready';
  const externalApis = runDeepChecks && runtimeEnv.status === 'ok'
    ? {
        status: upstreamFailures > 0 ? 'degraded' : 'ok',
        checks: upstreams,
      }
    : runDeepChecks
      ? {
          status: 'skipped',
          reason: 'Runtime environment is invalid, so external API checks were skipped.',
        }
      : {
          status: 'skipped',
          reason: 'Pass ?full=1 to run upstream dependency checks.',
        };

  return json(
    {
      ok: readiness !== 'not-ready',
      readiness,
      service: 'ar-clock',
      version: getAppVersion(),
      timestamp: new Date().toISOString(),
      requestId,
      uptimeSeconds: Math.round(process.uptime()),
      runtime: {
        nodeEnv: runtimeEnv.status === 'ok' ? runtimeEnv.env.NODE_ENV : getNodeEnv(),
        liveGeoDbEnabled: isLiveGeoDbEnabled(),
        liveGeoProvider: getLiveGeoProviderName(),
        ipGeoLookupEnabled,
      },
      checks: {
        environment,
        database,
        memory,
        routes: runRouteChecks
          ? {
              status: routeFailures > 0 ? 'fail' : routeWarnings > 0 ? 'degraded' : 'ok',
              checks: routeChecks,
            }
          : {
              status: 'skipped',
              reason: 'Pass ?routes=1 or ?full=1 to run critical route probes.',
            },
        externalApis,
      },
    },
    {
      status: readiness === 'not-ready' ? 503 : 200,
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    },
  );
});
