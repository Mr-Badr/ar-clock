import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { getCachedNowIso } from '@/lib/date-utils';

async function CalendarRedirect() {
  const currentYear = new Date(await getCachedNowIso()).getUTCFullYear();
  redirect(`/date/calendar/${currentYear}`);
  return null;
}

export default function CalendarRootPage() {
  return (
    <Suspense>
      <CalendarRedirect />
    </Suspense>
  );
}
