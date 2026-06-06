'use client';
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
import { HIJRI_MONTHS_AR } from '@/lib/hijri-utils';
import { convertDateAction } from './actions';
import type { ConvertDateResult, ConversionMethod } from '@/lib/date-adapter';
import { GREGORIAN_MONTHS_AR } from '@/lib/constants';
import { cn } from '@/lib/utils';
import styles from './ConverterForm.module.css';

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
    countries: 'السعودية ودول الخليج',
    Icon: Globe,
  },
  {
    value: 'astronomical',
    label: 'الرصد الفلكي',
    sub: 'المغرب، مصر، الشام',
    countries: 'المغرب ومصر والشام',
    Icon: Compass,
  },
  {
    value: 'civil',
    label: 'مدني / حسابي',
    sub: 'للحسابات الأكاديمية',
    countries: 'أكاديمي',
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
    <div className={`input-group ${styles.spinnerRoot}`}>
      <span className={`input-label ${styles.spinnerLabel}`}>
        {label}
      </span>

      <div className={`${styles.spinnerShell} ${isInvalid ? styles.spinnerShellInvalid : ''}`}>
        <button
          type="button"
          onClick={increment}
          aria-label={`زيادة ${label}`}
          className={`${styles.spinnerButton} ${styles.spinnerButtonTop}`}
        >
          <CaretUp weight="bold" size={14} />
        </button>

        {editing ? (
          <input
            ref={inputRef}
            type="number"
            value={raw}
            aria-label={label}
            onChange={e => setRaw(e.target.value)}
            onBlur={commitEdit}
            onKeyDown={handleKey}
            className={styles.spinnerInput}
          />
        ) : (
          <div
            role="spinbutton"
            aria-valuenow={value}
            aria-valuemin={min}
            aria-valuemax={max}
            aria-label={label}
            tabIndex={0}
            onClick={startEdit}
            onFocus={startEdit}
            className={`${styles.spinnerValue} ${isInvalid ? styles.spinnerValueInvalid : ''}`}
          >
            {placeholder && !value ? placeholder : value}
          </div>
        )}

        <button
          type="button"
          onClick={decrement}
          aria-label={`تقليل ${label}`}
          className={`${styles.spinnerButton} ${styles.spinnerButtonBottom}`}
        >
          <CaretDown weight="bold" size={14} />
        </button>
      </div>

      {isInvalid && (
        <span className={styles.spinnerHint}>
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
  defaultYear,
  defaultMonth,
  defaultDay,
  defaultDirection,
  lockedDirection,
}: Props) {
  const resolvedDefaultDirection = defaultDirection ?? 'gregorian-to-hijri';
  const resolvedLockedDirection = lockedDirection ?? false;
  const [direction, setDirection] = useState<Direction>(resolvedDefaultDirection);
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
      try {
        const res = await convertDateAction(direction, year, month, day, method);
        if (res.success && res.result) {
          setResult(res.result);
          setTimeout(() => {
            if (window.innerWidth < 1024) {
              resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }, 100);
        } else {
          setError(res.error ?? 'تعذر تحويل التاريخ. راجع اليوم والشهر والسنة ثم أعد المحاولة.');
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : 'تعذر تحويل التاريخ بسبب خطأ غير متوقع.');
      }
    });
  }

  async function handleCopy() {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result.formatted.ar);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'تعذر نسخ النتيجة من المتصفح.');
    }
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
    <div className={styles.layout}>
      <form onSubmit={handleSubmit} className={styles.panel}>
        <div className={styles.panelHeader}>
          <div className={styles.panelIcon}>
            <ArrowsLeftRight weight="duotone" size={18} color="var(--accent-alt)" />
          </div>
          <div>
            <div className={styles.panelTitle}>محوّل التاريخ</div>
            <div className={styles.panelSubtitle}>هجري ↔ ميلادي</div>
          </div>
        </div>

        {!resolvedLockedDirection && (
          <div className={styles.fieldGroup}>
            <span className={styles.inputLabel}>اتجاه التحويل</span>
            <div className={styles.directionGroup}>
              <button
                type="button"
                onClick={() => { setDirection('gregorian-to-hijri'); setResult(null); setError(null); }}
                aria-pressed={direction === 'gregorian-to-hijri'}
                aria-label="تحويل من ميلادي إلى هجري"
                className={`${styles.directionButton} ${direction === 'gregorian-to-hijri' ? styles.directionButtonActive : ''}`}
              >
                <CalendarBlank className="mx-auto" weight={direction === 'gregorian-to-hijri' ? 'duotone' : 'regular'} size={20} />
                <span>ميلادي → هجري</span>
              </button>

              <button
                type="button"
                onClick={switchDirection}
                title="تبديل الاتجاه"
                aria-label="تبديل اتجاه التحويل"
                className={`btn btn-ghost btn-icon btn-sm ${styles.swapButton}`}
              >
                <ArrowsDownUp size={14} weight="bold" />
              </button>

              <button
                type="button"
                onClick={() => { setDirection('hijri-to-gregorian'); setResult(null); setError(null); }}
                aria-pressed={direction === 'hijri-to-gregorian'}
                aria-label="تحويل من هجري إلى ميلادي"
                className={`${styles.directionButton} ${direction === 'hijri-to-gregorian' ? styles.directionButtonActive : ''}`}
              >
                <Moon className="mx-auto" weight={direction === 'hijri-to-gregorian' ? 'duotone' : 'regular'} size={20} />
                <span>هجري → ميلادي</span>
              </button>
            </div>
          </div>
        )}

        <div className={styles.fieldGroup}>
          <span className={styles.inputLabel}>
            {isHijriInput ? 'أدخل التاريخ الهجري' : 'أدخل التاريخ الميلادي'}
          </span>

          <div className={styles.dateGrid}>
            <NumberSpinner
              value={day}
              min={1}
              max={maxDay}
              onChange={setDay}
              label="اليوم"
            />

            <div className={styles.monthGroup}>
              <span className={styles.spinnerLabel}>
                الشهر
              </span>
              <select
                value={month}
                onChange={e => setMonth(Number(e.target.value))}
                className={`select ${styles.monthSelect}`}
                aria-label="الشهر"
              >
                {monthNames.map((mn, i) => (
                  <option key={mn} value={i + 1}>{mn}</option>
                ))}
              </select>
            </div>

            <NumberSpinner
              value={year}
              min={minYear}
              max={maxYear}
              onChange={setYear}
              label="السنة"
            />
          </div>

          <p className={styles.rangeHint}>
            النطاق المدعوم: {minYear}–{maxYear}
          </p>

          {!yearValid && (
            <div className={styles.fieldWarning}>
              <Warning size={14} weight="fill" color="var(--danger)" />
              <span className={styles.fieldWarningText}>
                السنة يجب أن تكون بين {minYear} و {maxYear}
              </span>
            </div>
          )}
        </div>

        <div className={styles.fieldGroup}>
          <span className={styles.inputLabel}>طريقة الحساب</span>
          <div className={styles.methodList}>
            {METHODS.map((meth) => {
              const active = method === meth.value;
              return (
                <label
                  key={meth.value}
                  className={`${styles.methodOption} ${active ? styles.methodOptionActive : ''}`}
                >
                  <input
                    type="radio"
                    name="method"
                    value={meth.value}
                    checked={active}
                    onChange={() => setMethod(meth.value)}
                    className="sr-only"
                  />

                  <div className={styles.methodIcon}>
                    <meth.Icon
                      weight="duotone"
                      size={16}
                      color="currentColor"
                    />
                  </div>

                  <div className={styles.methodBody}>
                    <div className={styles.methodTitle}>
                      {meth.label}
                    </div>
                    <div className={styles.methodSubtitle}>
                      {meth.sub}
                    </div>
                  </div>

                  <span className={styles.methodCountry}>
                    {meth.countries}
                  </span>

                  {active && (
                    <div className={styles.activeCheck}>
                      <Check size={10} weight="bold" color="currentColor" />
                    </div>
                  )}
                </label>
              );
            })}
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending || !formValid}
          className={`btn btn-primary btn-block btn-lg ${styles.submitButton}`}
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

        {(result || isPending) && (
          <div className={`lg:hidden ${styles.mobileNudge}`}>
            <ArrowDown size={12} weight="bold" />
            انتقل لأسفل لرؤية النتيجة
          </div>
        )}
      </form>

      <div
        ref={resultRef}
        aria-live="polite"
        className={cn(
          styles.resultPanel,
          result && styles.resultPanelAccent,
          !result && !error && styles.emptyResultPanel,
        )}
      >
        {!result && !error && (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <ArrowsLeftRight weight="duotone" size={28} color="currentColor" />
            </div>
            <div>
              <p className={styles.emptyTitle}>
                أدخل تاريخاً وابدأ التحويل
              </p>
              <p className={styles.emptyDescription}>
                ستظهر النتيجة المفصّلة هنا فوراً بعد الضغط على زر التحويل
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className={styles.errorBox} role="alert">
            <Warning size={20} weight="fill" color="var(--danger)" />
            <div>
              <p className={styles.errorTitle}>
                خطأ في التحويل
              </p>
              <p className={styles.errorText}>{error}</p>
            </div>
          </div>
        )}

        {result && (
          <>
            <div className={styles.resultHeader}>
              <span className={styles.resultHeaderLabel}>
                نتيجة التحويل
              </span>
              <Link
                href={buildPermalink()}
                className={styles.permalink}
              >
                <LinkIcon size={11} weight="bold" />
                صفحة دائمة
              </Link>
            </div>

            <div className={styles.resultMain}>
              <p className={styles.resultPrimary}>
                {result.formatted.ar}
              </p>
              <p className={styles.resultSecondary}>
                {result.formatted.en}
              </p>
            </div>

            <div className={styles.detailList}>
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
              ].map(({ label, value, icon }) => (
                <div
                  key={label}
                  className={styles.detailRow}
                >
                  <span className={styles.detailLabel}>
                    {icon}
                    {label}
                  </span>
                  <span className={styles.detailValue}>
                    {value}
                  </span>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={handleCopy}
              className={`btn btn-block ${styles.copyButton} ${copied ? 'btn-secondary' : 'btn-surface'}`}
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
