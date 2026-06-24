"use client";

import { useMemo, useState } from 'react';
import { CalendarBlank, CalendarCheck, CurrencyDollar, Info } from '@phosphor-icons/react';

import { CalcInput as Input } from '@/components/calculators/controls.client';
import CalculatorCurrencyField, { usePreferredCurrency } from '@/components/calculators/CurrencyField.client';
import ResultActions from '@/components/calculators/ResultActions.client';
import { Label } from '@/components/ui/label';
import {
  ANNUAL_LEAVE_COUNTRIES,
  calculateAnnualLeave,
  formatCurrency,
  formatNumber,
} from '@/lib/calculators/engine';

const COUNTRY_CURRENCY = {
  sa: 'SAR', ae: 'AED', kw: 'KWD', qa: 'QAR', bh: 'BHD', om: 'OMR', eg: 'EGP', jo: 'JOD',
};

export default function AnnualLeaveCalculator() {
  const { currency, setCurrency, options: currencyOptions } = usePreferredCurrency();
  const [country, setCountry] = useState('sa');
  const [monthlySalary, setMonthlySalary] = useState('8000');
  const [yearsWorked, setYearsWorked] = useState('3');
  const [daysUsed, setDaysUsed] = useState('0');

  const formatMoney = (v) => formatCurrency(v, currency);

  function handleCountryChange(code) {
    setCountry(code);
    if (COUNTRY_CURRENCY[code]) setCurrency(COUNTRY_CURRENCY[code]);
  }

  const result = useMemo(
    () => calculateAnnualLeave({ monthlySalary, yearsWorked, daysUsed, country }),
    [monthlySalary, yearsWorked, daysUsed, country],
  );

  const shareText = result.isValid
    ? `حاسبة الإجازة السنوية\nالاستحقاق: ${formatNumber(result.entitledDays)} يوم\nالرصيد المتبقي: ${formatNumber(result.balance)} يوم\nقيمة الرصيد: ${formatMoney(result.leaveBalance)}`
    : '';

  const usagePct = result.isValid
    ? Math.min(100, Math.round((result.daysUsed / result.entitledDays) * 100))
    : 0;

  return (
    <div className="calc-app annual-leave-tool" aria-label="حاسبة الإجازة السنوية">
      <div className="calc-esb-layout">

        {/* ── FORM ─────────────────────────────────── */}
        <div className="calc-esb-form-col">
          <div className="calc-surface-card calc-esb-form-card" style={{ borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface-1)' }}>
            <div className="calc-esb-form-body">

              {/* Country selector */}
              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">1</span>
                  <Label>دولة العمل</Label>
                </div>
                <div className="leave-country-grid">
                  {Object.entries(ANNUAL_LEAVE_COUNTRIES).map(([code, c]) => (
                    <button
                      key={code}
                      type="button"
                      className={`leave-country-btn${country === code ? ' is-active' : ''}`}
                      onClick={() => handleCountryChange(code)}
                    >
                      <span className="leave-flag">{c.flag}</span>
                      <span>{c.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Salary */}
              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">2</span>
                  <Label htmlFor="leave-salary">الراتب الشهري</Label>
                </div>
                <div className="calc-esb-money-row">
                  <Input
                    id="leave-salary"
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
                  id="leave-currency"
                  style={{ marginTop: '0.5rem' }}
                />
                <p className="calc-hint">استخدم الراتب الأساسي أو الإجمالي حسب ما ينص عليه عقدك</p>
              </div>

              {/* Years worked */}
              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">3</span>
                  <Label htmlFor="leave-years">سنوات الخدمة</Label>
                </div>
                <Input
                  id="leave-years"
                  inputMode="decimal"
                  value={yearsWorked}
                  onChange={(e) => setYearsWorked(e.target.value)}
                  placeholder="3"
                />
                {result.isValid && (
                  <p className="calc-hint leave-entitlement-note">
                    <Info size={12} weight="bold" />
                    {result.entitlementNote}
                  </p>
                )}
              </div>

              {/* Days used */}
              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">4</span>
                  <Label htmlFor="leave-used">أيام الإجازة المأخوذة هذه السنة</Label>
                </div>
                <Input
                  id="leave-used"
                  inputMode="decimal"
                  value={daysUsed}
                  onChange={(e) => setDaysUsed(e.target.value)}
                  placeholder="0"
                />
              </div>

            </div>
          </div>
        </div>

        {/* ── RESULT ───────────────────────────────── */}
        <div className="calc-esb-result-col">
          {result.isValid ? (
            <div className="calc-result-hero-panel --amber annual-leave-result" aria-live="polite">

              <div>
                <span className="calc-result-hero-label">قيمة رصيد الإجازة</span>
                <div className="calc-result-hero-value">{formatMoney(result.leaveBalance)}</div>
                <div className="calc-result-hero-meta">
                  <span>{formatNumber(result.balance)} يوم متبقي</span>
                  <span className="calc-esb-sep">·</span>
                  <span>من أصل {formatNumber(result.entitledDays)} يوم</span>
                </div>
              </div>

              {/* Usage bar */}
              {result.entitledDays > 0 && (
                <div className="leave-usage-bar-wrap">
                  <div className="leave-usage-bar-track">
                    <div
                      className="leave-usage-bar-fill"
                      style={{ width: `${usagePct}%` }}
                      role="progressbar"
                      aria-valuenow={usagePct}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    />
                    {result.balance > 0 && (
                      <div
                        className="leave-usage-bar-remaining"
                        style={{ width: `${100 - usagePct}%` }}
                      />
                    )}
                  </div>
                  <div className="leave-usage-bar-labels">
                    <span>{formatNumber(result.daysUsed)} يوم مستخدم</span>
                    <span>{formatNumber(result.balance)} يوم متبقي</span>
                  </div>
                </div>
              )}

              <div className="calc-esb-breakdown">
                <div className="calc-esb-brow">
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <CalendarBlank size={14} weight="bold" />
                    الاستحقاق السنوي
                  </span>
                  <strong>{formatNumber(result.entitledDays)} يوم</strong>
                </div>
                <div className="calc-esb-brow">
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <CalendarCheck size={14} weight="bold" />
                    يتراكم شهرياً
                  </span>
                  <strong>{result.accrualPerMonth.toFixed(2)} يوم/شهر</strong>
                </div>
                <div className="calc-esb-brow">
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <CurrencyDollar size={14} weight="bold" />
                    الأجر اليومي
                  </span>
                  <strong>{formatMoney(result.dailySalary)}</strong>
                </div>
                <div className="calc-esb-brow calc-esb-brow--total">
                  <span>إجمالي قيمة الإجازة السنوية</span>
                  <strong>{formatMoney(result.totalLeaveValue)}</strong>
                </div>
              </div>

              <ResultActions
                copyText={shareText}
                shareTitle="حاسبة الإجازة السنوية"
                shareText={shareText}
              />

            </div>
          ) : (
            <div className="calc-esb-empty-state">
              <CalendarBlank size={28} weight="duotone" />
              <p>أدخل الراتب وسنوات الخدمة لحساب رصيد الإجازة.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
