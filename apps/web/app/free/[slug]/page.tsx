import { Suspense } from 'react';
import { Button, Icon, ResourceCard, VideoCard } from '@nodi/design-system';
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

export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{ slug: string }>;
};

const section = 'max-w-page mx-auto pt-section px-gutter break-keep';
const sectionLast = `${section} pb-section`;

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
  const openParts = doc.parts.slice(0, freeCount);
  const lockedParts = doc.parts.slice(freeCount);
  const others = getOtherResources(slug, 2);
  const downloads = doc.frontmatter.downloads;
  const isPlaceholder =
    doc.parts.length === 0 ||
    (doc.parts.length === 1 && doc.raw.trim() === '준비 중') ||
    doc.raw.trim() === '준비 중';

  return (
    <main>
      <section className={section}>
        <div className="grid grid-cols-[1fr_minmax(240px,420px)] gap-8 items-start break-keep max-[960px]:grid-cols-1">
          <div className="flex flex-col gap-3">
            <span className="text-label text-muted">{doc.frontmatter.series}</span>
            <h1 className="m-0 font-sans text-hero max-[720px]:text-hero-m font-bold text-strong">
              {doc.frontmatter.title}
            </h1>
            <p className="m-0 max-w-measure text-body">{doc.frontmatter.summary}</p>
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
        <section className={section}>
          <span className="text-label tracking-[var(--tracking-label)] text-muted">
            목차
          </span>
          <ol className="list-none mt-block-tight mb-0 mx-0 p-0 max-w-[720px] border-t border-line">
            {doc.parts.map((part, index) => (
              <li
                key={part.id}
                className="flex gap-2 py-3 border-b border-line"
              >
                <span className="flex-none w-6 text-caption text-muted">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="text-body-sm text-body">{part.heading}</span>
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      <section className={section}>
        {isPlaceholder ? (
          <p className="m-0 max-w-measure text-body">준비 중</p>
        ) : (
          openParts.map((part) => (
            <article key={part.id} className="max-w-[720px] mb-5" id={part.id}>
              <MdxContent source={`## ${part.heading}\n\n${part.body}`} />
            </article>
          ))
        )}
      </section>

      {!unlocked ? (
        <section className={section}>
          <div className="max-w-[640px] mb-5">
            <Suspense fallback={null}>
              <EmailGateForm
                title="이메일을 남기면 지금 바로 열립니다"
                description="같은 주소로 다음 자료도 보내드립니다"
                buttonLabel="열기"
                slug={slug}
              />
            </Suspense>
          </div>
          {lockedParts.length > 0 ? (
            <div className="mt-3">
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
        <section className={section}>
          <div className="inline-flex items-center gap-inline-tight text-strong break-keep">
            <Icon name="check" size={18} />
            <span>메일로도 보냈습니다</span>
          </div>
          {downloads && downloads.length > 0 ? (
            <div className="flex flex-wrap gap-inline my-4 mb-5">
              {downloads.map((d) => (
                <Button key={d.key} variant="secondary" href="#">
                  {d.label}
                </Button>
              ))}
            </div>
          ) : null}
          {!isPlaceholder
            ? lockedParts.map((part) => (
                <article key={part.id} className="max-w-[720px] mb-5" id={part.id}>
                  <MdxContent source={`## ${part.heading}\n\n${part.body}`} />
                </article>
              ))
            : null}
        </section>
      )}

      {others.length > 0 ? (
        <section className={sectionLast}>
          <span className="text-label tracking-[var(--tracking-label)] text-muted">
            다른 자료
          </span>
          <div className="grid grid-cols-2 gap-3 mt-block-tight max-w-[720px] max-[720px]:grid-cols-1">
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
