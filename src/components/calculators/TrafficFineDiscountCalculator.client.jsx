"use client";

import { useEffect, useState } from 'react';
import { CalendarBlank, Info, Share as ShareIcon, TrendUp, Warning, X } from '@phosphor-icons/react';
import { toast } from 'sonner';
import CountryFlag from '@/components/shared/CountryFlag';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { calculateTrafficFineDiscount, EXCLUDED_CATEGORIES } from '@/lib/calculators/traffic-fine-engine';

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

function formatMoney(value) {
  return `${new Intl.NumberFormat('ar-SA-u-nu-latn', { maximumFractionDigits: 0 }).format(value)} ر.س`;
}

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export default function TrafficFineDiscountCalculator({ initialTodayIso }) {
  const [amount, setAmount] = useState('500');
  const [violationDate, setViolationDate] = useState(initialTodayIso);
  const [isExcludedType, setIsExcludedType] = useState(false);
  const [installmentMonths, setInstallmentMonths] = useState(6);
  const [showInstallment, setShowInstallment] = useState(false);
  const [formKey, setFormKey] = useState(0);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const amountRaw = params.get('amount');
    const dateRaw = params.get('date');
    const amountNum = Number(amountRaw);
    if (amountRaw && Number.isFinite(amountNum) && amountNum > 0) setAmount(String(amountNum));
    if (ISO_DATE_RE.test(dateRaw || '')) setViolationDate(dateRaw);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams();
      if (amount) params.set('amount', amount);
      if (violationDate) params.set('date', violationDate);
      const query = params.toString();
      const nextUrl = query ? `${window.location.pathname}?${query}` : window.location.pathname;
      window.history.replaceState(null, '', nextUrl);
    }, 400);
    return () => clearTimeout(timer);
  }, [amount, violationDate]);

  const result = calculateTrafficFineDiscount({
    amount,
    violationDate,
    todayIso: initialTodayIso,
    isExcludedType,
    installmentMonths,
  });

  const shareText = result.isValid
    ? result.eligible
      ? `مخالفتي تستحق خصم 25%: ادفع ${formatMoney(result.payableNow)} بدل ${formatMoney(result.total)}`
      : `مخالفتي انتهت مهلة الخصم — المبلغ المستحق: ${formatMoney(result.total)}`
    : '';

  function handleClear() {
    setAmount('');
    setViolationDate('');
    setIsExcludedType(false);
    setFormKey((k) => k + 1);
  }

  function handleReload() {
    setAmount('500');
    setViolationDate(initialTodayIso);
    setIsExcludedType(false);
    setInstallmentMonths(6);
  }

  async function shareResult() {
    if (navigator.share) {
      try {
        await navigator.share({ title: 'حاسبة خصم المخالفات المرورية', text: shareText });
        return;
      } catch {
        // user cancelled
      }
    }
    try {
      await navigator.clipboard.writeText(shareText);
      toast.success('تم نسخ النتيجة إلى الحافظة');
    } catch {
      toast.error('تعذّر نسخ النتيجة');
    }
  }

  return (
    <div aria-label="حاسبة خصم وتقسيط المخالفات المرورية">
      <div className="tool-v2-panel-head">
        <span className="tool-v2-country-badge"><CountryFlag code="sa" label="السعودية" /> السعودية <span className="tool-v2-live-dot" aria-hidden="true" /></span>
      </div>

      <div className="tool-v2-field">
        <label htmlFor="tf-amount">قيمة المخالفة (ر.س)</label>
        <input
          id="tf-amount"
          type="number"
          inputMode="decimal"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="500"
        />
      </div>

      <div className="tool-v2-field">
        <label htmlFor="tf-date">
          تاريخ تسجيل المخالفة
          <FieldHint text="التاريخ الذي سُجّلت فيه المخالفة (كما يظهر في تفاصيلها عبر أبشر أو منصة سداد المخالفات)، وليس تاريخ اليوم." />
        </label>
        <input key={`date-${formKey}`} id="tf-date" type="date" value={violationDate} onChange={(e) => setViolationDate(e.target.value)} />
      </div>

      <div className="tool-v2-field">
        <label className="tool-v2-option-row" htmlFor="tf-excluded-check">
          <input
            type="checkbox"
            id="tf-excluded-check"
            checked={isExcludedType}
            onChange={(e) => setIsExcludedType(e.target.checked)}
          />
          <span>
            مخالفتي من نوع مستثنى من الخصم
            <span className="tool-v2-option-hint">تفحيط، حادث جسيم، وزن/أبعاد المركبة، وحالات أخرى — القائمة الكاملة أسفل الصفحة.</span>
          </span>
        </label>
      </div>

      {result.isValid ? (
        <div aria-live="polite">
          <div className="tool-v2-result-hero">
            <div className="tool-v2-result-label">
              {result.eligible ? 'المبلغ المستحق بعد الخصم' : 'المبلغ المستحق (بدون خصم)'}
            </div>
            <div className="tool-v2-result-value">{formatMoney(result.payableNow)}</div>
            <div className="tool-v2-result-meta">
              {result.eligible
                ? `وفّرت ${formatMoney(result.discountAmount)} (خصم 25% وفق المادة 75) · باقي ${result.daysLeft} يوماً على انتهاء المهلة`
                : result.isExcludedType
                  ? 'هذا النوع من المخالفات مستثنى من خصم 25% مهما كان التاريخ.'
                  : `تجاوزت مهلة الـ45 يوماً منذ التسجيل (${result.daysSince} يوماً) — لم يعد الخصم متاحاً.`}
            </div>
          </div>

          <div className="tool-v2-tool-collapse">
            <button
              type="button"
              className="tool-v2-tool-collapse-toggle"
              onClick={() => setShowInstallment((v) => !v)}
              aria-expanded={showInstallment}
            >
              <span>تقسيط المخالفة عبر أبشر</span>
              <CalendarBlank size={15} weight="bold" />
            </button>
            {showInstallment && (
              <div className="tool-v2-tool-collapse-body">
                <div className="tool-v2-mini-block-head">
                  <span>عدد الأشهر: <strong>{result.installmentMonths}</strong></span>
                </div>
                <input
                  type="range"
                  min={3}
                  max={12}
                  step={1}
                  value={installmentMonths}
                  onChange={(e) => setInstallmentMonths(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--green)' }}
                />
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
                  القسط الشهري التقريبي: <strong>{formatMoney(result.monthlyInstallment)}</strong> — يُطلب عبر أبشر
                  (خدماتي ← المرور ← تجزئة المخالفات المرورية) خلال 90 يوماً من تاريخ التسجيل.
                </p>
              </div>
            )}
          </div>

          <div className="tool-v2-note-strip">
            <Warning size={14} weight="fill" />
            <span>تقدير استرشادي — تأكد من التفاصيل الرسمية والمبلغ الدقيق عبر تطبيق أبشر قبل السداد.</span>
          </div>
        </div>
      ) : (
        <div className="tool-v2-empty-state">
          <Warning size={28} weight="duotone" />
          <p>أدخل قيمة مخالفة صحيحة وتاريخ تسجيل صحيح (لا يتجاوز اليوم).</p>
        </div>
      )}

      <div className="tool-v2-action-row">
        <button
          type="button"
          className="tool-v2-action-btn is-primary"
          onClick={shareResult}
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

      <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '14px' }}>
        الأنواع المستثناة من الخصم: {EXCLUDED_CATEGORIES.join('، ')}.
      </p>
    </div>
  );
}
