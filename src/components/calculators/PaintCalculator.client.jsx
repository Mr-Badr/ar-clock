"use client";

import { useState } from 'react';
import {
  Buildings,
  House,
  Info,
  Minus,
  PaintBucket,
  Plus,
  Share as ShareIcon,
  ShieldCheck,
  Sparkle,
  Warning,
} from '@phosphor-icons/react';
import { toast } from 'sonner';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { fmt } from '@/lib/calculators/building/constants';

// Ported as-is from the pre-existing (verified, WebSearch-checked 2026-07-31) PaintCalculator —
// coverage rates match real-world industry ranges (8-14 m²/L depending on paint quality/type).
const PAINT_TYPES = [
  {
    id: 'interior_economy',
    label: 'داخلي اقتصادي',
    desc: 'الأنسب للمساحات الواسعة بأقل تكلفة إجمالية.',
    coverage: 10,
    icon: House,
    color: 'blue',
  },
  {
    id: 'interior_standard',
    label: 'داخلي عادي',
    desc: 'توازن جيد بين الجودة والسعر — يناسب معظم الغرف.',
    coverage: 12,
    icon: House,
    color: 'green',
    badge: 'الأكثر استخداماً',
  },
  {
    id: 'interior_premium',
    label: 'داخلي فاخر',
    desc: 'تغطية أعلى وقد تكفي طبقة واحدة فقط.',
    coverage: 14,
    icon: Sparkle,
    color: 'amber',
  },
  {
    id: 'exterior_standard',
    label: 'خارجي عادي',
    desc: 'متين للواجهات والأسطح المعرّضة للشمس والغبار.',
    coverage: 8,
    icon: Buildings,
    color: 'blue',
  },
  {
    id: 'exterior_premium',
    label: 'خارجي فاخر',
    desc: 'مقاوم للرطوبة والعوامل الجوية القاسية.',
    coverage: 10,
    icon: ShieldCheck,
    color: 'blue',
  },
  {
    id: 'primer',
    label: 'أستر / بريمر',
    desc: 'ضروري قبل لون جديد فاتح أو جدار حديث البناء.',
    coverage: 8,
    icon: PaintBucket,
    color: 'amber',
  },
];
const DOOR_AREA = 1.8;
const WINDOW_AREA = 1.44;

function calcPaint({ length, width, height, doors, windows, coats, paintId }) {
  const paint = PAINT_TYPES.find((p) => p.id === paintId) ?? PAINT_TYPES[1];
  const wallArea = 2 * (length + width) * height;
  const openings = doors * DOOR_AREA + windows * WINDOW_AREA;
  const netArea = Math.max(0, wallArea - openings);
  const totalArea = netArea * coats;
  const liters = totalArea / paint.coverage;
  const safeLiters = liters * 1.12;
  const cans5L = Math.ceil(safeLiters / 5);
  return { wallArea, netArea, liters, safeLiters, cans5L, coverage: paint.coverage };
}

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

function Stepper({ id, value, min = 0, max = 20, onChange, label }) {
  return (
    <div id={id} className="tool-v2-stepper" role="group" aria-label={label}>
      <button
        type="button"
        className="tool-v2-stepper-btn"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label={`تقليل ${label}`}
      >
        <Minus size={15} weight="bold" />
      </button>
      <span className="tool-v2-stepper-val" aria-live="polite">{value}</span>
      <button
        type="button"
        className="tool-v2-stepper-btn"
        onClick={() => onChange(Math.min(max, value + 1))}
        aria-label={`زيادة ${label}`}
      >
        <Plus size={15} weight="bold" />
      </button>
    </div>
  );
}

async function shareResult(title, text) {
  if (navigator.share) {
    try {
      await navigator.share({ title, text });
      return;
    } catch {
      // user cancelled — fall through to clipboard
    }
  }
  try {
    await navigator.clipboard.writeText(text);
    toast.success('تم نسخ النتيجة إلى الحافظة');
  } catch {
    toast.error('تعذر نسخ النتيجة');
  }
}

export default function PaintCalculator() {
  const [length, setLength] = useState('4');
  const [width, setWidth] = useState('3');
  const [height, setHeight] = useState('2.8');
  const [doors, setDoors] = useState(1);
  const [windows, setWindows] = useState(1);
  const [coats, setCoats] = useState(2);
  const [paintId, setPaintId] = useState('interior_standard');

  const l = Math.max(0, Number(length) || 0);
  const w = Math.max(0, Number(width) || 0);
  const h = Math.max(0, Number(height) || 0);
  const hasInput = l > 0 && w > 0 && h > 0;
  const result = hasInput ? calcPaint({ length: l, width: w, height: h, doors, windows, coats, paintId }) : null;
  const selectedPaint = PAINT_TYPES.find((p) => p.id === paintId);

  const shareText = result
    ? `حاسبة الدهان: تحتاج تقريباً ${result.cans5L} علبة 5 لتر (${fmt(result.safeLiters, 1)} لتر) لغرفة ${l}×${w} بارتفاع ${h} م`
    : '';

  return (
    <div aria-label="حاسبة الدهان">
      <div className="tool-v2-panel-head">
        <span className="tool-v2-country-badge"><span className="tool-v2-live-dot" aria-hidden="true" /> حسب نوع الدهان ومعدل تغطيته</span>
      </div>

      <div className="tool-v2-field-row-pair">
        <div className="tool-v2-field">
          <label htmlFor="paint-length">طول الغرفة (م)</label>
          <input id="paint-length" type="number" inputMode="decimal" min="0" step="0.1" value={length} onChange={(e) => setLength(e.target.value)} />
        </div>
        <div className="tool-v2-field">
          <label htmlFor="paint-width">عرض الغرفة (م)</label>
          <input id="paint-width" type="number" inputMode="decimal" min="0" step="0.1" value={width} onChange={(e) => setWidth(e.target.value)} />
        </div>
      </div>

      <div className="tool-v2-field">
        <label htmlFor="paint-height">
          ارتفاع الجدار (م)
          <FieldHint text="مساحة الدهان = محيط الغرفة × الارتفاع، وليس مساحة الأرضية — غرفة 12م² أرضية قد تحتاج 30-40م² دهاناً على الجدران." />
        </label>
        <input id="paint-height" type="number" inputMode="decimal" min="0" step="0.1" value={height} onChange={(e) => setHeight(e.target.value)} />
      </div>

      <div className="tool-v2-field-row-pair">
        <div className="tool-v2-field">
          <label htmlFor="paint-doors-stepper">عدد الأبواب</label>
          <Stepper id="paint-doors-stepper" value={doors} onChange={setDoors} label="عدد الأبواب" />
        </div>
        <div className="tool-v2-field">
          <label htmlFor="paint-windows-stepper">عدد النوافذ</label>
          <Stepper id="paint-windows-stepper" value={windows} onChange={setWindows} label="عدد النوافذ" />
        </div>
      </div>

      <div className="tool-v2-field">
        <label>نوع الدهان</label>
        <div className="tool-v2-choice-list">
          {PAINT_TYPES.map((p) => {
            const Icon = p.icon;
            const active = paintId === p.id;
            return (
              <label
                key={p.id}
                className={`tool-v2-choice-card${active ? ' is-active' : ''}`}
                htmlFor={`paint-${p.id}`}
              >
                <input
                  type="radio"
                  id={`paint-${p.id}`}
                  name="paint-type"
                  checked={active}
                  onChange={() => setPaintId(p.id)}
                />
                <span className={`tool-v2-choice-icon tool-v2-choice-icon--${p.color}`} aria-hidden="true">
                  <Icon size={18} weight="bold" />
                </span>
                <span className="tool-v2-choice-body">
                  <span className="tool-v2-choice-title">
                    {p.label}
                    {p.badge ? <span className="tool-v2-choice-badge">{p.badge}</span> : null}
                  </span>
                  <span className="tool-v2-choice-desc">{p.desc}</span>
                </span>
              </label>
            );
          })}
        </div>
      </div>

      <div className="tool-v2-field">
        <label htmlFor="paint-coats">
          عدد الطبقات
          <FieldHint text="طبقتان هو المعيار الشائع لتغطية جيدة ومنع اللون القديم من الظهور." />
        </label>
        <select id="paint-coats" value={coats} onChange={(e) => setCoats(Number(e.target.value))}>
          <option value={1}>طبقة واحدة</option>
          <option value={2}>طبقتان (الأكثر شيوعاً)</option>
          <option value={3}>3 طبقات</option>
        </select>
      </div>

      {result ? (
        <div aria-live="polite">
          <div className="tool-v2-result-hero">
            <span className="tool-v2-result-label">عدد العلب المطلوبة للشراء</span>
            <div className="tool-v2-result-stat-row">
              <span className="tool-v2-result-stat">
                <span className="tool-v2-result-stat-value">{result.cans5L}</span>
                <span className="tool-v2-result-stat-label">علبة</span>
              </span>
              <span className="tool-v2-result-stat-sep" aria-hidden="true">×</span>
              <span className="tool-v2-result-stat">
                <span className="tool-v2-result-stat-value">5</span>
                <span className="tool-v2-result-stat-label">لتر لكل علبة</span>
              </span>
            </div>
            <div className="tool-v2-result-meta">إجمالي الكمية ≈ {fmt(result.safeLiters, 1)} لتر — {selectedPaint?.label}</div>
          </div>

          <div className="tool-v2-note-strip">
            <ShieldCheck size={15} weight="fill" />
            <span>هذا الرقم جاهز للشراء مباشرة — يشمل احتياطاً إضافياً حتى لا تنقصك الكمية أثناء العمل بسبب زوايا أو إصلاحات بسيطة.</span>
          </div>

          <div className="tool-v2-breakdown-list">
            <div className="tool-v2-breakdown-row">
              <span className="tool-v2-breakdown-label">مساحة الجدران الصافية</span>
              <span className="tool-v2-breakdown-value">{fmt(result.netArea, 1)} م²</span>
            </div>
            <div className="tool-v2-breakdown-row">
              <span className="tool-v2-breakdown-label">الكمية الأساسية (بلا احتياط)</span>
              <span className="tool-v2-breakdown-value">{fmt(result.liters, 1)} لتر</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="tool-v2-empty-state">
          <Warning size={28} weight="duotone" />
          <p>أدخل أبعاد غرفة صحيحة (الطول والعرض والارتفاع).</p>
        </div>
      )}

      <div className="tool-v2-action-row">
        <button
          type="button"
          className="tool-v2-action-btn is-primary"
          onClick={() => shareResult('حاسبة الدهان', shareText)}
          disabled={!result}
        >
          <ShareIcon size={18} weight="bold" /> مشاركة
        </button>
      </div>
    </div>
  );
}
