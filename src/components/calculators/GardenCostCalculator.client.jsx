"use client";

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Flower, GridFour, Info, Sparkle, TreePalm, Warning } from '@phosphor-icons/react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import CountryFlag from '@/components/shared/CountryFlag';
import { GULF_CURRENCIES } from '@/lib/hvac/gulf-currencies';
import { fmt } from '@/lib/calculators/building/constants';

// Starting-point per-m² rates (editable) — calibrated against real Saudi market data found in
// research (artificial turf 18-100 SAR/m² incl. installation, small gardens 1,000-2,500 SAR,
// mid gardens up to 27,000 SAR) — see keyword-research/landscaping-hub/DECISION.md §5.1.
// Directional defaults, never a fixed authority — adjustable per docs/PLAN.md §5 step 8.
const FLOOR_TYPES = [
  { id: 'natural', label: 'عشب طبيعي', ratePerSqm: 35, icon: Flower, color: 'green', desc: 'أرخص تركيباً، يحتاج صيانة وري دوريين.' },
  { id: 'artificial', label: 'عشب صناعي', ratePerSqm: 70, icon: GridFour, color: 'blue', desc: 'أعلى تكلفة أولى، صفر صيانة دورية تقريباً.', badge: 'الأكثر طلباً' },
  { id: 'gravel', label: 'حصى وزينة حجرية', ratePerSqm: 45, icon: Sparkle, color: 'amber', desc: 'مناسب للممرات والمساحات الجافة قليلة الري.' },
  { id: 'mixed', label: 'مختلط', ratePerSqm: 55, icon: TreePalm, color: 'green', desc: 'مزيج من عشب وحصى ونباتات حسب المناطق.' },
];
const DESIGN_LEVELS = [
  { id: 'economy', label: 'اقتصادي', factor: 0.7 },
  { id: 'standard', label: 'متوسط', factor: 1 },
  { id: 'premium', label: 'متكامل فاخر', factor: 1.6 },
];
const ADDONS = [
  { id: 'irrigation', label: 'نظام ري بالتنقيط', mode: 'perSqm', defaultPrice: 20 },
  { id: 'lighting', label: 'إضاءة الحديقة', mode: 'flat', defaultPrice: 800 },
  { id: 'fountain', label: 'نافورة أو شلال صغير', mode: 'flat', defaultPrice: 3500 },
  { id: 'pergola', label: 'مظلة / بيرغولا', mode: 'flat', defaultPrice: 2500 },
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

export default function GardenCostCalculator() {
  const [area, setArea] = useState('60');
  const [floorId, setFloorId] = useState('artificial');
  const [designId, setDesignId] = useState('standard');
  const [countryCode, setCountryCode] = useState('sa');
  const [addonState, setAddonState] = useState(() =>
    Object.fromEntries(ADDONS.map((a) => [a.id, { enabled: false, price: a.defaultPrice }])),
  );

  const floor = FLOOR_TYPES.find((f) => f.id === floorId);
  const design = DESIGN_LEVELS.find((d) => d.id === designId);
  const country = GULF_CURRENCIES.find((c) => c.code === countryCode) ?? GULF_CURRENCIES[0];
  const a = Math.max(0, Number(area) || 0);
  const hasInput = a > 0;

  const result = useMemo(() => {
    if (!hasInput) return null;
    const baseTotal = a * floor.ratePerSqm * design.factor;
    const addonRows = ADDONS.filter((ad) => addonState[ad.id]?.enabled).map((ad) => {
      const price = Math.max(0, Number(addonState[ad.id].price) || 0);
      const total = ad.mode === 'perSqm' ? price * a : price;
      return { ...ad, price, total };
    });
    const addonsTotal = addonRows.reduce((sum, r) => sum + r.total, 0);
    const grandTotal = baseTotal + addonsTotal;
    return { baseTotal, addonRows, addonsTotal, low: grandTotal * 0.85, high: grandTotal * 1.2, grandTotal };
  }, [a, floor, design, addonState, hasInput]);

  const quoteHref = result
    ? `/tools/landscaping/quote-generator?amount=${Math.round(result.grandTotal)}&service=${encodeURIComponent(`تنسيق حديقة — ${floor.label}`)}`
    : '/tools/landscaping/quote-generator';

  return (
    <div aria-label="حاسبة تكلفة تنسيق حديقة">
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
        <label htmlFor="garden-area">مساحة الحديقة (م²)</label>
        <input id="garden-area" type="number" inputMode="decimal" min="0" step="5" value={area} onChange={(e) => setArea(e.target.value)} />
      </div>

      <div className="tool-v2-field">
        <label>نوع الأرضية</label>
        <div className="tool-v2-choice-list">
          {FLOOR_TYPES.map((f) => {
            const Icon = f.icon;
            const active = floorId === f.id;
            return (
              <label key={f.id} className={`tool-v2-choice-card${active ? ' is-active' : ''}`} htmlFor={`floor-${f.id}`}>
                <input type="radio" id={`floor-${f.id}`} name="floor-type" checked={active} onChange={() => setFloorId(f.id)} />
                <span className={`tool-v2-choice-icon tool-v2-choice-icon--${f.color}`} aria-hidden="true"><Icon size={18} weight="bold" /></span>
                <span className="tool-v2-choice-body">
                  <span className="tool-v2-choice-title">{f.label}{f.badge ? <span className="tool-v2-choice-badge">{f.badge}</span> : null}</span>
                  <span className="tool-v2-choice-desc">{f.desc}</span>
                </span>
              </label>
            );
          })}
        </div>
      </div>

      <div className="tool-v2-field">
        <label>
          مستوى التصميم
          <FieldHint text="اقتصادي: أساسيات فقط. متوسط: تنسيق وتنوع نباتات. فاخر: عناصر ديكور ومواد أعلى جودة." />
        </label>
        <div className="guide-v2-checker-options" role="group" aria-label="مستوى التصميم">
          {DESIGN_LEVELS.map((d) => (
            <button key={d.id} type="button" className={`guide-v2-checker-chip${designId === d.id ? ' is-active' : ''}`} aria-pressed={designId === d.id} onClick={() => setDesignId(d.id)}>
              {d.label}
            </button>
          ))}
        </div>
      </div>

      <div className="tool-v2-field">
        <label>إضافات اختيارية</label>
        <div className="tool-v2-addon-list">
          {ADDONS.map((ad) => {
            const state = addonState[ad.id];
            return (
              <div key={ad.id} className={`tool-v2-addon-row${state.enabled ? ' is-active' : ''}`}>
                <label className="tool-v2-addon-toggle">
                  <input type="checkbox" checked={state.enabled} onChange={(e) => setAddonState((prev) => ({ ...prev, [ad.id]: { ...prev[ad.id], enabled: e.target.checked } }))} />
                  <span>{ad.label}</span>
                </label>
                {state.enabled ? (
                  <div className="tool-v2-addon-inputs">
                    <span className="tool-v2-addon-unit">{ad.mode === 'perSqm' ? 'السعر لكل م²' : 'سعر ثابت'}</span>
                    <input
                      type="number"
                      inputMode="decimal"
                      min="0"
                      className="tool-v2-addon-price"
                      value={state.price}
                      onChange={(e) => setAddonState((prev) => ({ ...prev, [ad.id]: { ...prev[ad.id], price: e.target.value } }))}
                      aria-label={`سعر ${ad.label}`}
                    />
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>

      {result ? (
        <div aria-live="polite">
          <div className="tool-v2-result-hero">
            <span className="tool-v2-result-label">النطاق التقديري للمشروع</span>
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

          <div className="tool-v2-breakdown-list">
            <div className="tool-v2-breakdown-row">
              <span className="tool-v2-breakdown-label">الأرضية والتصميم الأساسي ({floor.label} — {design.label})</span>
              <span className="tool-v2-breakdown-value">{fmt(result.baseTotal)} {country.short}</span>
            </div>
            {result.addonRows.map((r) => (
              <div className="tool-v2-breakdown-row" key={r.id}>
                <span className="tool-v2-breakdown-label">{r.label}</span>
                <span className="tool-v2-breakdown-value">{fmt(r.total)} {country.short}</span>
              </div>
            ))}
          </div>

          <div className="tool-v2-note-strip">
            <Sparkle size={15} weight="fill" />
            <span>هذا تقدير استرشادي — السعر النهائي يتحدد بعد معاينة الأرض الفعلية وتوفر النباتات والمواد وقت التنفيذ.</span>
          </div>

          <div className="tool-v2-action-row">
            <Link href={quoteHref} className="tool-v2-action-btn is-primary">حوّل إلى عرض سعر PDF</Link>
          </div>
        </div>
      ) : (
        <div className="tool-v2-empty-state">
          <Warning size={28} weight="duotone" />
          <p>أدخل مساحة حديقة أكبر من صفر.</p>
        </div>
      )}
    </div>
  );
}
