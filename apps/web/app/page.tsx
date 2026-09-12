import Image from 'next/image';
import {
  BeforeAfter,
  Button,
  ProductCard,
  ResourceCard,
  SectionHeading,
} from '@nodi/design-system';
import { EmailGateForm } from '../components/EmailGateForm';
import { BUILDING_EXTRA_FIELD } from '../lib/building';
import { getYoutubeUrl } from '../lib/business';
import { productCardProps } from '../lib/products';
import { listResources } from '../lib/resources';
import { hasValidAccessCookie } from '../lib/access';
import styles from '../styles/page.module.css';

export default async function HomePage() {
  const youtube = getYoutubeUrl();
  const unlocked = await hasValidAccessCookie();
  const resources = listResources();
  const vod = productCardProps('vod');
  const workshop = productCardProps('workshop');
  const service = productCardProps('service');

  return (
    <main>
      <section className={styles.section}>
        <div className={styles.heroCenter}>
          <span className={styles.eyebrow}>노디 AI 클래스</span>
          <h1 className={styles.heroTitle}>
            코딩 몰라도,
            <br />
            이제 AI로 직접
            <br />
            만들 수 있습니다.
          </h1>
          <p className={styles.lead}>
            랜딩페이지·브랜드·PPT. 유튜브 노디 AI에서 쓴 프롬프트와 가이드를 그대로
            드립니다. 이메일 한 번이면 전부 열립니다.
          </p>
          <div className={styles.ctaRow}>
            <Button variant="primary" href="#free">
              무료 자료 받기
            </Button>
            <Button variant="secondary" href={youtube}>
              유튜브에서 보기
            </Button>
          </div>
        </div>
      </section>

      <section id="free" className={styles.section}>
        <SectionHeading
          index="01"
          label="무료 자료"
          title="영상에서 쓴 자료, 그대로 드립니다"
        />
        <div className={styles.gateBlock}>
          <EmailGateForm
            title="한 번 등록하면 모든 자료가 열립니다"
            buttonLabel="받기"
            extraField={BUILDING_EXTRA_FIELD}
          />
        </div>
        <div className={styles.grid4}>
          {resources.map((resource) => (
            <ResourceCard
              key={resource.frontmatter.slug}
              title={resource.frontmatter.title}
              slug={resource.frontmatter.slug}
              locked={!unlocked}
            />
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <span className={styles.sectionLabel}>02 / 이렇게 달라집니다</span>
        <div className={styles.sectionSpacer} />
        <BeforeAfter
          beforeCaption="만들기 전"
          afterCaption="기준을 준 뒤"
          before={
            <Image
              className={styles.baImage}
              src="/img/before.png"
              alt="만들기 전"
              width={640}
              height={360}
            />
          }
          after={
            <Image
              className={styles.baImage}
              src="/img/after.png"
              alt="기준을 준 뒤"
              width={640}
              height={360}
            />
          }
        />
        <p className={styles.sectionNote}>
          레퍼런스와 기준을 먼저 주면 같은 클로드에서 이 차이가 납니다.
        </p>
      </section>

      <section className={styles.section}>
        <SectionHeading
          index="03"
          label="클래스"
          title="무료 자료 다음은 클래스입니다"
        />
        <div className={styles.grid3}>
          <ProductCard {...vod} />
          <ProductCard {...workshop} />
          <ProductCard {...service} />
        </div>
      </section>

      <section className={styles.section}>
        <span className={styles.sectionLabel}>04 / 운영하는 사람</span>
        <div className={styles.operator}>
          <div className={styles.profileFrame}>
            <Image
              className={styles.profileImage}
              src="/img/profile.png"
              alt=""
              fill
              sizes="280px"
            />
          </div>
          <div className={styles.operatorCopy}>
            <ul className={styles.operatorList}>
              <li className={styles.operatorLead}>
                직접 서비스를 만드는 5년차 개발자
              </li>
              <li className={styles.operatorItem}>컴퓨터소프트웨어공학 석사</li>
              <li className={styles.operatorItem}>
                비전공자 대상 풀스택 개발 부트캠프 강사
              </li>
            </ul>
            <span className={styles.operatorMeta}>유튜브 노디 AI 운영</span>
          </div>
        </div>
      </section>

      <section className={styles.sectionLast}>
        <div className={styles.finalCta}>
          <h2 className={styles.finalTitle}>무료 자료부터 받아보세요</h2>
          <div className={styles.gateCenter}>
            <EmailGateForm
              title="한 번 등록하면 모든 자료가 열립니다"
              buttonLabel="받기"
              extraField={BUILDING_EXTRA_FIELD}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
