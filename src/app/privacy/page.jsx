import SiteInfoPage from '@/components/site/SiteInfoPage';
import { buildSiteInfoPageMetadata, getSiteInfoPageContent } from '@/data/site/info-pages';

const PAGE_ID = 'privacy';

export const metadata = buildSiteInfoPageMetadata(PAGE_ID);

export default function PrivacyPage() {
  return <SiteInfoPage {...getSiteInfoPageContent(PAGE_ID)} />;
}
