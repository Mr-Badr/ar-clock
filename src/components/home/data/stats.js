/* data/stats.js */
import { Globe, MapPin, Moon, BookOpen, Heart } from '@phosphor-icons/react/dist/ssr'

/**
 * @typedef {{ value: string, label: string, icon: import('@phosphor-icons/react').Icon }} Stat
 * @type {Stat[]}
 */
export const STATS = [
  { value: '+3 مليون', label: 'مدينة حول العالم',   icon: Globe    },
  { value: '+22 دولة', label: 'عربية مدعومة',        icon: MapPin   },
  { value: '5 صلوات',  label: 'يومياً بدقة عالية',   icon: Moon     },
  { value: '4 مذاهب', label: 'إسلامية مدعومة',      icon: BookOpen },
  { value: '100٪',    label: 'مجاني بلا تسجيل',     icon: Heart    },
]