import Link from 'next/link';
import { getCountryByCode } from '@/lib/events/country-dictionary';

function buildLinks({ event, displayTitle, currentYear, hijriYearNum }) {
  const country = getCountryByCode(event?._countryCode);
  const links = [
    {
      href: '/holidays',
      title: 'كل المناسبات',
      description: 'استكشف جميع صفحات العد التنازلي والمناسبات القادمة من مكان واحد.',
    },
    {
      href: '/date/today',
      title: 'تاريخ اليوم',
      description: 'اعرف التاريخ الميلادي والهجري اليوم مع أدوات التاريخ والعدّاد.',
    },
    {
      href: '/date/converter',
      title: 'تحويل التاريخ',
      description: 'حوّل بين التاريخ الهجري والميلادي إذا كنت تقارن المواعيد بين التقويمين.',
    },
    {
      href: '/time-now',
      title: 'الوقت الآن',
      description: `تابع الوقت الحالي في الدول والمدن إذا كنت تربط ${displayTitle} بموعد محلي أو منطقة زمنية.`,
    },
  ];

  if (event?.type === 'hijri') {
    links.push({
      href: '/date/today/hijri',
      title: 'التاريخ الهجري اليوم',
      description: 'صفحة مخصصة لمتابعة التاريخ الهجري اليومي وأشهر السنة الهجرية.',
    });
    if (hijriYearNum) {
      links.push({
        href: `/date/calendar/hijri/${hijriYearNum}`,
        title: `تقويم ${hijriYearNum} الهجري`,
        description: 'راجع الأشهر والأيام الهجرية للسنة الحالية في تقويم كامل.',
      });
    }
    links.push({
      href: '/mwaqit-al-salat',
      title: 'مواقيت الصلاة',
      description: 'صفحة مناسبة للمستخدم الذي يتابع الأحداث الإسلامية إلى جانب الوقت والصلاة والتقويم الهجري.',
    });
  } else if (currentYear) {
    links.push({
      href: `/date/calendar/${currentYear}`,
      title: `تقويم ${currentYear}`,
      description: 'اعرض تقويم السنة الحالية كاملاً مع التواريخ والمواسم والمناسبات.',
    });
  }

  if (country?.code) {
    links.push({
      href: '/holidays',
      title: `مناسبات ${country.nameAr}`,
      description: `ابدأ من صفحة المناسبات الرئيسية ثم تابع الأحداث الأقرب إلى ${country.officialNameAr || country.nameAr}.`,
    });
  }

  return links.slice(0, 6);
}

export default function HolidayInternalLinks({
  event,
  displayTitle,
  currentYear,
  hijriYearNum,
}) {
  const links = buildLinks({ event, displayTitle, currentYear, hijriYearNum });
  if (!links.length) return null;

  return (
    <section style={{ marginTop: 'var(--space-10)' }} aria-labelledby="internal-links-h">
      <h2
        id="internal-links-h"
        style={{
          fontSize: 'var(--text-lg)',
          fontWeight: 'var(--font-bold)',
          color: 'var(--text-primary)',
          marginBottom: 'var(--space-4)',
        }}
      >
        روابط داخلية مفيدة حول {displayTitle}
      </h2>
      <p
        style={{
          fontSize: 'var(--text-sm)',
          color: 'var(--text-secondary)',
          lineHeight: 'var(--leading-relaxed)',
          marginBottom: 'var(--space-4)',
        }}
      >
        هذه الروابط تساعدك على استكشاف الصفحات الأقرب لهذا الموضوع داخل الموقع، وتربط صفحة
        الحدث بأدوات التاريخ والمناسبة والفئة والبلد بطريقة أوضح لمحركات البحث والزوار.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-3)' }}>
        {links.map((link) => (
          <Link
            key={`${link.href}-${link.title}`}
            href={link.href}
            className="card-nested"
            style={{
              padding: 'var(--space-4)',
              textDecoration: 'none',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-2)',
              color: 'inherit',
            }}
          >
            <h3
              style={{
                fontSize: 'var(--text-base)',
                fontWeight: 'var(--font-semibold)',
                color: 'var(--text-primary)',
                margin: 0,
              }}
            >
              {link.title}
            </h3>
            <p
              style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--text-secondary)',
                lineHeight: 'var(--leading-relaxed)',
                margin: 0,
              }}
            >
              {link.description}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
