import {
  Briefcase,
  CircleDollarSign,
  Flag,
  GraduationCap,
  Globe2,
  LayoutGrid,
  Moon,
  Palmtree,
  Users,
} from 'lucide-react';

// Single source of truth for category → icon, shared between the filter
// grid and the active-filter tags so the same category never shows two
// different icons on the same page.
export const CATEGORY_ICON_COMPONENTS = {
  all: LayoutGrid,
  islamic: Moon,
  national: Flag,
  school: GraduationCap,
  holidays: Palmtree,
  astronomy: Globe2,
  social: Users,
  business: Briefcase,
  support: CircleDollarSign,
};
