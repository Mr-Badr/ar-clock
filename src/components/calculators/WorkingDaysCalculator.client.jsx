"use client";

import { useEffect, useMemo, useState } from 'react';
import { Briefcase, CalendarBlank, Info } from '@phosphor-icons/react';

import { CalcInput as Input } from '@/components/calculators/controls.client';
import ResultActions from '@/components/calculators/ResultActions.client';
import { Label } from '@/components/ui/label';
import { calculateWorkingDays, formatNumber, WORKING_DAYS_COUNTRIES } from '@/lib/calculators/engine';
import CountryFlag from '@/components/shared/CountryFlag';

function todayIso() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function addDaysIso(iso, days) {
  const d = new Date(`${iso}T00:00:00`);
  d.setDate(d.getDate() + days);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export default function WorkingDaysCalculator() {
  const [country, setCountry] = useState('sa');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    const start = todayIso();
    setStartDate(start);
    setEndDate(addDaysIso(start, 30));
  }, []);

  const result = useMemo(
    () => calculateWorkingDays({ startDate, endDate, country }),
    [startDate, endDate, country],
  );

  const shareText = result.isValid
    ? `حاسبة أيام العمل بين تاريخين\nإجمالي الأيام: ${formatNumber(result.totalDays)}\nأيام العمل الفعلية: ${formatNumber(result.workingDays)}\nأيام العطلة الأسبوعية: ${formatNumber(result.weekendDays)}`
    : '';

  return (
    <div className="calc-app working-days-tool" aria-label="حاسبة أيام العمل بين تاريخين">
      <div className="calc-esb-layout">

        {/* ── FORM ─────────────────────────────────── */}
        <div className="calc-esb-form-col">
          <div className="calc-surface-card calc-esb-form-card">
            <div className="calc-esb-form-body">

              {/* Country selector */}
              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">1</span>
                  <Label>دولة العمل</Label>
                </div>
                <div className="leave-country-grid">
                  {Object.entries(WORKING_DAYS_COUNTRIES).map(([code, c]) => (
                    <button
                      key={code}
                      type="button"
                      className={`leave-country-btn${country === code ? ' is-active' : ''}`}
                      onClick={() => setCountry(code)}
                    >
                      <span className="leave-flag"><CountryFlag code={code} /></span>
                      <span>{c.label}</span>
                    </button>
                  ))}
                </div>
                <p className="calc-hint">
                  <Info size={12} weight="bold" style={{ display: 'inline', verticalAlign: '-1px' }} />
                  {' '}عطلة نهاية الأسبوع: <strong>{WORKING_DAYS_COUNTRIES[country]?.weekendLabel}</strong>
                </p>
              </div>

              {/* Dates */}
              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">2</span>
                  <Label>الفترة الزمنية</Label>
                </div>
                <div className="calc-esb-date-row">
                  <div className="calc-esb-date-field">
                    <Label htmlFor="wd-start" className="calc-esb-date-label">من تاريخ</Label>
                    <Input id="wd-start" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                  </div>
                  <div className="calc-esb-date-field">
                    <Label htmlFor="wd-end" className="calc-esb-date-label">إلى تاريخ</Label>
                    <Input id="wd-end" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                  </div>
                </div>
                <p className="calc-hint">يشمل الحساب يومي البداية والنهاية معاً</p>
              </div>

            </div>
          </div>
        </div>

        {/* ── RESULT ───────────────────────────────── */}
        <div className="calc-esb-result-col">
          {result.isValid ? (
            <div className="calc-esb-result-panel working-days-result" aria-live="polite">
              <div className="calc-esb-result-header">
                <span className={`calc-esb-country-badge calc-esb-country-badge--${country}`}>
                  {result.countryFlag} {result.countryLabel} — {result.weekendLabel}
                </span>
                <span className="calc-esb-live-dot" aria-hidden="true" />
              </div>

              <div className="calc-esb-amount-hero">
                <span className="calc-esb-amount-label">أيام العمل الفعلية</span>
                <div className="calc-esb-amount-value">{formatNumber(result.workingDays)}</div>
                <div className="calc-esb-amount-meta">
                  <span>من أصل {formatNumber(result.totalDays)} يوماً</span>
                  <span className="calc-esb-sep">·</span>
                  <span>{formatNumber(result.weekendDays)} يوم عطلة أسبوعية</span>
                </div>
              </div>

              <div className="calc-esb-breakdown">
                <div className="calc-esb-brow">
                  <span className="calc-icon-label">
                    <CalendarBlank size={14} weight="bold" />
                    إجمالي الأيام (شامل البداية والنهاية)
                  </span>
                  <strong>{formatNumber(result.totalDays)} يوم</strong>
                </div>
                <div className="calc-esb-brow">
                  <span className="calc-icon-label">
                    <Briefcase size={14} weight="bold" />
                    أيام العمل الفعلية
                  </span>
                  <strong>{formatNumber(result.workingDays)} يوم</strong>
                </div>
                <div className="calc-esb-brow">
                  <span className="calc-icon-label">
                    <CalendarBlank size={14} weight="bold" />
                    أيام العطلة الأسبوعية
                  </span>
                  <strong>{formatNumber(result.weekendDays)} يوم</strong>
                </div>
                <div className="calc-esb-brow calc-esb-brow--total">
                  <span>عدد الأسابيع الكاملة</span>
                  <strong>{formatNumber(result.fullWeeks)} أسبوع{result.remainderDays > 0 ? ` + ${result.remainderDays} يوم` : ''}</strong>
                </div>
              </div>

              {result.reversed && (
                <p className="calc-hint" style={{ marginTop: '0.5rem' }}>
                  لاحظنا أن تاريخ البداية بعد تاريخ النهاية، فعكسنا الترتيب تلقائياً للحساب.
                </p>
              )}

              <p className="calc-hint" style={{ marginTop: '0.5rem' }}>
                هذه الحاسبة تحسب أيام العمل باستثناء عطلة نهاية الأسبوع الرسمية فقط. الإجازات الرسمية
                والمناسبات الوطنية غير مستثناة تلقائياً — راجع{' '}
                <a href="/holidays" style={{ textDecoration: 'underline' }}>صفحة المناسبات</a>{' '}
                للتحقق من أي إجازة رسمية تقع ضمن الفترة المحددة.
              </p>

              <ResultActions
                copyText={shareText}
                shareTitle="حاسبة أيام العمل بين تاريخين"
                shareText={shareText}
              />

            </div>
          ) : (
            <div className="calc-esb-empty-state">
              <CalendarBlank size={28} weight="duotone" />
              <p>اختر تاريخ البداية والنهاية لحساب أيام العمل الفعلية.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
