"use client";

import { useMemo, useState } from 'react';
import { Bug, House, Info, ShieldWarning, Storefront, Warning } from '@phosphor-icons/react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import CountryFlag from '@/components/shared/CountryFlag';
import { GULF_CURRENCIES } from '@/lib/hvac/gulf-currencies';
import { fmt } from '@/lib/calculators/building/constants';

// Starting-point per-m² rates (editable) — general pest categories cost less per m² than
// bed bugs, which need far more time-intensive room-by-room treatment. Directional, sourced
// from the general cost-guide pattern in keyword-research/pest-control-hub/DECISION.md §3, not
// a single fixed authority — always adjustable per docs/PLAN.md §5 step 8.
const PEST_TYPES = [
  { id: 'general', label: 'صراصير ونمل عام', ratePerSqm: 2, icon: Bug, color: 'blue', badge: 'الأكثر شيوعاً' },
  { id: 'rodents', label: 'قوارض (فئران)', ratePerSqm: 2.5, icon: Bug, color: 'amber' },
  { id: 'bedbugs', label: 'بق الفراش', ratePerSqm: 4, icon: Bug, color: 'red' },
];
const SEVERITIES = [
  { id: 'light', label: 'خفيفة', factor: 0.8 },
  { id: 'mid', label: 'متوسطة', factor: 1 },
  { id: 'heavy', label: 'شديدة', factor: 1.4 },
];
const MIN_FEE = 150;

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

export default function PestCostEstimator() {
  const [propertyType, setPropertyType] = useState('residential');
  const [area, setArea] = useState('120');
  const [pestId, setPestId] = useState('general');
  const [severityId, setSeverityId] = useState('mid');
  const [priorTreatment, setPriorTreatment] = useState(false);
  const [countryCode, setCountryCode] = useState('sa');

  const pest = PEST_TYPES.find((p) => p.id === pestId);
  const severity = SEVERITIES.find((s) => s.id === severityId);
  const country = GULF_CURRENCIES.find((c) => c.code === countryCode) ?? GULF_CURRENCIES[0];
  const a = Math.max(0, Number(area) || 0);
  const hasInput = a > 0;

  const result = useMemo(() => {
    if (!hasInput) return null;
    let base = a * pest.ratePerSqm * severity.factor;
    if (priorTreatment) base *= 1.15;
    base = Math.max(base, MIN_FEE);
    return { low: base * 0.85, high: base * 1.25 };
  }, [a, pest, severity, priorTreatment, hasInput]);

  return (
    <div aria-label="حاسبة تكلفة مكافحة الحشرات التقديرية">
      <div className="tool-v2-panel-head">
        <span className="tool-v2-country-badge">
          <span className="tool-v2-live-dot" aria-hidden="true" />
          <CountryFlag code={country.code} /> {country.country}
        </span>
      </div>

      <div className="tool-v2-field">
        <label>دولتك (للعملة فقط)</label>
        <div className="guide-v2-checker-options" role="group" aria-label="اختر دولتك">
          {GULF_CURRENCIES.map((c) => (
            <button key={c.code} type="button" className={`guide-v2-checker-chip${countryCode === c.code ? ' is-active' : ''}`} aria-pressed={countryCode === c.code} onClick={() => setCountryCode(c.code)}>
              <CountryFlag code={c.code} /> {c.country}
            </button>
          ))}
        </div>
      </div>

      <div className="tool-v2-field">
        <label>نوع العقار</label>
        <div className="guide-v2-checker-options" role="group" aria-label="نوع العقار">
          <button type="button" className={`guide-v2-checker-chip${propertyType === 'residential' ? ' is-active' : ''}`} aria-pressed={propertyType === 'residential'} onClick={() => setPropertyType('residential')}>
            <House size={14} weight="bold" /> سكني
          </button>
          <button type="button" className={`guide-v2-checker-chip${propertyType === 'commercial' ? ' is-active' : ''}`} aria-pressed={propertyType === 'commercial'} onClick={() => setPropertyType('commercial')}>
            <Storefront size={14} weight="bold" /> تجاري
          </button>
        </div>
      </div>

      <div className="tool-v2-field">
        <label htmlFor="pest-area">مساحة العقار (م²)</label>
        <input id="pest-area" type="number" inputMode="decimal" min="0" step="5" value={area} onChange={(e) => setArea(e.target.value)} />
      </div>

      <div className="tool-v2-field">
        <label>نوع الآفة</label>
        <div className="tool-v2-choice-list">
          {PEST_TYPES.map((p) => {
            const Icon = p.icon;
            const active = pestId === p.id;
            return (
              <label key={p.id} className={`tool-v2-choice-card${active ? ' is-active' : ''}`} htmlFor={`pest-${p.id}`}>
                <input type="radio" id={`pest-${p.id}`} name="pest-type" checked={active} onChange={() => setPestId(p.id)} />
                <span className={`tool-v2-choice-icon tool-v2-choice-icon--${p.color}`} aria-hidden="true"><Icon size={18} weight="bold" /></span>
                <span className="tool-v2-choice-body">
                  <span className="tool-v2-choice-title">{p.label}{p.badge ? <span className="tool-v2-choice-badge">{p.badge}</span> : null}</span>
                </span>
              </label>
            );
          })}
        </div>
      </div>

      <div className="tool-v2-field">
        <label>درجة الإصابة</label>
        <div className="guide-v2-checker-options" role="group" aria-label="درجة الإصابة">
          {SEVERITIES.map((s) => (
            <button key={s.id} type="button" className={`guide-v2-checker-chip${severityId === s.id ? ' is-active' : ''}`} aria-pressed={severityId === s.id} onClick={() => setSeverityId(s.id)}>
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="tool-v2-field">
        <label className="tool-v2-addon-toggle" htmlFor="pest-prior">
          <input id="pest-prior" type="checkbox" checked={priorTreatment} onChange={(e) => setPriorTreatment(e.target.checked)} />
          <span>عالجت المشكلة من قبل ولم تُحل نهائياً</span>
          <FieldHint text="إصابة تعود بعد معالجة سابقة غالباً تحتاج جهداً إضافياً لتحديد مصدرها الحقيقي." />
        </label>
      </div>

      {result ? (
        <div aria-live="polite">
          <div className="tool-v2-result-hero">
            <span className="tool-v2-result-label">النطاق التقديري للمعالجة</span>
            <div className="tool-v2-result-stat-row">
              <span className="tool-v2-result-stat">
                <span className="tool-v2-result-stat-value">{fmt(result.low)}</span>
                <span className="tool-v2-result-stat-label">من ({country.short})</span>
              </span>
              <span className="tool-v2-result-stat-sep" aria-hidden="true">—</span>
              <span className="tool-v2-result-stat">
                <span className="tool-v2-result-stat-value">{fmt(result.high)}</span>
                <span className="tool-v2-result-stat-label">إلى ({country.short})</span>
              </span>
            </div>
          </div>
          <div className="tool-v2-note-strip">
            <ShieldWarning size={15} weight="fill" />
            <span>تقدير استرشادي فقط — السعر النهائي الحقيقي يحدده فني بعد معاينة ميدانية فعلية للمكان ونوع الإصابة.</span>
          </div>
        </div>
      ) : (
        <div className="tool-v2-empty-state">
          <Warning size={28} weight="duotone" />
          <p>أدخل مساحة العقار أكبر من صفر.</p>
        </div>
      )}
    </div>
  );
}
