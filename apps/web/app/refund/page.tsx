const sectionLast =
  'max-w-page mx-auto pt-section px-gutter pb-section break-keep';
const legalTitle = 'm-0 mb-3 text-h2 font-bold text-strong';
const legalBody =
  'flex flex-col gap-3 max-w-measure [&_h2]:m-0 [&_h2]:text-h3 [&_h2]:text-strong [&_p]:m-0 [&_p]:text-body [&_li]:m-0 [&_li]:text-body [&_ul]:m-0 [&_ul]:pl-[1.25em]';

export default function RefundPage() {
  return (
    <main>
      <section className={sectionLast}>
        <h1 className={legalTitle}>환불 정책</h1>
        <div className={legalBody}>
          <p>현재 유료 상품이 없습니다</p>
        </div>
      </section>
    </main>
  );
}
