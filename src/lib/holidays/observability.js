import { logError } from '@/lib/observability';

function serializeHolidayError(error) {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
    };
  }

  return {
    message: String(error),
  };
}

export function buildHolidayFailureContext(input) {
  const slug = String(input?.slug || '').trim() || null;
  const canonicalSlug = String(input?.canonicalSlug || '').trim() || null;
  const section = String(input?.section || '').trim() || null;
  const degraded = Boolean(input?.degraded);
  const routePath = slug ? `/holidays/${slug}` : null;
  const extraContext = input?.extraContext && typeof input.extraContext === 'object'
    ? input.extraContext
    : {};

  return {
    slug,
    canonicalSlug,
    routePath,
    section,
    degraded,
    error: serializeHolidayError(input?.error),
    ...extraContext,
  };
}

export function logHolidayFailure(message, input) {
  logError(message, buildHolidayFailureContext(input));
}
