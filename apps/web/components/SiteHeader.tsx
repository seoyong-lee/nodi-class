'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@nodi/design-system';
import styles from './SiteHeader.module.css';

const NAV = [
  { href: '/#free', label: '무료 자료', match: (p: string) => p === '/' || p.startsWith('/free') },
  { href: '/course', label: '클래스', match: (p: string) => p.startsWith('/course') },
  { href: '/service', label: '서비스', match: (p: string) => p.startsWith('/service') },
] as const;

export function SiteHeader({ youtubeUrl }: { youtubeUrl: string }) {
  const pathname = usePathname() || '/';

  return (
    <header className={styles.root}>
      <div className={styles.inner}>
        <Link href="/" className={styles.wordmark}>
          노디 AI 클래스
        </Link>
        <nav className={styles.nav} aria-label="주요">
          {NAV.map((item) => {
            const current = item.match(pathname);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={current ? styles.linkCurrent : styles.link}
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
