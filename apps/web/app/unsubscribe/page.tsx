import { UNSUBSCRIBE_DONE_LABEL } from '../../lib/copy';
import { UnsubscribeClient } from './UnsubscribeClient';
import * as styles from '../../styles/page.css';

type Props = {
  searchParams: Promise<{ t?: string }>;
};

export default async function UnsubscribePage({ searchParams }: Props) {
  const { t } = await searchParams;

  return (
    <main className={styles.section}>
      <UnsubscribeClient token={t} doneLabel={UNSUBSCRIBE_DONE_LABEL} />
    </main>
  );
}
