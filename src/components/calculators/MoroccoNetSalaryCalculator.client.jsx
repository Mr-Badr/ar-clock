"use client";

import { useMemo, useState } from 'react';
import { Info, Percent, Warning } from '@phosphor-icons/react';

import { CalcInput as Input } from '@/components/calculators/controls.client';
import ResultActions from '@/components/calculators/ResultActions.client';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { calculateMoroccoNetSalary, formatCurrency } from '@/lib/calculators/engine';

const BRACKET_COLORS = [
  'var(--green)',
  'var(--blue)',
  'var(--amber)',
  'color-mix(in srgb, var(--red) 60%, var(--amber))',
  'var(--red)',
  'color-mix(in srgb, var(--red) 80%, #000)',
];

function fmt(v) {
  return formatCurrency(v, 'MAD');
}

function fmtPct(v) {
  return `${v.toFixed(1)}%`;
}

export default function MoroccoNetSalaryCalculator() {
  const [salary, setSalary] = useState('10000');

  const result = useMemo(
    () => calculateMoroccoNetSalary({ monthlyGross: salary }),
    [salary],
  );

  const shareText = result.isValid
    ? `حاسبة الراتب الصافي المغرب\nالراتب الإجمالي: ${fmt(result.salary)}\nCNSS: ${fmt(result.cnssDeduction)}\nضريبة IR: ${fmt(result.monthlyIR)}\nصافي الراتب: ${fmt(result.netMonthly)}\nمعدل IR الفعلي: ${fmtPct(result.effectiveIRRate)}`
    : '';

  return (
    <div className="calc-app ma-sal-tool" aria-label="حاسبة الراتب الصافي المغرب">
      <div className="calc-esb-layout">

        {/* ── FORM ─────────────────────────────────── */}
        <div className="calc-esb-form-col">
          <Card className="calc-surface-card calc-esb-form-card">
            <CardContent className="calc-esb-form-body">

              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">1</span>
                  <Label htmlFor="ma-salary">الراتب الإجمالي الشهري</Label>
                </div>
                <div className="calc-esb-money-row">
                  <Input
                    id="ma-salary"
                    inputMode="decimal"
                    value={salary}
                    onChange={(e) => setSalary(e.target.value)}
                    placeholder="10000"
                  />
                  <span className="calc-esb-currency">د.م</span>
                </div>
                <p className="calc-hint">أدخل إجمالي راتبك الشهري (قبل الاقتطاعات).</p>
              </div>

            </CardContent>
          </Card>

          {result.isValid && (
            <div className="calc-esb-sidebar-facts">
              <div className="calc-esb-fact">
                <Info size={15} weight="bold" />
                <span>CNSS: <strong>{fmt(result.cnssDeduction)}/شهر</strong></span>
              </div>
              <div className="calc-esb-fact">
                <Percent size={15} weight="bold" />
                <span>معدل IR فعلي: <strong>{fmtPct(result.effectiveIRRate)}</strong></span>
              </div>
            </div>
          )}
        </div>

        {/* ── RESULT ───────────────────────────────── */}
        <div className="calc-esb-result-col">
          {result.isValid ? (
            <div className="calc-esb-result-panel ma-result" aria-live="polite">

              <div className="calc-esb-result-header">
                <span className="calc-esb-country-badge calc-esb-country-badge--ma">🇲🇦 المغرب</span>
                <span className="calc-esb-live-dot" aria-hidden="true" />
              </div>

              {/* Net salary hero */}
              <div className="calc-esb-amount-hero">
                <span className="calc-esb-amount-label">صافي الراتب الشهري</span>
                <div className="calc-esb-amount-value">{fmt(result.netMonthly)}</div>
                <div className="calc-esb-amount-meta">
                  <span>IR فعلي {fmtPct(result.effectiveIRRate)}</span>
                  <span className="calc-esb-sep">·</span>
                  <span>ضريبة شهرية {fmt(result.monthlyIR)}</span>
                </div>
              </div>

              {/* Breakdown */}
              <div className="calc-esb-breakdown">
                <div className="calc-esb-brow">
                  <span>الراتب الإجمالي</span>
                  <strong>{fmt(result.salary)}</strong>
                </div>
                <div className="calc-esb-brow eg-tax-deduct">
                  <span>CNSS ({result.cnssRatePct}%)</span>
                  <strong>− {fmt(result.cnssDeduction)}</strong>
                </div>
                <div className="calc-esb-brow eg-tax-deduct">
                  <span>ضريبة IR شهرية</span>
                  <strong>− {fmt(result.monthlyIR)}</strong>
                </div>
                <div className="calc-esb-brow calc-esb-brow--total">
                  <span>صافي الراتب</span>
                  <strong>{fmt(result.netMonthly)}</strong>
                </div>
              </div>

              {/* IR bracket bar */}
              {result.bracketDetail.length > 0 && (
                <div className="eg-tax-brackets">
                  <p className="eg-tax-brackets-title">توزيع الدخل السنوي على شرائح IR</p>
                  <div className="eg-tax-bar">
                    {result.bracketDetail.map((b, i) => (
                      b.pct > 0 && (
                        <div
                          key={i}
                          className="eg-tax-bar-seg"
                          style={{ width: `${b.pct}%`, background: BRACKET_COLORS[i] }}
                          title={`${b.label}: ${fmt(b.amount)}`}
                        />
                      )
                    ))}
                  </div>
                  <div className="eg-tax-bracket-rows">
                    {result.bracketDetail.map((b, i) => (
                      <div key={i} className="eg-tax-brow">
                        <span className="eg-tax-brow-dot" style={{ background: BRACKET_COLORS[i] }} />
                        <span className="eg-tax-brow-label">{b.label}</span>
                        <span className="eg-tax-brow-amount">{fmt(b.amount)}</span>
                        <span className="eg-tax-brow-tax">
                          {b.rate === 0 ? 'إعفاء' : `← ${fmt(b.tax)}`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <ResultActions
                copyText={shareText}
                shareTitle="حاسبة الراتب الصافي المغرب"
                shareText={shareText}
              />

              <div className="calc-esb-reason-strip">
                <Warning size={14} weight="fill" />
                <span>نتيجة تقديرية — تحقق مع مسؤول الأجور في شركتك للرقم الدقيق.</span>
              </div>

            </div>
          ) : (
            <div className="calc-esb-empty-state">
              <Percent size={28} weight="duotone" />
              <p>أدخل الراتب الإجمالي الشهري لحساب صافي الراتب بعد CNSS وIR.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
