/**
 * useCases.js — 6 relatable use-cases driving the "why you need this" section
 */
import { Plane, Briefcase, Users, Heart, Globe2, GraduationCap } from 'lucide-react'

export const USE_CASES = [
  {
    icon: Plane,
    title: 'المسافرون والمغتربون',
    body: 'لا تفوّت رحلتك أو اجتماع الإيرباص! اعرف توقيت البلد المقصود مسبقاً وتجنّب الارتباك عند العبور بين مناطق زمنية مختلفة.',
    color: 'var(--accent-alt)',
    softBg: 'var(--accent-alt-soft)',
  },
  {
    icon: Briefcase,
    title: 'رجال الأعمال والشركات',
    body: 'جدوِّل اجتماعاتك مع الشركاء الدوليين بدقة. تجنّب الاتصال في منتصف ليل طرف آخر أو خارج ساعات الدوام الرسمي.',
    color: 'var(--info)',
    softBg: 'var(--info-soft)',
  },
  {
    icon: Heart,
    title: 'العائلات في الخارج',
    body: 'مهجّرو الحرب أو المغتربون بالخارج — اعرف متى يصحو ذووك ومتى يكون الوقت المناسب للاتصال والمكالمة.',
    color: 'var(--success)',
    softBg: 'var(--success-soft)',
  },
  {
    icon: Users,
    title: 'المواعيد الرياضية والترفيهية',
    body: 'كرة القدم، حفلات البث المباشر، أحداث الألعاب — احسب توقيت البث المباشر في بلدك بضغطة واحدة.',
    color: 'var(--warning)',
    softBg: 'var(--warning-soft)',
  },
  {
    icon: GraduationCap,
    title: 'المحاضرات والدراسة عن بُعد',
    body: 'تتابع دورة أو جامعة في دولة أخرى؟ احسب توقيت المحاضرة والامتحانات المباشرة حسب توقيتك المحلي بدقة.',
    color: 'var(--danger)',
    softBg: 'var(--danger-soft)',
  },
  {
    icon: Globe2,
    title: 'المتاجر والتجارة الإلكترونية',
    body: 'تتعامل مع موردين من الصين أو أوروبا أو أمريكا؟ اعرف ساعات الدوام الحقيقية لكل طرف وتجنّب التأخير في التواصل.',
    color: 'var(--accent-alt)',
    softBg: 'var(--accent-alt-soft)',
  },
]
