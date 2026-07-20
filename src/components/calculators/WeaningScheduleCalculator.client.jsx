"use client";

import { useMemo, useState } from 'react';
import { Baby, Info, Warning } from '@phosphor-icons/react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { computeWeaningSchedule, WEANING_STAGES } from '@/lib/calculators/weaning-schedule';

function formatNum(n) {
  return n.toLocaleString('ar-SA-u-nu-latn');
}

export default function WeaningScheduleCalculator() {
  const [birthDateIso, setBirthDateIso] = useState('');

  const result = useMemo(() => {
    if (!birthDateIso) return null;
    try {
      return computeWeaningSchedule({ birthDateIso });
    } catch {
      return null;
    }
  }, [birthDateIso]);

  return (
    <div className="calc-app weaning-tool" aria-label="حاسبة جدول إدخال الطعام للرضيع">
      <div className="calc-app-grid age-app-grid">
        <Card className="calc-surface-card calc-app-panel">
          <CardHeader>
            <CardTitle className="calc-card-title">تاريخ ميلاد الرضيع</CardTitle>
          </CardHeader>
          <CardContent className="calc-form-grid">
            <div className="calc-esb-field">
              <Label htmlFor="weaning-birth-date">تاريخ الميلاد</Label>
              <Input
                id="weaning-birth-date"
                type="date"
                value={birthDateIso}
                max={new Date().toISOString().slice(0, 10)}
                onChange={(event) => setBirthDateIso(event.target.value)}
                aria-label="تاريخ ميلاد الرضيع"
              />
            </div>
          </CardContent>
        </Card>

        <div className="calc-results-panel" aria-live="polite">
          {result ? (
            <>
              <Card className="calc-surface-card weaning-result-card">
                <CardHeader>
                  <div className="calc-esb-result-header">
                    <span className="calc-esb-country-badge calc-esb-country-badge--kw">
                      <Baby size={12} weight="bold" style={{ display: 'inline', verticalAlign: '-1px' }} />
                      {' '}عمر رضيعك الآن
                    </span>
                    <span className="calc-esb-live-dot" aria-hidden="true" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="calc-metric-card">
                    <div className="calc-metric-card__label">{formatNum(result.ageMonthsFloor)} شهراً ({formatNum(result.ageWeeks)} أسبوعاً)</div>
                    <div className="calc-metric-card__value">{result.stage.label}</div>
                    {!result.hasStartedSolids ? (
                      <div className="calc-metric-card__note">
                        <Info size={12} weight="bold" style={{ display: 'inline', verticalAlign: '-1px' }} />
                        {' '}باقي {formatNum(result.daysUntilSixMonths)} يوماً على بداية إدخال الطعام (الشهر السادس).
                      </div>
                    ) : null}
                  </div>
                </CardContent>
              </Card>

              <Card className="calc-surface-card">
                <CardHeader>
                  <CardTitle className="calc-card-title">ماذا تقدمين الآن؟</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="calc-metric-card">
                    <div className="calc-metric-card__label">القوام المناسب</div>
                    <div className="calc-metric-card__note">{result.stage.texture}</div>
                  </div>
                  <div className="calc-metric-card" style={{ marginTop: '0.75rem' }}>
                    <div className="calc-metric-card__note">{result.stage.guidance}</div>
                  </div>
                </CardContent>
              </Card>

              {result.isAllergenWindow ? (
                <Card className="calc-surface-card">
                  <CardHeader>
                    <CardTitle className="calc-card-title">
                      <Warning size={16} weight="bold" style={{ display: 'inline', verticalAlign: '-2px', marginInlineEnd: '4px', color: 'var(--amber)' }} />
                      نافذة إدخال مسببات الحساسية
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="calc-metric-card__note">
                      رضيعك الآن في النافذة العمرية (4-9 أشهر) الموصى بها لإدخال الأطعمة التسع الأكثر تسبباً للحساسية (الفول السوداني، البيض، الحليب، المكسرات، الصويا، القمح، السمك، المحار، السمسم) — التوصيات الحديثة تنصح بالإدخال المبكر لتقليل خطر الحساسية، بخلاف النصيحة القديمة بالتأخير. أدخلي كل نوع بمفرده وبكمية صغيرة، وراقبي أي رد فعل، واستشيري طبيب الأطفال إذا كان لدى رضيعك إكزيما شديدة أو حساسية معروفة من البيض قبل البدء.
                    </div>
                  </CardContent>
                </Card>
              ) : null}

              {result.isUnderOneYear ? (
                <Card className="calc-surface-card">
                  <CardHeader>
                    <CardTitle className="calc-card-title">
                      <Warning size={16} weight="bold" style={{ display: 'inline', verticalAlign: '-2px', marginInlineEnd: '4px', color: 'var(--red)' }} />
                      ممنوع قبل السنة الأولى
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="calc-metric-card__note">
                      العسل ممنوع منعاً باتاً قبل إتمام السنة الأولى (خطر التسمم الوشيقي/البوتيوليزم)، وكذلك الملح والسكر المضاف — لا تُضافان لطعام الرضيع إطلاقاً قبل عامه الأول.
                    </div>
                  </CardContent>
                </Card>
              ) : null}
            </>
          ) : (
            <div className="calc-metric-card">
              <div className="calc-metric-card__note">
                <Baby size={14} weight="bold" style={{ display: 'inline', verticalAlign: '-2px' }} />
                {' '}أدخلي تاريخ ميلاد رضيعك لعرض جدول التغذية المناسب لعمره الآن.
              </div>
            </div>
          )}
        </div>
      </div>

      {!result ? (
        <div className="calc-metric-card" style={{ marginTop: '1.5rem' }}>
          <div className="calc-metric-card__label">نظرة عامة على كل المراحل</div>
          <div className="calc-metric-card__note">
            {WEANING_STAGES.map((stage) => stage.label).join(' ← ')}
          </div>
        </div>
      ) : null}
    </div>
  );
}
