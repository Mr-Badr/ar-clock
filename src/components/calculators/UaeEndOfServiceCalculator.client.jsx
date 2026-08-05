"use client";

import { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import {
  CalendarBlank,
  CaretDown,
  Check,
  Info,
  Share as ShareIcon,
  TrendUp,
  Warning,
  X,
} from '@phosphor-icons/react';
import { toast } from 'sonner';
import CountryFlag from '@/components/shared/CountryFlag';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

function FieldHint({ text }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button type="button" className="tool-v2-field-hint-btn" aria-label="توضيح">
            <Info size={14} weight="bold" />
          </button>
        </TooltipTrigger>
        <TooltipContent>{text}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

const EndOfServiceChart = lazy(() => import('./EndOfServiceChart.client'));
import {
  buildUaeEndOfServiceComparison,
  buildUaeEndOfServiceMilestones,
  calculateUaeEndOfServiceBenefit,
  formatCurrency,
  formatDateArabic,
  formatPercent,
} from '@/lib/calculators/engine';

// All four reasons now give the same entitlement (full amount after 1 year, zero before it) —
// since Federal Decree-Law No. 33 of 2021, resignation no longer reduces the gratuity. Hints
// reflect this rather than the old (repealed) 1/3–2/3 resignation scale.
const terminationOptions = [
  { value: 'contract_end', label: 'انتهاء العقد أو عدم تجديده', hint: 'استحقاق كامل بعد سنة واحدة من الخدمة.' },
  { value: 'employer_termination', label: 'إنهاء من صاحب العمل', hint: 'استحقاق كامل — وقد يضاف تعويض تعسفي منفصل.' },
  { value: 'resignation', label: 'استقالة', hint: 'استحقاق كامل بعد سنة واحدة — لا تخفّضها الاستقالة بعد قانون 2021.' },
  { value: 'retirement', label: 'تقاعد أو وفاة', hint: 'استحقاق كامل بنفس شرط السنة الواحدة.' },
];

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const VALID_REASONS = new Set(['contract_end', 'employer_termination', 'resignation', 'retirement']);

async function shareResult(title, text) {
  if (navigator.share) {
    try {
      await navigator.share({ title, text });
      return;
    } catch {
      // user cancelled the native share sheet — fall through to clipboard
    }
  }
  try {
    await navigator.clipboard.writeText(text);
    toast.success('تم نسخ النتيجة إلى الحافظة');
  } catch {
    toast.error('تعذّر نسخ النتيجة');
  }
}

export default function UaeEndOfServiceCalculator({ initialStartDate, initialEndDate }) {
  const [salary, setSalary] = useState('10000');
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);
  const [reason, setReason] = useState('contract_end');
  const [waitMonths, setWaitMonths] = useState(6);
  const [showExtras, setShowExtras] = useState(false);
  // See end-of-service-benefits' EndOfServiceCalculator.client.jsx for why this exists: forces
  // a fresh native <input type="date"> node on مسح (clear) so no stale internal browser
  // segment state (day/month) survives from before the clear.
  const [formKey, setFormKey] = useState(0);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const salaryRaw = params.get('salary');
    const startRaw = params.get('start');
    const endRaw = params.get('end');
    const reasonRaw = params.get('reason');

    const salaryNum = Number(salaryRaw);
    if (salaryRaw && Number.isFinite(salaryNum) && salaryNum > 0) {
      setSalary(String(salaryNum));
    }
    if (ISO_DATE_RE.test(startRaw || '') && ISO_DATE_RE.test(endRaw || '') && startRaw < endRaw) {
      setStartDate(startRaw);
      setEndDate(endRaw);
    }
    if (reasonRaw && VALID_REASONS.has(reasonRaw)) {
      setReason(reasonRaw);
    }
  }, []);

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

  const formatMoney = (value) => formatCurrency(value, 'AED');

  const result = useMemo(
    () => calculateUaeEndOfServiceBenefit({ basicSalary: salary, startDate, endDate, reason }),
    [salary, startDate, endDate, reason],
  );
  const comparison = useMemo(
    () => buildUaeEndOfServiceComparison({ salary, startDate, endDate, reason, waitMonths }),
    [salary, startDate, endDate, reason, waitMonths],
  );
  const milestones = useMemo(() => buildUaeEndOfServiceMilestones(startDate), [startDate]);

  // Milestones (1-year eligibility, 5-year rate increase) now apply the same way regardless
  // of reason — resignation no longer has its own separate percentage schedule.
  const NEAR_MILESTONE_DAYS = 180;
  const nextMilestone = milestones.find((item) => {
    if (!item.date || item.date <= endDate) return false;
    const msUntil = new Date(item.date).getTime() - new Date(endDate).getTime();
    return msUntil <= NEAR_MILESTONE_DAYS * 86400000;
  });
  const nextMilestoneText = nextMilestone
    ? `نصيحة: انتظر حتى ${formatDateArabic(nextMilestone.date)} لتصل إلى "${nextMilestone.label}".`
    : 'هذه نتيجة تقديرية — راجع عقدك وجهة العمل قبل أي قرار.';

  const shareText = result.isValid
    ? `مكافأة نهاية الخدمة (الإمارات): ${formatMoney(result.gratuity)}\nمدة الخدمة: ${result.serviceLabel}\nنسبة الاستحقاق: ${formatPercent(result.entitlementPercent)}`
    : '';

  function handleClear() {
    setSalary('');
    setStartDate('');
    setEndDate('');
    setFormKey((k) => k + 1);
  }

  function handleReload() {
    setSalary('10000');
    setStartDate(initialStartDate);
    setEndDate(initialEndDate);
    setReason('contract_end');
  }

  return (
    <div aria-label="حاسبة مكافأة نهاية الخدمة الإمارات">
      <div className="tool-v2-panel-head">
        <span className="tool-v2-country-badge"><CountryFlag code="ae" label="الإمارات" /> الإمارات <span className="tool-v2-live-dot" aria-hidden="true" /></span>
      </div>

      <div className="tool-v2-field">
        <label htmlFor="uae-esb-salary">
          الراتب الأساسي الشهري (د.إ)
          <FieldHint text="الراتب الأساسي فقط كما في العقد — بدون بدل السكن أو النقل أو أي بدلات أخرى." />
        </label>
        <input
          id="uae-esb-salary"
          type="number"
          inputMode="decimal"
          value={salary}
          onChange={(e) => setSalary(e.target.value)}
          placeholder="10000"
        />
      </div>

      <div className="tool-v2-field-row-pair">
        <div className="tool-v2-field">
          <label htmlFor="uae-esb-start">بداية العمل</label>
          <input key={`start-${formKey}`} id="uae-esb-start" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </div>
        <div className="tool-v2-field">
          <label htmlFor="uae-esb-end">نهاية العمل</label>
          <input key={`end-${formKey}`} id="uae-esb-end" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </div>
      </div>

      <div className="tool-v2-field">
        <label>
          سبب إنهاء العلاقة
          <FieldHint text="كل الأسباب تُعطي نفس النسبة الآن — الاختيار هنا يُظهر فقط ملاحظة خاصة مثل التعويض التعسفي." />
        </label>
        <div className="tool-v2-option-list">
          {terminationOptions.map((opt) => (
            <label
              key={opt.value}
              className={`tool-v2-option-row${reason === opt.value ? ' is-active' : ''}`}
              htmlFor={`uae-esb-reason-${opt.value}`}
            >
              <input
                type="radio"
                id={`uae-esb-reason-${opt.value}`}
                name="uae-esb-reason"
                checked={reason === opt.value}
                onChange={() => setReason(opt.value)}
              />
              <span>
                {opt.label}
                <span className="tool-v2-option-hint">{opt.hint}</span>
              </span>
            </label>
          ))}
        </div>
      </div>

      {result.isValid ? (
        <div aria-live="polite">
          <div className="tool-v2-result-hero">
            <div className="tool-v2-result-label">مكافأة نهاية الخدمة المقدّرة</div>
            <div className="tool-v2-result-value">{formatMoney(result.gratuity)}</div>
            <div className="tool-v2-result-meta">
              {result.serviceLabel} · {formatPercent(result.entitlementPercent)} استحقاق
            </div>
            <div className="tool-v2-result-breakdown">
              {result.firstFiveAmount > 0 && (
                <span>السنوات الأولى (21 يوماً / سنة): <strong>{formatMoney(result.firstFiveAmount)}</strong></span>
              )}
              {result.remainingAmount > 0 && (
                <span>ما بعد الخامسة (30 يوماً / سنة): <strong>{formatMoney(result.remainingAmount)}</strong></span>
              )}
              {result.partialAmount > 0 && (
                <span>كسر السنة: <strong>{formatMoney(result.partialAmount)}</strong></span>
              )}
            </div>
            {result.isCapped && (
              <div className="tool-v2-result-meta" style={{ marginTop: '6px' }}>
                المبلغ مُطبَّق عليه الحد الأقصى القانوني (راتب سنتين) — القيمة الفعلية قبل السقف كانت أعلى.
              </div>
            )}
          </div>

          <div className="tool-v2-progress-track">
            <div className="tool-v2-progress-fill" style={{ width: `${result.entitlementPercent}%` }} />
          </div>

          <Suspense fallback={null}>
            <EndOfServiceChart
              result={{ ...result, award: result.gratuity, fullAward: result.fullGratuity }}
              salary={salary}
              currency="AED"
            />
          </Suspense>

          <div className="tool-v2-note-strip">
            <Warning size={14} weight="fill" />
            <span>{nextMilestoneText}</span>
          </div>

          <div className="tool-v2-tool-collapse">
            <button
              type="button"
              className="tool-v2-tool-collapse-toggle"
              onClick={() => setShowExtras((v) => !v)}
              aria-expanded={showExtras}
            >
              <span>أثر الانتظار والخط الزمني</span>
              <CaretDown size={15} weight="bold" style={{ transform: showExtras ? 'rotate(180deg)' : 'rotate(0deg)' }} />
            </button>

            {showExtras && (
              <div className="tool-v2-tool-collapse-body">
                <div>
                  <div className="tool-v2-mini-block-head">
                    <TrendUp size={14} weight="bold" />
                    <span>قارن مع الانتظار <strong>{waitMonths} شهر</strong> إضافي</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={24}
                    step={1}
                    value={waitMonths}
                    onChange={(e) => setWaitMonths(Number(e.target.value))}
                    style={{ width: '100%', accentColor: 'var(--green)' }}
                  />
                  {comparison.projected?.isValid && (
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
                      إذا تغيّر تاريخ النهاية إلى {formatDateArabic(comparison.projectedEndDate)}
                      {' '}فسيصبح الاستحقاق {formatMoney(comparison.projected.gratuity)}،
                      {' '}أي فرق {formatMoney(comparison.difference)}.
                    </p>
                  )}
                </div>

                <div>
                  <div className="tool-v2-mini-block-head">
                    <CalendarBlank size={14} weight="bold" />
                    <span>محطات الاستحقاق — متى ترتفع المكافأة؟</span>
                  </div>
                  <div className="tool-v2-timeline">
                    {milestones.map((item) => {
                      const isPast = item.date && item.date <= endDate;
                      // Same result regardless of reason now (see engine.js) — using the
                      // actual selected reason instead of a hardcoded one for clarity.
                      const milestoneResult = calculateUaeEndOfServiceBenefit({
                        basicSalary: salary,
                        startDate,
                        endDate: item.date || endDate,
                        reason,
                      });
                      return (
                        <div key={item.years} className={`tool-v2-milestone${isPast ? ' is-past' : ' is-future'}`}>
                          <span className="tool-v2-milestone-marker" aria-hidden="true">
                            {isPast ? <Check size={12} weight="bold" /> : <span className="tool-v2-milestone-dot" />}
                          </span>
                          <span className="tool-v2-milestone-body">
                            <strong className="tool-v2-milestone-label">{item.label}</strong>
                            <span className="tool-v2-milestone-sub">
                              بعد {item.years} {item.years === 1 ? 'سنة' : 'سنوات'} — {item.date ? formatDateArabic(item.date) : '—'}
                            </span>
                          </span>
                          <span className="tool-v2-milestone-value">
                            {milestoneResult.isValid ? formatMoney(milestoneResult.gratuity) : '—'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="tool-v2-empty-state">
          <Warning size={28} weight="duotone" />
          <p>أدخل راتباً صحيحاً وتأكد أن تاريخ نهاية الخدمة بعد تاريخ البداية.</p>
        </div>
      )}

      <div className="tool-v2-action-row">
        <button
          type="button"
          className="tool-v2-action-btn is-primary"
          onClick={() => shareResult('حاسبة مكافأة نهاية الخدمة الإمارات', shareText)}
          disabled={!result.isValid}
        >
          <ShareIcon size={18} weight="bold" />
          مشاركة
        </button>
        <button type="button" className="tool-v2-action-btn" onClick={handleClear}>
          <X size={18} weight="bold" />
          مسح
        </button>
        <button type="button" className="tool-v2-action-btn" onClick={handleReload}>
          <TrendUp size={18} weight="bold" style={{ rotate: '90deg' }} />
          إعادة تحميل
        </button>
      </div>
    </div>
  );
}
