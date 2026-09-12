import { Suspense } from 'react';
import { COURSE_WAITLIST_SLUG } from '@nodi/shared';
import { ProductCard } from '@nodi/design-system';
import { EmailGateForm } from '../../components/EmailGateForm';
import { productCardProps } from '../../lib/products';

const CURRICULUM = [
  {
    title: '보는 기준',
    body: '좋은 디자인을 찾고 분석하는 법',
  },
  {
    title: '만드는 기준',
    body: '내 브랜드의 디자인 기준을 만들고 적용하는 법',
  },
  {
    title: '고치는 기준',
    body: 'AI가 만든 결과물을 비교하고 개선하는 법',
  },
  {
    title: '확장하는 방법',
    body: '한 번 만든 기준을 랜딩페이지·PPT·SNS까지 확장하는 법',
  },
] as const;

const OUTCOMES = [
  '내 브랜드 레퍼런스 보드',
  '계속 재사용할 수 있는 디자인 시스템',
  '내 사업에 활용할 랜딩페이지 완성본',
  '다음 작업에도 활용할 수 있는 프롬프트 템플릿',
] as const;

const section = 'max-w-page mx-auto pt-section px-gutter break-keep';
const hero = 'max-w-page mx-auto pt-section max-[720px]:pt-20 px-gutter break-keep';
const sectionLast = `${section} pb-section`;

export default function CoursePage() {
  const workshop = productCardProps('workshop');
  const service = productCardProps('service');

  return (
    <main>
      <section className={hero}>
        <div className="flex flex-col gap-block">
          <div className="flex flex-col gap-6">
            <span className="text-label text-muted">VOD · 준비 중</span>
            <h1 className="m-0 font-hero text-hero max-[720px]:text-hero-m font-bold text-strong">
              클로드 디자인 실전 가이드
            </h1>
            <div className="flex flex-col gap-inline max-w-measure">
              <p className="m-0 text-body text-strong">
                내 사업에 필요한 디자인, 이제 직접 만들 수 있습니다.
              </p>
              <p className="m-0 text-body">
                클로드로 결과물을 만드는 방법부터 좋은 디자인을 고르고, 고치고, 반복해서 활용하는
                기준을 만드는 방법까지 한 번에 배웁니다.
              </p>
            </div>
          </div>
          <div className="max-w-[640px] w-full">
            <Suspense fallback={null}>
              <EmailGateForm
                title="출시 알림 받기"
                description="클래스가 오픈되면 이메일로 가장 먼저 안내드립니다."
                buttonLabel="출시 알림 신청하기"
                slug={COURSE_WAITLIST_SLUG}
              />
            </Suspense>
          </div>
        </div>
      </section>

      <section className={section}>
        <span className="text-label tracking-[var(--tracking-label)] text-muted">
          01 / 커리큘럼
        </span>
        <div className="grid grid-cols-4 gap-6 mt-block-tight max-[960px]:grid-cols-2 max-[720px]:grid-cols-1">
          {CURRICULUM.map((item) => (
            <article
              key={item.title}
              className="flex flex-col gap-inline bg-card border-hairline rounded p-card-pad max-[720px]:p-6"
            >
              <h3 className="m-0 text-h3 font-bold text-strong">{item.title}</h3>
              <p className="m-0 text-body-sm text-body">{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={section}>
        <span className="text-label tracking-[var(--tracking-label)] text-muted">
          02 / 수강 후 완성하는 것
        </span>
        <ul className="list-none mt-block-tight mb-0 mx-0 p-0 max-w-[720px] border-t border-line">
          {OUTCOMES.map((item) => (
            <li
              key={item}
              className="py-4 border-b border-line text-strong max-[720px]:text-body-sm"
            >
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className={section}>
        <span className="text-label tracking-[var(--tracking-label)] text-muted">
          03 / 수강 안내
        </span>
        <div className="mt-block-tight flex flex-col gap-inline max-w-measure">
          <p className="m-0 text-h3 text-strong max-[720px]:text-[18px]">
            현재 클래스를 준비하고 있습니다.
          </p>
          <p className="m-0 text-body">
            출시 일정과 얼리버드 수강료는 알림 신청자에게 가장 먼저 안내드립니다.
          </p>
        </div>
      </section>

      <section className={sectionLast}>
        <div className="grid grid-cols-2 gap-6 max-w-[720px] max-[720px]:grid-cols-1 items-stretch">
          <ProductCard {...workshop} />
          <ProductCard {...service} />
        </div>
      </section>
    </main>
  );
}
