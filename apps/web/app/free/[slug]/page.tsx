import { Suspense } from 'react';
import { Button, Icon, ResourceCard } from '@nodi/design-system';
import { resourceBadge, resourceThumbnail } from '@nodi/shared';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { EmailGateForm } from '../../../components/EmailGateForm';
import { LockedSkeleton } from '../../../components/LockedSkeleton';
import { MdxContent } from '../../../components/MdxContent';
import { hasValidAccessCookie } from '../../../lib/access';
import { getOtherResources, getResource, listResourceSlugs } from '../../../lib/resources';

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
  const badge = resourceBadge(slug);
  const cover = resourceThumbnail(slug);

  return (
    <main>
      <section className={hero}>
        <div className="grid grid-cols-[1fr_380px] gap-16 items-start break-keep max-[960px]:grid-cols-1 max-[960px]:gap-6">
          <div className="flex flex-col gap-6">
            <span className="text-label text-muted">{doc.frontmatter.series}</span>
            <h1 className="m-0 font-hero text-hero font-bold text-strong max-[720px]:text-hero-m">
              {doc.frontmatter.title}
            </h1>
            <p className="m-0 max-w-[30em] text-body">{doc.frontmatter.summary}</p>
          </div>
          <aside className="flex flex-col gap-inline bg-card border border-line rounded overflow-hidden pb-5 min-w-0 max-[960px]:max-w-[320px]">
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-raised">
              <Image
                className="object-cover object-center"
                src={cover}
                alt=""
                fill
                sizes="(max-width: 960px) 320px, 380px"
                priority
              />
            </div>
            <div className="flex flex-col gap-1 px-4">
              <span className="text-body font-bold text-strong break-keep">
                {doc.frontmatter.title}
              </span>
              <span className="text-caption text-muted break-keep">
                {badge} · 바로 써볼 수 있는 무료 자료입니다
              </span>
            </div>
          </aside>
        </div>
      </section>

      {doc.parts.length > 0 ? (
        <section className={section}>
          <span className="text-label tracking-[var(--tracking-label)] text-muted">목차</span>
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
          <span className="text-label tracking-[var(--tracking-label)] text-muted">다른 자료</span>
          <div className="grid grid-cols-2 gap-6 mt-block-tight max-w-[720px] max-[720px]:grid-cols-1">
            {others.map((resource) => (
              <ResourceCard
                key={resource.frontmatter.slug}
                title={resource.frontmatter.title}
                slug={resource.frontmatter.slug}
                thumbnail={resourceThumbnail(resource.frontmatter.slug)}
              />
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
