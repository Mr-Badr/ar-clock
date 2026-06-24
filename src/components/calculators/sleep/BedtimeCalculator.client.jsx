"use client";

import { useMemo, useState } from 'react';
import { AlarmClock, MoonStar, TimerReset } from 'lucide-react';

import {
  CalcButton as Button,
  CalcInput as Input,
} from '@/components/calculators/controls.client';
import ResultActions from '@/components/calculators/ResultActions.client';
import { Label } from '@/components/ui/label';
import {
  QUICK_WAKE_TIMES,
  SLEEP_CYCLE_OPTIONS,
  SLEEP_LATENCY_OPTIONS,
  calculateBedtimes,
  formatHoursLabel,
} from '@/lib/sleep/calculator';

export default function BedtimeCalculator() {
  const [wakeTime, setWakeTime] = useState('06:00');
  const [age, setAge] = useState('25');
  const [latencyMinutes, setLatencyMinutes] = useState('15');
  const [cycleMinutes, setCycleMinutes] = useState('90');

  const result = useMemo(
    () => calculateBedtimes({
      wakeTime,
      age,
      latencyMinutes,
      cycleMinutes,
    }),
    [wakeTime, age, latencyMinutes, cycleMinutes],
  );

  const shareText = result.isValid
    ? [
        `وقت الاستيقاظ: ${result.wakeLabel}`,
        `أفضل وقت نوم مقترح: ${result.bestOption.bedtimeLabel}`,
        `عدد الدورات: ${result.bestOption.cycles}`,
        `مدة النوم التقريبية: ${formatHoursLabel(result.bestOption.hours, 1)}`,
      ].join('\n')
    : '';

  return (
    <div className="calc-app">
      <div className="calc-app-grid">
        <div className="calc-surface-card calc-app-panel bedtime-inputs-panel">
          <div className="bedtime-panel-title">أدخل وقت الاستيقاظ الذي تريد الوصول إليه</div>
          <div className="calc-form-grid">
            <div className="calc-field">
              <Label className="calc-label" htmlFor="sleep-bedtime-wake">وقت الاستيقاظ</Label>
              <Input id="sleep-bedtime-wake" type="time" value={wakeTime} onChange={(e) => setWakeTime(e.target.value)} />
              <div className="calc-chip-list mt-3">
                {QUICK_WAKE_TIMES.map((time) => (
                  <Button
                    key={time}
                    type="button"
                    variant={wakeTime === time ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setWakeTime(time)}
                  >
                    {time}
                  </Button>
                ))}
              </div>
            </div>

            <div className="calc-grid-3">
              <div className="calc-field">
                <Label className="calc-label" htmlFor="sleep-bedtime-age">العمر</Label>
                <Input id="sleep-bedtime-age" inputMode="numeric" value={age} onChange={(e) => setAge(e.target.value)} />
              </div>
              <div className="calc-field">
                <Label className="calc-label" htmlFor="sleep-bedtime-latency">وقت الغفو</Label>
                <select
                  id="sleep-bedtime-latency"
                  className="calc-native-select"
                  value={latencyMinutes}
                  onChange={(e) => setLatencyMinutes(e.target.value)}
                >
                  {SLEEP_LATENCY_OPTIONS.map((item) => (
                    <option key={item} value={item}>{item} دقيقة</option>
                  ))}
                </select>
              </div>
              <div className="calc-field">
                <Label className="calc-label" htmlFor="sleep-bedtime-cycle">طول الدورة</Label>
                <select
                  id="sleep-bedtime-cycle"
                  className="calc-native-select"
                  value={cycleMinutes}
                  onChange={(e) => setCycleMinutes(e.target.value)}
                >
                  {SLEEP_CYCLE_OPTIONS.map((item) => (
                    <option key={item} value={item}>{item} دقيقة</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="calc-note">
              هذه الأداة تقدير يساعدك على التخطيط، وليست قياساً طبياً دقيقاً لكل شخص.
            </div>
          </div>
        </div>

        <div className="calc-results-panel">
          <div className="bedtime-results" aria-live="polite">

            {/* Hero — best option */}
            {result.isValid && result.bestOption && (
              <div className="bedtime-hero-card">
                <div className="bedtime-hero-icon">
                  <MoonStar size={20} aria-hidden="true" />
                </div>
                <div className="bedtime-hero-body">
                  <p className="bedtime-hero-label">أفضل وقت للنوم الآن</p>
                  <p className="bedtime-hero-time">{result.bestOption.bedtimeLabel}</p>
                  <p className="bedtime-hero-sub">
                    {result.bestOption.cycles} دورات · {formatHoursLabel(result.bestOption.hours, 1)}
                  </p>
                </div>
              </div>
            )}

            {/* All options grid */}
            {result.options?.length > 0 && (
              <div className="bedtime-options" role="list" aria-label="خيارات وقت النوم">
                {result.options.map((option, idx) => {
                  const isBest = option.bedtimeLabel === result.bestOption?.bedtimeLabel;
                  const qual = option.status?.label;
                  const qualClass =
                    qual === 'مناسب' ? 'bedtime-opt--good'
                    : qual === 'مقبول' ? 'bedtime-opt--ok'
                    : 'bedtime-opt--low';
                  return (
                    <div
                      key={`${option.cycles}-${option.bedtimeLabel}`}
                      className={`bedtime-opt ${qualClass}${isBest ? ' bedtime-opt--best' : ''}`}
                      role="listitem"
                    >
                      {isBest && (
                        <span className="bedtime-opt-badge" aria-label="الأفضل">★</span>
                      )}
                      <span className="bedtime-opt-time">{option.bedtimeLabel}</span>
                      <span className="bedtime-opt-cycles">
                        {Array.from({ length: Math.min(option.cycles, 6) }).map((_, i) => (
                          <span key={i} className="bedtime-cycle-dot" aria-hidden="true" />
                        ))}
                      </span>
                      <span className="bedtime-opt-dur">{option.durationLabel}</span>
                      <span className="bedtime-opt-qual">{qual}</span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Footer info */}
            <div className="bedtime-footer">
              <div className="bedtime-footer-item">
                <AlarmClock size={14} aria-hidden="true" />
                <span>الاستيقاظ: <strong>{result.wakeLabel || '—'}</strong></span>
              </div>
              {result.range && (
                <div className="bedtime-footer-item">
                  <TimerReset size={14} aria-hidden="true" />
                  <span>
                    النطاق لعمرك: <strong>{result.range.recommendedMin}–{result.range.recommendedMax} ساعات</strong>
                  </span>
                </div>
              )}
            </div>

            <ResultActions
              copyText={shareText}
              shareTitle="نتيجة حاسبة وقت النوم"
              shareText={shareText}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
