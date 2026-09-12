import type { Metadata } from 'next';
import { LegalDoc } from '../../components/LegalDoc';
import { readLegalMarkdown } from '../../lib/legal';
import { pageMetadata } from '../../lib/metadata';

export const metadata: Metadata = pageMetadata({
  title: '이용약관',
  description: '노디 AI 클래스 이용약관입니다.',
  path: '/terms',
  noIndex: true,
});

const sectionLast =
  'max-w-page mx-auto pt-section px-gutter pb-section break-keep';

export default function TermsPage() {
  const source = readLegalMarkdown('terms');

  return (
    <main>
      <section className={sectionLast}>
        <LegalDoc source={source} />
      </section>
    </main>
  );
}
