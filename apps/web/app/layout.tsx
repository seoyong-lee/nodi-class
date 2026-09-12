import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import '@nodi/design-system/tokens/fonts.css';
import '@nodi/design-system/tokens/colors.css';
import '@nodi/design-system/tokens/typography.css';
import '@nodi/design-system/tokens/spacing.css';
import '@nodi/design-system/tokens/shape.css';
import '@nodi/design-system/tokens/motion.css';
import '@nodi/design-system/tokens/base.css';
import '@nodi/design-system/tokens/styles.css';

export const metadata: Metadata = {
  title: '노디 AI 클래스',
  description: '유튜브 노디 AI에서 쓴 자료를 그대로 드립니다.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
