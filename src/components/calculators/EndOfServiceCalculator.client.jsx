"use client";

import { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import {
  CalendarBlank,
  CaretDown,
  Check,
  Info,
  Share as ShareIcon,
  TrendUp,
  Wallet,
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
  buildEndOfServiceComparison,
  buildEndOfServiceMilestones,
  calculateEndOfServiceBenefit,
  formatCurrency,
  formatDateArabic,
  formatPercent,
} from '@/lib/calculators/engine';

const terminationOptions = [
  { value: 'contract_end', label: 'انتهاء مدة العقد' },
  { value: 'resignation', label: 'استقالة' },
  { value: 'employer_termination', label: 'فصل أو إنهاء من صاحب العمل' },
  { value: 'retirement', label: 'تقاعد' },
];

const contractOptions = [
  { value: 'fixed', title: 'محدد المدة', description: 'عند نهاية العقد أو عدم تجديده.' },
  { value: 'open', title: 'غير محدد', description: 'شائع في الاستقالات والعقود المستمرة.' },
];

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const VALID_REASONS = new Set(['contract_end', 'resignation', 'employer_termination', 'retirement']);

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

export default function EndOfServiceCalculator({ initialStartDate, initialEndDate }) {
  const [contractType, setContractType] = useState('open');
  const [salary, setSalary] = useState('8000');
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);
  const [reason, setReason] = useState('resignation');
  const [waitMonths, setWaitMonths] = useState(6);
  const [showExtras, setShowExtras] = useState(false);
  // Bumped on every مسح (clear) — used as part of the date inputs' `key` below. Real bug
  // found via testing (2026-07-30): after React sets a native <input type="date">'s value to
  // "", Chromium doesn't fully reset the widget's internal per-segment state — typing a new
  // date into the same DOM node afterward can silently retain stale day/month digits from
  // before the clear, producing an invalid date that never fires a valid onChange (confirmed
  // by inspecting the input's value after each keystroke: old segments bled through). Forcing
  // React to unmount and recreate a FRESH native input via a changing `key` is the reliable
  // fix — a prop change alone doesn't reset the browser's own internal widget state, only a
  // real remount does.
  const [formKey, setFormKey] = useState(0);

  // Prefill from a shared link (?salary=&start=&end=&reason=) after hydration — same
  // reasoning as before: reading searchParams server-side breaks static prerendering
  // under cacheComponents, so this happens client-side after mount instead.
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

  const formatMoney = (value) => formatCurrency(value, 'SAR');

  const result = useMemo(
    () => calculateEndOfServiceBenefit({ salary, startDate, endDate, reason }),
    [salary, startDate, endDate, reason],
  );
  const comparison = useMemo(
    () => buildEndOfServiceComparison({ salary, startDate, endDate, reason, waitMonths }),
    [salary, startDate, endDate, reason, waitMonths],
  );
  const milestones = useMemo(() => buildEndOfServiceMilestones(startDate), [startDate]);

  const NEAR_MILESTONE_DAYS = 180;
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

  const shareText = result.isValid
    ? `مكافأة نهاية الخدمة: ${formatMoney(result.award)}\nمدة الخدمة: ${result.serviceLabel}\nنسبة الاستحقاق: ${formatPercent(result.entitlementPercent)}`
    : '';

  function handleClear() {
    setSalary('');
    setStartDate('');
    setEndDate('');
    setFormKey((k) => k + 1);
  }

  function handleReload() {
    setSalary('8000');
    setStartDate(initialStartDate);
    setEndDate(initialEndDate);
    setReason('resignation');
    setContractType('open');
  }

  return (
    <div aria-label="حاسبة مكافأة نهاية الخدمة">
      <div className="tool-v2-panel-head">
        <span className="tool-v2-country-badge"><CountryFlag code="sa" label="السعودية" /> السعودية <span className="tool-v2-live-dot" aria-hidden="true" /></span>
      </div>

      <div className="tool-v2-field">
        <label htmlFor="esb-contract-fixed">نوع العقد</label>
        <div className="tool-v2-option-list row">
          {contractOptions.map((opt) => (
            <label
              key={opt.value}
              className={`tool-v2-option-row${contractType === opt.value ? ' is-active' : ''}`}
              htmlFor={`esb-contract-${opt.value}`}
            >
              <input
                type="radio"
                id={`esb-contract-${opt.value}`}
                name="esb-contract"
                checked={contractType === opt.value}
                onChange={() => setContractType(opt.value)}
              />
              <span>
                {opt.title}
                <span className="tool-v2-option-hint">{opt.description}</span>
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="tool-v2-field">
        <label htmlFor="esb-salary">
          الأجر المرجعي الشهري (ر.س)
          <FieldHint text="النص النظامي يعتمد على الأجر الأخير. إذا لم تكن متأكداً، ابدأ بالراتب الأساسي ثم راجع البدلات الثابتة في عقدك." />
        </label>
        <input
          id="esb-salary"
          type="number"
          inputMode="decimal"
          value={salary}
          onChange={(e) => setSalary(e.target.value)}
          placeholder="8000"
        />
      </div>

      <div className="tool-v2-field-row-pair">
        <div className="tool-v2-field">
          <label htmlFor="esb-start">بداية العمل</label>
          <input key={`start-${formKey}`} id="esb-start" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </div>
        <div className="tool-v2-field">
          <label htmlFor="esb-end">نهاية العمل</label>
          <input key={`end-${formKey}`} id="esb-end" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </div>
      </div>

      <div className="tool-v2-field">
        <label>
          سبب إنهاء العلاقة
          <FieldHint text="هذا الاختيار هو الأكثر تأثيراً على النتيجة — الاستقالة وحدها تخضع لشرائح المادة 85." />
        </label>
        <div className="tool-v2-option-list">
          {terminationOptions.map((opt) => (
            <label
              key={opt.value}
              className={`tool-v2-option-row${reason === opt.value ? ' is-active' : ''}`}
              htmlFor={`esb-reason-${opt.value}`}
            >
              <input
                type="radio"
                id={`esb-reason-${opt.value}`}
                name="esb-reason"
                checked={reason === opt.value}
                onChange={() => setReason(opt.value)}
              />
              {opt.label}
            </label>
          ))}
        </div>
      </div>

      {result.isValid ? (
        <div aria-live="polite">
          <div className="tool-v2-result-hero">
            <div className="tool-v2-result-label">مكافأة نهاية الخدمة المقدّرة</div>
            <div className="tool-v2-result-value">{formatMoney(result.award)}</div>
            <div className="tool-v2-result-meta">
              {result.serviceLabel} · {formatPercent(result.entitlementPercent)} استحقاق
            </div>
            <div className="tool-v2-result-breakdown">
              {result.firstFiveAmount > 0 && (
                <span>السنوات الأولى (نصف شهر / سنة): <strong>{formatMoney(result.firstFiveAmount)}</strong></span>
              )}
              {result.remainingAmount > 0 && (
                <span>ما بعد الخامسة (شهر / سنة): <strong>{formatMoney(result.remainingAmount)}</strong></span>
              )}
              {result.partialAmount > 0 && (
                <span>كسر السنة: <strong>{formatMoney(result.partialAmount)}</strong></span>
              )}
            </div>
          </div>

          <div className="tool-v2-progress-track">
            <div className="tool-v2-progress-fill" style={{ width: `${result.entitlementPercent}%` }} />
          </div>

          <Suspense fallback={null}>
            <EndOfServiceChart result={result} salary={salary} />
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
                    <span>قارن مع الاستقالة بعد <strong>{waitMonths} شهر</strong></span>
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
                      {' '}فسيصبح الاستحقاق {formatMoney(comparison.projected.award)}،
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
                      const milestoneResult = calculateEndOfServiceBenefit({
                        salary,
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
                            {milestoneResult.isValid ? formatMoney(milestoneResult.award) : '—'}
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

      {/* Always visible regardless of valid/invalid state — clearing the form must never also
          hide the only way back (إعادة تحميل), and the reader should always be able to try again. */}
      <div className="tool-v2-action-row">
        <button
          type="button"
          className="tool-v2-action-btn is-primary"
          onClick={() => shareResult('حاسبة مكافأة نهاية الخدمة', shareText)}
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
