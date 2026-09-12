import Image from 'next/image';
import { Suspense } from 'react';
import { BeforeAfter, Button, ProductCard, SectionHeading } from '@nodi/design-system';
import { RESOURCE_SLUGS } from '@nodi/shared';
import { EmailGateForm } from '../components/EmailGateForm';
import { ResourceCardsGrid } from '../components/ResourceCardsGrid';
import { BUILDING_EXTRA_FIELD } from '../lib/building';
import { getYoutubeUrl } from '../lib/business';
import { productCardProps } from '../lib/products';

const HOME_GATE_SLUG = RESOURCE_SLUGS[0]!;

const section = 'max-w-page mx-auto pt-section px-gutter break-keep';
const hero = 'max-w-page mx-auto pt-section max-[720px]:pt-20 px-gutter break-keep';

export default function HomePage() {
  const youtube = getYoutubeUrl();
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
          <p className="m-0 text-body sm:whitespace-pre-line">
            {
              'AI가 만들어주는 시대, 이제 중요한 건 어떻게 완성할지 판단하는 능력입니다.\n노디 클래스에서 내 사업에 필요한 결과물을 직접 만드는 기준과 방법을 배워보세요.'
            }
          </p>
          <div className="flex gap-inline justify-center mt-inline-tight flex-wrap max-[720px]:flex-col max-[720px]:w-full max-[720px]:[&_a]:w-full max-[720px]:[&_button]:w-full">
            <Button variant="primary" href="/free">
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
          title="바로 써볼 수 있는 자료, 무료로 가져가세요"
        />
        <Suspense fallback={<div className="mt-block min-h-[280px] max-[720px]:mt-block-tight" />}>
          <ResourceCardsGrid />
        </Suspense>
      </section>

      <section className={section}>
        <span className="text-label tracking-[var(--tracking-label)] text-muted">
          02 / 이렇게 달라집니다
        </span>
        <div className="h-block-tight" />
        <BeforeAfter
          beforeCaption="Before"
          afterCaption="After"
          before={
            <Image
              className="rounded object-cover"
              src="/img/before.png"
              alt="만들기 전"
              fill
              sizes="(max-width: 960px) 100vw, 560px"
              quality={100}
              priority
            />
          }
          after={
            <Image
              className="rounded object-cover"
              src="/img/after.png"
              alt="기준을 준 뒤"
              fill
              sizes="(max-width: 960px) 100vw, 560px"
              quality={100}
              priority
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
          <div className="flex-none w-[240px] aspect-[1/1] rounded-full overflow-hidden bg-raised border-hairline relative isolate max-[960px]:w-full max-[960px]:max-w-[240px]">
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
            <ul className="list-none m-0 p-0 flex flex-col gap-y-0">
              <li className="text-h2 font-bold text-strong max-[720px]:text-[20px]">노디</li>
              <li className="text-body max-[720px]:text-body-sm pt-2">
                직접 제품을 만들고 운영해 온 5년차 프로덕트 엔지니어입니다.
              </li>
              <li className="text-body max-[720px]:text-body-sm">
                시각디자인 학사, 컴퓨터소프트웨어공학 석사
              </li>
              <li className="text-body max-[720px]:text-body-sm">풀스택 개발 부트캠프 강사</li>
            </ul>
            <a href="https://www.youtube.com/@nodiworks" className="text-label text-muted">
              유튜브 노디 AI
            </a>
          </div>
        </div>
      </section>

      <section className="max-w-page mx-auto pt-32 pb-24 px-gutter break-keep max-[768px]:pt-12 max-[768px]:pb-12">
        <div className="grid grid-cols-2 gap-20 items-start max-[768px]:grid-cols-1 max-[768px]:gap-8">
          <div className="flex flex-col gap-6 min-w-0">
            <span className="text-label text-muted">무료 자료</span>
            <h2 className="m-0 text-h2 font-bold text-strong max-w-[14em] max-[768px]:text-[26px] max-[768px]:max-w-[18em]">
              내 사업에 바로 써볼 자료를 무료로 받아보세요.
            </h2>
            <p className="m-0 max-w-measure text-body">
              노디 AI에서 소개한 프롬프트·가이드·체크리스트를 한곳에 정리했습니다.
            </p>
          </div>
          <div className="w-full max-w-[520px] justify-self-end max-[768px]:max-w-none max-[768px]:justify-self-stretch">
            <Suspense fallback={null}>
              <EmailGateForm
                title="무료 자료 받아보기"
                description="이메일을 한 번 등록하면 모든 자료를 확인할 수 있습니다."
                buttonLabel="무료 자료 받기"
                slug={HOME_GATE_SLUG}
                layout="stack"
                extraField={{
                  ...BUILDING_EXTRA_FIELD,
                  label: '지금 만들고 있는 것은 무엇인가요?',
                }}
              />
            </Suspense>
          </div>
        </div>
      </section>
    </main>
  );
}
