"use client";

import { useEffect, useMemo, useState } from 'react';
import { Alarm, ArrowsClockwise, Bed } from '@phosphor-icons/react';
import { toast } from 'sonner';
import {
  QUICK_BED_TIMES,
  SLEEP_CYCLE_OPTIONS,
  SLEEP_LATENCY_OPTIONS,
  calculateWakeTimes,
  formatHoursLabel,
  getNowClockValue,
} from '@/lib/sleep/calculator';

async function shareResult(title, text) {
  if (navigator.share) {
    try { await navigator.share({ title, text }); return; } catch { /* cancelled */ }
  }
  try { await navigator.clipboard.writeText(text); toast.success('تم نسخ النتيجة إلى الحافظة'); }
  catch { toast.error('تعذر نسخ النتيجة'); }
}

export default function WakeTimeTool() {
  const [useNow, setUseNow] = useState(true);
  const [bedTime, setBedTime] = useState(QUICK_BED_TIMES[0] || '22:30');
  const [age, setAge] = useState('25');
  const [latencyMinutes, setLatencyMinutes] = useState('15');
  const [cycleMinutes, setCycleMinutes] = useState('90');
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => { setIsHydrated(true); }, []);

  useEffect(() => {
    if (!useNow || !isHydrated) return undefined;
    const updateNow = () => setBedTime(getNowClockValue());
    updateNow();
    const timer = setInterval(() => setBedTime(getNowClockValue()), 60_000);
    return () => clearInterval(timer);
  }, [useNow, isHydrated]);

  const result = useMemo(
    () => calculateWakeTimes({ bedTime, age, latencyMinutes, cycleMinutes }),
    [bedTime, age, latencyMinutes, cycleMinutes],
  );

  const shareText = result.isValid
    ? `أفضل وقت استيقاظ مقترح: ${result.bestOption.wakeLabel} (${result.bestOption.cycles} دورات، ${formatHoursLabel(result.bestOption.hours, 1)})`
    : '';

  return (
    <div aria-label="حاسبة وقت الاستيقاظ">
      <div className="tool-v2-panel-head">
        <span className="tool-v2-country-badge"><Bed size={14} weight="bold" /> إذا نمت الآن أو وقت تختاره <span className="tool-v2-live-dot" aria-hidden="true" /></span>
      </div>

      <div className="tool-v2-field">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-1)' }}>
          <label htmlFor="wake-bedtime" style={{ margin: 0 }}>وقت النوم</label>
          <button type="button" className={`tool-v2-chip${useNow ? ' is-active' : ''}`} onClick={() => setUseNow((c) => !c)}>
            <ArrowsClockwise size={13} weight="bold" style={{ verticalAlign: '-2px' }} /> {useNow ? 'يعمل على الآن' : 'فعّل الآن'}
          </button>
        </div>
        <input id="wake-bedtime" type="time" value={bedTime} onChange={(e) => { setUseNow(false); setBedTime(e.target.value); }} />
        <div className="tool-v2-option-list--grid" style={{ display: 'flex', marginTop: 'var(--space-2)' }}>
          {QUICK_BED_TIMES.map((time) => (
            <button key={time} type="button" className={`tool-v2-chip${bedTime === time && !useNow ? ' is-active' : ''}`} onClick={() => { setUseNow(false); setBedTime(time); }}>{time}</button>
          ))}
        </div>
      </div>

      <div className="tool-v2-field-row-pair">
        <div className="tool-v2-field">
          <label htmlFor="wake-age">العمر</label>
          <input id="wake-age" type="number" inputMode="numeric" value={age} onChange={(e) => setAge(e.target.value)} />
        </div>
        <div className="tool-v2-field">
          <label htmlFor="wake-latency">وقت الغفو</label>
          <select id="wake-latency" value={latencyMinutes} onChange={(e) => setLatencyMinutes(e.target.value)}>
            {SLEEP_LATENCY_OPTIONS.map((item) => (<option key={item} value={item}>{item} دقيقة</option>))}
          </select>
        </div>
      </div>
      <div className="tool-v2-field">
        <label htmlFor="wake-cycle">طول الدورة</label>
        <select id="wake-cycle" value={cycleMinutes} onChange={(e) => setCycleMinutes(e.target.value)}>
          {SLEEP_CYCLE_OPTIONS.map((item) => (<option key={item} value={item}>{item} دقيقة</option>))}
        </select>
      </div>

      {result.isValid ? (
        <div aria-live="polite">
          <div className="tool-v2-result-hero">
            <span className="tool-v2-result-label">أفضل وقت استيقاظ</span>
            <div className="tool-v2-result-value">{result.bestOption?.wakeLabel || '—'}</div>
            <div className="tool-v2-result-meta">{result.bestOption ? `${result.bestOption.cycles} دورات · ${formatHoursLabel(result.bestOption.hours, 1)}` : ''}</div>
          </div>

          <div className="tool-v2-breakdown-list">
            {result.options?.slice(0, 5).map((option) => (
              <div className="tool-v2-breakdown-row" key={`${option.cycles}-${option.wakeLabel}`}>
                <span className="tool-v2-breakdown-label">{option.wakeLabel}</span>
                <span className="tool-v2-breakdown-value">{option.durationLabel} — {option.status?.label}</span>
              </div>
            ))}
          </div>

          <div className="tool-v2-note-strip">
            <Alarm size={15} weight="fill" />
            <span>وقت النوم: {result.bedtimeLabel || '—'} — {useNow ? (isHydrated ? 'مأخوذ من ساعة جهازك الآن.' : 'يُزامَن مع وقت جهازك بعد فتح الصفحة.') : 'الوقت الذي اخترته يدوياً.'}</span>
          </div>

          <div className="tool-v2-action-row">
            <button type="button" className="tool-v2-action-btn is-primary" onClick={() => shareResult('حاسبة وقت الاستيقاظ', shareText)}>
              مشاركة
            </button>
          </div>
        </div>
      ) : (
        <div className="tool-v2-empty-state">
          <Bed size={28} weight="duotone" />
          <p>أدخل وقت النوم لعرض أفضل أوقات الاستيقاظ المقترحة.</p>
        </div>
      )}
    </div>
  );
}
