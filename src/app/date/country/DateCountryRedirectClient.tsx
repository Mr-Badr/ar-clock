'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getBrowserLocationHints, resolveCurrentUserCity } from '@/lib/user-location.client';

const DEFAULT_COUNTRY_SLUG = 'saudi-arabia';

export default function DateCountryRedirectClient() {
  const router = useRouter();

  useEffect(() => {
    let done = false;

    async function redirectToBestCountry() {
      try {
        const hints = getBrowserLocationHints();
        const detection = await resolveCurrentUserCity({
          hints,
          geolocation: 'never',
          enableIp: true,
          enableTimezone: true,
        });

        const countrySlug = detection.city?.country_slug || DEFAULT_COUNTRY_SLUG;
        if (!done) {
          done = true;
          router.replace(`/date/country/${countrySlug}`);
        }
      } catch {
        if (!done) {
          done = true;
          router.replace(`/date/country/${DEFAULT_COUNTRY_SLUG}`);
        }
      }
    }

    redirectToBestCountry();
    return () => {
      done = true;
    };
  }, [router]);

  return null;
}
