import PageStatusState from '@/components/shared/PageStatusState';

export default function GlobalNotFound() {
  return (
    <PageStatusState
      tone="neutral"
      statusKey="global-not-found"
      eyebrow="404"
      title="لم نجد الصفحة التي طلبتها"
      description="قد يكون الرابط قديماً، أو كُتب بطريقة غير صحيحة، أو يشير إلى صفحة لم تعد موجودة. يمكنك الرجوع إلى الصفحة الرئيسية أو البحث عن المسار الأقرب لسؤالك."
      guidanceTitle="أسرع طريق للعودة"
      guidanceBody="إذا كنت تبحث عن وقت مدينة، تاريخ اليوم، أو أداة معينة، فالبحث يجدها لك مباشرة بدلاً من تجربة انتقالات عشوائية."
      actions={[
        {
          label: 'ابحث في ميقاتنا',
          href: '/search',
          primary: true,
        },
        {
          label: 'العودة للرئيسية',
          href: '/',
        },
      ]}
    />
  );
}
