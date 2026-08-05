"use client";

import { useMemo, useState } from 'react';
import { Baby, MoonStars, ShareNetwork, UserCircle } from '@phosphor-icons/react';
import { toast } from 'sonner';
import { SLEEP_NEED_RANGES, getSleepNeedByAge } from '@/lib/sleep/calculator';

async function shareResult(title, text) {
  if (navigator.share) {
    try { await navigator.share({ title, text }); return; } catch { /* cancelled */ }
  }
  try { await navigator.clipboard.writeText(text); toast.success('تم نسخ النتيجة إلى الحافظة'); }
  catch { toast.error('تعذر نسخ النتيجة'); }
}

export default function SleepNeedsByAgeTool() {
  const [age, setAge] = useState('25');
  const range = useMemo(() => getSleepNeedByAge(age), [age]);

  const shareText = `احتياج النوم لعمر ${age} سنة: ${range.recommendedMin}–${range.recommendedMax} ساعات`;

  return (
    <div aria-label="حاسبة احتياج النوم حسب العمر">
      <div className="tool-v2-panel-head">
        <span className="tool-v2-country-badge"><Baby size={14} weight="bold" /> من الرضيع إلى كبار السن <span className="tool-v2-live-dot" aria-hidden="true" /></span>
      </div>

      <div className="tool-v2-field">
        <label htmlFor="needs-age">العمر بالسنوات</label>
        <input id="needs-age" type="number" inputMode="numeric" value={age} onChange={(e) => setAge(e.target.value)} />
      </div>

      <div aria-live="polite">
        <div className="tool-v2-result-hero">
          <span className="tool-v2-result-label">النطاق المناسب الآن</span>
          <div className="tool-v2-result-value">{range.recommendedMin}–{range.recommendedMax} ساعات</div>
          <div className="tool-v2-result-meta">{range.label}</div>
        </div>

        <div className="tool-v2-mini-block-head" style={{ marginTop: 'var(--space-4)' }}>
          <MoonStars size={14} weight="bold" />
          <span>جدول النوم حسب العمر</span>
        </div>
        <div className="tool-v2-table-wrap">
          <table className="tool-v2-table">
            <tbody>
              {SLEEP_NEED_RANGES.map((item) => (
                <tr key={item.id} style={item.id === range.id ? { fontWeight: 700, color: 'var(--green-text)' } : undefined}>
                  <td>{item.label}{item.id === range.id ? ' ← عمرك' : ''}</td>
                  <td>{item.recommendedMin}–{item.recommendedMax} ساعات</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="tool-v2-note-strip">
          <UserCircle size={15} weight="fill" />
          <span>إذا كنت داخل النطاق وما زلت متعباً، انتقل إلى حاسبة مدة النوم الفعلية أو دين النوم لفهم الصورة بشكل أعمق.</span>
        </div>

        <div className="tool-v2-action-row">
          <button type="button" className="tool-v2-action-btn is-primary" onClick={() => shareResult('احتياج النوم حسب العمر', shareText)}>
            <ShareNetwork size={18} weight="bold" /> مشاركة
          </button>
        </div>
      </div>
    </div>
  );
}
