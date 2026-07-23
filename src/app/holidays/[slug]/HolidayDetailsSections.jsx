import { Suspense } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  Gift,
  Landmark,
  MessageCircle,
  Moon,
  PackageCheck,
  Sparkles,
} from 'lucide-react';
import AdInArticle from '@/components/ads/AdInArticle';
import AdMultiplex from '@/components/ads/AdMultiplex';
import ReviewMeta from '@/components/site/ReviewMeta';
import SourcesPanel from '@/components/site/SourcesPanel';
import HistoricalTable from './HistoricalTable';
import NextEventCard from './NextEventCard';
import RelatedEvents from './RelatedEvents';
import HolidayInternalLinks from './HolidayInternalLinks';
import styles from '../HolidaysV4.module.css';
import { getAffiliateLink } from '@/lib/affiliate-config';
import { getSiteUrl } from '@/lib/site-config';
import EmbedCodeSnippet from '@/components/shared/EmbedCodeSnippet.client';

const CATEGORY_CALCULATORS = {
  islamic: [
    { href: '/calculators/zakat',       label: 'حاسبة الزكاة',        desc: 'احسب زكاة مالك ووفق النصاب الشرعي',  accent: 'var(--amber)' },
    { href: '/calculators/fasting',     label: 'حاسبة الصيام',        desc: 'مواعيد الإمساك والإفطار وعدد الساعات', accent: 'var(--accent)' },
    { href: '/calculators/inheritance', label: 'حاسبة الميراث',       desc: 'توزيع التركة وفق الشريعة الإسلامية',   accent: 'var(--text-secondary)' },
  ],
  national: [
    { href: '/calculators/net-salary',           label: 'صافي الراتب',        desc: 'الراتب بعد خصم الضرائب والاشتراكات', accent: 'var(--green)' },
    { href: '/calculators/vat',                  label: 'حاسبة الضريبة',       desc: 'احسب ضريبة القيمة المضافة بسرعة',     accent: 'var(--blue)' },
    { href: '/calculators/uae-end-of-service',      label: 'نهاية خدمة الإمارات',  desc: 'مكافأة الإمارات: 21 و30 يوماً',         accent: 'var(--accent-alt)' },
  ],
  support: [
    { href: '/calculators/salary',               label: 'حاسبة الراتب',        desc: 'حوّل راتبك الشهري إلى يومي وساعي',    accent: 'var(--green)' },
    { href: '/calculators/net-salary',           label: 'صافي الراتب',         desc: 'الراتب بعد الاستقطاعات',               accent: 'var(--accent)' },
    { href: '/calculators/gosi-retirement',      label: 'التقاعد المبكر GOSI', desc: 'متى يحق لك التقاعد وكم معاشك؟',        accent: 'var(--calc-cat-finance)' },
    { href: '/calculators/sick-leave',           label: 'الإجازة المرضية',    desc: 'راتبك أثناء المرض وفق المادة 117',      accent: 'var(--amber)' },
    { href: '/calculators/eos-qatar',            label: 'نهاية الخدمة قطر',   desc: 'الاستقالة لا تنقص مكافأتك في قطر',    accent: 'var(--blue)' },
    { href: '/calculators/eos-kuwait',           label: 'نهاية الخدمة الكويت',   desc: 'مكافأتك وفق قانون العمل 6/2010',        accent: 'var(--blue)' },
    { href: '/calculators/eos-bahrain',          label: 'نهاية الخدمة البحرين',  desc: 'نصف شهر ثم شهر كامل — قانون 36/2012',   accent: 'var(--blue)' },
    { href: '/calculators/eos-egypt',            label: 'نهاية الخدمة مصر',      desc: 'شهر ثم شهر ونصف — قانون 12/2003',       accent: 'var(--green)' },
    { href: '/calculators/egypt-income-tax',     label: 'ضريبة الدخل مصر',       desc: 'شرائح 2023 + تأمينات 11% — صافي الراتب', accent: 'var(--blue)' },
    { href: '/calculators/egypt-social-insurance', label: 'تأمينات اجتماعية مصر',  desc: 'حصة الموظف 11% وحد الأجر المؤمَّن',      accent: 'var(--amber)' },
    { href: '/calculators/eos-jordan',           label: 'نهاية الخدمة الأردن',   desc: '30 يوماً/سنة — قانون العمل 8/1996',       accent: 'var(--green)' },
    { href: '/calculators/jordan-income-tax',    label: 'ضريبة الدخل الأردن',    desc: 'شرائح 5%–30% + إعفاءات — صافي الراتب',    accent: 'var(--blue)' },
    { href: '/calculators/morocco-net-salary',   label: 'الراتب الصافي المغرب',  desc: 'CNSS 7.26% + ضريبة IR التصاعدية',         accent: 'var(--red)' },
    { href: '/calculators/uae-corporate-tax',   label: 'ضريبة شركات الإمارات',  desc: '0% حتى 375K درهم — 9% على الزائد',        accent: 'var(--green)' },
    { href: '/calculators/bill-splitter',       label: 'تقسيم الفاتورة',         desc: 'مطعم، رحلة، مشتريات — قسّم بالتساوي',     accent: 'var(--amber)' },
    { href: '/calculators/work-hours',          label: 'ساعات العمل الأسبوعية', desc: 'دوامك اليومي + الإضافي — يُحفظ تلقائياً',   accent: 'var(--blue)' },
  ],
  school: [
    { href: '/calculators/gpa',           label: 'المعدل التراكمي',    desc: 'احسب GPA بدقة وفق جدول درجاتك',     accent: 'var(--blue)' },
    { href: '/calculators/gpa-to-percent', label: 'تحويل المعدل',      desc: 'حوّل GPA إلى نسبة مئوية',            accent: 'var(--accent)' },
    { href: '/calculators/weighted-grade', label: 'الدرجة النهائية بالأوزان', desc: 'كم تحتاج في الاختبار النهائي؟', accent: 'var(--blue)' },
    { href: '/calculators/annual-leave',  label: 'حاسبة الإجازات',    desc: 'أيام إجازتك المستحقة قانونياً',      accent: 'var(--green)' },
    { href: '/calculators/saudi-school-calendar', label: 'التقويم الدراسي السعودي', desc: 'بداية الدراسة وكل الإجازات 1448', accent: 'var(--calc-cat-education)' },
  ],
  social: [
    { href: '/calculators/pregnancy', label: 'حاسبة الحمل',    desc: 'موعد الولادة وأسبوع الحمل بدقة',   accent: 'var(--blue)' },
    { href: '/calculators/ovulation', label: 'حاسبة التبويض',  desc: 'أيام الخصوبة في دورتك',             accent: 'var(--accent)' },
    { href: '/calculators/bmi',       label: 'مؤشر كتلة الجسم', desc: 'تقييم وزنك الصحي بالمعايير الدولية', accent: 'var(--green)' },
  ],
  business: [
    { href: '/calculators/vat',                label: 'حاسبة الضريبة',      desc: 'احسب VAT للبيع والشراء والفواتير',  accent: 'var(--blue)' },
    { href: '/calculators/car-loan',           label: 'تمويل السيارة',       desc: 'قسط السيارة: تقليدي أم مرابحة إسلامية؟', accent: 'var(--calc-cat-finance)' },
    { href: '/calculators/investment',         label: 'حاسبة الاستثمار',    desc: 'نمو رأس المال مع الفائدة المركبة',   accent: 'var(--green)' },
    { href: '/calculators/working-days',       label: 'أيام العمل بين تاريخين', desc: 'عطلة نهاية الأسبوع الصحيحة لكل دولة', accent: 'var(--blue)' },
    { href: '/calculators/margin-markup',      label: 'هامش الربح والزيادة', desc: 'Margin و Markup بالاتجاهين',        accent: 'var(--green)' },
  ],
  astronomy: [
    { href: '/calculators/fasting',   label: 'حاسبة الصيام',   desc: 'ساعات الصيام في أي مدينة وشهر',     accent: 'var(--accent)' },
    { href: '/calculators/zakat',     label: 'حاسبة الزكاة',   desc: 'احسب زكاة مالك وفق النصاب',         accent: 'var(--amber)' },
    { href: '/calculators/pregnancy', label: 'حاسبة الحمل',    desc: 'موعد الولادة بالتقويمين',            accent: 'var(--blue)' },
  ],
  holidays: [
    { href: '/calculators/percentage',          label: 'حاسبة النسبة والخصم', desc: 'احسب نسبة الخصم والسعر النهائي في عروض المناسبة', accent: 'var(--blue)' },
    { href: '/calculators/bill-splitter',        label: 'تقسيم الفاتورة',      desc: 'قسّم فاتورة التجمع أو المناسبة بالتساوي',          accent: 'var(--amber)' },
    { href: '/calculators/monthly-installment',  label: 'حاسبة القسط الشهري', desc: 'احسب قسط مشترياتك من عروض المناسبة',              accent: 'var(--green)' },
  ],
};

const COUNTRY_EOS_LINK = {
  eg: { href: '/calculators/eos-egypt',   label: 'نهاية الخدمة مصر',      desc: 'شهر ثم شهر ونصف — قانون 12/2003',        accent: 'var(--green)' },
  jo: { href: '/calculators/eos-jordan',  label: 'نهاية الخدمة الأردن',   desc: '30 يوماً/سنة — قانون العمل 8/1996',       accent: 'var(--green)' },
  kw: { href: '/calculators/eos-kuwait',  label: 'نهاية الخدمة الكويت',   desc: 'مكافأتك وفق قانون العمل 6/2010',          accent: 'var(--blue)' },
  bh: { href: '/calculators/eos-bahrain', label: 'نهاية الخدمة البحرين',  desc: 'نصف شهر ثم شهر كامل — قانون 36/2012',     accent: 'var(--blue)' },
  qa: { href: '/calculators/eos-qatar',   label: 'نهاية الخدمة قطر',      desc: 'الاستقالة لا تنقص مكافأتك في قطر',       accent: 'var(--blue)' },
  sa: { href: '/calculators/end-of-service-benefits', label: 'نهاية الخدمة السعودية', desc: 'مكافأة الاستقالة والفصل وفق نظام العمل', accent: 'var(--blue)' },
  ae: { href: '/calculators/uae-end-of-service', label: 'نهاية خدمة الإمارات', desc: 'مكافأة الإمارات: 21 و30 يوماً',       accent: 'var(--accent-alt)' },
};
const EOS_LINKED_CATEGORIES = new Set(['business', 'social', 'support']);

function RelatedCalculatorsWidget({ categoryId, countryCode }) {
  const baseCalcs = CATEGORY_CALCULATORS[categoryId];
  const eosLink = countryCode && EOS_LINKED_CATEGORIES.has(categoryId) ? COUNTRY_EOS_LINK[countryCode] : null;
  const calcs = eosLink
    ? [eosLink, ...(baseCalcs || [])].filter((item, index, arr) => arr.findIndex((i) => i.href === item.href) === index)
    : baseCalcs;
  if (!calcs?.length) return null;

  return (
    <section style={{ marginTop: 'var(--space-10)', marginBottom: 'var(--space-2)' }} aria-labelledby="related-calcs-h">
      <h2
        id="related-calcs-h"
        style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)', marginBottom: 'var(--space-1)' }}
      >
        أدوات ذات صلة
      </h2>
      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginBottom: 'var(--space-4)' }}>
        حاسبات مجانية مرتبطة بهذه المناسبة
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(140px, 100%), 1fr))', gap: 'var(--space-3)' }}>
        {calcs.map(({ href, label, desc, accent }) => (
          <Link
            key={href}
            href={href}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-1)',
              padding: 'var(--space-3) var(--space-4)',
              background: 'var(--bg-surface-2)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              textDecoration: 'none',
              transition: 'border-color 0.15s',
            }}
          >
            <span style={{ width: 28, height: 28, borderRadius: 'var(--radius-sm)', background: `color-mix(in srgb, ${accent} 12%, transparent)`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'var(--space-1)' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M9 7H6a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-3" /><path d="M18 2h4v4" /><path d="m14 10 7-7" />
              </svg>
            </span>
            <strong style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', color: 'var(--text-primary)', lineHeight: 'var(--leading-snug)' }}>
              {label}
            </strong>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', lineHeight: 'var(--leading-snug)' }}>
              {desc}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

// Shown only on salary-day-* pages, and only once a real link is configured —
// see docs/high-value-tools-tracker.md ("Track A extension") and
// src/lib/affiliate-config.js. An empty link means this renders nothing.
function RemittanceCallout({ slug }) {
  const link = getAffiliateLink('remittance');
  if (!link || !slug?.startsWith('salary-day-')) return null;

  return (
    <section
      style={{
        marginTop: 'var(--space-8)',
        padding: 'var(--space-4) var(--space-5)',
        background: 'var(--bg-surface-2)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-3)',
      }}
      aria-labelledby="remittance-callout-h"
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
        <span
          style={{
            width: 36,
            height: 36,
            flexShrink: 0,
            borderRadius: 'var(--radius-full)',
            background: 'var(--green-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          aria-hidden="true"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--green-text)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 1l4 4-4 4" /><path d="M3 11V9a4 4 0 0 1 4-4h14" /><path d="M7 23l-4-4 4-4" /><path d="M21 13v2a4 4 0 0 1-4 4H3" />
          </svg>
        </span>
        <h2 id="remittance-callout-h" style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)', margin: 0 }}>
          وصل راتبك؟
        </h2>
      </div>
      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 'var(--leading-relaxed)', margin: 0 }}>
        إذا كنت تخطط لتحويل جزء من راتبك لعائلتك، قارن الرسوم وسعر الصرف قبل الإرسال — الفرق بين مزود
        وآخر قد يصل لعشرات الريالات في نفس الحوالة.
      </p>
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer sponsored"
        style={{
          alignSelf: 'flex-start',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 'var(--space-1)',
          fontSize: 'var(--text-sm)',
          fontWeight: 'var(--font-semibold)',
          color: 'var(--green-text)',
          textDecoration: 'none',
        }}
      >
        قارن طرق التحويل
        <ArrowLeft size={14} aria-hidden="true" />
      </a>
    </section>
  );
}

// Only the small, curated set also registered in
// `src/app/embed/countdown/[slug]/page.jsx` (EMBEDDABLE_COUNTDOWNS) gets this
// block — keep both lists in sync.
const EMBEDDABLE_COUNTDOWN_SLUGS = new Set(['ramadan', 'eid-al-fitr', 'eid-al-adha']);

function CountdownEmbedCallout({ slug, eventName }) {
  if (!EMBEDDABLE_COUNTDOWN_SLUGS.has(slug)) return null;

  return (
    <section style={{ marginTop: 'var(--space-8)' }} aria-labelledby="countdown-embed-h">
      <h2 id="countdown-embed-h" style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)', marginBottom: 'var(--space-3)' }}>
        شارك عداد {eventName} على موقعك
      </h2>
      <EmbedCodeSnippet
        embedUrl={`${getSiteUrl()}/embed/countdown/${slug}`}
        title={`عداد ${eventName}`}
        hint={`هل تدير موقعاً أو منتدى؟ أضف عداد ${eventName} إليه مجاناً بنسخ الكود التالي:`}
        width={340}
        height={220}
      />
    </section>
  );
}

const INTENT_ICON_BY_VALUE = {
  '\u{1F319}': Moon,
  '\u263D': Moon,
  '\u{1F54C}': Landmark,
  '\u{1F6D2}': PackageCheck,
  '\u{1F48C}': MessageCircle,
  '\u{1F5D3}\uFE0F': CalendarDays,
  '\u{1F4C5}': CalendarDays,
  '\u{1F389}': Gift,
  '\u{1F4DA}': BookOpen,
};

function resolveIntentIcon(card) {
  const iconValue = typeof card?.icon === 'string' ? card.icon : '';
  if (INTENT_ICON_BY_VALUE[iconValue]) return INTENT_ICON_BY_VALUE[iconValue];

  const searchable = `${card?.title || ''} ${card?.description || ''}`;
  if (/روح|رمضان|هجري|عبادة|دعاء|إسلام/i.test(searchable)) return Moon;
  if (/شراء|تجهيز|احتياج|ميزانية|دفع|راتب|معاش/i.test(searchable)) return PackageCheck;
  if (/رسائل|تهاني|مشاركة|تهنئة/i.test(searchable)) return MessageCircle;
  if (/خطة|موعد|تاريخ|أيام|تقويم/i.test(searchable)) return CalendarDays;
  if (/مدرس|تعليم|اختبار|نتائج/i.test(searchable)) return BookOpen;
  return Sparkles;
}

function getIntentCtaText(card) {
  const text = typeof card?.ctaText === 'string' ? card.ctaText.trim() : '';
  if (!text || text === 'المزيد') return 'افتح الخطوة';
  return text;
}

function IntentLink({ href, children, style }) {
  const safeHref = typeof href === 'string' && href.trim() ? href : '/holidays';
  const defaultStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 'var(--space-1)',
    color: 'var(--accent)',
    fontSize: 'var(--text-sm)',
    fontWeight: 'var(--font-semibold)',
    textDecoration: 'none',
    marginTop: 'var(--space-1)',
  };
  const linkStyle = style || defaultStyle;

  if (safeHref.startsWith('/')) {
    return (
      <Link href={safeHref} style={linkStyle}>
        {children}
      </Link>
    );
  }

  return (
    <a href={safeHref} style={linkStyle}>
      {children}
    </a>
  );
}

function QuickFactsTable({ facts }) {
  if (!facts?.length) return null;

  return (
    <dl style={{ margin: 0 }}>
      {facts.map((f, i) => (
        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 'var(--space-4)', paddingBlock: 'var(--space-3)', borderBottom: i < facts.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
          <dt style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', fontWeight: 'var(--font-medium)', flexShrink: 0 }}>{f.label}</dt>
          <dd style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)', fontWeight: 'var(--font-semibold)', margin: 0, textAlign: 'start' }}>{f.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export default function HolidayDetailsSections({
  slug,
  event,
  seo,
  pageModel,
  hijriYearNum,
  currentYear,
  countryDatesSlot,
}) {
  const meta = pageModel?.meta || {};
  const sections = pageModel?.sections || {};
  const quickFacts = Array.isArray(sections.quickFacts) ? sections.quickFacts : [];
  const intentCards = Array.isArray(sections.intentCards) ? sections.intentCards.slice(0, 3) : [];
  const about = sections.about || {};
  const aboutItems = Array.isArray(about.items) ? about.items : [];
  const aboutNotes = Array.isArray(about.notes) ? about.notes : [];
  const recurringYears = sections.recurringYears || null;
  const engagement = Array.isArray(sections.engagement) ? sections.engagement.slice(0, 2) : [];
  const faq = Array.isArray(sections.faq) ? sections.faq : [];
  const sources = Array.isArray(sections.sources) ? sections.sources : [];
  const relatedSlugs = Array.isArray(sections.relatedSlugs) ? sections.relatedSlugs : [];
  const displayTitle = meta.displayTitle || event.name;
  const hasAboutContent = aboutItems.length > 0 || aboutNotes.length > 0;
  const intentHeading = meta.intentHeading || `خطوات مفيدة قبل ${displayTitle}`;

  const sourcePanelItems = sources
    .filter((s) => s.url || s.href)
    .map((s) => ({ label: s.label, href: s.url || s.href, description: s.description }));

  return (
    <>
      {quickFacts.length > 0 && (
        <section style={{ marginBottom: 'var(--space-8)' }}>
          <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)', marginBottom: 'var(--space-4)' }}>
            حقائق سريعة قبل الاعتماد على موعد {displayTitle}
          </h2>
          <QuickFactsTable facts={quickFacts} />
        </section>
      )}

      {intentCards.length > 0 && (
        <section style={{ marginBottom: 'var(--space-8)' }} aria-label="أبرز الإجراءات">
          <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)', marginBottom: 'var(--space-5)' }}>
            {intentHeading}
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(180px, 100%), 1fr))', gap: 'var(--space-3)' }}>
            {intentCards.map((card, i) => {
              const Icon = resolveIntentIcon(card);
              const safeHref = typeof card.ctaHref === 'string' && card.ctaHref.trim() ? card.ctaHref : '/holidays';
              const isExternal = !safeHref.startsWith('/');

              return (
                <article key={i} style={{ position: 'relative' }}>
                  <IntentLink href={safeHref}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 'var(--space-3)',
                      padding: 'var(--space-4)',
                      background: 'var(--bg-surface-2)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-lg)',
                      textDecoration: 'none',
                      height: '100%',
                      boxSizing: 'border-box',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, borderRadius: 'var(--radius-md)', color: 'var(--accent)', background: 'var(--accent-soft)', flexShrink: 0 }}>
                        <Icon size={18} strokeWidth={1.75} aria-hidden="true" />
                      </span>
                      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--accent-alt)', fontWeight: 700, letterSpacing: '0.04em' }}>{i + 1}/{intentCards.length}</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)', flexGrow: 1 }}>
                      <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', color: 'var(--text-primary)', margin: 0, lineHeight: 'var(--leading-snug)' }}>{card.title}</h3>
                      <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', lineHeight: 'var(--leading-relaxed)', margin: 0 }}>{card.description}</p>
                    </div>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-1)', fontSize: 'var(--text-xs)', color: 'var(--accent)', fontWeight: 'var(--font-semibold)' }}>
                      {getIntentCtaText(card)}
                      <ArrowLeft size={12} aria-hidden="true" />
                    </span>
                  </IntentLink>
                </article>
              );
            })}
          </div>
        </section>
      )}

      {hasAboutContent ? (
        <section className={styles.aboutSection} aria-labelledby="holiday-about-heading">
          <div className={styles.sectionHead}>
            <h2 id="holiday-about-heading" className={styles.sectionTitle}>
              {about.heading || `ما الذي يعنيه موعد ${displayTitle}؟`}
            </h2>
            <p className={styles.sectionLead}>
              هذا الجزء يضع الموعد في سياقه: لماذا يهم، كيف يقرأه الناس عملياً، ومتى تحتاج التأكد من جهة رسمية قبل اتخاذ قرار.
            </p>
          </div>

          {aboutItems.length > 0 ? (
            <div className={styles.aboutBody}>
              {aboutItems.map((item, i) => (
                <article key={i} className={styles.aboutItem}>
                  <h3 className={styles.aboutItemTitle}>{item.heading}</h3>
                  <p className={styles.aboutItemCopy}>{item.content}</p>
                </article>
              ))}
            </div>
          ) : null}
          {aboutNotes.length > 0 ? (
            <div className={styles.methodNotes}>
              {aboutNotes.map((note) => (
                <p key={note.id}>
                  {note.kind === 'link' ? (
                    <>
                      {note.label}:{' '}
                      <a href={note.href} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-link)' }}>
                        {note.text}
                      </a>
                    </>
                  ) : note.text}
                </p>
              ))}
            </div>
          ) : null}
        </section>
      ) : null}

      {countryDatesSlot}
      <HistoricalTable event={event} hijriYear={hijriYearNum} currentYear={currentYear} />

      {recurringYears && (
        <section style={{ marginTop: 'var(--space-8)' }} aria-labelledby="recurring-h">
          <h2 id="recurring-h" style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)', marginBottom: 'var(--space-4)' }}>
            مواعيد السنوات: {displayTitle}
          </h2>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 'var(--leading-relaxed)', marginBottom: 'var(--space-4)' }}>
            {recurringYears.contextParagraph}
          </p>
          {recurringYears.sourceNote && (
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', fontStyle: 'italic' }}>
              {recurringYears.sourceNote}
            </p>
          )}
        </section>
      )}

      {engagement.length > 0 && (
        <section style={{ marginTop: 'var(--space-10)' }} aria-labelledby="engagement-h">
          <h2 id="engagement-h" style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)', marginBottom: 'var(--space-5)' }}>
            تفاصيل صغيرة تغيّر طريقة التخطيط لـ {displayTitle}
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {engagement.map((item, index) => (
              <article
                key={`${item.type}-${index}`}
                style={{
                  paddingBlock: 'var(--space-4)',
                  paddingInline: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--space-1)',
                  borderBottom: index < engagement.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                }}
              >
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--accent-alt)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {item.subcategory || item.type}
                </span>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 'var(--leading-relaxed)', margin: 0 }}>
                  {item.text}
                </p>
              </article>
            ))}
          </div>
        </section>
      )}

      <RelatedCalculatorsWidget categoryId={event.category} countryCode={event._countryCode} />

      <RemittanceCallout slug={slug} />

      <CountdownEmbedCallout slug={slug} eventName={displayTitle} />

      {faq.length > 0 && (
        <section style={{ marginTop: 'var(--space-10)' }} aria-labelledby="faq-h">
          <h2 id="faq-h" style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)', marginBottom: 'var(--space-5)' }}>
            أسئلة قبل الاعتماد على موعد {displayTitle}
          </h2>
          <div className={styles.faqList}>
            {faq.map((faqItem, i) => {
              return (
              <details key={i} className={styles.faqItem} open={i === 0 ? true : undefined}>
                <summary className={styles.faqSummary}>
                  <span>{faqItem.question}</span>
                  <span aria-hidden style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xl)', marginRight: 'var(--space-2)', flexShrink: 0 }}>+</span>
                </summary>
                <p className={styles.faqAnswer}>
                  {faqItem.answer}
                </p>
              </details>
              );
            })}
          </div>
        </section>
      )}

      <AdInArticle slotId={`mid-holiday-${slug}-2`} />

      <HolidayInternalLinks
        event={event}
        displayTitle={displayTitle}
        currentYear={currentYear}
        hijriYearNum={hijriYearNum}
      />

      <ReviewMeta authorId="badr" reviewedAt="2026-01-01" />

      {sourcePanelItems.length > 0 && (
        <SourcesPanel sources={sourcePanelItems} />
      )}

      <Suspense fallback={null}>
        <NextEventCard currentSlug={slug} />
      </Suspense>

      <AdMultiplex slotId={`end-holiday-${slug}`} />

      <Suspense fallback={
        <div style={{ marginTop: 'var(--space-12)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(220px,100%),1fr))', gap: 'var(--space-3)' }}>
          {[1, 2, 3, 4].map(i => <div key={i} className="alarm-item" style={{ height: '80px', opacity: 0.4 }} />)}
        </div>
      }>
        <RelatedEvents currentSlug={slug} relatedSlugs={relatedSlugs} />
      </Suspense>

      <div className={styles.finalCta}>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>
          انتقل إلى فهرس المناسبات إذا كنت تقارن أكثر من موعد أو تخطط لشهر كامل.
        </p>
        <Link
          href="/holidays"
          className="btn"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            padding: 'var(--space-3) var(--space-8)',
            background: 'var(--accent)',
            color: 'var(--text-on-accent)',
            borderRadius: 'var(--radius-md)',
            fontWeight: 'var(--font-semibold)',
            fontSize: 'var(--text-base)',
            textDecoration: 'none',
          }}
        >
          <ArrowLeft size={18} aria-hidden="true" />
          كل المناسبات
        </Link>
      </div>
    </>
  );
}
