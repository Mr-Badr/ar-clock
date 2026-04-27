import SiteInfoPage from '@/components/site/SiteInfoPage';
import { buildSiteInfoPageMetadata, getSiteInfoPageContent } from '@/data/site/info-pages';

const PAGE_ID = 'disclaimer';

export const metadata = buildSiteInfoPageMetadata(PAGE_ID);

export default function DisclaimerPage() {
  return <SiteInfoPage {...getSiteInfoPageContent(PAGE_ID)} />;
}
