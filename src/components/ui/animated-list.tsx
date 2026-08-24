'use client';

// Real Magic UI AnimatedList (magicui.design/docs/components/animated-list), unmodified
// mechanics — items are revealed one at a time on a `delay` timer via a spring
// scale+opacity entrance (AnimatePresence + motion), each newly-revealed item stacking above
// the rest (`itemsToShow` = slice+reverse of children seen so far). Used by
// HolidaysAnimatedList.client.jsx (owner, 2026-08-21: "show the cards like this component
// exactly").
import React, { useEffect, useMemo, useState, type ComponentPropsWithoutRef } from 'react';
import { AnimatePresence, motion, type MotionProps } from 'motion/react';

import { cn } from '@/lib/utils';

export function AnimatedListItem({ children }: { children: React.ReactNode }) {
  const animations: MotionProps = {
    initial: { scale: 0, opacity: 0 },
    animate: { scale: 1, opacity: 1, originY: 0 },
    exit: { scale: 0, opacity: 0 },
    transition: { type: 'spring', stiffness: 350, damping: 40 },
  };

  return (
    <motion.div {...animations} layout className="mx-auto w-full">
      {children}
    </motion.div>
  );
}

export interface AnimatedListProps extends ComponentPropsWithoutRef<'div'> {
  children: React.ReactNode;
  delay?: number;
}

export const AnimatedList = React.memo(
  ({ children, className, delay = 1000, ...props }: AnimatedListProps) => {
    const [index, setIndex] = useState(0);
    const childrenArray = useMemo(() => React.Children.toArray(children), [children]);

    useEffect(() => {
      let timeout: ReturnType<typeof setTimeout> | null = null;

      if (index < childrenArray.length - 1) {
        timeout = setTimeout(() => {
          setIndex((prevIndex) => (prevIndex + 1) % childrenArray.length);
        }, delay);
      }

      return () => {
        if (timeout !== null) clearTimeout(timeout);
      };
    }, [index, delay, childrenArray.length]);

    const itemsToShow = useMemo(() => childrenArray.slice(0, index + 1).reverse(), [index, childrenArray]);

    return (
      <div className={cn('flex flex-col items-center gap-4', className)} {...props}>
        <AnimatePresence>
          {itemsToShow.map((item) => (
            <AnimatedListItem key={(item as React.ReactElement).key}>{item}</AnimatedListItem>
          ))}
        </AnimatePresence>
      </div>
    );
  },
);

AnimatedList.displayName = 'AnimatedList';
