"use client";

import { useState } from 'react';
import { Info, Share as ShareIcon, Warning } from '@phosphor-icons/react';
import { toast } from 'sonner';
import CountryFlag from '@/components/shared/CountryFlag';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { calculateUaeDomesticWorkerCost, UAE_DEFAULT_PACKAGE_FEE } from '@/lib/calculators/domestic-worker-engine';

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
  return `${new Intl.NumberFormat('ar-AE-u-nu-latn', { maximumFractionDigits: 0 }).format(value)} د.إ.`;
}

const CONTRACT_YEAR_OPTIONS = [
  { value: '1', title: 'سنة واحدة', description: 'عقد قصير' },
  { value: '2', title: 'سنتان', description: 'المدة الأكثر شيوعاً' },
  { value: '3', title: '3 سنوات', description: 'عقد ممتد' },
];

export default function UaeDomesticWorkerCostCalculator() {
  const [monthlySalary, setMonthlySalary] = useState('1600');
  const [packageFee, setPackageFee] = useState(String(UAE_DEFAULT_PACKAGE_FEE));
  const [contractYears, setContractYears] = useState('2');

  const result = calculateUaeDomesticWorkerCost({ monthlySalary, packageFee, contractYears });

  const shareText = result.isValid
    ? `حاسبة تكلفة استقدام عاملة منزلية في الإمارات\nمدة العقد: ${result.contractYears} سنة\nالتكلفة الإجمالية: ${formatMoney(result.grandTotal)}\nتكلفة السنة الأولى: ${formatMoney(result.firstYearCost)}`
    : '';

  async function shareResult() {
    if (navigator.share) {
      try {
        await navigator.share({ title: 'حاسبة تكلفة استقدام عاملة منزلية — الإمارات', text: shareText });
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
    <div aria-label="حاسبة تكلفة استقدام عاملة منزلية في الإمارات">
      <div className="tool-v2-panel-head">
        <span className="tool-v2-country-badge"><CountryFlag code="ae" label="الإمارات" /> الإمارات <span className="tool-v2-live-dot" aria-hidden="true" /></span>
      </div>

      <div className="tool-v2-field">
        <label htmlFor="dwu-salary">الراتب الشهري المتفق عليه (د.إ.)</label>
        <input id="dwu-salary" type="number" inputMode="decimal" value={monthlySalary} onChange={(e) => setMonthlySalary(e.target.value)} placeholder="1600" />
      </div>

      <div className="tool-v2-field">
        <label htmlFor="dwu-package">
          رسوم مركز تدبير / المكتب الخاص (د.إ.)
          <FieldHint text="هذا الرقم يشمل عادة تأشيرة العمل والتأمين والخدمات الإدارية، ويختلف فعلياً حسب المركز والجنسية والموسم — لا رقم حكومي رسمي ثابت له، فتحقق من عرض السعر الفعلي الذي تلقيته." />
        </label>
        <input id="dwu-package" type="number" inputMode="decimal" value={packageFee} onChange={(e) => setPackageFee(e.target.value)} placeholder={String(UAE_DEFAULT_PACKAGE_FEE)} />
      </div>

      <div className="tool-v2-field">
        <label>مدة العقد</label>
        <div className="tool-v2-option-list">
          {CONTRACT_YEAR_OPTIONS.map((opt) => (
            <label key={opt.value} className={`tool-v2-option-row${contractYears === opt.value ? ' is-active' : ''}`} htmlFor={`dwu-years-${opt.value}`}>
              <input type="radio" id={`dwu-years-${opt.value}`} name="dwu-years" checked={contractYears === opt.value} onChange={() => setContractYears(opt.value)} />
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
            <span>الرسوم الحكومية الثابتة (تأشيرة عامة): <strong>{formatMoney(result.oneTimeGovFee)}</strong></span>
            <span>رسوم مركز تدبير/المكتب: <strong>{formatMoney(result.packageFee)}</strong></span>
            <span>إجمالي الراتب لكامل المدة: <strong>{formatMoney(result.totalSalaryCost)}</strong></span>
          </div>
          <div className="tool-v2-note-strip">
            <Warning size={14} weight="fill" />
            <span>
              الرسوم الحكومية (300 درهم) مصدرها رسوم التأشيرة الاتحادية العامة عبر ICP — رسم مركز
              تدبير/المكتب تقديري وقابل للتعديل الكامل، تحقق من عرض السعر الفعلي لديك.
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
