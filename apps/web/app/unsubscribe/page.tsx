import type { Metadata } from 'next';
import { UNSUBSCRIBE_DONE_LABEL } from '../../lib/copy';
import { pageMetadata } from '../../lib/metadata';
import { UnsubscribeClient } from './UnsubscribeClient';

export const metadata: Metadata = pageMetadata({
  title: '수신 해지',
  description: '노디 AI 클래스 이메일 수신을 해지합니다.',
  path: '/unsubscribe',
  noIndex: true,
});

type Props = {
  searchParams: Promise<{ t?: string }>;
};

export default async function UnsubscribePage({ searchParams }: Props) {
  const { t } = await searchParams;

  return (
    <main className="max-w-page mx-auto pt-section px-gutter break-keep">
      <UnsubscribeClient token={t} doneLabel={UNSUBSCRIBE_DONE_LABEL} />
    </main>
  );
}
