import { Suspense } from 'react';
import {
  AccessBadge,
  Button,
  ContentsList,
  FitList,
  Icon,
  ResourceCard,
  SectionHeading,
  Toc,
  VideoCard,
} from '@nodi/design-system';
import { resourceThumbnail } from '@nodi/shared';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { EmailGateForm } from '../../../components/EmailGateForm';
import { LockedParts } from '../../../components/LockedParts';
import { MdxContent } from '../../../components/MdxContent';
import { PaidGateStub } from '../../../components/PaidGateStub';
import { hasValidAccessCookie } from '../../../lib/access';
import { BUILDING_EXTRA_FIELD } from '../../../lib/building';
import { GATE_ACTIVE_LABEL } from '../../../lib/copy';
import { getOtherResources, getResource, listResourceSlugs } from '../../../lib/resources';

export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{ slug: string }>;
};

const section = 'max-w-page mx-auto pt-section px-gutter break-keep';
const hero = 'max-w-page mx-auto pt-section max-[720px]:pt-20 px-gutter break-keep';
const sectionLast = `${section} pb-section`;
const bodyCol = 'max-w-[720px]';

function formatPublishedAt(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  if (m) return `${m[1]}.${m[2]}.${m[3]}`;
  return iso;
}

function SectionLabel({ children }: { children: string }) {
  return (
    <span className="text-label text-muted leading-[1.4] tracking-normal">
      {children}
    </span>
  );
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
  const cover = doc.frontmatter.cover ?? resourceThumbnail(slug);
  const readingMinutes = doc.frontmatter.readingMinutes;
  const publishedLabel = formatPublishedAt(doc.frontmatter.publishedAt);
  const accessMeta = access === 'paid' ? '유료' : '무료';
  const metaParts = [
    readingMinutes != null ? `약 ${readingMinutes}분` : null,
    publishedLabel || null,
    accessMeta,
  ].filter(Boolean);

  const youtube = doc.frontmatter.youtube;
  const youtubeTitle = doc.frontmatter.youtubeTitle;
  const contents = doc.frontmatter.contents ?? [];
  const fitFor = doc.frontmatter.fitFor ?? [];
  const notFor = doc.frontmatter.notFor ?? [];
  const showLocked = !unlocked && !isPlaceholder && restParts.length > 0;

  return (
    <main>
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
            <p className="m-0 max-w-[30em] text-body">{doc.frontmatter.summary}</p>
            <p className="m-0 max-w-measure text-body break-keep">
              이 가이드북은 VOD 「클로드 디자인 실전」 교재로 들어갈 예정입니다.
              강의가 나오면 무료 공개를 끝내고, 지금 이메일을 남긴 분은 그 뒤에도
              계속 볼 수 있습니다.
            </p>
            {metaParts.length > 0 ? (
              <p className="m-0 text-[13px] text-muted">
                {metaParts.join(' · ')}
              </p>
            ) : null}
            <div className="flex flex-wrap gap-inline">
              {unlocked ? (
                <Button variant="primary" href="#part-00">
                  본문으로
                </Button>
              ) : access === 'free' ? (
                <Button variant="primary" href="#gate">
                  무료로 열기
                </Button>
              ) : (
                <Button variant="primary" href="/course">
                  강의 보기
                </Button>
              )}
              {youtube ? (
                <Button
                  variant="secondary"
                  href={youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  영상으로 보기
                </Button>
              ) : null}
            </div>
          </div>
          <div className="min-w-0 max-[720px]:order-1">
            <img
              className="w-full h-auto rounded border-hairline"
              src={cover}
              alt=""
            />
          </div>
        </div>
      </section>

      {contents.length > 0 ? (
        <section className={section}>
          <div className={`${bodyCol} flex flex-col gap-block`}>
            <SectionHeading
              index="01"
              label="들어 있는 것"
              title="프롬프트 7개와 그걸 쓰는 순서를 담았습니다"
            />
            <ContentsList items={contents} />
          </div>
        </section>
      ) : null}

      {fitFor.length > 0 || notFor.length > 0 ? (
        <section className={section}>
          <div className={`${bodyCol} flex flex-col gap-block`}>
            <SectionLabel>02 / 누구에게</SectionLabel>
            <FitList fit={fitFor} notFor={notFor} />
          </div>
        </section>
      ) : null}

      <section className={section}>
        <div className={`${bodyCol} flex flex-col gap-block`}>
          <SectionLabel>03 / 만든 사람</SectionLabel>
          <div className="flex gap-6 items-start max-[720px]:flex-col">
            <div className="relative flex-none w-[120px] h-[120px] rounded overflow-hidden bg-raised border-hairline">
              <Image
                className="object-cover object-center"
                src="/img/profile.png"
                alt=""
                fill
                sizes="120px"
                quality={100}
              />
            </div>
            <div className="flex flex-col gap-inline text-body break-keep">
              <p className="m-0 font-bold text-strong">
                직접 서비스를 만드는 5년차 개발자
              </p>
              <p className="m-0">
                영상 「클로드 PPT 3단계」를 실무용으로 확장한 자료입니다
              </p>
              <p className="m-0">
                프롬프트 7개는 실제 보고서 제작에 쓴 것을 그대로 옮겼습니다
              </p>
            </div>
          </div>
        </div>
      </section>

      {doc.parts.length > 0 ? (
        <section className={section}>
          <div className={`${bodyCol} flex flex-col gap-block`}>
            <SectionLabel>04 / 목차</SectionLabel>
            <Toc
              parts={doc.parts.map((p) => ({ id: p.id, heading: p.heading }))}
              freeParts={freeCount}
              unlocked={unlocked}
            />
          </div>
        </section>
      ) : null}

      <section className={section}>
        <div className={`flex flex-col gap-block ${bodyCol}`}>
          {isPlaceholder ? (
            <p className="m-0 text-body">준비 중</p>
          ) : (
            previewParts.map((part, index) => (
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
                <MdxContent source={part.body} />
              </article>
            ))
          )}
        </div>
      </section>

      {showLocked ? (
        <section className={section}>
          <div className={`${bodyCol} flex flex-col gap-block`}>
            {access === 'paid' ? (
              <PaidGateStub />
            ) : (
              <>
                <div id="gate" className="scroll-mt-24">
                  <Suspense fallback={null}>
                    <EmailGateForm
                      title="지금 남기면, 유료 전환 뒤에도 계속 열립니다"
                      description="Part 01부터 부록의 프롬프트 7개까지 전부 열립니다. 강의 출시 후 새로 오는 분은 유료로 보게 됩니다."
                      buttonLabel="무료로 열기"
                      slug={slug}
                      extraField={BUILDING_EXTRA_FIELD}
                      layout="stack"
                    />
                  </Suspense>
                </div>
                <p className="m-0 text-[13px] text-muted break-keep">
                  무료 공개 종료 시점은 강의 출시일에 맞춰 이 페이지와 메일로
                  먼저 알립니다.
                </p>
              </>
            )}
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
            <div
              id="gate"
              className="scroll-mt-24 flex items-center gap-inline-tight text-accent"
            >
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
                <MdxContent source={part.body} />
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

      {others.length > 0 ? (
        <section className={youtube && youtubeTitle ? section : sectionLast}>
          <div className={`${bodyCol} flex flex-col gap-block-tight`}>
            <span className="text-label tracking-[var(--tracking-label)] text-muted">
              다른 자료
            </span>
            <div className="grid grid-cols-2 gap-6 max-[720px]:grid-cols-1">
              {others.map((resource) => (
                <ResourceCard
                  key={resource.frontmatter.slug}
                  title={resource.frontmatter.title}
                  slug={resource.frontmatter.slug}
                  thumbnail={resourceThumbnail(resource.frontmatter.slug)}
                />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {youtube && youtubeTitle ? (
        <section className={sectionLast}>
          <div className={bodyCol}>
            <VideoCard
              title={youtubeTitle}
              note="이 영상에서 소개했습니다"
              href={youtube}
            />
          </div>
        </section>
      ) : null}
    </main>
  );
}
