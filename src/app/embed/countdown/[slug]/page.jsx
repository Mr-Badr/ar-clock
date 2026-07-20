/**
 * app/embed/countdown/[slug]/page.jsx
 *
 * Chrome-free holiday-countdown widgets meant to be <iframe>-embedded on
 * other sites (same pattern as /embed/prayer-times and /embed/calculators).
 * Only a small, curated allowlist of high-recognition Islamic countdowns is
 * embeddable — see `EMBEDDABLE_COUNTDOWNS` below, not every holiday event on
 * the site. Reuses the exact same date-resolution engine as the real holiday
 * pages (`getNextEventDate`/`resolveAllHijriEvents`/`getTimeRemaining`) — no
 * duplicated date math. Chrome hidden globally via the `embed-mode` class.
 * Intentionally noindex: a widget fragment, not a content page.
 *
 * `params` is read inside the Suspense-wrapped child, never in the page
 * component directly — same PPR "postponed empty page" reasoning as the
 * other two embed routes.
 */

import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { getHolidayCoreEventBySlug } from '@/lib/holidays/repository';
import { resolveAllHijriEvents } from '@/lib/hijri-resolver';
import { getNextEventDate, getTimeRemaining } from '@/lib/holidays-engine';
import { getCachedNowIso } from '@/lib/date-utils';
import { getSiteUrl } from '@/lib/site-config';
import CountdownEmbed from '@/components/holidays/CountdownEmbed.client';

export const metadata = {
  robots: { index: false, follow: false },
};

// Deliberately small, curated v1 set — the most universally-recognized
// Islamic countdowns, the kind people actually want on a mosque/community/
// blog sidebar — not every one of the 300+ holiday pages on the site.
const EMBEDDABLE_COUNTDOWNS = {
  ramadan: 'رمضان',
  'eid-al-fitr': 'عيد الفطر',
  'eid-al-adha': 'عيد الأضحى',
};

export function generateStaticParams() {
  return Object.keys(EMBEDDABLE_COUNTDOWNS).map((slug) => ({ slug }));
}

async function CountdownEmbedContent({ params }) {
  const { slug } = await params;
  const label = EMBEDDABLE_COUNTDOWNS[slug];
  if (!label) notFound();

  const core = getHolidayCoreEventBySlug(slug);
  if (!core) notFound();

  const nowIso = await getCachedNowIso();
  const nowMs = new Date(nowIso).getTime();
  const resolved = core.type === 'hijri' ? await resolveAllHijriEvents([core], { nowIso }) : {};
  const targetDate = getNextEventDate(core, resolved, nowMs);
  const initialRemaining = getTimeRemaining(targetDate, nowMs);
  const fullPageUrl = `${getSiteUrl()}/holidays/${slug}`;

  return (
    <CountdownEmbed
      eventName={core.name || label}
      targetIso={targetDate.toISOString()}
      initialRemaining={initialRemaining}
      fullPageUrl={fullPageUrl}
    />
  );
}

function CountdownEmbedFallback() {
  return (
    <main className="embed-countdown-widget" aria-hidden="true">
      <div className="embed-countdown-widget__skeleton" />
    </main>
  );
}

export default function CountdownEmbedPage({ params }) {
  return (
    <Suspense fallback={<CountdownEmbedFallback />}>
      <CountdownEmbedContent params={params} />
    </Suspense>
  );
}
