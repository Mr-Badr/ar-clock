"use client";

import { useMemo, useState } from 'react';
import { Info, ShieldWarning, Warning } from '@phosphor-icons/react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { fmt } from '@/lib/calculators/building/constants';

// Volume formulas: standard, internationally-used shape formulas (Swim University, Inch
// Calculator) — computed metric-first (no US-gallon conversion constant needed), a real
// advantage over English-market reference tools which default to gallons. Chlorine dosing:
// Omni Calculator's pool-shock chemistry, converted to a metric-native form. See
// keyword-research/narrow-tools-2026-08-03/DECISION.md §3.
const SHAPES = [
  { id: 'rect', label: 'مستطيل' },
  { id: 'circle', label: 'دائري' },
  { id: 'oval', label: 'بيضاوي' },
  { id: 'kidney', label: 'كلوي (Kidney)' },
];
const TARGET_PRESETS = [
  { id: 'routine', label: 'روتيني', ppm: 2 },
  { id: 'shock', label: 'معالجة صدمة', ppm: 10 },
  { id: 'algae', label: 'مكافحة طحالب', ppm: 25 },
];
const PRODUCTS = [
  { id: 'liquid', label: 'كلور سائل (هيبوكلوريت الصوديوم)', unit: 'مل', defaultConcentration: 12.5 },
  { id: 'granular', label: 'كلور حبيبي (هيبوكلوريت الكالسيوم)', unit: 'غرام', defaultConcentration: 65 },
  { id: 'tablets', label: 'أقراص كلور (TCCA)', unit: 'غرام', defaultConcentration: 90 },
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

export default function PoolVolumeChlorineCalculator() {
  const [shape, setShape] = useState('rect');
  const [length, setLength] = useState('8');
  const [width, setWidth] = useState('4');
  const [width2, setWidth2] = useState('2');
  const [diameter, setDiameter] = useState('5');
  const [shallowDepth, setShallowDepth] = useState('1.2');
  const [deepDepth, setDeepDepth] = useState('1.8');

  const [currentPpm, setCurrentPpm] = useState('0');
  const [targetId, setTargetId] = useState('routine');
  const [customPpm, setCustomPpm] = useState('');
  const [productId, setProductId] = useState('liquid');
  const [concentration, setConcentration] = useState('12.5');

  const avgDepth = (Math.max(0, Number(shallowDepth) || 0) + Math.max(0, Number(deepDepth) || 0)) / 2;

  const volumeM3 = useMemo(() => {
    const l = Math.max(0, Number(length) || 0);
    const w = Math.max(0, Number(width) || 0);
    const w2 = Math.max(0, Number(width2) || 0);
    const d = Math.max(0, Number(diameter) || 0);
    if (shape === 'rect') return l * w * avgDepth;
    if (shape === 'circle') return Math.PI * (d / 2) ** 2 * avgDepth;
    if (shape === 'oval') return l * w * 0.785 * avgDepth;
    // kidney: 0.45 × (width1 + width2) × length × avgDepth
    return 0.45 * (w + w2) * l * avgDepth;
  }, [shape, length, width, width2, diameter, avgDepth]);

  const volumeLiters = volumeM3 * 1000;
  const hasVolume = volumeM3 > 0;

  const product = PRODUCTS.find((p) => p.id === productId);
  const target = TARGET_PRESETS.find((t) => t.id === targetId);
  const targetPpm = targetId === 'custom' ? Math.max(0, Number(customPpm) || 0) : target?.ppm ?? 0;

  const dosage = useMemo(() => {
    if (!hasVolume) return null;
    const current = Math.max(0, Number(currentPpm) || 0);
    const deltaPpm = Math.max(0, targetPpm - current);
    const activeGrams = (deltaPpm * volumeLiters) / 1000;
    const conc = Math.max(1, Number(concentration) || 1);
    const productGrams = activeGrams / (conc / 100);
    // Liquid sodium hypochlorite solution density is close to water (~1 g/mL) — mL ≈ grams,
    // a reasonable approximation for a home-use estimate, noted explicitly on the page.
    const amount = product.id === 'liquid' ? productGrams : productGrams;
    return { deltaPpm, activeGrams, amount };
  }, [hasVolume, currentPpm, targetPpm, volumeLiters, concentration, product]);

  function selectProduct(id) {
    setProductId(id);
    const p = PRODUCTS.find((pr) => pr.id === id);
    setConcentration(String(p.defaultConcentration));
  }

  return (
    <div aria-label="حاسبة حجم المسبح وجرعة الكلور">
      <div className="tool-v2-panel-head">
        <span className="tool-v2-country-badge"><span className="tool-v2-live-dot" aria-hidden="true" /> الحجم أولاً، بالمتري مباشرة</span>
      </div>

      <div className="tool-v2-field">
        <label>شكل المسبح</label>
        <div className="guide-v2-checker-options" role="group" aria-label="شكل المسبح">
          {SHAPES.map((s) => (
            <button key={s.id} type="button" className={`guide-v2-checker-chip${shape === s.id ? ' is-active' : ''}`} aria-pressed={shape === s.id} onClick={() => setShape(s.id)}>{s.label}</button>
          ))}
        </div>
      </div>

      {shape === 'circle' ? (
        <div className="tool-v2-field">
          <label htmlFor="pool-diameter">القطر (م)</label>
          <input id="pool-diameter" type="number" inputMode="decimal" min="0" step="0.1" value={diameter} onChange={(e) => setDiameter(e.target.value)} />
        </div>
      ) : (
        <div className="tool-v2-field-row-pair">
          <div className="tool-v2-field">
            <label htmlFor="pool-length">الطول (م)</label>
            <input id="pool-length" type="number" inputMode="decimal" min="0" step="0.1" value={length} onChange={(e) => setLength(e.target.value)} />
          </div>
          <div className="tool-v2-field">
            <label htmlFor="pool-width">{shape === 'kidney' ? 'العرض 1 (م)' : 'العرض (م)'}</label>
            <input id="pool-width" type="number" inputMode="decimal" min="0" step="0.1" value={width} onChange={(e) => setWidth(e.target.value)} />
          </div>
        </div>
      )}

      {shape === 'kidney' ? (
        <div className="tool-v2-field">
          <label htmlFor="pool-width2">العرض 2 (م)</label>
          <input id="pool-width2" type="number" inputMode="decimal" min="0" step="0.1" value={width2} onChange={(e) => setWidth2(e.target.value)} />
        </div>
      ) : null}

      <div className="tool-v2-field-row-pair">
        <div className="tool-v2-field">
          <label htmlFor="pool-shallow">العمق الضحل (م)</label>
          <input id="pool-shallow" type="number" inputMode="decimal" min="0" step="0.1" value={shallowDepth} onChange={(e) => setShallowDepth(e.target.value)} />
        </div>
        <div className="tool-v2-field">
          <label htmlFor="pool-deep">
            العمق العميق (م)
            <FieldHint text="إن كان مسبحك بعمق ثابت، اجعل الرقمين متساويين." />
          </label>
          <input id="pool-deep" type="number" inputMode="decimal" min="0" step="0.1" value={deepDepth} onChange={(e) => setDeepDepth(e.target.value)} />
        </div>
      </div>

      <div className="tool-v2-result-hero">
        <span className="tool-v2-result-label">حجم المسبح</span>
        <div className="tool-v2-result-stat-row">
          <span className="tool-v2-result-stat">
            <span className="tool-v2-result-stat-value">{fmt(volumeM3, 1)}</span>
            <span className="tool-v2-result-stat-label">م³</span>
          </span>
          <span className="tool-v2-result-stat-sep" aria-hidden="true">≈</span>
          <span className="tool-v2-result-stat">
            <span className="tool-v2-result-stat-value">{fmt(volumeLiters)}</span>
            <span className="tool-v2-result-stat-label">لتر</span>
          </span>
        </div>
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid var(--border-default)', margin: 'var(--space-5) 0' }} />

      <div className="tool-v2-field">
        <label htmlFor="current-ppm">نسبة الكلور الحالية (ppm)</label>
        <input id="current-ppm" type="number" inputMode="decimal" min="0" step="0.5" value={currentPpm} onChange={(e) => setCurrentPpm(e.target.value)} />
      </div>

      <div className="tool-v2-field">
        <label>الهدف</label>
        <div className="guide-v2-checker-options" role="group" aria-label="هدف الكلور">
          {TARGET_PRESETS.map((t) => (
            <button key={t.id} type="button" className={`guide-v2-checker-chip${targetId === t.id ? ' is-active' : ''}`} aria-pressed={targetId === t.id} onClick={() => setTargetId(t.id)}>{t.label} ({t.ppm} ppm)</button>
          ))}
          <button type="button" className={`guide-v2-checker-chip${targetId === 'custom' ? ' is-active' : ''}`} aria-pressed={targetId === 'custom'} onClick={() => setTargetId('custom')}>مخصص</button>
        </div>
        {targetId === 'custom' ? (
          <input type="number" inputMode="decimal" min="0" className="tool-v2-addon-price" style={{ marginTop: 8 }} value={customPpm} onChange={(e) => setCustomPpm(e.target.value)} aria-label="نسبة ppm مخصصة" />
        ) : null}
      </div>

      <div className="tool-v2-field">
        <label>نوع المنتج</label>
        <div className="guide-v2-checker-options" role="group" aria-label="نوع المنتج">
          {PRODUCTS.map((p) => (
            <button key={p.id} type="button" className={`guide-v2-checker-chip${productId === p.id ? ' is-active' : ''}`} aria-pressed={productId === p.id} onClick={() => selectProduct(p.id)}>{p.label}</button>
          ))}
        </div>
      </div>

      <div className="tool-v2-field">
        <label htmlFor="concentration">
          نسبة تركيز المنتج (%)
          <FieldHint text="مطابقة لما هو مكتوب فعلياً على عبوة منتجك — التركيز يختلف بين الماركات." />
        </label>
        <input id="concentration" type="number" inputMode="decimal" min="1" max="100" step="0.5" value={concentration} onChange={(e) => setConcentration(e.target.value)} />
      </div>

      {dosage ? (
        <div aria-live="polite">
          <div className="tool-v2-result-hero">
            <span className="tool-v2-result-label">الكمية المطلوبة لرفع الكلور بمقدار {fmt(dosage.deltaPpm, 1)} ppm</span>
            <div className="tool-v2-result-stat-row">
              <span className="tool-v2-result-stat">
                <span className="tool-v2-result-stat-value">{fmt(dosage.amount, 0)}</span>
                <span className="tool-v2-result-stat-label">{product.unit}</span>
              </span>
            </div>
          </div>
          <div className="tool-v2-note-strip">
            <ShieldWarning size={15} weight="fill" />
            <span>أضف الكمية تدريجياً ووزّعها على المسبح، ولا تسبح مباشرة بعد جرعة صدمة — اختبر النسبة بعد 4-6 ساعات. هذه أداة استرشادية وليست بديلاً عن تعليمات الشركة المصنّعة على عبوة المنتج.</span>
          </div>
        </div>
      ) : (
        <div className="tool-v2-empty-state">
          <Warning size={28} weight="duotone" />
          <p>أدخل أبعاداً صحيحة لحساب الحجم أولاً.</p>
        </div>
      )}
    </div>
  );
}
