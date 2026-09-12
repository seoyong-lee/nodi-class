import { Suspense } from 'react';
import { Button, Icon, ResourceCard, VideoCard } from '@nodi/design-system';
import { resourceBadge } from '@nodi/shared';
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
const hero = 'max-w-page mx-auto pt-section max-[720px]:pt-20 px-gutter break-keep';
const sectionLast = `${section} pb-section`;

export async function generateStaticParams() {
  const slugs = await listResourceSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function FreeResourcePage({ params }: Props) {
  const { slug } = await params;
  const doc = await getResource(slug);
  if (!doc) {
    notFound();
  }

  const unlocked = await hasValidAccessCookie();
  const freeCount = doc.frontmatter.freeParts;
  const openParts = doc.parts.slice(0, freeCount);
  const lockedParts = doc.parts.slice(freeCount);
  const others = await getOtherResources(slug, 2);
  const downloads = doc.frontmatter.downloads;
  const isPlaceholder =
    doc.parts.length === 0 ||
    (doc.parts.length === 1 && doc.raw.trim() === '준비 중') ||
    doc.raw.trim() === '준비 중';

  return (
    <main>
      <section className={hero}>
        <div className="grid grid-cols-[1fr_420px] gap-16 items-start break-keep max-[960px]:grid-cols-1 max-[960px]:gap-6">
          <div className="flex flex-col gap-6">
            <span className="text-label text-muted">{doc.frontmatter.series}</span>
            <h1 className="m-0 font-hero text-hero font-bold text-strong max-[720px]:text-hero-m">
              {doc.frontmatter.title}
            </h1>
            <p className="m-0 max-w-[30em] text-body">{doc.frontmatter.summary}</p>
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

      {doc.parts.length > 0 ? (
        <section className={section}>
          <span className="text-label tracking-[var(--tracking-label)] text-muted">
            목차
          </span>
          <ol className="list-none m-0 mt-block-tight p-0 max-w-[720px] border-t border-line">
            {doc.parts.map((part, index) => (
              <li
                key={part.id}
                className="flex gap-4 py-inline border-b border-line text-body-sm text-strong"
              >
                <span className="shrink-0 w-6 text-caption text-muted">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span>{part.heading}</span>
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      <section className={section}>
        <div className="flex flex-col gap-block max-w-[720px]">
          {isPlaceholder ? (
            <p className="m-0 text-body">준비 중</p>
          ) : (
            openParts.map((part) => (
              <article key={part.id} className="flex flex-col gap-4">
                <span className="text-label tracking-[var(--tracking-label)] text-muted">
                  {part.heading}
                </span>
                <MdxContent source={part.body} />
              </article>
            ))
          )}
        </div>
      </section>

      {!unlocked && !isPlaceholder && lockedParts.length > 0 ? (
        <section className="max-w-page mx-auto pt-block px-gutter break-keep">
          <LockedSkeleton
            partLabels={lockedParts.map((p) => p.heading)}
            gate={
              <Suspense fallback={null}>
                <EmailGateForm
                  title="이메일을 남기면 지금 바로 열립니다"
                  description="같은 주소로 다음 자료도 보내드립니다"
                  buttonLabel="열기"
                  slug={slug}
                />
              </Suspense>
            }
          />
        </section>
      ) : null}

      {unlocked && !isPlaceholder ? (
        <section className={section}>
          <div className="flex items-center gap-inline-tight text-accent mb-block-tight">
            <Icon name="check" size={18} />
            <span className="text-body-sm">메일로도 보냈습니다</span>
          </div>
          <div className="flex flex-col gap-block max-w-[720px]">
            {lockedParts.map((part) => (
              <article key={part.id} className="flex flex-col gap-4">
                <span className="text-label tracking-[var(--tracking-label)] text-muted">
                  {part.heading}
                </span>
                <MdxContent source={part.body} />
              </article>
            ))}
          </div>
          {downloads?.length ? (
            <div className="flex flex-wrap gap-inline mt-block">
              {downloads.map((d) => (
                <Button key={d.key} variant="secondary" href="#">
                  {d.label}
                </Button>
              ))}
            </div>
          ) : null}
        </section>
      ) : null}

      {others.length > 0 ? (
        <section className={sectionLast}>
          <span className="text-label tracking-[var(--tracking-label)] text-muted">
            다른 자료
          </span>
          <div className="grid grid-cols-2 gap-6 mt-block-tight max-w-[720px] max-[720px]:grid-cols-1">
            {others.map((resource) => (
              <ResourceCard
                key={resource.frontmatter.slug}
                title={resource.frontmatter.title}
                slug={resource.frontmatter.slug}
                locked={!unlocked}
                badge={resourceBadge(resource.frontmatter.slug)}
              />
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
