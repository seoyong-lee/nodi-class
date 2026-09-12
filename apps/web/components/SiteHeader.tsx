'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@nodi/design-system';

const NAV = [
  { href: '/#free', label: '무료 자료', match: (p: string) => p === '/' || p.startsWith('/free') },
  { href: '/course', label: '클래스', match: (p: string) => p.startsWith('/course') },
  { href: '/service', label: '서비스', match: (p: string) => p.startsWith('/service') },
] as const;

export function SiteHeader({ youtubeUrl }: { youtubeUrl: string }) {
  const pathname = usePathname() || '/';

  return (
    <header className="sticky top-0 z-20 bg-[color-mix(in_srgb,var(--surface-page)_92%,transparent)] border-b border-line">
      <div className="max-w-page mx-auto px-gutter min-h-16 flex items-center justify-between gap-3 max-[720px]:min-h-14 max-[720px]:flex-wrap max-[720px]:py-2">
        <Link
          href="/"
          className="flex items-baseline gap-[6px] no-underline break-keep whitespace-nowrap hover:text-inherit"
        >
          <span className="text-[19px] font-bold tracking-[-0.03em] text-strong">
            노디 AI
          </span>
          <span className="text-[19px] font-regular tracking-[-0.03em] text-body">
            클래스
          </span>
        </Link>
        <nav
          className="flex items-center gap-3 flex-wrap justify-end max-[720px]:w-full max-[720px]:gap-5 max-[720px]:justify-start"
          aria-label="주요"
        >
          {NAV.map((item) => {
            const current = item.match(pathname);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={
                  current
                    ? 'text-body-sm no-underline break-keep text-accent hover:text-accent-hover'
                    : 'text-body-sm no-underline break-keep text-body hover:text-strong'
                }
              >
                {item.label}
              </Link>
            );
          })}
          <Button variant="secondary" size="sm" icon="arrow-up-right" href={youtubeUrl}>
            유튜브
          </Button>
        </nav>
      </div>
    </header>
  );
}
