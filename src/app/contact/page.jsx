import SiteInfoPage from '@/components/site/SiteInfoPage';
import { buildSiteInfoPageMetadata, getSiteInfoPageContent } from '@/data/site/info-pages';

const PAGE_ID = 'contact';

export const metadata = buildSiteInfoPageMetadata(PAGE_ID);

export default function ContactPage() {
  return <SiteInfoPage {...getSiteInfoPageContent(PAGE_ID)} />;
}
