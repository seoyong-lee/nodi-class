import { Icon } from '@nodi/design-system';
import { InquiryForm } from '../../components/InquiryForm';

const FIT = [
  '클로드·러버블로 만들긴 했는데 어딘가 싸 보입니다',
  '광고를 돌렸는데 클릭만 있고 문의가 없습니다',
  '수정하려고 손대면 다른 데가 깨집니다',
  '내놓을 수 있는 수준까지만 누가 정리해 줬으면 합니다',
] as const;

const REJECT = [
  '아직 아무것도 만들어 보지 않은 경우',
  '기획부터 전부 맡기고 싶은 경우',
  '쇼핑몰·앱 전체처럼 페이지 5개를 넘는 경우',
] as const;

const STEPS = [
  '현재 결과물 링크 보내기',
  '2영업일 내 범위·견적 회신',
  '계약 후 2주 내 마무리',
] as const;

const section = 'max-w-page mx-auto pt-section px-gutter break-keep';
const sectionLast = `${section} pb-section`;

export default function ServicePage() {
  return (
    <main>
      <section className={section}>
        <div className="flex flex-col gap-3 max-w-[40em]">
          <span className="text-label text-muted">AI 결과물 마무리</span>
          <h1 className="m-0 font-sans text-hero max-[720px]:text-hero-m font-bold text-strong">
            AI로 만든 초안을,
            <br />
            내놓을 수 있는 결과물로 마무리합니다.
          </h1>
          <p className="m-0 max-w-measure text-body">
            직접 해보다 한계를 느낀 분만 받습니다. 처음부터 맡기는 제작은 하지
            않습니다.
          </p>
        </div>
      </section>

      <section className={section}>
        <span className="text-label tracking-[var(--tracking-label)] text-muted">
          01 / 이런 상태면 맞습니다
        </span>
        <ul className="list-none mt-block-tight mb-0 mx-0 p-0 max-w-[720px] flex flex-col gap-2">
          {FIT.map((item) => (
            <li key={item} className="flex gap-inline items-start text-strong">
              <span className="flex-none inline-flex pt-[5px] text-muted">
                <Icon name="check" size={16} />
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className={section}>
        <span className="text-label tracking-[var(--tracking-label)] text-muted">
          02 / 이런 경우는 받지 않습니다
        </span>
        <ul className="list-none mt-block-tight mb-0 mx-0 p-0 max-w-[720px] border-t border-line">
          {REJECT.map((item) => (
            <li key={item} className="py-2 border-b border-line text-muted">
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className={section}>
        <span className="text-label tracking-[var(--tracking-label)] text-muted">
          03 / 진행 방식
        </span>
        <div className="flex items-center gap-2 mt-block-tight flex-wrap max-[720px]:flex-col max-[720px]:items-stretch">
          {STEPS.map((step, index) => (
            <div key={step} className="contents">
              {index > 0 ? (
                <span className="flex-none text-muted max-[720px]:rotate-90 max-[720px]:self-center">
                  <Icon name="arrow-right" size={20} />
                </span>
              ) : null}
              <div className="flex-[1_1_0] min-w-[140px] bg-card border-hairline rounded p-card-pad min-h-24 flex items-center text-h3 font-bold text-strong">
                {step}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className={section}>
        <span className="text-label tracking-[var(--tracking-label)] text-muted">
          04 / 비용
        </span>
        <p className="mt-block-tight mb-0 max-w-measure text-h3 text-strong">
          300~500만원. 범위를 확인한 뒤 확정합니다.
        </p>
      </section>

      <section className={sectionLast}>
        <InquiryForm />
      </section>
    </main>
  );
}
