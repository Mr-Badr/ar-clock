import { featureFlags } from '@/lib/feature-flags';
import { logger } from '@/lib/logger';

function nowIso() {
  return new Date().toISOString();
}

export function logEvent(message, context = {}) {
  if (!featureFlags.observabilityLogs) return;
  logger.info(message, {
    channel: 'observability',
    observedAt: nowIso(),
    ...context,
  });
}

export function logError(message, context = {}) {
  logger.error(message, {
    channel: 'observability',
    observedAt: nowIso(),
    ...context,
  });
}
