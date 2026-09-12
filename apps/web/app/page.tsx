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
const hero = 'max-w-page mx-auto pt-section max-[720px]:pt-20 px-gutter break-keep';
const sectionLast = `${section} pb-section`;

export default async function HomePage() {
  const youtube = getYoutubeUrl();
  const unlocked = await hasValidAccessCookie();
  const resources = await listResources();
  const vod = productCardProps('vod');
  const workshop = productCardProps('workshop');
  const service = productCardProps('service');

  return (
    <main>
      <section className={hero}>
        <div className="flex flex-col items-center gap-6 text-center">
          <span className="text-label text-muted">노디 AI 클래스</span>
          <h1 className="m-0 font-hero text-hero max-[720px]:text-hero-m font-bold text-strong">
            코딩 몰라도,
            <br />
            이제 AI로 직접 만들 수 있습니다
          </h1>
          <p className="m-0 max-w-measure text-body">
            AI가 만들어주는 시대, 이제 중요한 건 무엇을 만들고 어떻게 완성할지 판단하는 능력입니다.
            <br />
            노디 클래스에서 내 사업에 필요한 결과물을 직접 만드는 방법을 배워보세요.
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
        <div className="grid grid-cols-4 gap-6 mt-block max-[960px]:grid-cols-2 max-[720px]:grid-cols-1 max-[720px]:mt-block-tight">
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
        <p className="mt-6 mb-0 max-w-measure text-body-sm text-muted">
          같은 AI여도, 어떤 레퍼런스와 기준을 주느냐에 따라 결과가 달라집니다.
        </p>
      </section>

      <section className={section}>
        <SectionHeading
          index="03"
          label="클래스"
          title="직접 만들어봤다면, 이제 기준을 배워보세요"
        />
        <div className="grid grid-cols-3 gap-6 mt-block max-[960px]:grid-cols-1 max-[720px]:mt-block-tight items-stretch">
          <ProductCard {...vod} />
          <ProductCard {...workshop} />
          <ProductCard {...service} />
        </div>
      </section>

      <section className={section}>
        <span className="text-label tracking-[var(--tracking-label)] text-muted">04 / 노디</span>
        <div className="h-block-tight" />
        <div className="flex gap-10 items-start max-[960px]:flex-col max-[960px]:gap-6">
          <div className="flex-none w-[280px] aspect-[4/5] rounded overflow-hidden bg-raised border-hairline relative isolate max-[960px]:w-full">
            <Image
              className="object-cover object-center rounded"
              src="/img/profile.png"
              alt="nodi"
              fill
              sizes="280px"
            />
          </div>
          <div className="flex flex-col gap-6 pt-inline-tight">
            <ul className="list-none m-0 p-0 flex flex-col gap-inline">
              <li className="text-h3 font-bold text-strong max-[720px]:text-[18px]">노디</li>
              <li className="text-body max-[720px]:text-body-sm">
                직접 제품을 만들고 운영해 온 5년차 프로덕트 엔지니어
              </li>
              <li className="text-body max-[720px]:text-body-sm">시각디자인 학사</li>
              <li className="text-body max-[720px]:text-body-sm">컴퓨터소프트웨어공학 석사</li>
              <li className="text-body max-[720px]:text-body-sm">
                비전공자 대상 풀스택 개발 부트캠프 강사
              </li>
            </ul>
            <span className="text-label text-muted">유튜브 노디 AI 운영</span>
          </div>
        </div>
      </section>

      <section className={sectionLast}>
        <div className="flex flex-col items-center gap-block max-[720px]:gap-6">
          <h2 className="m-0 text-h2 font-bold text-strong text-center max-[720px]:text-[26px]">
            무료 자료로 먼저 직접 만들어보세요
          </h2>
          <div className="w-full max-w-[640px]">
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
