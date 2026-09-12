import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

export type BadgeProps = {
  children?: ReactNode;
  tone?: 'default' | 'current';
};

export function Badge({ children, tone = 'default' }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-[6px] px-[9px] py-1 border border-line rounded-badge text-label leading-[1.4] whitespace-nowrap',
        tone === 'current'
          ? 'bg-accent-quiet text-accent border-transparent'
          : 'bg-raised text-muted',
      )}
    >
      {children}
    </span>
  );
}
