const sectionLast =
  'max-w-page mx-auto pt-section px-gutter pb-section break-keep';
const legalTitle = 'm-0 mb-3 text-h2 font-bold text-strong';
const legalBody =
  'flex flex-col gap-6 max-w-measure [&_h2]:m-0 [&_h2]:text-h3 [&_h2]:font-bold [&_h2]:text-strong [&_p]:m-0 [&_p]:text-body [&_li]:m-0 [&_li]:text-body [&_ul]:m-0 [&_ul]:pl-[1.25em] [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-1';

export default function TermsPage() {
  return (
    <main>
      <section className={sectionLast}>
        <h1 className={legalTitle}>이용약관</h1>
        <p className="m-0 mb-8 max-w-measure text-body-sm text-muted">
          시행일 2026-09-12 · Step 1(무료 구독) 범위
        </p>
        <div className={legalBody}>
          <h2>1. 서비스</h2>
          <p>
            노디 AI 클래스는 이메일 구독으로 무료 자료를 열고, 자료 전달·새
            자료·강의·서비스 소식을 메일로 안내합니다. 로그인·회원 계정·유료
            결제는 Step 1에 포함하지 않습니다.
          </p>

          <h2>2. 무료 자료의 저작권</h2>
          <ul>
            <li>재배포·판매를 금지합니다.</li>
            <li>본인 사업에 사용하는 것은 자유입니다.</li>
          </ul>

          <h2>3. 면책</h2>
          <p>
            자료는 교육·참고 목적으로 제공됩니다. 이용 결과에 대한 책임은
            이용자에게 있으며, 서비스 중단·메일 미도착·제3자 서비스 장애에 대해
            법령이 허용하는 범위에서 책임을 제한합니다.
          </p>

          <h2>4. 준거법</h2>
          <p>대한민국 법을 따릅니다.</p>

          <h2>5. 운영</h2>
          <p>
            서비스는 Cascades가 운영합니다. 약관은 필요 시 개정되며, 개정 시
            사이트에 게시합니다. 유료 상품 조항은 Step 2에서 추가합니다.
          </p>
        </div>
      </section>
    </main>
  );
}
