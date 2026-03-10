
/**
 * lib/country-utils.js
 * 
 * Utilities for country-related data.
 */

/**
 * Converts ISO 3166-1 alpha-2 country code to emoji flag.
 * @param {string} countryCode - e.g. "MA", "SA", "EG"
 * @returns {string} - Emoji flag
 */
export function getFlagEmoji(countryCode) {
  if (!countryCode || countryCode.length !== 2) return '🌍';
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

/**
 * Maps common country codes or aliases to valid IANA timezone names.
 * This handles cases where the database might store "SA" or "QA" instead of a zone.
 */
const TZ_MAP = {
  'SA': 'Asia/Riyadh',
  'QA': 'Asia/Qatar',
  'EG': 'Africa/Cairo',
  'MA': 'Africa/Casablanca',
  'AE': 'Asia/Dubai',
  'KW': 'Asia/Kuwait',
  'QA': 'Asia/Qatar',
  'BH': 'Asia/Bahrain',
  'OM': 'Asia/Muscat',
  'JO': 'Asia/Amman',
  'LB': 'Asia/Beirut',
  'SY': 'Asia/Damascus',
  'IQ': 'Asia/Baghdad',
  'YE': 'Asia/Aden',
  'PS': 'Asia/Gaza',
  'DZ': 'Africa/Algiers',
  'TN': 'Africa/Tunis',
  'LY': 'Africa/Tripoli',
  'SD': 'Africa/Khartoum',
  'DJ': 'Africa/Djibouti',
  'SO': 'Africa/Mogadishu',
  'KM': 'Indian/Comoro',
  'MR': 'Africa/Nouakchott',
  'UK': 'Europe/London',
  'GB': 'Europe/London',
  'US': 'America/New_York',
  'CA': 'America/Toronto',
  'FR': 'Europe/Paris',
  'DE': 'Europe/Berlin',
  'IT': 'Europe/Rome',
  'ES': 'Europe/Madrid',
  'PT': 'Europe/Lisbon',
  'IE': 'Europe/Dublin',
  'TR': 'Europe/Istanbul',
  'RU': 'Europe/Moscow',
  'CN': 'Asia/Shanghai',
  'JP': 'Asia/Tokyo',
  'IN': 'Asia/Kolkata',
  'BR': 'America/Sao_Paulo',
  'ID': 'Asia/Jakarta',
  'MY': 'Asia/Kuala_Lumpur',
  'TH': 'Asia/Bangkok',
  'VN': 'Asia/Ho_Chi_Minh',
  'PH': 'Asia/Manila',
  'SG': 'Asia/Singapore',
  'AU': 'Australia/Sydney',
  'NZ': 'Pacific/Auckland',
  'ZA': 'Africa/Johannesburg',
};

/**
 * Normalizes a timezone string, falling back to a likely default if it looks like a country code.
 * @param {string} tz - The timezone string from DB
 * @returns {string|null} - A valid IANA timezone or null if unknown
 */
export function getSafeTimezone(tz) {
  if (!tz) return null;
  // If it's already a valid IANA zone (contains /), return it
  if (tz.includes('/')) return tz;
  // Try mapping
  return TZ_MAP[tz.toUpperCase()] || null;
}

/**
 * Server-safe validation for IANA timezone.
 */
export function isValidTimeZone(tz) {
  const resolved = getSafeTimezone(tz);
  if (!resolved) return false;
  try {
    Intl.DateTimeFormat('en-US', { timeZone: resolved });
    return true;
  } catch {
    return false;
  }
}
