import 'server-only'
import { cacheTag, cacheLife } from 'next/cache'
import { ALL_EVENTS, enrichEvent } from '@/lib/holidays-engine'

/**
 * Holidays are currently resolved from the local engine (hardcoded JS data).
 * We wrap them in 'use cache' to match the data architecture pattern.
 */

export async function getAllHolidays() {
  'use cache'
  cacheTag('holidays')
  cacheLife('days')

  // Currently returns hardcoded data from the engine
  return ALL_EVENTS.map(enrichEvent)
}

export async function getHolidayBySlug(slug: string) {
  'use cache'
  cacheTag('holidays', `holiday-${slug}`)
  cacheLife('days')

  const event = ALL_EVENTS.find(e => e.slug === slug)
  return event ? enrichEvent(event) : null
}
