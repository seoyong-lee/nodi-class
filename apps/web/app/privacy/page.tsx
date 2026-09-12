const sectionLast =
  'max-w-page mx-auto pt-section px-gutter pb-section break-keep';
const legalTitle = 'm-0 mb-3 text-h2 font-bold text-strong';
const legalBody =
  'flex flex-col gap-6 max-w-measure [&_h2]:m-0 [&_h2]:text-h3 [&_h2]:font-bold [&_h2]:text-strong [&_p]:m-0 [&_p]:text-body [&_li]:m-0 [&_li]:text-body [&_ul]:m-0 [&_ul]:pl-[1.25em] [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-1';

export default function PrivacyPage() {
  return (
    <main>
      <section className={sectionLast}>
        <h1 className={legalTitle}>개인정보처리방침</h1>
        <p className="m-0 mb-8 max-w-measure text-body-sm text-muted">
          시행일 2026-09-12 · 문서 버전 2026-09-12
        </p>
        <div className={legalBody}>
          <p>
            노디 AI 클래스는 로그인·회원 계정 없이 이메일 구독만으로 무료 자료를
            열고 메일을 받습니다. 구조가 단순하므로 동의 항목도 하나로
            운영합니다. 본 방침은 법률 자문이 아니며, 최종 문안은 별도 검토를
            받습니다.
          </p>

          <h2>1. 수집 항목과 목적</h2>
          <ul>
            <li>
              이메일 주소 — 자료 전달, 새 자료·강의·서비스 소식 안내, 사이트
              열람(구독) 제공
            </li>
            <li>
              선택 정보(만들고 있는 것) — 관심 자료·안내 개선(거부를 이유로
              구독을 거절하지 않습니다)
            </li>
            <li>유입 경로(source) — 어디서 등록했는지 파악</li>
            <li>
              동의 기록(시각·경로·문서 버전) — 동의 증빙
            </li>
            <li>
              문의 폼: 이름, 이메일, 결과물 링크, 요청 내용 — 프로젝트 검토
              회신
            </li>
          </ul>

          <h2>2. 보유·파기</h2>
          <p>
            구독 정보는 수신 해지 시까지 보관합니다. 해지하면 메일 발송을 중단하고
            자료 페이지 접근(쿠키)도 닫습니다. 동의 증빙용 IP·User-Agent는 최대
            90일 후 삭제합니다. 문의 내용은 상담 목적 달성 후 합리적인 기간 내
            파기합니다.
          </p>

          <h2>3. 처리 위탁</h2>
          <ul>
            <li>
              Amazon Web Services(서울 리전 ap-northeast-2) — 호스팅, 데이터베이스,
              이메일 발송(SES). 이메일이 한국 밖으로 나가지 않도록 리전을
              고정합니다.
            </li>
            <li>
              Cloudflare Turnstile(미국) — 봇 방지. IP·브라우저 정보가 처리될 수
              있으며, 계약 이행에 필요한 국외 처리로 본 방침에 고지합니다.
            </li>
          </ul>

          <h2>4. 이용자 권리</h2>
          <p>
            열람·정정·삭제·수신 해지를 요청할 수 있습니다. 모든 메일의 수신거부
            링크로 해지하거나, 아래 문의 이메일로 요청해 주세요.
          </p>

          <h2>5. 14세 미만</h2>
          <p>
            만 14세 미만 아동의 개인정보는 수집하지 않습니다. 해당 사실이 확인되면
            지체 없이 파기합니다.
          </p>

          <h2>6. 안전조치</h2>
          <p>
            전송 구간 암호화(HTTPS), 접근 권한 최소화, 로그에 이메일 원문 미기록
            등의 조치를 적용합니다.
          </p>

          <h2>7. 방침 변경</h2>
          <p>
            방침을 바꾸면 이 페이지에 게시하고, 동의 문서 버전(consentVersion)을
            갱신합니다. 중요한 변경은 합리적 방법으로 안내합니다.
          </p>

          <h2>8. 문의</h2>
          <p>운영 Cascades · contact@cascades.studio</p>
        </div>
      </section>
    </main>
  );
}
