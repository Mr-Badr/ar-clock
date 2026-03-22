import { redirect } from 'next/navigation';
import { convertDate } from '@/lib/date-adapter';
import { headers } from 'next/headers';
import { Suspense } from 'react';

async function HijriCalendarRedirect() {
  await headers();
  const now = new Date();
  const isoDate = now.toISOString().split('T')[0];

  try {
    const todayHijri = convertDate({
      date: isoDate,
      toCalendar: 'hijri',
      method: 'umalqura'
    });
    redirect(`/date/calendar/hijri/${todayHijri.year}`);
  } catch (error) {
    // Fallback to a safe year if conversion fails
    redirect('/date/calendar/hijri/1447');
  }
  return null;
}

export default function HijriCalendarRootPage() {
  return (
    <Suspense>
      <HijriCalendarRedirect />
    </Suspense>
  );
}
