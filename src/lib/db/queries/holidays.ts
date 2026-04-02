import 'server-only'
import { cacheTag, cacheLife } from 'next/cache'
import { ALL_EVENTS, enrichEvent, getEventBySlug } from '@/lib/holidays-engine'

/**
 * Holidays resolve from the generated JSON-first event pipeline.
 * The runtime engine enriches those compiled records with date logic and SEO context.
 */

export async function getAllHolidays() {
  'use cache'
  cacheTag('holidays', 'events:all')
  cacheLife('days')

  return ALL_EVENTS.map(enrichEvent)
}

export async function getHolidayBySlug(slug: string) {
  'use cache'
  const event = getEventBySlug(slug)
  cacheTag('holidays', `holiday-${slug}`, `event:${slug}`)
  if (event?.category) cacheTag(`events:${event.category}`)
  cacheLife('days')

  return event
}
