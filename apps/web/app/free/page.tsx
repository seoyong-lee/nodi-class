import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ResourceCardsGrid } from '../../components/ResourceCardsGrid';
import { pageMetadata } from '../../lib/metadata';

export const metadata: Metadata = pageMetadata({
  title: '전자책',
  description:
    'AI 활용에 도움이 되는 프롬프트·가이드·체크리스트를 모았습니다. 필요한 자료를 골라 무료로 받아보세요.',
  path: '/free',
});

const section = 'max-w-page mx-auto pt-section px-gutter break-keep pb-section';
const hero = 'max-w-page mx-auto pt-section max-[720px]:pt-20 px-gutter break-keep';

export default function FreeResourcesPage() {
  return (
    <main>
      <section className={hero}>
        <div className="flex flex-col gap-6 max-w-[34em]">
          <span className="text-label text-muted">전자책</span>
          <h1 className="m-0 font-hero text-hero max-[720px]:text-hero-m font-bold text-strong sm:whitespace-pre-line">
            {'바로 써볼 수 있는 자료,\n부담 없이 무료로 가져가세요'}
          </h1>
          <div className="flex flex-col gap-inline">
            <p className="m-0 text-body sm:whitespace-pre-line">
              {`AI 활용에 도움이 되는 프롬프트·가이드·체크리스트를 모았습니다.\n필요한 자료를 골라 무료로 받아보세요.`}
            </p>
          </div>
        </div>
      </section>

      <section className={section}>
        <Suspense fallback={<div className="mt-block min-h-[280px] max-[720px]:mt-block-tight" />}>
          <ResourceCardsGrid />
        </Suspense>
      </section>
    </main>
  );
}
