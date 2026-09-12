import { Icon } from '@nodi/design-system';
import { InquiryForm } from '../../components/InquiryForm';
import styles from '../../styles/page.module.css';

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

export default function ServicePage() {
  return (
    <main>
      <section className={styles.section}>
        <div className={styles.heroLeft}>
          <span className={styles.eyebrow}>AI 결과물 마무리</span>
          <h1 className={styles.heroTitle}>
            AI로 만든 초안을,
            <br />
            내놓을 수 있는 결과물로 마무리합니다.
          </h1>
          <p className={styles.lead}>
            직접 해보다 한계를 느낀 분만 받습니다. 처음부터 맡기는 제작은 하지
            않습니다.
          </p>
        </div>
      </section>

      <section className={styles.section}>
        <span className={styles.sectionLabel}>01 / 이런 상태면 맞습니다</span>
        <ul className={styles.checkList}>
          {FIT.map((item) => (
            <li key={item} className={styles.checkItem}>
              <span className={styles.checkIcon}>
                <Icon name="check" size={16} />
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.section}>
        <span className={styles.sectionLabel}>02 / 이런 경우는 받지 않습니다</span>
        <ul className={styles.mutedList}>
          {REJECT.map((item) => (
            <li key={item} className={styles.mutedItem}>
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.section}>
        <span className={styles.sectionLabel}>03 / 진행 방식</span>
        <div className={styles.steps}>
          {STEPS.map((step, index) => (
            <div key={step} style={{ display: 'contents' }}>
              {index > 0 ? (
                <span className={styles.stepArrow}>
                  <Icon name="arrow-right" size={20} />
                </span>
              ) : null}
              <div className={styles.step}>{step}</div>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <span className={styles.sectionLabel}>04 / 비용</span>
        <p className={styles.priceLine}>
          300~500만원. 범위를 확인한 뒤 확정합니다.
        </p>
      </section>

      <section className={styles.sectionLast}>
        <InquiryForm />
      </section>
    </main>
  );
}
