"use client";

import { useMemo, useState } from 'react';
import { Info, Ruler, ShieldWarning, Warning } from '@phosphor-icons/react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import CountryFlag from '@/components/shared/CountryFlag';
import { GULF_CURRENCIES } from '@/lib/hvac/gulf-currencies';
import { fmt } from '@/lib/calculators/building/constants';

// Per-linear-meter starting rates (editable) — termite treatment is priced by foundation
// perimeter, not floor area, per real English-market cost guides (homeguide.com, fixr.com) cited
// in keyword-research/pest-control-hub/DECISION.md §3. Directional defaults, not a fixed
// authority — always adjustable per docs/PLAN.md §5 step 8.
const METHODS = [
  { id: 'soil', label: 'حقن التربة', desc: 'حاجز كيميائي حول المحيط — الأسرع والأكثر شيوعاً.', ratePerMeter: 40 },
  { id: 'bait', label: 'محطات الطعوم', desc: 'أبطأ لكن يقضي على المستعمرة كاملة، تحتاج مراقبة دورية.', ratePerMeter: 55 },
  { id: 'fumigation', label: 'التبخير', desc: 'للإصابات الشديدة داخل الهيكل الخشبي — يحتاج إخلاء مؤقت.', ratePerMeter: 65 },
];
const SEVERITIES = [
  { id: 'early', label: 'مبكرة / مكتشفة حديثاً', factor: 1 },
  { id: 'advanced', label: 'متقدمة / منتشرة', factor: 1.3 },
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

export default function TermiteCostEstimator() {
  const [inputMode, setInputMode] = useState('perimeter');
  const [perimeter, setPerimeter] = useState('60');
  const [length, setLength] = useState('15');
  const [width, setWidth] = useState('10');
  const [methodId, setMethodId] = useState('soil');
  const [severityId, setSeverityId] = useState('early');
  const [countryCode, setCountryCode] = useState('sa');

  const country = GULF_CURRENCIES.find((c) => c.code === countryCode) ?? GULF_CURRENCIES[0];
  const severity = SEVERITIES.find((s) => s.id === severityId);

  const effectivePerimeter = useMemo(() => {
    if (inputMode === 'perimeter') return Math.max(0, Number(perimeter) || 0);
    const l = Math.max(0, Number(length) || 0);
    const w = Math.max(0, Number(width) || 0);
    return 2 * (l + w);
  }, [inputMode, perimeter, length, width]);

  const hasInput = effectivePerimeter > 0;

  const comparisons = useMemo(() => {
    if (!hasInput) return [];
    return METHODS.map((m) => {
      const base = effectivePerimeter * m.ratePerMeter * severity.factor;
      return { ...m, low: base * 0.85, high: base * 1.2 };
    });
  }, [effectivePerimeter, severity, hasInput]);

  const selected = comparisons.find((c) => c.id === methodId);

  return (
    <div aria-label="حاسبة تكلفة معالجة النمل الأبيض">
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
        <label>
          محيط أساس المبنى
          <FieldHint text="معالجة النمل الأبيض تُسعَّر بالمتر الطولي لمحيط الأساس، لا بمساحة العقار الكلية." />
        </label>
        <div className="guide-v2-checker-options" role="group" aria-label="طريقة الإدخال">
          <button type="button" className={`guide-v2-checker-chip${inputMode === 'perimeter' ? ' is-active' : ''}`} aria-pressed={inputMode === 'perimeter'} onClick={() => setInputMode('perimeter')}>
            أدخل المحيط مباشرة
          </button>
          <button type="button" className={`guide-v2-checker-chip${inputMode === 'dimensions' ? ' is-active' : ''}`} aria-pressed={inputMode === 'dimensions'} onClick={() => setInputMode('dimensions')}>
            احسبه من أبعاد المبنى
          </button>
        </div>
      </div>

      {inputMode === 'perimeter' ? (
        <div className="tool-v2-field">
          <label htmlFor="termite-perimeter">محيط الأساس (متر طولي)</label>
          <input id="termite-perimeter" type="number" inputMode="decimal" min="0" step="1" value={perimeter} onChange={(e) => setPerimeter(e.target.value)} />
        </div>
      ) : (
        <div className="tool-v2-field-row-pair">
          <div className="tool-v2-field">
            <label htmlFor="termite-length">طول المبنى (م)</label>
            <input id="termite-length" type="number" inputMode="decimal" min="0" step="0.5" value={length} onChange={(e) => setLength(e.target.value)} />
          </div>
          <div className="tool-v2-field">
            <label htmlFor="termite-width">عرض المبنى (م)</label>
            <input id="termite-width" type="number" inputMode="decimal" min="0" step="0.5" value={width} onChange={(e) => setWidth(e.target.value)} />
          </div>
        </div>
      )}

      <div className="tool-v2-field">
        <label>طريقة المعالجة</label>
        <div className="tool-v2-choice-list">
          {METHODS.map((m) => {
            const active = methodId === m.id;
            return (
              <label key={m.id} className={`tool-v2-choice-card${active ? ' is-active' : ''}`} htmlFor={`method-${m.id}`}>
                <input type="radio" id={`method-${m.id}`} name="termite-method" checked={active} onChange={() => setMethodId(m.id)} />
                <span className="tool-v2-choice-icon tool-v2-choice-icon--amber" aria-hidden="true"><Ruler size={18} weight="bold" /></span>
                <span className="tool-v2-choice-body">
                  <span className="tool-v2-choice-title">{m.label}</span>
                  <span className="tool-v2-choice-desc">{m.desc}</span>
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

      {selected ? (
        <div aria-live="polite">
          <div className="tool-v2-result-hero">
            <span className="tool-v2-result-label">تقدير {selected.label} — محيط {fmt(effectivePerimeter)} م</span>
            <div className="tool-v2-result-stat-row">
              <span className="tool-v2-result-stat">
                <span className="tool-v2-result-stat-value">{fmt(selected.low)}</span>
                <span className="tool-v2-result-stat-label">من ({country.short})</span>
              </span>
              <span className="tool-v2-result-stat-sep" aria-hidden="true">—</span>
              <span className="tool-v2-result-stat">
                <span className="tool-v2-result-stat-value">{fmt(selected.high)}</span>
                <span className="tool-v2-result-stat-label">إلى ({country.short})</span>
              </span>
            </div>
          </div>

          <div className="tool-v2-breakdown-list">
            {comparisons.map((c) => (
              <div className="tool-v2-breakdown-row" key={c.id}>
                <span className="tool-v2-breakdown-label">{c.label}</span>
                <span className="tool-v2-breakdown-value">{fmt(c.low)} - {fmt(c.high)} {country.short}</span>
              </div>
            ))}
          </div>

          <div className="tool-v2-note-strip">
            <ShieldWarning size={15} weight="fill" />
            <span>تقدير استرشادي فقط — التكلفة الفعلية تحتاج فحصاً ميدانياً لتحديد مدى انتشار الإصابة داخل الهيكل، لا محيط المبنى وحده.</span>
          </div>
        </div>
      ) : (
        <div className="tool-v2-empty-state">
          <Warning size={28} weight="duotone" />
          <p>أدخل محيط الأساس أو أبعاد المبنى.</p>
        </div>
      )}
    </div>
  );
}
