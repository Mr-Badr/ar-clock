"use client";

import { useMemo, useState } from 'react';
import { Info, Share as ShareIcon, Warning } from '@phosphor-icons/react';
import { toast } from 'sonner';
import CountryFlag from '@/components/shared/CountryFlag';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  calculateDomesticWorkerCost,
  formatCurrency,
} from '@/lib/calculators/engine';

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

const CONTRACT_YEAR_OPTIONS = [
  { value: '1', title: 'سنة واحدة', description: 'عقد قصير' },
  { value: '2', title: 'سنتان', description: 'المدة الأكثر شيوعاً' },
  { value: '3', title: '3 سنوات', description: 'عقد ممتد' },
];

export default function DomesticWorkerCostTool() {
  const [monthlySalary, setMonthlySalary] = useState('1500');
  const [recruitmentOfficeFee, setRecruitmentOfficeFee] = useState('9000');
  const [contractYears, setContractYears] = useState('2');

  const formatMoney = (v) => formatCurrency(v, 'SAR');

  const result = useMemo(
    () => calculateDomesticWorkerCost({ monthlySalary, recruitmentOfficeFee, contractYears }),
    [monthlySalary, recruitmentOfficeFee, contractYears],
  );

  const shareText = result.isValid
    ? `حاسبة تكلفة استقدام عاملة منزلية في السعودية\nمدة العقد: ${result.contractYears} سنة\nالتكلفة الإجمالية: ${formatMoney(result.grandTotal)}\nتكلفة السنة الأولى: ${formatMoney(result.firstYearCost)}`
    : '';

  async function shareResult() {
    if (navigator.share) {
      try {
        await navigator.share({ title: 'حاسبة تكلفة استقدام عاملة منزلية — السعودية', text: shareText });
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
    <div aria-label="حاسبة تكلفة استقدام عاملة منزلية في السعودية">
      <div className="tool-v2-panel-head">
        <span className="tool-v2-country-badge"><CountryFlag code="sa" label="السعودية" /> السعودية — منصة مساند <span className="tool-v2-live-dot" aria-hidden="true" /></span>
      </div>

      <div className="tool-v2-field">
        <label htmlFor="dwc-salary">الراتب الشهري المتفق عليه (ريال)</label>
        <input id="dwc-salary" type="number" inputMode="decimal" value={monthlySalary} onChange={(e) => setMonthlySalary(e.target.value)} placeholder="1500" />
        <p className="tool-v2-field-hint">الراتب الشهري لا يشمله صاحب العمل في الخصم — القيمة كما ورد في العقد.</p>
      </div>

      <div className="tool-v2-field">
        <label htmlFor="dwc-office-fee">
          رسوم مكتب الاستقدام (ريال)
          <FieldHint text="أدخل الرقم الفعلي من عرض السعر الذي تلقيته — يشمل عادة تأمين العقد لدى مساند، ويختلف حسب المكتب والجنسية." />
        </label>
        <input id="dwc-office-fee" type="number" inputMode="decimal" value={recruitmentOfficeFee} onChange={(e) => setRecruitmentOfficeFee(e.target.value)} placeholder="9000" />
      </div>

      <div className="tool-v2-field">
        <label>مدة العقد</label>
        <div className="tool-v2-option-list">
          {CONTRACT_YEAR_OPTIONS.map((opt) => (
            <label key={opt.value} className={`tool-v2-option-row${contractYears === opt.value ? ' is-active' : ''}`} htmlFor={`dwc-years-${opt.value}`}>
              <input type="radio" id={`dwc-years-${opt.value}`} name="dwc-years" checked={contractYears === opt.value} onChange={() => setContractYears(opt.value)} />
              <span>{opt.title}<span className="tool-v2-option-hint">{opt.description}</span></span>
            </label>
          ))}
        </div>
      </div>

      {result.isValid ? (
        <div aria-live="polite">
          <div className="tool-v2-result-hero">
            <div className="tool-v2-result-label">التكلفة الإجمالية لكامل مدة العقد ({result.contractYears} {result.contractYears === 1 ? 'سنة' : 'سنوات'})</div>
            <div className="tool-v2-result-value">{formatMoney(result.grandTotal)}</div>
            <div className="tool-v2-result-meta">≈ {formatMoney(result.monthlyEquivalent)} شهرياً — تكلفة السنة الأولى: {formatMoney(result.firstYearCost)}</div>
          </div>
          <div className="tool-v2-result-breakdown">
            <span>رسوم حكومية لمرة واحدة (تأشيرة + مساند): <strong>{formatMoney(result.oneTimeGovFees)}</strong></span>
            <span>رسوم حكومية سنوية (إقامة + تأمين) × {result.contractYears}: <strong>{formatMoney(result.totalAnnualGovFees)}</strong></span>
            <span>رسوم مكتب الاستقدام: <strong>{formatMoney(result.officeFee)}</strong></span>
            <span>إجمالي الراتب لكامل المدة: <strong>{formatMoney(result.totalSalaryCost)}</strong></span>
          </div>
          <div className="tool-v2-note-strip">
            <Warning size={14} weight="fill" />
            <span>جميع تكاليف الاستقدام تقع على صاحب العمل — لا يجوز تحميل العاملة أي جزء منها.</span>
          </div>
        </div>
      ) : (
        <div className="tool-v2-empty-state">
          <Warning size={28} weight="duotone" />
          <p>أدخل الراتب الشهري ورسوم مكتب الاستقدام لحساب التكلفة الإجمالية.</p>
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
