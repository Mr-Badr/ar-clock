"use client";

import { useMemo, useState } from 'react';
import { BedDouble, Moon, Timer } from 'lucide-react';

import { CalcInput as Input } from '@/components/calculators/controls.client';
import ResultActions from '@/components/calculators/ResultActions.client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { calculateSleepDuration } from '@/lib/sleep/calculator';

export default function SleepDurationCalculator() {
  const [sleepTime, setSleepTime] = useState('23:00');
  const [wakeTime, setWakeTime] = useState('07:00');
  const [age, setAge] = useState('25');
  const [awakeMinutes, setAwakeMinutes] = useState('0');

  const result = useMemo(
    () => calculateSleepDuration({ sleepTime, wakeTime, awakeMinutes, age }),
    [sleepTime, wakeTime, awakeMinutes, age],
  );

  const shareText = result.isValid
    ? [
        `الوقت في السرير: ${result.totalInBedLabel}`,
        `صافي النوم: ${result.netSleepLabel}`,
        `الاستيقاظات: ${result.awakeLabel}`,
        `التقييم: ${result.status.label}`,
      ].join('\n')
    : '';

  return (
    <div className="calc-app">
      <div className="calc-app-grid">
        <Card className="calc-surface-card calc-app-panel">
          <CardHeader>
            <CardTitle className="calc-card-title">أدخل نومك الفعلي لا الظاهري فقط</CardTitle>
          </CardHeader>
          <CardContent className="calc-form-grid">
            <div className="calc-grid-2">
              <div className="calc-field">
                <Label className="calc-label" htmlFor="sleep-duration-start">وقت النوم</Label>
                <Input id="sleep-duration-start" type="time" value={sleepTime} onChange={(e) => setSleepTime(e.target.value)} />
              </div>
              <div className="calc-field">
                <Label className="calc-label" htmlFor="sleep-duration-end">وقت الاستيقاظ</Label>
                <Input id="sleep-duration-end" type="time" value={wakeTime} onChange={(e) => setWakeTime(e.target.value)} />
              </div>
            </div>

            <div className="calc-grid-2">
              <div className="calc-field">
                <Label className="calc-label" htmlFor="sleep-duration-age">العمر</Label>
                <Input id="sleep-duration-age" inputMode="numeric" value={age} onChange={(e) => setAge(e.target.value)} />
              </div>
              <div className="calc-field">
                <Label className="calc-label" htmlFor="sleep-duration-awake">مجموع دقائق الاستيقاظ الليلي</Label>
                <Input id="sleep-duration-awake" inputMode="numeric" value={awakeMinutes} onChange={(e) => setAwakeMinutes(e.target.value)} />
              </div>
            </div>

            <div className="calc-note">
              إذا كنت تريد التخطيط لوقت النوم قبل أن تنام، فانتقل إلى حاسبة "متى أنام". أما هنا فنحن نفهم ما حدث فعلياً.
            </div>
          </CardContent>
        </Card>

        <div className="calc-results-panel">
          <Card className="calc-surface-card">
            <CardHeader>
              <CardTitle className="calc-card-title">قراءة سريعة لليلتك</CardTitle>
            </CardHeader>
            <CardContent className="calc-metric-grid">
              <div className="calc-grid-2">
                <div className="calc-metric-card">
                  <div className="calc-metric-card__label"><BedDouble size={16} /> الوقت في السرير</div>
                  <div className="calc-metric-card__value">{result.totalInBedLabel || '—'}</div>
                  <div className="calc-metric-card__note">من لحظة النوم إلى لحظة الاستيقاظ بغض النظر عن التقطع.</div>
                </div>
                <div className="calc-metric-card">
                  <div className="calc-metric-card__label"><Moon size={16} /> صافي النوم الفعلي</div>
                  <div className="calc-metric-card__value">{result.netSleepLabel || '—'}</div>
                  <div className="calc-metric-card__note">{result.status?.note}</div>
                </div>
              </div>

              <div className="calc-grid-2">
                <div className="calc-metric-card">
                  <div className="calc-metric-card__label"><Timer size={16} /> دقائق الاستيقاظ</div>
                  <div className="calc-metric-card__value">{result.awakeLabel || '—'}</div>
                  <div className="calc-metric-card__note">كل دقيقة مستيقظ فيها تقطع صافي النوم الحقيقي.</div>
                </div>
                <div className="calc-metric-card">
                  <div className="calc-metric-card__label">التقدير العام</div>
                  <div className="calc-metric-card__value">{result.status?.label || '—'}</div>
                  <div className="calc-metric-card__note">{result.fatigueHint}</div>
                </div>
              </div>

              <ResultActions
                copyText={shareText}
                shareTitle="نتيجة حساب مدة النوم"
                shareText={shareText}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
