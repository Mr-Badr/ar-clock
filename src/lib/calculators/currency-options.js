export const DEFAULT_GLOBAL_CURRENCY = 'USD';

const PREFERRED_CURRENCY_CODES = [
  'USD',
  'EUR',
  'GBP',
  'SAR',
  'AED',
  'EGP',
  'MAD',
  'DZD',
  'KWD',
  'QAR',
  'BHD',
  'OMR',
  'JOD',
  'TRY',
  'CAD',
  'AUD',
  'JPY',
  'CNY',
  'INR',
  'PKR',
];

function getSupportedCurrencyCodes() {
  if (typeof Intl.supportedValuesOf === 'function') {
    try {
      return Intl.supportedValuesOf('currency');
    } catch {}
  }
  return PREFERRED_CURRENCY_CODES;
}

export function sanitizeCurrencyCode(value, fallback = DEFAULT_GLOBAL_CURRENCY) {
  const normalized = String(value || '')
    .trim()
    .toUpperCase();
  if (!normalized) return fallback;
  const supported = new Set(getSupportedCurrencyCodes());
  return supported.has(normalized) ? normalized : fallback;
}

export function getCurrencyOptions(locale = 'ar') {
  const supported = getSupportedCurrencyCodes();
  const displayNames = typeof Intl.DisplayNames === 'function'
    ? new Intl.DisplayNames([locale], { type: 'currency' })
    : null;

  const preferred = PREFERRED_CURRENCY_CODES.filter((code) => supported.includes(code));
  const remaining = supported
    .filter((code) => !preferred.includes(code))
    .sort((a, b) => a.localeCompare(b));

  return [...preferred, ...remaining].map((code) => ({
    code,
    label: `${code} — ${displayNames?.of(code) || code}`,
  }));
}
