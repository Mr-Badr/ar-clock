"use client";

import { useMemo, useState } from 'react';
import { Drop, Info, Layout, ShieldCheck, Warning } from '@phosphor-icons/react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { fmt } from '@/lib/calculators/building/constants';

// Materials-quantity angle, deliberately NOT a price calculator — a real Saudi insulation
// company (nesmt-elmamar.sa) already runs a price-only lead-gen "calculator" for this exact
// query; building a competing cost tool would just duplicate their marketing funnel. See
// keyword-research/narrow-tools-2026-08-03/DECISION.md §2 and
// keyword-research/construction-hub/DECISION.md item 8. Coverage-rate defaults are directional
// starting points sourced from ARDEX's liquid-membrane technical guide and standard commercial
// roll sizing — always editable per docs/PLAN.md §5 step 8, since real product coverage varies.
const INSULATION_TYPES = [
  { id: 'liquid', label: 'عزل مائي سائل / دهان', desc: 'يُطبَّق بالفرشاة أو الرول على طبقتين غالباً.', icon: Drop, color: 'blue' },
  { id: 'rolls', label: 'لفائف عزل بيتومينية', desc: 'لفائف جاهزة تُلحم أو تُلصق بالحرارة.', icon: Layout, color: 'amber' },
  { id: 'foam', label: 'رغوة بولي يوريثان مرشوشة', desc: 'تُرش بمعدات متخصصة، السماكة تحدد كفاءة العزل الحراري.', icon: ShieldCheck, color: 'green' },
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

export default function WaterproofingCalculator() {
  const [area, setArea] = useState('80');
  const [typeId, setTypeId] = useState('liquid');
  const [wastePercent, setWastePercent] = useState('10');

  // liquid
  const [coveragePerLiter, setCoveragePerLiter] = useState('1.5');
  const [coats, setCoats] = useState(2);
  // rolls
  const [rollArea, setRollArea] = useState('10');
  const [overlapPercent, setOverlapPercent] = useState('10');
  // foam
  const [thicknessCm, setThicknessCm] = useState('3');
  const [kitCoverage, setKitCoverage] = useState('20');

  const a = Math.max(0, Number(area) || 0);
  const waste = Math.max(0, Number(wastePercent) || 0);
  const hasInput = a > 0;

  const result = useMemo(() => {
    if (!hasInput) return null;
    const effectiveArea = a * (1 + waste / 100);
    if (typeId === 'liquid') {
      const rate = Math.max(0.01, Number(coveragePerLiter) || 0.01);
      const liters = (effectiveArea * coats) / rate;
      return { kind: 'liquid', liters };
    }
    if (typeId === 'rolls') {
      const rArea = Math.max(0.1, Number(rollArea) || 0.1);
      const overlap = Math.max(0, Number(overlapPercent) || 0);
      const totalWithOverlap = effectiveArea * (1 + overlap / 100);
      const rolls = Math.ceil(totalWithOverlap / rArea);
      return { kind: 'rolls', rolls, totalWithOverlap };
    }
    const coverage = Math.max(0.1, Number(kitCoverage) || 0.1);
    const kits = Math.ceil(effectiveArea / coverage);
    return { kind: 'foam', kits, thickness: Math.max(0, Number(thicknessCm) || 0) };
  }, [a, waste, typeId, coats, coveragePerLiter, rollArea, overlapPercent, kitCoverage, thicknessCm, hasInput]);

  return (
    <div aria-label="حاسبة كمية مواد عزل الأسطح">
      <div className="tool-v2-panel-head">
        <span className="tool-v2-country-badge"><span className="tool-v2-live-dot" aria-hidden="true" /> كمية مواد، وليست تسعيراً</span>
      </div>

      <div className="tool-v2-field">
        <label htmlFor="wp-area">مساحة السطح (م²)</label>
        <input id="wp-area" type="number" inputMode="decimal" min="0" step="5" value={area} onChange={(e) => setArea(e.target.value)} />
      </div>

      <div className="tool-v2-field">
        <label>نوع العزل</label>
        <div className="tool-v2-choice-list">
          {INSULATION_TYPES.map((t) => {
            const Icon = t.icon;
            const active = typeId === t.id;
            return (
              <label key={t.id} className={`tool-v2-choice-card${active ? ' is-active' : ''}`} htmlFor={`wp-${t.id}`}>
                <input type="radio" id={`wp-${t.id}`} name="wp-type" checked={active} onChange={() => setTypeId(t.id)} />
                <span className={`tool-v2-choice-icon tool-v2-choice-icon--${t.color}`} aria-hidden="true"><Icon size={18} weight="bold" /></span>
                <span className="tool-v2-choice-body">
                  <span className="tool-v2-choice-title">{t.label}</span>
                  <span className="tool-v2-choice-desc">{t.desc}</span>
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {typeId === 'liquid' ? (
        <div className="tool-v2-field-row-pair">
          <div className="tool-v2-field">
            <label htmlFor="wp-coverage">
              معدل التغطية (م²/لتر)
              <FieldHint text="راجع نشرة بيانات المنتج الذي تستخدمه فعلياً — يختلف حسب سماكة الطبقة ونوع المادة." />
            </label>
            <input id="wp-coverage" type="number" inputMode="decimal" min="0.1" step="0.1" value={coveragePerLiter} onChange={(e) => setCoveragePerLiter(e.target.value)} />
          </div>
          <div className="tool-v2-field">
            <label htmlFor="wp-coats">عدد الطبقات</label>
            <div id="wp-coats" className="tool-v2-stepper" role="group" aria-label="عدد الطبقات">
              <button type="button" className="tool-v2-stepper-btn" onClick={() => setCoats((v) => Math.max(1, v - 1))} aria-label="تقليل">−</button>
              <span className="tool-v2-stepper-val">{coats}</span>
              <button type="button" className="tool-v2-stepper-btn" onClick={() => setCoats((v) => Math.min(4, v + 1))} aria-label="زيادة">+</button>
            </div>
          </div>
        </div>
      ) : null}

      {typeId === 'rolls' ? (
        <div className="tool-v2-field-row-pair">
          <div className="tool-v2-field">
            <label htmlFor="wp-roll-area">مساحة اللفة الواحدة (م²)</label>
            <input id="wp-roll-area" type="number" inputMode="decimal" min="0.5" step="0.5" value={rollArea} onChange={(e) => setRollArea(e.target.value)} />
          </div>
          <div className="tool-v2-field">
            <label htmlFor="wp-overlap">نسبة التراكب/الهدر (%)</label>
            <input id="wp-overlap" type="number" inputMode="decimal" min="0" max="50" step="1" value={overlapPercent} onChange={(e) => setOverlapPercent(e.target.value)} />
          </div>
        </div>
      ) : null}

      {typeId === 'foam' ? (
        <div className="tool-v2-field-row-pair">
          <div className="tool-v2-field">
            <label htmlFor="wp-thickness">السماكة المطلوبة (سم)</label>
            <input id="wp-thickness" type="number" inputMode="decimal" min="0.5" step="0.5" value={thicknessCm} onChange={(e) => setThicknessCm(e.target.value)} />
          </div>
          <div className="tool-v2-field">
            <label htmlFor="wp-kit-coverage">
              تغطية الطقم الواحد عند هذه السماكة (م²)
              <FieldHint text="لا يوجد رقم عالمي موحّد — خذ هذه القيمة من نشرة بيانات المنتج الذي تستخدمه فعلياً." />
            </label>
            <input id="wp-kit-coverage" type="number" inputMode="decimal" min="1" step="1" value={kitCoverage} onChange={(e) => setKitCoverage(e.target.value)} />
          </div>
        </div>
      ) : null}

      <div className="tool-v2-field">
        <label htmlFor="wp-waste">
          هامش أمان/هدر إضافي (%)
          <FieldHint text="يغطي زوايا وتشطيبات وأخطاء تطبيق بسيطة — نفس منطق حاسبة الدهان." />
        </label>
        <input id="wp-waste" type="number" inputMode="decimal" min="0" max="30" step="1" value={wastePercent} onChange={(e) => setWastePercent(e.target.value)} />
      </div>

      {result ? (
        <div aria-live="polite">
          {result.kind === 'liquid' ? (
            <div className="tool-v2-result-hero">
              <span className="tool-v2-result-label">إجمالي كمية المادة المطلوبة</span>
              <div className="tool-v2-result-stat-row">
                <span className="tool-v2-result-stat">
                  <span className="tool-v2-result-stat-value">{fmt(result.liters, 1)}</span>
                  <span className="tool-v2-result-stat-label">لتر</span>
                </span>
              </div>
              <div className="tool-v2-result-meta">شامل {coats} طبقة{coats > 1 ? 'ات' : ''} وهامش الأمان</div>
            </div>
          ) : null}
          {result.kind === 'rolls' ? (
            <div className="tool-v2-result-hero">
              <span className="tool-v2-result-label">عدد اللفائف المطلوبة</span>
              <div className="tool-v2-result-stat-row">
                <span className="tool-v2-result-stat">
                  <span className="tool-v2-result-stat-value">{result.rolls}</span>
                  <span className="tool-v2-result-stat-label">لفة</span>
                </span>
              </div>
              <div className="tool-v2-result-meta">شامل التراكب وهامش الأمان — إجمالي {fmt(result.totalWithOverlap, 1)} م² مع التراكب</div>
            </div>
          ) : null}
          {result.kind === 'foam' ? (
            <div className="tool-v2-result-hero">
              <span className="tool-v2-result-label">عدد أطقم الرغوة المطلوبة</span>
              <div className="tool-v2-result-stat-row">
                <span className="tool-v2-result-stat">
                  <span className="tool-v2-result-stat-value">{result.kits}</span>
                  <span className="tool-v2-result-stat-label">طقم</span>
                </span>
              </div>
              <div className="tool-v2-result-meta">عند سماكة {fmt(result.thickness, 1)} سم</div>
            </div>
          ) : null}

          <div className="tool-v2-note-strip">
            <ShieldCheck size={15} weight="fill" />
            <span>هذه كمية مواد تقريبية لمساعدتك على الشراء والمقارنة بين الموردين — ليست عرض سعر تركيب، والتنفيذ الفعلي يحتاج فنياً مختصاً.</span>
          </div>
        </div>
      ) : (
        <div className="tool-v2-empty-state">
          <Warning size={28} weight="duotone" />
          <p>أدخل مساحة سطح أكبر من صفر.</p>
        </div>
      )}
    </div>
  );
}
