"use client";

import { CalendarDays, CheckCircle2, MoonStar, Sparkles } from 'lucide-react';

import { CalcButton as Button, CalcInput as Input, CalcProgress as Progress } from '@/components/calculators/controls.client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { formatAgeDate, formatAgeNumber, normalizeBirthInput } from '@/lib/calculators/age';

export function CalendarToggle({ value, onChange }) {
  return (
    <div className="calc-kbd-row">
      <button
        type="button"
        className={`calc-chip-button ${value === 'gregorian' ? 'is-active' : ''}`}
        onClick={() => onChange('gregorian')}
      >
        <CalendarDays size={15} style={{ marginLeft: '5px' }} />
        ميلادي
      </button>
      <button
        type="button"
        className={`calc-chip-button ${value === 'hijri' ? 'is-active' : ''}`}
        onClick={() => onChange('hijri')}
      >
        <MoonStar size={15} style={{ marginLeft: '5px' }} />
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
    <div className="calc-field">
      <Label htmlFor={id} className="calc-label">{label}</Label>
      <Input id={id} type="date" value={value} onChange={(event) => onChange(event.target.value)} />
      {hint ? <p className="calc-hint">{hint}</p> : null}
    </div>
  );
}

export function HijriDateFields({
  label = 'التاريخ الهجري',
  value,
  onChange,
}) {
  return (
    <div className="calc-field">
      <div className="calc-field-row">
        <Label className="calc-label">{label}</Label>
        <span className="calc-hint">النطاق المدعوم تقريباً من 1343هـ إلى 1500هـ</span>
      </div>
      <div className="calc-grid-3">
        <Input
          type="number"
          min="1"
          max="30"
          value={value.day}
          onChange={(event) => onChange({ ...value, day: event.target.value })}
          placeholder="اليوم"
        />
        <Input
          type="number"
          min="1"
          max="12"
          value={value.month}
          onChange={(event) => onChange({ ...value, month: event.target.value })}
          placeholder="الشهر"
        />
        <Input
          type="number"
          min="1343"
          max="1500"
          value={value.year}
          onChange={(event) => onChange({ ...value, year: event.target.value })}
          placeholder="السنة"
        />
      </div>
      <p className="calc-hint">أدخل الشهر كرقم من 1 إلى 12. سنحوّله داخلياً إلى التاريخ الميلادي للمقارنة الدقيقة.</p>
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
  label = 'أحسن تاريخ ميلادك بدقة',
}) {
  return (
    <div className="calc-field">
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
  return (
    <div className="calc-grid-3">
      {items.map((item) => (
        <div key={item.label} className="calc-metric-card card-nested">
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
  return (
    <div className="calc-breakdown-list">
      {items.map((item) => (
        <div key={item.key} className="calc-history-item card-nested">
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

export function HeroSummaryCard({ title, result, footer }) {
  return (
    <Card className="calc-surface-card age-hero-summary">
      <CardHeader>
        <CardTitle className="calc-card-title">{title}</CardTitle>
      </CardHeader>
      <CardContent className="age-hero-summary__body">
        {result?.isValid ? (
          <>
            <div className="age-hero-summary__value">{result.ageLabel || result.gapLabel || '—'}</div>
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
  return (
    <div className="calc-kbd-row">
      {items.map((item) => (
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
  return (
    <Card className="calc-surface-card">
      <CardHeader>
        <CardTitle className="calc-card-title">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="calc-checklist">
          {items.map((item) => (
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
