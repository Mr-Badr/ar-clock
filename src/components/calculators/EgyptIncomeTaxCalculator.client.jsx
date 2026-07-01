"use client";

import { useMemo, useState } from 'react';
import { Info, Money, Percent, Warning } from '@phosphor-icons/react';

import { CalcInput as Input } from '@/components/calculators/controls.client';
import ResultActions from '@/components/calculators/ResultActions.client';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  calculateEgyptIncomeTax,
  formatCurrency,
} from '@/lib/calculators/engine';

const BRACKET_COLORS = [
  'var(--green)',
  'var(--blue)',
  'var(--amber)',
  'color-mix(in srgb, var(--red) 70%, var(--amber))',
  'var(--red)',
  'color-mix(in srgb, var(--red) 80%, #000)',
  'color-mix(in srgb, var(--red) 60%, #000)',
];

function fmt(v) {
  return formatCurrency(v, 'EGP');
}

function fmtPct(v) {
  return `${v.toFixed(1)}%`;
}

export default function EgyptIncomeTaxCalculator() {
  const [salary, setSalary]             = useState('10000');
  const [includeInsurance, setInsurance] = useState(true);

  const result = useMemo(
    () => calculateEgyptIncomeTax({ monthlySalary: salary, includeInsurance }),
    [salary, includeInsurance],
  );

  const shareText = result.isValid
    ? `حاسبة ضريبة الدخل مصر\nالراتب الإجمالي: ${fmt(result.salary)}\nالضريبة الشهرية: ${fmt(result.monthlyTax)}\nالتأمينات: ${fmt(result.siMonthly)}\nصافي الراتب: ${fmt(result.netMonthly)}\nالمعدل الفعلي: ${fmtPct(result.effectiveTaxRate)}`
    : '';

  return (
    <div className="calc-app eg-tax-tool" aria-label="حاسبة ضريبة الدخل مصر">
      <div className="calc-esb-layout">

        {/* ── FORM ─────────────────────────────────── */}
        <div className="calc-esb-form-col">
          <Card className="calc-surface-card calc-esb-form-card">
            <CardContent className="calc-esb-form-body">

              {/* Salary input */}
              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">1</span>
                  <Label htmlFor="eg-tax-salary">الراتب الشهري الإجمالي</Label>
                </div>
                <div className="calc-esb-money-row">
                  <Input
                    id="eg-tax-salary"
                    inputMode="decimal"
                    value={salary}
                    onChange={(e) => setSalary(e.target.value)}
                    placeholder="10000"
                  />
                  <span className="calc-esb-currency">ج.م</span>
                </div>
                <p className="calc-hint">أدخل راتبك الإجمالي (الأساسي + البدلات).</p>
              </div>

              {/* Social insurance toggle */}
              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">2</span>
                  <Label htmlFor="eg-tax-insurance">التأمينات الاجتماعية (11%)</Label>
                </div>
                <div className="eg-tax-toggle-row">
                  <Switch
                    id="eg-tax-insurance"
                    checked={includeInsurance}
                    onCheckedChange={setInsurance}
                  />
                  <span className="calc-hint" style={{ margin: 0 }}>
                    {includeInsurance ? 'مفعّل — تُخصم وتُخفِّض الوعاء الضريبي' : 'غير مفعّل — الضريبة على الراتب كاملاً'}
                  </span>
                </div>
                {includeInsurance && result.isValid && (
                  <p className="calc-hint">
                    خصم {fmt(result.siMonthly)}/شهر · حد أقصى للوعاء: 10,400 ج.م
                  </p>
                )}
              </div>

            </CardContent>
          </Card>

          {/* Quick facts */}
          {result.isValid && (
            <div className="calc-esb-sidebar-facts">
              <div className="calc-esb-fact">
                <Money size={15} weight="bold" />
                <span>سنوي إجمالي: <strong>{fmt(result.annualGross)}</strong></span>
              </div>
              <div className="calc-esb-fact">
                <Percent size={15} weight="bold" />
                <span>وعاء ضريبي: <strong>{fmt(result.annualTaxable)}</strong></span>
              </div>
              <div className="calc-esb-fact">
                <Info size={15} weight="bold" />
                <span>معدل فعلي: <strong>{fmtPct(result.effectiveTaxRate)}</strong></span>
              </div>
            </div>
          )}
        </div>

        {/* ── RESULT ───────────────────────────────── */}
        <div className="calc-esb-result-col">
          {result.isValid ? (
            <div className="calc-esb-result-panel eg-tax-result" aria-live="polite">

              {/* Country badge */}
              <div className="calc-esb-result-header">
                <span className="calc-esb-country-badge calc-esb-country-badge--eg">🇪🇬 مصر</span>
                <span className="calc-esb-live-dot" aria-hidden="true" />
              </div>

              {/* Net salary hero */}
              <div className="calc-esb-amount-hero">
                <span className="calc-esb-amount-label">صافي الراتب الشهري</span>
                <div className="calc-esb-amount-value">{fmt(result.netMonthly)}</div>
                <div className="calc-esb-amount-meta">
                  <span>معدل فعلي {fmtPct(result.effectiveTaxRate)}</span>
                  <span className="calc-esb-sep">·</span>
                  <span>ضريبة شهرية {fmt(result.monthlyTax)}</span>
                </div>
              </div>

              {/* Deductions breakdown */}
              <div className="calc-esb-breakdown">
                <div className="calc-esb-brow">
                  <span>الراتب الإجمالي</span>
                  <strong>{fmt(result.salary)}</strong>
                </div>
                {result.siMonthly > 0 && (
                  <div className="calc-esb-brow eg-tax-deduct">
                    <span>تأمينات اجتماعية (11%)</span>
                    <strong>− {fmt(result.siMonthly)}</strong>
                  </div>
                )}
                <div className="calc-esb-brow eg-tax-deduct">
                  <span>ضريبة دخل شهرية</span>
                  <strong>− {fmt(result.monthlyTax)}</strong>
                </div>
                <div className="calc-esb-brow calc-esb-brow--total">
                  <span>صافي الراتب</span>
                  <strong>{fmt(result.netMonthly)}</strong>
                </div>
              </div>

              {/* Bracket bar */}
              {result.bracketBreakdown.length > 0 && (
                <div className="eg-tax-brackets">
                  <p className="eg-tax-brackets-title">توزيع الدخل السنوي على الشرائح</p>
                  <div className="eg-tax-bar">
                    {result.bracketBreakdown.map((b, i) => (
                      b.pct > 0 && (
                        <div
                          key={i}
                          className="eg-tax-bar-seg"
                          style={{ width: `${b.pct}%`, background: BRACKET_COLORS[i] }}
                          title={`${b.label}: ${fmt(b.taxableAmount)}`}
                        />
                      )
                    ))}
                  </div>
                  <div className="eg-tax-bracket-rows">
                    {result.bracketBreakdown.map((b, i) => (
                      <div key={i} className="eg-tax-brow">
                        <span className="eg-tax-brow-dot" style={{ background: BRACKET_COLORS[i] }} />
                        <span className="eg-tax-brow-label">{b.label}</span>
                        <span className="eg-tax-brow-amount">{fmt(b.taxableAmount)}</span>
                        <span className="eg-tax-brow-tax">
                          {b.rate === 0 ? 'معفى' : `← ${fmt(b.taxAmount)} ضريبة`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <ResultActions
                copyText={shareText}
                shareTitle="حاسبة ضريبة الدخل مصر"
                shareText={shareText}
              />

              <div className="calc-esb-reason-strip">
                <Warning size={14} weight="fill" />
                <span>نتيجة تقديرية — تحقق مع جهة عملك أو مستشارك الضريبي.</span>
              </div>

            </div>
          ) : (
            <div className="calc-esb-empty-state">
              <Warning size={28} weight="duotone" />
              <p>أدخل راتباً شهرياً صحيحاً لحساب الضريبة وصافي الراتب.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
