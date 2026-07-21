'use client';

import { useId, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  CalendarDays, MoonStar, AlertCircle, Sparkle, Clock, PartyPopper, Loader2,
} from 'lucide-react';

import { resolveCountdownTarget, sanitizeCountdownTitle } from '@/lib/countdown/resolve';
import { convertDate } from '@/lib/date-adapter';
import styles from './CountdownCreatorForm.module.css';

/*
 * Rebuilt 2026-07 — the old version reused calculator-only components
 * (CalendarToggle, HijriDateFields from calculators/age/shared.client.jsx)
 * whose CSS lives entirely in src/app/calculators/calculators.css, a
 * stylesheet imported only by the /calculators and /guides route layouts.
 * On /countdown that stylesheet never loads, so the toggle, date row, and
 * submit button rendered as bare unstyled browser controls. This version
 * is self-contained (CountdownCreatorForm.module.css) and depends only on
 * the design tokens already loaded on every page.
 *
 * Second pass, same day — added a live preview panel (title + both calendars
 * + days-remaining chip, recomputed on every keystroke) and a sliding
 * segmented-control indicator, so the form reacts before submission instead
 * of staying inert until the button is pressed.
 */

const HIJRI_MONTHS = [
  'محرم', 'صفر', 'ربيع الأول', 'ربيع الآخر',
  'جمادى الأولى', 'جمادى الآخرة', 'رجب', 'شعبان',
  'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة',
];

const GREGORIAN_DATE_FORMATTER = new Intl.DateTimeFormat('ar-SA-u-nu-latn', {
  weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
});
const TIME_FORMATTER = new Intl.DateTimeFormat('ar-SA-u-nu-latn', {
  hour: 'numeric', minute: '2-digit', hour12: true,
});

function pad2(value) {
  return String(value).padStart(2, '0');
}

function buildPreview({ title, calendar, gregorianIso, hijriValue, time }) {
  const target = resolveCountdownTarget({ calendar, gregorianDateIso: gregorianIso, hijriValue, time });
  if (!target.isValid) return null;

  const targetDate = new Date(target.iso);
  const gregorianLabel = GREGORIAN_DATE_FORMATTER.format(targetDate);

  let hijriLabel = '';
  try {
    const isoDateOnly = `${targetDate.getFullYear()}-${pad2(targetDate.getMonth() + 1)}-${pad2(targetDate.getDate())}`;
    hijriLabel = convertDate({ date: isoDateOnly, toCalendar: 'hijri' }).formatted.ar;
  } catch {
    hijriLabel = '';
  }

  const timeLabel = time && time !== '00:00' ? TIME_FORMATTER.format(targetDate) : '';

  const diffMs = targetDate.getTime() - Date.now();
  const diffDays = Math.floor(diffMs / 86400000);
  let remaining;
  if (diffMs <= 0) {
    remaining = { label: 'هذا الموعد مضى بالفعل', tone: 'past' };
  } else if (diffDays === 0) {
    remaining = { label: 'الموعد اليوم', tone: 'today' };
  } else {
    remaining = { label: `باقي ${diffDays} يوم`, tone: 'future' };
  }

  return {
    title: sanitizeCountdownTitle(title),
    gregorianLabel,
    hijriLabel,
    timeLabel,
    remaining,
  };
}

export default function CountdownCreatorForm() {
  const router = useRouter();
  const titleId = useId();
  const dateId = useId();
  const timeId = useId();

  const [title, setTitle] = useState('');
  const [calendar, setCalendar] = useState('gregorian');
  const [gregorianIso, setGregorianIso] = useState('');
  const [hijriValue, setHijriValue] = useState({ day: '', month: '', year: '' });
  const [time, setTime] = useState('00:00');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const preview = useMemo(
    () => buildPreview({ title, calendar, gregorianIso, hijriValue, time }),
    [title, calendar, gregorianIso, hijriValue, time],
  );

  function handleSubmit(event) {
    event.preventDefault();

    const cleanTitle = sanitizeCountdownTitle(title);
    if (!cleanTitle) {
      setError('اكتب اسم المناسبة أولاً.');
      return;
    }

    const target = resolveCountdownTarget({
      calendar,
      gregorianDateIso: gregorianIso,
      hijriValue,
      time,
    });
    if (!target.isValid) {
      setError(target.error || 'تعذر تحديد موعد هذه المناسبة.');
      return;
    }

    setError('');
    setSubmitting(true);
    const params = new URLSearchParams({ title: cleanTitle, date: target.iso });
    router.push(`/countdown?${params.toString()}`);
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form} noValidate>
      <div className={styles.field}>
        <div className={styles.labelGroup}>
          <span className={styles.fieldIcon} data-tone="blue" aria-hidden="true">
            <Sparkle size={14} strokeWidth={2} />
          </span>
          <label htmlFor={titleId} className={styles.label}>اسم المناسبة</label>
        </div>
        <div className={styles.inputWrap}>
          <input
            id={titleId}
            type="text"
            className={styles.input}
            value={title}
            maxLength={80}
            placeholder="مثال: زفافي، امتحاني، إطلاق المنتج"
            onChange={(event) => setTitle(event.target.value)}
          />
          {title.length > 0 ? (
            <span className={styles.counter} aria-hidden="true">{title.length}/80</span>
          ) : null}
        </div>
      </div>

      <div className={styles.field}>
        <div className={styles.labelRow}>
          <div className={styles.labelGroup}>
            <span className={styles.fieldIcon} data-tone="green" aria-hidden="true">
              <CalendarDays size={14} strokeWidth={2} />
            </span>
            <span className={styles.label}>تاريخ المناسبة</span>
          </div>
          <div className={styles.toggle} role="group" aria-label="اختر نوع التقويم">
            <span className={styles.toggleIndicator} data-active={calendar} aria-hidden="true" />
            <button
              type="button"
              className={`${styles.toggleBtn} ${calendar === 'gregorian' ? styles.toggleBtnActive : ''}`}
              aria-pressed={calendar === 'gregorian'}
              onClick={() => setCalendar('gregorian')}
            >
              <CalendarDays size={15} aria-hidden="true" />
              ميلادي
            </button>
            <button
              type="button"
              className={`${styles.toggleBtn} ${calendar === 'hijri' ? styles.toggleBtnActive : ''}`}
              aria-pressed={calendar === 'hijri'}
              onClick={() => setCalendar('hijri')}
            >
              <MoonStar size={15} aria-hidden="true" />
              هجري
            </button>
          </div>
        </div>

        {calendar === 'gregorian' ? (
          <input
            id={dateId}
            type="date"
            className={styles.input}
            value={gregorianIso}
            onChange={(event) => setGregorianIso(event.target.value)}
            aria-label="تاريخ المناسبة بالتقويم الميلادي"
          />
        ) : (
          <div className={styles.hijriRow}>
            <div className={styles.hijriField}>
              <label className={styles.hijriFieldLabel} htmlFor={`${dateId}-day`}>اليوم</label>
              <input
                id={`${dateId}-day`}
                type="number"
                inputMode="numeric"
                min="1"
                max="30"
                className={styles.input}
                value={hijriValue.day}
                onChange={(event) => setHijriValue((v) => ({ ...v, day: event.target.value }))}
                placeholder="1"
              />
            </div>
            <div className={`${styles.hijriField} ${styles.hijriFieldMonth}`}>
              <label className={styles.hijriFieldLabel} htmlFor={`${dateId}-month`}>الشهر</label>
              <select
                id={`${dateId}-month`}
                className={styles.select}
                value={hijriValue.month}
                onChange={(event) => setHijriValue((v) => ({ ...v, month: event.target.value }))}
                dir="rtl"
              >
                <option value="">-- اختر --</option>
                {HIJRI_MONTHS.map((name, i) => (
                  <option key={i + 1} value={String(i + 1)}>{i + 1} — {name}</option>
                ))}
              </select>
            </div>
            <div className={styles.hijriField}>
              <label className={styles.hijriFieldLabel} htmlFor={`${dateId}-year`}>السنة الهجرية</label>
              <input
                id={`${dateId}-year`}
                type="number"
                inputMode="numeric"
                min="1343"
                max="1500"
                className={styles.input}
                value={hijriValue.year}
                onChange={(event) => setHijriValue((v) => ({ ...v, year: event.target.value }))}
                placeholder="1400"
              />
            </div>
          </div>
        )}
      </div>

      <div className={styles.field}>
        <div className={styles.labelRow}>
          <div className={styles.labelGroup}>
            <span className={styles.fieldIcon} data-tone="amber" aria-hidden="true">
              <Clock size={14} strokeWidth={2} />
            </span>
            <label htmlFor={timeId} className={styles.label}>الوقت</label>
          </div>
          <span className={styles.optional}>اختياري</span>
        </div>
        <input
          id={timeId}
          type="time"
          className={styles.input}
          value={time}
          onChange={(event) => setTime(event.target.value || '00:00')}
        />
        <p className={styles.hint}>اتركه كما هو إذا كانت المناسبة تخص اليوم كاملاً وليست ساعة محددة.</p>
      </div>

      {preview ? (
        <div className={styles.preview} aria-live="polite">
          <div className={styles.previewHead}>
            <span className={styles.fieldIcon} data-tone="success" aria-hidden="true">
              <PartyPopper size={14} strokeWidth={2} />
            </span>
            <span className={styles.previewLabel}>معاينة حية</span>
            <span className={`${styles.previewChip} ${styles[`previewChip_${preview.remaining.tone}`]}`}>
              {preview.remaining.label}
            </span>
          </div>
          {preview.title ? <p className={styles.previewTitle}>{preview.title}</p> : null}
          <p className={styles.previewDate}>
            {preview.gregorianLabel}
            {preview.timeLabel ? ` — الساعة ${preview.timeLabel}` : ''}
          </p>
          {preview.hijriLabel ? (
            <p className={styles.previewHijri}>الموافق {preview.hijriLabel}</p>
          ) : null}
        </div>
      ) : null}

      {error ? (
        <div className={styles.error} role="alert">
          <AlertCircle size={16} aria-hidden="true" />
          <span>{error}</span>
        </div>
      ) : null}

      <button type="submit" className={styles.submit} disabled={submitting}>
        {submitting ? (
          <>
            <Loader2 size={18} className={styles.spinner} aria-hidden="true" />
            جارٍ الإنشاء…
          </>
        ) : (
          'أنشئ العداد وشاركه'
        )}
      </button>
    </form>
  );
}
