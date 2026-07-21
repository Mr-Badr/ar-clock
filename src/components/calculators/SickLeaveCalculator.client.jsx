"use client";

import { useMemo, useState } from 'react';
import { CalendarBlank, FirstAidKit, Info, Wallet } from '@phosphor-icons/react';

import { CalcInput as Input } from '@/components/calculators/controls.client';
import CalculatorCurrencyField, { usePreferredCurrency } from '@/components/calculators/CurrencyField.client';
import ResultActions from '@/components/calculators/ResultActions.client';
import CountryFlag from '@/components/shared/CountryFlag';
import { Label } from '@/components/ui/label';
import { calculateSickLeavePay, formatCurrency, formatNumber } from '@/lib/calculators/engine';

export default function SickLeaveCalculator() {
  const { currency, setCurrency, options: currencyOptions } = usePreferredCurrency({ defaultCurrency: 'SAR' });
  const [monthlySalary, setMonthlySalary] = useState('8000');
  const [sickDays, setSickDays] = useState('20');

  const formatMoney = (v) => formatCurrency(v, currency);

  const result = useMemo(
    () => calculateSickLeavePay({ monthlySalary, sickDays }),
    [monthlySalary, sickDays],
  );

  const shareText = result.isValid
    ? `حاسبة الإجازة المرضية\nعدد الأيام: ${formatNumber(result.sickDays)} يوم\nإجمالي الراتب خلال الإجازة: ${formatMoney(result.totalPay)}\nالخصم: ${formatMoney(result.totalDeduction)}`
    : '';

  return (
    <div className="calc-app sick-leave-tool" aria-label="حاسبة الإجازة المرضية">
      <div className="calc-esb-layout">

        {/* ── FORM ─────────────────────────────────── */}
        <div className="calc-esb-form-col">
          <div className="calc-surface-card calc-esb-form-card">
            <div className="calc-esb-form-body">

              {/* Salary */}
              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">1</span>
                  <Label htmlFor="sick-leave-salary">الراتب الشهري</Label>
                </div>
                <div className="calc-esb-money-row">
                  <Input
                    id="sick-leave-salary"
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
                  id="sick-leave-currency"
                  style={{ marginTop: '0.5rem' }}
                />
              </div>

              {/* Sick days */}
              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">2</span>
                  <Label htmlFor="sick-leave-days">عدد أيام الإجازة المرضية</Label>
                </div>
                <Input
                  id="sick-leave-days"
                  inputMode="numeric"
                  value={sickDays}
                  onChange={(e) => setSickDays(e.target.value)}
                  placeholder="20"
                />
                <p className="calc-hint">
                  <Info size={12} weight="bold" style={{ display: 'inline', verticalAlign: '-1px' }} />
                  {' '}إجمالي الأيام المرضية المتراكمة خلال آخر 12 شهراً، لا أيام الإجازة الحالية فقط
                </p>
              </div>

            </div>
          </div>
        </div>

        {/* ── RESULT ───────────────────────────────── */}
        <div className="calc-esb-result-col">
          {result.isValid ? (
            <div className="calc-esb-result-panel sick-leave-result" aria-live="polite">
              <div className="calc-esb-result-header">
                <span className="calc-esb-country-badge calc-esb-country-badge--sa">
                  <CountryFlag code="sa" /> نظام العمل السعودي — المادة 117
                </span>
                <span className="calc-esb-live-dot" aria-hidden="true" />
              </div>

              <div className="calc-esb-amount-hero">
                <span className="calc-esb-amount-label">إجمالي الراتب خلال الإجازة المرضية</span>
                <div className="calc-esb-amount-value">{formatMoney(result.totalPay)}</div>
                <div className="calc-esb-amount-meta">
                  <span>عن {formatNumber(result.sickDays)} يوم</span>
                  <span className="calc-esb-sep">·</span>
                  <span>خصم {formatMoney(result.totalDeduction)} من الراتب الكامل</span>
                </div>
              </div>

              <div className="calc-esb-breakdown">
                <div className="calc-esb-brow">
                  <span className="calc-icon-label">
                    <FirstAidKit size={14} weight="bold" />
                    الأيام بأجر كامل (100%)
                  </span>
                  <strong>{formatNumber(result.fullPayDays)} يوم — {formatMoney(result.fullPayAmount)}</strong>
                </div>
                <div className="calc-esb-brow">
                  <span className="calc-icon-label">
                    <CalendarBlank size={14} weight="bold" />
                    الأيام بأجر 75%
                  </span>
                  <strong>{formatNumber(result.partialPayDays)} يوم — {formatMoney(result.partialPayAmount)}</strong>
                </div>
                <div className="calc-esb-brow">
                  <span className="calc-icon-label">
                    <Wallet size={14} weight="bold" />
                    الأيام بلا أجر (0%)
                  </span>
                  <strong>{formatNumber(result.unpaidDays)} يوم</strong>
                </div>
                <div className="calc-esb-brow calc-esb-brow--total">
                  <span>إجمالي الراتب المستحق خلال الإجازة</span>
                  <strong>{formatMoney(result.totalPay)}</strong>
                </div>
              </div>

              {result.excessDays > 0 && (
                <p className="calc-hint" style={{ marginTop: '0.5rem' }}>
                  تجاوزت {formatNumber(result.excessDays)} يوماً الحد الأقصى (120 يوماً) الذي تغطيه المادة 117 — الأيام الزائدة تخضع لأحكام أخرى، راجع جهة العمل أو التأمينات الاجتماعية (GOSI).
                </p>
              )}

              <ResultActions
                copyText={shareText}
                shareTitle="حاسبة الإجازة المرضية"
                shareText={shareText}
              />

            </div>
          ) : (
            <div className="calc-esb-empty-state">
              <FirstAidKit size={28} weight="duotone" />
              <p>أدخل الراتب الشهري وعدد أيام الإجازة المرضية لحساب المستحق.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
