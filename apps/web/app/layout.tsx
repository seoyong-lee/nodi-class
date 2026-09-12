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
import {
  OPERATOR,
  SITE_URL,
  getBusinessLines,
  getSocialLinks,
  getYoutubeUrl,
} from '../lib/business';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: '노디 AI 클래스',
  description:
    '랜딩페이지·브랜드·PPT. 유튜브 노디 AI에서 쓴 프롬프트와 가이드를 그대로 드립니다.',
  applicationName: '노디 AI 클래스',
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
    title: '노디 AI 클래스',
    description:
      '랜딩페이지·브랜드·PPT. 유튜브 노디 AI에서 쓴 프롬프트와 가이드를 그대로 드립니다.',
    type: 'website',
    locale: 'ko_KR',
    images: [
      {
        url: '/brand/android-chrome-512x512.png',
        width: 512,
        height: 512,
        alt: '노디 AI 클래스',
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: '노디 AI 클래스',
    description:
      '랜딩페이지·브랜드·PPT. 유튜브 노디 AI에서 쓴 프롬프트와 가이드를 그대로 드립니다.',
    images: ['/brand/android-chrome-512x512.png'],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const business = getBusinessLines();
  const socialLinks = getSocialLinks();
  const youtubeUrl = getYoutubeUrl();

  return (
    <html lang="ko">
      <body>
        <div className="min-h-dvh flex flex-col">
          <SiteHeader youtubeUrl={youtubeUrl} />
          <div className="flex-1">{children}</div>
          <SiteFooter
            operator={OPERATOR}
            business={business}
            links={[
              { label: '이용약관', href: '/terms' },
              { label: '개인정보처리방침', href: '/privacy' },
              { label: '환불 정책', href: '/refund' },
            ]}
            socialLinks={socialLinks}
          />
        </div>
      </body>
    </html>
  );
}
