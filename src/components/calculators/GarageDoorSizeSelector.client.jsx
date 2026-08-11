"use client";

import { useMemo, useState } from 'react';
import { Info, ArrowsOutLineHorizontal } from '@phosphor-icons/react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// Standard garage door sizes (width × height, meters) — real, verified via direct WebFetch of
// bayut.com/mybayut's garage-door types article (quoted exactly, not a search-summary paraphrase
// — see keyword-research/garage-doors-hub/DECISION.md and the standing lesson in
// feedback-verify-numbers-via-webfetch-2026-08-10). This tool intentionally MATCHES real
// car-count categories to these real sizes rather than computing a fabricated width formula —
// no verified per-car clearance figure exists for the Gulf market specifically (docs/PLAN.md §5
// step 8: no invented precision where the real data doesn't support it).
const CAR_COUNTS = [
  {
    id: '1',
    label: 'سيارة واحدة',
    sizes: ['3 × 3 متر', '3.5 × 3 متر'],
    note: 'يكفي لسيارة سيدان أو SUV متوسطة مع مساحة كافية لفتح الأبواب والمشي بجانبها.',
  },
  {
    id: '2',
    label: 'سيارتان',
    sizes: ['4.5 × 3 متر', '5 × 3 متر', '5.5 × 3 متر'],
    note: 'المقاس الأشيع لجراج سيارتين جنباً إلى جنب — اختر الطرف الأعلى من النطاق إن كانت سياراتك SUV كبيرة.',
  },
  {
    id: '3plus',
    label: '3 سيارات أو أكثر',
    sizes: ['6 × 3 متر فأكثر'],
    note: 'غالباً يُنفَّذ كبابين منفصلين (باب مزدوج + باب مفرد) بدل باب واحد عريض جداً — نفس مبدأ الجراجات الثلاثية عالمياً.',
  },
];

const DOOR_TYPES = [
  { id: 'roll', label: 'رول (لفّي)', desc: 'يلتف لأعلى داخل صندوق مضغوط — الأشيع والأوفر تكلفة.' },
  { id: 'sectional', label: 'سكشنال (شرائح)', desc: 'شرائح أفقية تنزلق على سكة سقفية — عزل أفضل للحرارة والصوت.' },
  { id: 'sliding', label: 'سحّاب جانبي', desc: 'ينزلق جانبياً بدل الأعلى — مناسب حين يكون ارتفاع السقف محدوداً.' },
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

export default function GarageDoorSizeSelector() {
  const [carCountId, setCarCountId] = useState('1');
  const [doorTypeId, setDoorTypeId] = useState('roll');

  const selected = useMemo(() => CAR_COUNTS.find((c) => c.id === carCountId) ?? CAR_COUNTS[0], [carCountId]);
  const doorType = useMemo(() => DOOR_TYPES.find((d) => d.id === doorTypeId) ?? DOOR_TYPES[0], [doorTypeId]);

  return (
    <div aria-label="دليل اختيار مقاس باب الجراج">
      <div className="tool-v2-panel-head">
        <span className="tool-v2-country-badge">
          <span className="tool-v2-live-dot" aria-hidden="true" />
          مقاسات قياسية حقيقية في السوق
        </span>
      </div>

      <div className="tool-v2-field">
        <label>عدد السيارات</label>
        <div className="guide-v2-checker-options" role="group" aria-label="عدد السيارات">
          {CAR_COUNTS.map((c) => (
            <button key={c.id} type="button" className={`guide-v2-checker-chip${carCountId === c.id ? ' is-active' : ''}`} aria-pressed={carCountId === c.id} onClick={() => setCarCountId(c.id)}>
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div className="tool-v2-field">
        <label>
          نوع الباب المفضل
          <FieldHint text="النوع لا يغيّر المقاس القياسي المطلوب، لكنه يؤثر على السعر والصيانة وارتفاع السقف اللازم." />
        </label>
        <div className="tool-v2-choice-list">
          {DOOR_TYPES.map((d) => {
            const active = doorTypeId === d.id;
            return (
              <label key={d.id} className={`tool-v2-choice-card${active ? ' is-active' : ''}`} htmlFor={`door-type-${d.id}`}>
                <input type="radio" id={`door-type-${d.id}`} name="garage-door-type" checked={active} onChange={() => setDoorTypeId(d.id)} />
                <span className="tool-v2-choice-icon" aria-hidden="true"><ArrowsOutLineHorizontal size={18} weight="bold" /></span>
                <span className="tool-v2-choice-body">
                  <span className="tool-v2-choice-title">{d.label}</span>
                  <span className="tool-v2-choice-desc">{d.desc}</span>
                </span>
              </label>
            );
          })}
        </div>
      </div>

      <div aria-live="polite">
        <div className="tool-v2-result-hero">
          <span className="tool-v2-result-label">المقاسات القياسية المناسبة لـ{selected.label}</span>
          <div className="tool-v2-breakdown-list" style={{ marginTop: 8 }}>
            {selected.sizes.map((size) => (
              <div className="tool-v2-breakdown-row" key={size}>
                <span className="tool-v2-breakdown-label">{size}</span>
                <span className="tool-v2-breakdown-value">باب {doorType.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="tool-v2-note-strip">
          <ArrowsOutLineHorizontal size={15} weight="fill" />
          <span>{selected.note}</span>
        </div>
      </div>
    </div>
  );
}
