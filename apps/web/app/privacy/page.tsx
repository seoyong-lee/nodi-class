import { LegalDoc } from '../../components/LegalDoc';
import { readLegalMarkdown } from '../../lib/legal';

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
