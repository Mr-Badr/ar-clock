// app/page.jsx

import HomeSections from '@/components/home';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import TimeCinematicHero from '@/components/hero/TimeCinematicHero';
import {
  SITE_DESCRIPTION,
  SITE_HOME_TITLE,
  SITE_KEYWORDS,
  getSiteUrl,
} from '@/lib/site-config';

const SITE_URL = getSiteUrl();

export const metadata = buildCanonicalMetadata({
  title: SITE_HOME_TITLE,
  description: SITE_DESCRIPTION,
  keywords: SITE_KEYWORDS,
  url: SITE_URL,
});

export default function HomePage() {
  return (
    <div className="min-h-screen bg-base text-primary" dir="rtl">
      <main>
        <TimeCinematicHero cityNameAr="توقيتك المحلي" />

        <HomeSections className="container-col" />
      </main>
    </div>
  );
}
