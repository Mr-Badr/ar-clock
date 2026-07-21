import { createFactCityPage } from '@/lib/mwaqit/special-prayer-geo-pages';
import { SPECIAL_PRAYER_FACT_TYPES } from '@/lib/mwaqit/special-prayer-fact-types';

const { generateStaticParams, generateMetadata, Page } = createFactCityPage(
  SPECIAL_PRAYER_FACT_TYPES['prohibited-prayer-times'],
);

export { generateStaticParams, generateMetadata };
export default Page;
