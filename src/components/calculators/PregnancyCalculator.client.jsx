"use client";

import { useMemo, useState } from 'react';
import { Baby, CalendarBlank, CheckCircle, Circle, Timer } from '@phosphor-icons/react';

import ResultActions from '@/components/calculators/ResultActions.client';
import { Label } from '@/components/ui/label';
import { getHijriParts } from '@/lib/hijri-utils';
import { calculatePregnancy, formatPregnancyWeek, TRIMESTER_INFO } from '@/lib/calculators/pregnancy';

const CYCLE_PRESETS = [
  { label: '21 يوم', value: 21 },
  { label: '25 يوم', value: 25 },
  { label: '28 يوم (معيار)', value: 28 },
  { label: '30 يوم', value: 30 },
  { label: '35 يوم', value: 35 },
];

const INPUT_MODES = [
  { key: 'lmp', label: 'آخر دورة (LMP)' },
  { key: 'ultrasound', label: 'موجات فوق صوتية' },
  { key: 'conception', label: 'إخصاب / أطفال أنابيب' },
];

function formatDateAr(date) {
  if (!date) return '';
  return date.toLocaleDateString('ar-EG-u-nu-latn', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function formatHijriDate(parts) {
  if (!parts || !parts.hijriDay) return '';
  return `${parts.hijriDay} ${parts.hijriMonthName} ${parts.hijriYear} هـ`;
}

function deriveLmpFromUltrasound({ usDate, usWeeks, usDays }) {
  if (!usDate || usWeeks === '' || usWeeks === undefined) return null;
  const date = new Date(usDate);
  if (isNaN(date.getTime())) return null;
  const totalDays = (Number(usWeeks) || 0) * 7 + (Number(usDays) || 0);
  const lmp = new Date(date.getTime() - totalDays * 86400000);
  return lmp.toISOString().split('T')[0];
}

function deriveLmpFromConception({ conceptionDate, isIvf, embryoDay }) {
  if (!conceptionDate) return null;
  const date = new Date(conceptionDate);
  if (isNaN(date.getTime())) return null;
  // IVF blastocyst (day 5 transfer): LMP = transfer date - 19 days
  // IVF day-3 embryo: LMP = transfer date - 17 days
  // Natural conception: LMP ≈ conception date - 14 days
  const offset = isIvf ? (embryoDay === 3 ? 17 : 19) : 14;
  const lmp = new Date(date.getTime() - offset * 86400000);
  return lmp.toISOString().split('T')[0];
}

export default function PregnancyCalculator() {
  const [mode, setMode] = useState('lmp');

  // LMP mode
  const [lmpDate, setLmpDate] = useState('');
  const [cycleLength, setCycleLength] = useState(28);

  // Ultrasound mode
  const [usDate, setUsDate] = useState('');
  const [usWeeks, setUsWeeks] = useState('');
  const [usDays, setUsDays] = useState('0');

  // Conception/IVF mode
  const [conceptionDate, setConceptionDate] = useState('');
  const [isIvf, setIsIvf] = useState(false);
  const [embryoDay, setEmbryoDay] = useState(5);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const maxDate = today.toISOString().split('T')[0];
  const minDate = new Date(today.getTime() - 294 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const effectiveLmp = useMemo(() => {
    if (mode === 'lmp') return lmpDate || null;
    if (mode === 'ultrasound') return deriveLmpFromUltrasound({ usDate, usWeeks, usDays });
    if (mode === 'conception') return deriveLmpFromConception({ conceptionDate, isIvf, embryoDay });
    return null;
  }, [mode, lmpDate, usDate, usWeeks, usDays, conceptionDate, isIvf, embryoDay]);

  const result = useMemo(() => {
    if (!effectiveLmp) return null;
    return calculatePregnancy({ lmpDate: effectiveLmp, cycleLength: 28, today: new Date() });
  }, [effectiveLmp]);

  const tInfo = result ? (TRIMESTER_INFO[result.trimester] || TRIMESTER_INFO[1]) : null;
  const eddHijri = result?.edd ? getHijriParts(result.edd) : null;

  const shareText = result?.isValid
    ? [
        `أنا في ${formatPregnancyWeek(result.weeksPregnant, result.extraDays)} من الحمل`,
        `موعد الولادة المتوقع: ${formatDateAr(result.edd)}`,
        eddHijri ? `(${formatHijriDate(eddHijri)})` : '',
        `${result.progressPercent}% من الحمل مكتمل`,
      ]
        .filter(Boolean)
        .join('\n')
    : '';

  const reachedMilestones = result?.milestones?.filter((m) => m.reached || m.current) ?? [];
  const upcomingMilestones = result?.milestones?.filter((m) => !m.reached && !m.current) ?? [];

  const hasInput = mode === 'lmp' ? !!lmpDate
    : mode === 'ultrasound' ? (!!usDate && usWeeks !== '')
    : !!conceptionDate;

  return (
    <div className="calc-app pregnancy-tool" aria-label="حاسبة الحمل وموعد الولادة">
      <div className="calc-esb-layout">

        {/* ── FORM ─────────────────────────────────── */}
        <div className="calc-esb-form-col">
          <div
            className="calc-surface-card calc-esb-form-card"
            style={{
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-subtle)',
              background: 'var(--bg-surface-1)',
            }}
          >
            <div className="calc-esb-form-body">

              {/* Input mode selector */}
              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">1</span>
                  <Label>اختاري طريقة الحساب</Label>
                </div>
                <div className="calc-kbd-row" style={{ flexWrap: 'wrap', gap: '0.5rem' }}>
                  {INPUT_MODES.map((m) => (
                    <button
                      key={m.key}
                      type="button"
                      className={`chip calc-chip-button${mode === m.key ? ' is-active' : ''}`}
                      onClick={() => setMode(m.key)}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* ─ LMP mode ─ */}
              {mode === 'lmp' && (
                <>
                  <div className="calc-esb-field">
                    <div className="calc-esb-field-label">
                      <span className="calc-esb-step">2</span>
                      <Label htmlFor="pregnancy-lmp">أول يوم في آخر دورة شهرية</Label>
                    </div>
                    <input
                      id="pregnancy-lmp"
                      type="date"
                      className="pregnancy-date-input"
                      value={lmpDate}
                      max={maxDate}
                      min={minDate}
                      onChange={(e) => setLmpDate(e.target.value)}
                      dir="ltr"
                    />
                    <p className="calc-hint">
                      أدخلي أول يوم في آخر دورة — ليس يوم التأخر أو اختبار الحمل.
                      {' '}<a href="/date/converter" className="pregnancy-hint-link">حوّلي من هجري ↔ ميلادي</a>
                    </p>
                  </div>
                  <div className="calc-esb-field">
                    <div className="calc-esb-field-label">
                      <span className="calc-esb-step">3</span>
                      <Label>طول الدورة الشهرية</Label>
                    </div>
                    <div className="calc-kbd-row" style={{ flexWrap: 'wrap', gap: '0.5rem' }}>
                      {CYCLE_PRESETS.map((preset) => (
                        <button
                          key={preset.value}
                          type="button"
                          className={`chip calc-chip-button${cycleLength === preset.value ? ' is-active' : ''}`}
                          onClick={() => setCycleLength(preset.value)}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                    <p className="calc-hint">المعيار الطبي 28 يوم — غيّري فقط إذا كانت دورتك منتظمة بطول مختلف.</p>
                  </div>
                </>
              )}

              {/* ─ Ultrasound mode ─ */}
              {mode === 'ultrasound' && (
                <>
                  <div className="calc-esb-field">
                    <div className="calc-esb-field-label">
                      <span className="calc-esb-step">2</span>
                      <Label htmlFor="us-date">تاريخ جلسة الموجات فوق الصوتية</Label>
                    </div>
                    <input
                      id="us-date"
                      type="date"
                      className="pregnancy-date-input"
                      value={usDate}
                      max={maxDate}
                      min={minDate}
                      onChange={(e) => setUsDate(e.target.value)}
                      dir="ltr"
                    />
                    <p className="calc-hint">أدخلي تاريخ جلسة السونار التي ظهر فيها عمر الجنين.</p>
                  </div>
                  <div className="calc-esb-field">
                    <div className="calc-esb-field-label">
                      <span className="calc-esb-step">3</span>
                      <Label>عمر الجنين في السونار</Label>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                      <div style={{ flex: 1 }}>
                        <p className="calc-hint" style={{ marginBottom: '0.3rem' }}>أسابيع</p>
                        <div className="calc-esb-money-row">
                          <input
                            type="number"
                            inputMode="numeric"
                            className="pregnancy-date-input"
                            value={usWeeks}
                            min="4"
                            max="42"
                            placeholder="مثال: 12"
                            onChange={(e) => setUsWeeks(e.target.value)}
                            style={{ maxWidth: '100px' }}
                          />
                          <span className="calc-esb-currency">أسبوع</span>
                        </div>
                      </div>
                      <div style={{ flex: 1 }}>
                        <p className="calc-hint" style={{ marginBottom: '0.3rem' }}>أيام إضافية</p>
                        <div className="calc-esb-money-row">
                          <input
                            type="number"
                            inputMode="numeric"
                            className="pregnancy-date-input"
                            value={usDays}
                            min="0"
                            max="6"
                            placeholder="0"
                            onChange={(e) => setUsDays(e.target.value)}
                            style={{ maxWidth: '80px' }}
                          />
                          <span className="calc-esb-currency">يوم</span>
                        </div>
                      </div>
                    </div>
                    <p className="calc-hint">الأرقام مكتوبة في تقرير الطبيبة — مثلاً: ١٢ أسبوع و٣ أيام.</p>
                  </div>
                </>
              )}

              {/* ─ Conception / IVF mode ─ */}
              {mode === 'conception' && (
                <>
                  <div className="calc-esb-field">
                    <div className="calc-esb-field-label">
                      <span className="calc-esb-step">2</span>
                      <Label>نوع الإخصاب</Label>
                    </div>
                    <div className="calc-kbd-row" style={{ gap: '0.5rem' }}>
                      <button
                        type="button"
                        className={`chip calc-chip-button${!isIvf ? ' is-active' : ''}`}
                        onClick={() => setIsIvf(false)}
                      >
                        حمل طبيعي
                      </button>
                      <button
                        type="button"
                        className={`chip calc-chip-button${isIvf ? ' is-active' : ''}`}
                        onClick={() => setIsIvf(true)}
                      >
                        أطفال أنابيب (IVF/ICSI)
                      </button>
                    </div>
                  </div>

                  {isIvf && (
                    <div className="calc-esb-field">
                      <div className="calc-esb-field-label">
                        <span className="calc-esb-step">3</span>
                        <Label>نوع الجنين المنقول</Label>
                      </div>
                      <div className="calc-kbd-row" style={{ gap: '0.5rem' }}>
                        <button
                          type="button"
                          className={`chip calc-chip-button${embryoDay === 5 ? ' is-active' : ''}`}
                          onClick={() => setEmbryoDay(5)}
                        >
                          بلاستوسيست — اليوم 5
                        </button>
                        <button
                          type="button"
                          className={`chip calc-chip-button${embryoDay === 3 ? ' is-active' : ''}`}
                          onClick={() => setEmbryoDay(3)}
                        >
                          جنين اليوم 3
                        </button>
                      </div>
                      <p className="calc-hint">معظم مراكز IVF الحديثة تستخدم بلاستوسيست اليوم 5.</p>
                    </div>
                  )}

                  <div className="calc-esb-field">
                    <div className="calc-esb-field-label">
                      <span className="calc-esb-step">{isIvf ? '4' : '3'}</span>
                      <Label htmlFor="conception-date">
                        {isIvf ? 'تاريخ نقل الجنين (Transfer Date)' : 'تاريخ الإخصاب التقريبي'}
                      </Label>
                    </div>
                    <input
                      id="conception-date"
                      type="date"
                      className="pregnancy-date-input"
                      value={conceptionDate}
                      max={maxDate}
                      min={minDate}
                      onChange={(e) => setConceptionDate(e.target.value)}
                      dir="ltr"
                    />
                    <p className="calc-hint">
                      {isIvf
                        ? 'تاريخ Embryo Transfer المكتوب في ملف العيادة.'
                        : 'إذا كنتِ تعرفين تاريخ الإباضة، أضيفي إليه يوم واحد.'}
                    </p>
                  </div>
                </>
              )}

            </div>
          </div>
        </div>

        {/* ── RESULT ───────────────────────────────── */}
        <div className="calc-esb-result-col">

          {!hasInput && (
            <div className="calc-esb-empty-state">
              <Baby size={32} weight="duotone" style={{ color: '#e11d48' }} />
              <p>
                {mode === 'lmp' && 'أدخلي تاريخ آخر دورة لمعرفة أسبوع حملك وموعد الولادة بالميلادي والهجري.'}
                {mode === 'ultrasound' && 'أدخلي تاريخ السونار وعمر الجنين لحساب موعد الولادة.'}
                {mode === 'conception' && 'أدخلي تاريخ الإخصاب أو نقل الجنين لحساب أسبوع الحمل وموعد الولادة.'}
              </p>
            </div>
          )}

          {hasInput && (!result || !result.isValid) && (
            <div className="calc-esb-empty-state">
              <Baby size={28} weight="duotone" style={{ color: '#e11d48' }} />
              <p>التاريخ يبدو خارج النطاق — تأكدي من صحة التاريخ المدخل (يجب أن يكون خلال آخر 42 أسبوعاً).</p>
            </div>
          )}

          {result?.isValid && tInfo && (
            <div className="calc-result-hero-panel pregnancy-result" aria-live="polite">

              {/* Week + Trimester */}
              <div className="pregnancy-week-hero">
                <span className="calc-result-hero-label">أنتِ الآن في</span>
                <div
                  className="calc-result-hero-value"
                  style={{ color: tInfo.color, fontSize: '2rem', lineHeight: 1.1 }}
                >
                  {formatPregnancyWeek(result.weeksPregnant, result.extraDays)}
                </div>
                <span
                  className="bmi-category-badge"
                  style={{
                    background: `${tInfo.color}20`,
                    color: tInfo.color,
                    border: `1px solid ${tInfo.color}40`,
                    display: 'inline-block',
                    marginTop: '0.35rem',
                  }}
                >
                  {tInfo.label} · {tInfo.range}
                </span>
              </div>

              {/* Progress bar */}
              <div className="pregnancy-progress-wrap">
                <div className="pregnancy-progress-track">
                  <div
                    className="pregnancy-progress-fill"
                    style={{ width: `${result.progressPercent}%`, background: tInfo.color }}
                    aria-label={`${result.progressPercent}% من الحمل مكتمل`}
                  />
                </div>
                <div className="pregnancy-progress-labels">
                  <span>الأسبوع 1</span>
                  <span style={{ color: tInfo.color, fontWeight: 700 }}>{result.progressPercent}% مكتمل</span>
                  <span>الأسبوع 40</span>
                </div>
              </div>

              {/* EDD breakdown */}
              <div className="calc-esb-breakdown">
                <div className="calc-esb-brow calc-esb-brow--total">
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <CalendarBlank size={14} weight="bold" />
                    موعد الولادة المتوقع (ميلادي)
                  </span>
                  <strong>{formatDateAr(result.edd)}</strong>
                </div>
                {eddHijri && (
                  <div className="calc-esb-brow">
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <CalendarBlank size={14} weight="bold" />
                      موعد الولادة (هجري)
                    </span>
                    <strong>{formatHijriDate(eddHijri)}</strong>
                  </div>
                )}
                <div className="calc-esb-brow">
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Timer size={14} weight="bold" />
                    {result.daysToEdd >= 0 ? 'باقي على الولادة' : 'مضى على موعد الولادة'}
                  </span>
                  <strong>{Math.abs(result.daysToEdd)} يوم</strong>
                </div>
                <div className="calc-esb-brow">
                  <span>أيام الحمل المنقضية</span>
                  <strong>{result.daysPregnant} يوم ({result.weeksPregnant} أسبوع)</strong>
                </div>
              </div>

              {/* Milestone timeline */}
              {upcomingMilestones.length > 0 && (
                <div className="pregnancy-milestones">
                  <p className="pregnancy-milestones-title">المحطات القادمة</p>
                  {upcomingMilestones.slice(0, 4).map((m) => (
                    <div key={m.week} className="pregnancy-milestone-row pregnancy-milestone--upcoming">
                      <Circle size={15} weight="regular" style={{ color: 'var(--fg-subtle)', flexShrink: 0, marginTop: 2 }} />
                      <div className="pregnancy-milestone-text">
                        <span className="pregnancy-milestone-week">أسبوع {m.week}</span>
                        <span className="pregnancy-milestone-label">{m.label}</span>
                      </div>
                      <span className="pregnancy-milestone-date">{formatDateAr(m.date)}</span>
                    </div>
                  ))}
                </div>
              )}

              {reachedMilestones.length > 0 && (
                <div className="pregnancy-milestones">
                  <p className="pregnancy-milestones-title">محطات مررتِ بها</p>
                  {reachedMilestones.slice(-4).map((m) => (
                    <div key={m.week} className="pregnancy-milestone-row pregnancy-milestone--done">
                      <CheckCircle size={15} weight="fill" style={{ color: tInfo.color, flexShrink: 0, marginTop: 2 }} />
                      <div className="pregnancy-milestone-text">
                        <span className="pregnancy-milestone-week">أسبوع {m.week}</span>
                        <span className="pregnancy-milestone-label">{m.label}</span>
                      </div>
                      <span className="pregnancy-milestone-date">{formatDateAr(m.date)}</span>
                    </div>
                  ))}
                </div>
              )}

              <p className="bmi-disclaimer">
                موعد الولادة تقدير استرشادي — راجعي طبيبك للتأكيد. في حالة IVF يكون الموعد أدق لأن تاريخ الإخصاب معروف بدقة.
              </p>

              <ResultActions
                copyText={shareText}
                shareTitle="حاسبة الحمل"
                shareText={shareText}
              />

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
