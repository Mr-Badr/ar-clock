"use client";

import { useEffect, useMemo, useState } from 'react';
import { CalendarBlank, Clock, Coins, IdentificationCard, ShareNetwork, Warning } from '@phosphor-icons/react';
import { toast } from 'sonner';
import { AnimatedCircularProgressBar } from '@/components/ui/animated-circular-progress-bar';
import CountryFlag from '@/components/shared/CountryFlag';
import { VISA_TYPES, calculateIqamaExpiry, getStatusMeta } from '@/lib/calculators/iqama';
import { getTodayIso } from '@/lib/calculators/age';

const COUNTRIES = [
  { id: 'sa', label: 'السعودية', source: 'منصة أبشر (absher.sa)' },
  { id: 'ae', label: 'الإمارات', source: 'منصة ICP / GDRFA (icp.gov.ae)' },
];

const TONE_COLOR = { success: 'var(--green)', warning: 'var(--amber)', danger: 'var(--red)' };
const TONE_TEXT = { success: 'var(--green-text)', warning: 'var(--amber)', danger: 'var(--red-text)' };

function formatDateAr(date) {
  return date.toLocaleDateString('ar-SA-u-nu-latn', { year: 'numeric', month: 'long', day: 'numeric', calendar: 'gregory' });
}
function formatNum(n) {
  return Math.round(n).toLocaleString('ar-SA-u-nu-latn');
}
function formatDurationBreakdown(totalDays) {
  const days = Math.max(0, Math.round(totalDays));
  const y = Math.floor(days / 365);
  const m = Math.floor((days % 365) / 30);
  const d = days % 30;
  const parts = [];
  if (y > 0) parts.push(`${formatNum(y)} سنة`);
  if (m > 0) parts.push(`${formatNum(m)} شهر`);
  if (d > 0 || parts.length === 0) parts.push(`${formatNum(d)} يوم`);
  return parts.join(' و');
}
function getHeroData(result) {
  if (result.status === 'in_grace') return { label: 'الأيام المتبقية في مهلة السماح', days: result.daysToGraceEnd };
  if (result.status === 'overstayed') return { label: 'عدد أيام تجاوز الإقامة', days: result.daysOverstayed };
  return { label: 'الأيام المتبقية حتى الانتهاء', days: result.daysToExpiry };
}

async function shareResult(title, text) {
  if (navigator.share) {
    try { await navigator.share({ title, text }); return; } catch { /* cancelled */ }
  }
  try { await navigator.clipboard.writeText(text); toast.success('تم نسخ النتيجة إلى الحافظة'); }
  catch { toast.error('تعذر نسخ النتيجة'); }
}

export default function IqamaTool() {
  const [country, setCountry] = useState('sa');
  const [visaTypeId, setVisaTypeId] = useState('iqama_1yr');
  const [issueDate, setIssueDate] = useState('');
  const [todayIso, setTodayIso] = useState(null);

  useEffect(() => { setTodayIso(getTodayIso()); }, []);

  const visaOptions = useMemo(() => Object.values(VISA_TYPES).filter((v) => v.country === country), [country]);
  const countryData = COUNTRIES.find((c) => c.id === country);

  const result = useMemo(() => {
    if (!issueDate || !todayIso) return null;
    return calculateIqamaExpiry({ issueDate, visaTypeId, today: new Date(`${todayIso}T00:00:00`) });
  }, [issueDate, visaTypeId, todayIso]);

  const statusMeta = result ? getStatusMeta(result.status) : null;
  const hero = result ? getHeroData(result) : null;

  const elapsedPct = useMemo(() => {
    if (!result) return 0;
    const totalDays = result.visaType.durationDays;
    const elapsed = totalDays - result.daysToExpiry;
    return Math.min(100, Math.max(0, (elapsed / totalDays) * 100));
  }, [result]);

  function handleCountryChange(c) {
    setCountry(c);
    const firstOfCountry = Object.values(VISA_TYPES).find((v) => v.country === c);
    if (firstOfCountry) setVisaTypeId(firstOfCountry.id);
  }

  const shareText = result
    ? [
        `حاسبة الإقامة — ${result.visaType.label}`,
        `الحالة: ${statusMeta.label}`,
        `تاريخ الانتهاء: ${formatDateAr(result.expiryDate)}`,
        result.estimatedFine > 0 ? `الغرامة التقديرية: ${formatNum(result.estimatedFine)} ${result.visaType.fineCurrency}` : null,
      ].filter(Boolean).join('\n')
    : '';

  return (
    <div aria-label="حاسبة انتهاء الإقامة والتأشيرة">
      <div className="tool-v2-panel-head">
        <span className="tool-v2-country-badge"><CountryFlag code={country} /> {countryData.label} <span className="tool-v2-live-dot" aria-hidden="true" /></span>
      </div>

      <div className="tool-v2-field">
        <label>الدولة</label>
        <div className="guide-v2-checker-options" role="group" aria-label="اختر الدولة">
          {COUNTRIES.map((c) => (
            <button key={c.id} type="button" className={`guide-v2-checker-chip${country === c.id ? ' is-active' : ''}`} aria-pressed={country === c.id} onClick={() => handleCountryChange(c.id)}>
              <CountryFlag code={c.id} /> {c.label}
            </button>
          ))}
        </div>
      </div>

      <div className="tool-v2-field">
        <label htmlFor="iqama-visa-type">نوع الإقامة / التأشيرة</label>
        <select id="iqama-visa-type" value={visaTypeId} onChange={(e) => setVisaTypeId(e.target.value)}>
          {visaOptions.map((v) => (<option key={v.id} value={v.id}>{v.label}</option>))}
        </select>
        {VISA_TYPES[visaTypeId]?.hint ? <p className="tool-v2-field-hint">{VISA_TYPES[visaTypeId].hint}</p> : null}
      </div>

      <div className="tool-v2-field">
        <label htmlFor="iqama-issue-date">تاريخ الإصدار (الميلادي)</label>
        <input id="iqama-issue-date" type="date" dir="ltr" value={issueDate} onChange={(e) => setIssueDate(e.target.value)} max={todayIso || undefined} />
        <p className="tool-v2-field-hint">التاريخ المطبوع على بطاقة الإقامة أو ختم/تأشيرة الدخول.</p>
      </div>

      {result ? (
        <div aria-live="polite">
          <span className={`badge badge-${statusMeta.tone}`} style={{ marginBottom: 'var(--space-2)', display: 'inline-block' }}>{statusMeta.label}</span>

          <div className="tool-v2-result-hero" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-3)' }}>
            <AnimatedCircularProgressBar
              className="tool-v2-progress-ring"
              value={elapsedPct}
              gaugePrimaryColor={TONE_COLOR[statusMeta.tone]}
              gaugeSecondaryColor="var(--bg-surface-2)"
            />
            <div style={{ textAlign: 'center' }}>
              <span className="tool-v2-result-label">{hero.label}</span>
              <div className="tool-v2-result-value" style={{ color: TONE_TEXT[statusMeta.tone] }}>{formatNum(hero.days)}</div>
              <div className="tool-v2-result-meta">{formatDurationBreakdown(hero.days)} — {result.visaType.label}</div>
            </div>
          </div>

          <div className="tool-v2-breakdown-list">
            <div className="tool-v2-breakdown-row"><span className="tool-v2-breakdown-label"><CalendarBlank size={14} weight="bold" style={{ verticalAlign: '-2px' }} /> تاريخ الإصدار</span><span className="tool-v2-breakdown-value">{formatDateAr(result.issueDate)}</span></div>
            <div className="tool-v2-breakdown-row"><span className="tool-v2-breakdown-label"><CalendarBlank size={14} weight="bold" style={{ verticalAlign: '-2px' }} /> تاريخ الانتهاء</span><span className="tool-v2-breakdown-value">{formatDateAr(result.expiryDate)}</span></div>
            {result.visaType.graceDays > 0 ? (
              <div className="tool-v2-breakdown-row"><span className="tool-v2-breakdown-label"><Clock size={14} weight="bold" style={{ verticalAlign: '-2px' }} /> نهاية مهلة السماح</span><span className="tool-v2-breakdown-value">{formatDateAr(result.graceEndDate)}</span></div>
            ) : null}
            <div className="tool-v2-breakdown-row"><span className="tool-v2-breakdown-label"><IdentificationCard size={14} weight="bold" style={{ verticalAlign: '-2px' }} /> مدة الصلاحية الكلية</span><span className="tool-v2-breakdown-value">{formatNum(result.visaType.durationDays)} يوم</span></div>
          </div>

          {result.estimatedFine > 0 ? (
            <div className="tool-v2-note-strip">
              <Coins size={15} weight="fill" />
              <span>
                الغرامة التقديرية المتراكمة: <strong>{formatNum(result.estimatedFine)} {result.visaType.fineCurrency}</strong>
                {' — '}
                {result.fineBreakdown.map((row) => `${row.label} × ${row.rate} ${result.visaType.fineCurrency}`).join('، ')}
                {result.fineCapped ? ` (بلغت الحد الأقصى المعلن: ${formatNum(result.fineCapAmount)} ${result.visaType.fineCurrency})` : ''}
              </span>
            </div>
          ) : null}

          <div className="tool-v2-note-strip">
            <Warning size={15} weight="fill" />
            <span>الأرقام أعلاه تقديرية للتخطيط فقط. للتأكد من وضعك الرسمي والتسوية، راجع {countryData.source} أو تواصل مع صاحب العمل / الكفيل.</span>
          </div>

          <div className="tool-v2-action-row">
            <button type="button" className="tool-v2-action-btn is-primary" onClick={() => shareResult('نتيجة حاسبة الإقامة', shareText)}>
              <ShareNetwork size={18} weight="bold" /> مشاركة
            </button>
          </div>
        </div>
      ) : (
        <div className="tool-v2-empty-state">
          <CalendarBlank size={28} weight="duotone" />
          <p>اختر الدولة ونوع الإقامة، ثم أدخل تاريخ الإصدار لمعرفة تاريخ الانتهاء والحالة الحالية.</p>
        </div>
      )}
    </div>
  );
}
