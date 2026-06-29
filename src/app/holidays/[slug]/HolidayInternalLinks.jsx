import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getCountryByCode } from '@/lib/events/country-dictionary';

const ISLAMIC_CATEGORIES = new Set(['islamic', 'hijri']);

const CALCULATOR_LINKS = {
  // Islamic religious events
  'eid-al-fitr':         { href: '/calculators/zakat',            title: 'حاسبة الزكاة',           desc: 'احسب زكاتك قبل عيد الفطر — مال وذهب واستثمارات.' },
  'ramadan':             { href: '/calculators/fasting',           title: 'حاسبة الصيام',           desc: 'ساعات الصيام وأوقات الإفطار في مدينتك طوال الشهر.' },
  'eid-al-adha':         { href: '/calculators/zakat',            title: 'حاسبة الزكاة',           desc: 'احسب زكاتك وتكلفة الأضحية قبل العيد.' },
  'day-of-arafa':        { href: '/calculators/fasting',          title: 'حاسبة الصيام',           desc: 'ساعات صيام يوم عرفة وأوقاته في أي مدينة.' },
  'first-dhul-hijjah':   { href: '/calculators/inheritance',      title: 'حاسبة الميراث',          desc: 'احسب توزيع التركة وفق الشريعة في موسم الحج.' },
  'ashura':              { href: '/calculators/fasting',          title: 'حاسبة الصيام',           desc: 'ساعات صيام عاشوراء وأوقاته في مدينتك.' },
  // Salary / support payment events
  'salary-day-saudi':    { href: '/calculators/salary',           title: 'حاسبة الراتب',           desc: 'احسب ما يعادل راتبك الشهري يومياً وساعياً.' },
  'salary-day-uae':      { href: '/calculators/net-salary',       title: 'صافي الراتب',            desc: 'احسب راتبك بعد خصم GPSSA وباقي الاستقطاعات.' },
  'salary-day-kuwait':   { href: '/calculators/salary',           title: 'حاسبة الراتب',           desc: 'حوّل راتبك الكويتي بين شهري ويومي وساعي.' },
  'salary-day-qatar':    { href: '/calculators/salary',           title: 'حاسبة الراتب',           desc: 'احسب الراتب اليومي والساعي وفق أيام العمل الفعلية.' },
  'pension-day-saudi':   { href: '/calculators/end-of-service-benefits', title: 'نهاية الخدمة',    desc: 'احسب مكافأة نهاية خدمتك قبل التقاعد.' },
  'citizen-account-saudi': { href: '/calculators/net-salary',     title: 'صافي الراتب',            desc: 'احسب الراتب بعد خصم GOSI وزكاة الفطر.' },
  'social-security-saudi': { href: '/calculators/end-of-service-benefits', title: 'نهاية الخدمة',  desc: 'قدّر حقوقك التقاعدية من التأمينات الاجتماعية.' },
  'hafez-saudi':         { href: '/calculators/salary',           title: 'حاسبة الراتب',           desc: 'احسب ما يعادل مبلغ حافز يومياً مقارنةً بالراتب.' },
  // National / public holiday events
  'saudi-national-day':  { href: '/calculators/iqama',            title: 'حاسبة الإقامة',          desc: 'احسب رسوم تجديد الإقامة وتكلفة المرافقين.' },
  'uae-national-day':    { href: '/calculators/net-salary',       title: 'صافي الراتب',            desc: 'احسب راتبك الإماراتي بعد كل الخصومات.' },
  'kuwait-national-day': { href: '/calculators/annual-leave',     title: 'حاسبة الإجازات',         desc: 'احسب أيام إجازتك المستحقة وفق قانون العمل الكويتي.' },
};

function buildLinks({ event, displayTitle, currentYear, hijriYearNum }) {
  const country = getCountryByCode(event?._countryCode);
  const slug = event?.slug || '';
  const isIslamic = ISLAMIC_CATEGORIES.has(event?.category) || event?.type === 'hijri';
  const links = [];

  // 1. Prayer times — highest daily-use page, always relevant for Islamic events
  if (isIslamic) {
    links.push({
      href: '/mwaqit-al-salat',
      title: 'مواقيت الصلاة',
      desc: `اعرف مواعيد الصلاة في يوم ${displayTitle} ويومياً في مدينتك.`,
      cta: 'اعرف المواقيت',
    });
  }

  // 2. Date conversion — always useful for hijri events
  if (isIslamic || event?.type === 'hijri') {
    links.push({
      href: '/date/converter',
      title: 'تحويل التاريخ الهجري',
      desc: 'حوّل بين التاريخ الهجري والميلادي بدقة لأي يوم أو شهر.',
      cta: 'حوّل التاريخ',
    });
  } else {
    links.push({
      href: '/date/converter',
      title: 'تحويل التاريخ',
      desc: 'حوّل بين التاريخ الهجري والميلادي إذا كنت تقارن المواعيد بين التقويمين.',
      cta: 'حوّل التاريخ',
    });
  }

  // 3. Smart calculator per event type
  const calcLink = CALCULATOR_LINKS[slug];
  if (calcLink) {
    links.push({ href: calcLink.href, title: calcLink.title, desc: calcLink.desc, cta: 'ابدأ الحاسبة' });
  } else if (event?.category === 'support') {
    links.push({
      href: '/calculators/salary',
      title: 'حاسبة الراتب',
      desc: 'احسب ما يعادل راتبك الشهري يومياً وساعياً وسنوياً.',
      cta: 'ابدأ الحاسبة',
    });
  } else if (event?.category === 'national') {
    links.push({
      href: '/calculators/annual-leave',
      title: 'حاسبة الإجازات السنوية',
      desc: 'احسب أيام إجازتك المستحقة قانونياً خلال العطلات الرسمية.',
      cta: 'ابدأ الحاسبة',
    });
  } else if (event?.category === 'school') {
    links.push({
      href: '/calculators/gpa',
      title: 'حاسبة المعدل التراكمي',
      desc: 'احسب GPA وحوّله إلى نسبة مئوية بدقة.',
      cta: 'ابدأ الحاسبة',
    });
  } else if (isIslamic) {
    links.push({
      href: '/calculators/zakat',
      title: 'حاسبة الزكاة',
      desc: 'احسب زكاتك وفق النصاب الشرعي — مال وذهب واستثمارات.',
      cta: 'ابدأ الحاسبة',
    });
  } else {
    links.push({
      href: '/calculators',
      title: 'الحاسبات',
      desc: 'حاسبات مالية وصحية وتعليمية — كلها في مكان واحد.',
      cta: 'استعرض الحاسبات',
    });
  }

  // 4. Calendar / hijri year link
  if (event?.type === 'hijri' && hijriYearNum) {
    links.push({
      href: `/date/calendar/hijri/${hijriYearNum}`,
      title: `تقويم ${hijriYearNum} هـ`,
      desc: 'راجع الأشهر والأيام الهجرية للسنة الحالية في تقويم كامل.',
      cta: 'افتح التقويم',
    });
  } else if (currentYear) {
    links.push({
      href: `/date/calendar/${currentYear}`,
      title: `تقويم ${currentYear}`,
      desc: 'اعرض تقويم السنة الحالية كاملاً مع التواريخ والمواسم.',
      cta: 'افتح التقويم',
    });
  }

  // 5. All holidays hub
  links.push({
    href: '/holidays',
    title: 'كل المناسبات',
    desc: country?.nameAr
      ? `تابع المناسبات القادمة لـ${country.nameAr} ومقارنة المواعيد بين الدول.`
      : 'قارن هذا الموعد بمناسبات أخرى قريبة في نفس الفهرس.',
    cta: 'استعرض المناسبات',
  });

  return links.slice(0, 4);
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
          marginBottom: 'var(--space-2)',
        }}
      >
        الخطوة التالية بعد {displayTitle}
      </h2>
      <p
        style={{
          fontSize: 'var(--text-sm)',
          color: 'var(--text-secondary)',
          lineHeight: 'var(--leading-relaxed)',
          marginBottom: 'var(--space-4)',
        }}
      >
        اختر ما تحتاجه فعلاً: مواقيت الصلاة، تحويل التاريخ، حاسبة مالية، أو مناسبة قريبة.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-3)' }}>
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
                flexGrow: 1,
              }}
            >
              {link.desc}
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
              {link.cta}
              <ArrowLeft size={14} aria-hidden="true" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
