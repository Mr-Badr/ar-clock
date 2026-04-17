import { redirect } from 'next/navigation';
import { getCachedNowIso } from '@/lib/date-utils';

export const metadata = {
  robots: {
    index: false,
    follow: true,
  },
};

export default async function CalendarRootPage() {
  const currentYear = new Date(await getCachedNowIso()).getUTCFullYear();
  redirect(`/date/calendar/${currentYear}`);
}
