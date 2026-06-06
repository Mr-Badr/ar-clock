/**
 * app/holidays/[slug]/RelatedEvents.jsx
 * RelatedEvents — Related events section
 * Shows other events in the same category
 */

import Link from 'next/link';
import { ArrowLeft, BookOpen, Briefcase, CalendarDays, CircleDollarSign, Flag, Globe2, GraduationCap, Moon, Users } from 'lucide-react';
import { ALL_EVENTS, getRelatedEvents } from '@/lib/holidays-engine';
import { getHolidayCategoryById } from '@/lib/holidays/taxonomy';
import { resolveHolidayRuntimeData } from '@/lib/holidays/runtime-data';
import { logHolidayFailure } from '@/lib/holidays/observability';

function toPlainText(value) {
  if (!value) return '';
  return String(value).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function buildExcerpt(value, maxLength) {
  const resolvedMaxLength = Number.isInteger(maxLength) && maxLength > 0 ? maxLength : 145;
  const text = toPlainText(value);
  if (!text) return { text: '', truncated: false };
  if (text.length <= resolvedMaxLength) {
    return { text, truncated: false };
  }

  const slice = text.slice(0, resolvedMaxLength);
  const safeEnd = Math.max(slice.lastIndexOf(' '), slice.lastIndexOf('،'), slice.lastIndexOf('.'));
  const nextText = (safeEnd > resolvedMaxLength * 0.65 ? slice.slice(0, safeEnd) : slice).trim();
  return {
    text: `${nextText}...`,
    truncated: true,
  };
}

const CATEGORY_ICON = {
  islamic: Moon,
  national: Flag,
  school: GraduationCap,
  holidays: BookOpen,
  astronomy: Globe2,
  social: Users,
  business: Briefcase,
  support: CircleDollarSign,
};

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
    `راجع موعد ${runtime.event?.name || event.name} والعد التنازلي الخاص به قبل مقارنة المناسبات القريبة.`;
  const excerpt = buildExcerpt(rawDescription);
  return {
    slug: event.slug,
    name: runtime.pageModel?.meta?.displayTitle || runtime.event?.name || event.name,
    categoryId: event.category,
    categoryName: category?.label || event.category,
    description: excerpt.text,
    hasMore: excerpt.truncated,
  };
}

export default async function RelatedEvents({ relatedSlugs, currentSlug }) {
  try {
    const safeRelatedSlugs = Array.isArray(relatedSlugs) ? relatedSlugs : [];
    const candidateSlugs = safeRelatedSlugs.length > 0
      ? safeRelatedSlugs
      : getRelatedEvents(currentSlug, ALL_EVENTS, 4).map((event) => event.slug);
    const events = (
      await Promise.all(
        candidateSlugs
          .filter((slug) => slug && slug !== currentSlug)
          .map(buildRelatedCard),
      )
    )
      .filter(Boolean)
      .slice(0, 3);

    if (!events?.length) return null;
  
    return (
      <section style={{ marginTop: 'var(--space-8)' }} aria-labelledby="related-h">
        <h2 id="related-h" style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)', marginBottom: 'var(--space-4)' }}>
          مناسبات تساعدك على إكمال المقارنة
        </h2>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 'var(--leading-relaxed)', maxWidth: '72ch', marginBottom: 'var(--space-4)' }}>
          هذه ليست قائمة عامة؛ اختر منها عندما تريد مقارنة موعد قريب أو مناسبة من نفس التصنيف.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-3)' }}>
          {events.map((event, index) => {
            const Icon = CATEGORY_ICON[event.categoryId] || CalendarDays;
            return (
              <Link
                key={event.slug}
                href={`/holidays/${event.slug}`}
                style={{
                  display: 'block',
                  padding: 'var(--space-3)',
                  background: index === 0
                    ? 'color-mix(in srgb, var(--accent-soft) 46%, var(--bg-surface-2))'
                    : 'var(--bg-surface-2)',
                  borderRadius: 'var(--radius-lg)',
                  border: index === 0
                    ? '1px solid var(--border-accent)'
                    : '1px solid var(--border-default)',
                  textDecoration: 'none',
                  color: 'inherit',
                  transition: 'border-color 0.2s ease, background-color 0.2s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-2)' }}>
                  <span style={{ display: 'inline-flex', color: 'var(--accent-alt)' }} aria-hidden="true">
                    <Icon size={20} strokeWidth={1.75} />
                  </span>
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
                    {event.hasMore ? 'قارن الموعد' : 'افتح العدّاد'}
                  </span>
                  <ArrowLeft size={14} style={{ color: 'var(--text-muted)' }} aria-hidden="true" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    );
  } catch (error) {
    logHolidayFailure('holiday-related-events-section-failed', {
      currentSlug,
      slug: currentSlug,
      section: 'related-events',
      degraded: true,
      error,
      extraContext: {
        relatedSlugs: Array.isArray(relatedSlugs) ? relatedSlugs : [],
      },
    });
    return null;
  }
}
