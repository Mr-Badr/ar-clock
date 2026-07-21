"use client";

import { useMemo, useState } from 'react';
import { Buildings, Info, Warning } from '@phosphor-icons/react';

import { CalcInput as Input } from '@/components/calculators/controls.client';
import ResultActions from '@/components/calculators/ResultActions.client';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import CountryFlag from '@/components/shared/CountryFlag';
import {
  calculateUaeCorporateTax,
  UAE_CT_THRESHOLD_VALUE,
  UAE_CT_RATE_VALUE,
  UAE_SBR_MAX_REVENUE_VALUE,
  formatCurrency,
} from '@/lib/calculators/engine';

function fmt(v) {
  return formatCurrency(v, 'AED');
}

function fmtPct(v) {
  return `${v.toFixed(2)}%`;
}

export default function UaeCorporateTaxCalculator() {
  const [profit,  setProfit]  = useState('500000');
  const [revenue, setRevenue] = useState('');

  const result = useMemo(
    () => calculateUaeCorporateTax({ annualProfit: profit, annualRevenue: revenue }),
    [profit, revenue],
  );

  const shareText = result?.isValid
    ? `حاسبة ضريبة الشركات الإمارات\nالأرباح السنوية: ${fmt(result.profit)}\nالضريبة المستحقة (9%): ${fmt(result.taxDue)}\nصافي الربح بعد الضريبة: ${fmt(result.netAfterTax)}\nالمعدل الفعلي: ${fmtPct(result.effectiveRate)}`
    : '';

  return (
    <div className="calc-app uae-ct-tool" aria-label="حاسبة ضريبة الشركات الإمارات">
      <div className="calc-esb-layout">

        {/* ── FORM ─────────────────────────────────── */}
        <div className="calc-esb-form-col">
          <Card className="calc-surface-card calc-esb-form-card">
            <CardContent className="calc-esb-form-body">

              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">1</span>
                  <Label htmlFor="uae-ct-profit">الأرباح السنوية الخاضعة للضريبة</Label>
                </div>
                <div className="calc-esb-money-row">
                  <Input
                    id="uae-ct-profit"
                    inputMode="decimal"
                    value={profit}
                    onChange={(e) => setProfit(e.target.value)}
                    placeholder="500000"
                  />
                  <span className="calc-esb-currency">درهم</span>
                </div>
                <p className="calc-hint">
                  أدخل صافي الربح السنوي قبل الضريبة (الوعاء الضريبي).
                </p>
              </div>

              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">2</span>
                  <Label htmlFor="uae-ct-revenue">إجمالي الإيراد السنوي (اختياري)</Label>
                </div>
                <div className="calc-esb-money-row">
                  <Input
                    id="uae-ct-revenue"
                    inputMode="decimal"
                    value={revenue}
                    onChange={(e) => setRevenue(e.target.value)}
                    placeholder="1000000"
                  />
                  <span className="calc-esb-currency">درهم</span>
                </div>
                <p className="calc-hint">
                  أضفه لمعرفة أهليتك لتخفيف الأعمال الصغيرة (≤ {(UAE_SBR_MAX_REVENUE_VALUE / 1000000).toFixed(0)} مليون درهم).
                </p>
              </div>

            </CardContent>
          </Card>

          {result?.isValid && (
            <div className="calc-esb-sidebar-facts">
              <div className="calc-esb-fact">
                <Info size={15} weight="bold" />
                <span>حد الإعفاء: <strong>{fmt(UAE_CT_THRESHOLD_VALUE)}</strong></span>
              </div>
              <div className="calc-esb-fact">
                <Info size={15} weight="bold" />
                <span>معدل الضريبة: <strong>{(UAE_CT_RATE_VALUE * 100).toFixed(0)}%</strong> على الزائد</span>
              </div>
              {result.eligibleForSBR && (
                <div className="calc-esb-fact">
                  <Info size={15} weight="fill" style={{ color: 'var(--green)' }} />
                  <span style={{ color: 'var(--green-text)' }}>مؤهل لتخفيف الأعمال الصغيرة</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── RESULT ───────────────────────────────── */}
        <div className="calc-esb-result-col">
          {result?.isValid ? (
            <div className="calc-esb-result-panel" aria-live="polite">

              <div className="calc-esb-result-header">
                <span className="calc-esb-country-badge calc-esb-country-badge--ae"><CountryFlag code="ae" /> الإمارات</span>
                <span className="calc-esb-live-dot" aria-hidden="true" />
              </div>

              {result.eligibleForSBR ? (
                <div className="calc-esb-amount-hero">
                  <span className="calc-esb-amount-label">الضريبة المستحقة</span>
                  <div className="calc-esb-amount-value" style={{ color: 'var(--green-text)' }}>
                    {fmt(0)}
                  </div>
                  <div className="calc-esb-amount-meta">
                    <span>تخفيف الأعمال الصغيرة — معدل فعلي 0%</span>
                  </div>
                </div>
              ) : (
                <div className="calc-esb-amount-hero">
                  <span className="calc-esb-amount-label">صافي الربح بعد الضريبة</span>
                  <div className="calc-esb-amount-value">{fmt(result.netAfterTax)}</div>
                  <div className="calc-esb-amount-meta">
                    <span>معدل فعلي {fmtPct(result.effectiveRate)}</span>
                    <span className="calc-esb-sep">·</span>
                    <span>ضريبة {fmt(result.taxDue)}</span>
                  </div>
                </div>
              )}

              <div className="calc-esb-breakdown">
                <div className="calc-esb-brow">
                  <span>الأرباح الخاضعة للضريبة</span>
                  <strong>{fmt(result.profit)}</strong>
                </div>
                <div className="calc-esb-brow">
                  <span>شريحة الإعفاء (0%)</span>
                  <strong>{fmt(result.exemptBand)}</strong>
                </div>
                <div className="calc-esb-brow eg-tax-deduct">
                  <span>الخاضع للضريبة (9%)</span>
                  <strong>{fmt(result.taxableAbove)}</strong>
                </div>
                <div className="calc-esb-brow eg-tax-deduct">
                  <span>الضريبة المستحقة</span>
                  <strong>− {fmt(result.eligibleForSBR ? 0 : result.taxDue)}</strong>
                </div>
                <div className="calc-esb-brow calc-esb-brow--total">
                  <span>صافي الربح</span>
                  <strong>{fmt(result.eligibleForSBR ? result.profit : result.netAfterTax)}</strong>
                </div>
              </div>

              {result.eligibleForSBR && (
                <div className="eg-si-tax-note" style={{ borderColor: 'var(--green-border)', background: 'var(--green-subtle)' }}>
                  <Info size={14} weight="fill" style={{ color: 'var(--green)' }} />
                  <span style={{ color: 'var(--green-text)' }}>
                    إيراداتك ≤ {fmt(UAE_SBR_MAX_REVENUE_VALUE)} — مؤهل لتخفيف الأعمال الصغيرة. الضريبة = صفر لهذه السنة.
                    يجب اختياره في الإقرار الضريبي.
                  </span>
                </div>
              )}

              <ResultActions
                copyText={shareText}
                shareTitle="حاسبة ضريبة الشركات الإمارات"
                shareText={shareText}
              />

              <div className="calc-esb-reason-strip">
                <Warning size={14} weight="fill" />
                <span>نتيجة تقديرية للتخطيط. استشر محاسباً مرخصاً لإعداد الإقرار الضريبي الرسمي.</span>
              </div>

            </div>
          ) : (
            <div className="calc-esb-empty-state">
              <Buildings size={28} weight="duotone" />
              <p>أدخل الأرباح السنوية لحساب ضريبة الشركات في الإمارات.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
