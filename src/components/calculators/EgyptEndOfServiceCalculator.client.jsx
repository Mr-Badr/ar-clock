"use client";

import { useMemo, useState } from 'react';
import {
  Briefcase,
  CalendarBlank,
  CaretDown,
  Info,
  TrendUp,
  Warning,
} from '@phosphor-icons/react';

import {
  CalcInput as Input,
  CalcSelectTrigger as SelectTrigger,
} from '@/components/calculators/controls.client';
import ResultActions from '@/components/calculators/ResultActions.client';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import CountryFlag from '@/components/shared/CountryFlag';
import {
  buildEgyptEndOfServiceComparison,
  buildEgyptEndOfServiceMilestones,
  calculateEgyptEndOfServiceBenefit,
  formatCurrency,
  formatDateArabic,
} from '@/lib/calculators/engine';

const TERMINATION_OPTIONS = [
  { value: 'contract_end',         label: 'انتهاء العقد أو عدم تجديده', hint: 'استحقاق كامل 100%.' },
  { value: 'employer_termination', label: 'إنهاء من صاحب العمل',        hint: 'استحقاق كامل 100%.' },
  { value: 'resignation',          label: 'استقالة',                    hint: '0% (أقل من 5 سنوات) · 50% (5–10 سنوات) · 100% (10+ سنوات).' },
];

const today = new Date().toISOString().slice(0, 10);
const fiveYearsAgo = (() => {
  const d = new Date();
  d.setFullYear(d.getFullYear() - 5);
  return d.toISOString().slice(0, 10);
})();

export default function EgyptEndOfServiceCalculator({ initialStartDate, initialEndDate }) {
  const [salary, setSalary]         = useState('5000');
  const [startDate, setStartDate]   = useState(initialStartDate ?? fiveYearsAgo);
  const [endDate, setEndDate]       = useState(initialEndDate ?? today);
  const [reason, setReason]         = useState('contract_end');
  const [waitMonths, setWaitMonths] = useState([6]);
  const [showExtras, setShowExtras] = useState(false);

  const fmt = (v) => formatCurrency(v, 'EGP');

  const result = useMemo(
    () => calculateEgyptEndOfServiceBenefit({ basicSalary: salary, startDate, endDate, reason }),
    [salary, startDate, endDate, reason],
  );
  const comparison = useMemo(
    () => buildEgyptEndOfServiceComparison({ salary, startDate, endDate, waitMonths: waitMonths[0], reason }),
    [salary, startDate, endDate, waitMonths, reason],
  );
  const milestones = useMemo(() => buildEgyptEndOfServiceMilestones(startDate), [startDate]);

  const selectedOpt = TERMINATION_OPTIONS.find((o) => o.value === reason);

  const shareText = result.isValid
    ? `مكافأة نهاية الخدمة (مصر): ${fmt(result.gratuity)}\nمدة الخدمة: ${result.serviceLabel}\nنسبة الاستحقاق: ${result.entitlementPercent}%`
    : '';

  const isZeroResignation = reason === 'resignation' && result.isValid && result.entitlementPercent === 0;

  return (
    <div className="calc-app end-service-tool" aria-label="حاسبة مكافأة نهاية الخدمة مصر">
      <div className="calc-esb-layout">

        {/* ── FORM ─────────────────────────────────── */}
        <div className="calc-esb-form-col">
          <Card className="calc-surface-card calc-esb-form-card">
            <CardContent className="calc-esb-form-body">

              {/* Basic salary */}
              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">1</span>
                  <Label htmlFor="eg-esb-salary">الراتب الأساسي الشهري</Label>
                </div>
                <div className="calc-esb-money-row">
                  <Input
                    id="eg-esb-salary"
                    inputMode="decimal"
                    value={salary}
                    onChange={(e) => setSalary(e.target.value)}
                    placeholder="5000"
                  />
                  <span className="calc-esb-currency">ج.م</span>
                </div>
                <p className="calc-hint">الأساسي فقط — لا تُضِف بدل السكن أو النقل.</p>
              </div>

              {/* Dates */}
              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">2</span>
                  <Label>تواريخ الخدمة</Label>
                </div>
                <div className="calc-esb-date-row">
                  <div className="calc-esb-date-field">
                    <Label htmlFor="eg-esb-start" className="calc-esb-date-label">بداية العمل</Label>
                    <Input id="eg-esb-start" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                  </div>
                  <div className="calc-esb-date-field">
                    <Label htmlFor="eg-esb-end" className="calc-esb-date-label">نهاية العمل</Label>
                    <Input id="eg-esb-end" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                  </div>
                </div>
              </div>

              {/* Reason */}
              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">3</span>
                  <Label>سبب إنهاء العلاقة</Label>
                </div>
                <Select value={reason} onValueChange={setReason}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TERMINATION_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedOpt?.hint && <p className="calc-hint">{selectedOpt.hint}</p>}
              </div>

            </CardContent>
          </Card>

          {/* Sidebar quick facts */}
          <div className="calc-esb-sidebar-facts">
            <div className="calc-esb-fact">
              <Briefcase size={15} weight="bold" />
              <span>{result.isValid ? result.serviceLabel : 'أدخل التواريخ'}</span>
            </div>
            {result.isValid && (
              <div className="calc-esb-fact">
                <Info size={15} weight="bold" />
                <span>معدل يومي: <strong>{fmt(result.dailyRate)}</strong> (÷ 30)</span>
              </div>
            )}
            {result.isValid && result.remainingYears > 0 && (
              <div className="calc-esb-fact">
                <TrendUp size={15} weight="bold" />
                <span>المعدل: <strong>45 يوم/سنة</strong> بعد 10 سنوات</span>
              </div>
            )}
          </div>
        </div>

        {/* ── RESULT ───────────────────────────────── */}
        <div className="calc-esb-result-col">
          {result.isValid ? (
            <div className="calc-esb-result-panel" aria-live="polite">

              {/* Country header */}
              <div className="calc-esb-result-header">
                <span className="calc-esb-country-badge calc-esb-country-badge--eg"><CountryFlag code="eg" /> مصر</span>
                <span className="calc-esb-live-dot" aria-hidden="true" />
              </div>

              {/* Zero resignation notice */}
              {isZeroResignation ? (
                <div className="eg-zero-notice">
                  <Warning size={22} weight="fill" />
                  <div>
                    <strong>لا استحقاق عند الاستقالة قبل 5 سنوات</strong>
                    <span>وفق المادة 121 من قانون العمل المصري، الاستقالة قبل إتمام 5 سنوات لا تُولِّد أي مكافأة.</span>
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

                  {/* Entitlement progress bar (resignation only) */}
                  {reason === 'resignation' && result.entitlementPercent < 100 && (
                    <div className="calc-esb-entitlement">
                      <div className="calc-esb-entitlement-bar">
                        <div
                          className="calc-esb-entitlement-fill"
                          style={{ width: `${result.entitlementPercent}%` }}
                        />
                      </div>
                      <span className="calc-esb-entitlement-label">
                        {result.resignationBracket.label} ← {result.entitlementPercent}% من المكافأة الكاملة ({fmt(result.fullGratuity)})
                      </span>
                    </div>
                  )}

                  {/* Breakdown */}
                  <div className="calc-esb-breakdown">
                    {result.firstTenYears > 0 && (
                      <div className="calc-esb-brow">
                        <span>
                          {Math.min(result.service.years, 10)} سنة × 30 يوم × {fmt(result.dailyRate)}/يوم
                          <span className="calc-hint"> (أول 10 سنوات)</span>
                        </span>
                        <strong>{fmt(result.firstTenAmount)}</strong>
                      </div>
                    )}
                    {result.remainingYears > 0 && (
                      <div className="calc-esb-brow">
                        <span>
                          {Math.max(result.service.years - 10, 0)} سنة × 45 يوم × {fmt(result.dailyRate)}/يوم
                          <span className="calc-hint"> (بعد 10 سنوات)</span>
                        </span>
                        <strong>{fmt(result.remainingAmount)}</strong>
                      </div>
                    )}
                    {result.partialAmount > 0 && (
                      <div className="calc-esb-brow">
                        <span>كسر السنة</span>
                        <strong>{fmt(result.partialAmount)}</strong>
                      </div>
                    )}
                    <div className="calc-esb-brow calc-esb-brow--total">
                      <span>المكافأة الكاملة (قبل التخفيض)</span>
                      <strong>{fmt(result.fullGratuity)}</strong>
                    </div>
                    {reason === 'resignation' && result.entitlementPercent < 100 && (
                      <div className="calc-esb-brow eg-discount-row">
                        <span>بعد تطبيق نسبة الاستقالة ({result.entitlementPercent}%)</span>
                        <strong>{fmt(result.gratuity)}</strong>
                      </div>
                    )}
                  </div>

                  <ResultActions
                    copyText={shareText}
                    shareTitle="حاسبة مكافأة نهاية الخدمة مصر"
                    shareText={shareText}
                  />

                  <div className="calc-esb-reason-strip">
                    <Warning size={14} weight="fill" />
                    <span>هذه نتيجة تقديرية — راجع عقدك وجهة العمل قبل أي قرار.</span>
                  </div>

                  {/* Collapsible extras */}
                  <div className="calc-esb-extras">
                    <button
                      className="calc-esb-extras-toggle"
                      onClick={() => setShowExtras((v) => !v)}
                      aria-expanded={showExtras}
                    >
                      <span>{showExtras ? 'إخفاء' : 'أثر الانتظار والمحطات الزمنية'}</span>
                      <CaretDown
                        size={15}
                        weight="bold"
                        className="calc-esb-caret"
                        aria-hidden="true"
                        style={{ transform: showExtras ? 'rotate(180deg)' : 'rotate(0deg)' }}
                      />
                    </button>

                    {showExtras && (
                      <div className="calc-esb-extras-panel">

                        {/* Wait comparison */}
                        <div className="calc-esb-extra-block">
                          <div className="calc-esb-extra-head">
                            <TrendUp size={14} weight="bold" />
                            <span>ماذا لو انتظرت <strong>{waitMonths[0]} شهر</strong> إضافي؟</span>
                          </div>
                          <Slider
                            className="calc-slider"
                            min={0}
                            max={24}
                            step={1}
                            value={waitMonths}
                            onValueChange={setWaitMonths}
                          />
                          {comparison.projected?.isValid && (
                            <div className={comparison.difference >= 0 ? 'calc-success' : 'calc-warning'}>
                              في {formatDateArabic(comparison.projectedEndDate)} ستكون المكافأة{' '}
                              {fmt(comparison.projected.gratuity)}،
                              أي فرق {fmt(comparison.difference)}.
                            </div>
                          )}
                        </div>

                        {/* Milestones */}
                        <div className="calc-esb-extra-block">
                          <div className="calc-esb-extra-head">
                            <CalendarBlank size={14} weight="bold" />
                            <span>المحطات الرئيسية</span>
                          </div>
                          <div className="calc-esb-timeline">
                            {milestones.map((m) => {
                              const isPast = m.date && m.date <= endDate;
                              const msResult = calculateEgyptEndOfServiceBenefit({
                                basicSalary: salary,
                                startDate,
                                endDate: m.date || endDate,
                                reason,
                              });
                              return (
                                <div key={m.years} className={`calc-esb-milestone${isPast ? ' is-past' : ' is-future'}`}>
                                  <span className="calc-esb-milestone-label">
                                    <strong>{m.label}</strong>
                                    <span className="calc-hint">بعد {m.years} سنة — {m.date ? formatDateArabic(m.date) : '—'}</span>
                                  </span>
                                  <span className={`calc-esb-milestone-date${isPast ? ' is-past' : ''}`}>
                                    {msResult.isValid ? fmt(msResult.gratuity) : '—'}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                      </div>
                    )}
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
