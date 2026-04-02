import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { getSiteUrl } from '@/lib/site-config';

import MapPageClient from './MapPageClient';

const SITE_URL = getSiteUrl();

export const metadata = buildCanonicalMetadata({
  title: 'خريطة الوقت العالمي',
  description:
    'استكشف الوقت الحالي عبر خريطة تفاعلية للمدن والمناطق الزمنية، مع مقارنة سريعة بين أهم المدن العربية والعالمية.',
  keywords: [
    'خريطة الوقت العالمي',
    'خريطة المناطق الزمنية',
    'الوقت في العالم',
    'توقيت المدن',
    'world time map',
  ],
  url: `${SITE_URL}/map`,
});

export default function MapPage() {
  return <MapPageClient />;
}
