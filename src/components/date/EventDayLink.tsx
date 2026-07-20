// src/components/date/EventDayLink.tsx
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
  hijriLabel?: string;
  className: string;
  nofollow?: boolean;
}

export function EventDayLink({
  href,
  day,
  eventName,
  hijriLabel,
  className,
  nofollow,
}: EventDayLinkProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href={href}
            className={className}
            rel={nofollow ? 'nofollow' : undefined}
          >
            <span className="date-day-main">
              {day}
            </span>
            {hijriLabel && (
              <span className="date-day-sub">
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
