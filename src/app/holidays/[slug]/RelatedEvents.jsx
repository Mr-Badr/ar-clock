/**
 * app/holidays/[slug]/RelatedEvents.jsx
 * RelatedEvents — Related events section
 * Shows other events in the same category
 */

import Link from 'next/link';
import { ALL_EVENTS, getRelatedEvents } from '@/lib/holidays-engine';
import { getHolidayCategoryById } from '@/lib/holidays/taxonomy';
import { resolveHolidayRuntimeData } from '@/lib/holidays/runtime-data';

function toPlainText(value) {
  if (!value) return '';
  return String(value).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function buildExcerpt(value, maxLength = 165) {
  const text = toPlainText(value);
  if (!text) return { text: '', truncated: false };
  if (text.length <= maxLength) {
    return { text, truncated: false };
  }

  const slice = text.slice(0, maxLength);
  const safeEnd = Math.max(slice.lastIndexOf(' '), slice.lastIndexOf('،'), slice.lastIndexOf('.'));
  const nextText = (safeEnd > maxLength * 0.65 ? slice.slice(0, safeEnd) : slice).trim();
  return {
    text: `${nextText}...`,
    truncated: true,
  };
}

async function buildRelatedCard(slug) {
  const event = ALL_EVENTS.find((item) => item.slug === slug);
  if (!event) return null;
  const runtime = await resolveHolidayRuntimeData(slug);
  if (!runtime) return null;
  const category = getHolidayCategoryById(event.category);
  const rawDescription =
    runtime.pageModel?.hero?.answerSummary ||
    runtime.seo?.seoMeta?.metaDescription ||
    runtime.seo?.description ||
    runtime.event?.details ||
    `تعرف على موعد ${runtime.event?.name || event.name} والعد التنازلي الخاص به.`;
  const excerpt = buildExcerpt(rawDescription);
  return {
    slug: event.slug,
    name: runtime.pageModel?.meta?.displayTitle || runtime.event?.name || event.name,
    emoji: category?.icon || '📅',
    categoryName: category?.label || event.category,
    description: excerpt.text,
    hasMore: excerpt.truncated,
  };
}

export default async function RelatedEvents({ relatedSlugs = [], currentSlug }) {
  const candidateSlugs = relatedSlugs.length > 0
    ? relatedSlugs
    : getRelatedEvents(currentSlug, ALL_EVENTS, 4).map((event) => event.slug);
  const events = (
    await Promise.all(
      candidateSlugs
        .filter((slug) => slug && slug !== currentSlug)
        .map(buildRelatedCard),
    )
  )
    .filter(Boolean)
    .slice(0, 6);

  if (!events?.length) return null;
  
  return (
    <section style={{ marginTop: 'var(--space-8)' }} aria-labelledby="related-h">
      <h2 id="related-h" style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)', marginBottom: 'var(--space-4)' }}>
        مناسبات ذات صلة
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-4)' }}>
        {events.map((event) => (
          <Link
            key={event.slug}
            href={`/holidays/${event.slug}`}
            style={{
              display: 'block',
              padding: 'var(--space-4)',
              background: 'var(--bg-surface-2)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-default)',
              textDecoration: 'none',
              color: 'inherit',
              transition: 'all 0.2s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-2)' }}>
              <span style={{ fontSize: 'var(--text-2xl)' }}>{event.emoji}</span>
              <div>
                <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-semibold)', color: 'var(--text-primary)', marginBottom: 'var(--space-1)' }}>
                  {event.name}
                </h3>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                  {event.categoryName}
                </p>
              </div>
            </div>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', lineHeight: 'var(--leading-relaxed)' }}>
              {event.description}
            </p>
            <div style={{ marginTop: 'var(--space-3)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-2)' }}>
              <span
                style={{
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-semibold)',
                  color: 'var(--accent-strong)',
                }}
              >
                {event.hasMore ? 'أكمل القراءة' : 'عرض المناسبة'}
              </span>
              <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }} aria-hidden="true">
                ←
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
