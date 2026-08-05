"use client";

import { useEffect, useMemo, useState } from 'react';
import { CheckCircle, Flag, Info, ShareNetwork } from '@phosphor-icons/react';
import { toast } from 'sonner';
import { AnimatedCircularProgressBar } from '@/components/ui/animated-circular-progress-bar';
import { NumberTicker } from '@/components/ui/number-ticker';
import BirthInputTool, { resolveBirthInput } from '@/components/calculators/age/BirthInputTool.client';
import { buildAgeMilestones, getTodayIso } from '@/lib/calculators/age';

async function shareResult(title, text) {
  if (navigator.share) {
    try { await navigator.share({ title, text }); return; } catch { /* cancelled */ }
  }
  try { await navigator.clipboard.writeText(text); toast.success('تم نسخ النتيجة إلى الحافظة'); }
  catch { toast.error('تعذر نسخ النتيجة'); }
}

export default function AgeMilestonesTool() {
  const [calendar, setCalendar] = useState('gregorian');
  const [birthIso, setBirthIso] = useState('1995-03-12');
  const [birthHijri, setBirthHijri] = useState({ day: '12', month: '9', year: '1415' });
  const [todayIso, setTodayIso] = useState(null);

  useEffect(() => { setTodayIso(getTodayIso()); }, []);

  const normalized = useMemo(() => resolveBirthInput(calendar, birthIso, birthHijri), [birthIso, birthHijri, calendar]);
  const items = useMemo(() => {
    if (!normalized.isValid || !todayIso) return null;
    return buildAgeMilestones(normalized.iso, todayIso);
  }, [normalized, todayIso]);

  const nextMilestone = items?.find((item) => !item.isReached) || null;
  const reachedCount = items?.filter((item) => item.isReached).length ?? 0;

  const shareText = nextMilestone
    ? `باقي ${nextMilestone.daysRemaining} يوم على محطة ${nextMilestone.label} في عمري`
    : '';

  return (
    <div aria-label="حاسبة محطات العمر">
      <div className="tool-v2-panel-head">
        <span className="tool-v2-country-badge"><Flag size={14} weight="bold" /> إنجازات العمر <span className="tool-v2-live-dot" aria-hidden="true" /></span>
      </div>

      <BirthInputTool
        calendar={calendar} onCalendarChange={setCalendar}
        gregorianValue={birthIso} onGregorianChange={setBirthIso}
        hijriValue={birthHijri} onHijriChange={setBirthHijri}
      />

      {items ? (
        <div aria-live="polite">
          {nextMilestone ? (
            <>
              <div className="tool-v2-result-hero" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-3)' }}>
                <AnimatedCircularProgressBar
                  className="tool-v2-progress-ring"
                  value={nextMilestone.progressPercent}
                  gaugePrimaryColor="var(--green)"
                  gaugeSecondaryColor="var(--green-subtle)"
                />
                <div style={{ textAlign: 'center' }}>
                  <span className="tool-v2-result-label">المحطة القادمة</span>
                  <div className="tool-v2-result-value">{nextMilestone.label}</div>
                  <div className="tool-v2-result-meta">
                    باقي <NumberTicker value={nextMilestone.daysRemaining} className="tool-v2-ticker tool-v2-ticker--accent" style={{ fontSize: '1em' }} /> يوم — {nextMilestone.dateLabel}
                  </div>
                </div>
              </div>

              <div className="tool-v2-note-strip">
                <CheckCircle size={15} weight="fill" />
                <span>تجاوزت بالفعل {reachedCount} من {items.length} محطة في هذه القائمة.</span>
              </div>
            </>
          ) : (
            <div className="tool-v2-note-strip">
              <Info size={15} weight="fill" />
              <span>تجاوزت كل المحطات المتاحة في هذه القائمة — رقم استثنائي!</span>
            </div>
          )}

          <div className="tool-v2-mini-block-head" style={{ marginTop: 'var(--space-4)' }}>
            <Flag size={14} weight="bold" />
            <span>كل المحطات — الماضية والقادمة</span>
          </div>
          <div className="tool-v2-timeline">
            {items.map((item) => (
              <div key={item.key} className={`tool-v2-timeline-item${item === nextMilestone ? ' is-current' : ''}`}>
                <span className="tool-v2-timeline-dot" aria-hidden="true" />
                <div>
                  <div className="tool-v2-timeline-title">{item.label}{item.isReached ? ' — تم تجاوزها' : ''}</div>
                  <div className="tool-v2-timeline-desc">{item.dateLabel} · {item.weekday} · عمرك حينها: {item.ageLabel}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="tool-v2-action-row">
            <button type="button" className="tool-v2-action-btn is-primary" onClick={() => shareResult('محطات العمر', shareText)} disabled={!nextMilestone}>
              <ShareNetwork size={18} weight="bold" /> مشاركة
            </button>
          </div>
        </div>
      ) : (
        <div className="tool-v2-empty-state">
          <Flag size={28} weight="duotone" />
          <p>أدخل تاريخ ميلادك لمعرفة محطات عمرك الكبرى.</p>
        </div>
      )}
    </div>
  );
}
