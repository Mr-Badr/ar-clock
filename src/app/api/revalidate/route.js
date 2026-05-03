import { revalidatePath, revalidateTag } from 'next/cache';
import { z } from 'zod';

import { getEnv } from '@/lib/env.server';
import { logError, logEvent } from '@/lib/observability';
import { resolveEventSlug } from '@/lib/events';
import { json, parseSearchParams, withApiHandler } from '@/lib/api/route-utils';

const querySchema = z.object({
  secret: z.string().trim().min(1, 'Missing secret.'),
  path: z.string().trim().max(200).optional(),
  tag: z.string().trim().max(200).optional(),
  scope: z.string().trim().max(40).optional(),
  slug: z.string().trim().max(120).optional(),
  category: z.string().trim().max(120).optional(),
});

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
export const POST = withApiHandler(
  '/api/revalidate',
  async ({ request }) => {
    const env = getEnv();
    const { secret, path, tag, scope, slug, category } = parseSearchParams(request, querySchema);
    const allowDevSecret = env.NODE_ENV !== 'production' && secret === 'dev_secret';
    const resolvedSlug = slug ? resolveEventSlug(slug) : null;
    const canonicalSlug = resolvedSlug?.canonicalSlug || slug;
    const tags = tag
      ? tag
          .split(',')
          .map((value) => value.trim())
          .filter(Boolean)
          .slice(0, 20)
      : [];

    if (secret !== env.REVALIDATE_SECRET && !allowDevSecret) {
      return json({ message: 'Invalid token.' }, { status: 401 });
    }

    if (!path && tags.length === 0 && !scope && !slug && !category) {
      return json(
        { message: 'Missing path/tag/scope/slug/category parameter.' },
        { status: 400 },
      );
    }

    if (path && !path.startsWith('/')) {
      return json({ message: 'Path must start with /.' }, { status: 400 });
    }

    try {
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

      return json({
        revalidated: true,
        path,
        tags,
        scope,
        slug,
        canonicalSlug,
        category,
        now: Date.now(),
      });
    } catch (err) {
      logError('on-demand-revalidate-error', {
        message: err?.message,
        path,
        tags,
        scope,
        slug,
        category,
      });

      return json({ message: 'Error revalidating path cache.' }, { status: 500 });
    }
  },
  {
    rateLimit: {
      key: 'revalidate',
      limit: 12,
      windowMs: 60_000,
    },
  },
);
