export const DISCOVERY_RECENT_SEARCHES_KEY = 'miqatona:discovery:recent-searches';
export const DISCOVERY_RECENT_VISITS_KEY = 'miqatona:discovery:recent-visits';

function normalizeText(value) {
  return String(value || '').trim().replace(/\s+/g, ' ');
}

export function trimDiscoveryTitle(value) {
  return normalizeText(String(value || '').split('|')[0]);
}

export function readDiscoveryHistory(key) {
  if (typeof window === 'undefined') return [];

  try {
    const raw = window.localStorage.getItem(key);
    const parsed = JSON.parse(raw || '[]');
    return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
  } catch {
    return [];
  }
}

export function writeDiscoveryHistory(key, entries) {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(key, JSON.stringify(entries));
  } catch {
    // Ignore storage failures in private mode or constrained browsers.
  }
}

export function pushDiscoveryHistory(key, entry, { max = 8, idKey = 'href' } = {}) {
  const normalizedEntry = Object.fromEntries(
    Object.entries(entry || {}).map(([field, value]) => [field, normalizeText(value)]),
  );

  if (!normalizedEntry[idKey]) {
    return readDiscoveryHistory(key);
  }

  const currentEntries = readDiscoveryHistory(key);
  const nextEntries = [
    normalizedEntry,
    ...currentEntries.filter((item) => item?.[idKey] !== normalizedEntry[idKey]),
  ].slice(0, max);

  writeDiscoveryHistory(key, nextEntries);
  return nextEntries;
}

export function getDiscoveryIconKey(pathname = '') {
  if (pathname.startsWith('/calculators')) return 'calculator';
  if (pathname.startsWith('/economie')) return 'economy';
  if (pathname.startsWith('/guides')) return 'guide';
  if (pathname.startsWith('/holidays')) return 'holiday';
  if (pathname.startsWith('/date')) return 'date';
  if (pathname.startsWith('/mwaqit-al-salat')) return 'prayer';
  if (pathname.startsWith('/time-difference')) return 'difference';
  if (pathname.startsWith('/time-now')) return 'clock';
  return 'page';
}
