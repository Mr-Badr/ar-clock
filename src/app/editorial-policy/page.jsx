import SiteInfoPage from '@/components/site/SiteInfoPage';
import { buildSiteInfoPageMetadata, getSiteInfoPageContent } from '@/data/site/info-pages';

const PAGE_ID = 'editorial-policy';

export const metadata = buildSiteInfoPageMetadata(PAGE_ID);

export default function EditorialPolicyPage() {
  return <SiteInfoPage {...getSiteInfoPageContent(PAGE_ID)} />;
}
