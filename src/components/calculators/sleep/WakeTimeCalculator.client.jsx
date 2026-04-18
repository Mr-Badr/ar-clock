"use client";

import { useEffect, useMemo, useState } from 'react';
import { AlarmClock, BedDouble, RefreshCcw } from 'lucide-react';

import {
  CalcButton as Button,
  CalcInput as Input,
} from '@/components/calculators/controls.client';
import ResultActions from '@/components/calculators/ResultActions.client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  QUICK_BED_TIMES,
  SLEEP_CYCLE_OPTIONS,
  SLEEP_LATENCY_OPTIONS,
  calculateWakeTimes,
  formatHoursLabel,
  getNowClockValue,
} from '@/lib/sleep/calculator';

export default function WakeTimeCalculator() {
  const [useNow, setUseNow] = useState(true);
  const [bedTime, setBedTime] = useState(QUICK_BED_TIMES[0] || '22:30');
  const [age, setAge] = useState('25');
  const [latencyMinutes, setLatencyMinutes] = useState('15');
  const [cycleMinutes, setCycleMinutes] = useState('90');
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!useNow || !isHydrated) return undefined;
    const updateNow = () => setBedTime(getNowClockValue());
    updateNow();
    const timer = setInterval(() => setBedTime(getNowClockValue()), 60_000);
    return () => clearInterval(timer);
  }, [useNow, isHydrated]);

  const result = useMemo(
    () => calculateWakeTimes({
      bedTime,
      age,
      latencyMinutes,
      cycleMinutes,
    }),
    [bedTime, age, latencyMinutes, cycleMinutes],
  );

  const shareText = result.isValid
    ? [
        `وقت النوم: ${result.bedtimeLabel}`,
        `أفضل وقت استيقاظ مقترح: ${result.bestOption.wakeLabel}`,
        `عدد الدورات: ${result.bestOption.cycles}`,
        `مدة النوم التقريبية: ${formatHoursLabel(result.bestOption.hours, 1)}`,
      ].join('\n')
    : '';

  return (
    <div className="calc-app">
      <div className="calc-app-grid">
        <Card className="calc-surface-card calc-app-panel">
          <CardHeader>
            <CardTitle className="calc-card-title">إذا نمت الآن أو في وقت تختاره</CardTitle>
          </CardHeader>
          <CardContent className="calc-form-grid">
            <div className="calc-field">
              <div className="calc-field-row">
                <Label className="calc-label" htmlFor="sleep-wake-bedtime">وقت النوم</Label>
                <Button type="button" variant={useNow ? 'default' : 'outline'} size="sm" onClick={() => setUseNow((current) => !current)}>
                  <RefreshCcw size={14} />
                  {useNow ? 'يعمل على الآن' : 'فعّل الآن'}
                </Button>
              </div>
              <Input
                id="sleep-wake-bedtime"
                type="time"
                value={bedTime}
                onChange={(e) => {
                  setUseNow(false);
                  setBedTime(e.target.value);
                }}
              />
              <div className="calc-chip-list mt-3">
                {QUICK_BED_TIMES.map((time) => (
                  <Button
                    key={time}
                    type="button"
                    variant={bedTime === time && !useNow ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => {
                      setUseNow(false);
                      setBedTime(time);
                    }}
                  >
                    {time}
                  </Button>
                ))}
              </div>
            </div>

            <div className="calc-grid-3">
              <div className="calc-field">
                <Label className="calc-label" htmlFor="sleep-wake-age">العمر</Label>
                <Input id="sleep-wake-age" inputMode="numeric" value={age} onChange={(e) => setAge(e.target.value)} />
              </div>
              <div className="calc-field">
                <Label className="calc-label" htmlFor="sleep-wake-latency">وقت الغفو</Label>
                <select id="sleep-wake-latency" className="select calc-select-trigger" value={latencyMinutes} onChange={(e) => setLatencyMinutes(e.target.value)}>
                  {SLEEP_LATENCY_OPTIONS.map((item) => <option key={item} value={item}>{item} دقيقة</option>)}
                </select>
              </div>
              <div className="calc-field">
                <Label className="calc-label" htmlFor="sleep-wake-cycle">طول الدورة</Label>
                <select id="sleep-wake-cycle" className="select calc-select-trigger" value={cycleMinutes} onChange={(e) => setCycleMinutes(e.target.value)}>
                  {SLEEP_CYCLE_OPTIONS.map((item) => <option key={item} value={item}>{item} دقيقة</option>)}
                </select>
              </div>
            </div>

              <div className="calc-note">
              خيار "أنام الآن" يتحدث حسب وقت جهازك المحلي بعد فتح الصفحة، وهو ما يجعل الأداة
              مفيدة في الاستخدام المتكرر لا في التخطيط فقط.
              </div>
          </CardContent>
        </Card>

        <div className="calc-results-panel">
          <Card className="calc-surface-card">
            <CardHeader>
              <CardTitle className="calc-card-title">أوقات الاستيقاظ المقترحة</CardTitle>
            </CardHeader>
            <CardContent className="calc-metric-grid">
              <div className="calc-grid-2">
                <div className="calc-metric-card">
                  <div className="calc-metric-card__label"><BedDouble size={16} /> وقت النوم الحالي</div>
                  <div className="calc-metric-card__value">{result.bedtimeLabel || '—'}</div>
                  <div className="calc-metric-card__note">
                    {useNow
                      ? isHydrated
                        ? 'مأخوذ من ساعة جهازك الآن.'
                        : 'يُزامَن مع وقت جهازك بعد فتح الصفحة.'
                      : 'الوقت الذي اخترته يدوياً.'}
                  </div>
                </div>
                <div className="calc-metric-card">
                  <div className="calc-metric-card__label"><AlarmClock size={16} /> أفضل وقت استيقاظ</div>
                  <div className="calc-metric-card__value">{result.bestOption?.wakeLabel || '—'}</div>
                  <div className="calc-metric-card__note">
                    {result.bestOption ? `${result.bestOption.cycles} دورات تقريبية و${formatHoursLabel(result.bestOption.hours, 1)} من النوم.` : 'أدخل وقتاً صالحاً'}
                  </div>
                </div>
              </div>

              <div className="calc-query-grid">
                {result.options?.map((option) => (
                  <Card key={`${option.cycles}-${option.wakeLabel}`} className="calc-surface-card calc-query-card">
                    <CardHeader>
                      <CardTitle className="calc-card-title">{option.wakeLabel}</CardTitle>
                    </CardHeader>
                    <CardContent className="calc-card-copy">
                      <p>{option.summary}</p>
                      <p>مدة النوم التقريبية: {option.durationLabel}</p>
                      <p>{option.status.note}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <ResultActions
                copyText={shareText}
                shareTitle="نتيجة حاسبة وقت الاستيقاظ"
                shareText={shareText}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
