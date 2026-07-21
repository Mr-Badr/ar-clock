"use client";

import { useMemo, useState } from 'react';
import { Info, Money, Percent, Warning } from '@phosphor-icons/react';

import { CalcInput as Input } from '@/components/calculators/controls.client';
import ResultActions from '@/components/calculators/ResultActions.client';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  calculateJordanIncomeTax,
  formatCurrency,
} from '@/lib/calculators/engine';

const BRACKET_COLORS = [
  'var(--green)',
  'var(--blue)',
  'var(--amber)',
  'color-mix(in srgb, var(--red) 70%, var(--amber))',
  'var(--red)',
  'color-mix(in srgb, var(--red) 80%, #000)',
];

function fmt(v) {
  return formatCurrency(v, 'JOD');
}

function fmtPct(v) {
  return `${v.toFixed(1)}%`;
}

export default function JordanIncomeTaxCalculator() {
  const [salary, setSalary] = useState('700');
  const [hasDependents, setHasDependents] = useState(true);
  const [includeSsc, setIncludeSsc] = useState(true);

  const result = useMemo(
    () => calculateJordanIncomeTax({ monthlySalary: salary, hasDependents, includeSsc }),
    [salary, hasDependents, includeSsc],
  );

  const shareText = result.isValid
    ? `حاسبة ضريبة الدخل الأردن\nالراتب الإجمالي: ${fmt(result.salary)}\nالضريبة الشهرية: ${fmt(result.monthlyTax)}\nصافي الراتب: ${fmt(result.netMonthly)}\nالمعدل الفعلي: ${fmtPct(result.effectiveTaxRate)}`
    : '';

  return (
    <div className="calc-app eg-tax-tool" aria-label="حاسبة ضريبة الدخل الأردن">
      <div className="calc-esb-layout">

        {/* ── FORM ─────────────────────────────────── */}
        <div className="calc-esb-form-col">
          <Card className="calc-surface-card calc-esb-form-card">
            <CardContent className="calc-esb-form-body">

              {/* Salary input */}
              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">1</span>
                  <Label htmlFor="jo-tax-salary">الراتب الشهري الإجمالي</Label>
                </div>
                <div className="calc-esb-money-row">
                  <Input
                    id="jo-tax-salary"
                    inputMode="decimal"
                    value={salary}
                    onChange={(e) => setSalary(e.target.value)}
                    placeholder="700"
                  />
                  <span className="calc-esb-currency">د.أ</span>
                </div>
                <p className="calc-hint">أدخل راتبك الإجمالي (الأساسي + البدلات) قبل أي خصم.</p>
              </div>

              {/* Dependents toggle */}
              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">2</span>
                  <Label htmlFor="jo-tax-dependents">إعفاء المعالين (زوج/أبناء)</Label>
                </div>
                <div className="eg-tax-toggle-row">
                  <Switch
                    id="jo-tax-dependents"
                    checked={hasDependents}
                    onCheckedChange={setHasDependents}
                  />
                  <span className="calc-hint" style={{ margin: 0 }}>
                    {hasDependents ? 'مفعّل — إعفاء إضافي 9,000 د.أ سنوياً' : 'غير مفعّل — إعفاء شخصي فقط'}
                  </span>
                </div>
              </div>

              {/* SSC toggle */}
              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">3</span>
                  <Label htmlFor="jo-tax-ssc">الضمان الاجتماعي (7.5%)</Label>
                </div>
                <div className="eg-tax-toggle-row">
                  <Switch
                    id="jo-tax-ssc"
                    checked={includeSsc}
                    onCheckedChange={setIncludeSsc}
                  />
                  <span className="calc-hint" style={{ margin: 0 }}>
                    {includeSsc ? 'مفعّل — يُخصم من صافي الراتب' : 'غير مفعّل — الحساب لضريبة الدخل فقط'}
                  </span>
                </div>
                {includeSsc && result.isValid && (
                  <p className="calc-hint">خصم {fmt(result.sscMonthly)}/شهر — حصة الموظف في القطاع الخاص</p>
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
                <span>إعفاءات: <strong>{fmt(result.totalExemptions)}</strong></span>
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
                <span className="calc-esb-country-badge calc-esb-country-badge--jo">🇯🇴 الأردن</span>
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
                {result.sscMonthly > 0 && (
                  <div className="calc-esb-brow eg-tax-deduct">
                    <span>ضمان اجتماعي (7.5%)</span>
                    <strong>− {fmt(result.sscMonthly)}</strong>
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
                  <p className="eg-tax-brackets-title">توزيع الدخل السنوي الخاضع للضريبة على الشرائح</p>
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
                        <span className="eg-tax-brow-tax">← {fmt(b.taxAmount)} ضريبة</span>
                      </div>
                    ))}
                  </div>
                  {result.surcharge > 0 && (
                    <p className="calc-hint" style={{ marginTop: 'var(--space-2)' }}>
                      + {fmt(result.surcharge)} مساهمة وطنية (1% على ما يتجاوز 200,000 د.أ سنوياً)
                    </p>
                  )}
                </div>
              )}

              <ResultActions
                copyText={shareText}
                shareTitle="حاسبة ضريبة الدخل الأردن"
                shareText={shareText}
              />

              <div className="calc-esb-reason-strip">
                <Warning size={14} weight="fill" />
                <span>نتيجة تقديرية — الإعفاءات الإضافية (طبي/تعليم/سكن) قد ترفع إعفاءك حتى سقف 23,000 د.أ، تحقق مع دائرة ضريبة الدخل والمبيعات.</span>
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
