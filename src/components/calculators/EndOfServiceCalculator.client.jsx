"use client";

import { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import {
  Briefcase,
  CalendarBlank,
  CaretDown,
  TrendUp,
  Wallet,
  Warning,
} from '@phosphor-icons/react';

const EndOfServiceChart = lazy(() => import('./EndOfServiceChart.client'));
import {
  CalcInput as Input,
  CalcProgress as Progress,
  CalcSelectTrigger as SelectTrigger,
} from '@/components/calculators/controls.client';
import ResultActions from '@/components/calculators/ResultActions.client';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import {
  buildEndOfServiceComparison,
  buildEndOfServiceMilestones,
  calculateEndOfServiceBenefit,
  formatCurrency,
  formatDateArabic,
  formatNumber,
  formatPercent,
} from '@/lib/calculators/engine';

const terminationOptions = [
  { value: 'contract_end', label: 'انتهاء مدة العقد', hint: 'استحقاق كامل وفق القاعدة العامة.' },
  { value: 'resignation', label: 'استقالة', hint: 'تُحسب النسبة تلقائياً حسب مدة الخدمة.' },
  { value: 'employer_termination', label: 'فصل أو إنهاء من صاحب العمل', hint: 'استحقاق كامل عادة.' },
  { value: 'retirement', label: 'تقاعد', hint: 'تُعامل كاستحقاق كامل في هذه الحاسبة.' },
];

const contractOptions = [
  { value: 'fixed', title: 'محدد المدة', description: 'عند نهاية العقد أو عدم تجديده.' },
  { value: 'open', title: 'غير محدد', description: 'شائع في الاستقالات والعقود المستمرة.' },
];

export default function EndOfServiceCalculator({
  initialStartDate,
  initialEndDate,
  initialSalary,
  initialReason,
}) {
  const [contractType, setContractType] = useState('open');
  const [salary, setSalary] = useState(initialSalary || '8000');
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);
  const [reason, setReason] = useState(initialReason || 'resignation');
  const [waitMonths, setWaitMonths] = useState([6]);
  const [showExtras, setShowExtras] = useState(false);

  // Keep the URL query string in sync with the current inputs so the page's
  // existing ResultActions "share/copy link" buttons (window.location.href)
  // carry the calculation, not just the bare page URL. history.replaceState
  // (not the Next.js router) so this never triggers a server round-trip.
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams();
      if (salary) params.set('salary', salary);
      if (startDate) params.set('start', startDate);
      if (endDate) params.set('end', endDate);
      if (reason) params.set('reason', reason);
      const query = params.toString();
      const nextUrl = query ? `${window.location.pathname}?${query}` : window.location.pathname;
      window.history.replaceState(null, '', nextUrl);
    }, 400);
    return () => clearTimeout(timer);
  }, [salary, startDate, endDate, reason]);

  const formatMoney = (value) => formatCurrency(value, 'SAR');

  const result = useMemo(
    () => calculateEndOfServiceBenefit({ salary, startDate, endDate, reason }),
    [salary, startDate, endDate, reason],
  );
  const comparison = useMemo(
    () => buildEndOfServiceComparison({ salary, startDate, endDate, reason, waitMonths: waitMonths[0] }),
    [salary, startDate, endDate, reason, waitMonths],
  );
  const milestones = useMemo(() => buildEndOfServiceMilestones(startDate), [startDate]);

  const selectedTermination = terminationOptions.find((o) => o.value === reason);
  const NEAR_MILESTONE_DAYS = 180; // 6 months window
  const nextMilestone = reason === 'resignation'
    ? milestones.find((item) => {
        if (!item.date || item.date <= endDate) return false;
        const msUntil = new Date(item.date).getTime() - new Date(endDate).getTime();
        return msUntil <= NEAR_MILESTONE_DAYS * 86400000;
      })
    : null;
  const nextMilestoneText = nextMilestone
    ? `نصيحة: انتظر حتى ${formatDateArabic(nextMilestone.date)} لتصل إلى "${nextMilestone.label}" وترفع مكافأتك.`
    : 'هذه نتيجة تقديرية — راجع عقد عملك والجهة الرسمية قبل اتخاذ أي قرار.';
  const resultContext = reason === 'resignation'
    ? result.resignationBracket?.label || 'تحتاج مدة صحيحة'
    : selectedTermination?.label || '';

  const shareText = result.isValid
    ? `مكافأة نهاية الخدمة: ${formatMoney(result.award)}\nمدة الخدمة: ${result.serviceLabel}\nنسبة الاستحقاق: ${formatPercent(result.entitlementPercent)}`
    : '';

  return (
    <div className="calc-app end-service-tool" aria-label="حاسبة مكافأة نهاية الخدمة">
      <div className="calc-esb-layout">

        {/* ── FORM ─────────────────────────────────── */}
        <div className="calc-esb-form-col">
          <Card className="calc-surface-card calc-esb-form-card">
            <CardContent className="calc-esb-form-body">

              {/* Contract type */}
              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">1</span>
                  <Label>نوع العقد</Label>
                </div>
                <RadioGroup value={contractType} onValueChange={setContractType} className="calc-esb-radio-row">
                  {contractOptions.map((opt) => (
                    <label key={opt.value} className="calc-esb-radio-card">
                      <RadioGroupItem value={opt.value} />
                      <span className="calc-esb-radio-copy">
                        <strong>{opt.title}</strong>
                        <span>{opt.description}</span>
                      </span>
                    </label>
                  ))}
                </RadioGroup>
              </div>

              {/* Salary */}
              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">2</span>
                  <Label htmlFor="esb-salary">الأجر المرجعي الشهري</Label>
                </div>
                <div className="calc-esb-money-row">
                  <Input
                    id="esb-salary"
                    inputMode="decimal"
                    value={salary}
                    onChange={(e) => setSalary(e.target.value)}
                    placeholder="8000"
                  />
                  <span className="calc-esb-currency">ر.س</span>
                </div>
                <p className="calc-hint">إن لم تكن متأكداً، ابدأ بالراتب الأساسي كتقدير أولي.</p>
              </div>

              {/* Dates */}
              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">3</span>
                  <Label>تواريخ العمل</Label>
                </div>
                <div className="calc-esb-date-row">
                  <div className="calc-esb-date-field">
                    <Label htmlFor="esb-start" className="calc-esb-date-label">بداية العمل</Label>
                    <Input id="esb-start" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                  </div>
                  <div className="calc-esb-date-field">
                    <Label htmlFor="esb-end" className="calc-esb-date-label">نهاية العمل</Label>
                    <Input id="esb-end" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                  </div>
                </div>
              </div>

              {/* Reason */}
              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">4</span>
                  <Label>سبب إنهاء العلاقة</Label>
                </div>
                <Select value={reason} onValueChange={setReason}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {terminationOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedTermination?.hint && (
                  <p className="calc-hint">{selectedTermination.hint}</p>
                )}
              </div>

            </CardContent>
          </Card>

          {/* Quick facts — desktop only sidebar notes */}
          <div className="calc-esb-sidebar-facts">
            <div className="calc-esb-fact">
              <Wallet size={15} weight="bold" />
              <span>الراتب المُدخل: <strong>{formatMoney(Number(salary) || 0)}</strong></span>
            </div>
            <div className="calc-esb-fact">
              <Briefcase size={15} weight="bold" />
              <span>{result.isValid ? `${result.serviceLabel}` : 'أدخل التواريخ'}</span>
            </div>
          </div>
        </div>

        {/* ── RESULT ───────────────────────────────── */}
        <div className="calc-esb-result-col">
          {result.isValid ? (
            <div className="calc-esb-result-panel" aria-live="polite">

              {/* Big result number */}
              <div className="calc-esb-amount-hero">
                <span className="calc-esb-amount-label">مكافأة نهاية الخدمة المقدرة</span>
                <div className="calc-esb-amount-value">{formatMoney(result.award)}</div>
                <div className="calc-esb-amount-meta">
                  <span>{result.serviceLabel}</span>
                  <span className="calc-esb-sep">·</span>
                  <span>{formatPercent(result.entitlementPercent)} استحقاق</span>
                </div>
              </div>

              {/* Entitlement bar */}
              <div className="calc-esb-pct-row">
                <Progress value={result.entitlementPercent} className="calc-esb-pct-bar" />
                <span className="calc-hint">{resultContext}</span>
              </div>

              {/* Compact breakdown */}
              <div className="calc-esb-breakdown">
                {result.firstFiveAmount > 0 && (
                  <div className="calc-esb-brow">
                    <span>السنوات الأولى (نصف شهر / سنة)</span>
                    <strong>{formatMoney(result.firstFiveAmount)}</strong>
                  </div>
                )}
                {result.remainingAmount > 0 && (
                  <div className="calc-esb-brow">
                    <span>ما بعد الخامسة (شهر / سنة)</span>
                    <strong>{formatMoney(result.remainingAmount)}</strong>
                  </div>
                )}
                {result.partialAmount > 0 && (
                  <div className="calc-esb-brow">
                    <span>كسر السنة</span>
                    <strong>{formatMoney(result.partialAmount)}</strong>
                  </div>
                )}
                <div className="calc-esb-brow calc-esb-brow--total">
                  <span>المجموع الكامل قبل التعديل</span>
                  <strong>{formatMoney(result.fullAward)}</strong>
                </div>
              </div>

              {/* Chart */}
              <Suspense fallback={null}>
                <EndOfServiceChart result={result} salary={salary} />
              </Suspense>

              {/* Actions */}
              <ResultActions
                copyText={shareText}
                shareTitle="حاسبة مكافأة نهاية الخدمة"
                shareText={shareText}
              />

              {/* Reason note */}
              <div className="calc-esb-reason-strip">
                <Warning size={14} weight="fill" />
                <span>{nextMilestoneText}</span>
              </div>

              {/* Collapsible extras: wait comparison + timeline */}
              <div className="calc-esb-extras">
                <button
                  className="calc-esb-extras-toggle"
                  onClick={() => setShowExtras((v) => !v)}
                  aria-expanded={showExtras}
                >
                  <span>{showExtras ? 'إخفاء' : 'أثر الانتظار والخط الزمني'}</span>
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
                        <span>قارن مع الاستقالة بعد <strong>{waitMonths[0]} شهر</strong></span>
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
                          إذا تغيّر تاريخ النهاية إلى {formatDateArabic(comparison.projectedEndDate)}
                          {' '}فسيصبح الاستحقاق {formatMoney(comparison.projected.award)}،
                          {' '}أي فرق {formatMoney(comparison.difference)}.
                        </div>
                      )}
                    </div>

                    {/* Timeline */}
                    <div className="calc-esb-extra-block">
                      <div className="calc-esb-extra-head">
                        <CalendarBlank size={14} weight="bold" />
                        <span>محطات الاستحقاق — متى ترتفع المكافأة؟</span>
                      </div>
                      <div className="calc-esb-timeline">
                        {milestones.map((item) => {
                          const isPast = item.date && item.date <= endDate;
                          const milestoneResult = calculateEndOfServiceBenefit({
                            salary,
                            startDate,
                            endDate: item.date || endDate,
                            reason,
                          });
                          return (
                            <div
                              key={item.years}
                              className={`calc-esb-milestone${isPast ? ' is-past' : ' is-future'}`}
                            >
                              <span className="calc-esb-milestone-label">
                                <strong>{item.label}</strong>
                                <span className="calc-hint">بعد {item.years} سنوات — {item.date ? formatDateArabic(item.date) : '—'}</span>
                              </span>
                              <span className={`calc-esb-milestone-date${isPast ? ' is-past' : ''}`}>
                                {milestoneResult.isValid ? formatMoney(milestoneResult.award) : '—'}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                      <p className="calc-hint" style={{ fontSize: '0.72rem', marginTop: '0.25rem' }}>
                        المبالغ محسوبة بالراتب المُدخل حالياً ونسبة الاستحقاق عند تاريخ كل محطة.
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
