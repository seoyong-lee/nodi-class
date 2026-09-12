import Image from 'next/image';
import { Suspense } from 'react';
import {
  BeforeAfter,
  Button,
  ProductCard,
  ResourceCard,
  SectionHeading,
} from '@nodi/design-system';
import { RESOURCE_SLUGS } from '@nodi/shared';
import { EmailGateForm } from '../components/EmailGateForm';
import { BUILDING_EXTRA_FIELD } from '../lib/building';
import { getYoutubeUrl } from '../lib/business';
import { productCardProps } from '../lib/products';
import { listResources } from '../lib/resources';
import { hasValidAccessCookie } from '../lib/access';

export const dynamic = 'force-dynamic';

const HOME_GATE_SLUG = RESOURCE_SLUGS[0]!;

const section = 'max-w-page mx-auto pt-section px-gutter break-keep';
const sectionLast = `${section} pb-section`;

export default async function HomePage() {
  const youtube = getYoutubeUrl();
  const unlocked = await hasValidAccessCookie();
  const resources = listResources();
  const vod = productCardProps('vod');
  const workshop = productCardProps('workshop');
  const service = productCardProps('service');

  return (
    <main>
      <section className={section}>
        <div className="flex flex-col items-center gap-3 text-center">
          <span className="text-label text-muted">노디 AI 클래스</span>
          <h1 className="m-0 font-sans text-hero max-[720px]:text-hero-m font-bold text-strong">
            코딩 몰라도,
            <br />
            이제 AI로 직접 만들 수 있습니다
          </h1>
          <p className="m-0 max-w-measure text-body">
            노디 AI 유튜브에서 소개한 프롬프트 · 가이드를 한곳에 정리했습니다.
            <br />내 사업에 바로 써볼 수 있는 자료부터 무료로 시작해보세요.
          </p>
          <div className="flex gap-inline justify-center mt-inline-tight flex-wrap max-[720px]:flex-col max-[720px]:w-full max-[720px]:[&_a]:w-full max-[720px]:[&_button]:w-full">
            <Button variant="primary" href="#free">
              무료 자료 받기
            </Button>
            <Button variant="secondary" href={youtube}>
              유튜브에서 보기
            </Button>
          </div>
        </div>
      </section>

      <section id="free" className={section}>
        <SectionHeading
          index="01"
          label="무료 자료"
          title="영상에서 쓴 자료, 내 사업에 바로 써보세요"
        />
        <div className="grid grid-cols-4 gap-3 mt-block max-[960px]:grid-cols-2 max-[720px]:grid-cols-1">
          {resources.map((resource) => (
            <ResourceCard
              key={resource.frontmatter.slug}
              title={resource.frontmatter.title}
              slug={resource.frontmatter.slug}
              locked={!unlocked}
            />
          ))}
        </div>
      </section>

      <section className={section}>
        <span className="text-label tracking-[var(--tracking-label)] text-muted">
          02 / 이렇게 달라집니다
        </span>
        <div className="h-block-tight" />
        <BeforeAfter
          beforeCaption="만들기 전"
          afterCaption="기준을 준 뒤"
          before={
            <Image
              className="w-full h-auto block rounded"
              src="/img/before.png"
              alt="만들기 전"
              width={640}
              height={360}
            />
          }
          after={
            <Image
              className="w-full h-auto block rounded"
              src="/img/after.png"
              alt="기준을 준 뒤"
              width={640}
              height={360}
            />
          }
        />
        <p className="mt-3 mb-0 max-w-measure text-body-sm text-muted">
          같은 클로드라도, 어떤 레퍼런스와 기준을 주느냐에 따라 결과가 달라집니다.
        </p>
      </section>

      <section className={section}>
        <SectionHeading
          index="03"
          label="클래스"
          title="직접 만들어봤다면, 이제 기준을 배워보세요"
        />
        <div className="grid grid-cols-3 gap-3 mt-block max-[960px]:grid-cols-1">
          <ProductCard {...vod} />
          <ProductCard {...workshop} />
          <ProductCard {...service} />
        </div>
      </section>

      <section className={section}>
        <span className="text-label tracking-[var(--tracking-label)] text-muted">
          04 / 노디
        </span>
        <div className="flex gap-5 items-start mt-block-tight max-[960px]:flex-col">
          <div className="flex-none w-[280px] aspect-square rounded overflow-hidden bg-raised border-hairline relative isolate max-[960px]:w-[min(280px,100%)]">
            <Image
              className="object-cover object-center rounded"
              src="/img/profile.png"
              alt="nodi"
              fill
              sizes="280px"
            />
          </div>
          <div className="flex flex-col gap-3 pt-inline-tight">
            <ul className="list-none m-0 p-0 flex flex-col gap-inline">
              <li className="text-h3 font-bold text-strong">
                직접 제품을 만들고 운영해 온 5년차 프로덕트 엔지니어
              </li>
              <li className="text-body text-body">컴퓨터소프트웨어공학 석사</li>
              <li className="text-body text-body">비전공자 대상 풀스택 개발 부트캠프 강사</li>
            </ul>
            <span className="text-label text-muted">유튜브 노디 AI 운영</span>
          </div>
        </div>
      </section>

      <section className={sectionLast}>
        <div className="flex flex-col items-center gap-block">
          <h2 className="m-0 text-h2 font-bold text-strong text-center">
            무료 자료로 먼저 직접 만들어보세요
          </h2>
          <div className="mt-block max-w-[640px] mx-auto w-full">
            <Suspense fallback={null}>
              <EmailGateForm
                title="한 번 등록하면 모든 자료가 열립니다"
                buttonLabel="받기"
                slug={HOME_GATE_SLUG}
                extraField={BUILDING_EXTRA_FIELD}
              />
            </Suspense>
          </div>
        </div>
      </section>
    </main>
  );
}
