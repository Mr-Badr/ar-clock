"use client";

import { useState } from 'react';
import { Info, Share as ShareIcon, Warning } from '@phosphor-icons/react';
import { toast } from 'sonner';
import CountryFlag from '@/components/shared/CountryFlag';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  calculateQatarDomesticWorkerCost,
  QATAR_NATIONALITY_CAPS,
  QATAR_DEFAULT_MIN_WAGE,
  QATAR_DEFAULT_ADMIN_FEE,
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
  return `${new Intl.NumberFormat('ar-QA-u-nu-latn', { maximumFractionDigits: 0 }).format(value)} ر.ق`;
}

const CONTRACT_YEAR_OPTIONS = [
  { value: '1', title: 'سنة واحدة', description: 'عقد قصير' },
  { value: '2', title: 'سنتان', description: 'المدة الأكثر شيوعاً' },
  { value: '3', title: '3 سنوات', description: 'عقد ممتد' },
];

export default function QatarDomesticWorkerCostCalculator() {
  const [nationality, setNationality] = useState('philippines');
  const [monthlySalary, setMonthlySalary] = useState(String(QATAR_DEFAULT_MIN_WAGE));
  const [recruitmentFee, setRecruitmentFee] = useState(String(QATAR_NATIONALITY_CAPS.philippines.cap));
  const [adminFee, setAdminFee] = useState(String(QATAR_DEFAULT_ADMIN_FEE));
  const [contractYears, setContractYears] = useState('2');

  function selectNationality(key) {
    setNationality(key);
    setRecruitmentFee(String(QATAR_NATIONALITY_CAPS[key].cap));
  }

  const result = calculateQatarDomesticWorkerCost({ monthlySalary, recruitmentFee, adminFee, contractYears });

  const shareText = result.isValid
    ? `حاسبة تكلفة استقدام عاملة منزلية في قطر\nمدة العقد: ${result.contractYears} سنة\nالتكلفة الإجمالية: ${formatMoney(result.grandTotal)}\nتكلفة السنة الأولى: ${formatMoney(result.firstYearCost)}`
    : '';

  async function shareResult() {
    if (navigator.share) {
      try {
        await navigator.share({ title: 'حاسبة تكلفة استقدام عاملة منزلية — قطر', text: shareText });
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
    <div aria-label="حاسبة تكلفة استقدام عاملة منزلية في قطر">
      <div className="tool-v2-panel-head">
        <span className="tool-v2-country-badge"><CountryFlag code="qa" label="قطر" /> قطر <span className="tool-v2-live-dot" aria-hidden="true" /></span>
      </div>

      <div className="tool-v2-field">
        <label>
          جنسية العاملة/العامل
          <FieldHint text="السقف الأقصى الرسمي لرسوم الاستقدام يختلف حسب الجنسية وفق قرار وزارة التجارة والصناعة رقم 1 لسنة 2022 — اختيارك يملأ الحقل التالي تلقائياً بالسقف الرسمي، وتقدر تعدّله." />
        </label>
        <div className="guide-v2-checker-options" role="group" aria-label="الجنسية">
          {Object.entries(QATAR_NATIONALITY_CAPS).map(([key, n]) => (
            <button key={key} type="button" className={`guide-v2-checker-chip${nationality === key ? ' is-active' : ''}`} aria-pressed={nationality === key} onClick={() => selectNationality(key)}>
              {n.label}
            </button>
          ))}
        </div>
      </div>

      <div className="tool-v2-field">
        <label htmlFor="dwq-recruitment">رسوم الاستقدام (ر.ق) — السقف الرسمي الأقصى معبّأ تلقائياً</label>
        <input id="dwq-recruitment" type="number" inputMode="decimal" value={recruitmentFee} onChange={(e) => setRecruitmentFee(e.target.value)} />
      </div>

      <div className="tool-v2-field-row-pair">
        <div className="tool-v2-field">
          <label htmlFor="dwq-salary">الراتب الشهري (ر.ق)</label>
          <input id="dwq-salary" type="number" inputMode="decimal" value={monthlySalary} onChange={(e) => setMonthlySalary(e.target.value)} placeholder={String(QATAR_DEFAULT_MIN_WAGE)} />
        </div>
        <div className="tool-v2-field">
          <label htmlFor="dwq-admin">
            رسوم إدارية إضافية (ر.ق)
            <FieldHint text="رسوم معالجة/إدارية تقديرية، بلا جدول حكومي مباشر مؤكد — عدّلها حسب عرضك الفعلي." />
          </label>
          <input id="dwq-admin" type="number" inputMode="decimal" value={adminFee} onChange={(e) => setAdminFee(e.target.value)} placeholder={String(QATAR_DEFAULT_ADMIN_FEE)} />
        </div>
      </div>

      <div className="tool-v2-field">
        <label>مدة العقد</label>
        <div className="tool-v2-option-list">
          {CONTRACT_YEAR_OPTIONS.map((opt) => (
            <label key={opt.value} className={`tool-v2-option-row${contractYears === opt.value ? ' is-active' : ''}`} htmlFor={`dwq-years-${opt.value}`}>
              <input type="radio" id={`dwq-years-${opt.value}`} name="dwq-years" checked={contractYears === opt.value} onChange={() => setContractYears(opt.value)} />
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
            <span>رسوم الاستقدام (سقف رسمي): <strong>{formatMoney(result.recruitmentFee)}</strong></span>
            <span>رسوم إدارية: <strong>{formatMoney(result.adminFee)}</strong></span>
            <span>إجمالي الراتب لكامل المدة: <strong>{formatMoney(result.totalSalaryCost)}</strong></span>
          </div>
          <div className="tool-v2-note-strip">
            <Warning size={14} weight="fill" />
            <span>
              رسوم الاستقدام هنا هي السقف الأقصى الرسمي المسموح به قانوناً لكل جنسية — السعر الفعلي
              الذي تدفعه قد يكون أقل. لا يوجد حد أدنى دخل رسمي منشور لكفالة عاملة منزلية في قطر.
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
