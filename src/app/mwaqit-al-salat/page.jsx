// app/mwaqit-al-salat/page.jsx
import Link from 'next/link';
import { Suspense } from 'react';
import SearchCityWrapper from '@/components/SearchCityWrapper.client';
import FAQAccordions from '@/components/mwaqit/FAQAccordions.client';
import AdLayoutWrapper from '@/components/ads/AdLayoutWrapper';
import AdTopBanner from '@/components/ads/AdTopBanner';
import AdInArticle from '@/components/ads/AdInArticle';
import AdMultiplex from '@/components/ads/AdMultiplex';
import { CalendarDays, Clock, Compass, Globe2, MapPin, Timer } from 'lucide-react';
import routeStyles from '@/app/mwaqit-al-salat/PrayerRoutePage.module.css';
import { appendToolDiscoveryLinks } from '@/lib/seo/discovery-links';
import { getFlagEmoji } from '@/lib/country-utils';
import { getSiteUrl } from '@/lib/site-config';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import {
  getPopularPrayerCityLinks,
  getPopularPrayerCountryLinks,
} from '@/lib/seo/popular-links';
import { buildPrayerKeywords } from '@/lib/seo/section-search-intent';

const BASE = getSiteUrl();

export const metadata = buildCanonicalMetadata({
  title: 'مواقيت الصلاة اليوم في أي مدينة — الفجر والمغرب والصلاة القادمة',
  description:
    'مواقيت الصلاة الآن في مدينتك: الفجر والظهر والعصر والمغرب والعشاء — مع كاونتداون للصلاة القادمة، جدول شهري، طريقة الحساب، ووقت الإمساك والإفطار في رمضان.',
  keywords: buildPrayerKeywords(),
  url: `${BASE}/mwaqit-al-salat`,
});

const PRAYER_DECISION_CARDS = [
  {
    title: 'إذا كنت تريد صلاة اليوم',
    body: 'ابدأ باسم المدينة، لا باسم الدولة فقط. وقت الفجر والمغرب يتغيران بحسب موقع المدينة داخل الدولة، خصوصاً في الدول الواسعة.',
  },
  {
    title: 'إذا لاحظت فرقاً بين تطبيقين',
    body: 'راجع طريقة الحساب وزاوية الفجر والعشاء والمذهب في العصر. اختلاف صغير لا يعني أن إحدى الصفحات خاطئة؛ قد تكون الإعدادات مختلفة.',
  },
  {
    title: 'إذا كان الاعتماد رسمياً',
    body: 'استخدم جدول المسجد أو الجهة الرسمية المحلية عند وجود إعلان واضح. هذه الصفحة تساعدك على الفهم والمتابعة اليومية، وليست فتوى محلية ملزمة.',
  },
];

const PRAYER_SOURCE_LINKS = [
  {
    href: 'https://github.com/batoulapps/adhan-js',
    label: 'Adhan.js',
    description: 'المكتبة المستخدمة لحساب مواقيت الصلاة من الإحداثيات، طريقة الحساب، والمذهب.',
  },
  {
    href: 'https://pray.zone/calculations',
    label: 'شرح طرق حساب الصلاة',
    description: 'شرح عملي لزوايا الفجر والعشاء، إعداد العصر، وقواعد خطوط العرض العالية.',
  },
  {
    href: 'https://zaman.today/en',
    label: 'مقارنة أدوات الصلاة الحديثة',
    description: 'يوضح كيف تُستخدم الإحداثيات والمنطقة الزمنية وطرق الحساب لعرض مواقيت اليوم والتقويم الهجري والقبلة.',
  },
];

const PRIMARY_UTILITY_LINKS = [
  {
    href: '/time-now',
    label: 'الوقت الان في المدن والدول',
    description: 'اعرف الساعة الحالية في نفس المدن التي تتابع فيها مواقيت الصلاة.',
  },
  {
    href: '/date/today/hijri',
    label: 'التاريخ الهجري اليوم',
    description: 'راجع التاريخ الهجري اليوم المرتبط بالمواقيت والتقويم والمناسبات الإسلامية.',
  },
  {
    href: '/date/converter',
    label: 'محول التاريخ',
    description: 'حوّل بين التاريخ الهجري والميلادي بسرعة عند التخطيط للمناسبات والعبادات.',
  },
  {
    href: '/time-difference',
    label: 'حاسبة فرق التوقيت',
    description: 'قارن التوقيت بين المدن والدول عند متابعة الصلاة والسفر والعمل عن بعد.',
  },
];

// ─── 12 Calculation Methods data ──────────────────────────────────────────────
const METHODS_TABLE = [
  { method: 'أم القرى',                      code: 'UmmAlQura',            region: 'المملكة العربية السعودية',                 fajr: '18.5°', isha: '90 دق' },
  { method: 'الهيئة المصرية',                code: 'Egyptian',             region: 'مصر، المغرب، الجزائر، تونس، ليبيا',        fajr: '19.5°', isha: '17.5°' },
  { method: 'كراتشي',                        code: 'Karachi',              region: 'باكستان، الهند، بنغلاديش، أفغانستان',      fajr: '18°',   isha: '18°'   },
  { method: 'رابطة العالم الإسلامي',         code: 'MWL',                  region: 'أوروبا، أفريقيا جنوب الصحراء',             fajr: '18°',   isha: '17°'   },
  { method: 'دبي',                           code: 'Dubai',                region: 'الإمارات، عُمان، البحرين، اليمن',           fajr: '18.2°', isha: '18.2°' },
  { method: 'قطر',                           code: 'Qatar',                region: 'قطر',                                      fajr: '18°',   isha: '90 دق' },
  { method: 'الكويت',                        code: 'Kuwait',               region: 'الكويت',                                   fajr: '18°',   isha: '17.5°' },
  { method: 'Diyanet تركيا',                 code: 'Turkey',               region: 'تركيا، أذربيجان',                          fajr: '18°',   isha: '17°'   },
  { method: 'سنغافورة / MUIS',               code: 'Singapore',            region: 'سنغافورة، ماليزيا، إندونيسيا، بروناي',    fajr: '20°',   isha: '18°'   },
  { method: 'ISNA — أمريكا الشمالية',        code: 'NorthAmerica',         region: 'الولايات المتحدة، كندا، أستراليا',         fajr: '15°',   isha: '15°'   },
  { method: 'طهران',                         code: 'Tehran',               region: 'إيران',                                    fajr: '17.7°', isha: '14°'   },
  { method: 'لجنة رؤية الهلال',              code: 'Moonsighting',         region: 'المملكة المتحدة، أيرلندا',                 fajr: '18°',   isha: 'حسب اللجنة' },
];

// ─── FAQ ──────────────────────────────────────────────────────────────────────
const faqs = [
  {
    q: 'كيف تُحسب مواقيت الصلاة على الموقع؟',
    node: (
      <div className="space-y-2 text-secondary">
        <p>
          يعتمد الموقع على معادلات فلكية دقيقة تأخذ في الاعتبار إحداثيات المدينة،
          المنطقة الزمنية، والانكسار الجوي.
        </p>
        <p>
          الأهم: يختار الموقع تلقائياً <strong className="text-primary">طريقة الحساب الأقرب للجهة المعتمدة في بلدك</strong>{' '}
          من بين 12 طريقة — أم القرى للسعودية، الطريقة المصرية للمغرب، Diyanet لتركيا،
          كراتشي لباكستان. إذا كان مسجدك ينشر جدولاً محلياً مختلفاً فاجعله مرجعك العملي للصلاة.
        </p>
      </div>
    ),
  },
  {
    q: 'ما الفرق بين وقت العصر للشافعي والحنفي والمالكي والحنبلي؟',
    node: (
      <div className="space-y-2 text-secondary">
        <p>الخلاف يظهر <strong className="text-primary">فقط في وقت العصر</strong>. جميع الصلوات الأخرى متطابقة:</p>
        <ul className="list-disc ps-5 space-y-1.5">
          <li><strong className="text-primary">الشافعي والمالكي والحنبلي:</strong> العصر حين يساوي الظل طول الشيء (×1) — وهم يعطون نفس وقت البداية تماماً.</li>
          <li><strong className="text-primary">الحنفي:</strong> العصر حين يكون الظل ضعف الطول (×2)، مما يؤخره 45–90 دقيقة. معتمد في تركيا وباكستان والهند وآسيا الوسطى.</li>
        </ul>
        <p className="text-xs text-muted pt-1">الموقع يعرض كلا التوقيتين جنباً إلى جنب في صفحة كل مدينة.</p>
      </div>
    ),
  },
  {
    q: 'ما الفرق بين طرق الحساب الـ12 المدعومة؟',
    node: (
      <div className="space-y-2 text-secondary">
        <p>الاختلاف الرئيسي هو <strong className="text-primary">زاوية الفجر والعشاء تحت الأفق</strong> بالدرجات. مثلاً:</p>
        <ul className="list-disc ps-5 space-y-1">
          <li>أم القرى: الفجر 18.5°، العشاء 90 دق بعد المغرب</li>
          <li>ISNA: الفجر 15° (مناسبة لخطوط العرض العالية في أمريكا الشمالية)</li>
          <li>سنغافورة: الفجر 20°، العشاء 18° (الأكبر)</li>
        </ul>
        <p>الموقع يختار الطريقة الأنسب تلقائياً ويمكنك تغييرها يدوياً.</p>
      </div>
    ),
  },
  {
    q: 'هل يدعم الموقع التوقيت الصيفي (DST)؟',
    a: 'نعم. نستخدم المنطقة الزمنية المرتبطة بالمدينة، لذلك تتحول الساعة تلقائياً عند تطبيق التوقيت الصيفي. إذا أعلنت جهة محلية تغييراً استثنائياً فراجع الجدول الرسمي في بلدك.',
  },
  {
    q: 'هل تقدمون إمساكية رمضان؟',
    a: 'نعم. في صفحة كل مدينة ستجد جدولاً شهرياً كاملاً بمواقيت الصلاة يومياً، قابلاً للطباعة بنقرة واحدة.',
  },
  {
    q: 'ما دقة الحسابات المعروضة؟',
    a: 'تُحسب المواقيت من الإحداثيات والمنطقة الزمنية وطريقة الحساب ثم تُعرض بالدقيقة. قد تختلف دقيقة أو أكثر عن جدول المسجد بسبب إعدادات الطريقة أو التقريب أو اعتماد محلي خاص.',
  },
  {
    q: 'لماذا تختلف مواقيت الصلاة بين تطبيقين؟',
    a: 'غالباً بسبب اختلاف طريقة الحساب، زاوية الفجر والعشاء، قاعدة العصر، أو التقريب بالدقائق. لذلك اعتمد إعدادات بلدك أو مسجدك، وافتح صفحة المدينة للتأكد من أن الإحداثيات والمنطقة الزمنية صحيحة.',
  },
  {
    q: 'هل وقت الإمساك هو نفسه وقت الفجر؟',
    a: 'الأصل العملي أن الإمساك يكون قبل دخول الفجر أو عنده بحسب عادة التقويم المحلي. في رمضان راجع صفحة المدينة أو تقويم الجهة الرسمية إذا كانت تضيف احتياطاً قبل الفجر.',
  },
];

// ─── Features ─────────────────────────────────────────────────────────────────
const features = [
  {
    icon: <Globe2 size={18} strokeWidth={1.75} />,
    q: 'اختيار تلقائي لأدق طريقة حساب لكل بلد',
    node: (
      <div className="space-y-2 text-secondary">
        <p>يحدد الموقع طريقة الحساب المناسبة للبلد تلقائياً من بين 12 طريقة:</p>
        <p className="text-xs text-muted leading-relaxed">
          أم القرى (SA) · الطريقة المصرية (EG/MA/DZ/TN) · كراتشي (PK/IN/BD/AF) ·
          رابطة العالم الإسلامي (JO/LB/FR/DE) · دبي (AE/OM/BH) · قطر · الكويت ·
          Diyanet تركيا (TR) · MUIS سنغافورة (SG/MY/ID) · ISNA (US/CA) ·
          لجنة رؤية الهلال (GB) · طهران (IR)
        </p>
        <p>النتيجة: مواقيت يومية واضحة، مع تنبيه أن جدول المسجد المحلي يبقى المرجع العملي إذا اختلفت الإعدادات.</p>
      </div>
    ),
  },
  {
    icon: <Compass size={18} strokeWidth={1.75} />,
    q: 'دعم المذاهب الأربعة — الشافعي والمالكي والحنبلي والحنفي',
    a: 'يُعرض وقت العصر وفق المذهب الصحيح لبلدك تلقائياً، مع مقارنة تفاعلية بين الشافعي والحنفي وشرح الفرق الفلكي والفقهي.',
  },
  {
    icon: <CalendarDays size={18} strokeWidth={1.75} />,
    q: 'تقويم شهري قابل للطباعة',
    a: 'جدول شهري كامل بمواقيت الصلاة يومياً مع تمييز يوم الجمعة واليوم الحالي، قابل للطباعة في وضع مُحسَّن.',
  },
  {
    icon: <Timer size={18} strokeWidth={1.75} />,
    q: 'عداد تنازلي ذكي للصلاة القادمة',
    a: 'عداد تنازلي دقيق مع حلقة تقدم بصرية تُحدَّث كل ثانية بدون إعادة تحميل الصفحة.',
  },
  {
    icon: <MapPin size={18} strokeWidth={1.75} />,
    q: 'يعمل لأكثر من 1000 مدينة حول العالم',
    a: 'اختر المدينة أولاً حتى تُحسب المواقيت من الإحداثيات والمنطقة الزمنية الصحيحة، لا من توقيت عام منقول من مدينة قريبة.',
  },
];

function PrayerLandingPopularLinksFallback() {
  return (
    <div className="space-y-6" aria-hidden="true">
      <section className={routeStyles.sectionPanel}>
        <div className="h-7 w-56 rounded-[var(--radius-md)] bg-[var(--bg-surface-2)] mb-3 animate-pulse" />
        <div className="h-4 w-full rounded-[var(--radius-md)] bg-[var(--bg-surface-2)] mb-2 animate-pulse" />
        <div className="h-4 w-4/5 rounded-[var(--radius-md)] bg-[var(--bg-surface-2)] mb-6 animate-pulse" />
        <div className={routeStyles.linkGrid}>
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={`popular-city-skeleton-${index}`}
              className="h-24 rounded-[var(--radius-lg)] bg-[var(--bg-surface-2)] animate-pulse"
            />
          ))}
        </div>
      </section>

      <section className={routeStyles.sectionPanel}>
        <div className="h-7 w-48 rounded-[var(--radius-md)] bg-[var(--bg-surface-2)] mb-3 animate-pulse" />
        <div className="h-4 w-3/4 rounded-[var(--radius-md)] bg-[var(--bg-surface-2)] mb-4 animate-pulse" />
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={`popular-country-skeleton-${index}`}
              className="h-10 w-40 rounded-[var(--radius-md)] bg-[var(--bg-surface-2)] animate-pulse"
            />
          ))}
        </div>
      </section>
    </div>
  );
}

function getCountryLinkLabel(label) {
  return String(label || '').replace(/^مواقيت الصلاة في\s+/u, '');
}

function PrayerNextSteps({ links }) {
  const safeLinks = Array.isArray(links)
    ? links.filter((link) => link?.href && link?.label).slice(0, 4)
    : [];

  if (safeLinks.length === 0) return null;

  return (
    <nav className={routeStyles.nextStepsLayout} aria-label="خطوات مفيدة بعد معرفة مواقيت الصلاة">
      <div className={routeStyles.sectionHead}>
        <h2 className={routeStyles.sectionTitle}>خطوتك التالية بعد معرفة موعد الصلاة</h2>
        <p className={routeStyles.sectionCopy}>
          لا تحتاج إلى قائمة طويلة. اختر المسار الأقرب لسؤالك الآن: الوقت الحالي، التاريخ الهجري،
          تحويل التاريخ، أو فرق التوقيت.
        </p>
      </div>
      <div className={routeStyles.nextStepList}>
        {safeLinks.map((link, index) => (
          <Link key={link.href} href={link.href} className={routeStyles.nextStepLink}>
            <span className={routeStyles.nextStepIndex}>{index + 1}</span>
            <span className={routeStyles.nextStepCopy}>
              <span className={routeStyles.nextStepTitle}>{link.label}</span>
              <span className={routeStyles.nextStepDescription}>{link.description}</span>
            </span>
            <span className={routeStyles.nextStepAction}>افتح</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}

async function PrayerLandingPopularLinks() {
  const [popularPrayerCityLinks, popularPrayerCountryLinks] = await Promise.all([
    getPopularPrayerCityLinks(),
    getPopularPrayerCountryLinks(),
  ]);
  const safePopularPrayerCityLinks = Array.isArray(popularPrayerCityLinks)
    ? popularPrayerCityLinks.filter((item) => item?.href && item?.label)
    : [];
  const safePopularPrayerCountryLinks = Array.isArray(popularPrayerCountryLinks)
    ? popularPrayerCountryLinks.filter((item) => item?.href && item?.label)
    : [];
  const featuredPrayerCityLinks = safePopularPrayerCityLinks.slice(0, 8);
  const secondaryPrayerCityLinks = safePopularPrayerCityLinks.slice(8, 24);
  const featuredPrayerCountryLinks = safePopularPrayerCountryLinks.slice(0, 12);
  const secondaryPrayerCountryLinks = safePopularPrayerCountryLinks.slice(12, 32);

  const cityItemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'صفحات مواقيت الصلاة الأكثر بحثاً',
    itemListElement: safePopularPrayerCityLinks.slice(0, 24).map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      url: `${BASE}${item.href}`,
    })),
  };

  const countryItemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'صفحات مواقيت الصلاة في الدول',
    itemListElement: safePopularPrayerCountryLinks.slice(0, 24).map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      url: `${BASE}${item.href}`,
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(cityItemListSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(countryItemListSchema) }} />

      <section className={`${routeStyles.sectionPanel} ${routeStyles.popularPathways}`} aria-labelledby="popular-prayer-city-links-heading">
        <div className={routeStyles.popularCompactLayout}>
          <div className={routeStyles.popularCompactIntro}>
            <span className={routeStyles.compactPathwaysKicker}>اختصارات بعد البحث</span>
            <h2 id="popular-prayer-city-links-heading" className={routeStyles.compactPathwaysTitle}>
              صفحات مواقيت الصلاة الأكثر بحثاً
            </h2>
            <p className={routeStyles.compactPathwaysCopy}>
              اختر مدينة مشهورة فقط إذا كانت وجهتك واضحة. غير ذلك، البحث في الأعلى أسرع وأدق.
            </p>
          </div>

          <div className={routeStyles.popularCompactBody}>
            <div className={routeStyles.featuredPrayerGrid} aria-label="مدن الصلاة الأكثر بحثاً">
              {featuredPrayerCityLinks.map((item, index) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={routeStyles.featuredPrayerCard}
                  title={item.description}
                >
                  <span className={routeStyles.featuredPrayerMeta}>{String(index + 1).padStart(2, '0')}</span>
                  <span className={routeStyles.linkLabel}>{item.label}</span>
                </Link>
              ))}
            </div>

            {secondaryPrayerCityLinks.length > 0 && (
              <details className={routeStyles.compactLinkDisclosure}>
                <summary>مدن أكثر</summary>
                <div className={routeStyles.compactCityGrid}>
                  {secondaryPrayerCityLinks.map((item) => (
                    <Link key={item.href} href={item.href} className={routeStyles.compactCityLink} title={item.description}>
                      {item.label}
                    </Link>
                  ))}
                </div>
              </details>
            )}
          </div>
        </div>

        <div className={routeStyles.countryCompactRail} aria-labelledby="popular-prayer-country-links-heading">
          <div className={routeStyles.countryCompactHead}>
            <span className={routeStyles.compactPathwaysKicker}>حسب الدولة</span>
            <h3 id="popular-prayer-country-links-heading" className={routeStyles.countryCompactTitle}>
              مواقيت الصلاة في الدول
            </h3>
          </div>
          <div className={routeStyles.countryFlagGrid}>
            {featuredPrayerCountryLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={routeStyles.countryFlagLink}
                title={item.description}
              >
                <span className={routeStyles.countryFlag} aria-hidden="true">
                  {getFlagEmoji(item.countryCode)}
                </span>
                <span>{getCountryLinkLabel(item.label)}</span>
              </Link>
            ))}
          </div>
          {secondaryPrayerCountryLinks.length > 0 && (
            <details className={routeStyles.compactLinkDisclosure}>
              <summary>دول أكثر</summary>
              <div className={routeStyles.compactCountryGrid}>
                {secondaryPrayerCountryLinks.map((item) => (
                  <Link key={item.href} href={item.href} className={routeStyles.compactCountryLink} title={item.description}>
                    {getCountryLinkLabel(item.label)}
                  </Link>
                ))}
              </div>
            </details>
          )}
        </div>
      </section>
    </>
  );
}

export default async function PrayerLandingPage() {
  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'مواقيت الصلاة اليوم في الدول والمدن',
    url: `${BASE}/mwaqit-al-salat`,
    description:
      'قسم مواقيت الصلاة في ميقاتنا يربط بين صفحات الدول والمدن مع مواقيت الفجر والظهر والعصر والمغرب والعشاء والصلاة القادمة والجداول الشهرية وطريقة الحساب.',
    inLanguage: 'ar',
  };
  const utilityLinks = appendToolDiscoveryLinks(PRIMARY_UTILITY_LINKS);

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type':    'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name:    f.q,
      acceptedAnswer: { '@type': 'Answer', text: typeof f.a === 'string' ? f.a : 'انظر الصفحة للتفاصيل.' },
    })),
  };

  const howToSchema = {
    '@context': 'https://schema.org',
    '@type':    'HowTo',
    name:       'كيفية معرفة مواقيت الصلاة لمدينتك',
    step: [
      { '@type': 'HowToStep', name: 'ابحث عن مدينتك',         text: 'اكتب اسم المدينة أو الدولة في خانة البحث.' },
      { '@type': 'HowToStep', name: 'اطلع على مواقيت اليوم',  text: 'يُعرض جدول مفصّل بالفجر والشروق والظهر والعصر والمغرب والعشاء.' },
      { '@type': 'HowToStep', name: 'اختر المذهب (اختياري)', text: 'حدد الشافعي أو الحنفي لرؤية وقت العصر وفق مذهبك.' },
      { '@type': 'HowToStep', name: 'اطبع أو شارك الإمساكية', text: 'انسخ الرابط أو اطبع الجدول الشهري مباشرةً.' },
    ],
  };

  return (
    <div className={`${routeStyles.prayerHubPage} min-h-screen bg-base text-primary`} dir="rtl" lang="ar">
      <AdLayoutWrapper layout="wide" sidebarMode="dual">
        <main className={routeStyles.pageMain}>

        {/* JSON-LD */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />

        <section className={`container mx-auto px-4 ${routeStyles.heroSection}`}>
          <div className={`${routeStyles.heroInner} ${routeStyles.heroCenter}`}>
            <div className={routeStyles.heroCopy}>
              <div className={routeStyles.metaPill}>
                <Clock size={13} />
                بحث مباشر في مواقيت الصلاة
              </div>
              <h1 className={routeStyles.heroTitle}>
                مواقيت الصلاة اليوم في مدينتك مع الصلاة القادمة
              </h1>
              <p className={routeStyles.heroLead}>
                اكتب اسم المدينة فقط. سنأخذك إلى صفحة تعرض مواقيت اليوم والصلاة القادمة
                والجدول الشهري وطريقة الحساب في مكان واحد.
              </p>
            </div>

            <div className={routeStyles.searchWrap}>
              <div className={`${routeStyles.sectionPanel} ${routeStyles.heroSearchPanel}`} aria-labelledby="prayer-search-title">
                <div className={routeStyles.searchPanelHeader}>
                  <span className={routeStyles.searchPanelKicker}>الخطوة الأولى</span>
                  <h2 id="prayer-search-title" className={routeStyles.searchPanelTitle}>
                    ابحث عن المدينة
                  </h2>
                </div>
                <div className={routeStyles.searchCommandShell}>
                  <SearchCityWrapper mode="prayer" />
                </div>
                <div className={routeStyles.searchSuggestionRow} aria-label="أمثلة بحث سريعة">
                  {['الرياض', 'القاهرة', 'دبي', 'الرباط', 'الكويت', 'الدوحة'].map((cityName) => (
                    <span key={cityName}>{cityName}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 pb-2">
          <AdTopBanner slotId="top-mwaqit" />
        </section>

        <section className={`container mx-auto px-4 ${routeStyles.sectionBand}`}>
          <Suspense fallback={<PrayerLandingPopularLinksFallback />}>
            <PrayerLandingPopularLinks />
          </Suspense>
        </section>

        <section className={`container mx-auto px-4 ${routeStyles.sectionBand}`} aria-label="أوقات مستحبة أخرى">
          <div className={routeStyles.sectionPanel}>
            <div className={routeStyles.sectionHead}>
              <h2 className={routeStyles.sectionTitle}>أوقات مستحبة أخرى، محسوبة حياً</h2>
              <p className={routeStyles.sectionCopy}>
                بالإضافة إلى الصلوات الخمس، نحسب لك أربعة أوقات يبحث عنها المسلمون يومياً وأسبوعياً وشهرياً — كل واحد له صفحة مخصصة وجدول لكل مدينة.
              </p>
            </div>
            <div className={routeStyles.contextGrid}>
              {[
                { href: '/mwaqit-al-salat/last-third-of-night', title: 'الثلث الأخير من الليل', body: 'ومنتصف الليل الشرعي — من المغرب إلى الفجر، أفضل وقت للتهجد.' },
                { href: '/mwaqit-al-salat/duha-prayer-time', title: 'وقت صلاة الضحى', body: 'من ارتفاع الشمس بعد الشروق حتى قبيل الظهر.' },
                { href: '/mwaqit-al-salat/friday-response-hour', title: 'ساعة الاستجابة', body: 'آخر ساعة قبل أذان المغرب كل يوم جمعة، على الرأي الراجح.' },
                { href: '/mwaqit-al-salat/white-days', title: 'أيام البيض', body: '13 و14 و15 من كل شهر هجري — صيام مستحب متكرر.' },
                { href: '/mwaqit-al-salat/prayer-times-calculation-method', title: 'كيف تُحسب المواقيت فلكياً؟', body: 'زوايا الفجر والعشاء وطول ظل العصر، مع مثال حي محسوب فعلياً.' },
              ].map((item) => (
                <Link key={item.href} href={item.href} className={routeStyles.contextCard}>
                  <h3 className={routeStyles.contextTitle}>{item.title}</h3>
                  <p className={routeStyles.contextBody}>{item.body}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className={`container mx-auto px-4 ${routeStyles.sectionBand}`} aria-label="مميزات الأداة">
          <div className={routeStyles.sectionPanel}>
            <div className={routeStyles.sectionHead}>
              <h2 className={routeStyles.sectionTitle}>ما الذي ستجده داخل الصفحة المحلية؟</h2>
              <p className={routeStyles.sectionCopy}>
                بعد الوصول إلى صفحة المدينة ستظهر لك الإجابة اليومية أولاً، ثم الجدول الكامل،
                ثم الفرق بين المذاهب، ثم المسار الشهري والخطوات القريبة.
              </p>
            </div>
            <FAQAccordions items={features} />
          </div>
        </section>

        <section className={`container mx-auto px-4 ${routeStyles.sectionBand}`} aria-label="كيف تعتمد على مواقيت الصلاة">
          <div className={routeStyles.sectionPanel}>
            <div className={routeStyles.sectionHead}>
              <h2 className={routeStyles.sectionTitle}>كيف تعتمد على المواقيت بدون ارتباك؟</h2>
              <p className={routeStyles.sectionCopy}>
                مواقيت الصلاة ليست رقماً عاماً للدولة كلها. المدينة، طريقة الحساب، المذهب في العصر، والتوقيت الصيفي كلها قد تغيّر النتيجة.
              </p>
            </div>
            <div className={`${routeStyles.contextGrid} ${routeStyles.decisionList}`}>
              {PRAYER_DECISION_CARDS.map((item) => (
                <article key={item.title} className={routeStyles.contextCard}>
                  <h3 className={routeStyles.contextTitle}>{item.title}</h3>
                  <p className={routeStyles.contextBody}>{item.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4">
          <AdInArticle slotId="mid-mwaqit-1" />
        </section>

        <section className={`container mx-auto px-4 ${routeStyles.sectionBand}`} aria-label="الفرق بين المذاهب في وقت العصر">
          <div className={routeStyles.sectionPanel}>
            <div className={routeStyles.sectionHead}>
              <h2 className={routeStyles.sectionTitle}>الفرق بين المذاهب في وقت العصر</h2>
              <p className={routeStyles.sectionCopy}>
                المذاهب الأربعة متفقة في جميع الصلوات، والفرق العملي الأوضح يظهر في وقت العصر فقط.
              </p>
            </div>
            <div className={routeStyles.tableWrap}>
              <table className={routeStyles.table}>
                <thead>
                  <tr className={routeStyles.tableHeadRow}>
                    <th className={routeStyles.tableHeader}>المذهب</th>
                    <th className={routeStyles.tableHeader}>قاعدة ظل العصر</th>
                    <th className={routeStyles.tableHeader}>الدول المعتمِدة</th>
                    <th className={routeStyles.tableHeader}>وقت العصر</th>
                  </tr>
                </thead>
                <tbody>
                {[
                  { name: 'الشافعي',  rule: '× 1', countries: 'مصر، سوريا، الأردن، ماليزيا، إندونيسيا، اليمن', timing: 'أبكر', timingClass: 'text-success' },
                  { name: 'المالكي',  rule: '× 1', countries: 'المغرب، الجزائر، تونس، ليبيا، غرب أفريقيا',      timing: 'أبكر (= الشافعي)', timingClass: 'text-success' },
                  { name: 'الحنبلي',  rule: '× 1', countries: 'السعودية، قطر، الكويت',                           timing: 'أبكر (= الشافعي)', timingClass: 'text-success' },
                  { name: 'الحنفي',   rule: '× 2', countries: 'تركيا، باكستان، الهند، بنغلاديش، العراق',         timing: 'متأخر 45–90 دق',  timingClass: 'text-warning' },
                ].map((row) => (
                  <tr key={row.name} className={routeStyles.tableRow}>
                    <td className={`${routeStyles.tableCell} text-accent-alt font-semibold`}>{row.name}</td>
                    <td className={`${routeStyles.tableCell} text-muted tabular-nums font-mono`}>{row.rule}</td>
                    <td className={routeStyles.tableCell}>{row.countries}</td>
                    <td className={`${routeStyles.tableCell} font-semibold ${row.timingClass}`}>{row.timing}</td>
                  </tr>
                ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className={`container mx-auto px-4 ${routeStyles.sectionBand}`} aria-label="طرق الحساب المدعومة">
          <div className={routeStyles.sectionPanel}>
            <div className={routeStyles.sectionHead}>
              <h2 className={routeStyles.sectionTitle}>طرق الحساب الـ12 المدعومة</h2>
              <p className={routeStyles.sectionCopy}>
                لكل بلد جهة دينية أو تقويم معتمد يحدد زوايا الفجر والعشاء. هذه الصفحة توضح الفروق
                حتى تفهم لماذا قد تتغير القراءة من بلد إلى آخر.
              </p>
            </div>
            <div className={routeStyles.tableWrap}>
              <table className={routeStyles.table}>
                <thead>
                  <tr className={routeStyles.tableHeadRow}>
                    <th className={routeStyles.tableHeader}>الطريقة</th>
                    <th className={routeStyles.tableHeader}>المنطقة</th>
                    <th className={routeStyles.tableHeader}>زاوية الفجر</th>
                    <th className={routeStyles.tableHeader}>زاوية العشاء</th>
                  </tr>
                </thead>
                <tbody>
                {METHODS_TABLE.map((row) => (
                  <tr key={row.code} className={routeStyles.tableRow}>
                    <td className={`${routeStyles.tableCell} text-accent-alt font-semibold whitespace-nowrap`}>{row.method}</td>
                    <td className={routeStyles.tableCell}>{row.region}</td>
                    <td className={`${routeStyles.tableCell} text-muted tabular-nums font-mono`}>{row.fajr}</td>
                    <td className={`${routeStyles.tableCell} text-muted tabular-nums font-mono`}>{row.isha}</td>
                  </tr>
                ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className={`container mx-auto px-4 ${routeStyles.sectionBand}`}>
          <div className={routeStyles.sectionPanel}>
            <div className={routeStyles.proseBlock}>
              <h2>كيف تُحسب أوقات الصلاة فلكياً؟</h2>
              <p>
                يعتمد الحساب على موضع الشمس بالنسبة إلى الأفق مع مراعاة إحداثيات المدينة وارتفاعها
                والانكسار الجوي. لهذا لا يكفي نقل وقت من مدينة أخرى حتى لو كانت داخل الدولة نفسها.
              </p>
              <ul className="space-y-1.5 list-disc ps-5">
                <li><span className="font-semibold text-primary">الفجر:</span> حين تصل الشمس لزاوية محددة تحت الأفق (15°–20° حسب الطريقة).</li>
                <li><span className="font-semibold text-primary">الشروق والمغرب:</span> عند ملامسة قرص الشمس للأفق مع تصحيح الانكسار الجوي.</li>
                <li><span className="font-semibold text-primary">الظهر:</span> لحظة تعامد الشمس على المدينة، وهو متطابق بين جميع المذاهب.</li>
                <li><span className="font-semibold text-primary">العصر:</span> طول الظل ×1 أو ×2 بحسب المذهب الفقهي المعتمد.</li>
                <li><span className="font-semibold text-primary">العشاء:</span> اختفاء الشفقة الحمراء أو وقت ثابت بعد المغرب حسب الطريقة.</li>
              </ul>
            </div>
          </div>
        </section>

        <section className={`container mx-auto px-4 ${routeStyles.sectionBand}`} aria-label="مصادر فهم مواقيت الصلاة">
          <div className={routeStyles.sectionPanel}>
            <div className={routeStyles.sectionHead}>
              <h2 className={routeStyles.sectionTitle}>مصادر تساعدك على فهم الحساب</h2>
              <p className={routeStyles.sectionCopy}>
                هذه روابط تفسيرية لفهم طريقة الحساب والزوايا والمذهب. لا يتم جلبها أثناء عرض الصفحة، لكنها تشرح لماذا قد تختلف المواقيت بين مدينة وأخرى أو بين تطبيقين.
              </p>
            </div>
            <div className={routeStyles.linkGrid}>
              {PRAYER_SOURCE_LINKS.map((source) => (
                <a
                  key={source.href}
                  href={source.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={routeStyles.linkCard}
                >
                  <span className={routeStyles.linkLabel}>{source.label}</span>
                  <span className={routeStyles.linkDescription}>{source.description}</span>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className={`container mx-auto px-4 ${routeStyles.sectionBand}`} aria-label="أسئلة قبل الاعتماد على مواقيت الصلاة">
          <div className={routeStyles.sectionPanel}>
            <h2 className={`${routeStyles.sectionTitle} mb-6 text-center`}>أسئلة قبل الاعتماد على مواقيت الصلاة</h2>
            <FAQAccordions items={faqs} />
          </div>
        </section>

        <section className={`container mx-auto px-4 ${routeStyles.sectionBand}`}>
          <div className={routeStyles.sectionPanel}>
            <PrayerNextSteps links={utilityLinks} />
          </div>
        </section>
          <section className="container mx-auto px-4 pb-20">
            <AdMultiplex slotId="end-mwaqit-hub" />
          </section>
        </main>
      </AdLayoutWrapper>
    </div>
  );
}
