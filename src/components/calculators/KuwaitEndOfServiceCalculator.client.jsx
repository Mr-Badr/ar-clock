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
  CalcProgress as Progress,
  CalcSelectTrigger as SelectTrigger,
} from '@/components/calculators/controls.client';
import ResultActions from '@/components/calculators/ResultActions.client';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import CountryFlag from '@/components/shared/CountryFlag';
import {
  buildKuwaitEndOfServiceComparison,
  buildKuwaitEndOfServiceMilestones,
  calculateKuwaitEndOfServiceBenefit,
  formatCurrency,
  formatDateArabic,
  formatPercent,
} from '@/lib/calculators/engine';

const TERMINATION_OPTIONS = [
  { value: 'contract_end',         label: 'انتهاء العقد أو عدم تجديده', hint: 'استحقاق كامل — بصرف النظر عن مدة الخدمة.' },
  { value: 'employer_termination', label: 'إنهاء من صاحب العمل',        hint: 'استحقاق كامل — وقد يُضاف تعويض إضافي.' },
  { value: 'resignation',          label: 'استقالة',                    hint: 'أقل من 3 سنوات: لا مكافأة. 3–5 سنوات: 50%. 5–10 سنوات: 66.7%. 10+ سنوات: كامل.' },
];

const today = new Date().toISOString().slice(0, 10);
const fiveYearsAgo = (() => {
  const d = new Date();
  d.setFullYear(d.getFullYear() - 5);
  return d.toISOString().slice(0, 10);
})();

export default function KuwaitEndOfServiceCalculator({ initialStartDate, initialEndDate }) {
  const [salary, setSalary]         = useState('500');
  const [startDate, setStartDate]   = useState(initialStartDate ?? fiveYearsAgo);
  const [endDate, setEndDate]       = useState(initialEndDate ?? today);
  const [reason, setReason]         = useState('contract_end');
  const [waitMonths, setWaitMonths] = useState([6]);
  const [showExtras, setShowExtras] = useState(false);

  const fmt = (v) => formatCurrency(v, 'KWD');

  const result = useMemo(
    () => calculateKuwaitEndOfServiceBenefit({ basicSalary: salary, startDate, endDate, reason }),
    [salary, startDate, endDate, reason],
  );
  const comparison = useMemo(
    () => buildKuwaitEndOfServiceComparison({ salary, startDate, endDate, reason, waitMonths: waitMonths[0] }),
    [salary, startDate, endDate, reason, waitMonths],
  );
  const milestones = useMemo(() => buildKuwaitEndOfServiceMilestones(startDate), [startDate]);

  const selectedOpt = TERMINATION_OPTIONS.find((o) => o.value === reason);

  const nextMilestone = reason === 'resignation'
    ? milestones.find((m) => {
        if (!m.date || m.date <= endDate) return false;
        return new Date(m.date).getTime() - new Date(endDate).getTime() <= 180 * 86400000;
      })
    : null;

  const footerNote = nextMilestone
    ? `نصيحة: انتظر حتى ${formatDateArabic(nextMilestone.date)} لتصل إلى "${nextMilestone.label}".`
    : 'هذه نتيجة تقديرية — راجع عقدك وجهة العمل قبل أي قرار.';

  const shareText = result.isValid
    ? `مكافأة نهاية الخدمة (الكويت): ${fmt(result.gratuity)}\nمدة الخدمة: ${result.serviceLabel}\nنسبة الاستحقاق: ${formatPercent(result.entitlementPercent)}`
    : '';

  return (
    <div className="calc-app end-service-tool" aria-label="حاسبة مكافأة نهاية الخدمة الكويت">
      <div className="calc-esb-layout">

        {/* ── FORM ─────────────────────────────────── */}
        <div className="calc-esb-form-col">
          <Card className="calc-surface-card calc-esb-form-card">
            <CardContent className="calc-esb-form-body">

              {/* Basic salary */}
              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">1</span>
                  <Label htmlFor="kw-esb-salary">الراتب الأساسي الشهري</Label>
                </div>
                <div className="calc-esb-money-row">
                  <Input
                    id="kw-esb-salary"
                    inputMode="decimal"
                    value={salary}
                    onChange={(e) => setSalary(e.target.value)}
                    placeholder="500"
                  />
                  <span className="calc-esb-currency">د.ك</span>
                </div>
                <p className="calc-hint">الأساسي فقط — لا تُضِف بدل السكن أو النقل أو الهاتف.</p>
              </div>

              {/* Dates */}
              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">2</span>
                  <Label>تواريخ الخدمة</Label>
                </div>
                <div className="calc-esb-date-row">
                  <div className="calc-esb-date-field">
                    <Label htmlFor="kw-esb-start" className="calc-esb-date-label">بداية العمل</Label>
                    <Input id="kw-esb-start" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                  </div>
                  <div className="calc-esb-date-field">
                    <Label htmlFor="kw-esb-end" className="calc-esb-date-label">نهاية العمل</Label>
                    <Input id="kw-esb-end" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
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
                <span>معدل يومي: <strong>{fmt(result.dailyRate)}</strong> (÷ 26)</span>
              </div>
            )}
            {result.isValid && result.isCapped && (
              <div className="calc-esb-fact kw-cap-badge">
                <Warning size={15} weight="fill" />
                <span>تم تطبيق سقف الـ18 شهراً</span>
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
                <span className="calc-esb-country-badge calc-esb-country-badge--kw"><CountryFlag code="kw" /> الكويت</span>
                <span className="calc-esb-live-dot" aria-hidden="true" />
              </div>

              {/* Big number */}
              <div className="calc-esb-amount-hero">
                <span className="calc-esb-amount-label">المكافأة المقدرة</span>
                <div className="calc-esb-amount-value">{fmt(result.gratuity)}</div>
                <div className="calc-esb-amount-meta">
                  <span>{result.serviceLabel}</span>
                  <span className="calc-esb-sep">·</span>
                  <span>{formatPercent(result.entitlementPercent)} استحقاق</span>
                  {result.isCapped && (
                    <span className="kw-cap-badge">· سقف 18 شهر</span>
                  )}
                </div>
              </div>

              {/* Entitlement progress */}
              <div className="calc-esb-pct-row">
                <Progress value={result.entitlementPercent} className="calc-esb-pct-bar" />
                {reason === 'resignation' && (
                  <span className="calc-hint">{result.resignationBracket?.label}</span>
                )}
              </div>

              {/* Two-tier breakdown */}
              <div className="calc-esb-breakdown">
                {result.firstFiveAmount > 0 && (
                  <div className="calc-esb-brow">
                    <span>السنوات الأولى × 15 يوماً</span>
                    <strong>{fmt(result.firstFiveAmount)}</strong>
                  </div>
                )}
                {result.remainingAmount > 0 && (
                  <div className="calc-esb-brow">
                    <span>ما بعد الخامسة × 30 يوماً</span>
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
                  <span>المكافأة الكاملة قبل التعديل</span>
                  <strong>{fmt(result.fullGratuity)}</strong>
                </div>
                {result.isCapped && (
                  <div className="calc-esb-brow kw-cap-row">
                    <span>بعد سقف 18 شهراً</span>
                    <strong>{fmt(result.cappedFullGratuity)}</strong>
                  </div>
                )}
                {reason === 'resignation' && result.entitlementPercent < 100 && (
                  <div className="calc-esb-brow" style={{ borderTop: '1px dashed var(--border-subtle)', marginTop: 'var(--space-2)', paddingTop: 'var(--space-2)' }}>
                    <span>بعد نسبة الاستقالة ({formatPercent(result.entitlementPercent)})</span>
                    <strong style={{ color: 'var(--accent)' }}>{fmt(result.gratuity)}</strong>
                  </div>
                )}
                {reason === 'resignation' && result.entitlementPercent === 0 && (
                  <div className="kw-zero-notice">
                    <Warning size={14} weight="fill" />
                    <span>الاستقالة قبل 3 سنوات لا تُخوِّل الحصول على مكافأة نهاية الخدمة.</span>
                  </div>
                )}
              </div>

              <ResultActions
                copyText={shareText}
                shareTitle="حاسبة مكافأة نهاية الخدمة الكويت"
                shareText={shareText}
              />

              <div className="calc-esb-reason-strip">
                <Warning size={14} weight="fill" />
                <span>{footerNote}</span>
              </div>

              {/* Collapsible: wait comparison + milestones */}
              <div className="calc-esb-extras">
                <button
                  className="calc-esb-extras-toggle"
                  onClick={() => setShowExtras((v) => !v)}
                  aria-expanded={showExtras}
                >
                  <span>{showExtras ? 'إخفاء' : 'أثر الانتظار ومحطات الاستقالة'}</span>
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

                    {/* Resignation milestones */}
                    <div className="calc-esb-extra-block">
                      <div className="calc-esb-extra-head">
                        <CalendarBlank size={14} weight="bold" />
                        <span>محطات الاستحقاق عند الاستقالة</span>
                      </div>
                      <div className="calc-esb-timeline">
                        {milestones.map((m) => {
                          const isPast = m.date && m.date <= endDate;
                          const msResult = calculateKuwaitEndOfServiceBenefit({
                            basicSalary: salary,
                            startDate,
                            endDate: m.date || endDate,
                            reason: 'resignation',
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
                      <p className="calc-hint" style={{ fontSize: '0.72rem', marginTop: '0.25rem' }}>
                        المبالغ محسوبة بالراتب المُدخل ونسبة الاستقالة عند كل محطة.
                      </p>
                    </div>

                  </div>
                )}
              </div>

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
