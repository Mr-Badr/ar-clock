import { createFactCountryPage } from '@/lib/mwaqit/special-prayer-geo-pages';
import { SPECIAL_PRAYER_FACT_TYPES } from '@/lib/mwaqit/special-prayer-fact-types';

const { generateStaticParams, generateMetadata, Page } = createFactCountryPage(
  SPECIAL_PRAYER_FACT_TYPES['duha-prayer-time'],
);

export { generateStaticParams, generateMetadata };
export default Page;
