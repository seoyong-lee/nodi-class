import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

export type BadgeTone = 'default' | 'current' | 'claude' | 'ppt' | 'design';

export type BadgeProps = {
  children?: ReactNode;
  tone?: BadgeTone;
};

export function Badge({ children, tone = 'default' }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-[6px] px-[9px] py-[4px] border rounded-badge text-label leading-[1.4] tracking-[var(--tracking-body)] whitespace-nowrap',
        tone === 'current' && 'bg-accent-quiet text-accent border-transparent',
        tone === 'claude' && 'bg-tag-claude-quiet text-tag-claude border-transparent',
        tone === 'ppt' && 'bg-tag-ppt-quiet text-tag-ppt border-transparent',
        tone === 'design' && 'bg-tag-design-quiet text-tag-design border-transparent',
        tone === 'default' && 'bg-raised text-muted border-line',
      )}
    >
      {children}
    </span>
  );
}
