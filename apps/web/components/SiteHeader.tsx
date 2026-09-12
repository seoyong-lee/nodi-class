'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { TrackYouTubeButton } from './TrackYouTubeButton';
import { ThemeToggle } from './ThemeToggle';

const NAV = [
  {
    href: '/free',
    label: '무료 자료',
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

export function SiteHeader({ youtubeUrl }: { youtubeUrl: string }) {
  const pathname = usePathname() || '/';

  return (
    <header className="sticky top-0 z-20 bg-[var(--header-bg)] border-b border-line">
      <div className="max-w-page mx-auto px-gutter h-16 flex items-center justify-between gap-6 max-[720px]:h-14 max-[720px]:justify-center max-[720px]:gap-3">
        <Link
          href="/"
          className="flex min-w-0 shrink items-center gap-[10px] no-underline break-keep whitespace-nowrap hover:text-inherit max-[720px]:gap-2"
        >
          <Image
            src="/brand/favicon-32x32.png"
            alt=""
            width={28}
            height={28}
            className="flex-none self-center rounded-[6px] max-[720px]:w-6 max-[720px]:h-6"
            quality={100}
            priority
          />
          <span className="flex items-baseline gap-[6px] max-[720px]:gap-[5px]">
            <span className="text-[19px] font-bold tracking-[-0.03em] text-strong max-[720px]:text-[17px]">
              노디 AI
            </span>
            <span className="text-[19px] font-regular tracking-[-0.03em] text-body max-[720px]:text-[17px]">
              클래스
            </span>
          </span>
        </Link>
        <nav
          className="flex shrink-0 items-center gap-6 max-[720px]:hidden"
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
                    ? 'text-body-sm no-underline break-keep text-link hover:text-link-hover'
                    : 'text-body-sm no-underline break-keep text-body hover:text-strong'
                }
              >
                {item.label}
              </Link>
            );
          })}
          <ThemeToggle />
          <TrackYouTubeButton placement="nav" href={youtubeUrl} size="sm" label="유튜브" />
        </nav>
        <div className="hidden max-[720px]:flex shrink-0 items-center self-center gap-2">
          <ThemeToggle />
          <TrackYouTubeButton placement="nav" href={youtubeUrl} size="sm" label="유튜브" />
        </div>
      </div>
      <nav
        className="hidden max-[720px]:flex justify-center items-center gap-5 px-gutter pb-[14px]"
        aria-label="주요 모바일"
      >
        {NAV.map((item) => {
          const current = item.match(pathname);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={
                current
                  ? 'text-[14px] no-underline break-keep text-link hover:text-link-hover'
                  : 'text-[14px] no-underline break-keep text-body hover:text-strong'
              }
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
