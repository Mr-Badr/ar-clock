"use client";

import { useState } from 'react';
import { Info, Share as ShareIcon, Warning } from '@phosphor-icons/react';
import { toast } from 'sonner';
import CountryFlag from '@/components/shared/CountryFlag';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { calculateBahrainDomesticWorkerCost, BAHRAIN_PERMIT_FEES } from '@/lib/calculators/domestic-worker-engine';

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
  return `${new Intl.NumberFormat('ar-BH-u-nu-latn', { maximumFractionDigits: 1 }).format(value)} د.ب`;
}

export default function BahrainDomesticWorkerCostCalculator() {
  const [monthlySalary, setMonthlySalary] = useState('120');
  const [recruitmentFee, setRecruitmentFee] = useState('0');
  const [permitKey, setPermitKey] = useState('new2');

  const result = calculateBahrainDomesticWorkerCost({ monthlySalary, recruitmentFee, permitKey });

  const shareText = result.isValid
    ? `حاسبة تكلفة استقدام عاملة منزلية في البحرين\n${result.permit.label}\nالتكلفة الإجمالية: ${formatMoney(result.grandTotal)}`
    : '';

  async function shareResult() {
    if (navigator.share) {
      try {
        await navigator.share({ title: 'حاسبة تكلفة استقدام عاملة منزلية — البحرين', text: shareText });
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
    <div aria-label="حاسبة تكلفة استقدام عاملة منزلية في البحرين">
      <div className="tool-v2-panel-head">
        <span className="tool-v2-country-badge"><CountryFlag code="bh" label="البحرين" /> البحرين <span className="tool-v2-live-dot" aria-hidden="true" /></span>
      </div>

      <div className="tool-v2-field">
        <label>
          نوع الطلب ومدته
          <FieldHint text="جدول رسوم تصريح العمل الرسمي من هيئة تنظيم سوق العمل LMRA، محدَّث 23-01-2025 — رسم شامل حسب المدة، لا رسماً سنوياً منفصلاً." />
        </label>
        <div className="tool-v2-option-list">
          {Object.entries(BAHRAIN_PERMIT_FEES).map(([key, p]) => (
            <label key={key} className={`tool-v2-option-row${permitKey === key ? ' is-active' : ''}`} htmlFor={`dwb-permit-${key}`}>
              <input type="radio" id={`dwb-permit-${key}`} name="dwb-permit" checked={permitKey === key} onChange={() => setPermitKey(key)} />
              <span>{p.label}<span className="tool-v2-option-hint">{formatMoney(p.fee)}</span></span>
            </label>
          ))}
        </div>
      </div>

      <div className="tool-v2-field">
        <label htmlFor="dwb-salary">الراتب الشهري المتفق عليه (د.ب)</label>
        <input id="dwb-salary" type="number" inputMode="decimal" value={monthlySalary} onChange={(e) => setMonthlySalary(e.target.value)} placeholder="120" />
      </div>

      <div className="tool-v2-field">
        <label htmlFor="dwb-recruitment">
          رسوم مكتب استقدام إضافية (د.ب — اختياري)
          <FieldHint text="إن تعاملت مع مكتب استقدام خاص فوق رسوم تصريح العمل الرسمية، أضف رسومه هنا — لا جدول رسمي موحّد لهذا البند." />
        </label>
        <input id="dwb-recruitment" type="number" inputMode="decimal" value={recruitmentFee} onChange={(e) => setRecruitmentFee(e.target.value)} placeholder="0" />
      </div>

      {result.isValid ? (
        <div aria-live="polite">
          <div className="tool-v2-result-hero">
            <div className="tool-v2-result-label">التكلفة الإجمالية التقديرية — {result.permit.label}</div>
            <div className="tool-v2-result-value">{formatMoney(result.grandTotal)}</div>
            <div className="tool-v2-result-meta">تكلفة السنة الأولى فقط: {formatMoney(result.firstYearCost)}</div>
          </div>
          <div className="tool-v2-result-breakdown">
            <span>رسم تصريح العمل الرسمي (LMRA): <strong>{formatMoney(result.permitFee)}</strong></span>
            {result.recruitmentFee > 0 ? <span>رسوم مكتب استقدام إضافية: <strong>{formatMoney(result.recruitmentFee)}</strong></span> : null}
            <span>إجمالي الراتب لمدة الطلب: <strong>{formatMoney(result.totalSalaryCost)}</strong></span>
          </div>
          <div className="tool-v2-note-strip">
            <Warning size={14} weight="fill" />
            <span>
              رسوم التصريح مؤكدة رسمياً من LMRA. لا يوجد حد أدنى دخل ثابت منشور رسمياً لكفالة عاملة
              منزلية في البحرين — إثبات الدخل (شهادة راتب أو كشف حساب) مطلوب دون رقم أدنى محدد.
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
