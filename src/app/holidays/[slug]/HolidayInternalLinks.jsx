import Link from 'next/link';
import { ArrowLeft, Clock, RefreshCw, Calculator, CalendarDays, Globe2 } from 'lucide-react';
import { getCountryByCode } from '@/lib/events/country-dictionary';
import { getCountryHubByCode } from '@/lib/holidays/country-hub-data';

const LINK_ICONS = {
  'prayer-times': Clock,
  'date-convert': RefreshCw,
  calculator: Calculator,
  calendar: CalendarDays,
  hub: Globe2,
};

const ISLAMIC_CATEGORIES = new Set(['islamic', 'hijri']);

const GULF_PAY_DATES_SLUGS = new Set([
  'salary-day-saudi', 'salary-day-uae', 'salary-day-kuwait', 'salary-day-qatar',
  'salary-day-bahrain', 'salary-day-oman',
  'pension-day-saudi', 'pension-day-uae', 'pension-day-kuwait', 'pension-day-bahrain', 'pension-day-oman',
  'citizen-account-saudi', 'hafez-saudi', 'housing-support-saudi', 'reef-support-saudi',
  'sand-payment-saudi', 'social-security-saudi',
  'housing-allowance-kuwait', 'national-labor-support-kuwait', 'social-assistance-kuwait',
  'cost-of-living-allowance-bahrain', 'social-assistance-bahrain',
  'job-security-oman', 'social-security-qatar', 'nafis-uae',
]);

const CALCULATOR_LINKS = {
  // Islamic religious events
  'ramadan':             { href: '/tools/health/fasting',           title: 'حاسبة الصيام',           desc: 'ساعات الصيام وأوقات الإفطار في مدينتك طوال الشهر.' },
  'eid-al-adha':         { href: '/tools/gulf-finance/aqiqah',    title: 'حاسبة العقيقة',          desc: 'احسب عدد الذبائح وتكلفتها التقديرية قبل العيد.' },
  'day-of-arafa':        { href: '/tools/health/fasting',          title: 'حاسبة الصيام',           desc: 'ساعات صيام يوم عرفة وأوقاته في أي مدينة.' },
  'first-dhul-hijjah':   { href: '/tools/gulf-finance/wasiyya',   title: 'حاسبة الوصية الشرعية',    desc: 'كم يجوز أن توصي من تركتك قبل موسم الحج.' },
  'ashura':              { href: '/tools/health/fasting',          title: 'حاسبة الصيام',           desc: 'ساعات صيام عاشوراء وأوقاته في مدينتك.' },
  // Salary / support payment events
  'salary-day-saudi':    { href: '/tools/gulf-finance',           title: 'حاسبات الرواتب الخليجية', desc: 'استكشف حاسبات الرواتب والمزايا في السعودية.' },
  'salary-day-uae':      { href: '/tools/gulf-finance/uae-end-of-service', title: 'نهاية الخدمة الإمارات', desc: 'احسب مكافأة نهاية خدمتك في الإمارات وفق قانون 2021.' },
  'salary-day-kuwait':   { href: '/tools/gulf-finance',           title: 'حاسبات الرواتب الخليجية', desc: 'استكشف حاسبات الرواتب والمزايا في الكويت.' },
  'salary-day-qatar':    { href: '/tools/gulf-finance',           title: 'حاسبات الرواتب الخليجية', desc: 'استكشف حاسبات الرواتب والمزايا في قطر.' },
  'pension-day-saudi':   { href: '/tools/gulf-finance/end-of-service-benefits', title: 'نهاية الخدمة',    desc: 'احسب مكافأة نهاية خدمتك قبل التقاعد.' },
  'citizen-account-saudi': { href: '/tools/gulf-finance',         title: 'حاسبات الرواتب الخليجية', desc: 'استكشف حاسبات الرواتب والمزايا السعودية.' },
  'social-security-saudi': { href: '/tools/gulf-finance/end-of-service-benefits', title: 'نهاية الخدمة',  desc: 'قدّر حقوقك التقاعدية من التأمينات الاجتماعية.' },
  'hafez-saudi':         { href: '/tools/gulf-finance',           title: 'حاسبات الرواتب الخليجية', desc: 'استكشف حاسبات الرواتب والمزايا السعودية.' },
  // National / public holiday events
  'saudi-national-day':  { href: '/tools/gulf-finance/iqama',     title: 'حاسبة الإقامة',          desc: 'احسب رسوم تجديد الإقامة وتكلفة المرافقين.' },
  'uae-national-day':    { href: '/tools/gulf-finance/uae-end-of-service', title: 'نهاية الخدمة الإمارات', desc: 'احسب مكافأة نهاية خدمتك في الإمارات وفق قانون 2021.' },
  'kuwait-national-day': { href: '/tools/gulf-finance/annual-leave', title: 'حاسبة الإجازات',       desc: 'احسب أيام إجازتك المستحقة وفق قانون العمل الكويتي.' },
  // School-year events
  'school-start-saudi': { href: '/tools/education/saudi-school-calendar', title: 'التقويم الدراسي السعودي', desc: 'كل إجازات العام الدراسي 1448 في جدول واحد.' },
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
      kind: 'prayer-times',
    });
  }

  // 2. Date conversion — always useful for hijri events
  if (isIslamic || event?.type === 'hijri') {
    links.push({
      href: '/date/converter',
      title: 'تحويل التاريخ الهجري',
      desc: 'حوّل بين التاريخ الهجري والميلادي بدقة لأي يوم أو شهر.',
      cta: 'حوّل التاريخ',
      kind: 'date-convert',
    });
  } else {
    links.push({
      href: '/date/converter',
      title: 'تحويل التاريخ',
      desc: 'حوّل بين التاريخ الهجري والميلادي إذا كنت تقارن المواعيد بين التقويمين.',
      cta: 'حوّل التاريخ',
      kind: 'date-convert',
    });
  }

  // 3. Smart calculator per event type
  const calcLink = CALCULATOR_LINKS[slug];
  if (calcLink) {
    links.push({ href: calcLink.href, title: calcLink.title, desc: calcLink.desc, cta: 'ابدأ الحاسبة', kind: 'calculator' });
  } else if (event?.category === 'support') {
    links.push({
      href: '/tools/gulf-finance',
      title: 'حاسبات الرواتب الخليجية',
      desc: 'استكشف حاسبات الرواتب ونهاية الخدمة والمزايا في دولتك.',
      cta: 'ابدأ الحاسبة',
      kind: 'calculator',
    });
  } else if (event?.category === 'national') {
    links.push({
      href: '/tools/gulf-finance/annual-leave',
      title: 'حاسبة الإجازات السنوية',
      desc: 'احسب أيام إجازتك المستحقة قانونياً خلال العطلات الرسمية.',
      cta: 'ابدأ الحاسبة',
      kind: 'calculator',
    });
  } else if (event?.category === 'school') {
    links.push({
      href: '/tools/education/gpa',
      title: 'حاسبة المعدل التراكمي',
      desc: 'احسب GPA وحوّله إلى نسبة مئوية بدقة.',
      cta: 'ابدأ الحاسبة',
      kind: 'calculator',
    });
  } else if (isIslamic) {
    links.push({
      href: '/tools/gulf-finance/wasiyya',
      title: 'حاسبة الوصية الشرعية',
      desc: 'كم يجوز أن توصي من تركتك وفق الشريعة.',
      cta: 'ابدأ الحاسبة',
      kind: 'calculator',
    });
  } else {
    links.push({
      href: '/tools',
      title: 'الحاسبات',
      desc: 'حاسبات مالية وصحية وتعليمية — كلها في مكان واحد.',
      cta: 'استعرض الحاسبات',
      kind: 'calculator',
    });
  }

  // 4. Calendar / hijri year link
  if (event?.type === 'hijri' && hijriYearNum) {
    links.push({
      href: `/date/calendar/hijri/${hijriYearNum}`,
      title: `تقويم ${hijriYearNum} هـ`,
      desc: 'راجع الأشهر والأيام الهجرية للسنة الحالية في تقويم كامل.',
      cta: 'افتح التقويم',
      kind: 'calendar',
    });
  } else if (currentYear) {
    links.push({
      href: `/date/calendar/${currentYear}`,
      title: `تقويم ${currentYear}`,
      desc: 'اعرض تقويم السنة الحالية كاملاً مع التواريخ والمواسم.',
      cta: 'افتح التقويم',
      kind: 'calendar',
    });
  }

  // 5. Gulf-wide pay calendar for salary/pension/support events, then the
  //    country holiday-calendar hub when one exists, otherwise the all-holidays hub
  const countryHub = getCountryHubByCode(event?._countryCode);
  if (GULF_PAY_DATES_SLUGS.has(slug)) {
    links.push({
      href: '/tools/gulf-finance/gulf-pay-dates',
      title: 'جدول رواتب الخليج',
      desc: 'قارن هذا الموعد بكل مواعيد الرواتب والمعاشات والدعم في دول الخليج الست، مرتبة حسب الأقرب.',
      cta: 'افتح الجدول',
      kind: 'hub',
    });
  } else if (countryHub) {
    links.push({
      href: `/holidays/country/${countryHub.slug}`,
      title: `العطل الرسمية في ${countryHub.nameAr}`,
      desc: `جدول عطل ${countryHub.nameAr} كاملاً بالميلادي والهجري، مع عداد لأقرب إجازة وملف تقويم لهاتفك.`,
      cta: 'افتح الجدول',
      kind: 'hub',
    });
  } else {
    links.push({
      href: '/holidays',
      title: 'كل المناسبات',
      desc: country?.nameAr
        ? `تابع المناسبات القادمة لـ${country.nameAr} ومقارنة المواعيد بين الدول.`
        : 'قارن هذا الموعد بمناسبات أخرى قريبة في نفس الفهرس.',
      cta: 'استعرض المناسبات',
      kind: 'hub',
    });
  }

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
      <div className="waqt-related-grid">
        {links.map((link) => {
          const Icon = LINK_ICONS[link.kind] || Globe2;
          return (
            <Link key={`${link.href}-${link.title}`} href={link.href} className="waqt-related-card">
              <div className="waqt-related-card__head">
                <span className="waqt-icon-chip" aria-hidden="true">
                  <Icon size={18} strokeWidth={1.75} />
                </span>
                <h3 className="waqt-related-card__title">{link.title}</h3>
              </div>
              <p className="waqt-related-card__desc">{link.desc}</p>
              <span className="waqt-related-card__cta">
                {link.cta}
                <ArrowLeft size={14} aria-hidden="true" />
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
