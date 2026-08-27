"use client";

import { useMemo, useState } from 'react';
import { Info } from '@phosphor-icons/react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { fmt } from '@/lib/calculators/building/constants';

// Real official EU fee schedule — verified via direct WebFetch of home-affairs.ec.europa.eu,
// 2026-08-25 (effective 11 June 2024, still current). Most Arabic-language sources found during
// research still cite the OLD €80 fee — this is the current, correct number.
const ADULT_FEE_EUR = 90;
const CHILD_6_TO_11_FEE_EUR = 45;
// Under 6: free — confirmed across multiple independent sources during research.

// Visa application center service fees (VFS Global/TLScontact — the outsourced centers Gulf
// applicants actually go through, since embassies rarely accept direct applications) are real but
// genuinely variable by country/center — never asserted as one fixed number, shown as an
// editable, honestly-labeled estimate range instead of a fabricated single fee.
const DEFAULT_SERVICE_FEE_EUR = 40;

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

export default function SchengenVisaCostCalculator() {
  const [adults, setAdults] = useState(1);
  const [children6to11, setChildren6to11] = useState(0);
  const [childrenUnder6, setChildrenUnder6] = useState(0);
  const [includeServiceFee, setIncludeServiceFee] = useState(true);
  const [serviceFeePerPerson, setServiceFeePerPerson] = useState(String(DEFAULT_SERVICE_FEE_EUR));

  const effectiveAdults = Math.max(0, Math.round(Number(adults) || 0));
  const effectiveChildren611 = Math.max(0, Math.round(Number(children6to11) || 0));
  const effectiveChildrenUnder6 = Math.max(0, Math.round(Number(childrenUnder6) || 0));
  const effectiveServiceFee = Math.max(0, Number(serviceFeePerPerson) || 0);

  const result = useMemo(() => {
    const totalApplicants = effectiveAdults + effectiveChildren611 + effectiveChildrenUnder6;
    const officialFee = effectiveAdults * ADULT_FEE_EUR + effectiveChildren611 * CHILD_6_TO_11_FEE_EUR;
    const serviceFeeTotal = includeServiceFee ? totalApplicants * effectiveServiceFee : 0;
    const total = officialFee + serviceFeeTotal;
    return { totalApplicants, officialFee, serviceFeeTotal, total };
  }, [effectiveAdults, effectiveChildren611, effectiveChildrenUnder6, includeServiceFee, effectiveServiceFee]);

  return (
    <div aria-label="حاسبة تكلفة تأشيرة شنغن">
      <div className="tool-v2-panel-head">
        <span className="tool-v2-country-badge">
          <span className="tool-v2-live-dot" aria-hidden="true" />
          يورو (رسم رسمي موحد لكل دول شنغن)
        </span>
      </div>

      <div className="tool-v2-field">
        <label htmlFor="sv-adults">عدد البالغين (90 يورو لكل شخص)</label>
        <div id="sv-adults" className="tool-v2-stepper" role="group" aria-label="عدد البالغين">
          <button type="button" className="tool-v2-stepper-btn" onClick={() => setAdults((v) => Math.max(0, v - 1))} aria-label="تقليل">−</button>
          <span className="tool-v2-stepper-val">{adults}</span>
          <button type="button" className="tool-v2-stepper-btn" onClick={() => setAdults((v) => Math.min(20, v + 1))} aria-label="زيادة">+</button>
        </div>
      </div>

      <div className="tool-v2-field">
        <label htmlFor="sv-children-611">
          الأطفال من 6 إلى 11 سنة (45 يورو لكل طفل)
          <FieldHint text="الأطفال من عمر 6 سنوات وحتى ما دون 12 سنة يدفعون نصف الرسم الرسمي." />
        </label>
        <div id="sv-children-611" className="tool-v2-stepper" role="group" aria-label="عدد الأطفال من 6 الى 11">
          <button type="button" className="tool-v2-stepper-btn" onClick={() => setChildren6to11((v) => Math.max(0, v - 1))} aria-label="تقليل">−</button>
          <span className="tool-v2-stepper-val">{children6to11}</span>
          <button type="button" className="tool-v2-stepper-btn" onClick={() => setChildren6to11((v) => Math.min(20, v + 1))} aria-label="زيادة">+</button>
        </div>
      </div>

      <div className="tool-v2-field">
        <label htmlFor="sv-children-under6">
          الأطفال أقل من 6 سنوات (مجاناً)
          <FieldHint text="الأطفال دون سن السادسة معفون تماماً من الرسم الرسمي." />
        </label>
        <div id="sv-children-under6" className="tool-v2-stepper" role="group" aria-label="عدد الأطفال أقل من 6 سنوات">
          <button type="button" className="tool-v2-stepper-btn" onClick={() => setChildrenUnder6((v) => Math.max(0, v - 1))} aria-label="تقليل">−</button>
          <span className="tool-v2-stepper-val">{childrenUnder6}</span>
          <button type="button" className="tool-v2-stepper-btn" onClick={() => setChildrenUnder6((v) => Math.min(20, v + 1))} aria-label="زيادة">+</button>
        </div>
      </div>

      <div className="tool-v2-field">
        <label htmlFor="sv-service-toggle" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <input id="sv-service-toggle" type="checkbox" checked={includeServiceFee} onChange={(e) => setIncludeServiceFee(e.target.checked)} />
          إضافة رسوم مركز التأشيرات (VFS/TLS) — التكلفة الحقيقية الفعلية
        </label>
        {includeServiceFee ? (
          <input type="number" inputMode="decimal" min="0" step="5" value={serviceFeePerPerson} onChange={(e) => setServiceFeePerPerson(e.target.value)} aria-label="رسم مركز التأشيرات لكل شخص باليورو" style={{ marginTop: 'var(--space-2)' }} />
        ) : null}
      </div>

      <div aria-live="polite">
        <div className="tool-v2-result-hero">
          <span className="tool-v2-result-label">إجمالي التكلفة التقديرية ({fmt(result.totalApplicants)} أشخاص)</span>
          <div className="tool-v2-result-stat-row">
            <span className="tool-v2-result-stat">
              <span className="tool-v2-result-stat-value">€{fmt(result.total)}</span>
              <span className="tool-v2-result-stat-label">يورو</span>
            </span>
          </div>
        </div>

        <div className="tool-v2-breakdown-list">
          <div className="tool-v2-breakdown-row">
            <span className="tool-v2-breakdown-label">الرسم الرسمي لسفارات دول شنغن</span>
            <span className="tool-v2-breakdown-value">€{fmt(result.officialFee)}</span>
          </div>
          {includeServiceFee ? (
            <div className="tool-v2-breakdown-row">
              <span className="tool-v2-breakdown-label">رسوم مركز التأشيرات (تقديري)</span>
              <span className="tool-v2-breakdown-value">€{fmt(result.serviceFeeTotal)}</span>
            </div>
          ) : null}
        </div>

        <div className="tool-v2-note-strip">
          <Info size={15} weight="fill" />
          <span>الرسم الرسمي (90/45 يورو) موحد وثابت في كل سفارات دول شنغن. أما رسوم مركز التأشيرات فتختلف فعلياً حسب الدولة والمركز — الرقم هنا تقديري قابل للتعديل، تحقق من الرسم الفعلي عند مركز التأشيرات الذي ستقدم من خلاله.</span>
        </div>
      </div>
    </div>
  );
}
