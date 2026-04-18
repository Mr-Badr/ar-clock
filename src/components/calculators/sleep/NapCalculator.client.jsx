"use client";

import { useMemo, useState } from 'react';
import { Coffee, MoonStar, TimerReset } from 'lucide-react';

import { CalcInput as Input } from '@/components/calculators/controls.client';
import ResultActions from '@/components/calculators/ResultActions.client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  NAP_DURATION_OPTIONS,
  SLEEP_LATENCY_OPTIONS,
  calculateNap,
} from '@/lib/sleep/calculator';

export default function NapCalculator() {
  const [startTime, setStartTime] = useState('14:00');
  const [napMinutes, setNapMinutes] = useState('20');
  const [latencyMinutes, setLatencyMinutes] = useState('10');
  const [bedtime, setBedtime] = useState('23:00');

  const result = useMemo(
    () => calculateNap({
      startTime,
      napMinutes,
      latencyMinutes,
      bedtime,
    }),
    [startTime, napMinutes, latencyMinutes, bedtime],
  );

  const shareText = result.isValid
    ? [
        `نوع القيلولة: ${result.napLabel}`,
        `وقت الاستيقاظ المقترح: ${result.wakeTimeLabel}`,
        `درجة الخمول المتوقعة: ${result.inertiaRisk}`,
        result.timingNote,
      ].join('\n')
    : '';

  return (
    <div className="calc-app">
      <div className="calc-app-grid">
        <Card className="calc-surface-card calc-app-panel">
          <CardHeader>
            <CardTitle className="calc-card-title">اختر القيلولة التي تناسب هدفك</CardTitle>
          </CardHeader>
          <CardContent className="calc-form-grid">
            <div className="calc-grid-2">
              <div className="calc-field">
                <Label className="calc-label" htmlFor="sleep-nap-start">وقت بدء القيلولة</Label>
                <Input id="sleep-nap-start" type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
              </div>
              <div className="calc-field">
                <Label className="calc-label" htmlFor="sleep-nap-bedtime">وقت نومك الليلي المعتاد</Label>
                <Input id="sleep-nap-bedtime" type="time" value={bedtime} onChange={(e) => setBedtime(e.target.value)} />
              </div>
            </div>

            <div className="calc-grid-2">
              <div className="calc-field">
                <Label className="calc-label" htmlFor="sleep-nap-length">نوع القيلولة</Label>
                <select id="sleep-nap-length" className="select calc-select-trigger" value={napMinutes} onChange={(e) => setNapMinutes(e.target.value)}>
                  {NAP_DURATION_OPTIONS.map((item) => (
                    <option key={item.value} value={item.value}>{item.label}</option>
                  ))}
                </select>
              </div>
              <div className="calc-field">
                <Label className="calc-label" htmlFor="sleep-nap-latency">وقت الغفو</Label>
                <select id="sleep-nap-latency" className="select calc-select-trigger" value={latencyMinutes} onChange={(e) => setLatencyMinutes(e.target.value)}>
                  {SLEEP_LATENCY_OPTIONS.map((item) => (
                    <option key={item} value={item}>{item} دقيقة</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="calc-note">
              القيلولة القصيرة تساعد كثيراً من الناس على التنشيط السريع، بينما القيلولة الطويلة أو المتأخرة قد تغير شعورك أو توقيت نومك الليلي.
            </div>
          </CardContent>
        </Card>

        <div className="calc-results-panel">
          <Card className="calc-surface-card">
            <CardHeader>
              <CardTitle className="calc-card-title">نتيجة القيلولة الذكية</CardTitle>
            </CardHeader>
            <CardContent className="calc-metric-grid">
              <div className="calc-grid-2">
                <div className="calc-metric-card">
                  <div className="calc-metric-card__label"><MoonStar size={16} /> وقت الاستيقاظ</div>
                  <div className="calc-metric-card__value">{result.wakeTimeLabel || '—'}</div>
                  <div className="calc-metric-card__note">{result.napDescription}</div>
                </div>
                <div className="calc-metric-card">
                  <div className="calc-metric-card__label"><Coffee size={16} /> الخمول المحتمل</div>
                  <div className="calc-metric-card__value">{result.inertiaRisk || '—'}</div>
                  <div className="calc-metric-card__note">20 دقيقة غالباً الأخف، و30 دقيقة قد تكون أثقل على بعض الناس.</div>
                </div>
              </div>

              <div className="calc-metric-card">
                <div className="calc-metric-card__label"><TimerReset size={16} /> هل القيلولة متأخرة؟</div>
                <div className="calc-metric-card__value">{result.isLate ? 'متأخرة نسبياً' : 'في وقت مقبول'}</div>
                <div className="calc-metric-card__note">{result.timingNote}</div>
              </div>

              <ResultActions
                copyText={shareText}
                shareTitle="نتيجة حاسبة القيلولة"
                shareText={shareText}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
