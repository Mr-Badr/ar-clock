import { featureFlags } from '@/lib/feature-flags';

function nowIso() {
  return new Date().toISOString();
}

export function logEvent(message, context = {}) {
  if (!featureFlags.observabilityLogs) return;
  console.info(`[obs ${nowIso()}] ${message}`, context);
}

export function logError(message, context = {}) {
  console.error(`[obs ${nowIso()}] ${message}`, context);
}

