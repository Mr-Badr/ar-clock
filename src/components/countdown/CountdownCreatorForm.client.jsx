'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { CalendarToggle, GregorianDateField, HijriDateFields } from '@/components/calculators/age/shared.client';
import { CalcButton as Button, CalcInput as Input } from '@/components/calculators/controls.client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { resolveCountdownTarget, sanitizeCountdownTitle } from '@/lib/countdown/resolve';

export default function CountdownCreatorForm() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [calendar, setCalendar] = useState('gregorian');
  const [gregorianIso, setGregorianIso] = useState('');
  const [hijriValue, setHijriValue] = useState({ day: '', month: '', year: '' });
  const [time, setTime] = useState('00:00');
  const [error, setError] = useState('');

  function handleSubmit(event) {
    event.preventDefault();

    const cleanTitle = sanitizeCountdownTitle(title);
    if (!cleanTitle) {
      setError('اكتب اسم المناسبة أولاً.');
      return;
    }

    const target = resolveCountdownTarget({
      calendar,
      gregorianDateIso: gregorianIso,
      hijriValue,
      time,
    });
    if (!target.isValid) {
      setError(target.error || 'تعذر تحديد موعد هذه المناسبة.');
      return;
    }

    setError('');
    const params = new URLSearchParams({ title: cleanTitle, date: target.iso });
    router.push(`/countdown?${params.toString()}`);
  }

  return (
    <Card className="calc-surface-card calc-app-panel">
      <CardHeader>
        <CardTitle className="calc-card-title">أنشئ عدادك التنازلي</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="calc-form-grid">
          <div className="calc-field">
            <Label htmlFor="countdown-title" className="calc-label">اسم المناسبة</Label>
            <Input
              id="countdown-title"
              type="text"
              value={title}
              maxLength={80}
              placeholder="مثال: زفافي، امتحاني، إطلاق المنتج"
              onChange={(event) => setTitle(event.target.value)}
            />
          </div>

          <div className="calc-field age-birth-input">
            <div className="calc-field-row">
              <Label className="calc-label">تاريخ المناسبة</Label>
              <CalendarToggle value={calendar} onChange={setCalendar} />
            </div>
            {calendar === 'gregorian' ? (
              <GregorianDateField
                id="countdown-date"
                label="تاريخ المناسبة"
                value={gregorianIso}
                onChange={setGregorianIso}
              />
            ) : (
              <HijriDateFields
                label="تاريخ المناسبة الهجري"
                value={hijriValue}
                onChange={setHijriValue}
              />
            )}
          </div>

          <div className="calc-field">
            <Label htmlFor="countdown-time" className="calc-label">الوقت (اختياري)</Label>
            <Input
              id="countdown-time"
              type="time"
              value={time}
              onChange={(event) => setTime(event.target.value || '00:00')}
            />
            <p className="calc-hint">اتركه كما هو إذا كانت المناسبة تخص اليوم كاملاً وليست ساعة محددة.</p>
          </div>

          {error ? <div className="calc-warning" role="alert">{error}</div> : null}

          <Button type="submit">
            أنشئ العداد وشاركه
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
