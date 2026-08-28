"use client";

import { useMemo, useState } from 'react';
import { Alarm, ClockCountdown, MoonStars } from '@phosphor-icons/react';
import { toast } from 'sonner';
import PremiumSelect from '@/components/tools-v2/PremiumSelect.client';
import {
  QUICK_WAKE_TIMES,
  SLEEP_CYCLE_OPTIONS,
  SLEEP_LATENCY_OPTIONS,
  calculateBedtimes,
  formatHoursLabel,
} from '@/lib/sleep/calculator';

async function shareResult(title, text) {
  if (navigator.share) {
    try { await navigator.share({ title, text }); return; } catch { /* cancelled */ }
  }
  try { await navigator.clipboard.writeText(text); toast.success('تم نسخ النتيجة إلى الحافظة'); }
  catch { toast.error('تعذر نسخ النتيجة'); }
}

export default function BedtimeTool() {
  const [wakeTime, setWakeTime] = useState('06:00');
  const [age, setAge] = useState('25');
  const [latencyMinutes, setLatencyMinutes] = useState('15');
  const [cycleMinutes, setCycleMinutes] = useState('90');

  const result = useMemo(
    () => calculateBedtimes({ wakeTime, age, latencyMinutes, cycleMinutes }),
    [wakeTime, age, latencyMinutes, cycleMinutes],
  );

  const shareText = result.isValid
    ? `أفضل وقت نوم مقترح: ${result.bestOption.bedtimeLabel} (${result.bestOption.cycles} دورات، ${formatHoursLabel(result.bestOption.hours, 1)})`
    : '';

  return (
    <div aria-label="حاسبة متى أنام">
      <div className="tool-v2-panel-head">
        <span className="tool-v2-country-badge"><MoonStars size={14} weight="bold" /> حسب دورات النوم <span className="tool-v2-live-dot" aria-hidden="true" /></span>
      </div>

      <div className="tool-v2-field">
        <label htmlFor="bedtime-wake">وقت الاستيقاظ</label>
        <input id="bedtime-wake" type="time" value={wakeTime} onChange={(e) => setWakeTime(e.target.value)} />
        <div className="tool-v2-option-list--grid" style={{ display: 'flex', marginTop: 'var(--space-2)' }}>
          {QUICK_WAKE_TIMES.map((time) => (
            <button key={time} type="button" className={`tool-v2-chip${wakeTime === time ? ' is-active' : ''}`} onClick={() => setWakeTime(time)}>{time}</button>
          ))}
        </div>
      </div>

      <div className="tool-v2-field-row-pair">
        <div className="tool-v2-field">
          <label htmlFor="bedtime-age">العمر</label>
          <input id="bedtime-age" type="number" inputMode="numeric" value={age} onChange={(e) => setAge(e.target.value)} />
        </div>
        <div className="tool-v2-field">
          <label htmlFor="bedtime-latency">وقت الغفو</label>
          <PremiumSelect
            id="bedtime-latency"
            value={latencyMinutes}
            onChange={setLatencyMinutes}
            options={SLEEP_LATENCY_OPTIONS.map((item) => ({ value: item, label: `${item} دقيقة` }))}
          />
        </div>
      </div>
      <div className="tool-v2-field">
        <label htmlFor="bedtime-cycle">طول الدورة</label>
        <PremiumSelect
          id="bedtime-cycle"
          value={cycleMinutes}
          onChange={setCycleMinutes}
          options={SLEEP_CYCLE_OPTIONS.map((item) => ({ value: item, label: `${item} دقيقة` }))}
        />
      </div>

      {result.isValid ? (
        <div aria-live="polite">
          <div className="tool-v2-result-hero">
            <span className="tool-v2-result-label">أفضل وقت للنوم الآن</span>
            <div className="tool-v2-result-value">{result.bestOption.bedtimeLabel}</div>
            <div className="tool-v2-result-meta">{result.bestOption.cycles} دورات · {formatHoursLabel(result.bestOption.hours, 1)}</div>
          </div>

          <div className="tool-v2-breakdown-list">
            {result.options?.slice(0, 5).map((option) => {
              const isBest = option.bedtimeLabel === result.bestOption?.bedtimeLabel;
              return (
                <div className="tool-v2-breakdown-row" key={`${option.cycles}-${option.bedtimeLabel}`}>
                  <span className="tool-v2-breakdown-label">{isBest ? '★ ' : ''}{option.bedtimeLabel}</span>
                  <span className="tool-v2-breakdown-value">{option.durationLabel} — {option.status?.label}</span>
                </div>
              );
            })}
          </div>

          <div className="tool-v2-note-strip">
            <Alarm size={15} weight="fill" />
            <span>الاستيقاظ: {result.wakeLabel || '—'}{result.range ? ` — النطاق الموصى به لعمرك: ${result.range.recommendedMin}–${result.range.recommendedMax} ساعات` : ''}</span>
          </div>

          <div className="tool-v2-action-row">
            <button type="button" className="tool-v2-action-btn is-primary" onClick={() => shareResult('حاسبة متى أنام', shareText)}>
              <ClockCountdown size={18} weight="bold" /> مشاركة
            </button>
          </div>
        </div>
      ) : (
        <div className="tool-v2-empty-state">
          <MoonStars size={28} weight="duotone" />
          <p>أدخل وقت الاستيقاظ لعرض أفضل أوقات النوم المقترحة.</p>
        </div>
      )}
    </div>
  );
}
