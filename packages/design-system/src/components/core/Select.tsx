import type { SelectHTMLAttributes } from 'react';
import { cn } from '../../lib/cn';
import { Icon } from './Icon';

export type SelectProps = SelectHTMLAttributes<HTMLSelectElement>;

/** Native select with appearance reset + lucide chevron (token color, no hex SVG). */
export function Select({ className, children, ...props }: SelectProps) {
  return (
    <div className="relative w-full min-w-0">
      <select
        className={cn(
          'w-full box-border appearance-none py-[14px] pl-4 pr-12 bg-field text-strong border border-line rounded font-sans text-body-sm leading-[1.4] outline-none transition-ui focus:border-accent [color-scheme:dark]',
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <span
        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted"
        aria-hidden
      >
        <Icon name="chevron-down" size={16} />
      </span>
    </div>
  );
}
