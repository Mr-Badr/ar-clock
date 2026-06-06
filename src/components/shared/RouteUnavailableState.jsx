import PageStatusState from '@/components/shared/PageStatusState';

export default function RouteUnavailableState({
  eyebrow,
  title,
  description,
  primaryLink,
  secondaryLinks,
}) {
  const linkItems = [
    primaryLink,
    ...(Array.isArray(secondaryLinks) ? secondaryLinks : []),
  ].filter(Boolean);

  return (
    <PageStatusState
      tone="warning"
      statusKey="route-unavailable"
      eyebrow={eyebrow}
      title={title}
      description={description}
      guidanceTitle="ما الذي يمكنك فعله الآن؟"
      guidanceBody="افتح المسار الأقرب إلى ما تريد ثم ارجع لاحقاً. تم تسجيل المشكلة حتى تظهر بوضوح في السجل بدلاً من أن تتحول إلى صفحة فارغة أو خطأ صامت."
      actions={linkItems.map((item, index) => ({
        href: item.href,
        label: item.label,
        description: item.description,
        primary: index === 0,
      }))}
    />
  );
}
