'use client';

import { useId, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CalendarDays, MoonStar, AlertCircle } from 'lucide-react';

import { resolveCountdownTarget, sanitizeCountdownTitle } from '@/lib/countdown/resolve';
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
 */

const HIJRI_MONTHS = [
  'محرم', 'صفر', 'ربيع الأول', 'ربيع الآخر',
  'جمادى الأولى', 'جمادى الآخرة', 'رجب', 'شعبان',
  'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة',
];

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
        <label htmlFor={titleId} className={styles.label}>اسم المناسبة</label>
        <input
          id={titleId}
          type="text"
          className={styles.input}
          value={title}
          maxLength={80}
          placeholder="مثال: زفافي، امتحاني، إطلاق المنتج"
          onChange={(event) => setTitle(event.target.value)}
        />
      </div>

      <div className={styles.field}>
        <div className={styles.labelRow}>
          <span className={styles.label}>تاريخ المناسبة</span>
          <div className={styles.toggle} role="group" aria-label="اختر نوع التقويم">
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
          <label htmlFor={timeId} className={styles.label}>الوقت</label>
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

      {error ? (
        <div className={styles.error} role="alert">
          <AlertCircle size={16} aria-hidden="true" />
          <span>{error}</span>
        </div>
      ) : null}

      <button type="submit" className={styles.submit} disabled={submitting}>
        أنشئ العداد وشاركه
      </button>
    </form>
  );
}
