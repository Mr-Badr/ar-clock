'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

import { getBrowserLocationHints, resolveCurrentUserCity } from '@/lib/user-location.client';
import { logger, serializeError } from '@/lib/logger';

const DEFAULT_COUNTRY_SLUG = 'saudi-arabia';

export default function DateCountryRedirectClient() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [buttonLabel, setButtonLabel] = useState('اكتشف صفحة بلدي تلقائياً');

  async function handleDetectCountry() {
    setButtonLabel('جارٍ تحديد بلدك...');

    try {
      const hints = getBrowserLocationHints();
      const detection = await resolveCurrentUserCity({
        hints,
        geolocation: 'never',
        enableIp: true,
        enableTimezone: true,
      });

      const countrySlug = detection.city?.country_slug || DEFAULT_COUNTRY_SLUG;
      startTransition(() => {
        router.push(`/date/country/${countrySlug}`);
      });
    } catch (error) {
      logger.warn('date-country-detect-button-failed', {
        route: '/date/country',
        fallbackCountrySlug: DEFAULT_COUNTRY_SLUG,
        error: serializeError(error),
      });
      startTransition(() => {
        router.push(`/date/country/${DEFAULT_COUNTRY_SLUG}`);
      });
    }
  }

  return (
    <button
      type="button"
      onClick={handleDetectCountry}
      disabled={isPending}
      className="btn btn-primary"
      aria-live="polite"
    >
      {isPending ? 'جارٍ فتح صفحة بلدك...' : buttonLabel}
    </button>
  );
}
