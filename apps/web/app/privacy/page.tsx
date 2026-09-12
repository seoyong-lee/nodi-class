const sectionLast =
  'max-w-page mx-auto pt-section px-gutter pb-section break-keep';
const legalTitle = 'm-0 mb-3 text-h2 font-bold text-strong';
const legalBody =
  'flex flex-col gap-3 max-w-measure [&_h2]:m-0 [&_h2]:text-h3 [&_h2]:text-strong [&_p]:m-0 [&_p]:text-body [&_li]:m-0 [&_li]:text-body [&_ul]:m-0 [&_ul]:pl-[1.25em]';

export default function PrivacyPage() {
  return (
    <main>
      <section className={sectionLast}>
        <h1 className={legalTitle}>개인정보처리방침</h1>
        <div className={legalBody}>
          <h2>수집 항목</h2>
          <ul>
            <li>이메일</li>
            <li>선택 정보</li>
            <li>유입 경로</li>
            <li>동의 시각</li>
          </ul>
          <h2>이용 목적</h2>
          <ul>
            <li>자료 전달</li>
            <li>새 자료 안내</li>
          </ul>
          <h2>보관 기간</h2>
          <p>해지 시까지</p>
          <h2>처리 위탁</h2>
          <p>AWS</p>
        </div>
      </section>
    </main>
  );
}
