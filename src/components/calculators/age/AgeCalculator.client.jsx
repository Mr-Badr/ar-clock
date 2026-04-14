"use client";

import { useMemo, useState } from 'react';
import { Hourglass, Milestone, MoonStar, Timer, Waves } from 'lucide-react';

import ResultActions from '@/components/calculators/ResultActions.client';
import { CalcButton as Button } from '@/components/calculators/controls.client';
import {
  BirthInputBlock,
  HeroSummaryCard,
  InlineFacts,
  MetricGrid,
  MilestoneList,
  ProgressCard,
  resolveBirthInput,
  ResultState,
} from '@/components/calculators/age/shared.client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { buildAgeSnapshot, formatAgeDate, formatAgeNumber, getTodayIso } from '@/lib/calculators/age';

export default function AgeCalculator({ compact = false }) {
  const [calendar, setCalendar] = useState('gregorian');
  const [birthIso, setBirthIso] = useState('1995-03-12');
  const [birthHijri, setBirthHijri] = useState({ day: '12', month: '9', year: '1415' });
  const [compareMode, setCompareMode] = useState('today');
  const [targetIso, setTargetIso] = useState(getTodayIso());

  const normalized = useMemo(
    () => resolveBirthInput(calendar, birthIso, birthHijri),
    [calendar, birthIso, birthHijri],
  );

  const result = useMemo(() => {
    if (!normalized.isValid) return normalized;
    return buildAgeSnapshot({
      birthDateIso: normalized.iso,
      targetDateIso: compareMode === 'today' ? getTodayIso() : targetIso,
    });
  }, [compareMode, normalized, targetIso]);

  const shareText = result?.isValid
    ? `العمر الحالي: ${result.ageLabel}\nعيد الميلاد القادم: ${result.nextBirthday.label}\nالمتبقي: ${formatAgeNumber(result.nextBirthday.daysUntil, { maximumFractionDigits: 0 })} يوم`
    : '';

  if (compact) {
    return (
      <div className="calc-app age-demo">
        <BirthInputBlock
          calendar={calendar}
          onCalendarChange={setCalendar}
          gregorianValue={birthIso}
          onGregorianChange={setBirthIso}
          hijriValue={birthHijri}
          onHijriChange={setBirthHijri}
        />
        <HeroSummaryCard
          title="معاينة سريعة"
          result={result}
          footer={
            result?.isValid ? (
              <>
                <span>عيد الميلاد القادم: {result.nextBirthday.label}</span>
                <span>المتبقي: {formatAgeNumber(result.nextBirthday.daysUntil, { maximumFractionDigits: 0 })} يوم</span>
              </>
            ) : null
          }
        />
      </div>
    );
  }

  return (
    <div className="calc-app">
      <div className="calc-app-grid age-app-grid">
        <Card className="calc-surface-card calc-app-panel">
          <CardHeader>
            <CardTitle className="calc-card-title">أدخل تاريخ الميلاد</CardTitle>
          </CardHeader>
          <CardContent className="calc-form-grid">
            <BirthInputBlock
              calendar={calendar}
              onCalendarChange={setCalendar}
              gregorianValue={birthIso}
              onGregorianChange={setBirthIso}
              hijriValue={birthHijri}
              onHijriChange={setBirthHijri}
            />

            <div className="calc-field">
              <div className="calc-field-row">
                <Label className="calc-label">احسب على تاريخ</Label>
                <div className="calc-kbd-row">
                  <button
                    type="button"
                    className={`calc-chip-button ${compareMode === 'today' ? 'is-active' : ''}`}
                    onClick={() => setCompareMode('today')}
                  >
                    اليوم
                  </button>
                  <button
                    type="button"
                    className={`calc-chip-button ${compareMode === 'custom' ? 'is-active' : ''}`}
                    onClick={() => setCompareMode('custom')}
                  >
                    تاريخ محدد
                  </button>
                </div>
              </div>
              {compareMode === 'custom' ? (
                <input
                  className="input calc-input"
                  type="date"
                  value={targetIso}
                  onChange={(event) => setTargetIso(event.target.value)}
                />
              ) : (
                <div className="calc-note">سيتم استخدام تاريخ اليوم تلقائياً في الحساب.</div>
              )}
            </div>

            <div className="calc-kbd-row">
              <Button type="button" variant="outline" size="sm" onClick={() => {
                setCalendar('gregorian');
                setBirthIso('1995-03-12');
                setBirthHijri({ day: '12', month: '9', year: '1415' });
                setCompareMode('today');
                setTargetIso(getTodayIso());
              }}
              >
                مثال جاهز
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="calc-results-panel">
          <HeroSummaryCard
            title="العمر الحالي"
            result={result}
            footer={
              result?.isValid ? (
                <>
                  <span>{result.birthDateLabel}</span>
                  <span>{result.birthWeekday}</span>
                </>
              ) : null
            }
          />

          <ResultState result={result} />

          {result?.isValid ? (
            <>
              <MetricGrid
                items={[
                  {
                    label: 'العمر الكامل',
                    value: result.ageLabel,
                    note: `مقارنة حتى ${result.targetDateLabel}`,
                  },
                  {
                    label: 'إجمالي الأيام',
                    value: `${formatAgeNumber(result.totals.days, { maximumFractionDigits: 0 })} يوم`,
                    note: `${formatAgeNumber(result.totals.weeks)} أسبوع تقريباً`,
                  },
                  {
                    label: 'إجمالي الساعات',
                    value: `${formatAgeNumber(result.totals.hours, { maximumFractionDigits: 0 })} ساعة`,
                    note: `${formatAgeNumber(result.totals.minutes, { maximumFractionDigits: 0 })} دقيقة`,
                  },
                  {
                    label: 'إجمالي الثواني',
                    value: `${formatAgeNumber(result.totals.seconds, { maximumFractionDigits: 0 })} ثانية`,
                    note: 'قيمة تراكمية منذ تاريخ الميلاد',
                  },
                  {
                    label: 'العمر الهجري التقريبي',
                    value: `${formatAgeNumber(result.hijri.yearsApprox)} سنة`,
                    note: result.hijri.birth?.formatted?.ar || 'ضمن النطاق المدعوم للتحويل',
                  },
                  {
                    label: 'عيد الميلاد القادم',
                    value: `${formatAgeNumber(result.nextBirthday.daysUntil, { maximumFractionDigits: 0 })} يوم`,
                    note: `${result.nextBirthday.weekday} · ${result.nextBirthday.label}`,
                  },
                ]}
              />

              <ProgressCard
                title="التقدم داخل سنة ميلادك الحالية"
                value={result.birthdayProgress.progressPercent}
                note={`مرّ ${formatAgeNumber(result.birthdayProgress.elapsedDays, { maximumFractionDigits: 0 })} يوم من أصل ${formatAgeNumber(result.birthdayProgress.totalDays, { maximumFractionDigits: 0 })} يوم بين آخر عيد ميلاد والقادم.`}
              />

              <Card className="calc-surface-card">
                <CardHeader>
                  <CardTitle className="calc-card-title">ملخصات سريعة</CardTitle>
                </CardHeader>
                <CardContent className="calc-breakdown-list">
                  <InlineFacts
                    items={[
                      { label: 'جيلك', value: result.personal.generation.label },
                      { label: 'فصل الميلاد', value: result.personal.season },
                      { label: 'نصف عيد الميلاد', value: formatAgeDate(result.personal.halfBirthdayIso) },
                    ]}
                  />
                  <div className="calc-mini-item">
                    <strong>تاريخ الميلاد الهجري</strong>
                    <span>{result.hijri.birth?.formatted?.ar || 'غير متاح لهذا التاريخ'}</span>
                  </div>
                  <div className="calc-mini-item">
                    <strong>عيد الميلاد القادم</strong>
                    <span>ستبلغ {formatAgeNumber(result.nextBirthday.nextAge, { maximumFractionDigits: 0 })} سنة في {result.nextBirthday.label}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="calc-surface-card">
                <CardHeader>
                  <CardTitle className="calc-card-title">إحصائيات تقديرية ممتعة</CardTitle>
                </CardHeader>
                <CardContent>
                  <MetricGrid
                    items={[
                      {
                        label: 'نبضات القلب',
                        value: formatAgeNumber(result.lifeStats.heartbeats, { maximumFractionDigits: 0 }),
                        note: 'على متوسط 72 نبضة في الدقيقة.',
                      },
                      {
                        label: 'الخطوات',
                        value: formatAgeNumber(result.lifeStats.steps, { maximumFractionDigits: 0 }),
                        note: 'بمتوسط 7,000 خطوة في اليوم.',
                      },
                      {
                        label: 'ساعات النوم',
                        value: formatAgeNumber(result.lifeStats.sleepHours, { maximumFractionDigits: 0 }),
                        note: 'على افتراض 8 ساعات يومياً.',
                      },
                      {
                        label: 'كمية الماء',
                        value: `${formatAgeNumber(result.lifeStats.waterLiters, { maximumFractionDigits: 0 })} لتر`,
                        note: 'بمتوسط 1.5 لتر يومياً.',
                      },
                      {
                        label: 'مرات الرمش',
                        value: formatAgeNumber(result.lifeStats.blinks, { maximumFractionDigits: 0 }),
                        note: 'تقدير تقريبي للاستخدام الترفيهي.',
                      },
                    ]}
                  />
                </CardContent>
              </Card>

              <Card className="calc-surface-card">
                <CardHeader>
                  <CardTitle className="calc-card-title">الإنجازات الزمنية الأقرب</CardTitle>
                </CardHeader>
                <CardContent>
                  <MilestoneList items={result.milestones.slice(0, 4)} />
                </CardContent>
              </Card>

              <Card className="calc-surface-card">
                <CardHeader>
                  <CardTitle className="calc-card-title">مشاركة النتيجة</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResultActions
                    copyText={shareText}
                    shareTitle="نتيجة حاسبة العمر"
                    shareText={shareText}
                  />
                </CardContent>
              </Card>
            </>
          ) : null}
        </div>
      </div>

      {result?.isValid ? (
        <div className="calc-grid-3">
          <Card className="calc-surface-card">
            <CardHeader>
              <CardTitle className="calc-card-title">
                <Hourglass size={16} style={{ marginLeft: '5px' }} />
                بين الميلادي والهجري
              </CardTitle>
            </CardHeader>
            <CardContent className="calc-card-copy">
              يظهر عمرك الهجري أكبر قليلاً لأن السنة الهجرية أقصر من الميلادية بنحو 10 إلى 11 يوماً، لذلك يتراكم الفرق مع مرور السنين.
            </CardContent>
          </Card>
          <Card className="calc-surface-card">
            <CardHeader>
              <CardTitle className="calc-card-title">
                <MoonStar size={16} style={{ marginLeft: '5px' }} />
                تاريخك الهجري
              </CardTitle>
            </CardHeader>
            <CardContent className="calc-card-copy">
              {result.hijri.birth?.formatted?.ar || 'هذا التاريخ خارج نطاق التحويل المدعوم حالياً.'}
            </CardContent>
          </Card>
          <Card className="calc-surface-card">
            <CardHeader>
              <CardTitle className="calc-card-title">
                <Timer size={16} style={{ marginLeft: '5px' }} />
                علامة زمنية مميزة
              </CardTitle>
            </CardHeader>
            <CardContent className="calc-card-copy">
              أقرب محطة كبيرة لك الآن هي {result.milestones.find((item) => !item.isReached)?.label || 'لقد تجاوزت كل المحطات الافتراضية الحالية'}.
            </CardContent>
          </Card>
        </div>
      ) : null}

      {result?.isValid ? (
        <Card className="calc-surface-card">
          <CardHeader>
            <CardTitle className="calc-card-title">
              <Milestone size={16} style={{ marginLeft: '5px' }} />
              كيف نقرأ هذه النتيجة؟
            </CardTitle>
          </CardHeader>
          <CardContent className="calc-card-copy">
            يتم أولاً حساب الفرق الحقيقي بين تاريخ الميلاد وتاريخ المقارنة، ثم يُعرض هذا الفرق بصيغة بشرية واضحة
            مثل "29 سنة و3 أشهر و14 يوماً". بعد ذلك نشتق منه الوحدات التراكمية مثل الأيام والساعات والثواني،
            ثم نبني فوقها عداد عيد الميلاد القادم والإنجازات الزمنية.
          </CardContent>
        </Card>
      ) : (
        <Card className="calc-surface-card">
          <CardHeader>
            <CardTitle className="calc-card-title">
              <Waves size={16} style={{ marginLeft: '5px' }} />
              ماذا ستجد هنا؟
            </CardTitle>
          </CardHeader>
          <CardContent className="calc-card-copy">
            بعد إدخال تاريخ ميلاد صحيح ستظهر لك السنوات والأشهر والأيام، وإجمالي الوقت، وموعد عيد الميلاد القادم،
            ونسخة تقريبية من العمر الهجري، ثم مجموعة من الإحصائيات الممتعة والإنجازات الزمنية.
          </CardContent>
        </Card>
      )}
    </div>
  );
}
