"use client";

import { useMemo, useState } from 'react';
import { CurrencyDollar, Info } from '@phosphor-icons/react';

import ResultActions from '@/components/calculators/ResultActions.client';
import { Label } from '@/components/ui/label';
import { calculateNetSalary, formatSAR, GOSI_RATES, GOSI_WAGE_CEILING } from '@/lib/calculators/net-salary';

const NATIONALITY_OPTIONS = [
  { id: 'saudi', label: 'سعودي' },
  { id: 'nonSaudi', label: 'غير سعودي' },
];

const NUM_STYLE = { direction: 'ltr', textAlign: 'right', width: '100%' };

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
          <div
            className="calc-surface-card calc-esb-form-card"
            style={{
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-subtle)',
              background: 'var(--bg-surface-1)',
            }}
          >
            <div className="calc-esb-form-body">

              {/* Nationality */}
              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">1</span>
                  <Label>الجنسية</Label>
                </div>
                <div className="calc-kbd-row" style={{ gap: '0.5rem' }}>
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
                  <input
                    id="ns-basic"
                    type="number"
                    inputMode="decimal"
                    className="calc-input"
                    value={basicSalary}
                    onChange={(e) => setBasicSalary(e.target.value)}
                    placeholder="8000"
                    style={NUM_STYLE}
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
                  <input
                    id="ns-housing"
                    type="number"
                    inputMode="decimal"
                    className="calc-input"
                    value={housingAllowance}
                    onChange={(e) => setHousingAllowance(e.target.value)}
                    placeholder="0"
                    style={NUM_STYLE}
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
                  <input
                    id="ns-other"
                    type="number"
                    inputMode="decimal"
                    className="calc-input"
                    value={otherAllowances}
                    onChange={(e) => setOtherAllowances(e.target.value)}
                    placeholder="0"
                    style={NUM_STYLE}
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
            <div className="pregnancy-empty-state" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
              <CurrencyDollar size={48} weight="duotone" color="var(--color-accent)" style={{ marginBottom: '0.75rem' }} />
              <p>أدخل الراتب الأساسي لحساب صافي الراتب</p>
            </div>
          )}

          {result?.isValid && (
            <>
              {/* Net salary highlight */}
              <div
                className="calc-surface-card"
                style={{
                  borderRadius: 'var(--radius-lg)',
                  border: '2px solid var(--green)',
                  background: 'var(--green-subtle)',
                  padding: '1.5rem',
                  textAlign: 'center',
                  marginBottom: '1rem',
                }}
              >
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                  صافي الراتب بعد خصم GOSI
                </div>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--green)', lineHeight: 1 }}>
                  {formatSAR(result.netSalary)}
                  <span style={{ fontSize: '1.1rem', fontWeight: 500, marginRight: '0.4rem' }}>ريال</span>
                </div>
              </div>

              {/* Breakdown */}
              <div style={{ display: 'grid', gap: '0.5rem', marginBottom: '1rem' }}>
                <div className="calc-result-chip" style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span className="chip-label">الراتب الإجمالي</span>
                  <span className="chip-value">{formatSAR(result.grossSalary)} ريال</span>
                </div>
                <div className="calc-result-chip" style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span className="chip-label">وعاء GOSI (أساسي + سكن)</span>
                  <span className="chip-value">{formatSAR(result.gosiBase)} ريال{result.isCapped ? ' (محدود)' : ''}</span>
                </div>
                <div className="calc-result-chip" style={{ display: 'flex', justifyContent: 'space-between', borderColor: 'var(--destructive)', background: 'var(--destructive-subtle)' }}>
                  <span className="chip-label" style={{ color: 'var(--destructive)' }}>
                    خصم GOSI ({(result.gosiRate.employee * 100).toFixed(0)}%)
                  </span>
                  <span className="chip-value" style={{ color: 'var(--destructive)' }}>
                    − {formatSAR(result.gosiEmployee)} ريال
                  </span>
                </div>
                <div className="calc-result-chip" style={{ display: 'flex', justifyContent: 'space-between', borderColor: 'var(--blue)', background: 'var(--blue-subtle)' }}>
                  <span className="chip-label" style={{ color: 'var(--blue)' }}>
                    حصة صاحب العمل في GOSI ({(result.gosiRate.employer * 100).toFixed(1)}%)
                  </span>
                  <span className="chip-value" style={{ color: 'var(--blue)' }}>
                    {formatSAR(result.gosiEmployer)} ريال
                  </span>
                </div>
              </div>

              {result.isCapped && (
                <div style={{ display: 'flex', gap: '0.5rem', padding: '0.75rem', background: 'var(--bg-surface-2)', borderRadius: 'var(--radius-md)', marginBottom: '0.75rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  <Info size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>الراتب يتجاوز السقف الأعلى لـ GOSI ({formatSAR(GOSI_WAGE_CEILING)} ريال) — احتُسب الخصم على الحد الأقصى فقط.</span>
                </div>
              )}

              {nationality === 'nonSaudi' && (
                <div style={{ display: 'flex', gap: '0.5rem', padding: '0.75rem', background: 'var(--bg-surface-2)', borderRadius: 'var(--radius-md)', marginBottom: '0.75rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  <Info size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>الموظفون غير السعوديين لا يُخصم منهم GOSI — الصافي يساوي الإجمالي. يدفع صاحب العمل 2% للتأمين ضد إصابات العمل.</span>
                </div>
              )}

              <ResultActions shareText={shareText} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
