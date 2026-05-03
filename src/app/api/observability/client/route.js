import { z } from 'zod';

import { json, parseJsonBody, withApiHandler } from '@/lib/api/route-utils';
import { logger } from '@/lib/logger';

const bodySchema = z.object({
  level: z.enum(['WARN', 'ERROR', 'FATAL']).default('ERROR'),
  message: z.string().trim().min(1),
  timestamp: z.string().trim().optional().default(''),
  url: z.string().trim().optional().default(''),
  userAgent: z.string().trim().optional().default(''),
  details: z.record(z.string(), z.unknown()).optional().default({}),
});

export const POST = withApiHandler(
  '/api/observability/client',
  async ({ request, requestId }) => {
    const payload = await parseJsonBody(request, bodySchema);
    const method = payload.level === 'WARN' ? 'warn' : 'error';

    logger[method]('client-observability-event', {
      channel: 'browser',
      surface: 'client',
      requestId,
      clientMessage: payload.message,
      clientTimestamp: payload.timestamp || null,
      clientUrl: payload.url || null,
      userAgent: payload.userAgent || request.headers.get('user-agent') || null,
      details: payload.details,
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
