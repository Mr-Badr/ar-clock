import { Zap, Globe2, Shield, Users, BookOpen, Star } from 'lucide-react'

/** @type {{ icon: import('lucide-react').LucideIcon, title: string, body: string, color: string }[]} */
export const WHY_FEATURES = [
  {
    icon: Zap,
    title: 'دقة فلكية متناهية',
    body: 'تُحسب مواقيت الصلاة وفق معادلات فلكية دقيقة تراعي الارتفاع عن سطح البحر، الانكسار الضوئي، وتوقيت التحولات الفصلية.',
    color: 'var(--warning)',
  },
  {
    icon: Globe2,
    title: 'تغطية عالمية',
    body: 'يدعم الموقع أكثر من 3 ملايين مدينة وبلدة، شاملاً كل دولة عربية وإسلامية والمدن العالمية الكبرى.',
    color: 'var(--info)',
  },
  {
    icon: Shield,
    title: 'بيانات موثوقة',
    body: 'مصادر التوقيت من قواعد بيانات IANA الزمنية وUTC الموثوقة دولياً، محدَّثة بشكل دوري مستمر.',
    color: 'var(--success)',
  },
  {
    icon: Users,
    title: 'صُمِّم للعربي',
    body: 'واجهة عربية أصيلة بالكامل بدعم RTL، خط عربي احترافي، ومحتوى لغوي طبيعي — ليس ترجمةً آلية.',
    color: 'var(--accent-alt)',
  },
  {
    icon: BookOpen,
    title: 'المذاهب الأربعة',
    body: 'الحنفي، المالكي، الشافعي، الحنبلي — اختر مذهبك لضبط أوقات الفجر والعشاء بدقة فقهية صحيحة.',
    color: 'var(--danger)',
  },
  {
    icon: Star,
    title: 'مجاني تماماً',
    body: 'جميع الأدوات مجانية وبلا تسجيل ولا إعلانات مزعجة: مواقيت الصلاة، فرق التوقيت، المناسبات، وساعة العالم.',
    color: 'var(--warning)',
  },
]
