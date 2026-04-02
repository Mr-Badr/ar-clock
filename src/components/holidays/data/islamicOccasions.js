/**
 * data/islamicOccasions.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Shared data builders for the /holidays educational sections.
 *
 * Important:
 * - We read canonical event core data from src/lib/events
 * - We read rich content overlays from src/lib/event-content
 * - We resolve year tokens from the request-scoped nowIso passed by the page
 *
 * This keeps the sections aligned with the JSON-first holiday architecture and
 * avoids depending on canonical raw-event lists for rich fields like
 * quickFacts, faq, and countryDates.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import {
  HIJRI_MONTHS_AR,
  approxHijriYear,
  formatGregorianAr,
  getEventBySlug,
  replaceTokens,
} from '@/lib/holidays-engine';
import { getRichContent } from '@/lib/event-content';
import { buildCountryDateRows } from '@/lib/holidays/country-dates';

const ICONS = {
  ramadan: '🌙',
  'eid-al-fitr': '🎉',
  'eid-al-adha': '🐑',
  'laylat-al-qadr': '⭐',
  'isra-miraj': '🕌',
  mawlid: '🌹',
  ashura: '📅',
  'day-of-arafa': '🕋',
  'hajj-start': '🏔',
  'islamic-new-year': '🗓',
  'nisf-shaban': '✨',
  'first-dhul-hijjah': '📿',
};

const COLORS = {
  ramadan: 'var(--warning)',
  'eid-al-fitr': 'var(--success)',
  'eid-al-adha': 'var(--success)',
  'laylat-al-qadr': 'var(--accent-alt)',
  'isra-miraj': 'var(--info)',
  mawlid: 'var(--warning)',
  ashura: 'var(--danger)',
  'day-of-arafa': 'var(--accent-alt)',
  'hajj-start': 'var(--info)',
  'islamic-new-year': 'var(--accent-alt)',
  'nisf-shaban': 'var(--accent-alt)',
  'first-dhul-hijjah': 'var(--warning)',
};

const BADGES = {
  ramadan: 'صيام',
  'eid-al-fitr': 'عيد',
  'eid-al-adha': 'عيد',
  'laylat-al-qadr': 'روحاني',
  'isra-miraj': 'ديني',
  mawlid: 'ديني',
  ashura: 'هجري',
  'day-of-arafa': 'حج',
  'hajj-start': 'حج',
  'islamic-new-year': 'هجري',
  'nisf-shaban': 'ديني',
  'first-dhul-hijjah': 'ديني',
};

const FEATURED_IDS = [
  'ramadan',
  'eid-al-fitr',
  'eid-al-adha',
  'laylat-al-qadr',
  'isra-miraj',
  'mawlid',
  'ashura',
  'day-of-arafa',
];

const COUNTRY_DATE_IDS = ['ramadan', 'eid-al-fitr', 'eid-al-adha'];

function buildTokenContext(event, gregorianYear, hijriYear) {
  return {
    ...event,
    year: gregorianYear,
    hijriYear,
    eventName: event.name,
    formattedDate: formatGregorianAr(new Date(`${gregorianYear}-01-01`)),
  };
}

function readEvent(slug) {
  const base = getEventBySlug(slug);
  if (!base) return null;
  return {
    ...base,
    ...getRichContent(slug),
  };
}

function tokenized(value, context) {
  return replaceTokens(value || '', context);
}

function buildHijriDate(event, context) {
  const quickFacts = Array.isArray(event.quickFacts) ? event.quickFacts : [];
  const quickFactValue = quickFacts.find((fact) => fact.label === 'التاريخ الهجري')?.value;
  if (quickFactValue) return tokenized(quickFactValue, context);

  const monthName = HIJRI_MONTHS_AR[event.hijriMonth] || '';
  if (!event.hijriDay) return monthName;
  return `${event.hijriDay} ${monthName}`;
}

function buildDuration(event, context) {
  const quickFacts = Array.isArray(event.quickFacts) ? event.quickFacts : [];
  const quickFactValue = quickFacts.find((fact) => fact.label === 'المدة')?.value;
  return tokenized(quickFactValue || 'يوم واحد', context);
}

function mapRichEvent(event, gregorianYear, hijriYear) {
  const context = buildTokenContext(event, gregorianYear, hijriYear);
  return {
    id: event.id,
    slug: event.slug,
    name: event.name,
    hijriDate: buildHijriDate(event, context),
    duration: buildDuration(event, context),
    badge: BADGES[event.id] || 'ديني',
    description: tokenized(event.details || event.description, context),
    keywords: (Array.isArray(event.keywords) ? event.keywords : []).map((keyword) => tokenized(keyword, context)),
    color: COLORS[event.id] || 'var(--accent-alt)',
    icon: ICONS[event.id] || '🌙',
    quickFacts: (Array.isArray(event.quickFacts) ? event.quickFacts : []).map((fact) => ({
      ...fact,
      label: tokenized(fact.label, context),
      value: tokenized(fact.value, context),
    })),
    faqItems: (Array.isArray(event.faqItems) ? event.faqItems : []).map((item) => ({
      ...item,
      q: tokenized(item.q, context),
      a: tokenized(item.a, context),
    })),
    countryDates: (Array.isArray(event.countryDates) ? event.countryDates : []).map((row) => ({
      ...row,
      date: tokenized(row.date, context),
      note: tokenized(row.note, context),
    })),
    history: tokenized(event.history, context),
    significance: tokenized(event.significance, context),
  };
}

export function buildIslamicOccasions(nowIso) {
  const gregorianYear = new Date(nowIso).getFullYear();
  const hijriYear = approxHijriYear(gregorianYear);

  return FEATURED_IDS
    .map(readEvent)
    .filter(Boolean)
    .map((event) => mapRichEvent(event, gregorianYear, hijriYear));
}

export async function buildIslamicCountryDateCards(nowIso) {
  const gregorianYear = new Date(nowIso).getFullYear();
  const hijriYear = approxHijriYear(gregorianYear);

  const cards = await Promise.all(
    COUNTRY_DATE_IDS
      .map(readEvent)
      .filter(Boolean)
      .map(async (event) => {
        const mapped = mapRichEvent(event, gregorianYear, hijriYear);
        const tokenContext = buildTokenContext(event, gregorianYear, hijriYear);
        const targetDate = new Date(`${gregorianYear}-01-01T00:00:00.000Z`);
        const countryDates = await buildCountryDateRows({
          event,
          targetDate,
          tokenContext,
        });

        return {
          id: mapped.id,
          name: mapped.name,
          hijriDate: mapped.hijriDate,
          color: mapped.color,
          icon: mapped.icon,
          countryDates,
        };
      }),
  );

  return cards;
}
