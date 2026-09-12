'use client';

import { useState } from 'react';
import {
  Badge,
  BeforeAfter,
  Button,
  EmailGate,
  Icon,
  Input,
  ProductCard,
  ResourceCard,
  SectionHeading,
  SiteFooter,
  Thumb16x9,
  VideoCard,
} from '@nodi/design-system';
import styles from './kit.module.css';

export function KitShowcase() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <main className={styles.page}>
      <h1 className={styles.heading}>Design System Kit</h1>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Button</h2>
        <div className={styles.row}>
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="primary" size="sm" icon="arrow-right">
            Small
          </Button>
          <Button variant="secondary" loading>
            Loading
          </Button>
          <Button variant="primary" disabled>
            Disabled
          </Button>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Input</h2>
        <div className={styles.stack}>
          <Input label="이메일" name="email" type="email" placeholder="you@example.com" />
          <Input
            label="메모"
            name="memo"
            multiline
            placeholder="여러 줄"
            error="오류 예시"
          />
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Badge · Icon</h2>
        <div className={styles.row}>
          <Badge>default</Badge>
          <Badge tone="current">current</Badge>
          <Icon name="lock" size={20} />
          <Icon name="play" size={20} />
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>SectionHeading</h2>
        <SectionHeading index="01" label="무료 자료" title="영상에서 쓴 자료, 그대로 드립니다" />
        <SectionHeading
          index="02"
          label="RESOURCES"
          title="English label tracking"
          align="center"
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>BeforeAfter</h2>
        <BeforeAfter
          beforeCaption="만들기 전"
          afterCaption="기준을 준 뒤"
          before={<p>기준 없이 만든 결과</p>}
          after={<p>레퍼런스와 기준을 준 뒤</p>}
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>ProductCard</h2>
        <div className={styles.grid3}>
          <ProductCard
            label="VOD · 준비 중"
            title="클로드 디자인 실전"
            summary="디자이너 없이 내 사업용 페이지를 반복해서 만드는 과정"
            rows={[
              { label: '누구에게', value: '내 사업 페이지를 직접 만들어야 하는 분' },
              { label: '남는 것', value: '매주 파일 하나' },
              { label: '가격', value: '얼리버드 가격 예정' },
            ]}
            ctaLabel="출시 알림 받기"
            ctaHref="/course"
            ctaVariant="primary"
          />
          <ProductCard
            label="워크숍 · 준비 중"
            title="라이브 첨삭"
            summary="직접 만든 결과물을 가져오면 화면을 보며 함께 고칩니다"
            rows={[
              { label: '누구에게', value: 'VOD 수료 후 실제 프로젝트가 있는 분' },
              { label: '남는 것', value: '고친 결과물 + 기준표' },
              { label: '가격', value: '추후 안내' },
            ]}
            ctaLabel="알림 받기"
            ctaHref="/course"
          />
          <ProductCard
            label="서비스"
            title="AI 결과물 마무리"
            summary="AI로 만든 초안을, 내놓을 수 있는 결과물로 마무리합니다"
            rows={[
              { label: '누구에게', value: '직접 해보다 한계를 느낀 분' },
              { label: '남는 것', value: '내놓을 수 있는 완성본' },
              { label: '가격', value: '300만원부터' },
            ]}
            ctaLabel="프로젝트 검토 요청하기"
            ctaHref="/service"
          />
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>ResourceCard · Thumb16x9</h2>
        <div className={styles.grid2}>
          <ResourceCard title="클로드 디자인 가이드" slug="claude-design" locked />
          <ResourceCard title="프롬프트 체크리스트" slug="prompt-checklist" locked={false} />
          <Thumb16x9 />
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>VideoCard</h2>
        <div className={styles.grid2}>
          <VideoCard
            title="코딩 몰라도 AI로 만드는 법"
            note="클릭하면 영상이 로드됩니다"
            href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
          />
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>EmailGate</h2>
        <EmailGate
          title="한 번 등록하면 모든 자료가 열립니다"
          description="영상에서 쓴 파일과 체크리스트를 한 번에 보내드립니다."
          buttonLabel="받기"
          consent="자료 전달과 새 자료 안내 목적으로만 사용하고, 언제든 수신을 해지할 수 있습니다."
          submittedLabel="입력한 이메일로 확인 링크를 보냈습니다. 메일의 링크를 누르면 바로 열립니다."
          submitted={submitted}
          onSubmit={() => setSubmitted(true)}
          extraField={{
            name: 'interest',
            label: '관심사',
            options: [
              { value: 'landing', label: '랜딩페이지' },
              { value: 'brand', label: '브랜드' },
              { value: 'ppt', label: 'PPT' },
            ],
          }}
        />
      </section>

      <SiteFooter
        operator="Cascades"
        business={[
          '상호 Cascades',
          '대표 노디',
          '사업자등록번호 000-00-00000',
          '통신판매업신고 제0000-서울-0000호',
          '문의 hello@nodiworks.com',
        ]}
        links={[
          { label: '이용약관', href: '/terms' },
          { label: '개인정보처리방침', href: '/privacy' },
          { label: '환불 정책', href: '/refund' },
        ]}
        socialLinks={[
          {
            label: 'YouTube',
            href: 'https://www.youtube.com/@nodiworks',
            icon: 'youtube',
          },
          {
            label: 'Threads',
            href: 'https://www.threads.net/@nodiworks',
            icon: 'at-sign',
          },
        ]}
      />
    </main>
  );
}
