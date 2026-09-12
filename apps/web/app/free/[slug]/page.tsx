import fs from 'node:fs';
import path from 'node:path';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import {
  AccessBadge,
  Button,
  Icon,
  ResourceCard,
  SectionHeading,
  Toc,
} from '@nodi/design-system';
import { resourceCardBadges, resourceThumbnail } from '@nodi/shared';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { EmailGateForm } from '../../../components/EmailGateForm';
import { LockedParts } from '../../../components/LockedParts';
import { MdxContent } from '../../../components/MdxContent';
import { StickyUnlockBar } from '../../../components/StickyUnlockBar';
import { TrackPageView } from '../../../components/TrackPageView';
import { TrackUnlockedResource } from '../../../components/TrackUnlockedResource';
import { TrackYouTubeButton } from '../../../components/TrackYouTubeButton';
import { hasValidAccessCookie } from '../../../lib/access';
import { BUILDING_EXTRA_FIELD } from '../../../lib/building';
import {
  GATE_ACTIVE_LABEL,
  RESOURCE_AUDIENCE_HEADING,
  RESOURCE_AUDIENCE_ITEMS,
  RESOURCE_AUTHOR_BODY,
  RESOURCE_AUTHOR_NAME,
  RESOURCE_AUTHOR_SMALL,
  RESOURCE_GATE_BUTTON,
  RESOURCE_GATE_DESCRIPTION,
  RESOURCE_GATE_HELPER,
  RESOURCE_GATE_NOTICE,
  RESOURCE_GATE_TITLE,
  RESOURCE_HERO_CTA,
  RESOURCE_HERO_HELPER,
  RESOURCE_HERO_UNLOCKED_CTA,
  RESOURCE_INCLUDED_AFTER,
  RESOURCE_INCLUDED_HEADING,
  RESOURCE_INTRO_BODY,
  RESOURCE_INTRO_LEAD,
  RESOURCE_ORIGIN_BODY,
  RESOURCE_RELATED_HEADING,
  RESOURCE_VALUE_BODY,
} from '../../../lib/copy';
import { getOtherResources, getResource, listResourceSlugs } from '../../../lib/resources';
import { pageMetadata } from '../../../lib/metadata';

export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const doc = await getResource(slug);

  if (!doc) {
    return pageMetadata({
      title: '자료를 찾을 수 없습니다',
      description: '요청한 무료 자료를 찾을 수 없습니다.',
      path: `/free/${slug}`,
      noIndex: true,
    });
  }

  return pageMetadata({
    title: doc.frontmatter.title,
    description: doc.frontmatter.summary.replace(/\s+/g, ' ').trim(),
    path: `/free/${slug}`,
  });
}

const section = 'max-w-page mx-auto pt-section px-gutter break-keep';
const hero = 'max-w-page mx-auto pt-section max-[720px]:pt-20 px-gutter break-keep';
const sectionLast = `${section} pb-section`;
const bodyCol = 'max-w-[720px] mx-auto w-full';
const prose = 'm-0 text-body whitespace-pre-line break-keep';

function resolveCoverSrc(slug: string, cover?: string): string {
  const fallback = resourceThumbnail(slug);
  if (!cover) return fallback;
  const publicPath = path.join(process.cwd(), 'public', cover.replace(/^\//, ''));
  return fs.existsSync(publicPath) ? cover : fallback;
}

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
  const previewParts = doc.parts.slice(0, freeCount);
  const restParts = doc.parts.slice(freeCount);
  const others = await getOtherResources(slug, 2);
  const downloads = doc.frontmatter.downloads;
  const isPlaceholder =
    doc.parts.length === 0 ||
    (doc.parts.length === 1 && doc.raw.trim() === '준비 중') ||
    doc.raw.trim() === '준비 중';

  const access = doc.frontmatter.access ?? 'free';
  const cover = resolveCoverSrc(slug, doc.frontmatter.cover);
  const youtube = doc.frontmatter.youtube;
  const included = doc.frontmatter.included ?? [];
  const showLocked = !unlocked && !isPlaceholder && restParts.length > 0;

  return (
    <main>
      <TrackPageView
        event={{
          name: 'Viewed Resource Page',
          props: {
            resource_slug: slug,
            access_state: unlocked ? 'unlocked' : 'locked',
          },
        }}
      />
      {unlocked ? <TrackUnlockedResource slug={slug} unlocked /> : null}
      <section className={hero}>
        <div className="grid grid-cols-[7fr_5fr] gap-16 items-start break-keep max-[720px]:grid-cols-1 max-[720px]:gap-6">
          <div className="flex flex-col gap-6 min-w-0 max-[720px]:order-2">
            <div className="flex flex-wrap items-center gap-inline">
              <span className="text-label text-muted">{doc.frontmatter.series}</span>
              <AccessBadge access={access} />
            </div>
            <h1 className="m-0 font-hero font-bold text-strong text-[60px] leading-[var(--leading-hero)] tracking-[var(--tracking-hero)] max-[720px]:text-[36px]">
              {doc.frontmatter.title}
            </h1>
            <p className="m-0 max-w-[30em] text-body whitespace-pre-line">
              {doc.frontmatter.summary}
            </p>
            <div className="flex flex-col gap-inline-tight max-[720px]:hidden">
              <div className="flex flex-wrap gap-inline">
                <Button
                  variant="primary"
                  href={unlocked ? undefined : '#gate'}
                  disabled={unlocked}
                >
                  {unlocked ? RESOURCE_HERO_UNLOCKED_CTA : RESOURCE_HERO_CTA}
                </Button>
                {youtube ? (
                  <TrackYouTubeButton
                    placement="resource_video"
                    href={youtube}
                    label="영상으로 보기"
                  />
                ) : null}
              </div>
              {!unlocked ? (
                <p className="m-0 text-[13px] text-muted">{RESOURCE_HERO_HELPER}</p>
              ) : null}
            </div>
          </div>
          <div className="min-w-0 max-[720px]:order-1">
            <Image
              className="w-full h-auto rounded border-hairline"
              src={cover}
              alt=""
              width={1813}
              height={1086}
              quality={100}
              priority
              unoptimized
              sizes="(max-width: 720px) 100vw, 40vw"
            />
          </div>
        </div>
      </section>

      <section className={section}>
        <div className={`${bodyCol} flex flex-col gap-block`}>
          <div className="flex flex-col gap-6">
            <p className="m-0 text-h2 font-bold text-strong break-keep max-[720px]:text-[20px]">
              {RESOURCE_INTRO_LEAD}
            </p>
            {RESOURCE_INTRO_BODY.map((paragraph) => (
              <p key={paragraph} className={prose}>
                {paragraph}
              </p>
            ))}
          </div>

          {included.length > 0 ? (
            <div className="flex flex-col gap-6">
              <h2 className="m-0 text-h2 font-bold text-strong break-keep max-[720px]:text-[20px]">
                {RESOURCE_INCLUDED_HEADING}
              </h2>
              <ul className="list-none m-0 p-0 flex flex-col">
                {included.map((item) => (
                  <li
                    key={item}
                    className="flex items-baseline gap-3 py-inline border-b border-line text-body break-keep"
                  >
                    <span className="text-accent shrink-0" aria-hidden>
                      ·
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              {RESOURCE_INCLUDED_AFTER.map((paragraph) => (
                <p key={paragraph} className={prose}>
                  {paragraph}
                </p>
              ))}
            </div>
          ) : null}

          <div className="flex flex-col gap-6">
            <h2 className="m-0 text-h2 font-bold text-strong break-keep max-[720px]:text-[20px]">
              {RESOURCE_AUDIENCE_HEADING}
            </h2>
            <ul className="list-none m-0 p-0 flex flex-col">
              {RESOURCE_AUDIENCE_ITEMS.map((item) => (
                <li
                  key={item}
                  className="flex items-baseline gap-3 py-inline border-b border-line text-body break-keep"
                >
                  <span className="text-accent shrink-0" aria-hidden>
                    ·
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <p className={prose}>{RESOURCE_VALUE_BODY}</p>
          <p className={prose}>{RESOURCE_ORIGIN_BODY}</p>
        </div>
      </section>

      {doc.parts.length > 0 ? (
        <section className={section}>
          <div className={`${bodyCol} flex flex-col gap-block`}>
            <SectionHeading index="02" label="들어 있는 내용" />
            <Toc
              parts={doc.parts.map((p) => ({ id: p.id, heading: p.heading }))}
              freeParts={freeCount}
              unlocked={unlocked}
            />
          </div>
        </section>
      ) : null}

      {!isPlaceholder && previewParts.length > 0 ? (
        <section className={section}>
          <div className={`flex flex-col gap-block ${bodyCol}`}>
            {previewParts.map((part, index) => (
              <article
                key={part.id}
                className={`flex flex-col gap-4 ${
                  !unlocked && index === previewParts.length - 1
                    ? 'pb-block border-b border-line'
                    : ''
                }`}
              >
                <h2
                  id={part.id}
                  className="m-0 scroll-mt-24 text-h3 font-bold text-strong break-keep"
                >
                  {part.heading}
                </h2>
                <MdxContent source={part.body} resourceSlug={slug} />
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {isPlaceholder ? (
        <section className={section}>
          <div className={`flex flex-col gap-block ${bodyCol}`}>
            <p className="m-0 text-body">준비 중</p>
          </div>
        </section>
      ) : null}

      {showLocked ? (
        <section className={section}>
          <div className={`${bodyCol} flex flex-col gap-block`}>
            <div id="gate" className="scroll-mt-24">
              <Suspense fallback={null}>
                <EmailGateForm
                  title={RESOURCE_GATE_TITLE}
                  description={RESOURCE_GATE_DESCRIPTION}
                  buttonLabel={RESOURCE_GATE_BUTTON}
                  helper={RESOURCE_GATE_HELPER}
                  slug={slug}
                  placement="resource"
                  extraField={BUILDING_EXTRA_FIELD}
                  layout="stack"
                />
              </Suspense>
            </div>
            {access === 'free-until-course' ? (
              <p className="m-0 text-[13px] text-muted break-keep">
                {RESOURCE_GATE_NOTICE}
              </p>
            ) : null}
            <LockedParts
              parts={restParts.map((p) => ({
                id: p.id,
                heading: p.heading,
              }))}
            />
          </div>
        </section>
      ) : null}

      {unlocked && !isPlaceholder ? (
        <section className={section}>
          <div className={`flex flex-col gap-block ${bodyCol}`}>
            <div id="gate" className="scroll-mt-24 flex items-center gap-inline-tight text-link">
              <Icon name="check" size={18} />
              <span className="text-body-sm">{GATE_ACTIVE_LABEL}</span>
            </div>
            {restParts.map((part) => (
              <article key={part.id} className="flex flex-col gap-4">
                <h2
                  id={part.id}
                  className="m-0 scroll-mt-24 text-h3 font-bold text-strong break-keep"
                >
                  {part.heading}
                </h2>
                <MdxContent source={part.body} resourceSlug={slug} />
              </article>
            ))}
            {downloads?.length ? (
              <div className="flex flex-wrap gap-inline">
                {downloads.map((d) => (
                  <Button key={d.key} variant="secondary" href="#">
                    {d.label}
                  </Button>
                ))}
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      <section className={section}>
        <div className={bodyCol}>
          <span className="text-label tracking-[var(--tracking-label)] text-muted">
            03 / 만든 사람
          </span>
          <div className="h-block-tight" />
          <div className="flex gap-10 items-start max-[960px]:flex-col max-[960px]:gap-6">
            <div className="flex-none w-[240px] aspect-[1/1] rounded-full overflow-hidden bg-raised border-hairline relative isolate max-[960px]:w-full max-[960px]:max-w-[240px] max-[960px]:mx-auto">
              <Image
                className="object-cover object-center rounded"
                src="/img/profile.png"
                alt="nodi"
                fill
                sizes="240px"
                quality={100}
              />
            </div>
            <div className="flex flex-col gap-6 pt-inline-tight">
              <div className="flex flex-col gap-y-0">
                <p className="m-0 text-h2 font-bold text-strong max-[720px]:text-[20px]">
                  {RESOURCE_AUTHOR_NAME}
                </p>
                <p className="m-0 text-body max-[720px]:text-body-sm pt-2 whitespace-pre-line">
                  {RESOURCE_AUTHOR_BODY}
                </p>
              </div>
              <a href="https://www.youtube.com/@nodiworks" className="text-label text-muted">
                {RESOURCE_AUTHOR_SMALL}
              </a>
            </div>
          </div>
        </div>
      </section>

      {others.length > 0 ? (
        <section className={sectionLast}>
          <div className={`${bodyCol} flex flex-col gap-block-tight`}>
            <span className="text-label tracking-[var(--tracking-label)] text-muted">
              {RESOURCE_RELATED_HEADING}
            </span>
            <div className="grid grid-cols-2 gap-6 max-[720px]:grid-cols-1">
              {others.map((resource) => (
                <ResourceCard
                  key={resource.frontmatter.slug}
                  title={resource.frontmatter.title}
                  slug={resource.frontmatter.slug}
                  thumbnail={
                    resource.frontmatter.cover ?? resourceThumbnail(resource.frontmatter.slug)
                  }
                  badges={resourceCardBadges(resource.frontmatter.slug)}
                />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {showLocked ? <StickyUnlockBar label={RESOURCE_HERO_CTA} /> : null}
    </main>
  );
}
