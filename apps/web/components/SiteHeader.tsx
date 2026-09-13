'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { TrackYouTubeButton } from './TrackYouTubeButton';
import { ThemeToggle } from './ThemeToggle';

const NAV = [
  {
    href: '/free',
    label: '전자책',
    match: (p: string) => p === '/free' || p.startsWith('/free/'),
  },
  {
    href: '/course',
    label: '클래스',
    match: (p: string) => p.startsWith('/course'),
  },
  {
    href: '/service',
    label: '서비스',
    match: (p: string) => p.startsWith('/service'),
  },
] as const;

/**
 * Do not use `text-body` here — it collides with fontSize.body in Tailwind
 * and overrides explicit text-[Npx], making inactive links look larger.
 */
function desktopNavClass(current: boolean): string {
  return current
    ? 'text-body-sm no-underline break-keep text-link hover:text-link-hover'
    : 'text-body-sm no-underline break-keep text-muted hover:text-strong';
}

function mobileNavClass(current: boolean): string {
  const base =
    'text-[13px] leading-none whitespace-nowrap break-keep py-2 px-0.5 outline-none focus-visible:text-link';
  return current
    ? `${base} text-link underline underline-offset-4 decoration-2`
    : `${base} text-muted no-underline hover:text-strong`;
}

export function SiteHeader({ youtubeUrl }: { youtubeUrl: string }) {
  const pathname = usePathname() || '/';

  return (
    <header className="sticky top-0 z-20 bg-[var(--header-bg)] border-b border-line">
      <div className="max-w-page mx-auto px-gutter h-16 flex items-center justify-between gap-6 max-[720px]:h-14 max-[720px]:gap-1.5">
        <Link
          href="/"
          className="flex min-w-0 shrink items-center gap-[10px] no-underline break-keep whitespace-nowrap hover:text-inherit max-[720px]:gap-1.5 max-[720px]:shrink-0"
        >
          <Image
            src="/brand/favicon-32x32.png"
            alt=""
            width={28}
            height={28}
            className="flex-none rounded-[6px] max-[720px]:w-5 max-[720px]:h-5"
            quality={100}
            priority
          />
          <span className="flex items-baseline gap-[6px] max-[720px]:gap-[4px]">
            <span className="text-[19px] font-bold tracking-[-0.03em] text-strong max-[720px]:text-[15px]">
              노디 AI
            </span>
            <span className="text-[19px] font-regular tracking-[-0.03em] text-muted max-[720px]:hidden">
              클래스
            </span>
          </span>
        </Link>
        <nav className="flex shrink-0 items-center gap-6 max-[720px]:hidden" aria-label="주요">
          {NAV.map((item) => {
            const current = item.match(pathname);
            return (
              <Link key={item.href} href={item.href} className={desktopNavClass(current)}>
                {item.label}
              </Link>
            );
          })}
          <ThemeToggle />
          <TrackYouTubeButton placement="nav" href={youtubeUrl} size="sm" label="유튜브" />
        </nav>
        <nav className="hidden max-[720px]:flex shrink-0 items-center gap-1 min-w-0" aria-label="주요">
          {NAV.map((item) => {
            const current = item.match(pathname);
            return (
              <Link key={item.href} href={item.href} className={mobileNavClass(current)}>
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
