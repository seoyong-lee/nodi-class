import { Icon, ResourceCard, VideoCard } from '@nodi/design-system';
import { notFound } from 'next/navigation';
import { EmailGateForm } from '../../../components/EmailGateForm';
import { LockedSkeleton } from '../../../components/LockedSkeleton';
import { MdxContent } from '../../../components/MdxContent';
import { hasValidAccessCookie } from '../../../lib/access';
import {
  getOtherResources,
  getResource,
  listResourceSlugs,
} from '../../../lib/resources';
import styles from './free.module.css';
import pageStyles from '../../../styles/page.module.css';

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return listResourceSlugs().map((slug) => ({ slug }));
}

export default async function FreeResourcePage({ params }: Props) {
  const { slug } = await params;
  const slugs = listResourceSlugs();
  if (!slugs.includes(slug)) {
    notFound();
  }

  const doc = getResource(slug);
  const unlocked = await hasValidAccessCookie();
  const freeCount = doc.frontmatter.freeParts;
  const openParts = unlocked ? doc.parts : doc.parts.slice(0, freeCount);
  const lockedParts = unlocked ? [] : doc.parts.slice(freeCount);
  const others = getOtherResources(slug, 2);
  const isPlaceholder =
    doc.parts.length === 0 ||
    (doc.parts.length === 1 && doc.raw.trim() === '준비 중') ||
    doc.raw.trim() === '준비 중';

  return (
    <main>
      <section className={pageStyles.section}>
        <div className={styles.hero}>
          <div className={styles.heroCopy}>
            <span className={pageStyles.eyebrow}>{doc.frontmatter.series}</span>
            <h1 className={pageStyles.heroTitle}>{doc.frontmatter.title}</h1>
            <p className={pageStyles.lead}>{doc.frontmatter.summary}</p>
          </div>
          {doc.frontmatter.youtube ? (
            <VideoCard
              title={doc.frontmatter.title}
              note="이 영상에서 소개했습니다"
              href={doc.frontmatter.youtube}
            />
          ) : null}
        </div>
      </section>

      {!isPlaceholder && doc.parts.length > 0 ? (
        <section className={pageStyles.section}>
          <span className={pageStyles.sectionLabel}>목차</span>
          <ol className={styles.toc}>
            {doc.parts.map((part, index) => (
              <li key={part.id} className={styles.tocItem}>
                <span className={styles.tocNum}>
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className={styles.tocTitle}>{part.heading}</span>
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      <section className={pageStyles.section}>
        {isPlaceholder ? (
          <p className={pageStyles.lead}>준비 중</p>
        ) : (
          openParts.map((part) => (
            <article key={part.id} className={styles.part} id={part.id}>
              <MdxContent source={`## ${part.heading}\n\n${part.body}`} />
            </article>
          ))
        )}
      </section>

      {!unlocked ? (
        <section className={pageStyles.section}>
          <div className={styles.gate}>
            <EmailGateForm
              title="이메일을 남기면 지금 바로 열립니다"
              description="같은 주소로 다음 자료도 보내드립니다"
              buttonLabel="열기"
            />
          </div>
          {lockedParts.length > 0 ? (
            <div className={styles.locked}>
              <LockedSkeleton
                partLabels={lockedParts.map((p) => {
                  const m = /^Part\s+(\d+)/i.exec(p.heading);
                  return m ? `PART ${m[1]}` : p.heading;
                })}
              />
            </div>
          ) : null}
        </section>
      ) : (
        <section className={pageStyles.section}>
          <div className={styles.opened}>
            <Icon name="check" size={18} />
            <span>메일로도 보냈습니다</span>
          </div>
        </section>
      )}

      {others.length > 0 ? (
        <section className={pageStyles.sectionLast}>
          <span className={pageStyles.sectionLabel}>다른 자료</span>
          <div className={styles.others}>
            {others.map((resource) => (
              <ResourceCard
                key={resource.frontmatter.slug}
                title={resource.frontmatter.title}
                slug={resource.frontmatter.slug}
                locked={!unlocked}
              />
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
