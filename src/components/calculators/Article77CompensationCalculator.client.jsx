"use client";

import { useEffect, useState } from 'react';
import { Info, Share as ShareIcon, TrendUp, Warning, X } from '@phosphor-icons/react';
import { toast } from 'sonner';
import CountryFlag from '@/components/shared/CountryFlag';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { calculateArticle77Compensation } from '@/lib/calculators/article-77-engine';

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

const contractOptions = [
  { value: 'open', title: 'غير محدد المدة', description: 'الأكثر شيوعاً — التعويض 15 يوماً عن كل سنة خدمة.' },
  { value: 'fixed', title: 'محدد المدة', description: 'التعويض يساوي أجر المدة الباقية من العقد.' },
];

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export default function Article77CompensationCalculator({ initialStartDate, initialEndDate }) {
  const [contractType, setContractType] = useState('open');
  const [wage, setWage] = useState('8000');
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);
  const [remainingMonths, setRemainingMonths] = useState('6');
  const [formKey, setFormKey] = useState(0);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const wageRaw = params.get('wage');
    const startRaw = params.get('start');
    const endRaw = params.get('end');
    const contractRaw = params.get('contract');
    const wageNum = Number(wageRaw);
    if (wageRaw && Number.isFinite(wageNum) && wageNum > 0) setWage(String(wageNum));
    if (ISO_DATE_RE.test(startRaw || '') && ISO_DATE_RE.test(endRaw || '') && startRaw < endRaw) {
      setStartDate(startRaw);
      setEndDate(endRaw);
    }
    if (contractRaw === 'fixed' || contractRaw === 'open') setContractType(contractRaw);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams();
      if (wage) params.set('wage', wage);
      if (startDate) params.set('start', startDate);
      if (endDate) params.set('end', endDate);
      params.set('contract', contractType);
      const query = params.toString();
      const nextUrl = query ? `${window.location.pathname}?${query}` : window.location.pathname;
      window.history.replaceState(null, '', nextUrl);
    }, 400);
    return () => clearTimeout(timer);
  }, [wage, startDate, endDate, contractType]);

  const result = calculateArticle77Compensation({
    contractType,
    monthlyWage: wage,
    startDate,
    endDate,
    remainingMonths,
  });

  const shareText = result.isValid
    ? `تعويض المادة 77 المقدّر: ${formatMoney(result.final)}${result.flooredByMinimum ? ' (الحد الأدنى: أجر شهرين)' : ''}`
    : '';

  function handleClear() {
    setWage('');
    setStartDate('');
    setEndDate('');
    setRemainingMonths('');
    setFormKey((k) => k + 1);
  }

  function handleReload() {
    setWage('8000');
    setStartDate(initialStartDate);
    setEndDate(initialEndDate);
    setRemainingMonths('6');
    setContractType('open');
  }

  async function shareResult() {
    if (navigator.share) {
      try {
        await navigator.share({ title: 'حاسبة تعويض المادة 77', text: shareText });
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
    <div aria-label="حاسبة تعويض المادة 77">
      <div className="tool-v2-panel-head">
        <span className="tool-v2-country-badge"><CountryFlag code="sa" label="السعودية" /> السعودية <span className="tool-v2-live-dot" aria-hidden="true" /></span>
      </div>

      <div className="tool-v2-field">
        <label>نوع العقد</label>
        <div className="tool-v2-option-list">
          {contractOptions.map((opt) => (
            <label
              key={opt.value}
              className={`tool-v2-option-row${contractType === opt.value ? ' is-active' : ''}`}
              htmlFor={`a77-contract-${opt.value}`}
            >
              <input
                type="radio"
                id={`a77-contract-${opt.value}`}
                name="a77-contract"
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
        <label htmlFor="a77-wage">
          الأجر الشهري (ر.س)
          <FieldHint text="الأجر الذي يُحسب عليه التعويض حسب النص النظامي — استخدم آخر أجر ثابت قبل انتهاء العلاقة." />
        </label>
        <input
          id="a77-wage"
          type="number"
          inputMode="decimal"
          value={wage}
          onChange={(e) => setWage(e.target.value)}
          placeholder="8000"
        />
      </div>

      {contractType === 'open' ? (
        <div className="tool-v2-field-row-pair">
          <div className="tool-v2-field">
            <label htmlFor="a77-start">بداية العمل</label>
            <input key={`start-${formKey}`} id="a77-start" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>
          <div className="tool-v2-field">
            <label htmlFor="a77-end">تاريخ إنهاء العقد</label>
            <input key={`end-${formKey}`} id="a77-end" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
        </div>
      ) : (
        <div className="tool-v2-field">
          <label htmlFor="a77-remaining">
            الأشهر المتبقية من مدة العقد
            <FieldHint text="عدد الأشهر بين تاريخ الإنهاء الفعلي وتاريخ نهاية العقد الأصلي المتفق عليه." />
          </label>
          <input
            id="a77-remaining"
            type="number"
            inputMode="decimal"
            value={remainingMonths}
            onChange={(e) => setRemainingMonths(e.target.value)}
            placeholder="6"
          />
        </div>
      )}

      {result.isValid ? (
        <div aria-live="polite">
          <div className="tool-v2-result-hero">
            <div className="tool-v2-result-label">التعويض المقدّر وفق المادة 77</div>
            <div className="tool-v2-result-value">{formatMoney(result.final)}</div>
            <div className="tool-v2-result-meta">
              {result.contractType === 'open'
                ? `${result.years} سنة خدمة تقريباً · 15 يوماً أجر لكل سنة`
                : `${result.remainingMonths} أشهر متبقية من العقد`}
            </div>
            {result.flooredByMinimum ? (
              <div className="tool-v2-result-breakdown">
                <span>الناتج الأصلي قبل الحد الأدنى: <strong>{formatMoney(result.raw)}</strong></span>
                <span>رُفع تلقائياً للحد الأدنى (أجر شهرين): <strong>{formatMoney(result.minimumFloor)}</strong></span>
              </div>
            ) : (
              <div className="tool-v2-result-breakdown">
                <span>الحد الأدنى للمقارنة (أجر شهرين): <strong>{formatMoney(result.minimumFloor)}</strong></span>
              </div>
            )}
          </div>

          <div className="tool-v2-note-strip">
            <Warning size={14} weight="fill" />
            <span>
              هذا مبلغ استرشادي منفصل عن مكافأة نهاية الخدمة وأي رواتب مستحقة — يُصرف فقط إذا كان
              الإنهاء غير مشروع (لا يندرج تحت أسباب المادة 74). راجع محامي عمالي أو مكتب العمل لحالتك.
            </span>
          </div>
        </div>
      ) : (
        <div className="tool-v2-empty-state">
          <Warning size={28} weight="duotone" />
          <p>أدخل أجراً صحيحاً، و{contractType === 'open' ? 'تاريخي بداية ونهاية صحيحين' : 'عدد أشهر متبقية أكبر من صفر'}.</p>
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
    </div>
  );
}
