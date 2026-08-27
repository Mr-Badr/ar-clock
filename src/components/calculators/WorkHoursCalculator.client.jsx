"use client";

import { useMemo, useState } from 'react';
import { Info } from '@phosphor-icons/react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import CountryFlag from '@/components/shared/CountryFlag';
import { GULF_CURRENCIES } from '@/lib/hvac/gulf-currencies';
import { fmt } from '@/lib/calculators/building/constants';

// Overtime-multiplier presets — 1.5× is Saudi Labor Law Article 107's real mandated minimum
// (verified via multiple independent legal sources, 2026-08-25: overtime = base hourly wage +
// 50% of it = 150% total). Kept as the default, sensible option, but always editable — other
// Gulf/Arab countries' minimums differ and an individual contract can legally exceed the minimum,
// so this tool never asserts one fixed rate as universally correct (same reasoning as the
// currency selector below: the user's real number always wins over a suggested default).
const OVERTIME_MULTIPLIERS = [
  { id: '1.25', label: '1.25×', value: 1.25 },
  { id: '1.5', label: '1.5×', value: 1.5 },
  { id: '2', label: '2×', value: 2 },
];

function FieldHint({ text }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button type="button" className="tool-v2-field-hint-btn" aria-label="توضيح">
            <Info size={14} weight="bold" />
          </button>
        </TooltipTrigger>
        <TooltipContent>{text}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default function WorkHoursCalculator() {
  const [countryCode, setCountryCode] = useState('sa');
  const [hourlyRate, setHourlyRate] = useState('30');
  const [regularHours, setRegularHours] = useState(40);
  const [overtimeHours, setOvertimeHours] = useState(0);
  const [multiplierId, setMultiplierId] = useState('1.5');

  // Optional helper: derive hourly rate from a monthly salary — the monthly-hours field is
  // always user-entered, never a fixed assumed divisor (working-hour norms genuinely differ by
  // contract and country), so this never asserts a single "correct" formula.
  const [showMonthlyHelper, setShowMonthlyHelper] = useState(false);
  const [monthlySalary, setMonthlySalary] = useState('');
  const [monthlyHours, setMonthlyHours] = useState('240');

  const country = GULF_CURRENCIES.find((c) => c.code === countryCode) ?? GULF_CURRENCIES[0];
  const multiplier = OVERTIME_MULTIPLIERS.find((m) => m.id === multiplierId)?.value ?? 1.5;

  const effectiveRate = Math.max(0, Number(hourlyRate) || 0);
  const effectiveRegularHours = Math.max(0, Number(regularHours) || 0);
  const effectiveOvertimeHours = Math.max(0, Number(overtimeHours) || 0);

  function applyMonthlyHelper() {
    const salary = Number(monthlySalary) || 0;
    const hours = Number(monthlyHours) || 0;
    if (salary > 0 && hours > 0) {
      setHourlyRate((salary / hours).toFixed(2));
    }
  }

  const result = useMemo(() => {
    const regularPay = effectiveRate * effectiveRegularHours;
    const overtimePay = effectiveRate * multiplier * effectiveOvertimeHours;
    const total = regularPay + overtimePay;
    return { regularPay, overtimePay, total };
  }, [effectiveRate, effectiveRegularHours, effectiveOvertimeHours, multiplier]);

  return (
    <div aria-label="حاسبة ساعات العمل والراتب">
      <div className="tool-v2-panel-head">
        <span className="tool-v2-country-badge">
          <span className="tool-v2-live-dot" aria-hidden="true" />
          <CountryFlag code={country.code} /> {country.country}
        </span>
      </div>

      <div className="tool-v2-field">
        <label>دولتك (للعملة فقط)</label>
        <div className="guide-v2-checker-options" role="group" aria-label="اختر دولتك">
          {GULF_CURRENCIES.map((c) => (
            <button key={c.code} type="button" className={`guide-v2-checker-chip${countryCode === c.code ? ' is-active' : ''}`} aria-pressed={countryCode === c.code} onClick={() => setCountryCode(c.code)}>
              <CountryFlag code={c.code} /> {c.country}
            </button>
          ))}
        </div>
      </div>

      <div className="tool-v2-field">
        <label htmlFor="wh-hourly-rate">
          الأجر بالساعة ({country.short})
          <FieldHint text="إن كان راتبك شهرياً وليس بالساعة، استخدم الرابط أسفل الحقل لتحويله." />
        </label>
        <input id="wh-hourly-rate" type="number" inputMode="decimal" min="0" step="0.5" value={hourlyRate} onChange={(e) => setHourlyRate(e.target.value)} />
        <button type="button" className="tool-v2-inline-link-btn" onClick={() => setShowMonthlyHelper((v) => !v)}>
          {showMonthlyHelper ? 'إخفاء تحويل الراتب الشهري' : 'راتبي شهري وليس بالساعة؟'}
        </button>
        {showMonthlyHelper ? (
          <div className="tool-v2-field-row-pair" style={{ marginTop: 'var(--space-2)' }}>
            <div className="tool-v2-field">
              <label htmlFor="wh-monthly-salary">راتبك الشهري ({country.short})</label>
              <input id="wh-monthly-salary" type="number" inputMode="decimal" min="0" step="50" value={monthlySalary} onChange={(e) => setMonthlySalary(e.target.value)} />
            </div>
            <div className="tool-v2-field">
              <label htmlFor="wh-monthly-hours">
                ساعات عملك الفعلية بالشهر
                <FieldHint text="عدد ساعات عملك الحقيقية هذا الشهر — يختلف حسب عقدك وعدد أيام العمل، أدخل رقمك الفعلي لا تقديراً عاماً." />
              </label>
              <input id="wh-monthly-hours" type="number" inputMode="decimal" min="1" step="1" value={monthlyHours} onChange={(e) => setMonthlyHours(e.target.value)} />
            </div>
            <button type="button" className="tool-v2-mini-btn" onClick={applyMonthlyHelper}>احسب الأجر بالساعة</button>
          </div>
        ) : null}
      </div>

      <div className="tool-v2-field">
        <label htmlFor="wh-regular-hours">ساعات العمل العادية (لهذه الفترة)</label>
        <div id="wh-regular-hours" className="tool-v2-stepper" role="group" aria-label="ساعات العمل العادية">
          <button type="button" className="tool-v2-stepper-btn" onClick={() => setRegularHours((v) => Math.max(0, v - 1))} aria-label="تقليل">−</button>
          <span className="tool-v2-stepper-val">{regularHours}</span>
          <button type="button" className="tool-v2-stepper-btn" onClick={() => setRegularHours((v) => Math.min(200, v + 1))} aria-label="زيادة">+</button>
        </div>
      </div>

      <div className="tool-v2-field">
        <label htmlFor="wh-overtime-hours">ساعات العمل الإضافي (إن وُجدت)</label>
        <div id="wh-overtime-hours" className="tool-v2-stepper" role="group" aria-label="ساعات العمل الإضافي">
          <button type="button" className="tool-v2-stepper-btn" onClick={() => setOvertimeHours((v) => Math.max(0, v - 1))} aria-label="تقليل">−</button>
          <span className="tool-v2-stepper-val">{overtimeHours}</span>
          <button type="button" className="tool-v2-stepper-btn" onClick={() => setOvertimeHours((v) => Math.min(200, v + 1))} aria-label="زيادة">+</button>
        </div>
      </div>

      {effectiveOvertimeHours > 0 ? (
        <div className="tool-v2-field">
          <label>نسبة أجر ساعة العمل الإضافي</label>
          <div className="guide-v2-checker-options" role="group" aria-label="نسبة الأجر الإضافي">
            {OVERTIME_MULTIPLIERS.map((m) => (
              <button key={m.id} type="button" className={`guide-v2-checker-chip${multiplierId === m.id ? ' is-active' : ''}`} aria-pressed={multiplierId === m.id} onClick={() => setMultiplierId(m.id)}>
                {m.label}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <div aria-live="polite">
        <div className="tool-v2-result-hero">
          <span className="tool-v2-result-label">إجمالي الراتب المستحق لهذه الفترة</span>
          <div className="tool-v2-result-stat-row">
            <span className="tool-v2-result-stat">
              <span className="tool-v2-result-stat-value">{fmt(result.total)}</span>
              <span className="tool-v2-result-stat-label">{country.short}</span>
            </span>
          </div>
        </div>

        <div className="tool-v2-breakdown-list">
          <div className="tool-v2-breakdown-row">
            <span className="tool-v2-breakdown-label">أجر الساعات العادية ({fmt(effectiveRegularHours)} ساعة)</span>
            <span className="tool-v2-breakdown-value">{fmt(result.regularPay)} {country.short}</span>
          </div>
          {effectiveOvertimeHours > 0 ? (
            <div className="tool-v2-breakdown-row">
              <span className="tool-v2-breakdown-label">أجر الساعات الإضافية ({fmt(effectiveOvertimeHours)} ساعة × {multiplier}×)</span>
              <span className="tool-v2-breakdown-value">{fmt(result.overtimePay)} {country.short}</span>
            </div>
          ) : null}
        </div>

        <div className="tool-v2-note-strip">
          <Info size={15} weight="fill" />
          <span>هذا تقدير حسابي بحت بناءً على الأرقام التي أدخلتها — نسبة الأجر الإضافي القانونية الدنيا تختلف حسب دولتك وعقدك، راجع القسم أدناه قبل الاعتماد على الرقم في نزاع مع صاحب العمل.</span>
        </div>
      </div>
    </div>
  );
}
