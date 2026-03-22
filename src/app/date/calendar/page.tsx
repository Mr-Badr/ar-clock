import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { Suspense } from 'react';

async function CalendarRedirect() {
  await headers();
  const currentYear = new Date().getUTCFullYear();
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
