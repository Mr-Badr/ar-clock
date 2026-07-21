"use client";

import { useMemo, useState } from 'react';
import { CurrencyDollar, Info } from '@phosphor-icons/react';

import { CalcInput } from '@/components/calculators/controls.client';
import ResultActions from '@/components/calculators/ResultActions.client';
import { Label } from '@/components/ui/label';
import { calculateNetSalary, formatSAR, GOSI_RATES, GOSI_WAGE_CEILING } from '@/lib/calculators/net-salary';
import CountryFlag from '@/components/shared/CountryFlag';

const NATIONALITY_OPTIONS = [
  { id: 'saudi', label: 'سعودي' },
  { id: 'nonSaudi', label: 'غير سعودي' },
];

export default function NetSalaryCalculator() {
  const [basicSalary, setBasicSalary] = useState('8000');
  const [housingAllowance, setHousingAllowance] = useState('2000');
  const [otherAllowances, setOtherAllowances] = useState('');
  const [nationality, setNationality] = useState('saudi');

  const result = useMemo(
    () => calculateNetSalary({ basicSalary, housingAllowance, otherAllowances, nationality }),
    [basicSalary, housingAllowance, otherAllowances, nationality],
  );

  const shareText = result?.isValid
    ? [
        `الراتب الإجمالي: ${formatSAR(result.grossSalary)} ريال`,
        `خصم GOSI: ${formatSAR(result.gosiEmployee)} ريال (${(result.gosiRate.employee * 100).toFixed(0)}%)`,
        `صافي الراتب: ${formatSAR(result.netSalary)} ريال`,
      ].join('\n')
    : '';

  return (
    <div className="calc-app net-salary-tool" aria-label="حاسبة صافي الراتب بعد GOSI">
      <div className="calc-esb-layout">

        {/* ── FORM ─────────────────────────────────── */}
        <div className="calc-esb-form-col">
          <div className="calc-surface-card calc-esb-form-card">
            <div className="calc-esb-form-body">

              {/* Nationality */}
              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">1</span>
                  <Label>الجنسية</Label>
                </div>
                <div className="calc-kbd-row gap-2">
                  {NATIONALITY_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      className={`chip calc-chip-button${nationality === opt.id ? ' is-active' : ''}`}
                      onClick={() => setNationality(opt.id)}
                      aria-pressed={nationality === opt.id}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
                <p className="calc-hint">{GOSI_RATES[nationality]?.note}</p>
              </div>

              {/* Basic salary */}
              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">2</span>
                  <Label htmlFor="ns-basic">الراتب الأساسي (ريال)</Label>
                </div>
                <div className="calc-esb-money-row">
                  <CalcInput
                    id="ns-basic"
                    type="number"
                    inputMode="decimal"
                    value={basicSalary}
                    onChange={(e) => setBasicSalary(e.target.value)}
                    placeholder="8000"
                    dir="ltr"
                  />
                  <span className="calc-esb-currency">ريال</span>
                </div>
              </div>

              {/* Housing allowance */}
              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">3</span>
                  <Label htmlFor="ns-housing">بدل السكن (ريال)</Label>
                </div>
                <div className="calc-esb-money-row">
                  <CalcInput
                    id="ns-housing"
                    type="number"
                    inputMode="decimal"
                    value={housingAllowance}
                    onChange={(e) => setHousingAllowance(e.target.value)}
                    placeholder="0"
                    dir="ltr"
                  />
                  <span className="calc-esb-currency">ريال</span>
                </div>
                <p className="calc-hint">بدل السكن يدخل في وعاء GOSI (مثل الراتب الأساسي)</p>
              </div>

              {/* Other allowances */}
              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">4</span>
                  <Label htmlFor="ns-other">بدلات أخرى (ريال) — اختياري</Label>
                </div>
                <div className="calc-esb-money-row">
                  <CalcInput
                    id="ns-other"
                    type="number"
                    inputMode="decimal"
                    value={otherAllowances}
                    onChange={(e) => setOtherAllowances(e.target.value)}
                    placeholder="0"
                    dir="ltr"
                  />
                  <span className="calc-esb-currency">ريال</span>
                </div>
                <p className="calc-hint">بدل النقل، الاتصالات، وغيرها — لا تخضع لخصم GOSI</p>
              </div>

            </div>
          </div>
        </div>

        {/* ── RESULTS ─────────────────────────────── */}
        <div className="calc-esb-result-col">
          {!result && (
            <div className="calc-esb-empty-state">
              <CurrencyDollar size={28} weight="duotone" />
              <p>أدخل الراتب الأساسي لحساب صافي الراتب</p>
            </div>
          )}

          {result?.isValid && (
            <div className="calc-esb-result-panel net-salary-result" aria-live="polite">
              <div className="calc-esb-result-header">
                <span className="calc-esb-country-badge calc-esb-country-badge--sa"><CountryFlag code="sa" /> السعودية · GOSI</span>
                <span className="calc-esb-live-dot" aria-hidden="true" />
              </div>

              <div className="calc-esb-amount-hero">
                <span className="calc-esb-amount-label">صافي الراتب بعد خصم GOSI</span>
                <div className="calc-esb-amount-value">{formatSAR(result.netSalary)}</div>
                <div className="calc-esb-amount-meta">ريال سعودي</div>
              </div>

              <div className="calc-esb-breakdown">
                <div className="calc-esb-brow">
                  <span>الراتب الإجمالي</span>
                  <strong>{formatSAR(result.grossSalary)} ريال</strong>
                </div>
                <div className="calc-esb-brow">
                  <span>وعاء GOSI (أساسي + سكن)</span>
                  <strong>{formatSAR(result.gosiBase)} ريال{result.isCapped ? ' (محدود)' : ''}</strong>
                </div>
                <div className="calc-esb-brow calc-esb-brow--neg">
                  <span>خصم GOSI ({(result.gosiRate.employee * 100).toFixed(0)}%)</span>
                  <strong>− {formatSAR(result.gosiEmployee)} ريال</strong>
                </div>
                <div className="calc-esb-brow calc-esb-brow--total">
                  <span>حصة صاحب العمل في GOSI ({(result.gosiRate.employer * 100).toFixed(1)}%)</span>
                  <strong>{formatSAR(result.gosiEmployer)} ريال</strong>
                </div>
              </div>

              {result.isCapped && (
                <div className="calc-notice">
                  <Info size={16} className="calc-notice__icon" />
                  <span>الراتب يتجاوز السقف الأعلى لـ GOSI ({formatSAR(GOSI_WAGE_CEILING)} ريال) — احتُسب الخصم على الحد الأقصى فقط.</span>
                </div>
              )}

              {nationality === 'nonSaudi' && (
                <div className="calc-notice">
                  <Info size={16} className="calc-notice__icon" />
                  <span>الموظفون غير السعوديين لا يُخصم منهم GOSI — الصافي يساوي الإجمالي. يدفع صاحب العمل 2% للتأمين ضد إصابات العمل.</span>
                </div>
              )}

              <ResultActions shareText={shareText} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
