"use client";

import { useMemo, useState } from 'react';
import { ArrowsLeftRight, Briefcase, CalendarBlank, Clock, CurrencyDollar } from '@phosphor-icons/react';

import { CalcInput as Input } from '@/components/calculators/controls.client';
import CalculatorCurrencyField, { usePreferredCurrency } from '@/components/calculators/CurrencyField.client';
import ResultActions from '@/components/calculators/ResultActions.client';
import { Label } from '@/components/ui/label';
import {
  calculateSalaryBreakdown,
  formatCurrency,
  formatNumber,
} from '@/lib/calculators/engine';

const DAY_PRESETS = [
  { label: '30 يوم (نظام العمل الخليجي)', value: '30' },
  { label: '22 يوم (أيام عمل فعلية)', value: '22' },
  { label: '26 يوم', value: '26' },
];

export default function SalaryCalculator() {
  const { currency, setCurrency, options: currencyOptions } = usePreferredCurrency();
  const [monthlySalary, setMonthlySalary] = useState('8000');
  const [hoursPerDay, setHoursPerDay] = useState('8');
  const [daysPerMonth, setDaysPerMonth] = useState('30');
  const [extraMonths, setExtraMonths] = useState('0');

  const formatMoney = (value) => formatCurrency(value, currency);

  const result = useMemo(
    () => calculateSalaryBreakdown({ monthlySalary, hoursPerDay, daysPerMonth, extraMonths }),
    [monthlySalary, hoursPerDay, daysPerMonth, extraMonths],
  );

  const shareText = result.isValid
    ? `الراتب الشهري: ${formatMoney(result.monthly)}\nاليومي: ${formatMoney(result.daily)}\nالساعي: ${formatMoney(result.hourly)}\nالسنوي: ${formatMoney(result.annual)}`
    : '';

  return (
    <div className="calc-app salary-tool" aria-label="حاسبة الراتب">
      <div className="calc-esb-layout">

        {/* ── FORM ─────────────────────────────────── */}
        <div className="calc-esb-form-col">
          <div className="calc-surface-card calc-esb-form-card" style={{ borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface-1)', overflow: 'hidden' }}>
            <div className="calc-esb-form-body">

              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">1</span>
                  <Label htmlFor="salary-monthly">الراتب الشهري</Label>
                </div>
                <div className="calc-esb-money-row">
                  <Input
                    id="salary-monthly"
                    inputMode="decimal"
                    value={monthlySalary}
                    onChange={(e) => setMonthlySalary(e.target.value)}
                    placeholder="8000"
                  />
                  <span className="calc-esb-currency">{currency}</span>
                </div>
                <CalculatorCurrencyField
                  currency={currency}
                  onChange={setCurrency}
                  options={currencyOptions}
                  id="salary-currency"
                  style={{ marginTop: '0.5rem' }}
                />
              </div>

              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">2</span>
                  <Label>أيام العمل في الشهر</Label>
                </div>
                <div className="calc-kbd-row" style={{ flexWrap: 'wrap', gap: '0.5rem' }}>
                  {DAY_PRESETS.map((preset) => (
                    <button
                      key={preset.value}
                      type="button"
                      className={`chip calc-chip-button${daysPerMonth === preset.value ? ' is-active' : ''}`}
                      onClick={() => setDaysPerMonth(preset.value)}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
                <Input
                  id="salary-days"
                  inputMode="decimal"
                  value={daysPerMonth}
                  onChange={(e) => setDaysPerMonth(e.target.value)}
                  placeholder="30"
                />
                <p className="calc-hint">نظام العمل في السعودية والإمارات يستخدم 30 يوم لحساب الأجر اليومي</p>
              </div>

              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">3</span>
                  <Label htmlFor="salary-hours">ساعات العمل اليومية</Label>
                </div>
                <Input
                  id="salary-hours"
                  inputMode="decimal"
                  value={hoursPerDay}
                  onChange={(e) => setHoursPerDay(e.target.value)}
                  placeholder="8"
                />
                <p className="calc-hint">يؤثر فقط على حساب الأجر الساعي</p>
              </div>

              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">4</span>
                  <Label htmlFor="salary-extra">شهور إضافية في السنة</Label>
                </div>
                <Input
                  id="salary-extra"
                  inputMode="decimal"
                  value={extraMonths}
                  onChange={(e) => setExtraMonths(e.target.value)}
                  placeholder="0"
                />
                <p className="calc-hint">أضف شهوراً إضافية مثل مكافأة السنة أو الراتب الثالث عشر</p>
              </div>

            </div>
          </div>
        </div>

        {/* ── RESULT ───────────────────────────────── */}
        <div className="calc-esb-result-col">
          {result.isValid ? (
            <div className="calc-result-hero-panel --green salary-result-panel" aria-live="polite">

              <div>
                <span className="calc-result-hero-label">الراتب السنوي</span>
                <div className="calc-result-hero-value">{formatMoney(result.annual)}</div>
                <div className="calc-result-hero-meta">
                  <span>{formatNumber(result.extraMonths > 0 ? 12 + result.extraMonths : 12)} شهراً</span>
                  {result.extraMonths > 0 && (
                    <>
                      <span className="calc-esb-sep">·</span>
                      <span>يشمل {formatNumber(result.extraMonths)} شهر إضافي</span>
                    </>
                  )}
                </div>
              </div>

              <div className="calc-esb-breakdown">
                <div className="calc-esb-brow">
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <CalendarBlank size={14} weight="bold" />
                    كل أسبوع
                  </span>
                  <strong>{formatMoney(result.weekly)}</strong>
                </div>
                <div className="calc-esb-brow">
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <CalendarBlank size={14} weight="bold" />
                    كل نصف شهر
                  </span>
                  <strong>{formatMoney(result.semiMonthly)}</strong>
                </div>
                <div className="calc-esb-brow">
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Briefcase size={14} weight="bold" />
                    {`كل يوم (من ${formatNumber(result.daysPerMonth)} يوم)`}
                  </span>
                  <strong>{formatMoney(result.daily)}</strong>
                </div>
                <div className="calc-esb-brow calc-esb-brow--total">
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Clock size={14} weight="bold" />
                    {`كل ساعة (${formatNumber(result.hoursPerDay)} ساعة/يوم)`}
                  </span>
                  <strong>{formatMoney(result.hourly)}</strong>
                </div>
              </div>

              <div className="salary-minute-note">
                <ArrowsLeftRight size={13} weight="bold" />
                <span>الدقيقة الواحدة تساوي {formatCurrency(result.minutely, currency)}</span>
              </div>

              <ResultActions
                copyText={shareText}
                shareTitle="حاسبة الراتب"
                shareText={shareText}
              />

            </div>
          ) : (
            <div className="calc-esb-empty-state">
              <CurrencyDollar size={28} weight="duotone" />
              <p>أدخل راتبك الشهري لترى التفاصيل.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
