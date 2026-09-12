import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { SiteFooter } from '@nodi/design-system';
import '@nodi/design-system/tokens/fonts.css';
import '@nodi/design-system/tokens/colors.css';
import '@nodi/design-system/tokens/typography.css';
import '@nodi/design-system/tokens/spacing.css';
import '@nodi/design-system/tokens/shape.css';
import '@nodi/design-system/tokens/motion.css';
import '@nodi/design-system/tokens/base.css';
import '@nodi/design-system/tokens/styles.css';
import '@nodi/design-system/mdx.css';
import './globals.css';
import { SiteHeader } from '../components/SiteHeader';
import { AnalyticsProvider } from '../components/AnalyticsProvider';
import {
  OPERATOR,
  SITE_URL,
  THREADS_URL,
  YOUTUBE_URL,
  getBusinessLines,
  getSocialLinks,
  getYoutubeUrl,
} from '../lib/business';
import {
  DEFAULT_DESCRIPTION,
  OG_IMAGE,
  SITE_NAME,
} from '../lib/metadata';

const THEME_INIT_SCRIPT = `
try {
  document.documentElement.dataset.theme =
    localStorage.getItem('nodi-theme') === 'light' ? 'light' : 'dark';
} catch {
  document.documentElement.dataset.theme = 'dark';
}
`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: '노디', url: getYoutubeUrl() }],
  creator: '노디',
  publisher: OPERATOR,
  category: 'education',
  keywords: [
    'AI 클래스',
    '클로드',
    'Claude',
    'AI 디자인',
    'AI 프롬프트',
    'PPT',
    '랜딩페이지',
  ],
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  icons: {
    icon: [
      { url: '/brand/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/brand/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/brand/favicon-48x48.png', sizes: '48x48', type: 'image/png' },
    ],
    apple: [{ url: '/brand/apple-touch-icon.png', sizes: '180x180' }],
  },
  manifest: '/site.webmanifest',
  openGraph: {
    title: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
    url: '/',
    siteName: SITE_NAME,
    type: 'website',
    locale: 'ko_KR',
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} — 코딩 몰라도, 이제 AI로 직접 만들 수 있습니다`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
    images: [OG_IMAGE],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const business = getBusinessLines();
  const socialLinks = getSocialLinks();
  const youtubeUrl = getYoutubeUrl();
  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description: DEFAULT_DESCRIPTION,
    inLanguage: 'ko-KR',
    publisher: {
      '@type': 'Organization',
      name: OPERATOR,
      url: SITE_URL,
      sameAs: [YOUTUBE_URL, THREADS_URL],
    },
  };

  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <AnalyticsProvider />
        <div className="min-h-dvh flex flex-col">
          <SiteHeader youtubeUrl={youtubeUrl} />
          <div className="flex-1">{children}</div>
          <SiteFooter
            operator={OPERATOR}
            business={business}
            links={[
              // 사업자등록 전까지 개인정보·환불 링크 숨김
              { label: '이용약관', href: '/terms' },
            ]}
            socialLinks={socialLinks}
          />
        </div>
      </body>
    </html>
  );
}
