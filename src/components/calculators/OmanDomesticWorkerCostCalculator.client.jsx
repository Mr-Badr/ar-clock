"use client";

import { useState } from 'react';
import { Info, Share as ShareIcon, Warning } from '@phosphor-icons/react';
import { toast } from 'sonner';
import CountryFlag from '@/components/shared/CountryFlag';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  calculateOmanDomesticWorkerCost,
  OMAN_PERMIT_FEES,
  OMAN_DEFAULT_SALARY,
} from '@/lib/calculators/domestic-worker-engine';

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
  return `${new Intl.NumberFormat('ar-OM-u-nu-latn', { maximumFractionDigits: 1 }).format(value)} ر.ع`;
}

const CONTRACT_YEAR_OPTIONS = [
  { value: '1', title: 'سنة واحدة', description: 'عقد قصير' },
  { value: '2', title: 'سنتان', description: 'المدة الأكثر شيوعاً' },
  { value: '3', title: '3 سنوات', description: 'عقد ممتد' },
];

export default function OmanDomesticWorkerCostCalculator() {
  const [monthlySalary, setMonthlySalary] = useState(String(OMAN_DEFAULT_SALARY));
  const [recruitmentFee, setRecruitmentFee] = useState('0');
  const [workerTier, setWorkerTier] = useState('upTo3');
  const [contractYears, setContractYears] = useState('2');

  const result = calculateOmanDomesticWorkerCost({ monthlySalary, recruitmentFee, workerTier, contractYears });

  const shareText = result.isValid
    ? `حاسبة تكلفة استقدام عاملة منزلية في عُمان\nمدة العقد: ${result.contractYears} سنة\nالتكلفة الإجمالية: ${formatMoney(result.grandTotal)}\nتكلفة السنة الأولى: ${formatMoney(result.firstYearCost)}`
    : '';

  async function shareResult() {
    if (navigator.share) {
      try {
        await navigator.share({ title: 'حاسبة تكلفة استقدام عاملة منزلية — عُمان', text: shareText });
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
    <div aria-label="حاسبة تكلفة استقدام عاملة منزلية في عُمان">
      <div className="tool-v2-panel-head">
        <span className="tool-v2-country-badge"><CountryFlag code="om" label="عُمان" /> عُمان <span className="tool-v2-live-dot" aria-hidden="true" /></span>
      </div>

      <div className="tool-v2-field">
        <label>
          عدد العمال المنزليين الحاليين لديك
          <FieldHint text="رسم إصدار التصريح الرسمي من وزارة العمل يختلف حسب هذا الرقم تحديداً، لا حسب مدة العقد." />
        </label>
        <div className="tool-v2-option-list">
          {Object.entries(OMAN_PERMIT_FEES).map(([key, p]) => (
            <label key={key} className={`tool-v2-option-row${workerTier === key ? ' is-active' : ''}`} htmlFor={`dwo-tier-${key}`}>
              <input type="radio" id={`dwo-tier-${key}`} name="dwo-tier" checked={workerTier === key} onChange={() => setWorkerTier(key)} />
              <span>{p.label}<span className="tool-v2-option-hint">رسم التصريح: {formatMoney(p.fee)}</span></span>
            </label>
          ))}
        </div>
      </div>

      <div className="tool-v2-field">
        <label htmlFor="dwo-salary">
          الراتب الشهري المتفق عليه (ر.ع)
          <FieldHint text="لا يوجد حد أدنى رسمي منشور — النطاق الشائع تقديرياً بين 500 و1,000 ريال عماني." />
        </label>
        <input id="dwo-salary" type="number" inputMode="decimal" value={monthlySalary} onChange={(e) => setMonthlySalary(e.target.value)} placeholder={String(OMAN_DEFAULT_SALARY)} />
      </div>

      <div className="tool-v2-field">
        <label htmlFor="dwo-recruitment">رسوم مكتب استقدام إضافية (ر.ع — اختياري)</label>
        <input id="dwo-recruitment" type="number" inputMode="decimal" value={recruitmentFee} onChange={(e) => setRecruitmentFee(e.target.value)} placeholder="0" />
      </div>

      <div className="tool-v2-field">
        <label>مدة العقد</label>
        <div className="tool-v2-option-list">
          {CONTRACT_YEAR_OPTIONS.map((opt) => (
            <label key={opt.value} className={`tool-v2-option-row${contractYears === opt.value ? ' is-active' : ''}`} htmlFor={`dwo-years-${opt.value}`}>
              <input type="radio" id={`dwo-years-${opt.value}`} name="dwo-years" checked={contractYears === opt.value} onChange={() => setContractYears(opt.value)} />
              <span>{opt.title}<span className="tool-v2-option-hint">{opt.description}</span></span>
            </label>
          ))}
        </div>
      </div>

      {result.isValid ? (
        <div aria-live="polite">
          <div className="tool-v2-result-hero">
            <div className="tool-v2-result-label">التكلفة الإجمالية التقديرية لمدة {result.contractYears} سنة</div>
            <div className="tool-v2-result-value">{formatMoney(result.grandTotal)}</div>
            <div className="tool-v2-result-meta">تكلفة السنة الأولى فقط: {formatMoney(result.firstYearCost)}</div>
          </div>
          <div className="tool-v2-result-breakdown">
            <span>رسم إصدار تصريح العمل (وزارة العمل): <strong>{formatMoney(result.permitFee)}</strong></span>
            {result.recruitmentFee > 0 ? <span>رسوم مكتب استقدام إضافية: <strong>{formatMoney(result.recruitmentFee)}</strong></span> : null}
            <span>إجمالي الراتب لكامل المدة: <strong>{formatMoney(result.totalSalaryCost)}</strong></span>
          </div>
          <div className="tool-v2-note-strip">
            <Warning size={14} weight="fill" />
            <span>
              رسم التصريح مؤكد رسمياً من وزارة العمل العُمانية. راجع mol.gov.om مباشرة لتأكيد مدة
              صلاحية التصريح وأي رسوم تجديد قبل الاعتماد على هذا الرقم في قرار مالي نهائي.
            </span>
          </div>
        </div>
      ) : (
        <div className="tool-v2-empty-state">
          <Warning size={28} weight="duotone" />
          <p>أدخل راتباً شهرياً أكبر من صفر.</p>
        </div>
      )}

      <div className="tool-v2-action-row">
        <button type="button" className="tool-v2-action-btn is-primary" onClick={shareResult} disabled={!result.isValid}>
          <ShareIcon size={18} weight="bold" /> مشاركة
        </button>
      </div>
    </div>
  );
}
