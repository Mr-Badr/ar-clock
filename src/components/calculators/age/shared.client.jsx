"use client";

import { CalendarDays, CheckCircle2, MoonStar, Sparkles } from 'lucide-react';

import { CalcButton as Button, CalcInput as Input, CalcProgress as Progress } from '@/components/calculators/controls.client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { formatAgeDate, formatAgeNumber, normalizeBirthInput } from '@/lib/calculators/age';

export function CalendarToggle({ value, onChange }) {
  return (
    <div className="calc-kbd-row age-calendar-toggle">
      <button
        type="button"
        className={`calc-chip-button ${value === 'gregorian' ? 'is-active' : ''}`}
        aria-pressed={value === 'gregorian'}
        onClick={() => onChange('gregorian')}
      >
        <CalendarDays size={15} />
        ميلادي
      </button>
      <button
        type="button"
        className={`calc-chip-button ${value === 'hijri' ? 'is-active' : ''}`}
        aria-pressed={value === 'hijri'}
        onClick={() => onChange('hijri')}
      >
        <MoonStar size={15} />
        هجري
      </button>
    </div>
  );
}

export function GregorianDateField({
  id = 'birth-date',
  label = 'تاريخ الميلاد',
  hint,
  value,
  onChange,
}) {
  return (
    <div className="calc-field age-date-field">
      <Label htmlFor={id} className="calc-label">{label}</Label>
      <Input id={id} type="date" value={value} onChange={(event) => onChange(event.target.value)} />
      {hint ? <p className="calc-hint">{hint}</p> : null}
    </div>
  );
}

const HIJRI_MONTHS = [
  'محرم', 'صفر', 'ربيع الأول', 'ربيع الآخر',
  'جمادى الأولى', 'جمادى الآخرة', 'رجب', 'شعبان',
  'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة',
];

export function HijriDateFields({
  label = 'التاريخ الهجري',
  value,
  onChange,
}) {
  return (
    <div className="calc-field">
      <div className="calc-field-row">
        <Label className="calc-label">{label}</Label>
        <span className="calc-hint">من 1343هـ إلى 1500هـ</span>
      </div>
      <div className="hijri-date-row">
        <div className="hijri-date-field">
          <label className="hijri-date-field__label">اليوم</label>
          <Input
            type="number"
            inputMode="numeric"
            min="1"
            max="30"
            value={value.day}
            onChange={(event) => onChange({ ...value, day: event.target.value })}
            placeholder="1"
            className="hijri-date-field__input"
          />
        </div>
        <div className="hijri-date-field hijri-date-field--month">
          <label className="hijri-date-field__label">الشهر</label>
          <select
            className="hijri-month-select"
            value={value.month}
            onChange={(event) => onChange({ ...value, month: event.target.value })}
            dir="rtl"
          >
            <option value="">-- اختر --</option>
            {HIJRI_MONTHS.map((name, i) => (
              <option key={i + 1} value={String(i + 1)}>
                {i + 1} — {name}
              </option>
            ))}
          </select>
        </div>
        <div className="hijri-date-field">
          <label className="hijri-date-field__label">السنة الهجرية</label>
          <Input
            type="number"
            inputMode="numeric"
            min="1343"
            max="1500"
            value={value.year}
            onChange={(event) => onChange({ ...value, year: event.target.value })}
            placeholder="1400"
            className="hijri-date-field__input"
          />
        </div>
      </div>
    </div>
  );
}

export function BirthInputBlock({
  calendar,
  onCalendarChange,
  gregorianValue,
  onGregorianChange,
  hijriValue,
  onHijriChange,
  label = 'أدخل تاريخ ميلادك بدقة',
}) {
  return (
    <div className="calc-field age-birth-input">
      <div className="calc-field-row">
        <Label className="calc-label">{label}</Label>
        <CalendarToggle value={calendar} onChange={onCalendarChange} />
      </div>
      {calendar === 'gregorian' ? (
        <GregorianDateField value={gregorianValue} onChange={onGregorianChange} />
      ) : (
        <HijriDateFields value={hijriValue} onChange={onHijriChange} label={label} />
      )}
    </div>
  );
}

export function resolveBirthInput(calendar, gregorianValue, hijriValue) {
  return normalizeBirthInput(
    calendar === 'gregorian'
      ? { calendar, iso: gregorianValue }
      : { calendar, ...hijriValue },
  );
}

export function ResultState({ result, emptyText = 'أدخل البيانات لتظهر النتيجة هنا.' }) {
  if (!result) {
    return <div className="calc-note">{emptyText}</div>;
  }

  if (!result.isValid) {
    return <div className="calc-warning">{result.error || 'تعذر إتمام الحساب الآن.'}</div>;
  }

  return null;
}

export function MetricGrid({ items = [] }) {
  const safeItems = Array.isArray(items) ? items : [];

  return (
    <div className="calc-grid-3">
      {safeItems.map((item) => (
        <div key={item.label} className="calc-metric-card">
          <div className="calc-metric-card__label">{item.label}</div>
          <div className="calc-metric-card__value">{item.value}</div>
          {item.note ? <div className="calc-metric-card__note">{item.note}</div> : null}
        </div>
      ))}
    </div>
  );
}

export function ProgressCard({ title, value, note }) {
  return (
    <Card className="calc-surface-card">
      <CardHeader>
        <CardTitle className="calc-card-title">{title}</CardTitle>
      </CardHeader>
      <CardContent className="calc-breakdown-list">
        <Progress value={value} />
        <div className="calc-mini-item">
          <strong>{formatAgeNumber(value, { maximumFractionDigits: 1 })}%</strong>
          <span>{note}</span>
        </div>
      </CardContent>
    </Card>
  );
}

export function MilestoneList({ items = [] }) {
  const safeItems = Array.isArray(items) ? items : [];

  return (
    <div className="calc-breakdown-list">
      {safeItems.map((item) => (
        <div key={item.key} className="calc-history-item">
          <div className="calc-history-item__copy">
            <strong>{item.label}</strong>
            <span>
              {item.dateLabel}
              {item.weekday ? ` · ${item.weekday}` : ''}
            </span>
          </div>
          <div className="calc-history-item__copy">
            <strong>{item.isReached ? 'تم تجاوزه' : `بعد ${formatAgeNumber(item.daysRemaining, { maximumFractionDigits: 0 })} يوم`}</strong>
            <span>{item.ageLabel}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export function AgeUnitsDisplay({ result }) {
  const src = result.years !== undefined ? result : result.gap;
  const label = result.ageLabel || result.gapLabel;
  if (src && src.years !== undefined && src.months !== undefined && src.days !== undefined) {
    return (
      <div className="age-units-display" aria-label={label}>
        <div className="age-unit">
          <span className="age-unit__num">{formatAgeNumber(src.years, { maximumFractionDigits: 0 })}</span>
          <span className="age-unit__label">سنة</span>
        </div>
        <span className="age-unit__sep" aria-hidden="true">و</span>
        <div className="age-unit">
          <span className="age-unit__num">{formatAgeNumber(src.months, { maximumFractionDigits: 0 })}</span>
          <span className="age-unit__label">شهر</span>
        </div>
        <span className="age-unit__sep" aria-hidden="true">و</span>
        <div className="age-unit">
          <span className="age-unit__num">{formatAgeNumber(src.days, { maximumFractionDigits: 0 })}</span>
          <span className="age-unit__label">يوم</span>
        </div>
      </div>
    );
  }
  return <div className="age-hero-summary__value">{label || '—'}</div>;
}

export function HeroSummaryCard({ title, result, footer }) {
  return (
    <Card className="calc-surface-card age-hero-summary">
      <CardHeader>
        <CardTitle className="calc-card-title">{title}</CardTitle>
      </CardHeader>
      <CardContent className="age-hero-summary__body" aria-live="polite">
        {result?.isValid ? (
          <>
            <AgeUnitsDisplay result={result} />
            <div className="age-hero-summary__meta">
              {footer}
            </div>
          </>
        ) : (
          <div className="calc-note">أدخل تاريخاً صحيحاً لتظهر المعاينة السريعة.</div>
        )}
      </CardContent>
    </Card>
  );
}

export function InlineFacts({ items = [] }) {
  const safeItems = Array.isArray(items) ? items : [];

  return (
    <div className="calc-kbd-row">
      {safeItems.map((item) => (
        <div key={item.label} className="calc-search-chip">
          <Sparkles size={14} />
          <strong>{item.label}</strong>
          <span>{item.value}</span>
        </div>
      ))}
    </div>
  );
}

export function BirthdayHeadline({ result }) {
  if (!result?.isValid) return null;

  return (
    <div className="age-birthday-headline">
      <span className="age-birthday-headline__day">{result.birthWeekday}</span>
      <span className="age-birthday-headline__date">{formatAgeDate(result.birthDateIso)}</span>
      <span className="age-birthday-headline__meta">
        {result.hijri?.birth?.formatted?.ar || '—'} · {result.personal.season} · {result.personal.generation.label}
      </span>
    </div>
  );
}

export function CheckListCard({ title, items = [] }) {
  const safeItems = Array.isArray(items) ? items : [];

  return (
    <Card className="calc-surface-card">
      <CardHeader>
        <CardTitle className="calc-card-title">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="calc-checklist">
          {safeItems.map((item) => (
            <li key={item}>
              <CheckCircle2 size={16} />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
