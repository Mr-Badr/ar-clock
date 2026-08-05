"use client";

import { useState } from 'react';
import { CheckCircle, Info, ListChecks, Users, Warning, Wheelchair, XCircle } from '@phosphor-icons/react';
import CountryFlag from '@/components/shared/CountryFlag';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  checkSaudiEligibility,
  checkKuwaitEligibility,
  REQUIREMENTS_CHECKLISTS,
} from '@/lib/calculators/domestic-worker-eligibility-engine';

const COUNTRIES = [
  { code: 'sa', label: 'السعودية' },
  { code: 'kw', label: 'الكويت' },
  { code: 'ae', label: 'الإمارات' },
  { code: 'qa', label: 'قطر' },
  { code: 'bh', label: 'البحرين' },
  { code: 'om', label: 'عُمان' },
];

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

function fmt(n) {
  return new Intl.NumberFormat('ar-SA-u-nu-latn').format(n);
}

// ── Saudi Arabia: real computed match against the official income/asset table ──────────────
function SaudiChecker() {
  const [sponsorType, setSponsorType] = useState('citizen');
  const [proofMethod, setProofMethod] = useState('salary');
  const [proofValue, setProofValue] = useState('10000');
  const [currentWorkers, setCurrentWorkers] = useState(0);

  const result = checkSaudiEligibility({ sponsorType, proofMethod, proofValue, currentWorkers });

  return (
    <div>
      <div className="tool-v2-field">
        <label>نوع مقدم الطلب</label>
        <div className="guide-v2-checker-options" role="group" aria-label="نوع مقدم الطلب">
          {[{ id: 'citizen', label: 'مواطن' }, { id: 'resident', label: 'مقيم' }, { id: 'disabled', label: 'من ذوي الإعاقة' }].map((o) => (
            <button key={o.id} type="button" className={`guide-v2-checker-chip${sponsorType === o.id ? ' is-active' : ''}`} aria-pressed={sponsorType === o.id} onClick={() => setSponsorType(o.id)}>{o.label}</button>
          ))}
        </div>
      </div>

      <div className="tool-v2-field">
        <label>طريقة إثبات القدرة المالية</label>
        <div className="guide-v2-checker-options" role="group" aria-label="طريقة الإثبات">
          <button type="button" className={`guide-v2-checker-chip${proofMethod === 'salary' ? ' is-active' : ''}`} aria-pressed={proofMethod === 'salary'} onClick={() => setProofMethod('salary')}>الراتب الشهري</button>
          <button type="button" className={`guide-v2-checker-chip${proofMethod === 'balance' ? ' is-active' : ''}`} aria-pressed={proofMethod === 'balance'} onClick={() => setProofMethod('balance')}>الرصيد البنكي</button>
        </div>
      </div>

      <div className="tool-v2-field">
        <label htmlFor="sa-elig-value">{proofMethod === 'balance' ? 'الرصيد البنكي (ريال)' : 'الراتب الشهري (ريال)'}</label>
        <input id="sa-elig-value" type="number" inputMode="decimal" value={proofValue} onChange={(e) => setProofValue(e.target.value)} />
      </div>

      <div className="tool-v2-field">
        <label htmlFor="sa-elig-current">
          عدد العمالة المنزلية لديك حالياً
          <FieldHint text="نحسب لك شروط التأشيرة التالية (الأولى، الثانية، أو الثالثة) بناءً على هذا الرقم." />
        </label>
        <div id="sa-elig-current" className="tool-v2-stepper" role="group" aria-label="عدد العمالة الحالية">
          <button type="button" className="tool-v2-stepper-btn" onClick={() => setCurrentWorkers((v) => Math.max(0, v - 1))} aria-label="تقليل">−</button>
          <span className="tool-v2-stepper-val">{currentWorkers}</span>
          <button type="button" className="tool-v2-stepper-btn" onClick={() => setCurrentWorkers((v) => Math.min(20, v + 1))} aria-label="زيادة">+</button>
        </div>
      </div>

      {result.resolved ? (
        <div className={`guide-v2-checker-result ${result.meets ? 'is-good' : 'is-bad'}`} aria-live="polite">
          <p className="guide-v2-checker-result-label">
            {result.meets ? <CheckCircle size={16} weight="fill" style={{ verticalAlign: 'middle' }} /> : <XCircle size={16} weight="fill" style={{ verticalAlign: 'middle' }} />}
            {' '}التأشيرة رقم {result.targetVisaNumber} ({result.category})
          </p>
          <p className="guide-v2-checker-result-value" style={{ fontSize: '1rem' }}>
            {result.meets
              ? `تستوفي الشرط المالي لهذه التأشيرة (الحد المطلوب: ${fmt(result.requiredValue)} ريال).`
              : `لا تستوفي الحد المطلوب حالياً (تحتاج ${fmt(result.requiredValue)} ريال ${proofMethod === 'balance' ? 'رصيداً' : 'راتباً'} على الأقل).`}
          </p>
          {result.needsExtraFee ? (
            <p className="guide-v2-checker-result-note">
              تنبيه: هذا العدد يتجاوز الحصة المجانية، سيُضاف رسم إضافي مؤكد رسمياً 9,600 ريال سنوياً لكل عامل إضافي وفق قرار مجلس الوزراء (09-03-2022).
            </p>
          ) : null}
          {result.tier?.note ? <p className="guide-v2-checker-result-note">{result.tier.note}</p> : null}
        </div>
      ) : (
        <div className="guide-v2-checker-result" aria-live="polite">
          <p className="guide-v2-checker-result-note" style={{ marginTop: 0 }}>{result.message}</p>
        </div>
      )}
    </div>
  );
}

// ── Kuwait: no financial requirement (confirmed) + family-size quota (reported, dated) ─────
function KuwaitChecker() {
  const [workerAge, setWorkerAge] = useState('30');
  const [familySize, setFamilySize] = useState(4);
  const [hasDisabledMember, setHasDisabledMember] = useState(false);
  const [currentWorkers, setCurrentWorkers] = useState(0);

  const result = checkKuwaitEligibility({ workerAge, familySize, hasDisabledMember, currentWorkers });

  return (
    <div>
      <div className="tool-v2-note-strip">
        <CheckCircle size={15} weight="fill" />
        <span>لا يشترط القانون الكويتي (68/2015) أي حد دخل أو رصيد بنكي على الكفيل — الشروط شخصية وإدارية فقط.</span>
      </div>

      <div className="tool-v2-field">
        <label htmlFor="kw-worker-age">
          عمر العامل/ة المطلوب استقدامه
          <FieldHint text="يحظر القانون استقدام أو تشغيل عامل منزلي عمره أقل من 21 أو أكثر من 60 سنة (المادة 21)." />
        </label>
        <input id="kw-worker-age" type="number" inputMode="numeric" value={workerAge} onChange={(e) => setWorkerAge(e.target.value)} />
      </div>

      <div className="tool-v2-field">
        <label htmlFor="kw-family-size">
          <Users size={14} weight="bold" style={{ verticalAlign: 'middle' }} /> عدد أفراد الأسرة
          <FieldHint text="يحدد هذا الرقم حصتك المسموحة من العمالة المنزلية وفق المادة 9 من اللائحة التنفيذية الجديدة (تقرير صحفي مؤرَّخ، غير مؤكد من نص رسمي مباشر بعد)." />
        </label>
        <div id="kw-family-size" className="tool-v2-stepper" role="group" aria-label="عدد أفراد الأسرة">
          <button type="button" className="tool-v2-stepper-btn" onClick={() => setFamilySize((v) => Math.max(1, v - 1))} aria-label="تقليل">−</button>
          <span className="tool-v2-stepper-val">{familySize}</span>
          <button type="button" className="tool-v2-stepper-btn" onClick={() => setFamilySize((v) => Math.min(20, v + 1))} aria-label="زيادة">+</button>
        </div>
      </div>

      <div className="tool-v2-field">
        <label className="tool-v2-addon-toggle" htmlFor="kw-disabled">
          <input id="kw-disabled" type="checkbox" checked={hasDisabledMember} onChange={(e) => setHasDisabledMember(e.target.checked)} />
          <Wheelchair size={16} weight="bold" />
          <span>يوجد فرد من ذوي الإعاقة في الأسرة (عامل إضافي واحد)</span>
        </label>
      </div>

      <div className="tool-v2-field">
        <label htmlFor="kw-current">عدد العمالة المنزلية لديك حالياً</label>
        <div id="kw-current" className="tool-v2-stepper" role="group" aria-label="عدد العمالة الحالية">
          <button type="button" className="tool-v2-stepper-btn" onClick={() => setCurrentWorkers((v) => Math.max(0, v - 1))} aria-label="تقليل">−</button>
          <span className="tool-v2-stepper-val">{currentWorkers}</span>
          <button type="button" className="tool-v2-stepper-btn" onClick={() => setCurrentWorkers((v) => Math.min(20, v + 1))} aria-label="زيادة">+</button>
        </div>
      </div>

      <div className={`guide-v2-checker-result ${result.ageOk ? 'is-good' : 'is-bad'}`} aria-live="polite">
        <p className="guide-v2-checker-result-label">{result.ageOk ? 'شرط العمر مستوفى' : 'شرط العمر غير مستوفى'}</p>
        {!result.ageOk ? <p className="guide-v2-checker-result-note">عمر العامل يجب أن يكون بين 21 و60 سنة وفق نص القانون.</p> : null}
        <p className="guide-v2-checker-result-value" style={{ fontSize: '1rem', marginTop: 8 }}>
          حصتك التقديرية: {result.quota} عمال منزليين — متبقٍ لك {result.remainingSlots} حسب عدد عمالك الحالي.
        </p>
        <p className="guide-v2-checker-result-note">هذه الحصة من تقرير صحفي كويتي مؤرَّخ (24 نوفمبر 2025) يستشهد بالمادة 9 من اللائحة التنفيذية الجديدة، وليست من نص رسمي مباشر بعد — تحقق من موي.gov.kw قبل اعتمادها نهائياً.</p>
      </div>
    </div>
  );
}

// ── UAE / Qatar / Bahrain / Oman — honest requirements checklist, no fabricated numbers ────
function RequirementsChecklist({ countryKey }) {
  const data = REQUIREMENTS_CHECKLISTS[countryKey];
  const [checked, setChecked] = useState(() => new Set());

  function toggle(index) {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index); else next.add(index);
      return next;
    });
  }

  const allChecked = checked.size === data.items.length;

  return (
    <div>
      <div className="tool-v2-note-strip">
        <Info size={15} weight="fill" />
        <span>{data.intro}</span>
      </div>
      <div className="tool-v2-field">
        <label><ListChecks size={16} weight="bold" style={{ verticalAlign: 'middle' }} /> علّم كل شرط تستوفيه</label>
        <div className="tool-v2-addon-list">
          {data.items.map((item, index) => (
            <label key={item} className={`tool-v2-addon-row${checked.has(index) ? ' is-active' : ''}`} style={{ cursor: 'pointer' }}>
              <span className="tool-v2-addon-toggle">
                <input type="checkbox" checked={checked.has(index)} onChange={() => toggle(index)} />
                <span>{item}</span>
              </span>
            </label>
          ))}
        </div>
      </div>
      <div className={`guide-v2-checker-result ${allChecked ? 'is-good' : ''}`} aria-live="polite">
        <p className="guide-v2-checker-result-value" style={{ fontSize: '1rem' }}>
          {allChecked
            ? 'تستوفي كل الشروط المعروفة — تقدّم عبر الجهة الرسمية لإتمام الإجراء.'
            : `استوفيت ${checked.size} من ${data.items.length} شروط.`}
        </p>
      </div>
    </div>
  );
}

export default function DomesticWorkerEligibilityChecker() {
  const [countryCode, setCountryCode] = useState('sa');

  return (
    <div aria-label="مدقق أهلية استقدام عاملة منزلية">
      <div className="tool-v2-panel-head">
        <span className="tool-v2-country-badge"><CountryFlag code={countryCode} /> {COUNTRIES.find((c) => c.code === countryCode)?.label} <span className="tool-v2-live-dot" aria-hidden="true" /></span>
      </div>

      <div className="tool-v2-field">
        <label>اختر دولتك</label>
        <div className="guide-v2-checker-options" role="group" aria-label="اختر دولتك">
          {COUNTRIES.map((c) => (
            <button key={c.code} type="button" className={`guide-v2-checker-chip${countryCode === c.code ? ' is-active' : ''}`} aria-pressed={countryCode === c.code} onClick={() => setCountryCode(c.code)}>
              <CountryFlag code={c.code} /> {c.label}
            </button>
          ))}
        </div>
      </div>

      {countryCode === 'sa' ? <SaudiChecker /> : null}
      {countryCode === 'kw' ? <KuwaitChecker /> : null}
      {['ae', 'qa', 'bh', 'om'].includes(countryCode) ? <RequirementsChecklist countryKey={countryCode} /> : null}

      <div className="tool-v2-note-strip">
        <Warning size={14} weight="fill" />
        <span>أداة استرشادية لمساعدتك على التحضير — القرار النهائي والشروط الدقيقة لحالتك الفردية تعود للجهة الحكومية المختصة في بلدك.</span>
      </div>
    </div>
  );
}
