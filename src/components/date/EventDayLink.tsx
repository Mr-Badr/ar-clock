// src/components/date/EventDayLink.tsx
// Client component — isolated so YearlyCalendar stays a server component.
// Renders an event day cell: success-colored border + shadcn Tooltip on hover.

'use client';

import Link from 'next/link';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface EventDayLinkProps {
  href: string;
  day: number;
  eventName?: string;
  cellBg: string;
  dayColor: string;
  hijriColor: string;
  hijriLabel?: string;
}

export function EventDayLink({
  href,
  day,
  eventName,
  cellBg,
  dayColor,
  hijriColor,
  hijriLabel,
}: EventDayLinkProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href={href}
            rel="nofollow"
            className="relative flex flex-col items-center justify-center rounded-md transition-colors group"
            style={{
              minHeight: '34px',
              background: cellBg,
              border: '1px solid var(--success)',
            }}
          >
            {/* Gregorian day number */}
            <span
              className="text-sm font-bold leading-none tabular-nums"
              style={{ color: dayColor }}
            >
              {day}
            </span>

            {/* Hijri day sub-label */}
            {hijriLabel && (
              <span
                className="text-2xs leading-none mt-0.5 tabular-nums"
                style={{ color: hijriColor, fontWeight: '700' }}
              >
                {hijriLabel}
              </span>
            )}
          </Link>
        </TooltipTrigger>

        {eventName && (
          <TooltipContent side="bottom">
            <p>{eventName}</p>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
}
