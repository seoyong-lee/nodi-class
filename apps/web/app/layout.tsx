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
import { SiteHeader } from '../components/SiteHeader';
import { getBusinessLines, getSocialLinks, getYoutubeUrl } from '../lib/business';
import styles from '../styles/page.module.css';

export const metadata: Metadata = {
  title: '노디 AI 클래스',
  description:
    '랜딩페이지·브랜드·PPT. 유튜브 노디 AI에서 쓴 프롬프트와 가이드를 그대로 드립니다.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const business = getBusinessLines();
  const socialLinks = getSocialLinks();
  const youtubeUrl = getYoutubeUrl();

  return (
    <html lang="ko">
      <body>
        <div className={styles.shell}>
          <SiteHeader youtubeUrl={youtubeUrl} />
          <div className={styles.main}>{children}</div>
          <SiteFooter
            operator="Cascades"
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
