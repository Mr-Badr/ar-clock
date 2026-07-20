import { convertDate } from '@/lib/date-adapter';

const MAX_TITLE_LENGTH = 80;

export function sanitizeCountdownTitle(raw) {
  const value = String(raw || '').replace(/\s+/g, ' ').trim();
  if (!value) return '';
  return value.length > MAX_TITLE_LENGTH ? value.slice(0, MAX_TITLE_LENGTH).trim() : value;
}

function resolveGregorianDateIso(calendar, gregorianDateIso, hijriValue) {
  if (calendar === 'hijri') {
    const year = Number(hijriValue?.year);
    const month = Number(hijriValue?.month);
    const day = Number(hijriValue?.day);
    if (!year || !month || !day) {
      return { isValid: false, error: 'أكمل اليوم والشهر والسنة الهجرية.' };
    }

    try {
      const converted = convertDate({
        date: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
        toCalendar: 'gregorian',
      });
      return { isValid: true, iso: converted.formatted.iso };
    } catch (error) {
      return {
        isValid: false,
        error: error instanceof Error ? error.message : 'تعذر قراءة التاريخ الهجري.',
      };
    }
  }

  const value = String(gregorianDateIso || '');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return { isValid: false, error: 'أدخل تاريخاً ميلادياً صحيحاً.' };
  }
  return { isValid: true, iso: value };
}

/**
 * Resolves a countdown target to an absolute UTC instant (ISO with Z),
 * anchored to the CALLER's local timezone at the moment of creation — so a
 * shared countdown link always points at the same real-world moment for
 * every viewer, regardless of their own timezone.
 */
export function resolveCountdownTarget({ calendar, gregorianDateIso, hijriValue, time }) {
  const dateResult = resolveGregorianDateIso(calendar, gregorianDateIso, hijriValue);
  if (!dateResult.isValid) {
    return { isValid: false, error: dateResult.error, iso: '' };
  }

  const [year, month, day] = dateResult.iso.split('-').map(Number);
  const [hourRaw, minuteRaw] = String(time || '00:00').split(':');
  const hour = Number(hourRaw);
  const minute = Number(minuteRaw);
  const target = new Date(
    year,
    month - 1,
    day,
    Number.isFinite(hour) ? hour : 0,
    Number.isFinite(minute) ? minute : 0,
    0,
    0,
  );

  if (Number.isNaN(target.getTime())) {
    return { isValid: false, error: 'تعذر تحديد موعد هذه المناسبة.', iso: '' };
  }

  return { isValid: true, error: '', iso: target.toISOString() };
}
