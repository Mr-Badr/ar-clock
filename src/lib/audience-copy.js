export const QUESTION_NAV_LABEL = 'قبل الاعتماد';

export const QUERY_CLUSTER_TITLES = Object.freeze({
  priority: 'الأسئلة التي يبدأ منها الزوار',
  direct: 'إجابات مباشرة',
  decision: 'مقارنات تساعدك على القرار',
  localAndTimely: 'صيغ محلية ويومية',
});

export function buildQuestionNavItem(href, description) {
  return {
    href,
    label: QUESTION_NAV_LABEL,
    description,
  };
}
