'use client';

import { useState, useMemo } from 'react';
import { calculateInheritance, fractionLabel } from '@/lib/calculators/inheritance';

const CURRENCY = [
  { id: 'SAR', label: 'ريال سعودي' },
  { id: 'AED', label: 'درهم إماراتي' },
  { id: 'KWD', label: 'دينار كويتي' },
  { id: 'QAR', label: 'ريال قطري' },
  { id: 'EGP', label: 'جنيه مصري' },
];

function formatMoney(v, cur) {
  return v.toLocaleString('ar-SA', { style: 'currency', currency: cur, maximumFractionDigits: 0 });
}

const HEIR_COLORS = {
  husband: '#2563eb',
  wife: '#7c3aed', wife_1: '#7c3aed', wife_2: '#9333ea', wife_3: '#a855f7', wife_4: '#c084fc',
  father: '#ea580c',
  mother: '#d97706',
  sons: '#16a34a',
  daughters: '#15803d',
  fullBrothers: '#0891b2',
  fullSisters: '#0e7490',
};

function PieChart({ results, estate }) {
  const size = 180;
  const cx = size / 2, cy = size / 2, r = 75;
  let startAngle = -Math.PI / 2;
  const slices = results.map(h => {
    const pct = h.amount / estate;
    const angle = pct * 2 * Math.PI;
    const x1 = cx + r * Math.cos(startAngle);
    const y1 = cy + r * Math.sin(startAngle);
    const endAngle = startAngle + angle;
    const x2 = cx + r * Math.cos(endAngle);
    const y2 = cy + r * Math.sin(endAngle);
    const large = angle > Math.PI ? 1 : 0;
    const path = `M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${large},1 ${x2},${y2} Z`;
    const slice = { ...h, path, color: HEIR_COLORS[h.key] ?? '#94a3b8' };
    startAngle = endAngle;
    return slice;
  });

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="mx-auto">
      {slices.map(s => (
        <path key={s.key} d={s.path} fill={s.color} stroke="white" strokeWidth="2" />
      ))}
    </svg>
  );
}

export default function InheritanceCalculator() {
  const [currency, setCurrency] = useState('SAR');
  const [estateInput, setEstateInput] = useState('');
  const [hasHusband, setHasHusband] = useState(false);
  const [hasWife, setHasWife] = useState(false);
  const [wivesCount, setWivesCount] = useState(1);
  const [hasFather, setHasFather] = useState(false);
  const [hasMother, setHasMother] = useState(false);
  const [sons, setSons] = useState(0);
  const [daughters, setDaughters] = useState(0);
  const [fullBrothers, setFullBrothers] = useState(0);
  const [fullSisters, setFullSisters] = useState(0);

  const estate = parseFloat(estateInput.replace(/,/g, '')) || 0;

  const result = useMemo(() => {
    if (estate <= 0) return null;
    if (!hasHusband && !hasWife && !hasFather && !hasMother && sons === 0 && daughters === 0 && fullBrothers === 0 && fullSisters === 0) return null;
    return calculateInheritance({
      estate, hasHusband, hasWife, wivesCount,
      hasFather, hasMother, sons, daughters,
      fullBrothers, fullSisters,
    });
  }, [estate, hasHusband, hasWife, wivesCount, hasFather, hasMother, sons, daughters, fullBrothers, fullSisters]);

  function toggle(val, setter) { setter(v => !v); }

  function NumStepper({ label, value, onChange }) {
    return (
      <div className="flex items-center justify-between">
        <span className="text-sm">{label}</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onChange(Math.max(0, value - 1))}
            className="w-7 h-7 rounded border text-lg leading-none hover:bg-muted disabled:opacity-40"
            disabled={value === 0}
          >-</button>
          <span className="w-6 text-center font-bold text-sm">{value}</span>
          <button
            onClick={() => onChange(Math.min(20, value + 1))}
            className="w-7 h-7 rounded border text-lg leading-none hover:bg-muted"
          >+</button>
        </div>
      </div>
    );
  }

  return (
    <div className="inheritance-calc space-y-5">
      {/* Estate + Currency */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-2">قيمة التركة الإجمالية</label>
          <input
            type="text"
            inputMode="numeric"
            value={estateInput}
            onChange={e => setEstateInput(e.target.value.replace(/[^0-9.,]/g, ''))}
            placeholder="مثال: 500000"
            className="w-full border rounded-lg px-3 py-2 bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            dir="ltr"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">العملة</label>
          <select
            value={currency}
            onChange={e => setCurrency(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            dir="rtl"
          >
            {CURRENCY.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
          </select>
        </div>
      </div>

      {/* Spouse — mutually exclusive */}
      <div>
        <label className="block text-sm font-medium mb-2">الزوج / الزوجة</label>
        <div className="flex gap-2 flex-wrap">
          {[
            { label: 'زوج', val: 'husband', active: hasHusband },
            { label: 'زوجة', val: 'wife', active: hasWife },
          ].map(btn => (
            <button
              key={btn.val}
              onClick={() => {
                if (btn.val === 'husband') { setHasHusband(v => !v); setHasWife(false); }
                else { setHasWife(v => !v); setHasHusband(false); }
              }}
              className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${btn.active ? 'bg-primary text-primary-foreground border-primary' : 'bg-card hover:bg-muted border-border'}`}
            >
              {btn.label}
            </button>
          ))}
          {hasWife && (
            <div className="w-full mt-2">
              <NumStepper label="عدد الزوجات" value={wivesCount} onChange={setWivesCount} />
            </div>
          )}
        </div>
      </div>

      {/* Parents */}
      <div>
        <label className="block text-sm font-medium mb-2">الوالدان</label>
        <div className="flex gap-2">
          {[
            { label: 'الأب', active: hasFather, setter: setHasFather },
            { label: 'الأم', active: hasMother, setter: setHasMother },
          ].map(btn => (
            <button
              key={btn.label}
              onClick={() => btn.setter(v => !v)}
              className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${btn.active ? 'bg-primary text-primary-foreground border-primary' : 'bg-card hover:bg-muted border-border'}`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Children */}
      <div>
        <label className="block text-sm font-medium mb-2">الأبناء</label>
        <div className="space-y-2 bg-muted/30 rounded-lg p-3">
          <NumStepper label="أبناء (ذكور)" value={sons} onChange={setSons} />
          <NumStepper label="بنات (إناث)" value={daughters} onChange={setDaughters} />
        </div>
      </div>

      {/* Siblings */}
      <div>
        <label className="block text-sm font-medium mb-2">الإخوة والأخوات الأشقاء</label>
        {(hasFather || sons > 0) && (
          <p className="text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 rounded px-3 py-1.5 mb-2">
            الإخوة والأخوات محجوبون {hasFather ? 'بوجود الأب' : 'بوجود الأبناء'}
          </p>
        )}
        <div className="space-y-2 bg-muted/30 rounded-lg p-3">
          <NumStepper label="إخوة أشقاء" value={fullBrothers} onChange={setFullBrothers} />
          <NumStepper label="أخوات شقيقات" value={fullSisters} onChange={setFullSisters} />
        </div>
      </div>

      {/* Result */}
      {result?.isValid && (
        <div className="rounded-xl border overflow-hidden">
          <div className="bg-primary/5 px-5 py-4 border-b">
            <div className="text-sm font-medium mb-0.5">توزيع الإرث</div>
            <div className="text-xs text-muted-foreground">
              التركة: {estate.toLocaleString('ar-SA')} {currency}
              {result.awl && ' — (مُعال: تجاوزت الفروض التركة وتم التوزيع بالتناسب)'}
            </div>
          </div>

          {result.warnings.length > 0 && (
            <div className="px-5 py-3 bg-amber-50 dark:bg-amber-950/20 border-b border-amber-200 dark:border-amber-800">
              {result.warnings.map((w, i) => (
                <p key={i} className="text-xs text-amber-800 dark:text-amber-300">⚠ {w}</p>
              ))}
            </div>
          )}

          {/* Pie chart */}
          <div className="py-5 border-b">
            <PieChart results={result.results} estate={estate} />
          </div>

          {/* Heir rows */}
          <div className="divide-y bg-card">
            {result.results.map(h => (
              <div key={h.key} className="flex items-center gap-3 px-5 py-3.5">
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: HEIR_COLORS[h.key] ?? '#94a3b8' }} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium">
                    {h.label}
                    {h.count > 1 && <span className="text-muted-foreground font-normal text-xs mr-1">({h.count} أفراد)</span>}
                  </div>
                  {h.fraction && (
                    <div className="text-xs text-muted-foreground">
                      {fractionLabel(h.fraction)} ({h.percent.toFixed(1)}%)
                    </div>
                  )}
                  {!h.fraction && (
                    <div className="text-xs text-muted-foreground">{h.percent.toFixed(1)}%</div>
                  )}
                  {h.note && <div className="text-xs text-muted-foreground/70 mt-0.5">{h.note}</div>}
                </div>
                <div className="text-left">
                  <div className="font-bold text-sm tabular-nums">{formatMoney(h.amount, currency)}</div>
                  {h.count > 1 && (
                    <div className="text-xs text-muted-foreground tabular-nums">
                      {formatMoney(h.amount / h.count, currency)} / فرد
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="text-xs text-muted-foreground bg-muted/40 rounded-lg px-4 py-3 leading-relaxed">
        <strong className="text-foreground/70">تنبيه شرعي:</strong> هذه الحاسبة للاسترشاد والتخطيط المبدئي فقط. توزيع الإرث الفعلي يستلزم مراجعة قاضٍ أو عالم شرعي متخصص، خاصةً في الحالات التي تشمل وصية أو ديوناً أو ورثة غائبين أو مفقودين.
      </div>
    </div>
  );
}
