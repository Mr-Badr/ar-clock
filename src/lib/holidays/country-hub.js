/**
 * Country hub model builder — turns the verified per-country holiday lists in
 * country-hub-data.js into a fully computed, render-ready model:
 * current-year Gregorian dates, precise Umm al-Qura Hijri labels, live status
 * (passed / today / active / upcoming), countdown target, long-weekend
 * detection against the country's actual weekend, and ICS calendar content.
 *
 * Hijri dates for UPCOMING rows are resolved through the same
 * `resolveAllHijriEvents` + `getNextEventDate` pipeline the event pages use,
 * so the hub never shows a different date than the countdown page it links to.
 */

import { cacheLife, cacheTag } from 'next/cache';

import {
  convertGregorianDayForCalendar,
  convertHijriDayForCalendar,
  DAY_NAMES_AR,
  GREGORIAN_MONTH_NAMES_AR,
  ISLAMIC_MONTH_NAMES_AR,
} from '@/lib/date-adapter';
import { getHolidayCoreEventBySlug } from '@/lib/holidays/repository';
import { formatGregorianAr, getNextEventDate, getTimeRemaining } from '@/lib/holidays-engine';
import { resolveAllHijriEvents } from '@/lib/hijri-resolver';

import { getCountryHubBySlug } from './country-hub-data';

const DAY_MS = 86_400_000;

function atMidnight(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function hijriLabelFor(date) {
  try {
    const h = convertGregorianDayForCalendar(date.getFullYear(), date.getMonth() + 1, date.getDate());
    return `${h.day} ${ISLAMIC_MONTH_NAMES_AR[h.month - 1]} ${h.year} هـ`;
  } catch {
    return null;
  }
}

/** Gregorian Easter Sunday (Gauss algorithm) — mirrors holidays-engine.js's easterSunday(). */
function easterSunday(year) {
  const a = year % 19, b = Math.floor(year / 100), c = year % 100, d = Math.floor(b / 4), e = b % 4;
  const f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3), h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7, m = Math.floor((a + 11 * h + 22 * l) / 451);
  const mo = Math.floor((h + l - 7 * m + 114) / 31), dy = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, mo - 1, dy);
}

/** Orthodox (Julian-calendar) Easter Sunday, converted to the Gregorian date — Meeus' Julian algorithm + the 13-day Julian→Gregorian offset (valid 1900–2099). */
function orthodoxEasterSunday(year) {
  const a = year % 4, b = year % 7, c = year % 19;
  const d = (19 * c + 15) % 30;
  const e = (2 * a + 4 * b - d + 34) % 7;
  const month = Math.floor((d + e + 114) / 31);
  const day = ((d + e + 114) % 31) + 1;
  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() + 13);
  return date;
}

/** The single occurrence of `weekday` inside an inclusive Gregorian date range within one year. */
function weekdayInRange(year, weekday, startMonth, startDay, endMonth, endDay) {
  const start = new Date(year, startMonth - 1, startDay);
  const end = new Date(year, endMonth - 1, endDay);
  const offset = (weekday - start.getDay() + 7) % 7;
  const date = new Date(start);
  date.setDate(date.getDate() + offset);
  return date.getTime() <= end.getTime() ? date : null;
}

/** Nth (or last, nth:-1) weekday-of-month occurrence — mirrors holidays-engine.js's floating logic. */
function nthWeekdayOfMonth(year, month, weekday, nth) {
  if (nth === -1) {
    const lastDayOfMonth = new Date(year, month, 0);
    const diff = (lastDayOfMonth.getDay() - weekday + 7) % 7;
    return new Date(year, month - 1, lastDayOfMonth.getDate() - diff);
  }
  const first = new Date(year, month - 1, 1);
  const offset = (weekday - first.getDay() + 7) % 7;
  const dayOfMonth = 1 + offset + (nth - 1) * 7;
  const date = new Date(year, month - 1, dayOfMonth);
  return date.getMonth() === month - 1 ? date : null;
}

/** All Gregorian occurrences of a rule inside one Gregorian year (hijri rules may have 0 or 2). */
function occurrencesInYear(rule, year) {
  if (rule.type === 'fixed') {
    return [new Date(year, rule.month - 1, rule.day)];
  }
  if (rule.type === 'floating') {
    const date = nthWeekdayOfMonth(year, rule.month, rule.weekday, rule.nth);
    return date ? [date] : [];
  }
  if (rule.type === 'easter') {
    const e = easterSunday(year);
    const date = new Date(e);
    date.setDate(date.getDate() + (rule.offset || 0));
    return [date];
  }
  if (rule.type === 'orthodox-easter') {
    const e = orthodoxEasterSunday(year);
    const date = new Date(e);
    date.setDate(date.getDate() + (rule.offset || 0));
    return [date];
  }
  if (rule.type === 'weekday-in-range') {
    const date = weekdayInRange(year, rule.weekday, rule.startMonth, rule.startDay, rule.endMonth, rule.endDay);
    return date ? [date] : [];
  }
  if (rule.type === 'hijri') {
    const dates = [];
    let startHijriYear;
    try {
      startHijriYear = convertGregorianDayForCalendar(year, 1, 1).year;
    } catch {
      return dates;
    }
    for (const hy of [startHijriYear, startHijriYear + 1]) {
      try {
        const g = convertHijriDayForCalendar(hy, rule.month, rule.day);
        if (g.year === year) dates.push(new Date(g.year, g.month - 1, g.day));
      } catch {
        // out of supported Umm al-Qura range — skip silently
      }
    }
    return dates.sort((a, b) => a.getTime() - b.getTime());
  }
  return [];
}

function nextOccurrence(rule, nowMs) {
  const today = atMidnight(new Date(nowMs));
  const year = today.getFullYear();
  for (const candidate of [...occurrencesInYear(rule, year), ...occurrencesInYear(rule, year + 1)]) {
    if (atMidnight(candidate).getTime() >= today.getTime()) return candidate;
  }
  return null;
}

function rowStatus(startDate, durationDays, nowMs) {
  const today = atMidnight(new Date(nowMs)).getTime();
  const start = atMidnight(startDate).getTime();
  const end = start + (Math.max(1, durationDays) - 1) * DAY_MS;
  if (today < start) return 'upcoming';
  if (today === start) return 'today';
  if (today <= end) return 'active';
  return 'passed';
}

/**
 * Long-weekend detection: how many continuous days off (holiday span + the
 * weekend days touching it) the holiday produces, given the country weekend.
 */
function continuousBlock(startDate, durationDays, weekendDays) {
  const weekend = new Set(weekendDays);
  let start = atMidnight(startDate).getTime();
  let end = start + (Math.max(1, durationDays) - 1) * DAY_MS;
  while (weekend.has(new Date(start - DAY_MS).getDay())) start -= DAY_MS;
  while (weekend.has(new Date(end + DAY_MS).getDay())) end += DAY_MS;
  const totalDays = Math.round((end - start) / DAY_MS) + 1;
  return { blockStart: new Date(start), blockEnd: new Date(end), totalDays };
}

function buildRow(def, hub, nowMs, resolvedHijri) {
  const today = atMidnight(new Date(nowMs));
  const year = today.getFullYear();
  const core = def.eventSlug ? getHolidayCoreEventBySlug(def.eventSlug) : null;

  const occurrences = occurrencesInYear(def.rule, year);
  let dateThisYear = occurrences[0] || null;

  // Countdown target: identical to the event page when the resolver produced a
  // date for this slug; otherwise precise Umm al-Qura arithmetic (never the
  // engine's rough ~354.37-day fallback, which can drift several days).
  let nextDate = null;
  if (core && resolvedHijri?.[core.slug]?.isoString) {
    try {
      nextDate = atMidnight(getNextEventDate(core, resolvedHijri, nowMs));
    } catch {
      nextDate = null;
    }
  }
  if (!nextDate) nextDate = nextOccurrence(def.rule, nowMs);

  // Prefer the event-page-consistent resolved date for the table when the row
  // is still upcoming this year (or missing); rows that already passed keep
  // their historical Umm al-Qura date.
  if (nextDate && nextDate.getFullYear() === year) {
    if (!dateThisYear || atMidnight(dateThisYear).getTime() >= today.getTime()) {
      dateThisYear = nextDate;
    }
  }

  const duration = Math.max(1, def.durationDays || 1);
  const status = dateThisYear ? rowStatus(dateThisYear, duration, nowMs) : 'upcoming';
  const countdownTarget = status === 'upcoming' && dateThisYear ? dateThisYear : nextDate;
  const daysRemaining = countdownTarget
    ? Math.max(0, Math.round((atMidnight(countdownTarget).getTime() - today.getTime()) / DAY_MS))
    : null;

  const block = dateThisYear ? continuousBlock(dateThisYear, duration, hub.weekendDays) : null;

  return {
    key: def.key || def.eventSlug || def.nameAr,
    nameAr: def.nameAr,
    eventSlug: def.eventSlug || null,
    isHijri: def.rule.type === 'hijri',
    approximate: Boolean(def.approximate),
    durationDays: duration,
    durationLabel: def.durationLabel || null,
    note: def.note || null,
    dateThisYear,
    dayNumber: dateThisYear ? dateThisYear.getDate() : null,
    monthNameAr: dateThisYear ? GREGORIAN_MONTH_NAMES_AR[dateThisYear.getMonth()] : null,
    weekdayAr: dateThisYear ? DAY_NAMES_AR[dateThisYear.getDay()] : null,
    gregorianLabel: dateThisYear ? formatGregorianAr(dateThisYear) : null,
    hijriLabel: dateThisYear ? hijriLabelFor(dateThisYear) : null,
    status,
    daysRemaining,
    countdownTarget,
    longWeekend: block && block.totalDays > duration ? block : null,
  };
}

export async function buildCountryHubModel(slug) {
  'use cache';
  cacheTag('holidays-page');
  cacheTag(`holiday-country-hub-${slug}`);
  cacheLife('hours');

  const hub = getCountryHubBySlug(slug);
  if (!hub) return null;

  const nowMs = Date.now();

  const today = atMidnight(new Date(nowMs));
  const year = today.getFullYear();

  const hijriCores = hub.holidays
    .map((def) => (def.eventSlug ? getHolidayCoreEventBySlug(def.eventSlug) : null))
    .filter((core) => core && core.type === 'hijri');
  let resolvedHijri = {};
  try {
    resolvedHijri = await resolveAllHijriEvents(hijriCores, { nowIso: new Date(nowMs).toISOString() });
  } catch {
    resolvedHijri = {};
  }

  const rows = hub.holidays
    .map((def) => buildRow(def, hub, nowMs, resolvedHijri))
    .sort((a, b) => {
      if (!a.dateThisYear) return 1;
      if (!b.dateThisYear) return -1;
      return a.dateThisYear.getTime() - b.dateThisYear.getTime();
    });

  const observanceRows = (hub.observances || [])
    .map((def) => buildRow({ ...def, durationDays: 1 }, hub, nowMs, resolvedHijri))
    .sort((a, b) => {
      if (!a.dateThisYear) return 1;
      if (!b.dateThisYear) return -1;
      return a.dateThisYear.getTime() - b.dateThisYear.getTime();
    });

  const liveRow = rows.find((row) => row.status === 'today' || row.status === 'active') || null;
  const nextRow =
    rows
      .filter((row) => row.status === 'upcoming' && row.countdownTarget)
      .sort((a, b) => a.countdownTarget.getTime() - b.countdownTarget.getTime())[0] || null;

  // The hero countdown: the nearest future holiday start across this + next year.
  const heroRow =
    nextRow ||
    rows
      .filter((row) => row.countdownTarget)
      .sort((a, b) => a.countdownTarget.getTime() - b.countdownTarget.getTime())[0] ||
    null;

  const totalDays = rows.reduce((sum, row) => sum + row.durationDays, 0);
  const remainingCount = rows.filter((row) => row.status === 'upcoming').length;
  const longWeekends = rows.filter((row) => row.longWeekend && row.status !== 'passed');

  const todayHijri = hijriLabelFor(today);

  return {
    hub,
    year,
    nowMs,
    todayGregorianLabel: formatGregorianAr(today),
    todayWeekdayAr: DAY_NAMES_AR[today.getDay()],
    todayHijriLabel: todayHijri,
    rows,
    observanceRows,
    liveRow,
    nextRow,
    heroRow,
    heroRemaining: heroRow?.countdownTarget ? getTimeRemaining(heroRow.countdownTarget, nowMs) : null,
    stats: {
      officialCount: rows.length,
      totalDays,
      remainingCount,
      weekendLabel: hub.weekendLabel,
    },
    longWeekends,
  };
}

/** ICS (RFC 5545) all-day calendar for the country's official holidays. */
export async function buildCountryHubIcs(slug) {
  const model = await buildCountryHubModel(slug);
  if (!model) return null;

  const fmt = (date) =>
    `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;

  const escapeText = (value) => String(value || '').replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,');

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//miqatona.com//country-holidays//AR',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${escapeText(`العطل الرسمية في ${model.hub.nameAr} ${model.year}`)}`,
    'X-WR-TIMEZONE:UTC',
  ];

  for (const row of model.rows) {
    if (!row.dateThisYear) continue;
    const start = row.dateThisYear;
    const end = new Date(atMidnight(start).getTime() + row.durationDays * DAY_MS);
    const descriptionParts = [];
    if (row.hijriLabel) descriptionParts.push(`الموافق ${row.hijriLabel}`);
    if (row.isHijri) descriptionParts.push('التاريخ تقديري وفق تقويم أم القرى وقد يتغير حسب رؤية الهلال.');
    if (row.note) descriptionParts.push(row.note);
    descriptionParts.push(`التفاصيل والعد التنازلي: https://miqatona.com/holidays/${row.eventSlug || ''}`);

    lines.push(
      'BEGIN:VEVENT',
      `UID:${model.hub.slug}-${row.key}-${model.year}@miqatona.com`,
      `DTSTAMP:${fmt(new Date(model.nowMs))}T000000Z`,
      `DTSTART;VALUE=DATE:${fmt(start)}`,
      `DTEND;VALUE=DATE:${fmt(end)}`,
      `SUMMARY:${escapeText(`${row.nameAr} — ${model.hub.nameAr}`)}`,
      `DESCRIPTION:${escapeText(descriptionParts.join(' '))}`,
      'END:VEVENT',
    );
  }

  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
}
