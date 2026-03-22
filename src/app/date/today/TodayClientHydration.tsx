// src/app/date/today/TodayClientHydration.tsx
'use client';

import { useEffect, useState } from 'react';
import { GREGORIAN_MONTH_NAMES_AR, DAY_NAMES_AR } from '@/lib/date-adapter';

interface TodayClientHydrationProps {
  serverDate: string; // UTC-based date from server
}

/**
 * Silent client-side timezone correction.
 * The server renders UTC date (good for SEO bots).
 * This component checks if the user's LOCAL date differs from the server's UTC date
 * and shows a correction notice if so.
 */
export default function TodayClientHydration({ serverDate }: TodayClientHydrationProps) {
  const [localDateStr, setLocalDateStr] = useState<string | null>(null);

  useEffect(() => {
    const now = new Date();
    const clientIso = now.toLocaleDateString('en-CA'); // YYYY-MM-DD in local time
    if (clientIso !== serverDate) {
      setLocalDateStr(clientIso);
    }
  }, [serverDate]);

  if (!localDateStr) return null;

  const [y, m, d] = localDateStr.split('-').map(Number);
  const dayName = DAY_NAMES_AR[new Date(y, m - 1, d).getDay()];
  const monthName = GREGORIAN_MONTH_NAMES_AR[m - 1];

  return (
    <div className="flex items-center gap-2 bg-info-soft border border-info-border rounded-[var(--radius)] px-4 py-3 text-sm text-info mb-4">
      <span className="text-lg leading-none">🕐</span>
      <span className="leading-relaxed">
        بتوقيتك المحلي، اليوم هو <strong>{dayName} {d} {monthName} {y}</strong>.
        التاريخ المعروض أعلاه قد يختلف قليلاً بسبب فارق التوقيت.
      </span>
    </div>
  );
}
