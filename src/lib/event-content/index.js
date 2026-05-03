/**
 * Runtime content compatibility layer.
 *
 * Authoring still lives in:
 *   src/data/holidays/events/<slug>/package.json
 *
 * Runtime content lookup now delegates to the centralized holidays repository
 * so future delivery can move from in-repo JSON to CDN/VPS/Postgres with one
 * read boundary.
 */

import { getHolidayRichContent } from '@/lib/holidays/repository';

export function getRichContent(slug) {
  return getHolidayRichContent(slug);
}
