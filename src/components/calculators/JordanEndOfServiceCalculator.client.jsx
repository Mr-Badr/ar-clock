"use client";

import { useMemo, useState } from 'react';
import { Briefcase, Warning } from '@phosphor-icons/react';

import {
  CalcInput as Input,
  CalcSelectTrigger as SelectTrigger,
} from '@/components/calculators/controls.client';
import ResultActions from '@/components/calculators/ResultActions.client';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import {
  calculateJordanEndOfServiceBenefit,
  formatCurrency,
  formatDateArabic,
} from '@/lib/calculators/engine';

const TERMINATION_OPTIONS = [
  { value: 'contract_end',         label: 'انتهاء العقد أو عدم تجديده', hint: 'استحقاق كامل 100%.' },
  { value: 'employer_termination', label: 'إنهاء من صاحب العمل',        hint: 'استحقاق كامل 100%.' },
  { value: 'resignation',          label: 'استقالة',                    hint: '0% (أقل من سنة) · 33.3% (1–3 سنوات) · 100% (3 سنوات فأكثر).' },
];

const today      = new Date().toISOString().slice(0, 10);
const fiveYrsAgo = (() => { const d = new Date(); d.setFullYear(d.getFullYear() - 5); return d.toISOString().slice(0, 10); })();

export default function JordanEndOfServiceCalculator() {
  const [salary,    setSalary]    = useState('500');
  const [startDate, setStartDate] = useState(fiveYrsAgo);
  const [endDate,   setEndDate]   = useState(today);
  const [reason,    setReason]    = useState('contract_end');

  const fmt = (v) => formatCurrency(v, 'JOD');

  const result = useMemo(
    () => calculateJordanEndOfServiceBenefit({ basicSalary: salary, startDate, endDate, reason }),
    [salary, startDate, endDate, reason],
  );

  const selectedOpt = TERMINATION_OPTIONS.find(o => o.value === reason);
  const isZero = reason === 'resignation' && result.isValid && result.entitlementPercent === 0;

  const shareText = result.isValid
    ? `مكافأة نهاية الخدمة (الأردن): ${fmt(result.gratuity)}\nمدة الخدمة: ${result.serviceLabel}\nنسبة الاستحقاق: ${result.entitlementPercent}%`
    : '';

  return (
    <div className="calc-app end-service-tool" aria-label="حاسبة مكافأة نهاية الخدمة الأردن">
      <div className="calc-esb-layout">

        {/* ── FORM ─────────────────────────────────── */}
        <div className="calc-esb-form-col">
          <Card className="calc-surface-card calc-esb-form-card">
            <CardContent className="calc-esb-form-body">

              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">1</span>
                  <Label htmlFor="jo-esb-salary">الراتب الأساسي الشهري</Label>
                </div>
                <div className="calc-esb-money-row">
                  <Input
                    id="jo-esb-salary"
                    inputMode="decimal"
                    value={salary}
                    onChange={(e) => setSalary(e.target.value)}
                    placeholder="500"
                  />
                  <span className="calc-esb-currency">د.أ</span>
                </div>
                <p className="calc-hint">الأساسي فقط — لا تُضف البدلات ما لم ينص عقدك على ذلك.</p>
              </div>

              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">2</span>
                  <Label>تواريخ الخدمة</Label>
                </div>
                <div className="calc-esb-date-row">
                  <div className="calc-esb-date-field">
                    <Label htmlFor="jo-esb-start" className="calc-esb-date-label">بداية العمل</Label>
                    <Input id="jo-esb-start" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                  </div>
                  <div className="calc-esb-date-field">
                    <Label htmlFor="jo-esb-end" className="calc-esb-date-label">نهاية العمل</Label>
                    <Input id="jo-esb-end" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                  </div>
                </div>
              </div>

              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">3</span>
                  <Label>سبب إنهاء العلاقة</Label>
                </div>
                <Select value={reason} onValueChange={setReason}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {TERMINATION_OPTIONS.map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedOpt?.hint && <p className="calc-hint">{selectedOpt.hint}</p>}
              </div>

            </CardContent>
          </Card>

          {result.isValid && (
            <div className="calc-esb-sidebar-facts">
              <div className="calc-esb-fact">
                <Briefcase size={15} weight="bold" />
                <span>{result.serviceLabel}</span>
              </div>
              <div className="calc-esb-fact">
                <Warning size={15} weight="bold" />
                <span>معدل يومي: <strong>{fmt(result.dailyRate)}</strong> (÷ 30)</span>
              </div>
            </div>
          )}
        </div>

        {/* ── RESULT ───────────────────────────────── */}
        <div className="calc-esb-result-col">
          {result.isValid ? (
            <div className="calc-esb-result-panel" aria-live="polite">

              <div className="calc-esb-result-header">
                <span className="calc-esb-country-badge calc-esb-country-badge--jo">🇯🇴 الأردن</span>
                <span className="calc-esb-live-dot" aria-hidden="true" />
              </div>

              {isZero ? (
                <div className="eg-zero-notice">
                  <Warning size={22} weight="fill" />
                  <div>
                    <strong>لا استحقاق عند الاستقالة قبل سنة كاملة</strong>
                    <span>وفق المادة 32 من قانون العمل الأردني، الاستقالة قبل إتمام سنة لا تُولِّد أي مكافأة.</span>
                  </div>
                </div>
              ) : (
                <>
                  <div className="calc-esb-amount-hero">
                    <span className="calc-esb-amount-label">المكافأة المقدرة</span>
                    <div className="calc-esb-amount-value">{fmt(result.gratuity)}</div>
                    <div className="calc-esb-amount-meta">
                      <span>{result.serviceLabel}</span>
                      <span className="calc-esb-sep">·</span>
                      <span>{result.entitlementPercent}% استحقاق</span>
                    </div>
                  </div>

                  {reason === 'resignation' && result.entitlementPercent < 100 && (
                    <div className="calc-esb-entitlement">
                      <div className="calc-esb-entitlement-bar">
                        <div className="calc-esb-entitlement-fill" style={{ width: `${result.entitlementPercent}%` }} />
                      </div>
                      <span className="calc-esb-entitlement-label">
                        {result.resignationBracket.label} ← {result.entitlementPercent}% من المكافأة الكاملة ({fmt(result.fullGratuity)})
                      </span>
                    </div>
                  )}

                  <div className="calc-esb-breakdown">
                    <div className="calc-esb-brow">
                      <span>
                        {result.service.decimalYears.toFixed(2)} سنة × 30 يوم × {fmt(result.dailyRate)}/يوم
                      </span>
                      <strong>{fmt(result.fullGratuity)}</strong>
                    </div>
                    {reason === 'resignation' && result.entitlementPercent < 100 && (
                      <div className="calc-esb-brow eg-discount-row">
                        <span>بعد تطبيق نسبة الاستقالة ({result.entitlementPercent}%)</span>
                        <strong>{fmt(result.gratuity)}</strong>
                      </div>
                    )}
                    <div className="calc-esb-brow calc-esb-brow--total">
                      <span>المكافأة المستحقة</span>
                      <strong>{fmt(result.gratuity)}</strong>
                    </div>
                  </div>

                  <ResultActions
                    copyText={shareText}
                    shareTitle="حاسبة مكافأة نهاية الخدمة الأردن"
                    shareText={shareText}
                  />

                  <div className="calc-esb-reason-strip">
                    <Warning size={14} weight="fill" />
                    <span>هذه نتيجة تقديرية — راجع عقدك وجهة العمل قبل أي قرار.</span>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="calc-esb-empty-state">
              <Warning size={28} weight="duotone" />
              <p>أدخل راتباً صحيحاً وتأكد أن تاريخ نهاية الخدمة بعد تاريخ البداية.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
