'use client';

import { useState, useMemo } from 'react';
import { VISA_TYPES, calculateIqamaExpiry, getStatusMeta } from '@/lib/calculators/iqama';
import ResultActions from '@/components/calculators/ResultActions.client';

const COUNTRIES = [
  { id: 'sa', label: 'السعودية 🇸🇦' },
  { id: 'ae', label: 'الإمارات 🇦🇪' },
];

function formatDateAr(date) {
  return date.toLocaleDateString('ar-SA-u-nu-latn', {
    year: 'numeric', month: 'long', day: 'numeric', calendar: 'gregory',
  });
}

function CountdownBlock({ days, label, color }) {
  const absD = Math.abs(days);
  const y = Math.floor(absD / 365);
  const m = Math.floor((absD % 365) / 30);
  const d = absD % 30;
  return (
    <div className="text-center">
      <div className="text-4xl font-bold tabular-nums" style={{ color }}>{absD.toLocaleString('ar-SA-u-nu-latn')}</div>
      <div className="text-sm text-muted-foreground mt-1">{label}</div>
      {absD > 60 && (
        <div className="text-xs text-muted-foreground mt-0.5">
          {y > 0 && `${y} سنة `}{m > 0 && `${m} شهر `}{d > 0 && `${d} يوم`}
        </div>
      )}
    </div>
  );
}

export default function IqamaCalculator() {
  const [country, setCountry] = useState('sa');
  const [visaTypeId, setVisaTypeId] = useState('iqama_1yr');
  const [issueDate, setIssueDate] = useState('');

  const visaOptions = useMemo(
    () => Object.values(VISA_TYPES).filter(v => v.country === country),
    [country],
  );

  const result = useMemo(() => {
    if (!issueDate) return null;
    return calculateIqamaExpiry({ issueDate, visaTypeId });
  }, [issueDate, visaTypeId]);

  const statusMeta = result ? getStatusMeta(result.status) : null;

  function handleCountryChange(c) {
    setCountry(c);
    const firstOfCountry = Object.values(VISA_TYPES).find(v => v.country === c);
    if (firstOfCountry) setVisaTypeId(firstOfCountry.id);
  }

  return (
    <div className="iqama-calc space-y-5">
      {/* Country */}
      <div>
        <label className="block text-sm font-medium mb-2">الدولة</label>
        <div className="flex gap-2 flex-wrap">
          {COUNTRIES.map(c => (
            <button
              key={c.id}
              onClick={() => handleCountryChange(c.id)}
              className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${country === c.id ? 'bg-primary text-primary-foreground border-primary' : 'bg-card hover:bg-muted border-border'}`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Visa Type */}
      <div>
        <label className="block text-sm font-medium mb-2">نوع الإقامة / التأشيرة</label>
        <select
          value={visaTypeId}
          onChange={e => setVisaTypeId(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          dir="rtl"
        >
          {visaOptions.map(v => (
            <option key={v.id} value={v.id}>{v.label}</option>
          ))}
        </select>
      </div>

      {/* Issue Date */}
      <div>
        <label className="block text-sm font-medium mb-2">تاريخ الإصدار (الميلادي)</label>
        <input
          type="date"
          value={issueDate}
          onChange={e => setIssueDate(e.target.value)}
          max={new Date().toISOString().slice(0, 10)}
          className="w-full border rounded-lg px-3 py-2 bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          dir="ltr"
        />
      </div>

      {/* Hint */}
      {visaTypeId && (
        <p className="text-xs text-muted-foreground bg-muted/40 rounded px-3 py-2">
          {VISA_TYPES[visaTypeId]?.hint}
        </p>
      )}

      {/* Result */}
      {result && (
        <div className="rounded-xl border overflow-hidden mt-2">
          {/* Status Banner */}
          <div className="px-5 py-4 flex items-center gap-3" style={{ background: statusMeta.bg }}>
            <span className="text-2xl" role="img" aria-hidden>{statusMeta.icon}</span>
            <div>
              <div className="font-bold text-lg" style={{ color: statusMeta.color }}>{statusMeta.label}</div>
              <div className="text-sm text-muted-foreground">
                {result.visaType.label}
              </div>
            </div>
          </div>

          {/* Countdown */}
          <div className="px-5 py-5 border-t bg-card">
            {result.status === 'valid' || result.status === 'expiring_soon' ? (
              <CountdownBlock
                days={result.daysToExpiry}
                label="يوم متبقٍ حتى انتهاء الإقامة"
                color={statusMeta.color}
              />
            ) : result.status === 'in_grace' ? (
              <div className="space-y-3">
                <CountdownBlock
                  days={result.daysToGraceEnd}
                  label="يوم متبقٍ في مهلة السماح"
                  color={statusMeta.color}
                />
              </div>
            ) : (
              <div className="space-y-3">
                <CountdownBlock
                  days={result.daysOverstayed}
                  label="يوم تجاوز"
                  color={statusMeta.color}
                />
                {result.estimatedFine > 0 && (
                  <div className="text-center border-t pt-3">
                    <div className="text-sm text-muted-foreground mb-1">الغرامة المتراكمة التقديرية</div>
                    <div className="text-2xl font-bold text-red-600">
                      {result.estimatedFine.toLocaleString('ar-SA-u-nu-latn')} {result.visaType.fineCurrency}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {result.visaType.finePerDay} {result.visaType.fineCurrency} × {result.daysOverstayed} يوم
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-px bg-border border-t">
            {[
              { label: 'تاريخ الإصدار', value: formatDateAr(result.issueDate) },
              { label: 'تاريخ الانتهاء', value: formatDateAr(result.expiryDate) },
              result.visaType.graceDays > 0 && {
                label: 'نهاية مهلة السماح',
                value: formatDateAr(result.graceEndDate),
              },
              { label: 'مدة الإقامة', value: `${result.visaType.durationDays} يوم` },
            ].filter(Boolean).map((item, i) => (
              <div key={i} className="bg-card px-4 py-3">
                <div className="text-xs text-muted-foreground">{item.label}</div>
                <div className="text-sm font-medium mt-0.5">{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Fine Warning */}
      {result?.status === 'overstayed' && (
        <div className="text-xs bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg px-4 py-3 text-red-800 dark:text-red-300">
          <strong>تنبيه:</strong> الأرقام أعلاه تقديرية. للاطلاع على الوضع الرسمي والتسوية، يُرجى زيارة{' '}
          {result.visaType.country === 'sa'
            ? 'منصة أبشر (absher.com.sa)'
            : 'منصة GDRFA الإمارات (gdrfad.gov.ae)'}
          {' '}أو التواصل مع صاحب العمل.
        </div>
      )}
      {result && (
        <ResultActions
          copyText={`حاسبة الإقامة — ${result.visaType.label}: تنتهي ${formatDateAr(result.expiryDate)}${result.estimatedFine > 0 ? ` | الغرامة التقديرية: ${result.estimatedFine.toLocaleString('ar-SA-u-nu-latn')} ${result.visaType.fineCurrency}` : ''}`}
          shareTitle="نتيجة حاسبة الإقامة"
          shareText={`${result.visaType.label}: تنتهي ${formatDateAr(result.expiryDate)}${result.estimatedFine > 0 ? ` — الغرامة: ${result.estimatedFine.toLocaleString('ar-SA-u-nu-latn')} ${result.visaType.fineCurrency}` : ''}`}
        />
      )}
    </div>
  );
}
