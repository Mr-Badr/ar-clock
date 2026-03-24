'use client';
// src/app/date/converter/ConverterForm.tsx
// ─────────────────────────────────────────────────────────────────────────────
// REDESIGNED v2:
//   • All icons from @phosphor-icons/react — no emoji icons
//   • Custom NumberSpinner: up/down carets, direct editing, inline validation
//   • Auto-scroll to result panel on mobile after conversion
//   • Both panels locked to equal height via CSS grid align-items: stretch
//   • Method cards with phosphor icon + flag context
//   • Result panel: premium gradient header, animated entry, permalink chip
//   • Full RTL + WCAG AA — all colours via design-system tokens
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useTransition, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import {
  CalendarBlank,
  Moon,
  ArrowsLeftRight,
  CaretUp,
  CaretDown,
  ArrowClockwise,
  Link as LinkIcon,
  Copy,
  Check,
  Warning,
  ArrowsDownUp,
  Globe,
  Compass,
  Calculator,
  ArrowDown,
} from '@phosphor-icons/react';
import { getHijriParts, HIJRI_MONTHS_AR } from '@/lib/hijri-utils';
import { convertDateAction } from './actions';
import type { ConvertDateResult, ConversionMethod } from '@/lib/date-adapter';
import { GREGORIAN_MONTHS_AR } from '@/lib/constants';
import { cn } from '@/lib/utils';

// ─── Constants ────────────────────────────────────────────────────────────────

const METHODS: {
  value: ConversionMethod;
  label: string;
  sub: string;
  countries: string;
  Icon: React.ElementType;
}[] = [
  {
    value: 'umalqura',
    label: 'أم القرى',
    sub: 'السعودية والخليج',
    countries: '🇸🇦🇦🇪🇰🇼🇶🇦🇧🇭🇴🇲',
    Icon: Globe,
  },
  {
    value: 'astronomical',
    label: 'الرصد الفلكي',
    sub: 'المغرب، مصر، الشام',
    countries: '🇲🇦🇪🇬🇯🇴🇩🇿🇹🇳🇱🇧',
    Icon: Compass,
  },
  {
    value: 'civil',
    label: 'مدني / حسابي',
    sub: 'للحسابات الأكاديمية',
    countries: '📐',
    Icon: Calculator,
  },
];

type Direction = 'gregorian-to-hijri' | 'hijri-to-gregorian';

// ─── NumberSpinner ─────────────────────────────────────────────────────────────
// Premium spin-input: caret up/down + direct edit + inline validation

interface SpinnerProps {
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
  label: string;
  placeholder?: string;
}

function NumberSpinner({ value, min, max, onChange, label, placeholder }: SpinnerProps) {
  const [editing, setEditing] = useState(false);
  const [raw, setRaw] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const isInvalid = value < min || value > max;

  const clamp = (v: number) => Math.min(max, Math.max(min, v));

  const increment = () => onChange(value >= max ? min : clamp(value + 1));
  const decrement = () => onChange(value <= min ? max : clamp(value - 1));

  const startEdit = () => {
    setRaw(String(value));
    setEditing(true);
    setTimeout(() => inputRef.current?.select(), 0);
  };

  const commitEdit = () => {
    const parsed = parseInt(raw, 10);
    if (!isNaN(parsed)) onChange(parsed); // allow out-of-range temporarily for validation feedback
    setEditing(false);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === 'Escape') commitEdit();
    if (e.key === 'ArrowUp') { e.preventDefault(); increment(); }
    if (e.key === 'ArrowDown') { e.preventDefault(); decrement(); }
  };

  return (
    <div className="input-group" style={{ alignItems: 'center' }}>
      <span className="input-label" style={{ textAlign: 'center', fontSize: 'var(--text-xs)' }}>
        {label}
      </span>

      {/* Spinner container */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          background: 'var(--bg-surface-3)',
          border: `1px solid ${isInvalid ? 'var(--danger-border)' : 'var(--border-default)'}`,
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          boxShadow: isInvalid ? '0 0 0 3px var(--danger-soft)' : 'var(--shadow-inner)',
          transition: 'border-color var(--transition-fast), box-shadow var(--transition-fast)',
          minWidth: '72px',
        }}
      >
        {/* Up button */}
        <button
          type="button"
          onClick={increment}
          aria-label={`زيادة ${label}`}
          style={{
            width: '100%',
            padding: '6px 0',
            background: 'transparent',
            border: 'none',
            borderBottom: '1px solid var(--border-subtle)',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background var(--transition-fast), color var(--transition-fast)',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.background = 'var(--bg-surface-4)';
            (e.currentTarget as HTMLElement).style.color = 'var(--accent-alt)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.background = 'transparent';
            (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)';
          }}
        >
          <CaretUp weight="bold" size={14} />
        </button>

        {/* Value display / edit */}
        {editing ? (
          <input
            ref={inputRef}
            type="number"
            value={raw}
            onChange={e => setRaw(e.target.value)}
            onBlur={commitEdit}
            onKeyDown={handleKey}
            style={{
              width: '100%',
              background: 'transparent',
              border: 'none',
              outline: 'none',
              textAlign: 'center',
              fontFamily: 'inherit',
              fontSize: 'var(--text-md)',
              fontWeight: 'var(--font-bold)',
              color: 'var(--text-primary)',
              padding: '10px 4px',
              fontVariantNumeric: 'tabular-nums',
            }}
          />
        ) : (
          <div
            role="spinbutton"
            aria-valuenow={value}
            aria-valuemin={min}
            aria-valuemax={max}
            tabIndex={0}
            onClick={startEdit}
            onFocus={startEdit}
            style={{
              width: '100%',
              textAlign: 'center',
              fontSize: 'var(--text-md)',
              fontWeight: 'var(--font-bold)',
              color: isInvalid ? 'var(--danger)' : 'var(--text-primary)',
              padding: '10px 4px',
              cursor: 'text',
              userSelect: 'none',
              fontVariantNumeric: 'tabular-nums',
              letterSpacing: 'var(--tracking-clock)',
            }}
          >
            {placeholder && !value ? placeholder : value}
          </div>
        )}

        {/* Down button */}
        <button
          type="button"
          onClick={decrement}
          aria-label={`تقليل ${label}`}
          style={{
            width: '100%',
            padding: '6px 0',
            background: 'transparent',
            border: 'none',
            borderTop: '1px solid var(--border-subtle)',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background var(--transition-fast), color var(--transition-fast)',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.background = 'var(--bg-surface-4)';
            (e.currentTarget as HTMLElement).style.color = 'var(--accent-alt)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.background = 'transparent';
            (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)';
          }}
        >
          <CaretDown weight="bold" size={14} />
        </button>
      </div>

      {/* Inline validation hint */}
      {isInvalid && (
        <span
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: 'var(--text-2xs)',
            color: 'var(--danger)',
            textAlign: 'center',
          }}
        >
          <Warning size={11} weight="fill" />
          {min}–{max}
        </span>
      )}
    </div>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  defaultDirection?: Direction;
  lockedDirection?: boolean;
  defaultYear?: number;
  defaultMonth?: number;
  defaultDay?: number;
}

// ─── ConverterForm ─────────────────────────────────────────────────────────────

export function ConverterForm({
  defaultDirection = 'gregorian-to-hijri',
  lockedDirection = false,
  defaultYear,
  defaultMonth,
  defaultDay,
}: Props) {
  const [direction, setDirection] = useState<Direction>(defaultDirection);
  const [method, setMethod] = useState<ConversionMethod>('umalqura');
  const [year, setYear] = useState(defaultYear ?? 2026);
  const [month, setMonth] = useState(defaultMonth ?? 1);
  const [day, setDay] = useState(defaultDay ?? 1);

  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (defaultYear === undefined || defaultMonth === undefined || defaultDay === undefined) {
      const now = new Date();
      if (defaultYear === undefined) setYear(now.getUTCFullYear());
      if (defaultMonth === undefined) setMonth(now.getUTCMonth() + 1);
      if (defaultDay === undefined) setDay(now.getUTCDate());
    }
  }, [defaultYear, defaultMonth, defaultDay]);

  const [result, setResult] = useState<ConvertDateResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isPending, startTransition] = useTransition();

  const isHijriInput = direction === 'hijri-to-gregorian';
  const monthNames = isHijriInput ? HIJRI_MONTHS_AR : GREGORIAN_MONTHS_AR;
  const maxYear = isHijriInput ? 1500 : 2077;
  const minYear = isHijriInput ? 1343 : 1924;
  const maxDay = isHijriInput ? 30 : 31;

  // Validation
  const dayValid = day >= 1 && day <= maxDay;
  const monthValid = month >= 1 && month <= 12;
  const yearValid = year >= minYear && year <= maxYear;
  const formValid = dayValid && monthValid && yearValid;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formValid) return;
    setError(null);
    setResult(null);

    startTransition(async () => {
      const res = await convertDateAction(direction, year, month, day, method);
      if (res.success && res.result) {
        setResult(res.result);
        // Auto-scroll to result panel on mobile
        setTimeout(() => {
          if (window.innerWidth < 1024) {
            resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      } else {
        setError(res.error ?? 'خطأ غير معروف');
      }
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
      return `/date/${year}/${String(month).padStart(2, '0')}/${String(day).padStart(2, '0')}`;
    }
    return `/date/hijri/${result.year}/${String(result.month).padStart(2, '0')}/${String(result.day).padStart(2, '0')}`;
  }

  const switchDirection = useCallback(() => {
    setDirection(d => (d === 'gregorian-to-hijri' ? 'hijri-to-gregorian' : 'gregorian-to-hijri'));
    setResult(null);
    setError(null);
  }, []);

  return (
    <div
      className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr]"
      style={{ gap: 'var(--space-5)', alignItems: 'stretch' }}
    >
      {/* ── INPUT PANEL ───────────────────────────────────────────────── */}
      <form onSubmit={handleSubmit} className="card flex flex-col" style={{ gap: 'var(--space-6)' }}>

        {/* Panel header */}
        <div className="card__header" style={{ marginBottom: 0, paddingBottom: 'var(--space-4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 'var(--radius-md)',
                background: 'var(--accent-soft)',
                border: '1px solid var(--border-accent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <ArrowsLeftRight weight="duotone" size={18} color="var(--accent-alt)" />
            </div>
            <div>
              <div className="card__title" style={{ fontSize: 'var(--text-base)' }}>محوّل التاريخ</div>
              <div className="card__subtitle">هجري ↔ ميلادي</div>
            </div>
          </div>
        </div>

        {/* Direction toggle */}
        {!lockedDirection && (
          <div className="input-group">
            <span className="input-label">اتجاه التحويل</span>
            <div
              className="card-nested"
              style={{
                padding: 'var(--space-2)',
                display: 'flex',
                gap: 'var(--space-2)',
                position: 'relative',
              }}
            >
              {/* Gregorian → Hijri */}
              <button
                type="button"
                onClick={() => { setDirection('gregorian-to-hijri'); setResult(null); setError(null); }}
                className={cn('tab flex-1', direction === 'gregorian-to-hijri' && 'tab--active')}
                style={{
                  flexDirection: 'column',
                  height: 'auto',
                  gap: 'var(--space-1-5)',
                  padding: 'var(--space-3) var(--space-2)',
                  borderRadius: 'var(--radius-md)',
                }}
              >
                <CalendarBlank weight={direction === 'gregorian-to-hijri' ? 'duotone' : 'regular'} size={20} />
                <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-semibold)' }}>
                  ميلادي → هجري
                </span>
              </button>

              {/* Swap icon in between */}
              <button
                type="button"
                onClick={switchDirection}
                title="تبديل الاتجاه"
                className="btn btn-ghost btn-icon btn-sm"
                style={{
                  alignSelf: 'center',
                  borderRadius: 'var(--radius-full)',
                  flexShrink: 0,
                  color: 'var(--text-muted)',
                }}
              >
                <ArrowsDownUp size={14} weight="bold" />
              </button>

              {/* Hijri → Gregorian */}
              <button
                type="button"
                onClick={() => { setDirection('hijri-to-gregorian'); setResult(null); setError(null); }}
                className={cn('tab flex-1', direction === 'hijri-to-gregorian' && 'tab--active')}
                style={{
                  flexDirection: 'column',
                  height: 'auto',
                  gap: 'var(--space-1-5)',
                  padding: 'var(--space-3) var(--space-2)',
                  borderRadius: 'var(--radius-md)',
                }}
              >
                <Moon weight={direction === 'hijri-to-gregorian' ? 'duotone' : 'regular'} size={20} />
                <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-semibold)' }}>
                  هجري → ميلادي
                </span>
              </button>
            </div>
          </div>
        )}

        {/* ── Date input row — Spinners + Month select ───────────────── */}
        <div className="input-group">
          <span className="input-label">
            {isHijriInput ? 'أدخل التاريخ الهجري' : 'أدخل التاريخ الميلادي'}
          </span>

          {/* Three columns: Day spinner | Month select | Year spinner */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '80px 1fr 96px',
              gap: 'var(--space-3)',
              alignItems: 'start',
            }}
          >
            {/* Day spinner */}
            <NumberSpinner
              value={day}
              min={1}
              max={maxDay}
              onChange={setDay}
              label="اليوم"
            />

            {/* Month select */}
            <div className="input-group" style={{ flex: 1 }}>
              <span className="input-label" style={{ textAlign: 'center', fontSize: 'var(--text-xs)' }}>
                الشهر
              </span>
              <select
                value={month}
                onChange={e => setMonth(Number(e.target.value))}
                className="select"
                style={{ height: '100%', minHeight: '88px', textAlign: 'center' }}
                aria-label="الشهر"
              >
                {monthNames.map((mn, i) => (
                  <option key={i} value={i + 1}>{mn}</option>
                ))}
              </select>
            </div>

            {/* Year spinner */}
            <NumberSpinner
              value={year}
              min={minYear}
              max={maxYear}
              onChange={setYear}
              label="السنة"
            />
          </div>

          {/* Range hint */}
          <p className="input-hint" style={{ marginTop: 'var(--space-1)', textAlign: 'center' }}>
            النطاق المدعوم: {minYear}–{maxYear}
          </p>

          {/* Year out-of-range warning */}
          {!yearValid && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                padding: 'var(--space-2) var(--space-3)',
                background: 'var(--danger-soft)',
                border: '1px solid var(--danger-border)',
                borderRadius: 'var(--radius-md)',
              }}
            >
              <Warning size={14} weight="fill" color="var(--danger)" />
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--danger)', fontWeight: 'var(--font-medium)' }}>
                السنة يجب أن تكون بين {minYear} و {maxYear}
              </span>
            </div>
          )}
        </div>

        {/* ── Calculation method ────────────────────────────────────── */}
        <div className="input-group">
          <span className="input-label">طريقة الحساب</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            {METHODS.map((meth) => {
              const active = method === meth.value;
              return (
                <label
                  key={meth.value}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-3)',
                    padding: 'var(--space-3) var(--space-4)',
                    borderRadius: 'var(--radius-lg)',
                    border: `1px solid ${active ? 'var(--border-accent-strong)' : 'var(--border-subtle)'}`,
                    background: active ? 'var(--accent-soft)' : 'var(--bg-surface-3)',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)',
                    boxShadow: active ? '0 0 0 1px var(--border-accent)' : 'none',
                  }}
                  onMouseEnter={e => {
                    if (!active) (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-default)';
                  }}
                  onMouseLeave={e => {
                    if (!active) (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-subtle)';
                  }}
                >
                  <input
                    type="radio"
                    name="method"
                    value={meth.value}
                    checked={active}
                    onChange={() => setMethod(meth.value)}
                    className="sr-only"
                  />

                  {/* Method icon */}
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 'var(--radius-sm)',
                      background: active ? 'var(--accent-gradient)' : 'var(--bg-surface-4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      transition: 'all var(--transition-fast)',
                    }}
                  >
                    <meth.Icon
                      weight="duotone"
                      size={16}
                      color={active ? '#fff' : 'var(--text-muted)'}
                    />
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: 'var(--text-sm)',
                        fontWeight: 'var(--font-semibold)',
                        color: active ? 'var(--accent-alt)' : 'var(--text-primary)',
                        lineHeight: 'var(--leading-tight)',
                      }}
                    >
                      {meth.label}
                    </div>
                    <div
                      style={{
                        fontSize: 'var(--text-xs)',
                        color: 'var(--text-muted)',
                        marginTop: '2px',
                        lineHeight: 'var(--leading-snug)',
                      }}
                    >
                      {meth.sub}
                    </div>
                  </div>

                  {/* Country flags */}
                  <span
                    style={{ fontSize: '0.75rem', letterSpacing: '1px', flexShrink: 0, opacity: 0.85 }}
                    aria-hidden="true"
                  >
                    {meth.countries}
                  </span>

                  {/* Active check */}
                  {active && (
                    <div
                      style={{
                        width: 18,
                        height: 18,
                        borderRadius: 'var(--radius-full)',
                        background: 'var(--accent-gradient)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Check size={10} weight="bold" color="#fff" />
                    </div>
                  )}
                </label>
              );
            })}
          </div>
        </div>

        {/* ── Submit button ─────────────────────────────────────────── */}
        <button
          type="submit"
          disabled={isPending || !formValid}
          className="btn btn-primary btn-block btn-lg"
          style={{
            marginTop: 'auto',
            gap: 'var(--space-3)',
            letterSpacing: 0,
          }}
        >
          {isPending ? (
            <>
              <ArrowClockwise size={18} weight="bold" className="animate-spin-slow" />
              جارٍ التحويل…
            </>
          ) : (
            <>
              <ArrowsLeftRight size={18} weight="bold" />
              تحويل التاريخ
            </>
          )}
        </button>

        {/* Mobile nudge — shown only below lg */}
        {(result || isPending) && (
          <div
            className="lg:hidden"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 'var(--space-2)',
              fontSize: 'var(--text-xs)',
              color: 'var(--text-muted)',
              marginTop: 'calc(-1 * var(--space-3))',
            }}
          >
            <ArrowDown size={12} weight="bold" />
            انتقل لأسفل لرؤية النتيجة
          </div>
        )}
      </form>

      {/* ── RESULT PANEL ──────────────────────────────────────────────── */}
      <div
        ref={resultRef}
        className={cn(
          'card flex flex-col',
          result && 'card--accent',
        )}
        style={{
          minHeight: 320,
          ...((!result && !error) && { justifyContent: 'center', alignItems: 'center' }),
        }}
      >
        {/* ── Empty state ── */}
        {!result && !error && (
          <div
            className="empty-state"
            style={{ gap: 'var(--space-4)', padding: 'var(--space-10) var(--space-6)' }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 'var(--radius-2xl)',
                background: 'var(--bg-surface-3)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: 0.5,
              }}
            >
              <ArrowsLeftRight weight="duotone" size={28} color="var(--text-muted)" />
            </div>
            <div>
              <p className="empty-state__title" style={{ fontSize: 'var(--text-base)' }}>
                أدخل تاريخاً وابدأ التحويل
              </p>
              <p className="empty-state__description" style={{ fontSize: 'var(--text-sm)', marginTop: 'var(--space-2)' }}>
                ستظهر النتيجة المفصّلة هنا فوراً بعد الضغط على زر التحويل
              </p>
            </div>
          </div>
        )}

        {/* ── Error state ── */}
        {error && (
          <div
            className="card--danger card-nested"
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 'var(--space-3)',
              padding: 'var(--space-4)',
            }}
          >
            <Warning size={20} weight="fill" color="var(--danger)" style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <div
                style={{
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-semibold)',
                  color: 'var(--danger)',
                  marginBottom: 'var(--space-1)',
                }}
              >
                خطأ في التحويل
              </div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>{error}</div>
            </div>
          </div>
        )}

        {/* ── Result ── */}
        {result && (
          <>
            {/* Gradient header */}
            <div
              style={{
                background: 'var(--accent-gradient)',
                margin: 'calc(-1 * var(--space-6)) calc(-1 * var(--space-6)) var(--space-6)',
                padding: 'var(--space-3) var(--space-5)',
                borderRadius: 'var(--radius-xl) var(--radius-xl) 0 0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span
                style={{
                  fontSize: 'var(--text-xs)',
                  fontWeight: 'var(--font-bold)',
                  color: 'rgba(255,255,255,0.75)',
                  letterSpacing: 'var(--tracking-wide)',
                  textTransform: 'uppercase',
                }}
              >
                نتيجة التحويل
              </span>
              <Link
                href={buildPermalink()}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-1-5)',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 'var(--font-medium)',
                  color: 'rgba(255,255,255,0.65)',
                  textDecoration: 'none',
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-full)',
                  background: 'rgba(255,255,255,0.12)',
                  backdropFilter: 'blur(8px)',
                  transition: 'background var(--transition-fast)',
                }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.20)'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.12)'}
              >
                <LinkIcon size={11} weight="bold" />
                صفحة دائمة
              </Link>
            </div>

            {/* Main result */}
            <div
              style={{
                textAlign: 'center',
                marginBottom: 'var(--space-6)',
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <div
                style={{
                  fontSize: 'clamp(1.6rem, 5vw, 2.5rem)',
                  fontWeight: 'var(--font-black)',
                  color: 'var(--accent-alt)',
                  lineHeight: 'var(--leading-tight)',
                  marginBottom: 'var(--space-2)',
                  letterSpacing: 0,
                }}
              >
                {result.formatted.ar}
              </div>
              <div
                style={{
                  fontSize: 'var(--text-base)',
                  fontWeight: 'var(--font-semibold)',
                  color: 'var(--text-secondary)',
                  letterSpacing: 'var(--tracking-wide)',
                }}
              >
                {result.formatted.en}
              </div>
            </div>

            {/* Details */}
            <div className="card-nested" style={{ marginBottom: 'var(--space-5)', marginTop: 'auto' }}>
              {[
                {
                  label: 'اليوم',
                  value: result.dayNameAr,
                  icon: <CalendarBlank size={13} weight="duotone" />,
                },
                {
                  label: 'التاريخ الرقمي (ISO)',
                  value: result.formatted.iso,
                  icon: <Globe size={13} weight="duotone" />,
                },
                {
                  label: 'الرقم الفلكي لليوم',
                  value: Math.floor(result.julianDay).toLocaleString('en'),
                  icon: <Compass size={13} weight="duotone" />,
                },
              ].map(({ label, value, icon }, i, arr) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: 'var(--space-2-5) 0',
                    borderBottom: i < arr.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                  }}
                >
                  <span
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--space-1-5)',
                      fontSize: 'var(--text-xs)',
                      color: 'var(--text-muted)',
                    }}
                  >
                    {icon}
                    {label}
                  </span>
                  <span
                    style={{
                      fontSize: 'var(--text-sm)',
                      fontWeight: 'var(--font-bold)',
                      color: 'var(--text-primary)',
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    {value}
                  </span>
                </div>
              ))}
            </div>

            {/* Copy button */}
            <button
              type="button"
              onClick={handleCopy}
              className={`btn btn-block ${copied ? 'btn-secondary' : 'btn-surface'}`}
              style={{ gap: 'var(--space-2)' }}
            >
              {copied ? (
                <>
                  <Check size={16} weight="bold" />
                  تم النسخ
                </>
              ) : (
                <>
                  <Copy size={16} weight="duotone" />
                  نسخ النتيجة
                </>
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
}