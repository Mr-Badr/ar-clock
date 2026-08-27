"use client";

import { useMemo, useState } from 'react';
import { Info } from '@phosphor-icons/react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { fmt } from '@/lib/calculators/building/constants';

// Real broadcast/cinema engineering standards, verified 2026-08-25 across 4 independent sources
// (kaleidescape.com, keydigital.org, theatercalc.com, octocalculator.com) — not a blog's rule of
// thumb. Both stay selectable rather than picking one as "correct": they genuinely target
// different use cases (mixed/office viewing vs. an immersive cinema-like setup).
const STANDARDS = [
  { id: 'smpte', label: 'مريحة (SMPTE)', desc: 'زاوية مشاهدة 30° — مناسبة للاستخدام اليومي المختلط', ratio: 0.65 },
  { id: 'thx', label: 'سينمائية (THX)', desc: 'زاوية مشاهدة 40° — تجربة أقرب لصالة السينما', ratio: 0.835 },
];

const MODES = [
  { id: 'size', label: 'أعرف مساحة غرفتي، أعطني المقاس' },
  { id: 'distance', label: 'أعرف المقاس الذي أفكر فيه، أعطني المسافة' },
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

export default function TvSizeCalculator() {
  const [mode, setMode] = useState('size');
  const [standardId, setStandardId] = useState('smpte');
  const [distanceCm, setDistanceCm] = useState(250);
  const [sizeInches, setSizeInches] = useState(55);

  const standard = STANDARDS.find((s) => s.id === standardId) ?? STANDARDS[0];

  const result = useMemo(() => {
    if (mode === 'size') {
      const distanceInches = Math.max(1, Number(distanceCm) || 0) / 2.54;
      const recommendedSize = distanceInches * standard.ratio;
      return { recommendedSize };
    }
    const size = Math.max(1, Number(sizeInches) || 0);
    const recommendedDistanceInches = size / standard.ratio;
    const recommendedDistanceCm = recommendedDistanceInches * 2.54;
    return { recommendedDistanceCm };
  }, [mode, distanceCm, sizeInches, standard]);

  return (
    <div aria-label="حاسبة حجم الشاشة المناسب">
      <div className="tool-v2-panel-head">
        <span className="tool-v2-country-badge">
          <span className="tool-v2-live-dot" aria-hidden="true" />
          {standard.label}
        </span>
      </div>

      <div className="tool-v2-field">
        <label>ماذا تريد أن تحسب؟</label>
        <div className="tool-v2-choice-list">
          {MODES.map((m) => {
            const active = mode === m.id;
            return (
              <label key={m.id} className={`tool-v2-choice-card${active ? ' is-active' : ''}`} htmlFor={`tv-mode-${m.id}`}>
                <input type="radio" id={`tv-mode-${m.id}`} name="tv-size-mode" checked={active} onChange={() => setMode(m.id)} />
                <span className="tool-v2-choice-body">
                  <span className="tool-v2-choice-title">{m.label}</span>
                </span>
              </label>
            );
          })}
        </div>
      </div>

      <div className="tool-v2-field">
        <label>معيار المشاهدة</label>
        <div className="tool-v2-choice-list">
          {STANDARDS.map((s) => {
            const active = standardId === s.id;
            return (
              <label key={s.id} className={`tool-v2-choice-card${active ? ' is-active' : ''}`} htmlFor={`tv-standard-${s.id}`}>
                <input type="radio" id={`tv-standard-${s.id}`} name="tv-standard" checked={active} onChange={() => setStandardId(s.id)} />
                <span className="tool-v2-choice-body">
                  <span className="tool-v2-choice-title">{s.label}</span>
                  <span className="tool-v2-choice-desc">{s.desc}</span>
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {mode === 'size' ? (
        <div className="tool-v2-field">
          <label htmlFor="tv-distance">
            المسافة بينك وبين مكان التلفزيون (سم)
            <FieldHint text="قِس المسافة الفعلية من مكان جلوسك المعتاد إلى الحائط أو الطاولة التي ستضع عليها التلفزيون." />
          </label>
          <input id="tv-distance" type="number" inputMode="decimal" min="50" step="10" value={distanceCm} onChange={(e) => setDistanceCm(e.target.value)} />
        </div>
      ) : (
        <div className="tool-v2-field">
          <label htmlFor="tv-size">مقاس التلفزيون الذي تفكر فيه (بوصة)</label>
          <input id="tv-size" type="number" inputMode="decimal" min="20" step="1" value={sizeInches} onChange={(e) => setSizeInches(e.target.value)} />
        </div>
      )}

      <div aria-live="polite">
        {mode === 'size' ? (
          <div className="tool-v2-result-hero">
            <span className="tool-v2-result-label">المقاس الموصى به</span>
            <div className="tool-v2-result-stat-row">
              <span className="tool-v2-result-stat">
                <span className="tool-v2-result-stat-value">{fmt(result.recommendedSize)}</span>
                <span className="tool-v2-result-stat-label">بوصة (قياس قطري)</span>
              </span>
            </div>
          </div>
        ) : (
          <div className="tool-v2-result-hero">
            <span className="tool-v2-result-label">المسافة المثالية</span>
            <div className="tool-v2-result-stat-row">
              <span className="tool-v2-result-stat">
                <span className="tool-v2-result-stat-value">{fmt(result.recommendedDistanceCm)}</span>
                <span className="tool-v2-result-stat-label">سم</span>
              </span>
            </div>
          </div>
        )}

        <div className="tool-v2-note-strip">
          <Info size={15} weight="fill" />
          <span>المقاس هو القياس القطري الكامل للشاشة (كما تُباع في المتاجر)، وليس عرضها أو ارتفاعها. النتيجة تقدير هندسي — قد تفضّل مقاساً أكبر أو أصغر حسب ذوقك الشخصي.</span>
        </div>
      </div>
    </div>
  );
}
