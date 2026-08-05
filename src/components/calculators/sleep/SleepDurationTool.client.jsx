"use client";

import { useMemo, useState } from 'react';
import { Bed, MoonStars, ShareNetwork, Timer } from '@phosphor-icons/react';
import { toast } from 'sonner';
import { calculateSleepDuration } from '@/lib/sleep/calculator';

async function shareResult(title, text) {
  if (navigator.share) {
    try { await navigator.share({ title, text }); return; } catch { /* cancelled */ }
  }
  try { await navigator.clipboard.writeText(text); toast.success('تم نسخ النتيجة إلى الحافظة'); }
  catch { toast.error('تعذر نسخ النتيجة'); }
}

export default function SleepDurationTool() {
  const [sleepTime, setSleepTime] = useState('23:00');
  const [wakeTime, setWakeTime] = useState('07:00');
  const [age, setAge] = useState('25');
  const [awakeMinutes, setAwakeMinutes] = useState('0');

  const result = useMemo(
    () => calculateSleepDuration({ sleepTime, wakeTime, awakeMinutes, age }),
    [sleepTime, wakeTime, awakeMinutes, age],
  );

  const shareText = result.isValid
    ? `صافي النوم: ${result.netSleepLabel} — ${result.status?.label}`
    : '';

  return (
    <div aria-label="حاسبة مدة النوم الفعلية">
      <div className="tool-v2-panel-head">
        <span className="tool-v2-country-badge"><Timer size={14} weight="bold" /> النوم الفعلي لا الظاهري <span className="tool-v2-live-dot" aria-hidden="true" /></span>
      </div>

      <div className="tool-v2-field-row-pair">
        <div className="tool-v2-field">
          <label htmlFor="sd-sleep">وقت النوم</label>
          <input id="sd-sleep" type="time" value={sleepTime} onChange={(e) => setSleepTime(e.target.value)} />
        </div>
        <div className="tool-v2-field">
          <label htmlFor="sd-wake">وقت الاستيقاظ</label>
          <input id="sd-wake" type="time" value={wakeTime} onChange={(e) => setWakeTime(e.target.value)} />
        </div>
      </div>
      <div className="tool-v2-field-row-pair">
        <div className="tool-v2-field">
          <label htmlFor="sd-age">العمر</label>
          <input id="sd-age" type="number" inputMode="numeric" value={age} onChange={(e) => setAge(e.target.value)} />
        </div>
        <div className="tool-v2-field">
          <label htmlFor="sd-awake">دقائق الاستيقاظ الليلي</label>
          <input id="sd-awake" type="number" inputMode="numeric" value={awakeMinutes} onChange={(e) => setAwakeMinutes(e.target.value)} />
        </div>
      </div>
      <p className="tool-v2-field-hint">إذا كنت تريد التخطيط لوقت النوم قبل أن تنام، فاستخدم حاسبة "متى أنام" بدل هذه — هذه الأداة تقيس ما حدث فعلياً.</p>

      {result.isValid ? (
        <div aria-live="polite">
          <div className="tool-v2-result-hero">
            <span className="tool-v2-result-label">صافي النوم الفعلي</span>
            <div className="tool-v2-result-value">{result.netSleepLabel || '—'}</div>
            <div className="tool-v2-result-meta">{result.status?.label} — {result.status?.note}</div>
          </div>

          <div className="tool-v2-breakdown-list">
            <div className="tool-v2-breakdown-row"><span className="tool-v2-breakdown-label"><Bed size={14} weight="bold" style={{ verticalAlign: '-2px' }} /> الوقت في السرير</span><span className="tool-v2-breakdown-value">{result.totalInBedLabel || '—'}</span></div>
            <div className="tool-v2-breakdown-row"><span className="tool-v2-breakdown-label"><Timer size={14} weight="bold" style={{ verticalAlign: '-2px' }} /> دقائق الاستيقاظ</span><span className="tool-v2-breakdown-value">{result.awakeLabel || '—'}</span></div>
          </div>

          <div className="tool-v2-note-strip">
            <MoonStars size={15} weight="fill" />
            <span>{result.fatigueHint}</span>
          </div>

          <div className="tool-v2-action-row">
            <button type="button" className="tool-v2-action-btn is-primary" onClick={() => shareResult('حاسبة مدة النوم الفعلية', shareText)}>
              <ShareNetwork size={18} weight="bold" /> مشاركة
            </button>
          </div>
        </div>
      ) : (
        <div className="tool-v2-empty-state">
          <Bed size={28} weight="duotone" />
          <p>أدخل وقت النوم والاستيقاظ لمعرفة صافي نومك الفعلي.</p>
        </div>
      )}
    </div>
  );
}
