import { Suspense } from 'react';
import { COURSE_WAITLIST_SLUG } from '@nodi/shared';
import { ProductCard } from '@nodi/design-system';
import { EmailGateForm } from '../../components/EmailGateForm';
import { productCardProps } from '../../lib/products';
import styles from '../../styles/page.module.css';

const CURRICULUM = [
  '보는 기준 — 좋은 레퍼런스를 고르고 뜯어 쓰는 법',
  '만드는 기준 — 디자인 시스템을 먼저 세팅하고 그 위에서 만드는 법',
  '고치는 기준 — AI가 뽑은 5개 중 뭐가 나은지 판단하고 첨삭하는 법',
  '반복하는 시스템 — 한 번 만든 기준으로 상세·PPT·SNS까지 뽑는 법',
] as const;

const LEFTOVERS = [
  '내 브랜드 레퍼런스 보드 1개',
  '클로드 디자인에 저장된 디자인 시스템 1개',
  '랜딩페이지 완성본 1개',
  '다음 페이지에 바로 쓰는 프롬프트 템플릿',
] as const;

export default function CoursePage() {
  const workshop = productCardProps('workshop');
  const service = productCardProps('service');

  return (
    <main>
      <section className={styles.section}>
        <div className={styles.heroLeft}>
          <span className={styles.eyebrow}>VOD · 준비 중</span>
          <h1 className={styles.heroTitle}>클로드 디자인 실전</h1>
          <p className={styles.lead}>
            디자이너 없이 돈 버는 페이지를 반복해서 만들어야 하는 분을 위한
            과정입니다. 프롬프트가 아니라 고르는 기준을 배웁니다.
          </p>
          <div className={styles.gateBlock}>
            <Suspense fallback={null}>
              <EmailGateForm
                title="출시 알림 받기"
                description="알림 신청자에게만 얼리버드 가격을 먼저 안내합니다"
                buttonLabel="알림 받기"
                slug={COURSE_WAITLIST_SLUG}
              />
            </Suspense>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <span className={styles.sectionLabel}>01 / 커리큘럼</span>
        <div className={styles.cardGrid}>
          {CURRICULUM.map((text) => {
            const [title, body] = text.split(' — ') as [string, string];
            return (
              <article key={title} className={styles.card}>
                <h3 className={styles.cardTitle}>{title}</h3>
                <p className={styles.cardBody}>{body}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className={styles.section}>
        <span className={styles.sectionLabel}>02 / 매주 남는 것</span>
        <ul className={styles.listPlain}>
          {LEFTOVERS.map((item) => (
            <li key={item} className={styles.listPlainItem}>
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.section}>
        <span className={styles.sectionLabel}>03 / 가격</span>
        <p className={styles.priceLine}>
          출시 시 얼리버드 가격을 알림 신청자에게 먼저 안내합니다
        </p>
      </section>

      <section className={styles.sectionLast}>
        <div className={styles.grid2}>
          <ProductCard {...workshop} />
          <ProductCard {...service} />
        </div>
      </section>
    </main>
  );
}
