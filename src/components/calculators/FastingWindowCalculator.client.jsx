'use client';

import { useEffect, useMemo, useState } from 'react';
import { Leaf, Moon, ShareNetwork, Sun } from '@phosphor-icons/react';
import { toast } from 'sonner';

// ─── Protocol definitions ──────────────────────────────────────────────────

const PROTOCOLS = [
  { id: '16:8', label: '16:8', name: 'الأكثر شيوعاً', fastHours: 16, eatHours: 8, difficulty: 'مناسب للمبتدئين', autophagyHour: 14 },
  { id: '18:6', label: '18:6', name: 'متوسط', fastHours: 18, eatHours: 6, difficulty: 'للمتوسطين', autophagyHour: 16 },
  { id: '20:4', label: '20:4', name: 'حمية المحارب', fastHours: 20, eatHours: 4, difficulty: 'للمتقدمين', autophagyHour: 16 },
  { id: 'OMAD', label: 'OMAD', name: 'وجبة واحدة', fastHours: 23, eatHours: 1, difficulty: 'متقدم جداً', autophagyHour: 18 },
  { id: '5:2', label: '5:2', name: 'مرن', fastHours: null, eatHours: null, difficulty: 'مرن', autophagyHour: null, description: 'أكل عادي 5 أيام، وتخفيض السعرات (500–600) يومين غير متتاليين.' },
];

// ─── Autophagy stages ──────────────────────────────────────────────────────

const STAGES = [
  { fromH: 0, toH: 12, icon: '🍽️', label: 'هضم وامتصاص', color: 'var(--text-muted)', desc: 'الجسم يعالج آخر وجبة وينتج طاقة من الغلوكوز.' },
  { fromH: 12, toH: 16, icon: '🔥', label: 'حرق الدهون', color: 'var(--amber)', desc: 'استنفاد الغليكوجين، الجسم يبدأ بتحويل الدهون إلى طاقة.' },
  { fromH: 16, toH: 24, icon: '🌿', label: 'الالتهام الذاتي يبدأ', color: 'var(--green)', desc: 'الخلايا تُنظّف مكوناتها التالفة وتُعيد تدويرها (نوبل 2016).' },
  { fromH: 24, toH: 72, icon: '⚡', label: 'التجديد الخلوي', color: 'var(--blue)', desc: 'ذروة الالتهام الذاتي. ارتفاع هرمون النمو، صفاء ذهني.' },
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

async function shareResult(title, text) {
  if (navigator.share) {
    try { await navigator.share({ title, text }); return; } catch { /* cancelled */ }
  }
  try { await navigator.clipboard.writeText(text); toast.success('تم نسخ النتيجة إلى الحافظة'); }
  catch { toast.error('تعذر نسخ النتيجة'); }
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
      <div className="tool-v2-result-hero">
        <span className="tool-v2-result-label">{stage.icon} أنت في فترة الصيام الآن</span>
        <div className="tool-v2-result-value" style={{ color: stage.color }}>{formatDuration(remaining)}</div>
        <div className="tool-v2-result-meta">حتى نافذة الأكل — {stage.label}: {stage.desc} — منذ {(elapsed / 60).toFixed(1)} ساعة</div>
      </div>
    );
  }
  const remaining = minutesDiff(now, addMinutes(fastEndMin, proto.eatHours * 60));
  return (
    <div className="tool-v2-result-hero">
      <span className="tool-v2-result-label">🍽️ أنت في نافذة الأكل الآن</span>
      <div className="tool-v2-result-value">{formatDuration(remaining)}</div>
      <div className="tool-v2-result-meta">حتى نهاية النافذة — استمتع بوجبتك، ابدأ الصيام في {formatMinutes(addMinutes(fastEndMin, proto.eatHours * 60))}</div>
    </div>
  );
}

// ─── Autophagy bar ────────────────────────────────────────────────────────

function AutophagyBar({ fastHours }) {
  const stages = STAGES.filter((s) => s.fromH < fastHours);
  const maxH = fastHours;

  return (
    <div>
      <div className="tool-v2-mini-block-head"><span>تقدّم الالتهام الذاتي عند {fastHours} ساعة صيام</span></div>
      <div className="tool-v2-hbar-list">
        {stages.map((s, i) => {
          const width = (((Math.min(s.toH, fastHours) - s.fromH) / maxH) * 100).toFixed(1);
          return (
            <div key={i} className="tool-v2-hbar-row">
              <span className="tool-v2-hbar-label">{s.icon} {s.label}</span>
              <div className="tool-v2-hbar-track"><div className="tool-v2-hbar-fill" style={{ width: `${width}%`, background: s.color }} /></div>
              <span className="tool-v2-hbar-value">{s.fromH}–{Math.min(s.toH, fastHours)}h</span>
            </div>
          );
        })}
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
      ].filter(Boolean).join('\n')
    : '';

  return (
    <div aria-label="حاسبة الصيام المتقطع">
      <div className="tool-v2-panel-head">
        <span className="tool-v2-country-badge"><Moon size={14} weight="bold" /> الصيام المتقطع <span className="tool-v2-live-dot" aria-hidden="true" /></span>
      </div>

      <div className="tool-v2-field">
        <label>بروتوكول الصيام</label>
        <div className="tool-v2-choice-list">
          {PROTOCOLS.map((p) => {
            const active = protocol === p.id;
            return (
              <label key={p.id} className={`tool-v2-choice-card${active ? ' is-active' : ''}`} htmlFor={`fasting-proto-${p.id}`}>
                <input type="radio" id={`fasting-proto-${p.id}`} name="fasting-protocol" checked={active} onChange={() => setProtocol(p.id)} />
                <span className="tool-v2-choice-body">
                  <span className="tool-v2-choice-title">{p.label} <span className="tool-v2-choice-badge">{p.name}</span></span>
                  <span className="tool-v2-choice-desc">{p.difficulty}</span>
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {protocol !== '5:2' ? (
        <div className="tool-v2-field">
          <label htmlFor="fasting-lastmeal">متى كانت آخر وجبة أو وجبتك الأولى؟</label>
          <input id="fasting-lastmeal" type="time" value={lastMeal} onChange={(e) => setLastMeal(e.target.value)} />
        </div>
      ) : (
        <div className="tool-v2-note-strip">
          <span><strong>بروتوكول 5:2:</strong> أكل عادي خمسة أيام في الأسبوع، وتناول 500–600 سعرة فقط يومين غير متتاليين (مثل الاثنين والخميس). لا توجد نافذة أكل محددة بالساعات.</span>
        </div>
      )}

      {protocol === '5:2' ? (
        <div>
          <div className="tool-v2-mini-block-head"><span>بروتوكول 5:2 — جدول الأسبوع</span></div>
          <div className="tool-v2-breakdown-list">
            {['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'].map((day, i) => {
              const isFastDay = i === 1 || i === 4;
              return (
                <div key={day} className="tool-v2-breakdown-row">
                  <span className="tool-v2-breakdown-label">{day}</span>
                  <span className="tool-v2-breakdown-value">{isFastDay ? '🔥 تقليل' : '✅ عادي'}</span>
                </div>
              );
            })}
          </div>
          <p className="tool-v2-option-hint">خصص يومي تقليل السعرات وفقاً لجدولك. الاثنين والخميس الأكثر شيوعاً.</p>
        </div>
      ) : fastingWindow ? (
        <div aria-live="polite">
          <LiveStatus lastMealTime={lastMeal} protocolId={protocol} />

          <div className="tool-v2-breakdown-list">
            <div className="tool-v2-breakdown-row">
              <span className="tool-v2-breakdown-label"><Moon size={14} weight="bold" style={{ verticalAlign: '-2px' }} /> فترة الصيام</span>
              <span className="tool-v2-breakdown-value">{fastingWindow.fastStart} ← {fastingWindow.fastEnd} ({fastingWindow.proto.fastHours} ساعة)</span>
            </div>
            <div className="tool-v2-breakdown-row">
              <span className="tool-v2-breakdown-label"><Sun size={14} weight="bold" style={{ verticalAlign: '-2px' }} /> نافذة الأكل</span>
              <span className="tool-v2-breakdown-value">{fastingWindow.eatStart} ← {fastingWindow.eatEnd} ({fastingWindow.proto.eatHours} ساعة)</span>
            </div>
            {proto?.autophagyHour && (
              <div className="tool-v2-breakdown-row">
                <span className="tool-v2-breakdown-label"><Leaf size={14} weight="bold" style={{ verticalAlign: '-2px' }} /> الالتهام الذاتي يبدأ</span>
                <span className="tool-v2-breakdown-value">{formatMinutes(addMinutes(parseTime(lastMeal), proto.autophagyHour * 60))} (بعد {proto.autophagyHour} ساعة)</span>
              </div>
            )}
          </div>

          {proto?.fastHours && <AutophagyBar fastHours={proto.fastHours} />}

          <div className="tool-v2-action-row">
            <button type="button" className="tool-v2-action-btn is-primary" onClick={() => shareResult('جدول الصيام المتقطع', shareText)}>
              <ShareNetwork size={18} weight="bold" /> مشاركة
            </button>
          </div>
        </div>
      ) : (
        <div className="tool-v2-empty-state">
          <Moon size={28} weight="duotone" />
          <p>أدخل وقت آخر وجبة لعرض جدول الصيام.</p>
        </div>
      )}
    </div>
  );
}
