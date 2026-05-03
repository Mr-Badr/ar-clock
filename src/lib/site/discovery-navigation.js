import { logger, serializeError } from '@/lib/logger';

function isAbsoluteHttpUrl(value) {
  return value.startsWith('http://') || value.startsWith('https://');
}

export function normalizeDiscoveryNavigationHref(rawHref) {
  if (typeof rawHref !== 'string') return null;

  const href = rawHref.trim();
  if (!href) return null;

  try {
    if (isAbsoluteHttpUrl(href)) {
      const absoluteUrl = new URL(href);
      return `${absoluteUrl.pathname}${absoluteUrl.search}${absoluteUrl.hash}`;
    }

    if (!href.startsWith('/')) {
      return null;
    }

    const relativeUrl = new URL(href, 'https://miqatona.local');
    return `${relativeUrl.pathname}${relativeUrl.search}${relativeUrl.hash}`;
  } catch {
    return null;
  }
}

export function getCurrentClientHref() {
  if (typeof window === 'undefined') return null;
  return `${window.location.pathname}${window.location.search}${window.location.hash}`;
}

export function navigateToDiscoveryHref({
  router,
  rawHref,
  source,
  context = {},
}) {
  const href = normalizeDiscoveryNavigationHref(rawHref);

  if (!href) {
    logger.warn('discovery-navigation-invalid-href', {
      source,
      rawHref,
      ...context,
    });
    return false;
  }

  const currentHref = getCurrentClientHref();
  if (currentHref === href) {
    return false;
  }

  try {
    router.push(href);
    return true;
  } catch (error) {
    logger.warn('discovery-navigation-router-push-failed', {
      source,
      href,
      currentHref,
      error: serializeError(error),
      ...context,
    });

    if (typeof window !== 'undefined') {
      window.location.assign(href);
      return true;
    }

    return false;
  }
}
