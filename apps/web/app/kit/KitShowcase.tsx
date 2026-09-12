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

export function KitShowcase() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <main className="max-w-page mx-auto pt-5 px-gutter pb-10 flex flex-col gap-section">
      <h1 className="m-0 text-h2 font-bold text-strong">Design System Kit</h1>

      <section className="flex flex-col gap-block-tight">
        <h2 className="m-0 text-h3 font-bold text-strong">Button</h2>
        <div className="flex flex-wrap gap-inline items-center">
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

      <section className="flex flex-col gap-block-tight">
        <h2 className="m-0 text-h3 font-bold text-strong">Input</h2>
        <div className="flex flex-col gap-block-tight max-w-[480px]">
          <Input label="이메일" name="email" type="email" placeholder="you@example.com" />
          <Input label="메모" name="memo" multiline placeholder="여러 줄" error="오류 예시" />
        </div>
      </section>

      <section className="flex flex-col gap-block-tight">
        <h2 className="m-0 text-h3 font-bold text-strong">Badge · Icon</h2>
        <div className="flex flex-wrap gap-inline items-center">
          <Badge>default</Badge>
          <Badge tone="current">current</Badge>
          <Icon name="lock" size={20} />
          <Icon name="play" size={20} />
        </div>
      </section>

      <section className="flex flex-col gap-block-tight">
        <h2 className="m-0 text-h3 font-bold text-strong">SectionHeading</h2>
        <SectionHeading index="01" label="무료 자료" title="영상에서 쓴 자료, 그대로 드립니다" />
        <SectionHeading
          index="02"
          label="RESOURCES"
          title="English label tracking"
          align="center"
        />
      </section>

      <section className="flex flex-col gap-block-tight">
        <h2 className="m-0 text-h3 font-bold text-strong">BeforeAfter</h2>
        <BeforeAfter
          beforeCaption="만들기 전"
          afterCaption="기준을 준 뒤"
          before={<p>기준 없이 만든 결과</p>}
          after={<p>레퍼런스와 기준을 준 뒤</p>}
        />
      </section>

      <section className="flex flex-col gap-block-tight">
        <h2 className="m-0 text-h3 font-bold text-strong">ProductCard</h2>
        <div className="grid grid-cols-3 gap-block-tight max-[800px]:grid-cols-1">
          <ProductCard
            label="VOD · 준비 중"
            title="클로드 디자인 실전 가이드"
            summary="내 사업에 필요한 디자인을 직접 만들고 개선하는 실전 과정"
            rows={[
              { label: '추천 대상', value: '내 사업 페이지를 직접 만들어야 하는 분' },
              { label: '완성 결과', value: '재사용할 수 있는 디자인 기준과 랜딩페이지' },
              { label: '가격', value: '얼리버드 가격 예정' },
            ]}
            ctaLabel="출시 알림 신청하기"
            ctaHref="/course"
            ctaVariant="primary"
          />
          <ProductCard
            label="워크숍 · 준비 중"
            title="라이브 첨삭"
            summary="직접 만든 결과물을 가져와 함께 보며 개선합니다"
            rows={[
              {
                label: '추천 대상',
                value: 'VOD 수강 후 실제 프로젝트에 적용해보고 있는 분',
              },
              {
                label: '완성 결과',
                value: '개선된 결과물 + 이후에도 활용할 수 있는 점검 기준',
              },
              { label: '가격', value: '추후 안내' },
            ]}
            ctaLabel="출시 알림 신청하기"
            ctaHref="/course"
          />
          <ProductCard
            label="서비스"
            title="AI 결과물 마무리"
            summary="AI로 만든 초안을, 고객이 선택하는 결과물로 완성합니다"
            rows={[
              {
                label: '추천 대상',
                value: '직접 만들어봤지만 완성도를 높이는 데 어려움을 겪고 있는 분',
              },
              {
                label: '완성 결과',
                value: '고객에게 보여줄 수 있는 수준의 최종 결과물',
              },
              { label: '가격', value: '300만 원부터' },
            ]}
            ctaLabel="프로젝트 검토 요청하기"
            ctaHref="/service"
          />
        </div>
      </section>

      <section className="flex flex-col gap-block-tight">
        <h2 className="m-0 text-h3 font-bold text-strong">ResourceCard · ThumbBook · Thumb16x9</h2>
        <div className="grid grid-cols-2 gap-block-tight max-[800px]:grid-cols-1">
          <ResourceCard
            title="클로드 PPT 실전 가이드북"
            slug="claude-ppt-guidebook"
          />
          <ResourceCard
            title="클로드 랜딩페이지 디자인 체크리스트"
            slug="claude-design-landing-checklist"
          />
          <Thumb16x9 />
        </div>
      </section>

      <section className="flex flex-col gap-block-tight">
        <h2 className="m-0 text-h3 font-bold text-strong">VideoCard</h2>
        <div className="grid grid-cols-2 gap-block-tight max-[800px]:grid-cols-1">
          <VideoCard
            title="코딩 몰라도 AI로 만드는 법"
            note="클릭하면 영상이 로드됩니다"
            href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
          />
        </div>
      </section>

      <section className="flex flex-col gap-block-tight">
        <h2 className="m-0 text-h3 font-bold text-strong">EmailGate</h2>
        <EmailGate
          title="한 번 등록하면 모든 자료가 열립니다"
          description="영상에서 쓴 파일과 체크리스트를 한 번에 보내드립니다."
          buttonLabel="받기"
          consent="이메일 수집·이용과 메일 수신에 동의합니다."
          consentDetail="자료 전달, 새 자료·강의·서비스 소식 안내 목적으로 이메일 주소와 동의 기록(시각·경로·문서 버전)을 수집합니다. 수신 해지 시까지 보관하며, 모든 메일의 수신거부 링크로 언제든 해지할 수 있습니다. 해지하면 자료 페이지도 닫힙니다."
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
