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
  return (process.env.IP_API_BASE_URL || 'http://ip-api.com').replace(/\/$/, '');
}

function buildIpLookupUrl(ip, fields = DEFAULT_FIELDS) {
  const encodedIp = encodeURIComponent(String(ip || '').trim());
  const encodedFields = Array.isArray(fields) ? fields.join(',') : DEFAULT_FIELDS.join(',');
  return `${getIpLookupBaseUrl()}/json/${encodedIp}?fields=${encodedFields}`;
}

export async function lookupIpGeo(ip, options = {}) {
  const normalizedIp = String(ip || '').trim();
  if (!normalizedIp) return null;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), options.timeoutMs || 3500);

  try {
    const response = await fetch(buildIpLookupUrl(normalizedIp, options.fields), {
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
