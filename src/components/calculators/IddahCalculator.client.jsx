"use client";

import { useMemo, useState } from 'react';
import { Baby, Heart, Info, Scales } from '@phosphor-icons/react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { computeIddahSnapshot, getHijriMonthName } from '@/lib/calculators/iddah';

const SITUATION_OPTIONS = [
  { value: 'widow', title: 'أرملة (توفي عنها زوجها)', description: '4 أشهر و10 أيام هجرية' },
  { value: 'divorced-non-menstruating', title: 'مطلقة لا تحيض', description: 'صغر سنها أو بلغت سن اليأس — 3 أشهر هجرية' },
  { value: 'divorced-menstruating', title: 'مطلقة تحيض', description: 'ثلاث حيضات كاملة — مدى تقريبي' },
  { value: 'pregnant', title: 'حامل', description: 'تنتهي بالولادة الفعلية' },
];

const GREGORIAN_FORMATTER = new Intl.DateTimeFormat('ar', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

function formatGregorian(date) {
  if (!date) return '';
  return GREGORIAN_FORMATTER.format(date);
}

export default function IddahCalculator() {
  const [situationType, setSituationType] = useState('widow');
  const [startDateIso, setStartDateIso] = useState('2026-01-15');
  const [expectedDueDateIso, setExpectedDueDateIso] = useState('');

  const snapshot = useMemo(() => {
    try {
      return computeIddahSnapshot(situationType, startDateIso, expectedDueDateIso);
    } catch (_error) {
      return null;
    }
  }, [situationType, startDateIso, expectedDueDateIso]);

  const startDateLabel = situationType === 'widow' ? 'تاريخ الوفاة' : 'تاريخ الطلاق';
  const isOutOfRange = startDateIso && !snapshot;

  return (
    <div className="calc-app iddah-tool" aria-label="حاسبة العدة الشرعية">
      <div className="calc-app-grid age-app-grid">
        <Card className="calc-surface-card calc-app-panel">
          <CardHeader>
            <CardTitle className="calc-card-title">اختاري حالتك</CardTitle>
          </CardHeader>
          <CardContent className="calc-form-grid">
            <RadioGroup value={situationType} onValueChange={setSituationType} className="calc-esb-radio-row">
              {SITUATION_OPTIONS.map((opt) => (
                <label key={opt.value} className="calc-esb-radio-card">
                  <RadioGroupItem value={opt.value} />
                  <span className="calc-esb-radio-copy">
                    <strong>{opt.title}</strong>
                    <span>{opt.description}</span>
                  </span>
                </label>
              ))}
            </RadioGroup>

            {situationType !== 'pregnant' ? (
              <div className="calc-esb-field" style={{ marginTop: '1rem' }}>
                <Label htmlFor="iddah-start-date">{startDateLabel}</Label>
                <Input
                  id="iddah-start-date"
                  type="date"
                  value={startDateIso}
                  min="1924-01-01"
                  max="2077-12-31"
                  onChange={(event) => setStartDateIso(event.target.value)}
                  aria-label={startDateLabel}
                />
                {isOutOfRange ? (
                  <p className="calc-hint">
                    هذا التاريخ خارج النطاق المدعوم حالياً (1924–2077م) — جرّبي تاريخاً ضمن هذا المدى.
                  </p>
                ) : null}
              </div>
            ) : null}

            {situationType === 'pregnant' ? (
              <div className="calc-esb-field" style={{ marginTop: '1rem' }}>
                <Label htmlFor="iddah-due-date">تاريخ الولادة المتوقع (اختياري)</Label>
                <Input
                  id="iddah-due-date"
                  type="date"
                  value={expectedDueDateIso}
                  min="1924-01-01"
                  max="2077-12-31"
                  onChange={(event) => setExpectedDueDateIso(event.target.value)}
                  aria-label="تاريخ الولادة المتوقع"
                />
              </div>
            ) : null}
          </CardContent>
        </Card>

        <div className="calc-results-panel" aria-live="polite">
          {snapshot ? (
            <>
              {snapshot.isPrecise ? (
                <Card className="calc-surface-card">
                  <CardHeader>
                    <CardTitle className="calc-card-title">تاريخ انتهاء العدة</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="calc-metric-card">
                      <div className="calc-metric-card__label">
                        {snapshot.endHijri.day} {getHijriMonthName(snapshot.endHijri.month)} {snapshot.endHijri.year} هـ
                      </div>
                      <div className="calc-metric-card__value">{formatGregorian(snapshot.endDate)}</div>
                      <div className="calc-metric-card__note">
                        {snapshot.isOngoing
                          ? `متبقٍ ${snapshot.daysRemaining} يوماً على انتهاء العدة`
                          : 'انتهت مدة العدة بحسب هذا التاريخ'}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : snapshot.situationType === 'divorced-menstruating' ? (
                <Card className="calc-surface-card">
                  <CardHeader>
                    <CardTitle className="calc-card-title">مدى تقريبي لانتهاء العدة</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="calc-metric-card">
                      <div className="calc-metric-card__value">
                        {formatGregorian(snapshot.minEndDate)} — {formatGregorian(snapshot.maxEndDate)}
                      </div>
                      <div className="calc-metric-card__note">
                        <Info size={12} weight="bold" style={{ display: 'inline', verticalAlign: '-1px' }} />
                        {' '}عدة المطلقة الحائض ثلاث حيضات كاملة، تعتمد على طول دورتها الفعلية — هذا مدى تقريبي فقط وليس تاريخاً جازماً.
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="calc-surface-card">
                  <CardHeader>
                    <CardTitle className="calc-card-title">عدة الحامل تنتهي بالولادة</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="calc-metric-card">
                      <div className="calc-metric-card__value">
                        {snapshot.estimatedDueDate ? formatGregorian(snapshot.estimatedDueDate) : 'غير محددة'}
                      </div>
                      <div className="calc-metric-card__note">
                        <Baby size={12} weight="bold" style={{ display: 'inline', verticalAlign: '-1px' }} />
                        {' '}عدة الحامل تنتهي بوضع حملها فعلياً، بصرف النظر عن كونها أرملة أو مطلقة — أي تاريخ متوقع هنا استرشادي فقط.
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card className="calc-surface-card">
                <CardHeader>
                  <CardTitle className="calc-card-title">
                    <Scales size={16} weight="bold" style={{ display: 'inline', verticalAlign: '-2px', marginInlineEnd: '4px' }} />
                    الأساس الشرعي
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="calc-metric-card__note">
                    {snapshot.situationType === 'widow' && 'عدة المتوفى عنها زوجها أربعة أشهر وعشرة أيام هجرية كاملة (سورة البقرة: 234)، محسوبة هنا بفارق تقويم هجري فعلي لا بالتقريب الشمسي.'}
                    {snapshot.situationType === 'divorced-non-menstruating' && 'عدة المرأة التي لا تحيض (لصغر سنها أو بلوغها سن اليأس) ثلاثة أشهر هجرية كاملة (سورة الطلاق: 4).'}
                    {snapshot.situationType === 'divorced-menstruating' && 'عدة المطلقة الحائض ثلاثة قروء (حيضات كاملة) وفق سورة البقرة: 228 — مدة تعتمد على دورتها الشخصية لا على عدد أيام ثابت.'}
                    {snapshot.situationType === 'pregnant' && 'عدة الحامل أن تضع حملها، سواء كانت أرملة أو مطلقة (سورة الطلاق: 4).'}
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <div className="calc-metric-card">
              <div className="calc-metric-card__note">
                <Heart size={14} weight="bold" style={{ display: 'inline', verticalAlign: '-2px' }} />
                {' '}اختاري حالتك وأدخلي التاريخ لعرض النتيجة.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
