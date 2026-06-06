import { getAppVersion } from '@/lib/runtime-config';

type HealthPayload = {
  ok?: boolean;
  readiness?: string;
  service?: string;
  version?: string;
  checks?: {
    environment?: {
      status?: string;
      issues?: Array<{
        path?: string;
        message?: string;
      }>;
    };
    routes?: {
      status?: string;
      checks?: Array<{
        id?: string;
        path?: string;
        status?: string;
        reason?: string | null;
        httpStatus?: number | null;
      }>;
    };
  };
};

function parseBaseUrl(argv: string[]) {
  const explicitBase = argv.find((value) => value.startsWith('--base='));
  if (explicitBase) {
    return explicitBase.slice('--base='.length);
  }

  return process.env.ROUTE_HEALTH_BASE_URL || 'http://127.0.0.1:3000';
}

function parsePositiveIntegerArg(argv: string[], name: string) {
  const explicitValue = argv.find((value) => value.startsWith(`--${name}=`));
  if (!explicitValue) return null;

  const parsedValue = Number(explicitValue.slice(`--${name}=`.length));
  if (!Number.isFinite(parsedValue) || parsedValue <= 0) return null;

  return Math.floor(parsedValue);
}

async function main() {
  const args = process.argv.slice(2);
  const baseUrl = parseBaseUrl(args).replace(/\/$/, '');
  const query = new URLSearchParams({ full: '1', routes: '1' });
  const routeTimeoutMs = parsePositiveIntegerArg(args, 'route-timeout-ms');
  const routeConcurrency = parsePositiveIntegerArg(args, 'route-concurrency');
  const requestTimeoutMs = parsePositiveIntegerArg(args, 'request-timeout-ms');

  if (routeTimeoutMs) query.set('routeTimeoutMs', String(routeTimeoutMs));
  if (routeConcurrency) query.set('routeConcurrency', String(routeConcurrency));

  const url = `${baseUrl}/api/health?${query.toString()}`;
  const controller = requestTimeoutMs ? new AbortController() : null;
  const timeout = requestTimeoutMs
    ? setTimeout(() => controller?.abort(), requestTimeoutMs)
    : null;
  let response: Response;
  try {
    response = await fetch(url, {
      headers: {
        Accept: 'application/json',
        'User-Agent': `miqat-route-health/${getAppVersion()}`,
      },
      cache: 'no-store',
      signal: controller?.signal,
    });
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    throw new Error(`Route health endpoint fetch failed for ${url}: ${reason}`);
  } finally {
    if (timeout) clearTimeout(timeout);
  }
  const body = await response.text();
  let payload: HealthPayload | null = null;

  try {
    payload = JSON.parse(body) as HealthPayload;
  } catch {
    payload = null;
  }

  if (!payload) {
    throw new Error(`Route health endpoint returned a non-JSON response (${response.status}): ${body.slice(0, 400)}`);
  }

  const routeChecks = Array.isArray(payload?.checks?.routes?.checks) ? payload.checks.routes.checks : [];
  const failedChecks = routeChecks.filter((check) => check?.status === 'fail');
  const environmentIssues = Array.isArray(payload?.checks?.environment?.issues)
    ? payload.checks.environment.issues
    : [];

  console.log('[route-health] summary');
  console.log(JSON.stringify({
    baseUrl,
    httpStatus: response.status,
    readiness: payload?.readiness || null,
    environmentStatus: payload?.checks?.environment?.status || null,
    environmentIssues: environmentIssues.length,
    routeStatus: payload?.checks?.routes?.status || null,
    routeChecks: routeChecks.length,
    failedChecks: failedChecks.length,
  }, null, 2));

  if (!response.ok || failedChecks.length > 0 || payload?.readiness === 'not-ready') {
    console.error('[route-health] failed checks');
    console.error(JSON.stringify({
      environmentIssues,
      failedChecks,
    }, null, 2));
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error('[route-health] crashed');
  console.error(error instanceof Error ? error.stack || error.message : String(error));
  process.exitCode = 1;
});
