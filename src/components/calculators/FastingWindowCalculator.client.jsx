'use client';

import { useEffect, useMemo, useState } from 'react';
import { Leaf, Moon, Sun } from 'lucide-react';

import { CalcInput as Input } from '@/components/calculators/controls.client';
import ResultActions from '@/components/calculators/ResultActions.client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

// ─── Protocol definitions ──────────────────────────────────────────────────

const PROTOCOLS = [
  {
    id: '16:8',
    label: '16:8',
    name: 'الأكثر شيوعاً',
    fastHours: 16,
    eatHours: 8,
    difficulty: 'مناسب للمبتدئين',
    autophagyHour: 14,
  },
  {
    id: '18:6',
    label: '18:6',
    name: 'متوسط',
    fastHours: 18,
    eatHours: 6,
    difficulty: 'للمتوسطين',
    autophagyHour: 16,
  },
  {
    id: '20:4',
    label: '20:4',
    name: 'حمية المحارب',
    fastHours: 20,
    eatHours: 4,
    difficulty: 'للمتقدمين',
    autophagyHour: 16,
  },
  {
    id: 'OMAD',
    label: 'OMAD',
    name: 'وجبة واحدة',
    fastHours: 23,
    eatHours: 1,
    difficulty: 'متقدم جداً',
    autophagyHour: 18,
  },
  {
    id: '5:2',
    label: '5:2',
    name: 'مرن',
    fastHours: null,
    eatHours: null,
    difficulty: 'مرن',
    autophagyHour: null,
    description: 'أكل عادي 5 أيام، وتخفيض السعرات (500–600) يومين غير متتاليين.',
  },
];

// ─── Autophagy stages ──────────────────────────────────────────────────────

const STAGES = [
  {
    fromH: 0,
    toH: 12,
    icon: '🍽️',
    label: 'هضم وامتصاص',
    color: 'var(--text-muted)',
    desc: 'الجسم يعالج آخر وجبة وينتج طاقة من الغلوكوز.',
  },
  {
    fromH: 12,
    toH: 16,
    icon: '🔥',
    label: 'حرق الدهون',
    color: 'var(--calc-cat-health)',
    desc: 'استنفاد الغليكوجين، الجسم يبدأ بتحويل الدهون إلى طاقة.',
  },
  {
    fromH: 16,
    toH: 24,
    icon: '🌿',
    label: 'الالتهام الذاتي يبدأ',
    color: '#22c55e',
    desc: 'الخلايا تُنظّف مكوناتها التالفة وتُعيد تدويرها (نوبل 2016).',
  },
  {
    fromH: 24,
    toH: 72,
    icon: '⚡',
    label: 'التجديد الخلوي',
    color: 'var(--calc-cat-finance)',
    desc: 'ذروة الالتهام الذاتي. ارتفاع هرمون النمو، صفاء ذهني.',
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────

function parseTime(str) {
  const [h, m] = str.split(':').map(Number);
  if (!isFinite(h) || !isFinite(m)) return null;
  return h * 60 + m;
}

function addMinutes(totalMin, addMin) {
  return ((totalMin + addMin) % 1440 + 1440) % 1440;
}

function formatMinutes(totalMin) {
  const h = Math.floor(totalMin / 60) % 24;
  const m = totalMin % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

function minutesDiff(from, to) {
  return ((to - from) % 1440 + 1440) % 1440;
}

function formatDuration(mins) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (m === 0) return `${h} ساعة`;
  return `${h} ساعة و${m} دقيقة`;
}

function getStage(hours) {
  return STAGES.find((s) => hours >= s.fromH && hours < s.toH) ?? STAGES[STAGES.length - 1];
}

// ─── Fasting logic ────────────────────────────────────────────────────────

function calcWindow(lastMealTime, protocolId) {
  const proto = PROTOCOLS.find((p) => p.id === protocolId);
  if (!proto || !proto.fastHours) return null;

  const startMin = parseTime(lastMealTime);
  if (startMin === null) return null;

  const fastEndMin = addMinutes(startMin, proto.fastHours * 60);
  const eatEndMin = addMinutes(fastEndMin, proto.eatHours * 60);

  return {
    proto,
    fastStart: formatMinutes(startMin),
    fastEnd: formatMinutes(fastEndMin),
    eatStart: formatMinutes(fastEndMin),
    eatEnd: formatMinutes(eatEndMin),
  };
}

// ─── Live status banner ───────────────────────────────────────────────────

function LiveStatus({ lastMealTime, protocolId }) {
  const [now, setNow] = useState(() => {
    const d = new Date();
    return d.getHours() * 60 + d.getMinutes();
  });

  useEffect(() => {
    const id = setInterval(() => {
      const d = new Date();
      setNow(d.getHours() * 60 + d.getMinutes());
    }, 10000);
    return () => clearInterval(id);
  }, []);

  const proto = PROTOCOLS.find((p) => p.id === protocolId);
  if (!proto || !proto.fastHours) return null;

  const startMin = parseTime(lastMealTime);
  if (startMin === null) return null;

  const fastEndMin = addMinutes(startMin, proto.fastHours * 60);
  const elapsed = minutesDiff(startMin, now);
  const isFasting = elapsed < proto.fastHours * 60;
  const stage = getStage(elapsed / 60);

  if (isFasting) {
    const remaining = minutesDiff(now, fastEndMin);
    return (
      <div className="fasting-live --fasting">
        <div className="fasting-live__icon" style={{ color: stage.color }}>
          {stage.icon}
        </div>
        <div className="fasting-live__body">
          <p className="fasting-live__state">أنت في فترة الصيام الآن</p>
          <p className="fasting-live__time" style={{ color: stage.color }}>
            {formatDuration(remaining)} حتى نافذة الأكل
          </p>
          <p className="fasting-live__stage">{stage.label} — {stage.desc}</p>
        </div>
        <div className="fasting-live__elapsed">
          <span className="fasting-live__h">{(elapsed / 60).toFixed(1)}</span>
          <span className="fasting-live__hl">ساعة</span>
        </div>
      </div>
    );
  } else {
    const remaining = minutesDiff(now, addMinutes(fastEndMin, proto.eatHours * 60));
    return (
      <div className="fasting-live --eating">
        <div className="fasting-live__icon">🍽️</div>
        <div className="fasting-live__body">
          <p className="fasting-live__state">أنت في نافذة الأكل الآن</p>
          <p className="fasting-live__time">{formatDuration(remaining)} حتى نهاية النافذة</p>
          <p className="fasting-live__stage">استمتع بوجبتك — ابدأ الصيام في {formatMinutes(addMinutes(fastEndMin, proto.eatHours * 60))}</p>
        </div>
        <div className="fasting-live__elapsed">
          <Sun size={22} style={{ color: 'var(--calc-cat-health)' }} />
        </div>
      </div>
    );
  }
}

// ─── Autophagy bar ────────────────────────────────────────────────────────

function AutophagyBar({ fastHours }) {
  const stages = STAGES.filter((s) => s.fromH < fastHours);
  const maxH = fastHours;

  return (
    <div className="fasting-auto">
      <p className="fasting-auto__title">تقدّم الالتهام الذاتي عند {fastHours} ساعة صيام</p>
      <div className="fasting-auto__track">
        {stages.map((s, i) => {
          const width = (((Math.min(s.toH, fastHours) - s.fromH) / maxH) * 100).toFixed(1);
          return (
            <div
              key={i}
              className="fasting-auto__segment"
              style={{ width: `${width}%`, background: s.color }}
              title={`${s.fromH}–${Math.min(s.toH, fastHours)}h: ${s.label}`}
            />
          );
        })}
      </div>
      <div className="fasting-auto__labels">
        {stages.map((s, i) => (
          <span key={i} className="fasting-auto__lbl">
            <span className="fasting-auto__dot" style={{ background: s.color }} />
            <span>{s.label}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────

export default function FastingWindowCalculator() {
  const [lastMeal, setLastMeal] = useState('20:00');
  const [protocol, setProtocol] = useState('16:8');

  useEffect(() => {
    const d = new Date();
    const h = String(d.getHours()).padStart(2, '0');
    const m = String(d.getMinutes()).padStart(2, '0');
    setLastMeal(`${h}:${m}`);
  }, []);

  const fastingWindow = useMemo(() => calcWindow(lastMeal, protocol), [lastMeal, protocol]);
  const proto = PROTOCOLS.find((p) => p.id === protocol);

  const shareText = fastingWindow
    ? [
        `بروتوكول الصيام: ${fastingWindow.proto.id}`,
        `آخر وجبة: ${fastingWindow.fastStart}`,
        `نافذة الأكل: ${fastingWindow.eatStart} – ${fastingWindow.eatEnd}`,
        proto?.autophagyHour
          ? `الالتهام الذاتي يبدأ عند الساعة ${formatMinutes(addMinutes(parseTime(lastMeal), proto.autophagyHour * 60))}`
          : '',
      ]
        .filter(Boolean)
        .join('\n')
    : '';

  return (
    <div className="calc-app">
      <div className="calc-app-grid">

        {/* ── Inputs ─────────────────────────────── */}
        <Card className="calc-surface-card calc-app-panel">
          <CardHeader>
            <CardTitle className="calc-card-title">اختر بروتوكول الصيام</CardTitle>
          </CardHeader>
          <CardContent className="calc-form-grid">

            {/* Protocol picker */}
            <div className="calc-field">
              <Label className="calc-label">بروتوكول الصيام</Label>
              <div className="fasting-protocols">
                {PROTOCOLS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    className={`fasting-proto${protocol === p.id ? ' fasting-proto--active' : ''}`}
                    onClick={() => setProtocol(p.id)}
                  >
                    <span className="fasting-proto__id">{p.label}</span>
                    <span className="fasting-proto__name">{p.name}</span>
                    <span className="fasting-proto__diff">{p.difficulty}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Last meal time */}
            {protocol !== '5:2' && (
              <div className="calc-field">
                <Label className="calc-label" htmlFor="fasting-lastmeal">
                  متى كانت آخر وجبة أو وجبتك الأولى؟
                </Label>
                <Input
                  id="fasting-lastmeal"
                  type="time"
                  value={lastMeal}
                  onChange={(e) => setLastMeal(e.target.value)}
                />
              </div>
            )}

            {protocol === '5:2' && (
              <div className="calc-note" style={{ marginTop: 'var(--space-2)' }}>
                <strong>بروتوكول 5:2:</strong> أكل عادي خمسة أيام في الأسبوع، وتناول 500–600 سعرة فقط يومين غير متتاليين (مثل الاثنين والخميس). لا توجد نافذة أكل محددة بالساعات.
              </div>
            )}

          </CardContent>
        </Card>

        {/* ── Results ────────────────────────────── */}
        <div className="calc-results-panel">

          {protocol === '5:2' ? (
            <div className="fasting-five-two">
              <p className="fasting-five-two__title">بروتوكول 5:2 — جدول الأسبوع</p>
              <div className="fasting-five-two__grid">
                {['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'].map((day, i) => {
                  const isFastDay = i === 1 || i === 4;
                  return (
                    <div key={day} className={`fasting-day ${isFastDay ? 'fasting-day--fast' : 'fasting-day--eat'}`}>
                      <span className="fasting-day__name">{day}</span>
                      <span className="fasting-day__type">{isFastDay ? '🔥 تقليل' : '✅ عادي'}</span>
                    </div>
                  );
                })}
              </div>
              <p className="fasting-five-two__note">خصص يومي تقليل السعرات وفقاً لجدولك. الاثنين والخميس الأكثر شيوعاً.</p>
            </div>
          ) : fastingWindow ? (
            <>
              {/* Live status */}
              <LiveStatus lastMealTime={lastMeal} protocolId={protocol} />

              {/* Window schedule */}
              <div className="fasting-schedule">
                <div className="fasting-schedule__item --fast">
                  <div className="fasting-schedule__icon"><Moon size={16} /></div>
                  <div>
                    <p className="fasting-schedule__label">فترة الصيام</p>
                    <p className="fasting-schedule__time">
                      {fastingWindow.fastStart}
                      <span className="fasting-schedule__arrow">←</span>
                      {fastingWindow.fastEnd}
                    </p>
                    <p className="fasting-schedule__dur">{fastingWindow.proto.fastHours} ساعة</p>
                  </div>
                </div>
                <div className="fasting-schedule__item --eat">
                  <div className="fasting-schedule__icon"><Sun size={16} /></div>
                  <div>
                    <p className="fasting-schedule__label">نافذة الأكل</p>
                    <p className="fasting-schedule__time">
                      {fastingWindow.eatStart}
                      <span className="fasting-schedule__arrow">←</span>
                      {fastingWindow.eatEnd}
                    </p>
                    <p className="fasting-schedule__dur">{fastingWindow.proto.eatHours} ساعة</p>
                  </div>
                </div>
                {proto?.autophagyHour && (
                  <div className="fasting-schedule__item --auto">
                    <div className="fasting-schedule__icon"><Leaf size={16} /></div>
                    <div>
                      <p className="fasting-schedule__label">الالتهام الذاتي يبدأ</p>
                      <p className="fasting-schedule__time">
                        {formatMinutes(addMinutes(parseTime(lastMeal), proto.autophagyHour * 60))}
                      </p>
                      <p className="fasting-schedule__dur">بعد {proto.autophagyHour} ساعة من الصيام</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Autophagy bar */}
              {proto?.fastHours && <AutophagyBar fastHours={proto.fastHours} />}

              <ResultActions
                copyText={shareText}
                shareTitle="جدول الصيام المتقطع"
                shareText={shareText}
              />
            </>
          ) : (
            <div className="calc-metric-card">
              <div className="calc-metric-card__label">أدخل وقت آخر وجبة</div>
              <div className="calc-metric-card__value">—</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
