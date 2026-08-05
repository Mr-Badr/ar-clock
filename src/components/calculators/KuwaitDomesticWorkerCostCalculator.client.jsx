"use client";

import { useState } from 'react';
import { Info, Share as ShareIcon, Warning } from '@phosphor-icons/react';
import { toast } from 'sonner';
import CountryFlag from '@/components/shared/CountryFlag';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  calculateKuwaitDomesticWorkerCost,
  KUWAIT_DEFAULT_MIN_WAGE,
  KUWAIT_DEFAULT_RECRUITMENT_FEE,
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
  return `${new Intl.NumberFormat('ar-KW-u-nu-latn', { maximumFractionDigits: 1 }).format(value)} د.ك`;
}

const CONTRACT_YEAR_OPTIONS = [
  { value: '1', title: 'سنة واحدة', description: 'عقد قصير' },
  { value: '2', title: 'سنتان', description: 'المدة الأكثر شيوعاً' },
  { value: '3', title: '3 سنوات', description: 'عقد ممتد' },
];

export default function KuwaitDomesticWorkerCostCalculator() {
  const [monthlySalary, setMonthlySalary] = useState(String(KUWAIT_DEFAULT_MIN_WAGE));
  const [recruitmentFee, setRecruitmentFee] = useState(String(KUWAIT_DEFAULT_RECRUITMENT_FEE));
  const [contractYears, setContractYears] = useState('2');

  const result = calculateKuwaitDomesticWorkerCost({ monthlySalary, recruitmentFee, contractYears });

  const shareText = result.isValid
    ? `حاسبة تكلفة استقدام عاملة منزلية في الكويت\nمدة العقد: ${result.contractYears} سنة\nالتكلفة الإجمالية: ${formatMoney(result.grandTotal)}\nتكلفة السنة الأولى: ${formatMoney(result.firstYearCost)}`
    : '';

  async function shareResult() {
    if (navigator.share) {
      try {
        await navigator.share({ title: 'حاسبة تكلفة استقدام عاملة منزلية — الكويت', text: shareText });
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
    <div aria-label="حاسبة تكلفة استقدام عاملة منزلية في الكويت">
      <div className="tool-v2-panel-head">
        <span className="tool-v2-country-badge"><CountryFlag code="kw" label="الكويت" /> الكويت <span className="tool-v2-live-dot" aria-hidden="true" /></span>
      </div>

      <div className="tool-v2-field">
        <label htmlFor="dwk-salary">
          الراتب الشهري المتفق عليه (د.ك)
          <FieldHint text="الحد الأدنى المتداول للأجر وفق قرار وزاري سابق هو 75 د.ك — القيمة هنا افتراضية وقابلة للتعديل الكامل حسب اتفاقك الفعلي." />
        </label>
        <input id="dwk-salary" type="number" inputMode="decimal" value={monthlySalary} onChange={(e) => setMonthlySalary(e.target.value)} placeholder={String(KUWAIT_DEFAULT_MIN_WAGE)} />
      </div>

      <div className="tool-v2-field">
        <label htmlFor="dwk-recruitment">
          رسوم مكتب الاستقدام (د.ك)
          <FieldHint text="لا يوجد جدول رسوم حكومي موحّد لمكاتب الاستقدام الخاصة — النطاق الشائع تقديرياً بين 700 و1,500 دينار، يختلف حسب المكتب والجنسية. أدخل الرقم من عرضك الفعلي." />
        </label>
        <input id="dwk-recruitment" type="number" inputMode="decimal" value={recruitmentFee} onChange={(e) => setRecruitmentFee(e.target.value)} placeholder={String(KUWAIT_DEFAULT_RECRUITMENT_FEE)} />
      </div>

      <div className="tool-v2-field">
        <label>مدة العقد</label>
        <div className="tool-v2-option-list">
          {CONTRACT_YEAR_OPTIONS.map((opt) => (
            <label key={opt.value} className={`tool-v2-option-row${contractYears === opt.value ? ' is-active' : ''}`} htmlFor={`dwk-years-${opt.value}`}>
              <input type="radio" id={`dwk-years-${opt.value}`} name="dwk-years" checked={contractYears === opt.value} onChange={() => setContractYears(opt.value)} />
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
            <span>رسم نقل الكفالة عبر منصة أشال: <strong>{formatMoney(result.oneTimeGovFee)}</strong></span>
            <span>رسوم مكتب الاستقدام: <strong>{formatMoney(result.recruitmentFee)}</strong></span>
            <span>إجمالي الراتب لكامل المدة: <strong>{formatMoney(result.totalSalaryCost)}</strong></span>
          </div>
          <div className="tool-v2-note-strip">
            <Warning size={14} weight="fill" />
            <span>
              رسم نقل الكفالة (150 د.ك) ورسوم المكتب تقديرية من مصادر عامة، وليست جدول رسوم رسمياً
              مؤكداً من الهيئة العامة للقوى العاملة — تحقق من عرضك الفعلي قبل الالتزام.
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
