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
import HistoricalTable from './HistoricalTable';
import NextEventCard from './NextEventCard';
import RelatedEvents from './RelatedEvents';
import HolidayInternalLinks from './HolidayInternalLinks';
import styles from '../HolidaysV4.module.css';

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

function IntentLink({ href, children }) {
  const safeHref = typeof href === 'string' && href.trim() ? href : '/holidays';
  const linkStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'var(--space-2)',
    minHeight: 44,
    padding: 'var(--space-2) var(--space-4)',
    borderRadius: 'var(--radius-md)',
    background: 'var(--bg-surface-3)',
    border: '1px solid var(--border-subtle)',
    color: 'var(--text-primary)',
    fontSize: 'var(--text-sm)',
    fontWeight: 'var(--font-semibold)',
    textDecoration: 'none',
  };

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
    <div style={{ overflow: 'hidden', padding: 0, border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', background: 'var(--bg-surface-2)' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }} dir="rtl">
        <caption className="sr-only">معلومات سريعة</caption>
        <tbody>
          {facts.map((f, i) => (
            <tr key={i} style={{ background: i % 2 === 0 ? 'var(--bg-surface-3)' : 'var(--bg-surface-4)', borderBottom: '1px solid var(--border-subtle)' }}>
              <th scope="row" style={{ padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', color: 'var(--text-secondary)', textAlign: 'right', whiteSpace: 'nowrap', width: '40%' }}>{f.label}</th>
              <td style={{ padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--text-sm)', color: 'var(--text-primary)', fontWeight: 'var(--font-semibold)' }}>{f.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
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
          <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)', marginBottom: 'var(--space-4)' }}>
            {intentHeading}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', lineHeight: 'var(--leading-relaxed)', marginBottom: 'var(--space-4)', maxWidth: 720 }}>
            اختر المسار الذي يناسبك الآن: التحضير، مشاركة الموعد، أو ترتيب الأيام القريبة. هذه الخطوات تختصر عليك البحث المتكرر وتربط التاريخ بما ستفعله فعلاً.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-3)' }}>
            {intentCards.map((card, i) => {
              const Icon = resolveIntentIcon(card);

              return (
              <article key={i} style={{ padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', height: '100%', gap: 'var(--space-3)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', background: 'var(--bg-surface-2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-3)' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 42, height: 42, borderRadius: 'var(--radius-md)', color: 'var(--accent)', background: 'var(--accent-soft)', border: '1px solid var(--border-accent)' }}>
                    <Icon size={21} strokeWidth={1.75} aria-hidden="true" />
                  </span>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', fontWeight: 'var(--font-semibold)' }}>
                    خطوة {i + 1}
                  </span>
                </div>
                <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 'var(--font-semibold)', color: 'var(--text-primary)', marginBottom: 'var(--space-1)' }}>{card.title}</h3>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-4)', flex: 1 }}>{card.description}</p>
                <IntentLink href={card.ctaHref}>
                  {getIntentCtaText(card)}
                  <ArrowLeft size={14} aria-hidden="true" />
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
      <AdInArticle slotId={`late-holiday-${slug}-2`} />

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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-3)' }}>
            {engagement.map((item, index) => (
              <article key={`${item.type}-${index}`} style={{ padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', background: 'var(--bg-surface-2)' }}>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
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

      {faq.length > 0 && (
        <section style={{ marginTop: 'var(--space-10)' }} aria-labelledby="faq-h">
          <h2 id="faq-h" style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)', marginBottom: 'var(--space-5)' }}>
            أسئلة قبل الاعتماد على موعد {displayTitle}
          </h2>
          <div className={styles.faqList}>
            {faq.map((faqItem, i) => {
              return (
              <details key={i} className={styles.faqItem}>
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

      <HolidayInternalLinks
        event={event}
        displayTitle={displayTitle}
        currentYear={currentYear}
        hijriYearNum={hijriYearNum}
      />

      {sources.length > 0 && (
        <section style={{ marginTop: 'var(--space-10)' }} aria-labelledby="sources-h">
          <h2 id="sources-h" style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-semibold)', color: 'var(--text-primary)', marginBottom: 'var(--space-3)' }}>
            المصادر والمراجع
          </h2>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', listStyle: 'none', padding: 0, margin: 0 }}>
            {sources.map((source, i) => (
              <li key={i} style={{ fontSize: 'var(--text-sm)', color: 'var(--text-link)' }}>
                <a href={source.url} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>
                  {source.label}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      <Suspense fallback={null}>
        <NextEventCard currentSlug={slug} />
      </Suspense>

      <AdMultiplex slotId={`end-holiday-${slug}`} />

      <Suspense fallback={
        <div style={{ marginTop: 'var(--space-12)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 'var(--space-3)' }}>
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
