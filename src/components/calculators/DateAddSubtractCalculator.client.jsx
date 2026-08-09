"use client";

import { useMemo, useState } from 'react';
import { CalendarBlank, Info, Moon, ShareNetwork } from '@phosphor-icons/react';
import { toast } from 'sonner';

import { computeDateShift } from '@/lib/calculators/date-add-subtract';
import { ISLAMIC_MONTH_NAMES_AR } from '@/lib/date-adapter';

const UNIT_OPTIONS = [
  { value: 'day', label: 'يوم' },
  { value: 'week', label: 'أسبوع' },
  { value: 'month', label: 'شهر' },
  { value: 'year', label: 'سنة' },
];

const DEFAULT_HIJRI = { year: 1447, month: 6, day: 15 };
const DEFAULT_GREGORIAN = { year: 2026, month: 7, day: 20 };

function pad2(n) {
  return String(n).padStart(2, '0');
}

async function shareResult(title, text) {
  if (navigator.share) {
    try { await navigator.share({ title, text }); return; } catch { /* cancelled */ }
  }
  try { await navigator.clipboard.writeText(text); toast.success('تم نسخ النتيجة إلى الحافظة'); }
  catch { toast.error('تعذر نسخ النتيجة'); }
}

export default function DateAddSubtractCalculator() {
  const [calendarType, setCalendarType] = useState('gregorian');
  const [gregorianIso, setGregorianIso] = useState(
    `${DEFAULT_GREGORIAN.year}-${pad2(DEFAULT_GREGORIAN.month)}-${pad2(DEFAULT_GREGORIAN.day)}`,
  );
  const [hijriYear, setHijriYear] = useState(String(DEFAULT_HIJRI.year));
  const [hijriMonth, setHijriMonth] = useState(String(DEFAULT_HIJRI.month));
  const [hijriDay, setHijriDay] = useState(String(DEFAULT_HIJRI.day));
  const [operation, setOperation] = useState('add');
  const [unit, setUnit] = useState('day');
  const [amount, setAmount] = useState('40');

  const sourceParts = useMemo(() => {
    if (calendarType === 'gregorian') {
      const [y, m, d] = String(gregorianIso || '').split('-').map(Number);
      if (!y || !m || !d) return null;
      return { year: y, month: m, day: d };
    }
    const y = Number(hijriYear);
    const m = Number(hijriMonth);
    const d = Number(hijriDay);
    if (!y || !m || !d) return null;
    return { year: y, month: m, day: d };
  }, [calendarType, gregorianIso, hijriYear, hijriMonth, hijriDay]);

  const result = useMemo(() => {
    if (!sourceParts) return null;
    try {
      return computeDateShift({
        calendarType,
        year: sourceParts.year,
        month: sourceParts.month,
        day: sourceParts.day,
        operation,
        unit,
        amount,
      });
    } catch {
      return null;
    }
  }, [calendarType, sourceParts, operation, unit, amount]);

  const isOutOfRange = sourceParts && !result;

  const shareText = result
    ? `${result.resultHijri.day} ${result.resultHijriMonthNameAr} ${result.resultHijri.year} هـ — ${result.weekdayAr}، ${result.resultGregorian.day} ${result.resultGregorianMonthNameAr} ${result.resultGregorian.year}`
    : '';

  return (
    <div aria-label="حاسبة إضافة وطرح الأيام من تاريخ هجري أو ميلادي">
      <div className="tool-v2-panel-head">
        <span className="tool-v2-country-badge"><CalendarBlank size={14} weight="bold" /> هجري وميلادي معاً <span className="tool-v2-live-dot" aria-hidden="true" /></span>
      </div>

      <div className="tool-v2-field">
        <label>التقويم</label>
        <div className="tool-v2-option-list tool-v2-option-list--grid" role="group" aria-label="التقويم">
          <button type="button" className={`tool-v2-chip${calendarType === 'gregorian' ? ' is-active' : ''}`} onClick={() => setCalendarType('gregorian')}>ميلادي</button>
          <button type="button" className={`tool-v2-chip${calendarType === 'hijri' ? ' is-active' : ''}`} onClick={() => setCalendarType('hijri')}>هجري</button>
        </div>
      </div>

      {calendarType === 'gregorian' ? (
        <div className="tool-v2-field">
          <label htmlFor="date-shift-gregorian">التاريخ الميلادي</label>
          <input
            id="date-shift-gregorian"
            type="date"
            value={gregorianIso}
            min="1924-01-01"
            max="2077-12-31"
            onChange={(event) => setGregorianIso(event.target.value)}
          />
        </div>
      ) : (
        <div className="tool-v2-field-row-pair">
          <div className="tool-v2-field">
            <label htmlFor="date-shift-hijri-day">اليوم</label>
            <input id="date-shift-hijri-day" type="number" inputMode="numeric" min="1" max="30" value={hijriDay} onChange={(event) => setHijriDay(event.target.value)} />
          </div>
          <div className="tool-v2-field">
            <label htmlFor="date-shift-hijri-month">الشهر</label>
            <select id="date-shift-hijri-month" value={hijriMonth} onChange={(event) => setHijriMonth(event.target.value)}>
              {ISLAMIC_MONTH_NAMES_AR.map((name, idx) => (<option key={name} value={String(idx + 1)}>{name}</option>))}
            </select>
          </div>
          <div className="tool-v2-field">
            <label htmlFor="date-shift-hijri-year">السنة الهجرية</label>
            <input id="date-shift-hijri-year" type="number" inputMode="numeric" min="1343" max="1500" value={hijriYear} onChange={(event) => setHijriYear(event.target.value)} />
          </div>
        </div>
      )}

      {isOutOfRange ? (
        <p className="tool-v2-option-hint">هذا التاريخ خارج النطاق المدعوم حالياً (١٩٢٤–٢٠٧٧م / ١٣٤٣–١٥٠٠هـ) — جرّب تاريخاً ضمن هذا المدى.</p>
      ) : null}

      <div className="tool-v2-field">
        <label>العملية</label>
        <div className="tool-v2-option-list tool-v2-option-list--grid" role="group" aria-label="العملية">
          <button type="button" className={`tool-v2-chip${operation === 'add' ? ' is-active' : ''}`} onClick={() => setOperation('add')}>أضف</button>
          <button type="button" className={`tool-v2-chip${operation === 'subtract' ? ' is-active' : ''}`} onClick={() => setOperation('subtract')}>اطرح</button>
        </div>
      </div>

      <div className="tool-v2-field-row-pair">
        <div className="tool-v2-field">
          <label htmlFor="date-shift-amount">العدد</label>
          <input id="date-shift-amount" type="number" inputMode="numeric" min="0" max="9999" value={amount} onChange={(event) => setAmount(event.target.value)} />
        </div>
        <div className="tool-v2-field">
          <label htmlFor="date-shift-unit">الوحدة</label>
          <select id="date-shift-unit" value={unit} onChange={(event) => setUnit(event.target.value)}>
            {UNIT_OPTIONS.map((opt) => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
          </select>
        </div>
      </div>

      {result ? (
        <div aria-live="polite">
          <div className="tool-v2-result-hero">
            <span className="tool-v2-result-label"><Moon size={14} weight="bold" style={{ verticalAlign: '-2px' }} /> التاريخ الناتج</span>
            <div className="tool-v2-result-value">{result.resultHijri.day} {result.resultHijriMonthNameAr} {result.resultHijri.year} هـ</div>
            <div className="tool-v2-result-meta">{result.weekdayAr}، {result.resultGregorian.day} {result.resultGregorianMonthNameAr} {result.resultGregorian.year}</div>
          </div>

          <div className="tool-v2-note-strip">
            <Info size={15} weight="fill" />
            <span>
              {operation === 'add' ? 'بعد' : 'قبل'} {amount || 0} {UNIT_OPTIONS.find((u) => u.value === unit)?.label} من {result.sourceHijri.day}/{result.sourceHijri.month}/{result.sourceHijri.year} هـ ({result.sourceGregorian.day}/{result.sourceGregorian.month}/{result.sourceGregorian.year}م)
            </span>
          </div>

          <div className="tool-v2-action-row">
            <button type="button" className="tool-v2-action-btn is-primary" onClick={() => shareResult('حاسبة إضافة وطرح الأيام', shareText)}>
              <ShareNetwork size={18} weight="bold" /> مشاركة
            </button>
          </div>
        </div>
      ) : (
        <div className="tool-v2-empty-state">
          <CalendarBlank size={28} weight="duotone" />
          <p>أدخل التاريخ والعدد والوحدة لعرض التاريخ الناتج بالتقويمين.</p>
        </div>
      )}
    </div>
  );
}
