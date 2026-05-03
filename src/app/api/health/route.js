import { connection } from 'next/server';
import { z } from 'zod';

import { getLiveGeoProviderName, isLiveGeoDbEnabled } from '@/lib/db/live-geo-source';
import { getEnv } from '@/lib/env.server';
import { getAppVersion } from '@/lib/runtime-config';
import { json, parseSearchParams, withApiHandler } from '@/lib/api/route-utils';

const querySchema = z.object({
  full: z.string().trim().optional().default('0'),
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
  const heapUsageRatio = usage.heapTotal > 0 ? usage.heapUsed / usage.heapTotal : 0;

  return {
    status: heapUsageRatio >= 0.9 ? 'warn' : 'ok',
    rssMb: Math.round(usage.rss / 1024 / 1024),
    heapUsedMb: Math.round(usage.heapUsed / 1024 / 1024),
    heapTotalMb: Math.round(usage.heapTotal / 1024 / 1024),
    externalMb: Math.round(usage.external / 1024 / 1024),
    heapUsageRatio: Number(heapUsageRatio.toFixed(2)),
  };
}

async function checkDatabase(env) {
  const startedAt = Date.now();

  try {
    if (env.DATABASE_URL && (!isLiveGeoDbEnabled() || getLiveGeoProviderName() === 'postgres')) {
      const { prisma } = await import('@/lib/db/prisma');
      await prisma.$queryRawUnsafe('SELECT 1');

      return {
        status: 'ok',
        provider: 'postgres',
        latencyMs: Date.now() - startedAt,
      };
    }

    if (
      (env.SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL)
      && (env.SUPABASE_ANON_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
    ) {
      const { getSupabase } = await import('@/lib/supabase/server');
      const supabase = getSupabase();
      const { error } = await supabase
        .from('countries')
        .select('id', { head: true, count: 'exact' })
        .limit(1);

      if (error) {
        return {
          status: 'fail',
          provider: 'supabase',
          latencyMs: Date.now() - startedAt,
          error: error.message,
        };
      }

      return {
        status: 'ok',
        provider: 'supabase',
        latencyMs: Date.now() - startedAt,
      };
    }

    return {
      status: 'skipped',
      reason: 'No database provider is configured for runtime checks.',
    };
  } catch (error) {
    return {
      status: 'fail',
      provider: getLiveGeoProviderName(),
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

  const env = getEnv();
  const { full } = parseSearchParams(request, querySchema);
  const runDeepChecks = isTruthy(full);
  const memory = getMemoryHealth();
  const database = await checkDatabase(env);
  const upstreams = runDeepChecks
    ? await Promise.all([
        checkUpstream(
          'open-meteo',
          'https://api.open-meteo.com/v1/forecast?latitude=24.7136&longitude=46.6753&current=temperature_2m',
        ),
        checkUpstream(
          'ip-api',
          `${String(env.IP_API_BASE_URL || 'http://ip-api.com').replace(/\/$/, '')}/json/8.8.8.8?fields=status`,
        ),
      ])
    : [];

  const upstreamFailures = upstreams.filter((item) => item.status === 'fail').length;
  const readiness = database.status === 'fail'
    ? 'not-ready'
    : upstreamFailures > 0
      ? 'degraded'
      : 'ready';

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
        nodeEnv: env.NODE_ENV,
        liveGeoDbEnabled: isLiveGeoDbEnabled(),
        liveGeoProvider: getLiveGeoProviderName(),
      },
      checks: {
        database,
        memory,
        externalApis: runDeepChecks
          ? {
              status: upstreamFailures > 0 ? 'degraded' : 'ok',
              checks: upstreams,
            }
          : {
              status: 'skipped',
              reason: 'Pass ?full=1 to run upstream dependency checks.',
            },
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
