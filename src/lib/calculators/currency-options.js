export const DEFAULT_GLOBAL_CURRENCY = 'USD';

export const QUICK_CURRENCY_CODES = [
  'SAR',
  'AED',
  'EGP',
  'MAD',
  'KWD',
  'QAR',
  'USD',
  'EUR',
];

const PREFERRED_CURRENCY_CODES = [
  'SAR',
  'AED',
  'EGP',
  'MAD',
  'KWD',
  'QAR',
  'BHD',
  'OMR',
  'JOD',
  'DZD',
  'TND',
  'IQD',
  'LYD',
  'YER',
  'SDG',
  'LBP',
  'SYP',
  'ILS',
  'MRU',
  'DJF',
  'SOS',
  'KMF',
  'USD',
  'EUR',
  'GBP',
  'TRY',
  'CAD',
  'AUD',
  'NZD',
  'CHF',
  'SEK',
  'NOK',
  'DKK',
  'PLN',
  'CZK',
  'RON',
  'HUF',
  'ZAR',
  'NGN',
  'KES',
  'JPY',
  'CNY',
  'HKD',
  'SGD',
  'MYR',
  'IDR',
  'KRW',
  'THB',
  'VND',
  'INR',
  'PKR',
  'MXN',
  'BRL',
  'ARS',
  'CLP',
  'COP',
];

function getSupportedCurrencyCodes() {
  // Deliberately NOT using `Intl.supportedValuesOf('currency')` here (found 2026-08-04 while
  // shipping the personal-finance tools-v2 pages): that API enumerates the FULL ICU currency
  // list, whose contents AND whose `Intl.DisplayNames` labels can differ between Node's
  // server-side ICU build and the browser's — confirmed via a live hydration mismatch on 'SLL'
  // (old Sierra Leonean Leone, redenominated to 'SLE' in 2022): Node rendered "SLL — ليون
  // سيراليوني - 1964-2022" while Chromium rendered "SLE — ليون سيراليوني" for the exact same
  // code, because the two ICU/CLDR data versions disagree on it. The curated, static
  // PREFERRED_CURRENCY_CODES list avoids this entirely — it never changes at runtime, so SSR
  // and CSR always enumerate the identical set of codes.
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
