'use client';

import { useMemo, useState } from 'react';
import {
  CalendarBlank,
  Clock,
  Coins,
  IdentificationCard,
  Warning,
} from '@phosphor-icons/react';

import { CalcInput as Input, CalcSelectTrigger as SelectTrigger } from '@/components/calculators/controls.client';
import ResultActions from '@/components/calculators/ResultActions.client';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { VISA_TYPES, calculateIqamaExpiry, getStatusMeta } from '@/lib/calculators/iqama';

const COUNTRIES = [
  { id: 'sa', label: 'السعودية', flag: '🇸🇦', source: 'منصة أبشر (absher.sa)' },
  { id: 'ae', label: 'الإمارات', flag: '🇦🇪', source: 'منصة ICP / GDRFA (icp.gov.ae)' },
];

function formatDateAr(date) {
  return date.toLocaleDateString('ar-SA-u-nu-latn', {
    year: 'numeric', month: 'long', day: 'numeric', calendar: 'gregory',
  });
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
  if (result.status === 'in_grace') {
    return { label: 'الأيام المتبقية في مهلة السماح', days: result.daysToGraceEnd };
  }
  if (result.status === 'overstayed') {
    return { label: 'عدد أيام تجاوز الإقامة', days: result.daysOverstayed };
  }
  return { label: 'الأيام المتبقية حتى الانتهاء', days: result.daysToExpiry };
}

export default function IqamaCalculator() {
  const [country, setCountry] = useState('sa');
  const [visaTypeId, setVisaTypeId] = useState('iqama_1yr');
  const [issueDate, setIssueDate] = useState('');

  const visaOptions = useMemo(
    () => Object.values(VISA_TYPES).filter((v) => v.country === country),
    [country],
  );
  const countryData = COUNTRIES.find((c) => c.id === country);

  const result = useMemo(() => {
    if (!issueDate) return null;
    return calculateIqamaExpiry({ issueDate, visaTypeId });
  }, [issueDate, visaTypeId]);

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
        result.estimatedFine > 0
          ? `الغرامة التقديرية: ${formatNum(result.estimatedFine)} ${result.visaType.fineCurrency}`
          : null,
      ].filter(Boolean).join('\n')
    : '';

  return (
    <div className="calc-app iqama-tool" aria-label="حاسبة انتهاء الإقامة والتأشيرة">
      <div className="calc-esb-layout">

        {/* ── FORM ─────────────────────────────────── */}
        <div className="calc-esb-form-col">
          <Card className="calc-surface-card calc-esb-form-card">
            <CardContent className="calc-esb-form-body">

              {/* Country */}
              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">1</span>
                  <Label>الدولة</Label>
                </div>
                <div className="iqama-country-row">
                  {COUNTRIES.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      className={`iqama-country-btn${country === c.id ? ' iqama-country-btn--active' : ''}`}
                      onClick={() => handleCountryChange(c.id)}
                      aria-pressed={country === c.id}
                    >
                      <span className="iqama-country-flag">{c.flag}</span>
                      <span>{c.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Visa Type */}
              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">2</span>
                  <Label htmlFor="iqama-visa-type">نوع الإقامة / التأشيرة</Label>
                </div>
                <Select value={visaTypeId} onValueChange={setVisaTypeId}>
                  <SelectTrigger id="iqama-visa-type" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {visaOptions.map((v) => (
                      <SelectItem key={v.id} value={v.id}>{v.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {VISA_TYPES[visaTypeId]?.hint && (
                  <p className="calc-hint">{VISA_TYPES[visaTypeId].hint}</p>
                )}
              </div>

              {/* Issue Date */}
              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">3</span>
                  <Label htmlFor="iqama-issue-date">تاريخ الإصدار (الميلادي)</Label>
                </div>
                <Input
                  id="iqama-issue-date"
                  type="date"
                  dir="ltr"
                  value={issueDate}
                  onChange={(e) => setIssueDate(e.target.value)}
                  max={new Date().toISOString().slice(0, 10)}
                />
                <p className="calc-hint">التاريخ المطبوع على بطاقة الإقامة أو ختم/تأشيرة الدخول.</p>
              </div>

            </CardContent>
          </Card>

          {/* Sidebar quick facts */}
          <div className="calc-esb-sidebar-facts">
            <div className="calc-esb-fact">
              <IdentificationCard size={15} weight="bold" />
              <span>{VISA_TYPES[visaTypeId]?.label}</span>
            </div>
            <div className="calc-esb-fact">
              <Clock size={15} weight="bold" />
              <span>المدة الكلية: <strong>{formatNum(VISA_TYPES[visaTypeId]?.durationDays || 0)} يوم</strong></span>
            </div>
            {VISA_TYPES[visaTypeId]?.graceDays > 0 && (
              <div className="calc-esb-fact">
                <Warning size={15} weight="bold" />
                <span>مهلة سماح <strong>{VISA_TYPES[visaTypeId].graceDays} يوم</strong></span>
              </div>
            )}
          </div>
        </div>

        {/* ── RESULT ───────────────────────────────── */}
        <div className="calc-esb-result-col">
          {result ? (
            <div className="calc-esb-result-panel iqama-result" aria-live="polite">

              {/* Country + live identity */}
              <div className="calc-esb-result-header">
                <span className={`calc-esb-country-badge iqama-badge--${country}`}>
                  {countryData.flag} {countryData.label}
                </span>
                <span className="calc-esb-live-dot" aria-hidden="true" />
              </div>

              {/* Status pill */}
              <span className={`badge badge-${statusMeta.tone} iqama-status-pill`}>
                {statusMeta.label}
              </span>

              {/* Hero countdown */}
              <div className="calc-esb-amount-hero">
                <span className="calc-esb-amount-label">{hero.label}</span>
                <div className={`calc-esb-amount-value iqama-amount iqama-amount--${statusMeta.tone}`}>
                  {formatNum(hero.days)}
                </div>
                <div className="calc-esb-amount-meta">
                  <span>{formatDurationBreakdown(hero.days)}</span>
                  <span className="calc-esb-sep">·</span>
                  <span>{result.visaType.label}</span>
                </div>
              </div>

              {/* Timeline: issue → expiry */}
              <div className="iqama-timeline">
                <div className="iqama-timeline-track">
                  <div
                    className="iqama-timeline-fill"
                    data-tone={statusMeta.tone}
                    style={{ width: `${elapsedPct}%` }}
                  />
                  <div
                    className="iqama-timeline-marker"
                    data-tone={statusMeta.tone}
                    style={{ insetInlineStart: `${elapsedPct}%` }}
                    aria-hidden="true"
                  />
                </div>
                <div className="iqama-timeline-labels">
                  <span>{formatDateAr(result.issueDate)}</span>
                  <span>{formatDateAr(result.expiryDate)}</span>
                </div>
              </div>

              {/* Details breakdown */}
              <div className="calc-esb-breakdown">
                <div className="calc-esb-brow">
                  <span>تاريخ الإصدار</span>
                  <strong>{formatDateAr(result.issueDate)}</strong>
                </div>
                <div className="calc-esb-brow">
                  <span>تاريخ الانتهاء</span>
                  <strong>{formatDateAr(result.expiryDate)}</strong>
                </div>
                {result.visaType.graceDays > 0 && (
                  <div className="calc-esb-brow">
                    <span>نهاية مهلة السماح</span>
                    <strong>{formatDateAr(result.graceEndDate)}</strong>
                  </div>
                )}
                <div className="calc-esb-brow">
                  <span>مدة الصلاحية الكلية</span>
                  <strong>{formatNum(result.visaType.durationDays)} يوم</strong>
                </div>
              </div>

              {/* Fine breakdown */}
              {result.estimatedFine > 0 && (
                <div className="iqama-fine-box">
                  <div className="iqama-fine-box__head">
                    <Coins size={16} weight="bold" />
                    <span>الغرامة التقديرية المتراكمة</span>
                  </div>
                  <div className="iqama-fine-amount">
                    {formatNum(result.estimatedFine)} {result.visaType.fineCurrency}
                  </div>
                  <div className="iqama-fine-rows">
                    {result.fineBreakdown.map((row) => (
                      <div key={row.label} className="iqama-fine-row">
                        <span>{row.label} × {row.rate} {result.visaType.fineCurrency}</span>
                        <strong>{formatNum(row.amount)} {result.visaType.fineCurrency}</strong>
                      </div>
                    ))}
                  </div>
                  {result.fineCapped && (
                    <p className="calc-hint iqama-fine-capped">
                      بلغت الغرامة الحد الأقصى المعلن ({formatNum(result.fineCapAmount)} {result.visaType.fineCurrency}).
                    </p>
                  )}
                </div>
              )}

              <ResultActions
                copyText={shareText}
                shareTitle="نتيجة حاسبة الإقامة"
                shareText={shareText}
              />

              {/* Official source warning */}
              <div className="calc-esb-reason-strip">
                <Warning size={14} weight="fill" />
                <span>
                  الأرقام أعلاه تقديرية للتخطيط فقط. للتأكد من وضعك الرسمي والتسوية، راجع{' '}
                  {countryData.source} أو تواصل مع صاحب العمل / الكفيل.
                </span>
              </div>

            </div>
          ) : (
            <div className="calc-esb-empty-state">
              <CalendarBlank size={28} weight="duotone" />
              <p>اختر الدولة ونوع الإقامة، ثم أدخل تاريخ الإصدار لمعرفة تاريخ الانتهاء والحالة الحالية.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
