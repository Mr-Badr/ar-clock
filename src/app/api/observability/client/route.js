import { z } from 'zod';

import { json, parseJsonBody, withApiHandler } from '@/lib/api/route-utils';
import { logger } from '@/lib/logger';

const MAX_MESSAGE_LENGTH = 1_000;
const MAX_TIMESTAMP_LENGTH = 80;
const MAX_URL_LENGTH = 2_048;
const MAX_USER_AGENT_LENGTH = 512;
const MAX_DETAILS_KEYS = 20;
const MAX_DETAILS_KEY_LENGTH = 80;
const MAX_DETAILS_VALUE_LENGTH = 500;

const bodySchema = z.object({
  level: z.enum(['WARN', 'ERROR', 'FATAL']).default('ERROR'),
  message: z.string().trim().min(1).max(MAX_MESSAGE_LENGTH),
  timestamp: z.string().trim().max(MAX_TIMESTAMP_LENGTH).optional().default(''),
  url: z.string().trim().max(MAX_URL_LENGTH).optional().default(''),
  userAgent: z.string().trim().max(MAX_USER_AGENT_LENGTH).optional().default(''),
  details: z.record(z.string(), z.unknown()).optional().default({}),
});

function truncate(value, maxLength) {
  const text = String(value);
  return text.length > maxLength ? text.slice(0, maxLength) : text;
}

function sanitizeClientUrl(value) {
  if (!value) return null;

  try {
    const url = new URL(value);
    return `${url.origin}${url.pathname}`;
  } catch {
    const [withoutHash] = value.split('#');
    const [withoutQuery] = String(withoutHash || '').split('?');
    const sanitized = truncate(withoutQuery.trim(), MAX_URL_LENGTH);
    return sanitized || null;
  }
}

function sanitizeDetailValue(value) {
  if (value === null || value === undefined) return value;
  if (typeof value === 'string') return truncate(value, MAX_DETAILS_VALUE_LENGTH);
  if (typeof value === 'number' || typeof value === 'boolean') return value;

  try {
    return truncate(JSON.stringify(value), MAX_DETAILS_VALUE_LENGTH);
  } catch {
    return truncate(String(value), MAX_DETAILS_VALUE_LENGTH);
  }
}

function sanitizeDetails(details) {
  const entries = Object.entries(details).slice(0, MAX_DETAILS_KEYS);

  return Object.fromEntries(
    entries.map(([key, value]) => [
      truncate(key, MAX_DETAILS_KEY_LENGTH),
      sanitizeDetailValue(value),
    ]),
  );
}

export const POST = withApiHandler(
  '/api/observability/client',
  async ({ request, requestId }) => {
    const payload = await parseJsonBody(request, bodySchema);
    const method = payload.level === 'WARN' ? 'warn' : 'error';
    const userAgent = payload.userAgent || request.headers.get('user-agent') || '';

    logger[method]('client-observability-event', {
      channel: 'browser',
      surface: 'client',
      requestId,
      clientMessage: payload.message,
      clientTimestamp: payload.timestamp || null,
      clientUrl: sanitizeClientUrl(payload.url),
      userAgent: userAgent ? truncate(userAgent, MAX_USER_AGENT_LENGTH) : null,
      details: sanitizeDetails(payload.details),
    });

    return json({ ok: true, requestId });
  },
  {
    rateLimit: {
      key: 'client-observability',
      limit: 90,
      windowMs: 60_000,
    },
  },
);
