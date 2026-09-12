'use client';

import { useEffect, useState } from 'react';
import { cn } from '../../lib/cn';
import { Icon } from '../core/Icon';

export type TocPart = {
  id: string;
  heading: string;
};

export type TocProps = {
  parts: TocPart[];
  freeParts: number;
  unlocked: boolean;
};

export function Toc({ parts, freeParts, unlocked }: TocProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (!unlocked || parts.length === 0) return;

    const elements = parts
      .map((part) => document.getElementById(part.id))
      .filter((el): el is HTMLElement => el != null);

    if (elements.length === 0) return;

    const visible = new Map<string, number>();

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            visible.set(entry.target.id, entry.intersectionRatio);
          } else {
            visible.delete(entry.target.id);
          }
        }

        let bestId: string | null = null;
        let bestRatio = -1;
        for (const part of parts) {
          const ratio = visible.get(part.id);
          if (ratio != null && ratio > bestRatio) {
            bestRatio = ratio;
            bestId = part.id;
          }
        }
        if (bestId) setActiveId(bestId);
      },
      {
        rootMargin: '-20% 0px -55% 0px',
        threshold: [0, 0.25, 0.5, 0.75, 1],
      },
    );

    for (const el of elements) io.observe(el);
    return () => io.disconnect();
  }, [unlocked, parts]);

  return (
    <nav aria-label="목차">
      <ol className="list-none m-0 p-0 flex flex-col">
        {parts.map((part, i) => {
          const locked = !unlocked && i >= freeParts;
          const active = unlocked && activeId === part.id;
          const num = String(i).padStart(2, '0');

          return (
            <li key={part.id}>
              <a
                href={`#${part.id}`}
                className={cn(
                  'flex items-center gap-inline py-inline no-underline transition-ui max-[720px]:min-h-[48px]',
                  active ? 'text-link' : 'text-strong hover:text-link',
                  locked && 'text-muted',
                )}
                aria-current={active ? 'true' : undefined}
              >
                <span className="text-[13px] text-muted font-sans tabular-nums w-[2ch] flex-none">
                  {num}
                </span>
                <span className="min-w-0 flex-1 text-body-sm break-keep">
                  {part.heading}
                </span>
                {locked ? (
                  <span className="text-muted flex-none">
                    <Icon name="lock" size={14} />
                  </span>
                ) : null}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
