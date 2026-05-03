import { getAppVersion } from '@/lib/runtime-config';

function getConsoleMethod(level) {
  if (level === 'fatal') return 'error';
  return level;
}

const CORE_PAYLOAD_KEYS = new Set(['level', 'timestamp', 'app', 'version', 'message']);
const HANDLED_BROWSER_MESSAGES = new Set([
  'next-route-error-boundary',
  'next-global-error-boundary',
  'client-error-boundary-triggered',
]);
const CLIENT_REPORT_LEVELS = new Set(['WARN', 'ERROR', 'FATAL']);
const CLIENT_REPORT_TRUTHY_VALUES = new Set(['1', 'true', 'yes', 'on']);

function getObjectTag(value) {
  return Object.prototype.toString.call(value).slice(8, -1);
}

export function serializeError(error) {
  if (!error) return null;

  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
      cause: error.cause ? serializeError(error.cause) : undefined,
    };
  }

  if (typeof error === 'object') {
    const objectTag = getObjectTag(error);
    const plainObject = { ...error };

    if (Object.keys(plainObject).length > 0) {
      return plainObject;
    }

    return {
      name: objectTag,
      message:
        typeof error?.message === 'string'
          ? error.message
          : typeof error?.type === 'string'
            ? error.type
            : String(error),
    };
  }

  return { message: String(error) };
}

function toLogPayload(level, message, context = {}) {
  const payload = {
    level: level.toUpperCase(),
    timestamp: new Date().toISOString(),
    app: 'ar-clock',
    version: getAppVersion(),
    message,
  };

  if (!context || typeof context !== 'object') {
    return { ...payload, context };
  }

  return { ...payload, ...context };
}

function isEmptyObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value) && Object.keys(value).length === 0;
}

function buildBrowserLogDetails(payload) {
  const details = Object.fromEntries(
    Object.entries(payload).filter(([key, value]) => (
      !CORE_PAYLOAD_KEYS.has(key) && value !== undefined
    )),
  );

  if (isEmptyObject(details.error)) {
    delete details.error;
  }

  return details;
}

function formatBrowserLogLabel(payload) {
  const parts = [`[${payload.level}]`, payload.message];

  if (payload.boundary) {
    parts.push(`(${payload.boundary})`);
  }

  if (payload.error?.message) {
    parts.push(`- ${payload.error.message}`);
  }

  return parts.join(' ');
}

function resolveBrowserConsoleMethod(method, payload) {
  if (payload.handled || HANDLED_BROWSER_MESSAGES.has(payload.message)) {
    return method === 'error' ? 'warn' : method;
  }

  return method;
}

function isClientReportEnabled() {
  const rawValue = String(process.env.NEXT_PUBLIC_OBSERVABILITY_LOGS || '').trim().toLowerCase();
  return CLIENT_REPORT_TRUTHY_VALUES.has(rawValue);
}

function shouldReportClientPayload(payload) {
  if (typeof window === 'undefined') return false;
  if (!isClientReportEnabled()) return false;
  if (!CLIENT_REPORT_LEVELS.has(payload.level)) return false;
  if (payload.message === 'client-observability-report-failed') return false;
  return true;
}

function reportClientPayload(payload) {
  if (!shouldReportClientPayload(payload)) return;

  const details = buildBrowserLogDetails(payload);
  const report = JSON.stringify({
    level: payload.level,
    message: payload.message,
    timestamp: payload.timestamp,
    url: window.location?.href || '',
    userAgent: window.navigator?.userAgent || '',
    details,
  });

  try {
    if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
      const blob = new Blob([report], { type: 'application/json' });
      navigator.sendBeacon('/api/observability/client', blob);
      return;
    }

    void fetch('/api/observability/client', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: report,
      keepalive: true,
    });
  } catch {
    // Logging must never throw back into the UI.
  }
}

function writeLog(level, message, context = {}) {
  const method = getConsoleMethod(level);
  const payload = toLogPayload(level, message, context);

  if (typeof window !== 'undefined') {
    const browserMethod = resolveBrowserConsoleMethod(method, payload);
    const details = buildBrowserLogDetails(payload);
    const label = formatBrowserLogLabel(payload);

    if (Object.keys(details).length > 0) {
      console[browserMethod](label, details);
      reportClientPayload(payload);
      return;
    }

    console[browserMethod](label);
    reportClientPayload(payload);
    return;
  }

  console[method](payload);
}

export const logger = {
  info(message, context = {}) {
    writeLog('info', message, context);
  },
  warn(message, context = {}) {
    writeLog('warn', message, context);
  },
  error(message, context = {}) {
    writeLog('error', message, context);
  },
  fatal(message, context = {}) {
    writeLog('fatal', message, context);
  },
};
