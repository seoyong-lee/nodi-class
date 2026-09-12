import { UNSUBSCRIBE_DONE_LABEL } from '../../lib/copy';
import { UnsubscribeClient } from './UnsubscribeClient';

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
