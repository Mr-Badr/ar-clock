"use client";

import { CalendarBlank, MoonStars } from '@phosphor-icons/react';
import { normalizeBirthInput } from '@/lib/calculators/age';

/** Normalize whichever calendar mode is active into a single ISO date result. */
export function resolveBirthInput(calendar, gregorianValue, hijriValue) {
  return normalizeBirthInput(
    calendar === 'gregorian'
      ? { calendar, iso: gregorianValue }
      : { calendar, ...hijriValue },
  );
}

const HIJRI_MONTHS = [
  'محرم', 'صفر', 'ربيع الأول', 'ربيع الآخر',
  'جمادى الأولى', 'جمادى الآخرة', 'رجب', 'شعبان',
  'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة',
];

/**
 * Shared tools-v2 birth-date input — Gregorian/Hijri toggle, reused across all 8 age-cluster
 * tools. Pure presentation; date normalization stays in @/lib/calculators/age (normalizeBirthInput).
 */
export default function BirthInputTool({
  calendar,
  onCalendarChange,
  gregorianValue,
  onGregorianChange,
  hijriValue,
  onHijriChange,
  label = 'تاريخ الميلاد',
  maxIso,
}) {
  return (
    <>
      <div className="tool-v2-field">
        <label>التقويم</label>
        <div className="guide-v2-checker-options" role="group" aria-label="التقويم">
          <button type="button" className={`guide-v2-checker-chip${calendar === 'gregorian' ? ' is-active' : ''}`} aria-pressed={calendar === 'gregorian'} onClick={() => onCalendarChange('gregorian')}>
            <CalendarBlank size={14} weight="bold" /> ميلادي
          </button>
          <button type="button" className={`guide-v2-checker-chip${calendar === 'hijri' ? ' is-active' : ''}`} aria-pressed={calendar === 'hijri'} onClick={() => onCalendarChange('hijri')}>
            <MoonStars size={14} weight="bold" /> هجري
          </button>
        </div>
      </div>

      {calendar === 'gregorian' ? (
        <div className="tool-v2-field">
          <label htmlFor="age-birth-date">{label}</label>
          <input id="age-birth-date" type="date" value={gregorianValue} max={maxIso} onChange={(e) => onGregorianChange(e.target.value)} />
        </div>
      ) : (
        <div className="tool-v2-field">
          <label>{label} (هجري، من 1343 إلى 1500)</label>
          <div className="tool-v2-field-row-pair" style={{ gridTemplateColumns: '1fr 1.6fr 1fr' }}>
            <input type="number" inputMode="numeric" min="1" max="30" placeholder="اليوم" value={hijriValue.day} onChange={(e) => onHijriChange({ ...hijriValue, day: e.target.value })} />
            <select value={hijriValue.month} onChange={(e) => onHijriChange({ ...hijriValue, month: e.target.value })} dir="rtl">
              <option value="">-- الشهر --</option>
              {HIJRI_MONTHS.map((name, i) => (<option key={i + 1} value={String(i + 1)}>{i + 1} — {name}</option>))}
            </select>
            <input type="number" inputMode="numeric" min="1343" max="1500" placeholder="السنة" value={hijriValue.year} onChange={(e) => onHijriChange({ ...hijriValue, year: e.target.value })} />
          </div>
        </div>
      )}
    </>
  );
}
