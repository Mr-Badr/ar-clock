'use client';

/**
 * FlightArrivalCalculator — given a departure time (local to the "from" city)
 * and a flight duration, computes the arrival time local to the "to" city.
 * Pure arithmetic on the page's already-verified `diffMinutes` — no fresh
 * timezone lookups, so it can't disagree with the rest of the page's numbers.
 */

import { useState, useMemo } from 'react';
import { Plane, ChevronUp, ChevronDown } from 'lucide-react';

function parseTimeToMinutes(value) {
  const match = /^(\d{1,2}):(\d{2})$/.exec(value || '');
  if (!match) return 9 * 60;
  const h = Math.min(23, Math.max(0, parseInt(match[1], 10)));
  const m = Math.min(59, Math.max(0, parseInt(match[2], 10)));
  return h * 60 + m;
}

function fmtTime(totalMins) {
  const norm = ((Math.round(totalMins) % 1440) + 1440) % 1440;
  const h = Math.floor(norm / 60);
  const m = norm % 60;
  const period = h >= 12 ? 'م' : 'ص';
  const h12 = h % 12 || 12;
  return `${h12}:${String(m).padStart(2, '0')} ${period}`;
}

function dayOffsetLabel(dayOffset) {
  if (dayOffset === 0) return 'في نفس اليوم';
  if (dayOffset === 1) return 'في اليوم التالي';
  if (dayOffset === -1) return 'في اليوم السابق';
  if (dayOffset > 1) return `بعد ${dayOffset} أيام`;
  return `قبل ${Math.abs(dayOffset)} أيام`;
}

export default function FlightArrivalCalculator({ fromCityAr, toCityAr, diffMinutes }) {
  const [departureTime, setDepartureTime] = useState('09:00');
  const [durationH, setDurationH] = useState(3);
  const [durationM, setDurationM] = useState(0);

  const result = useMemo(() => {
    const depMinutes = parseTimeToMinutes(departureTime);
    const durationMinutes = durationH * 60 + durationM;
    const totalMinutes = depMinutes + durationMinutes + diffMinutes;
    const dayOffset = Math.floor(totalMinutes / 1440);
    const arrivalMinutesOfDay = ((totalMinutes % 1440) + 1440) % 1440;
    return { arrivalTime: fmtTime(arrivalMinutesOfDay), dayOffset, durationMinutes };
  }, [departureTime, durationH, durationM, diffMinutes]);

  return (
    <div className="card td-flight">
      <div className="td-flight__header">
        <span className="td-flight__icon" aria-hidden="true"><Plane size={16} /></span>
        <div>
          <p className="td-flight__title">وقت الوصول حسب مدة الرحلة</p>
          <p className="td-flight__subtitle">أدخل وقت المغادرة ومدة الرحلة لمعرفة الساعة المحلية عند الوصول</p>
        </div>
      </div>

      <div className="td-flight__controls">
        <div className="td-flight__control">
          <label className="td-flight__control-label" htmlFor="td-flight-departure">
            وقت المغادرة من {fromCityAr}
          </label>
          <input
            id="td-flight-departure"
            type="time"
            value={departureTime}
            onChange={(event) => setDepartureTime(event.target.value)}
            className="td-flight__time-input"
            dir="ltr"
          />
        </div>

        <div className="td-flight__control">
          <span className="td-flight__control-label">مدة الرحلة</span>
          <div className="td-flight__duration-row">
            <div className="td-flight__stepper">
              <button
                type="button"
                onClick={() => setDurationH((v) => Math.max(0, v - 1))}
                aria-label="تقليل الساعات"
                className="td-flight__stepper-btn"
              >
                <ChevronDown size={15} />
              </button>
              <span className="td-flight__stepper-val tabular-nums" dir="ltr">{durationH} س</span>
              <button
                type="button"
                onClick={() => setDurationH((v) => Math.min(23, v + 1))}
                aria-label="زيادة الساعات"
                className="td-flight__stepper-btn"
              >
                <ChevronUp size={15} />
              </button>
            </div>
            <div className="td-flight__stepper">
              <button
                type="button"
                onClick={() => setDurationM((v) => (v - 15 + 60) % 60)}
                aria-label="تقليل الدقائق"
                className="td-flight__stepper-btn"
              >
                <ChevronDown size={15} />
              </button>
              <span className="td-flight__stepper-val tabular-nums" dir="ltr">{durationM} د</span>
              <button
                type="button"
                onClick={() => setDurationM((v) => (v + 15) % 60)}
                aria-label="زيادة الدقائق"
                className="td-flight__stepper-btn"
              >
                <ChevronUp size={15} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="td-flight__banner">
        <p className="td-flight__banner-title">ستصل إلى {toCityAr} الساعة</p>
        <p className="td-flight__banner-time tabular-nums" dir="ltr">{result.arrivalTime}</p>
        <p className="td-flight__banner-day">{dayOffsetLabel(result.dayOffset)} بتوقيت {toCityAr}</p>
      </div>
    </div>
  );
}
