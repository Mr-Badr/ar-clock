'use client';

import { useRouter } from 'next/navigation';
import { CalendarSearch } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

/**
 * YearJumpSelect — replaces a flat repeated grid of "تقويم 1445 / 1446 / 1447..." cards with one
 * compact control (owner, 2026-08-13: "give him information that he can select other years in
 * unique select button"). The current year still gets its own prominent showcase link elsewhere
 * on the page — this is only for jumping to a DIFFERENT nearby year without scrolling a repeated
 * card list.
 *
 * `basePath` + year are joined as `${basePath}/${year}` — no function props, since Server
 * Components can't pass functions to Client Components.
 */
export function YearJumpSelect({
  basePath,
  currentYear,
  suffix = '',
  rangeBefore = 6,
  rangeAfter = 6,
  label = 'اختر سنة أخرى',
}: {
  basePath: string;
  currentYear: number;
  suffix?: string;
  rangeBefore?: number;
  rangeAfter?: number;
  label?: string;
}) {
  const router = useRouter();
  const years = Array.from(
    { length: rangeBefore + rangeAfter + 1 },
    (_, i) => currentYear - rangeBefore + i,
  );

  return (
    <div className="date-year-jump">
      <span className="date-year-jump-label">
        <CalendarSearch size={16} strokeWidth={1.75} aria-hidden="true" />
        {label}
      </span>
      <Select
        onValueChange={(value) => {
          const year = Number(value);
          if (Number.isFinite(year)) router.push(`${basePath}/${year}`);
        }}
      >
        <SelectTrigger className="date-year-jump-trigger" aria-label={label}>
          <SelectValue placeholder={`${currentYear}${suffix}`} />
        </SelectTrigger>
        <SelectContent>
          {years.map((year) => (
            <SelectItem key={year} value={String(year)}>
              {year}
              {suffix}
              {year === currentYear ? ' (الحالية)' : ''}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
