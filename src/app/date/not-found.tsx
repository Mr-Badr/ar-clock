import RouteUnavailableState from '@/components/shared/RouteUnavailableState';

export default function DateNotFound() {
  return (
    <RouteUnavailableState
      eyebrow="تاريخ غير متاح"
      title="لم نعثر على هذا التاريخ"
      description="المسار الذي فتحته يشير إلى تاريخ غير صحيح أو خارج النطاق المدعوم في صفحات التاريخ. اختر مساراً واضحاً بدلاً من البقاء في صفحة غير مفيدة."
      primaryLink={{
        href: '/date',
        label: 'العودة إلى مركز التاريخ',
        description: 'افتح تاريخ اليوم ثم انتقل إلى التقويم أو التحويل عند الحاجة.',
      }}
      secondaryLinks={[
        {
          href: '/date/converter',
          label: 'استخدام محول التاريخ',
          description: 'حوّل بين التاريخ الهجري والميلادي بطريقة واضحة.',
        },
        {
          href: '/date/calendar',
          label: 'فتح التقويم الميلادي',
          description: 'اختر سنة صحيحة واستعرض تقويمها الكامل.',
        },
      ]}
    />
  );
}
