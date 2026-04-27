import SiteInfoPage from '@/components/site/SiteInfoPage';
import { buildSiteInfoPageMetadata, getSiteInfoPageContent } from '@/data/site/info-pages';

const PAGE_ID = 'about';

export const metadata = buildSiteInfoPageMetadata(PAGE_ID);

export default function AboutPage() {
  return <SiteInfoPage {...getSiteInfoPageContent(PAGE_ID)} />;
}
