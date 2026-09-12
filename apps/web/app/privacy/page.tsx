import type { Metadata } from 'next';
import { LegalDoc } from '../../components/LegalDoc';
import { readLegalMarkdown } from '../../lib/legal';
import { pageMetadata } from '../../lib/metadata';

export const metadata: Metadata = pageMetadata({
  title: '개인정보 처리방침',
  description: '노디 AI 클래스 개인정보 처리방침입니다.',
  path: '/privacy',
  noIndex: true,
});

const sectionLast =
  'max-w-page mx-auto pt-section px-gutter pb-section break-keep';

export default function PrivacyPage() {
  const source = readLegalMarkdown('privacy');

  return (
    <main>
      <section className={sectionLast}>
        <LegalDoc source={source} />
      </section>
    </main>
  );
}
