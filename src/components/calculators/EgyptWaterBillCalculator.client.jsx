'use client';

import { useMemo, useState } from 'react';
import { Drop, ShareNetwork, Warning } from '@phosphor-icons/react';
import { toast } from 'sonner';

import CountryFlag from '@/components/shared/CountryFlag';
import { calculateEgyptWaterBill } from '@/lib/calculators/electricity-bill';

function fmt(n, dec = 2) {
  return n.toLocaleString('ar-EG-u-nu-latn', { minimumFractionDigits: dec, maximumFractionDigits: dec });
}

const PRESETS = [
  { label: 'شخص واحد', m3: 4 },
  { label: 'أسرة صغيرة', m3: 10 },
  { label: 'أسرة متوسطة', m3: 18 },
  { label: 'أسرة كبيرة', m3: 28 },
];

async function shareResult(title, text) {
  if (navigator.share) {
    try { await navigator.share({ title, text }); return; } catch { /* cancelled */ }
  }
  try { await navigator.clipboard.writeText(text); toast.success('تم نسخ النتيجة إلى الحافظة'); }
  catch { toast.error('تعذر نسخ النتيجة'); }
}

export default function EgyptWaterBillCalculator() {
  const [m3Input, setM3Input] = useState('');

  const m3 = parseFloat(m3Input) || 0;
  const result = useMemo(() => (m3 > 0 ? calculateEgyptWaterBill(m3) : null), [m3]);

  const shareText = result
    ? `فاتورة المياه مصر\nالاستهلاك: ${m3} م³\nإجمالي الفاتورة: ${fmt(result.total)} ج.م`
    : '';

  return (
    <div aria-label="حاسبة فاتورة المياه مصر">
      <div className="tool-v2-panel-head">
        <span className="tool-v2-country-badge"><CountryFlag code="eg" /> مصر <span className="tool-v2-live-dot" aria-hidden="true" /></span>
      </div>

      <div className="tool-v2-field">
        <label htmlFor="eg-water-m3">الاستهلاك الشهري (متر مكعب)</label>
        <input id="eg-water-m3" type="number" inputMode="decimal" value={m3Input} onChange={(e) => setM3Input(e.target.value)} placeholder="15" />
        <span className="tool-v2-option-hint">الرقم موجود في فاتورة الشركة القابضة للمياه والصرف الصحي.</span>
      </div>

      <div className="tool-v2-field">
        <label>اختيار سريع</label>
        <div className="tool-v2-option-list tool-v2-option-list--grid" role="group" aria-label="اختيار سريع">
          {PRESETS.map((p) => (
            <button key={p.m3} type="button" className={`tool-v2-chip${m3 === p.m3 ? ' is-active' : ''}`} onClick={() => setM3Input(String(p.m3))}>
              {p.label} ({p.m3} م³)
            </button>
          ))}
        </div>
      </div>

      {result ? (
        <div aria-live="polite">
          <div className="tool-v2-result-hero">
            <span className="tool-v2-result-label">إجمالي فاتورة المياه الشهرية</span>
            <div className="tool-v2-result-value">{fmt(result.total)} ج.م</div>
            <div className="tool-v2-result-meta">{m3} م³ — شاملة الصرف الصحي والضريبة</div>
          </div>

          <div className="tool-v2-breakdown-list">
            {result.tierBreakdown.map((t, i) => (
              <div key={i} className="tool-v2-breakdown-row">
                <span className="tool-v2-breakdown-label">{t.from}–{t.to} م³ × {fmt(t.rate, 2)} ج.م/م³</span>
                <span className="tool-v2-breakdown-value">{fmt(t.charge)} ج.م</span>
              </div>
            ))}
            <div className="tool-v2-breakdown-row"><span className="tool-v2-breakdown-label">رسوم الصرف الصحي (65%)</span><span className="tool-v2-breakdown-value">{fmt(result.sewageCharge)} ج.م</span></div>
            <div className="tool-v2-breakdown-row"><span className="tool-v2-breakdown-label">الرسم التنظيمي</span><span className="tool-v2-breakdown-value">{fmt(result.regFee)} ج.م</span></div>
            <div className="tool-v2-breakdown-row"><span className="tool-v2-breakdown-label">ضريبة القيمة المضافة 14%</span><span className="tool-v2-breakdown-value">{fmt(result.vat)} ج.م</span></div>
          </div>

          <div className="tool-v2-note-strip">
            <Warning size={15} weight="fill" />
            <span>تقدير بناءً على تعريفة الشركة القابضة للمياه (HCWW) — تختلف أسعار المحافظات قليلاً.</span>
          </div>

          <div className="tool-v2-action-row">
            <button type="button" className="tool-v2-action-btn is-primary" onClick={() => shareResult('حاسبة فاتورة المياه مصر', shareText)}>
              <ShareNetwork size={18} weight="bold" /> مشاركة
            </button>
          </div>
        </div>
      ) : (
        <div className="tool-v2-empty-state">
          <Drop size={28} weight="duotone" />
          <p>أدخل استهلاكك الشهري بالمتر المكعب أو اختر نموذجاً جاهزاً.</p>
        </div>
      )}
    </div>
  );
}
