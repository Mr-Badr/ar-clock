const DEFAULT_FIELDS = [
  'status',
  'message',
  'country',
  'countryCode',
  'city',
  'lat',
  'lon',
  'timezone',
];

function getIpLookupBaseUrl() {
  return String(process.env.IP_API_BASE_URL || '').trim().replace(/\/$/, '');
}

export function isIpGeoLookupEnabled() {
  return process.env.ENABLE_IP_GEO_LOOKUP === 'true';
}

function buildIpLookupUrl(ip, fields = DEFAULT_FIELDS) {
  const baseUrl = getIpLookupBaseUrl();
  if (!baseUrl) return '';

  const encodedIp = encodeURIComponent(String(ip || '').trim());
  const encodedFields = Array.isArray(fields) ? fields.join(',') : DEFAULT_FIELDS.join(',');
  return `${baseUrl}/json/${encodedIp}?fields=${encodedFields}`;
}

export async function lookupIpGeo(ip, options = {}) {
  const normalizedIp = String(ip || '').trim();
  if (!isIpGeoLookupEnabled() || !normalizedIp) return null;
  const lookupUrl = buildIpLookupUrl(normalizedIp, options.fields);
  if (!lookupUrl) return null;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), options.timeoutMs || 3500);

  try {
    const response = await fetch(lookupUrl, {
      signal: controller.signal,
      next: { revalidate: options.revalidate ?? 3600 },
      headers: {
        'User-Agent': 'miqat-ip-lookup/1.0',
      },
    });

    if (!response.ok) return null;
    const data = await response.json();
    if (data?.status !== 'success') return null;
    return data;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}
