import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { getCountryByCode } from '@/lib/db/queries/countries';
import DateRouteLoading from '@/components/date/DateRouteLoading';
import { resolveRequestLocationFromHeaders } from '@/lib/locationService';
import DateCountryRedirectClient from './DateCountryRedirectClient';

const DEFAULT_COUNTRY_SLUG = 'saudi-arabia';

async function resolvePreferredCountrySlug() {
  const hdrs = await headers();

  const matchedLocation = await resolveRequestLocationFromHeaders(hdrs).catch(() => null);
  if (matchedLocation?.country_slug) {
    return matchedLocation.country_slug;
  }

  const fallbackCountryCode =
    hdrs.get('x-vercel-ip-country') ||
    hdrs.get('cf-ipcountry');

  if (fallbackCountryCode) {
    const country = await getCountryByCode(fallbackCountryCode).catch(() => null);
    if (country?.country_slug) {
      return country.country_slug;
    }
  }

  return null;
}

export default async function DateCountryRootPage() {
  const countrySlug = await resolvePreferredCountrySlug();
  if (countrySlug) {
    redirect(`/date/country/${countrySlug}`);
  }

  return (
    <>
      <DateRouteLoading
        kind="hub"
        title="جاري تحديد بلدك"
        description="نحدد بلدك من المتصفح أو من بيانات الشبكة ثم نحوّلك إلى صفحة التاريخ المناسبة."
      />
      <DateCountryRedirectClient />
    </>
  );
}
