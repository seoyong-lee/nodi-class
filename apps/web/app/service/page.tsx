import { Icon } from '@nodi/design-system';
import { InquiryForm } from '../../components/InquiryForm';

const FIT = [
  '클로드·러버블로 만들긴 했는데 어딘가 부족해 보입니다',
  '광고를 돌렸는데 클릭만 있고 문의가 없습니다',
  '수정하려고 손대면 다른 부분이 깨집니다',
  '시장에 내놓을 수 있는 수준까지만 누군가가 정리해 줬으면 합니다',
] as const;

const REJECT = [
  '아직 아무것도 만들어 보지 않은 경우',
  '기획부터 전부 맡기고 싶은 경우',
  '전체 구조를 새로 만들어야 할 정도의 대규모 개편이 필요한 경우',
] as const;

const STEPS = [
  '현재 결과물 및 요청사항 공유',
  '2영업일 내 최종 견적 안내',
  '계약 후 2주 내 작업 완료',
] as const;

const section = 'max-w-page mx-auto pt-section px-gutter break-keep';
const hero = 'max-w-page mx-auto pt-section max-[720px]:pt-20 px-gutter break-keep';
const sectionLast = `${section} pt-12 pb-section`;

export default function ServicePage() {
  return (
    <main>
      <section className={hero}>
        <div className="flex flex-col gap-6">
          <span className="text-label text-muted">AI 결과물 마무리</span>
          <h1 className="m-0 font-hero text-hero max-[720px]:text-hero-m font-bold text-strong">
            AI로 만든 초안을,
            <br />
            고객이 선택하는 결과물로 완성합니다.
          </h1>
          <p className="m-0 max-w-measure text-body">
            처음부터 새로 만드는 제작보다는, 기존 결과물을 다듬고 완성하는 데 집중합니다.
          </p>
        </div>
      </section>

      <section className={section}>
        <span className="text-label tracking-[var(--tracking-label)] text-muted">
          01 / 이런 상황이라면, 맡겨주세요
        </span>
        <ul className="list-none mt-block-tight mb-0 mx-0 p-0 max-w-[720px] flex flex-col gap-4">
          {FIT.map((item) => (
            <li
              key={item}
              className="flex gap-inline items-start text-strong max-[720px]:text-body-sm"
            >
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
          02 / 이런 경우에는 진행이 어렵습니다
        </span>
        <ul className="list-none mt-block-tight mb-0 mx-0 p-0 max-w-[720px] border-t border-line">
          {REJECT.map((item) => (
            <li
              key={item}
              className="py-4 border-b border-line text-muted max-[720px]:text-body-sm"
            >
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className={section}>
        <span className="text-label tracking-[var(--tracking-label)] text-muted">
          03 / 진행 방식
        </span>
        <div className="flex items-center gap-4 mt-block-tight max-[720px]:flex-col max-[720px]:items-stretch max-[720px]:gap-4">
          {STEPS.map((step, index) => (
            <div key={step} className="contents">
              {index > 0 ? (
                <span className="flex-none inline-flex text-muted max-[720px]:rotate-90 max-[720px]:self-center">
                  <Icon name="arrow-right" size={20} />
                </span>
              ) : null}
              <div className="flex-[1_1_0] min-w-0 bg-card border-hairline rounded p-card-pad min-h-24 flex items-center text-h3 font-bold text-strong max-[720px]:p-6 max-[720px]:text-[18px] max-[720px]:min-h-0">
                {step}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className={section}>
        <span className="text-label tracking-[var(--tracking-label)] text-muted">04 / 비용</span>
        <p className="mt-block-tight mb-0 max-w-measure text-h3 text-strong max-[720px]:text-[18px]">
          현재 결과물과 작업 범위를 검토한 후 세부 견적을 안내드립니다.
        </p>
      </section>

      <section className={sectionLast}>
        <InquiryForm />
      </section>
    </main>
  );
}
