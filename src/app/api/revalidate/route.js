import { revalidatePath, revalidateTag } from 'next/cache';
import { getEnv } from '@/lib/env.server';
import { logError, logEvent } from '@/lib/observability';
import { resolveEventSlug } from '@/lib/events';

/**
 * API Route to trigger on-demand ISR revalidation globally across edge nodes.
 * 
 * Usage from terminal:
 * curl -X POST "http://localhost:3000/api/revalidate?secret=YOUR_SUPER_SECRET&path=/mwaqit-al-salat/morocco/rabat"
 * curl -X POST "http://localhost:3000/api/revalidate?secret=YOUR_SUPER_SECRET&tag=cities"
 * 
 * Webhook Usage Guide:
 * When the geographic coordinates database updates remotely, trigger a webhook here 
 * to bust the edge cache instantly instead of waiting out the full 24 hours.
 */
export async function POST(request) {
  const env = getEnv();
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');
  const path = searchParams.get('path');
  const tag = searchParams.get('tag');
  const scope = searchParams.get('scope');
  const slug = searchParams.get('slug');
  const category = searchParams.get('category');
  const resolvedSlug = slug ? resolveEventSlug(slug) : null;
  const canonicalSlug = resolvedSlug?.canonicalSlug || slug;
  const tags = tag
    ? tag
        .split(',')
        .map((value) => value.trim())
        .filter(Boolean)
    : [];

  // Validate Secret (Store this securely in .env as REVALIDATE_SECRET)
  if (secret !== env.REVALIDATE_SECRET && secret !== 'dev_secret') {
    return new Response(JSON.stringify({ message: 'Invalid token' }), { status: 401 });
  }

  if (!path && tags.length === 0 && !scope && !slug && !category) {
    return new Response(
      JSON.stringify({ message: 'Missing path/tag/scope/slug/category parameter' }),
      { status: 400 },
    );
  }

  try {
    // Next.js 16 revalidatePath and revalidateTag for cache invalidation
    if (path) revalidatePath(path);
    for (const nextTag of tags) revalidateTag(nextTag, 'max');

    if (scope === 'holidays') {
      [
        'holidays-page',
        'events:all',
        'hijri',
        'hijri-events',
        'current-time',
      ].forEach((nextTag) =>
        revalidateTag(nextTag, 'max'),
      );
      revalidatePath('/holidays');
    }

    if (slug) {
      revalidateTag(`event:${canonicalSlug}`, 'max');
      revalidateTag(`holiday-page-${canonicalSlug}`, 'max');
      revalidatePath(`/holidays/${canonicalSlug}`);
      if (resolvedSlug?.isAlias) {
        revalidatePath(`/holidays/${slug}`);
      }
    }

    if (category) {
      revalidateTag(`events:${category}`, 'max');
      revalidatePath(`/holidays?category=${encodeURIComponent(category)}`);
    }

    logEvent('on-demand-revalidate', { path, tags, scope, slug, canonicalSlug, category });

    return new Response(
      JSON.stringify({
        revalidated: true,
        path,
        tags,
        scope,
        slug,
        canonicalSlug,
        category,
        now: Date.now(),
      }),
      { status: 200 },
    );
  } catch (err) {
    logError('on-demand-revalidate-error', {
      message: err?.message,
      path,
      tags,
      scope,
      slug,
      category,
    });
    return new Response(JSON.stringify({ message: 'Error revalidating path cache' }), { status: 500 });
  }
}
