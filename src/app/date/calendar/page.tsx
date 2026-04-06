import { redirect } from 'next/navigation';
import { getCachedNowIso } from '@/lib/date-utils';

export default async function CalendarRootPage() {
  const currentYear = new Date(await getCachedNowIso()).getUTCFullYear();
  redirect(`/date/calendar/${currentYear}`);
}
