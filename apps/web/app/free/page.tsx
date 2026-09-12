import { Suspense } from 'react';
import { ResourceCardsGrid } from '../../components/ResourceCardsGrid';

const section = 'max-w-page mx-auto pt-section px-gutter break-keep pb-section';
const hero = 'max-w-page mx-auto pt-section max-[720px]:pt-20 px-gutter break-keep';

export default function FreeResourcesPage() {
  return (
    <main>
      <section className={hero}>
        <div className="flex flex-col gap-6 max-w-[34em]">
          <span className="text-label text-muted">무료 자료</span>
          <h1 className="m-0 font-hero text-hero max-[720px]:text-hero-m font-bold text-strong">
            AI로 만들 때 필요한
            <br />
            기준과 방법을 모았습니다
          </h1>
          <p className="m-0 text-body">
            더 나은 결과물을 만들고, 고치고, 반복해서 활용할 수 있도록
            <br className="max-[720px]:hidden" />
            실전 프롬프트·가이드·체크리스트를 무료로 제공합니다.
          </p>
        </div>
      </section>

      <section className={section}>
        <Suspense
          fallback={
            <div className="mt-block min-h-[280px] max-[720px]:mt-block-tight" />
          }
        >
          <ResourceCardsGrid />
        </Suspense>
      </section>
    </main>
  );
}
