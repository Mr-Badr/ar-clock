import PageStatusState from '@/components/shared/PageStatusState';

export default function GlobalNotFound() {
  return (
    <PageStatusState
      tone="neutral"
      statusKey="global-not-found"
      eyebrow="404"
      title="لم نجد الصفحة التي طلبتها"
      description="قد يكون الرابط قديماً، أو كُتب بطريقة غير صحيحة، أو يشير إلى صفحة لم تعد موجودة. يمكنك الرجوع إلى الصفحة الرئيسية أو فتح فهرس ميقاتنا للوصول إلى المسار الأقرب لسؤالك."
      guidanceTitle="أسرع طريق للعودة"
      guidanceBody="إذا كنت تبحث عن وقت مدينة، تاريخ اليوم، مواقيت الصلاة، أو حاسبة، فالفهرس يجمع المسارات الأساسية في مكان واحد بدلاً من تجربة انتقالات عشوائية."
      actions={[
        {
          label: 'فتح فهرس الصفحات',
          href: '/fahras',
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
