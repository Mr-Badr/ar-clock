"use client";

import { useMemo, useState } from 'react';
import { Coffee, MoonStars, ShareNetwork, Timer } from '@phosphor-icons/react';
import { toast } from 'sonner';
import PremiumSelect from '@/components/tools-v2/PremiumSelect.client';
import { NAP_DURATION_OPTIONS, SLEEP_LATENCY_OPTIONS, calculateNap } from '@/lib/sleep/calculator';

async function shareResult(title, text) {
  if (navigator.share) {
    try { await navigator.share({ title, text }); return; } catch { /* cancelled */ }
  }
  try { await navigator.clipboard.writeText(text); toast.success('تم نسخ النتيجة إلى الحافظة'); }
  catch { toast.error('تعذر نسخ النتيجة'); }
}

export default function NapTool() {
  const [startTime, setStartTime] = useState('14:00');
  const [napMinutes, setNapMinutes] = useState('20');
  const [latencyMinutes, setLatencyMinutes] = useState('10');
  const [bedtime, setBedtime] = useState('23:00');

  const result = useMemo(
    () => calculateNap({ startTime, napMinutes, latencyMinutes, bedtime }),
    [startTime, napMinutes, latencyMinutes, bedtime],
  );

  const shareText = result.isValid
    ? `القيلولة: ${result.napLabel} — استيقاظ ${result.wakeTimeLabel}`
    : '';

  return (
    <div aria-label="حاسبة القيلولة">
      <div className="tool-v2-panel-head">
        <span className="tool-v2-country-badge"><Coffee size={14} weight="bold" /> اختر هدف القيلولة <span className="tool-v2-live-dot" aria-hidden="true" /></span>
      </div>

      <div className="tool-v2-field-row-pair">
        <div className="tool-v2-field">
          <label htmlFor="nap-start">وقت بدء القيلولة</label>
          <input id="nap-start" type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
        </div>
        <div className="tool-v2-field">
          <label htmlFor="nap-bedtime">وقت نومك الليلي المعتاد</label>
          <input id="nap-bedtime" type="time" value={bedtime} onChange={(e) => setBedtime(e.target.value)} />
        </div>
      </div>
      <div className="tool-v2-field-row-pair">
        <div className="tool-v2-field">
          <label htmlFor="nap-length">نوع القيلولة</label>
          <PremiumSelect
            id="nap-length"
            value={napMinutes}
            onChange={setNapMinutes}
            options={NAP_DURATION_OPTIONS.map((item) => ({ value: item.value, label: item.label }))}
          />
        </div>
        <div className="tool-v2-field">
          <label htmlFor="nap-latency">وقت الغفو</label>
          <PremiumSelect
            id="nap-latency"
            value={latencyMinutes}
            onChange={setLatencyMinutes}
            options={SLEEP_LATENCY_OPTIONS.map((item) => ({ value: item, label: `${item} دقيقة` }))}
          />
        </div>
      </div>

      {result.isValid ? (
        <div aria-live="polite">
          <div className="tool-v2-result-hero">
            <span className="tool-v2-result-label">وقت الاستيقاظ المقترح</span>
            <div className="tool-v2-result-value">{result.wakeTimeLabel || '—'}</div>
            <div className="tool-v2-result-meta">{result.napDescription}</div>
          </div>

          <div className="tool-v2-breakdown-list">
            <div className="tool-v2-breakdown-row"><span className="tool-v2-breakdown-label"><Coffee size={14} weight="bold" style={{ verticalAlign: '-2px' }} /> الخمول المحتمل</span><span className="tool-v2-breakdown-value">{result.inertiaRisk || '—'}</span></div>
            <div className="tool-v2-breakdown-row"><span className="tool-v2-breakdown-label"><Timer size={14} weight="bold" style={{ verticalAlign: '-2px' }} /> هل القيلولة متأخرة؟</span><span className="tool-v2-breakdown-value">{result.isLate ? 'متأخرة نسبياً' : 'في وقت مقبول'}</span></div>
          </div>

          <div className="tool-v2-note-strip">
            <MoonStars size={15} weight="fill" />
            <span>{result.timingNote}</span>
          </div>

          <div className="tool-v2-action-row">
            <button type="button" className="tool-v2-action-btn is-primary" onClick={() => shareResult('حاسبة القيلولة', shareText)}>
              <ShareNetwork size={18} weight="bold" /> مشاركة
            </button>
          </div>
        </div>
      ) : (
        <div className="tool-v2-empty-state">
          <Coffee size={28} weight="duotone" />
          <p>اختر وقت القيلولة ونوعها لمعرفة أفضل وقت استيقاظ.</p>
        </div>
      )}
    </div>
  );
}
