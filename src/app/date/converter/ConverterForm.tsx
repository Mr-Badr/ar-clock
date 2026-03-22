'use client';
// src/app/date/converter/ConverterForm.tsx
// ─────────────────────────────────────────────────────────────────────────────
// REDESIGNED:
//   • Submit button uses .btn .btn-primary CSS class — hover works correctly
//     (previous version used inline style gradient — hover never fired)
//   • Direction toggle uses .tabs .tab design system classes
//   • Method selector with country flag context
//   • Result panel includes permalink chip to permanent date page
//   • Uses .input .select CSS classes from new.css
//   • Uses .card class for panels
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { convertDateAction } from './actions';
import type { ConvertDateResult, ConversionMethod } from '@/lib/date-adapter';

const HIJRI_MONTHS_AR = [
  'محرم','صفر','ربيع الأول','ربيع الثاني',
  'جمادى الأولى','جمادى الثانية','رجب','شعبان',
  'رمضان','شوال','ذو القعدة','ذو الحجة',
];
const GREGORIAN_MONTHS_AR = [
  'يناير','فبراير','مارس','أبريل','مايو','يونيو',
  'يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر',
];

const METHODS: { value: ConversionMethod; label: string; sub: string; countries: string }[] = [
  { value: 'umalqura',    label: 'أم القرى',      sub: 'للسعودية والخليج',        countries: '🇸🇦🇦🇪🇰🇼🇶🇦🇧🇭🇴🇲' },
  { value: 'astronomical',label: 'الرصد الفلكي', sub: 'للمغرب ومصر والشام',      countries: '🇲🇦🇪🇬🇯🇴🇩🇿🇹🇳🇱🇧' },
  { value: 'civil',       label: 'مدني / حسابي', sub: 'للحسابات الأكاديمية',    countries: '📐' },
];

type Direction = 'gregorian-to-hijri' | 'hijri-to-gregorian';

interface Props {
  defaultDirection?: Direction;
  lockedDirection?:  boolean;
  defaultYear?:      number;
  defaultMonth?:     number;
  defaultDay?:       number;
}

export function ConverterForm({
  defaultDirection = 'gregorian-to-hijri',
  lockedDirection  = false,
  defaultYear,
  defaultMonth,
  defaultDay,
}: Props) {
  const now = new Date();
  const [direction, setDirection] = useState<Direction>(defaultDirection);
  const [method,    setMethod]    = useState<ConversionMethod>('umalqura');
  const [year,      setYear]      = useState(defaultYear  ?? now.getUTCFullYear());
  const [month,     setMonth]     = useState(defaultMonth ?? 1);
  const [day,       setDay]       = useState(defaultDay   ?? 1);
  const [result,    setResult]    = useState<ConvertDateResult | null>(null);
  const [error,     setError]     = useState<string | null>(null);
  const [copied,    setCopied]    = useState(false);
  const [isPending, startTransition] = useTransition();

  const isHijriInput = direction === 'hijri-to-gregorian';
  const monthNames   = isHijriInput ? HIJRI_MONTHS_AR : GREGORIAN_MONTHS_AR;
  const maxYear      = isHijriInput ? 1500 : 2077;
  const minYear      = isHijriInput ? 1343 : 1924;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);
    startTransition(async () => {
      const res = await convertDateAction(direction, year, month, day, method);
      if (res.success && res.result) setResult(res.result);
      else setError(res.error ?? 'خطأ غير معروف');
    });
  }

  async function handleCopy() {
    if (!result) return;
    await navigator.clipboard.writeText(result.formatted.ar);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function buildPermalink(): string {
    if (!result) return '/date';
    if (direction === 'gregorian-to-hijri') {
      return `/date/${year}/${String(month).padStart(2,'0')}/${String(day).padStart(2,'0')}`;
    }
    return `/date/hijri/${result.year}/${String(result.month).padStart(2,'0')}/${String(result.day).padStart(2,'0')}`;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr]" style={{ gap: '24px', alignItems: 'start' }}>

      {/* ── INPUT PANEL ───────────────────────────────────────────────── */}
      <form
        onSubmit={handleSubmit}
        className="card"
        style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
      >
        {/* Direction toggle */}
        {!lockedDirection && (
          <div>
            <div className="input-label" style={{ marginBottom: '12px' }}>اتجاه التحويل</div>
            <div className="tabs" style={{ padding: '4px' }}>
              {(['gregorian-to-hijri', 'hijri-to-gregorian'] as Direction[]).map((dir) => (
                <button
                  key={dir}
                  type="button"
                  onClick={() => { setDirection(dir); setResult(null); setError(null); }}
                  className={`tab flex-1 ${direction === dir ? 'tab--active' : ''}`}
                  style={{ flexDirection: 'column', gap: '4px', height: 'auto', padding: '10px 8px' }}
                >
                  <span className="text-lg leading-none">
                    {dir === 'gregorian-to-hijri' ? '🗓️→🌙' : '🌙→🗓️'}
                  </span>
                  <span className="text-xs font-semibold">
                    {dir === 'gregorian-to-hijri' ? 'ميلادي → هجري' : 'هجري → ميلادي'}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Date inputs */}
        <div className="input-group">
          <label className="input-label">
            {isHijriInput ? 'أدخل التاريخ الهجري' : 'أدخل التاريخ الميلادي'}
          </label>
          <div className="grid" style={{ gridTemplateColumns: '55px 1fr 90px', gap: '8px' }}>
            <input
              type="number"
              value={day}
              min={1}
              max={isHijriInput ? 30 : 31}
              onChange={e => setDay(Number(e.target.value))}
              placeholder="يوم"
              className="input text-center"
              required
            />
            <select
              value={month}
              onChange={e => setMonth(Number(e.target.value))}
              className="select"
            >
              {monthNames.map((mn, i) => (
                <option key={i} value={i + 1}>{mn}</option>
              ))}
            </select>
            <input
              type="number"
              value={year}
              min={minYear}
              max={maxYear}
              onChange={e => setYear(Number(e.target.value))}
              placeholder="السنة"
              className="input text-center tabular-nums"
              required
            />
          </div>
          <div className="input-hint">النطاق المدعوم: {minYear}–{maxYear}</div>
        </div>

        {/* Method selector */}
        <div className="input-group">
          <div className="input-label">طريقة الحساب</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {METHODS.map((meth) => (
              <label
                key={meth.value}
                className={`chip ${method === meth.value ? 'chip--active' : ''}`}
                style={{
                  display:    'flex',
                  alignItems: 'center',
                  gap:        '12px',
                  padding:    '12px 16px',
                  borderRadius: 'var(--radius-xl)',
                  cursor: 'pointer',
                }}
              >
                <input
                  type="radio"
                  name="method"
                  value={meth.value}
                  checked={method === meth.value}
                  onChange={() => setMethod(meth.value)}
                  className="sr-only"
                />
                <span className="text-xl leading-none" aria-hidden="true">{meth.countries}</span>
                <span style={{ flex: 1 }}>
                  <span className="block text-sm font-bold text-primary">{meth.label}</span>
                  <span className="block text-xs text-muted">{meth.sub}</span>
                </span>
                {method === meth.value && (
                  <span className="text-accent-alt">✓</span>
                )}
              </label>
            ))}
          </div>
        </div>

        {/* Submit — uses .btn .btn-primary so hover works via CSS */}
        <button
          type="submit"
          disabled={isPending}
          className="btn btn-primary btn-block"
          style={{ marginTop: 'auto', padding: '16px' }}
        >
          {isPending ? 'جارٍ التحويل…' : 'تحويل التاريخ ←'}
        </button>
      </form>

      {/* ── RESULT PANEL ──────────────────────────────────────────────── */}
      <div
        className={`card ${result ? 'card--accent' : ''}`}
        style={{
          minHeight: '420px',
          display: 'flex',
          flexDirection: 'column',
          ...(result ? {} : { justifyContent: 'center', alignItems: 'center' }),
        }}
      >
        {/* Empty state */}
        {!result && !error && (
          <div className="text-center" style={{ padding: '40px 24px' }}>
            <div className="text-4xl mb-4" style={{ opacity: 0.2 }} aria-hidden="true">🔄</div>
            <p className="text-sm font-semibold text-muted m-0">
              أدخل تاريخاً واضغط «تحويل»
            </p>
            <p className="text-xs text-muted m-0 mt-2">
              ستظهر نتيجة التحويل المفصلة هنا فوراً
            </p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div
            className="card--danger card"
            style={{ margin: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}
          >
            <span className="text-xl">⚠️</span>
            <span className="text-sm font-semibold text-danger">{error}</span>
          </div>
        )}

        {/* Result */}
        {result && (
          <>
            {/* Header with permalink */}
            <div
              className="flex items-center justify-between px-5 py-3 rounded-t-xl"
              style={{ background: 'var(--accent-gradient)', margin: '-24px -24px 24px' }}
            >
              <span className="text-xs font-bold text-white/80 uppercase tracking-wide">النتيجة</span>
              <Link
                href={buildPermalink()}
                className="text-xs font-medium flex items-center gap-1"
                style={{ color: 'rgba(255,255,255,0.75)' }}
              >
                🔗 صفحة دائمة
              </Link>
            </div>

            {/* Main result */}
            <div className="text-center mb-8">
              <div
                className="font-black leading-tight mb-2"
                style={{
                  fontSize: 'clamp(1.75rem, 5vw, 2.75rem)',
                  color: 'var(--accent-alt)',
                }}
              >
                {result.formatted.ar}
              </div>
              <div className="text-base font-semibold text-secondary">
                {result.formatted.en}
              </div>
            </div>

            {/* Details table */}
            <div className="card-nested mb-6" style={{ marginTop: 'auto' }}>
              {[
                ['اليوم',      result.dayNameAr],
                ['ISO 8601',   result.formatted.iso],
                ['Julian Day', Math.floor(result.julianDay).toLocaleString('en')],
              ].map(([label, val], i, arr) => (
                <div
                  key={i}
                  className="flex justify-between items-center py-2.5 text-sm"
                  style={{ borderBottom: i < arr.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}
                >
                  <span className="text-muted">{label}</span>
                  <span className="font-bold text-primary tabular-nums">{val}</span>
                </div>
              ))}
            </div>

            {/* Copy button — .btn .btn-surface so hover works */}
            <button
              onClick={handleCopy}
              className={`btn btn-block ${copied ? 'btn-secondary' : 'btn-surface'}`}
            >
              {copied ? '✓ تم النسخ' : '📋 نسخ النتيجة'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
