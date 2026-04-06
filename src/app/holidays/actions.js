'use server';
/**
 * app/holidays/actions.js
 * Server Action for paginated event loading.
 * First PAGE_SIZE events are SSR'd (Googlebot sees them as HTML).
 * Subsequent pages come here via useTransition.
 *
 * dynamicSeoMeta() ensures every event card title/description
 * shows the correct upcoming year — never a stale "2026" in 2027+.
 */
import { loadEventsPage } from './data';

export async function loadMoreEvents(cursor = 0, filter = {}) {
  return loadEventsPage(cursor, filter);
}
