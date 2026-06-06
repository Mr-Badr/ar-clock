import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getCountryByCode } from '@/lib/events/country-dictionary';

function buildLinks({ event, displayTitle, currentYear, hijriYearNum }) {
  const country = getCountryByCode(event?._countryCode);
  const links = [
    {
      href: '/holidays',
      title: 'كل المناسبات',
      description: 'ارجع إلى قائمة المناسبات عندما تريد مقارنة هذا الموعد بمناسبة قريبة.',
    },
    {
      href: '/date/converter',
      title: 'تحويل التاريخ',
      description: 'حوّل بين التاريخ الهجري والميلادي إذا كنت تقارن المواعيد بين التقويمين.',
    },
  ];

  if (event?.type === 'hijri') {
    links.push({
      href: '/date/today/hijri',
      title: 'التاريخ الهجري اليوم',
      description: `صفحة مفيدة إذا كنت تتابع ${displayTitle} مع بداية الشهر الهجري أو نهايته.`,
    });
    if (hijriYearNum) {
      links.push({
        href: `/date/calendar/hijri/${hijriYearNum}`,
        title: `تقويم ${hijriYearNum} الهجري`,
        description: 'راجع الأشهر والأيام الهجرية للسنة الحالية في تقويم كامل.',
      });
    }
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
      description: `تابع المناسبات الأقرب إلى ${country.officialNameAr || country.nameAr} من نفس القسم.`,
    });
  }

  return links.slice(0, 3);
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
        ماذا تفتح بعد موعد {displayTitle}؟
      </h2>
      <p
        style={{
          fontSize: 'var(--text-sm)',
          color: 'var(--text-secondary)',
          lineHeight: 'var(--leading-relaxed)',
          marginBottom: 'var(--space-4)',
        }}
      >
        اختر رابطاً واحداً بحسب حاجتك الآن: مقارنة الموعد، تحويل التاريخ، أو الرجوع إلى تقويم السنة.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 'var(--space-3)' }}>
        {links.map((link) => (
          <Link
            key={`${link.href}-${link.title}`}
            href={link.href}
            style={{
              padding: 'var(--space-3)',
              textDecoration: 'none',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-2)',
              color: 'inherit',
              background: 'var(--bg-surface-2)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
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
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                color: 'var(--accent-alt)',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-semibold)',
                marginTop: 'auto',
              }}
            >
              راجع المناسبة
              <ArrowLeft size={14} aria-hidden="true" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
