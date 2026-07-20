"use client";

import { useMemo, useState } from 'react';
import { ArrowsCounterClockwise, CalendarBlank, Info, Moon } from '@phosphor-icons/react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { computeDateShift } from '@/lib/calculators/date-add-subtract';
import { ISLAMIC_MONTH_NAMES_AR, GREGORIAN_MONTH_NAMES_AR } from '@/lib/date-adapter';

const UNIT_OPTIONS = [
  { value: 'day', label: 'يوم' },
  { value: 'week', label: 'أسبوع' },
  { value: 'month', label: 'شهر' },
  { value: 'year', label: 'سنة' },
];

const DEFAULT_HIJRI = { year: 1447, month: 6, day: 15 };
const DEFAULT_GREGORIAN = { year: 2026, month: 7, day: 20 };

function pad2(n) {
  return String(n).padStart(2, '0');
}

export default function DateAddSubtractCalculator() {
  const [calendarType, setCalendarType] = useState('gregorian');
  const [gregorianIso, setGregorianIso] = useState(
    `${DEFAULT_GREGORIAN.year}-${pad2(DEFAULT_GREGORIAN.month)}-${pad2(DEFAULT_GREGORIAN.day)}`,
  );
  const [hijriYear, setHijriYear] = useState(String(DEFAULT_HIJRI.year));
  const [hijriMonth, setHijriMonth] = useState(String(DEFAULT_HIJRI.month));
  const [hijriDay, setHijriDay] = useState(String(DEFAULT_HIJRI.day));
  const [operation, setOperation] = useState('add');
  const [unit, setUnit] = useState('day');
  const [amount, setAmount] = useState('40');

  const sourceParts = useMemo(() => {
    if (calendarType === 'gregorian') {
      const [y, m, d] = String(gregorianIso || '').split('-').map(Number);
      if (!y || !m || !d) return null;
      return { year: y, month: m, day: d };
    }
    const y = Number(hijriYear);
    const m = Number(hijriMonth);
    const d = Number(hijriDay);
    if (!y || !m || !d) return null;
    return { year: y, month: m, day: d };
  }, [calendarType, gregorianIso, hijriYear, hijriMonth, hijriDay]);

  const result = useMemo(() => {
    if (!sourceParts) return null;
    try {
      return computeDateShift({
        calendarType,
        year: sourceParts.year,
        month: sourceParts.month,
        day: sourceParts.day,
        operation,
        unit,
        amount,
      });
    } catch {
      return null;
    }
  }, [calendarType, sourceParts, operation, unit, amount]);

  const isOutOfRange = sourceParts && !result;

  return (
    <div className="calc-app date-shift-tool" aria-label="حاسبة إضافة وطرح الأيام من تاريخ هجري أو ميلادي">
      <div className="calc-app-grid age-app-grid">
        <Card className="calc-surface-card calc-app-panel">
          <CardHeader>
            <CardTitle className="calc-card-title">أدخل التاريخ والعملية</CardTitle>
          </CardHeader>
          <CardContent className="calc-form-grid">
            <div className="calc-esb-field">
              <Label>التقويم</Label>
              <RadioGroup
                value={calendarType}
                onValueChange={setCalendarType}
                className="calc-esb-radio-row date-shift-calendar-toggle"
              >
                <label className="calc-esb-radio-card">
                  <RadioGroupItem value="gregorian" />
                  <span className="calc-esb-radio-copy">
                    <strong>ميلادي</strong>
                  </span>
                </label>
                <label className="calc-esb-radio-card">
                  <RadioGroupItem value="hijri" />
                  <span className="calc-esb-radio-copy">
                    <strong>هجري</strong>
                  </span>
                </label>
              </RadioGroup>
            </div>

            {calendarType === 'gregorian' ? (
              <div className="calc-esb-field">
                <Label htmlFor="date-shift-gregorian">التاريخ الميلادي</Label>
                <Input
                  id="date-shift-gregorian"
                  type="date"
                  value={gregorianIso}
                  min="1924-01-01"
                  max="2077-12-31"
                  onChange={(event) => setGregorianIso(event.target.value)}
                  aria-label="التاريخ الميلادي"
                />
              </div>
            ) : (
              <div className="date-shift-hijri-fields">
                <div className="calc-esb-field">
                  <Label htmlFor="date-shift-hijri-day">اليوم</Label>
                  <Input
                    id="date-shift-hijri-day"
                    type="number"
                    inputMode="numeric"
                    min="1"
                    max="30"
                    value={hijriDay}
                    onChange={(event) => setHijriDay(event.target.value)}
                    aria-label="اليوم الهجري"
                  />
                </div>
                <div className="calc-esb-field">
                  <Label htmlFor="date-shift-hijri-month">الشهر</Label>
                  <Select value={hijriMonth} onValueChange={setHijriMonth}>
                    <SelectTrigger id="date-shift-hijri-month" aria-label="الشهر الهجري">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ISLAMIC_MONTH_NAMES_AR.map((name, idx) => (
                        <SelectItem key={name} value={String(idx + 1)}>
                          {name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="calc-esb-field">
                  <Label htmlFor="date-shift-hijri-year">السنة الهجرية</Label>
                  <Input
                    id="date-shift-hijri-year"
                    type="number"
                    inputMode="numeric"
                    min="1343"
                    max="1500"
                    value={hijriYear}
                    onChange={(event) => setHijriYear(event.target.value)}
                    aria-label="السنة الهجرية"
                  />
                </div>
              </div>
            )}

            {isOutOfRange ? (
              <p className="calc-hint">
                هذا التاريخ خارج النطاق المدعوم حالياً (١٩٢٤–٢٠٧٧م / ١٣٤٣–١٥٠٠هـ) — جرّب تاريخاً ضمن هذا المدى.
              </p>
            ) : null}

            <div className="calc-esb-field">
              <Label>العملية</Label>
              <RadioGroup value={operation} onValueChange={setOperation} className="calc-esb-radio-row">
                <label className="calc-esb-radio-card">
                  <RadioGroupItem value="add" />
                  <span className="calc-esb-radio-copy">
                    <strong>أضف</strong>
                  </span>
                </label>
                <label className="calc-esb-radio-card">
                  <RadioGroupItem value="subtract" />
                  <span className="calc-esb-radio-copy">
                    <strong>اطرح</strong>
                  </span>
                </label>
              </RadioGroup>
            </div>

            <div className="date-shift-amount-row">
              <div className="calc-esb-field">
                <Label htmlFor="date-shift-amount">العدد</Label>
                <Input
                  id="date-shift-amount"
                  type="number"
                  inputMode="numeric"
                  min="0"
                  max="9999"
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                  aria-label="العدد"
                />
              </div>
              <div className="calc-esb-field">
                <Label htmlFor="date-shift-unit">الوحدة</Label>
                <Select value={unit} onValueChange={setUnit}>
                  <SelectTrigger id="date-shift-unit" aria-label="الوحدة">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {UNIT_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="calc-results-panel" aria-live="polite">
          {result ? (
            <>
              <Card className="calc-surface-card date-shift-result-card">
                <CardHeader>
                  <div className="calc-esb-result-header">
                    <span className="calc-esb-country-badge calc-esb-country-badge--bh">
                      <CalendarBlank size={12} weight="bold" style={{ display: 'inline', verticalAlign: '-1px' }} />
                      {' '}التاريخ الناتج
                    </span>
                    <span className="calc-esb-live-dot" aria-hidden="true" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="calc-metric-card">
                    <div className="calc-metric-card__label">
                      <Moon size={14} weight="bold" style={{ display: 'inline', verticalAlign: '-2px' }} />
                      {' '}
                      {result.resultHijri.day} {result.resultHijriMonthNameAr} {result.resultHijri.year} هـ
                    </div>
                    <div className="calc-metric-card__value">
                      {result.weekdayAr}، {result.resultGregorian.day} {result.resultGregorianMonthNameAr} {result.resultGregorian.year}
                    </div>
                    <div className="calc-metric-card__note">
                      <Info size={12} weight="bold" style={{ display: 'inline', verticalAlign: '-1px' }} />
                      {' '}
                      {operation === 'add' ? 'بعد' : 'قبل'} {amount || 0} {UNIT_OPTIONS.find((u) => u.value === unit)?.label}
                      {' '}من {result.sourceHijri.day}/{result.sourceHijri.month}/{result.sourceHijri.year} هـ
                      {' '}({result.sourceGregorian.day}/{result.sourceGregorian.month}/{result.sourceGregorian.year}م)
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <div className="calc-metric-card">
              <div className="calc-metric-card__note">
                <ArrowsCounterClockwise size={14} weight="bold" style={{ display: 'inline', verticalAlign: '-2px' }} />
                {' '}أدخل التاريخ والعدد والوحدة لعرض التاريخ الناتج بالتقويمين.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
