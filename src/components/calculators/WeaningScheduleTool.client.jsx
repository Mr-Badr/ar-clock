"use client";

import { useEffect, useMemo, useState } from 'react';
import { Baby, CheckCircle, Info, Printer, Warning } from '@phosphor-icons/react';
import { toast } from 'sonner';
import { computeWeaningSchedule, WEANING_STAGES } from '@/lib/calculators/weaning-schedule';

function fmt(n) {
  return new Intl.NumberFormat('ar-SA-u-nu-latn').format(n);
}

function todayIso() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

async function shareResult(title, text) {
  if (navigator.share) {
    try {
      await navigator.share({ title, text });
      return;
    } catch {
      // user cancelled — fall through to clipboard
    }
  }
  try {
    await navigator.clipboard.writeText(text);
    toast.success('تم نسخ النتيجة إلى الحافظة');
  } catch {
    toast.error('تعذر نسخ النتيجة');
  }
}

export default function WeaningScheduleTool() {
  const [birthDateIso, setBirthDateIso] = useState('');
  const [maxDate, setMaxDate] = useState('');

  useEffect(() => { setMaxDate(todayIso()); }, []);

  const result = useMemo(() => {
    if (!birthDateIso) return null;
    try {
      return computeWeaningSchedule({ birthDateIso });
    } catch {
      return null;
    }
  }, [birthDateIso]);

  const shareText = result
    ? `عمر رضيعي ${fmt(result.ageMonthsFloor)} شهراً — المرحلة الحالية: ${result.stage.label} — القوام المناسب: ${result.stage.texture}`
    : '';

  function handlePrint() {
    window.print();
  }

  return (
    <div aria-label="حاسبة جدول إدخال الطعام للرضيع">
      <div className="tool-v2-panel-head">
        <span className="tool-v2-country-badge"><Baby size={14} weight="bold" /> حسب عمر رضيعك بالضبط <span className="tool-v2-live-dot" aria-hidden="true" /></span>
      </div>

      <div className="tool-v2-field">
        <label htmlFor="weaning-birth-date">تاريخ ميلاد الرضيع</label>
        <input
          id="weaning-birth-date"
          type="date"
          value={birthDateIso}
          max={maxDate}
          onChange={(e) => setBirthDateIso(e.target.value)}
        />
      </div>

      {result ? (
        <div aria-live="polite">
          <div className="tool-v2-result-hero">
            <span className="tool-v2-result-label">المرحلة الغذائية الآن</span>
            <div className="tool-v2-result-value" style={{ fontSize: 'clamp(1.3rem, 4vw, 1.8rem)' }}>{result.stage.label}</div>
            <div className="tool-v2-result-meta">{fmt(result.ageMonthsFloor)} شهراً ({fmt(result.ageWeeks)} أسبوعاً)</div>
          </div>

          {!result.hasStartedSolids ? (
            <div className="tool-v2-note-strip">
              <Info size={15} weight="fill" />
              <span>باقي {fmt(result.daysUntilSixMonths)} يوماً على بداية إدخال الطعام الصلب (الشهر السادس) — الحليب وحده يكفي حتى ذلك الحين.</span>
            </div>
          ) : null}

          <div className="tool-v2-mini-block-head">
            <CheckCircle size={14} weight="bold" />
            <span>ماذا تقدّمين الآن؟</span>
          </div>
          <div className="tool-v2-breakdown-list">
            <div className="tool-v2-breakdown-row">
              <span className="tool-v2-breakdown-label">القوام المناسب</span>
              <span className="tool-v2-breakdown-value">{result.stage.texture}</span>
            </div>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', marginTop: 'var(--space-2)' }}>{result.stage.guidance}</p>

          {result.isAllergenWindow ? (
            <div className="tool-v2-note-strip">
              <Warning size={15} weight="fill" />
              <span>رضيعك الآن في نافذة إدخال مسببات الحساسية الموصى بها (4-9 أشهر) — أدخلي كل نوع (بيض، فول سوداني، مكسرات، سمسم، سمك، محار، صويا، قمح، حليب) بمفرده وبكمية صغيرة، وراقبي رد الفعل.</span>
            </div>
          ) : null}

          {result.isUnderOneYear ? (
            <div className="tool-v2-note-strip">
              <Warning size={15} weight="fill" />
              <span>ممنوع قبل السنة الأولى: العسل (خطر التسمم الوشيقي)، والملح، والسكر المضاف — لا تُضاف لطعام الرضيع إطلاقاً قبل عامه الأول.</span>
            </div>
          ) : null}

          <div className="tool-v2-mini-block-head" style={{ marginTop: 'var(--space-5)' }}>
            <Baby size={14} weight="bold" />
            <span>كل المراحل — أين رضيعك الآن؟</span>
          </div>
          <div className="tool-v2-timeline">
            {WEANING_STAGES.map((stage) => (
              <div
                key={stage.id}
                className={`tool-v2-timeline-item${stage.id === result.stage.id ? ' is-current' : ''}`}
              >
                <span className="tool-v2-timeline-dot" aria-hidden="true" />
                <div>
                  <div className="tool-v2-timeline-title">{stage.label}</div>
                  <div className="tool-v2-timeline-desc">{stage.texture}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="tool-v2-empty-state">
          <Baby size={28} weight="duotone" />
          <p>أدخلي تاريخ ميلاد رضيعك لعرض جدول التغذية المناسب لعمره الآن.</p>
        </div>
      )}

      <div className="tool-v2-action-row">
        <button type="button" className="tool-v2-action-btn" onClick={handlePrint} disabled={!result}>
          <Printer size={18} weight="bold" /> طباعة الجدول الكامل
        </button>
        <button
          type="button"
          className="tool-v2-action-btn is-primary"
          onClick={() => shareResult('جدول إدخال الطعام للرضيع', shareText)}
          disabled={!result}
        >
          مشاركة
        </button>
      </div>

      {/* Printable full-schedule reference — the genuine advantage over competitor articles: a
          personalized, fridge-ready feeding schedule instead of a wall of generic text. */}
      <div className="tool-v2-invoice-print" aria-hidden="true">
        <div className="tool-v2-invoice-head">
          <div>
            <p className="tool-v2-invoice-business">جدول إدخال الطعام للرضيع</p>
            <p className="tool-v2-invoice-sub">{result ? `عمر الرضيع اليوم: ${fmt(result.ageMonthsFloor)} شهراً — المرحلة الحالية: ${result.stage.label}` : ''}</p>
          </div>
        </div>
        <table className="tool-v2-invoice-table">
          <tbody>
            {WEANING_STAGES.map((stage) => (
              <tr key={stage.id} style={result && stage.id === result.stage.id ? { fontWeight: 700 } : undefined}>
                <td>{stage.label}{result && stage.id === result.stage.id ? ' ← الآن' : ''}</td>
                <td>{stage.texture}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="tool-v2-invoice-terms">
          العسل والملح والسكر المضاف ممنوعة قبل السنة الأولى. نافذة إدخال مسببات الحساسية (بيض،
          فول سوداني، مكسرات، سمسم، سمك، محار، صويا، قمح، حليب): 4-9 أشهر. المصدر: توصيات منظمة
          الصحة العالمية (WHO) واليونيسف وتوصيات AAP لإدخال المسببات (2025).
        </p>
      </div>
    </div>
  );
}
