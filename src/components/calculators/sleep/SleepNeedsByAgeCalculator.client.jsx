"use client";

import { useMemo, useState } from 'react';
import { Baby, MoonStar, UserRound } from 'lucide-react';

import { CalcInput as Input } from '@/components/calculators/controls.client';
import ResultActions from '@/components/calculators/ResultActions.client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { SLEEP_NEED_RANGES, getSleepNeedByAge } from '@/lib/sleep/calculator';

export default function SleepNeedsByAgeCalculator() {
  const [age, setAge] = useState('25');
  const range = useMemo(() => getSleepNeedByAge(age), [age]);

  const shareText = [
    `العمر: ${age} سنة`,
    `النطاق الموصى به: ${range.recommendedMin}–${range.recommendedMax} ساعات`,
    `${range.label}`,
  ].join('\n');

  return (
    <div className="calc-app">
      <div className="calc-app-grid lg:grid-cols-[0.92fr_1.08fr]">
        <Card className="calc-surface-card calc-app-panel">
          <CardHeader>
            <CardTitle className="calc-card-title">اختر العمر لمعرفة النطاق المناسب</CardTitle>
          </CardHeader>
          <CardContent className="calc-form-grid">
            <div className="calc-field">
              <Label className="calc-label" htmlFor="sleep-needs-age">العمر بالسنوات</Label>
              <Input id="sleep-needs-age" inputMode="numeric" value={age} onChange={(e) => setAge(e.target.value)} />
            </div>

            <div className="calc-metric-card">
              <div className="calc-metric-card__label"><MoonStar size={16} /> النطاق المناسب الآن</div>
              <div className="calc-metric-card__value">{range.recommendedMin}–{range.recommendedMax} ساعات</div>
              <div className="calc-metric-card__note">{range.label}</div>
            </div>

            <div className="calc-note">
              هذه الصفحة تعطيك النطاق الأقرب لعُمرك، ثم تساعدك على الانتقال إلى أدوات وقت النوم أو مدة النوم أو دين النوم حسب المشكلة التي تعيشها.
            </div>

            <ResultActions
              copyText={shareText}
              shareTitle="الاحتياج إلى النوم حسب العمر"
              shareText={shareText}
            />
          </CardContent>
        </Card>

        <div className="calc-results-panel">
          <Card className="calc-surface-card">
            <CardHeader>
              <CardTitle className="calc-card-title">جدول النوم حسب العمر</CardTitle>
            </CardHeader>
            <CardContent className="calc-metric-grid">
              <div className="calc-query-grid">
                {SLEEP_NEED_RANGES.map((item) => (
                  <Card key={item.id} className="calc-surface-card calc-query-card">
                    <CardHeader>
                      <CardTitle className="calc-card-title">{item.label}</CardTitle>
                    </CardHeader>
                    <CardContent className="calc-card-copy">
                      <p>{item.recommendedMin}–{item.recommendedMax} ساعات</p>
                      <p>{item.note}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="calc-grid-2">
                <div className="calc-metric-card">
                  <div className="calc-metric-card__label"><Baby size={16} /> الفكرة الأساسية</div>
                  <div className="calc-metric-card__note">
                    الأطفال والمراهقون يحتاجون غالباً ساعات أكثر من البالغين، لذلك لا يصح قياس الجميع بقاعدة 8 ساعات فقط.
                  </div>
                </div>
                <div className="calc-metric-card">
                  <div className="calc-metric-card__label"><UserRound size={16} /> ماذا بعد الجدول؟</div>
                  <div className="calc-metric-card__note">
                    إذا كنت داخل النطاق وما زلت متعباً، فانتقل إلى أدوات مدة النوم الفعلية أو دين النوم لفهم الصورة بشكل أعمق.
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
