import Link from 'next/link';

export function DateCalendarUnavailable({
  calendarType,
  year,
}: {
  calendarType: 'gregorian' | 'hijri';
  year: number;
}) {
  const calendarLabel = calendarType === 'hijri' ? 'الهجري' : 'الميلادي';

  return (
    <section
      className="date-detail-panel"
      role="alert"
      data-route-status="calendar-section-error"
      aria-labelledby={`${calendarType}-calendar-unavailable-title`}
    >
      <h2 id={`${calendarType}-calendar-unavailable-title`} className="date-section-title">
        تعذر عرض شبكة تقويم {year} {calendarLabel}
      </h2>
      <p className="date-editorial-copy mb-4">
        بقي ملخص السنة وبقية الشروحات متاحة في الصفحة. يمكنك استخدام محول التاريخ الآن، ثم إعادة فتح التقويم بعد قليل.
      </p>
      <div className="flex flex-wrap gap-2">
        <Link href="/date/converter" className="chip">
          فتح محول التاريخ
        </Link>
        <Link
          href={calendarType === 'hijri' ? '/date/calendar/hijri' : '/date/calendar'}
          className="chip"
        >
          الرجوع إلى اختيار السنة
        </Link>
      </div>
    </section>
  );
}
