"use client";

import { useMemo, useState } from 'react';
import { AlarmClock, MoonStar, TimerReset } from 'lucide-react';

import {
  CalcButton as Button,
  CalcInput as Input,
} from '@/components/calculators/controls.client';
import ResultActions from '@/components/calculators/ResultActions.client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
        <Card className="calc-surface-card calc-app-panel">
          <CardHeader>
            <CardTitle className="calc-card-title">أدخل وقت الاستيقاظ الذي تريد الوصول إليه</CardTitle>
          </CardHeader>
          <CardContent className="calc-form-grid">
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
                  className="select calc-select-trigger"
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
                  className="select calc-select-trigger"
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
          </CardContent>
        </Card>

        <div className="calc-results-panel">
          <Card className="calc-surface-card">
            <CardHeader>
              <CardTitle className="calc-card-title">أفضل أوقات النوم المقترحة</CardTitle>
            </CardHeader>
            <CardContent className="calc-metric-grid">
              <div className="calc-metric-card">
                <div className="calc-metric-card__label"><MoonStar size={16} /> أفضل وقت لك الآن</div>
                <div className="calc-metric-card__value">{result.bestOption?.bedtimeLabel || '—'}</div>
                <div className="calc-metric-card__note">
                  {result.bestOption ? `هذا الخيار يمنحك ${result.bestOption.cycles} دورات ويقترب من ${formatHoursLabel(result.bestOption.hours, 1)}.` : 'أدخل وقتاً صالحاً'}
                </div>
              </div>

              <div className="calc-query-grid">
                {result.options?.map((option) => (
                  <Card key={`${option.cycles}-${option.bedtimeLabel}`} className="calc-surface-card calc-query-card">
                    <CardHeader>
                      <CardTitle className="calc-card-title">{option.bedtimeLabel}</CardTitle>
                    </CardHeader>
                    <CardContent className="calc-card-copy">
                      <p>{option.summary}</p>
                      <p>مدة النوم التقريبية: {option.durationLabel}</p>
                      <p>{option.status.note}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="calc-grid-2">
                <div className="calc-metric-card">
                  <div className="calc-metric-card__label"><AlarmClock size={16} /> وقت الاستيقاظ</div>
                  <div className="calc-metric-card__value">{result.wakeLabel || '—'}</div>
                  <div className="calc-metric-card__note">هذه هي النقطة التي تبني عليها الأداة كل الخيارات.</div>
                </div>
                <div className="calc-metric-card">
                  <div className="calc-metric-card__label"><TimerReset size={16} /> النطاق المناسب لعُمرك</div>
                  <div className="calc-metric-card__value">
                    {result.range ? `${result.range.recommendedMin}–${result.range.recommendedMax} ساعات` : '—'}
                  </div>
                  <div className="calc-metric-card__note">{result.range?.note}</div>
                </div>
              </div>

              <ResultActions
                copyText={shareText}
                shareTitle="نتيجة حاسبة وقت النوم"
                shareText={shareText}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
