import type { ReactNode } from 'react';
import { Icon } from '../core/Icon';

export type CalloutProps = {
  tone: 'tip' | 'warn';
  children: ReactNode;
};

export function Callout({ tone, children }: CalloutProps) {
  const icon = tone === 'tip' ? 'check' : 'alert-triangle';

  return (
    <aside className="flex gap-inline items-start p-5 bg-raised border-l border-l-line-strong break-keep">
      <span className="text-muted mt-[2px]">
        <Icon name={icon} size={18} />
      </span>
      <div className="min-w-0 flex-1 text-body-sm text-body [&_p]:m-0 [&_p+p]:mt-inline">
        {children}
      </div>
    </aside>
  );
}
