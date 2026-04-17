import DateRouteLoading from '@/components/date/DateRouteLoading';
import DateCountryRedirectClient from './DateCountryRedirectClient';

export const metadata = {
  robots: {
    index: false,
    follow: true,
  },
};

export default function DateCountryRootPage() {
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
