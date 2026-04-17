import { redirect } from 'next/navigation';
import { convertDate } from '@/lib/date-adapter';
import { getCachedNowIso } from '@/lib/date-utils';

export const metadata = {
  robots: {
    index: false,
    follow: true,
  },
};

export default async function HijriCalendarRootPage() {
  const isoDate = (await getCachedNowIso()).slice(0, 10);
  try {
    const todayHijri = convertDate({
      date: isoDate,
      toCalendar: 'hijri',
      method: 'umalqura',
    });
    redirect(`/date/calendar/hijri/${todayHijri.year}`);
  } catch {
    redirect('/date/calendar/hijri/1447');
  }
}
