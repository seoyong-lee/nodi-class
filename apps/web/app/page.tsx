import Image from 'next/image';
import { Suspense } from 'react';
import {
  BeforeAfter,
  Button,
  ProductCard,
  ResourceCard,
  SectionHeading,
} from '@nodi/design-system';
import { RESOURCE_SLUGS } from '@nodi/shared';
import { EmailGateForm } from '../components/EmailGateForm';
import { BUILDING_EXTRA_FIELD } from '../lib/building';
import { getYoutubeUrl } from '../lib/business';
import { productCardProps } from '../lib/products';
import { listResources } from '../lib/resources';
import { hasValidAccessCookie } from '../lib/access';
import * as styles from '../styles/page.css';

export const dynamic = 'force-dynamic';

const HOME_GATE_SLUG = RESOURCE_SLUGS[0]!;

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
            이제 AI로 직접 만들 수 있습니다
          </h1>
          <p className={styles.lead}>
            노디 AI 유튜브에서 소개한 프롬프트 · 가이드를 한곳에 정리했습니다.
            <br />
            내 사업에 바로 써볼 수 있는 자료부터 무료로 시작해보세요.
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
          title="영상에서 쓴 자료, 내 사업에 바로 써보세요"
        />
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
          같은 클로드라도, 어떤 레퍼런스와 기준을 주느냐에 따라 결과가 달라집니다.
        </p>
      </section>

      <section className={styles.section}>
        <SectionHeading
          index="03"
          label="클래스"
          title="직접 만들어봤다면, 이제 기준을 배워보세요"
        />
        <div className={styles.grid3}>
          <ProductCard {...vod} />
          <ProductCard {...workshop} />
          <ProductCard {...service} />
        </div>
      </section>

      <section className={styles.section}>
        <span className={styles.sectionLabel}>04 / 만든 사람</span>
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
                직접 제품을 만들고 운영해 온 5년차 프로덕트 엔지니어
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
          <h2 className={styles.finalTitle}>무료 자료로 먼저 직접 만들어보세요</h2>
          <div className={styles.gateCenter}>
            <Suspense fallback={null}>
              <EmailGateForm
                title="한 번 등록하면 모든 자료가 열립니다"
                buttonLabel="받기"
                slug={HOME_GATE_SLUG}
                extraField={BUILDING_EXTRA_FIELD}
              />
            </Suspense>
          </div>
        </div>
      </section>
    </main>
  );
}
