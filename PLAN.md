# 노디 AI 클래스 — 구현 플랜 (v1, 2026-09-12)

> 이 문서는 Cursor가 프로젝트를 처음부터 세울 때 읽는 단일 기준 문서다.
> 코드보다 이 문서가 우선하고, 문서와 코드가 어긋나면 문서를 고친 뒤 코드를 고친다.
> **지금 구현 범위는 Step 1뿐이다.** Step 2·3은 설계와 TODO만 남기고 코드로 만들지 않는다.

---

## 0. 이 프로젝트가 무엇인가

### 0.1 한 줄
유튜브 채널 **노디 AI**(@nodiworks)의 고정댓글 링크가 가리키는 사이트. 영상에서 쓴 자료를 이메일과 교환해 나눠주고, 그 리스트에 강의(VOD)와 마무리 서비스를 판다.

### 0.2 보는 사람 (타겟 한 명)
코딩도 디자인도 모르지만 AI로 자기 사업의 랜딩페이지·브랜드·PPT·간단한 서비스를 직접 만들어야 하는 1인 사업자·예비창업자. **100% 유튜브 영상 → 고정댓글 링크로 들어온다.** 검색 유입은 없다고 가정한다.

### 0.3 사다리 (사이트가 파는 것의 순서)
| 단계 | 상품 | 사이트 위치 | Step |
|---|---|---|---|
| 무료 | 영상별 자료 (가이드북·프롬프트·체크리스트) ↔ 이메일 | `/`, `/free/[slug]` | **1** |
| 할인→정가 | VOD "클로드 디자인 실전" 10~20만 | `/course` (지금은 대기 등록만) | 2 |
| 프리미엄 | 워크숍(라이브 첨삭) / "AI 결과물 마무리" 300~500만 | `/service` (문의 폼만) | 1(폼) / 2 |

### 0.4 브랜드 규칙 (코드에도 적용)
- 화자는 **전문가가 아니라 먼저 해본 사람**. 담백한 존댓말, 느낌표·이모지 없음.
- 사이트명 **노디 AI 클래스**. 운영 주체 **Cascades**는 푸터와 `/service` 계약 문구 한 줄에만 등장한다. 내비·히어로·카드에 Cascades를 쓰지 않는다.
- 금지 어휘: 에이전시, 외주, 포트폴리오, 학원, 수강생, 혁신, 솔루션, 파트너.
- 조회수·구독자·수강생 수 같은 지표를 노출하지 않는다.
- 채널 bio와 겹치는 문장은 **채널이 기준**이다. 사이트가 채널 문장을 바꾸지 않는다.

### 0.5 절대 만들지 않는 것 (Step 1)
회원가입, 로그인, 결제, 영상 플레이어, 블로그, 채팅, 관리자 화면, 캠페인 발송 도구, 애널리틱스 파이프라인. 필요해 보여도 Step 2 TODO에 적고 넘어간다.

---

## 1. 리포지토리 구조

```
nodi-class/
├── PLAN.md                     ← 이 문서
├── AGENTS.md                   ← Cursor/에이전트용 짧은 규칙 (§12)
├── .cursor/rules/              ← 스코프별 규칙 (§12)
├── package.json                ← pnpm workspaces 루트
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── .env.example
├── apps/
│   └── web/                    ← Next.js 15 (App Router) — 디자인 산출물의 구현체
├── packages/
│   ├── design-system/          ← 토큰 CSS + React 컴포넌트 (Claude Design _ds 이관)
│   └── shared/                 ← zod 스키마·타입·상수 (web과 lambda가 함께 씀)
├── services/
│   └── api/                    ← Lambda 핸들러 (subscribe / confirm / inquiry / unsubscribe)
├── infra/                      ← AWS CDK v2 (TypeScript)
├── content/
│   └── resources/              ← 무료 자료 MDX (slug별 폴더)
└── design/                     ← Claude Design 원본 zip 해제본 (읽기 전용, 참고용)
```

### 1.1 도구 버전 고정
- Node 22 LTS, pnpm 9
- Next.js 15 (App Router, React 19, TypeScript strict)
- AWS CDK v2 최신, `aws-cdk-lib` + `constructs`, Lambda 런타임 Node 22, 번들은 `NodejsFunction`(esbuild)
- AWS SDK v3 (`@aws-sdk/client-dynamodb`, `@aws-sdk/lib-dynamodb`, `@aws-sdk/client-sesv2`)
- zod, vitest, eslint(flat config), prettier
- **Tailwind 쓰지 않는다.** 디자인 시스템이 CSS 변수 기반이라 충돌한다. **vanilla-extract** + 토큰 CSS 변수만 쓴다 (`*.css.ts`). CSS Modules·인라인 hex는 쓰지 않는다.

### 1.2 워크스페이스 이름
- `@nodi/web`, `@nodi/design-system`, `@nodi/shared`, `@nodi/api`, `@nodi/infra`

### 1.3 루트 스크립트
```json
{
  "dev": "pnpm --filter @nodi/web dev",
  "build": "pnpm -r build",
  "lint": "pnpm -r lint",
  "test": "pnpm -r test",
  "typecheck": "pnpm -r typecheck",
  "infra:diff": "pnpm --filter @nodi/infra cdk diff",
  "infra:deploy": "pnpm --filter @nodi/infra cdk deploy --all",
  "infra:destroy": "pnpm --filter @nodi/infra cdk destroy --all"
}
```

---

## 2. 디자인 이관 규칙 (`design/` → `packages/design-system` + `apps/web`)

Claude Design 산출물(`design/`)은 **참고용 원본**이다. 그대로 실행하지 않고 아래 규칙으로 옮긴다.

### 2.1 토큰: 그대로 복사
`design/_ds/*/tokens/{fonts,colors,typography,spacing,shape,motion,base}.css` 와 `styles.css` 를 `packages/design-system/src/tokens/` 로 **값 하나 바꾸지 않고** 복사한다. `apps/web/app/layout.tsx`에서 순서대로 import한다 (fonts → colors → typography → spacing → shape → motion → base → styles).

Pretendard는 jsDelivr CDN이 아니라 **`apps/web/public/fonts/`에 woff2를 넣고 self-host**한다 (Regular·Bold 두 벌만). `fonts.css`의 `src` 경로만 로컬로 바꾼다. 이유: CDN 장애·CORS·성능.

### 2.2 컴포넌트: 매니페스트 기준으로 재작성
`_ds_manifest.json`의 12개 컴포넌트를 같은 이름·같은 props로 `packages/design-system/src/components/`에 TSX로 만든다. 번들(`_ds_bundle.js`)을 그대로 쓰지 않는다 (React 전역 의존, 런타임 템플릿).

| 컴포넌트 | 경로 | Props (디자인 파일에서 확인된 것) | 비고 |
|---|---|---|---|
| Button | core | `variant: 'primary'\|'secondary'`, `size?: 'md'\|'sm'`, `icon?`, `href?`, `type?`, `disabled?`, `loading?` | primary=민트 채움+`--text-on-accent`, secondary=투명+1px 보더. 3단계 없음 |
| Input | core | `label`, `type?`, `name`, `placeholder?`, `error?`, `required?`, `multiline?`(textarea) | 포커스 보더만 민트 |
| Badge | core | `children`, `tone?: 'default'\|'current'` | 현재 상태만 `--accent-quiet` 배경 |
| Icon | core | `name` (lucide 이름), `size?` | lucide-react 사용, 색은 `currentColor` |
| SectionHeading | content | `index: '01'`, `label`, `title`, `align?: 'left'\|'center'` | 라벨 12px 0.08em은 영문에만. 한글 라벨은 자간 0 |
| BeforeAfter | content | `beforeCaption`, `afterCaption`, `before: ReactNode`, `after: ReactNode` | 375에서 1열 |
| ProductCard | cards | `label`, `title`, `summary`, `rows: {label,value}[3]`, `ctaLabel`, `ctaHref?`, `ctaVariant?: 'primary'\|'secondary'` | rows는 정확히 3개. 홈·클래스 상품 카드 CTA는 모두 **primary** |
| ResourceCard | cards | `title`, `slug`, `locked: boolean`, `thumbnail?`, `openLabel?`, `fromVideo?`(기본 true) | `fromVideo` 시 Badge `영상에서 소개`. 잠금 시 자물쇠 아이콘, 열림 시 openLabel |
| Thumb16x9 | cards | `src?`, `alt?` | 이미지 없으면 `--surface-raised` 플레이스홀더 |
| VideoCard | cards | `title`, `note`, `href`, `thumbnail?` | 조회수 표시 없음. 유튜브 임베드는 클릭 후 로드(iframe 지연) |
| EmailGate | blocks | `title`, `description?`, `buttonLabel`, `consent`, `submittedLabel`, `submitted: boolean`, `onSubmit(email, extra)`, `extraField?`(select 1개) | 375에서 입력 100% + 버튼 다음 줄 full width. **입력창이 카드 밖으로 넘치지 않게** |
| SiteFooter | blocks | `operator`, `business: string[]`, `links: {label,href}[]`, `socialLinks: {label,href,icon}[]` | 사업자 정보 값은 env에서 |

### 2.3 이관하면서 정리할 것 (디자인 파일에 남아 있는 결함)
- [ ] 4개 페이지 `h1` 인라인 `font-family:'IBM Plex Sans KR'` 와 `letter-spacing:-0.035em` 제거 → 시스템 `--font-sans`, `--tracking-hero`(-0.02em), `--leading-hero`. `<head>`의 Google Fonts 링크 삭제.
- [ ] 홈 375 `h1`이 긴 버전("코딩·디자인 몰라도, 내 사업에 필요한…")으로 남아 있음 → 1440과 동일한 2줄 카피(§3.1)로 통일. 모바일 36px.
- [x] 홈 03 상품 카드 3개 버튼 → VOD·워크숍·서비스 모두 primary.
- [ ] `/free` 잠금 상태에서 게이트 아래 Part 01~ 스켈레톤/본문을 `filter: blur(6px)` + 오버레이로 이어서 보여줄 것 (게이트 뒤가 비어 있으면 안 됨).
- [ ] 홈 04 "만든 사람" 3줄 → 첫 줄만 20px Bold, 나머지 16px Regular `--text-body`.
- [ ] 목차 `[ ]` 플레이스홀더와 본문 스켈레톤 → `content/resources/*`의 실제 MDX로 대체.

### 2.4 디자인 준수 자동 검사
`design/_ds/*/_adherence.oxlintrc.json` 규칙 취지를 eslint 커스텀 룰 2개로 옮긴다.
- `no-raw-color`: `apps/web`, `packages/design-system/components` 안에서 hex 리터럴·`rgb(` 금지 (토큰 변수만).
- `no-shadow`: `box-shadow` 선언 금지.
CI 없이 `pnpm lint`에서 걸리게만 한다.

---

## 3. 페이지 스펙과 확정 카피 (`apps/web`)

라우트는 App Router. 모든 페이지는 서버 컴포넌트 기본, 폼만 클라이언트 컴포넌트.

공통 레이아웃: 상단 내비 `[노디 AI`(Bold) + `클래스`(Regular) 워드마크] · 무료 자료(/#free) · 클래스(/course) · 서비스(/service) · [유튜브 ↗](secondary sm)`. 현재 페이지 항목만 `--accent` 색. 푸터는 `SiteFooter`.

### 3.1 `/` 홈
> 홈 레이아웃·카피는 `design/Home.dc.html` 1440 확정안을 따른다. (구 PLAN 3줄 h1·중간 EmailGate는 폐기.)

| 블록 | 내용 |
|---|---|
| 히어로(중앙) | 라벨 `노디 AI 클래스` / **h1** `코딩 몰라도,` / `이제 AI로 직접 만들 수 있습니다` (2줄, `<br>`, keep-all, 마침표 없음) / 서브 `노디 AI 유튜브에서 소개한 프롬프트 · 가이드를 한곳에 정리했습니다.` + `내 사업에 바로 써볼 수 있는 자료부터 무료로 시작해보세요.` / Primary `무료 자료 받기`(→ `#free`) · Secondary `유튜브에서 보기` |
| 01 / 무료 자료 (`id="free"`) | 제목 `영상에서 쓴 자료, 내 사업에 바로 써보세요` / ResourceCard 4개 (§4 슬러그 순, Badge `영상에서 소개` + 잠금 아이콘). **이 섹션에 EmailGate 없음** |
| 02 / 이렇게 달라집니다 | BeforeAfter(캡션 `만들기 전` / `기준을 준 뒤`) / 캡션 `같은 클로드라도, 어떤 레퍼런스와 기준을 주느냐에 따라 결과가 달라집니다.` / 이미지는 `public/img/before.png`, `after.png` |
| 03 / 클래스 | 제목 `직접 만들어봤다면, 이제 기준을 배워보세요` / ProductCard ×3 (§3.5, CTA 모두 primary) |
| 04 / 만든 사람 | 프로필(1:1 정사각, `--surface-raised`) + `직접 제품을 만들고 운영해 온 5년차 프로덕트 엔지니어`(Bold 20px) / `컴퓨터소프트웨어공학 석사` / `비전공자 대상 풀스택 개발 부트캠프 강사` / 소형 `유튜브 노디 AI 운영` |
| 최종 CTA(중앙) | `무료 자료로 먼저 직접 만들어보세요` + EmailGate(제목 `한 번 등록하면 모든 자료가 열립니다`, 버튼 `받기`, extraField=§5.2) |

### 3.2 `/free/[slug]` 자료 상세
- 정적 경로: `generateStaticParams`로 `content/resources/*` 슬러그 전부.
- 상단: 라벨(frontmatter `series`), h1(frontmatter `title`), 서브(frontmatter `summary`), 우측 VideoCard(frontmatter `youtube`).
- 목차: MDX `##` 헤딩을 파싱해 번호 리스트로 자동 생성.
- 본문 게이트: frontmatter `freeParts: 1` 만큼(기본 Part 00 하나) 공개, 이후는 잠금.
  - 잠금(쿠키 없음): 공개 파트 → **EmailGate**(제목 `이메일을 남기면 지금 바로 열립니다`, 서브 `같은 주소로 다음 자료도 보내드립니다`, 버튼 `열기`) → 나머지 파트를 blur 6px + 오버레이로 렌더(텍스트는 DOM에 넣지 않는다. 스켈레톤 블록만. 크롤·복사 방지).
  - 열림(쿠키 유효): 게이트 자리에 체크 아이콘 + `메일로도 보냈습니다` → 본문 전체.
- 하단: `다른 자료` ResourceCard 2개 (현재 slug 제외, 최근순).
- 게이트 제출 성공 시 UI: 버튼 비활성 + `입력한 이메일로 확인 링크를 보냈습니다. 메일의 링크를 누르면 바로 열립니다.` (메일 클릭 전엔 안 열린다 — §6.1)

### 3.3 `/course` 클래스
- 히어로(좌측): 라벨 `VOD · 준비 중` / h1 `클로드 디자인 실전` / 서브 `디자이너 없이 돈 버는 페이지를 반복해서 만들어야 하는 분을 위한 과정입니다. 프롬프트가 아니라 고르는 기준을 배웁니다.` / EmailGate(제목 `출시 알림 받기`, 서브 `알림 신청자에게만 얼리버드 가격을 먼저 안내합니다`, 버튼 `알림 받기`, tag=`course-waitlist`)
- 01 / 커리큘럼: 카드 4 — `보는 기준 — 좋은 레퍼런스를 고르고 뜯어 쓰는 법` / `만드는 기준 — 디자인 시스템을 먼저 세팅하고 그 위에서 만드는 법` / `고치는 기준 — AI가 뽑은 5개 중 뭐가 나은지 판단하고 첨삭하는 법` / `반복하는 시스템 — 한 번 만든 기준으로 상세·PPT·SNS까지 뽑는 법`
- 02 / 매주 남는 것: `내 브랜드 레퍼런스 보드 1개` / `클로드 디자인에 저장된 디자인 시스템 1개` / `랜딩페이지 완성본 1개` / `다음 페이지에 바로 쓰는 프롬프트 템플릿`
- 03 / 가격: `출시 시 얼리버드 가격을 알림 신청자에게 먼저 안내합니다` (숫자 없음)
- 하단: ProductCard 워크숍·서비스 (secondary)

### 3.4 `/service` AI 결과물 마무리
- 히어로(좌측): 라벨 `AI 결과물 마무리` / h1 `AI로 만든 초안을,` `내놓을 수 있는 결과물로 마무리합니다.` / 서브 `직접 해보다 한계를 느낀 분만 받습니다. 처음부터 맡기는 제작은 하지 않습니다.`
- 01 / 이런 상태면 맞습니다 (체크 리스트 4): `클로드·러버블로 만들긴 했는데 어딘가 싸 보입니다` / `광고를 돌렸는데 클릭만 있고 문의가 없습니다` / `수정하려고 손대면 다른 데가 깨집니다` / `내놓을 수 있는 수준까지만 누가 정리해 줬으면 합니다`
- 02 / 이런 경우는 받지 않습니다 (저대비 3): `아직 아무것도 만들어 보지 않은 경우` / `기획부터 전부 맡기고 싶은 경우` / `쇼핑몰·앱 전체처럼 페이지 5개를 넘는 경우`
- 03 / 진행 방식 (3단계 카드): `현재 결과물 링크 보내기` → `2영업일 내 범위·견적 회신` → `계약 후 2주 내 마무리`
- 04 / 비용: `300~500만원. 범위를 확인한 뒤 확정합니다.`
- 문의 폼: 이름 · 이메일 · 현재 결과물 링크(URL) · 어디에서 막혔나요?(textarea) · 동의 체크 · 버튼 `프로젝트 검토 요청하기` · 소형 `계약과 세금계산서는 Cascades 명의로 진행합니다.`
- 이 페이지에 VideoCard·ResourceCard 없음.

### 3.5 상품 카드 데이터 (홈·클래스 공통, `packages/shared/src/products.ts`)
```ts
export const products = {
  vod:      { label: 'VOD · 준비 중', title: '클로드 디자인 실전',
              summary: '디자이너 없이 내 사업의 페이지를 반복해서 만드는 과정',
              rows: [['누구에게','내 사업 페이지를 직접 만들어야 하는 분'],['남는 것','매주 파일 하나'],['가격','얼리버드 가격 예정']],
              cta: { label: '출시 알림 받기', href: '/course', variant: 'primary' } },
  workshop: { label: '워크숍 · 준비 중', title: '라이브 첨삭',
              summary: '직접 만든 결과물을 가져오면 화면을 보며 함께 고칩니다',
              rows: [['누구에게','VOD 수료 후 실제 프로젝트가 있는 분'],['남는 것','고친 결과물 + 기준표'],['가격','추후 안내']],
              cta: { label: '알림 받기', href: '/course', variant: 'primary' } },
  service:  { label: '서비스', title: 'AI 결과물 마무리',
              summary: 'AI로 만든 초안을, 내놓을 수 있는 결과물로 마무리합니다',
              rows: [['누구에게','직접 해보다 한계를 느낀 분'],['남는 것','내놓을 수 있는 완성본'],['가격','300만원부터']],
              cta: { label: '프로젝트 검토 요청하기', href: '/service', variant: 'primary' } },
} as const;
```

### 3.6 그 외 필수 페이지 (Step 1)
| 라우트 | 내용 |
|---|---|
| `/unlock` | 쿼리 `t=`(§6.2 토큰) 검증 → 쿠키 발급 → `next` 슬러그로 리다이렉트. 실패 시 `/free/[slug]?expired=1` |
| `/unsubscribe` | 쿼리 `t=` → API `POST /unsubscribe` 호출 → `수신을 해지했습니다.` 한 줄 |
| `/privacy` | 개인정보처리방침 (수집 항목: 이메일·선택 정보·유입 경로·동의 시각 / 목적: 자료 전달·새 자료 안내 / 보관: 해지 시까지 / 처리 위탁: AWS) |
| `/terms` | 이용약관 (Step 1은 무료 서비스 범위만) |
| `/refund` | 환불 정책 — Step 1은 "현재 유료 상품이 없습니다" 한 줄. Step 2에서 채움 |
| `/not-found` | 시스템 톤으로 한 줄 |

---

## 4. 콘텐츠 (`content/resources`)

```
content/resources/
├── claude-ppt-guidebook/
│   ├── index.mdx
│   └── thumb.png
├── claude-prompt-set/
├── claude-design-landing-checklist/
└── ai-design-5-principles/
```

frontmatter:
```yaml
---
slug: claude-ppt-guidebook
title: 클로드 PPT 실전 가이드북
series: 실전 가이드북 Vol.1
summary: 레퍼런스를 찾고 디자인 시스템으로 저장해서, 실무에서 반복해 쓸 수 있는 AI 티 안 나는 PPT를 만드는 방법
youtube: https://www.youtube.com/watch?v=uDvNvAEhWs4
freeParts: 1
publishedAt: 2026-09-08
downloads:            # 선택. 있으면 열림 상태에서 presigned 링크 버튼 노출
  - label: 프롬프트 7종 (txt)
    key: claude-ppt-guidebook/prompts.zip   # S3 key
---
```

- 본문은 `## Part 00. 먼저 알아두기` 형식의 `##` 헤딩으로 파트를 나눈다. 목차와 게이트 분리는 이 헤딩 기준.
- 기존 노션 페이지 2개를 MDX로 옮긴다: `cascades-studio.notion.site/PPT-3d540dc0dcc08009bc18cce26662df57`, `.../3cf40dc0dcc080db9593fb7631b44953`. 나머지 2개 슬러그는 frontmatter만 만들고 본문은 `준비 중` (카드는 노출하되 클릭 시 `/free/[slug]`에서 알림 게이트만).
- 코드블록(프롬프트)은 복사 버튼 있는 컴포넌트로 렌더.

---

## 5. 데이터 모델 (DynamoDB, 온디맨드)

### 5.1 `nodi-subscribers`
| 속성 | 타입 | 설명 |
|---|---|---|
| `pk` | S | `EMAIL#<lowercased email>` |
| `sk` | S | `PROFILE` |
| `email` | S | 원문(소문자) |
| `status` | S | `pending` \| `active` \| `unsubscribed` |
| `source` | S | 최초 유입 slug (`yt-ppt`, `course-waitlist` …) |
| `building` | S | §5.2 select 값 |
| `tags` | SS | `resource:claude-ppt-guidebook`, `course-waitlist` … (요청한 자료·대기 등록 누적) |
| `consentAt` | S | ISO, 폼 제출 시각 |
| `confirmedAt` | S | 메일 링크 클릭 시각 |
| `unsubscribedAt` | S | |
| `unsubToken` | S | 랜덤 32자, 수신거부 링크용 (교체 없음) |
| `ip`, `ua` | S | 동의 증빙용 (90일 후 삭제 TODO) |
| `createdAt`, `updatedAt` | S | |
| `gsi1pk` | S | `STATUS#<status>` |
| `gsi1sk` | S | `<createdAt>` |

GSI `gsi1` (`gsi1pk`, `gsi1sk`) — 발송 대상 조회용.

### 5.2 `building` select 값 (폼 extraField, 필수 아님)
`landing`(랜딩페이지) · `brand`(브랜드·로고) · `ppt`(PPT) · `app`(서비스·앱) · `none`(아직 없음)
필드는 **이 하나만**. 이름·전화·업종은 받지 않는다.

### 5.3 `nodi-inquiries`
| 속성 | 타입 |
|---|---|
| `pk` | `INQ#<ulid>` |
| `sk` | `META` |
| `name`, `email`, `resultUrl`, `blocked`(막힌 지점), `status`(`new`\|`replied`\|`closed`), `createdAt`, `ip`, `ua` | |
| `gsi1pk` = `STATUS#new`, `gsi1sk` = `createdAt` | |

### 5.4 `nodi-events` (경량 로그, TTL 90일)
`pk` = `EMAILHASH#<sha256>`, `sk` = `<ts>#<event>` — `subscribe.requested`, `subscribe.confirmed`, `gate.opened(slug)`, `mail.sent(template)`, `unsubscribe`. 대시보드 없음. 전환율은 이 테이블을 스크립트로 집계(§10).

### 5.5 zod 스키마 (`packages/shared/src/schemas.ts`)
```ts
export const SubscribeInput = z.object({
  email: z.string().email().max(254).transform(s => s.trim().toLowerCase()),
  slug: z.string().regex(/^[a-z0-9-]{3,64}$/),          // 요청한 자료 또는 'course-waitlist'
  source: z.string().regex(/^[a-z0-9-]{0,64}$/).optional(),
  building: z.enum(['landing','brand','ppt','app','none']).optional(),
  consent: z.literal(true),
  website: z.string().max(0).optional(),                  // 허니팟: 채워지면 거절
  turnstile: z.string().min(10),
});
export const InquiryInput = z.object({
  name: z.string().min(1).max(40),
  email: z.string().email(),
  resultUrl: z.string().url().max(2048),
  blocked: z.string().min(10).max(2000),
  consent: z.literal(true),
  website: z.string().max(0).optional(),
  turnstile: z.string().min(10),
});
```

---

## 6. 게이트·인증 메커니즘

### 6.1 흐름
1. 폼 제출 → `POST /subscribe` → Turnstile 검증 → 허니팟 검증 → `subscribers` upsert(`status`가 이미 `active`면 그대로) → `tags`에 `resource:<slug>` 추가 → **확인 메일** 발송(§7.1) → `202 { ok: true, state: 'pending' | 'active' }`
2. 이미 `active`인 이메일이면 확인 메일 대신 **자료 링크 메일**(§7.2)을 보내고 `state:'active'` 반환. 프론트는 이 경우 `이미 등록된 주소입니다. 메일로 링크를 다시 보냈습니다.` 표시.
3. 메일의 링크 → `GET /confirm?t=<token>` (Lambda) → 토큰 검증 → `status=active`, `confirmedAt` → **자료 링크 메일**(§7.2) 발송 → `302 https://<site>/unlock?t=<gateToken>&next=/free/<slug>`
4. `/unlock`(Next Route Handler) → gateToken 검증 → 쿠키 `nodi_access` 설정 → `next`로 302
5. `/free/[slug]` 서버 컴포넌트가 쿠키를 검증해 열림/잠금 렌더

메일 클릭 전에는 절대 열리지 않는다. 이게 더블 옵트인이자 광고성 메일 동의 증빙이다.

### 6.2 토큰 (`packages/shared/src/token.ts`, HMAC-SHA256)
- 형식 `v1.<payload-base64url>.<sig-base64url>`
- confirm 토큰 payload: `{ t:'c', e:<email>, s:<slug>, x:<exp unix> }` — 만료 7일, 1회용 아님(재클릭 허용, 멱등)
- gate 토큰 payload: `{ t:'g', h:<sha256(email)>, x:<exp> }` — 만료 5분(URL에 노출되는 시간 최소화)
- 쿠키 `nodi_access` 값: `v1.<{ t:'k', h, x }>.<sig>` — 만료 90일, `HttpOnly; Secure; SameSite=Lax; Path=/`
- 비밀키 `GATE_SECRET`: SSM SecureString. Lambda와 Next 양쪽에 같은 값. **Next는 DynamoDB에 접근하지 않는다** — 쿠키 검증은 서명만으로 끝낸다.
- 이메일 원문은 쿠키·URL에 넣지 않는다 (해시만).

### 6.3 수신거부
메일 푸터 링크 `https://<site>/unsubscribe?t=<unsubToken>` → 페이지가 `POST /unsubscribe {t}` → `status=unsubscribed`. 모든 메일에 `List-Unsubscribe: <https://<site>/unsubscribe?t=…>` 와 `List-Unsubscribe-Post: List-Unsubscribe=One-Click` 헤더.

---

## 7. 이메일 (SES v2)

### 7.1 템플릿 4종 (`services/api/src/mail/templates/*.ts`, 텍스트+HTML)
| 키 | 제목 | 본문 골자 |
|---|---|---|
| `confirm` | `[노디 AI 클래스] 자료를 열려면 이 링크를 눌러주세요` | 한 줄 안내 + 버튼(민트) + 만료 7일 + 푸터 |
| `resource` | `[노디 AI 클래스] <자료 제목>` | 자료 링크(`/free/<slug>` + gateToken) + 있으면 다운로드 presigned URL(1시간) + 푸터 |
| `inquiry-notify` (나에게) | `[검토 요청] <이름> · <결과물 도메인>` | 폼 내용 전부 + DynamoDB 키 |
| `inquiry-ack` (신청자) | `[노디 AI 클래스] 검토 요청을 받았습니다` | `2영업일 내 회신드립니다` + 푸터 |

푸터 공통: 발신자 표시(노디 AI 클래스 · 운영 Cascades · 사업자정보 · 주소) + 수신거부 링크. 이모지·느낌표 없음. HTML은 테이블 레이아웃, 다크 아님(메일 클라이언트 호환) — 민트 버튼 하나만.

### 7.2 발송 설정
- 발신 도메인 `mail.<NODI_DOMAIN>` (메인 도메인 평판 분리). From `노디 AI 클래스 <hello@mail.<domain>>`, Reply-To `contact@cascades.studio`.
- DKIM(Easy DKIM) + SPF + DMARC(`p=none`으로 시작) 레코드는 CDK가 Route53에 생성.
- Configuration set `nodi-transactional` + SNS 토픽으로 bounce/complaint 수신 → Lambda `ses-events`가 `status=unsubscribed`, `bounceAt` 기록.
- **샌드박스 해제(Production access) 신청은 코드보다 먼저** — 승인 24시간. 그 전엔 검증된 수신자에게만 발송됨.

---

## 8. API (API Gateway HTTP API + Lambda)

Base: `https://api.<NODI_DOMAIN>` (커스텀 도메인, ACM 인증서 us-east-1 아님 — HTTP API는 리전 인증서). CORS: `https://<NODI_DOMAIN>`만.

| 메서드 | 경로 | 핸들러 | 입력 | 응답 |
|---|---|---|---|---|
| POST | `/subscribe` | `subscribe.ts` | `SubscribeInput` JSON | `202 { ok, state}` / `400 {error:'invalid'}` / `403 {error:'bot'}` / `429` |
| GET | `/confirm` | `confirm.ts` | `?t=` | `302` → `/unlock…` / `302` → `/free/<slug>?expired=1` |
| POST | `/inquiry` | `inquiry.ts` | `InquiryInput` | `202 {ok}` |
| POST | `/unsubscribe` | `unsubscribe.ts` | `{t}` | `200 {ok}` (토큰 불일치도 200 — 열거 방지) |
| POST | `/internal/ses-events` | `ses-events.ts` | SNS | SNS 구독, 외부 노출 안 함 |

공통:
- 스로틀: 라우트별 burst 10 / rate 5 rps. 추가로 IP당 분당 10회를 `nodi-events`로 카운트(초과 시 429).
- Turnstile 시크릿은 SSM. 검증 실패 → 403.
- 모든 핸들러는 `zod` parse → 비즈니스 → 응답. 예외는 `500 {error:'internal'}`, 상세는 CloudWatch만.
- 로그에 이메일 원문 남기지 않는다 (해시).
- 응답 지연 목표 < 800ms (SES 발송은 응답 후가 아니라 안에서. 실패 시 202 반환하되 events에 `mail.failed` 기록 — 재시도는 Step 2 TODO).

---

## 9. 인프라 (`infra/`, CDK v2)

### 9.1 스택 구성 (환경 `dev` / `prod`, 컨텍스트 `-c env=prod`)
```
NodiDataStack        DynamoDB ×3 (PITR on prod), 삭제 보호 prod
NodiMailStack        SES 도메인 identity(mail.<domain>), DKIM·SPF·DMARC Route53 레코드,
                     configuration set, SNS 토픽(bounce/complaint)
NodiApiStack         Lambda ×5 (NodejsFunction, Node22, arm64, 256MB, 10s),
                     HTTP API + 라우트 + 스로틀, 커스텀 도메인 api.<domain>, ACM,
                     IAM 최소 권한(테이블·SES SendEmail·SSM GetParameter만)
NodiWebStack         (Step 1은 비어 있음 — 호스팅은 Amplify 콘솔로) TODO §11
```
- Route53 호스티드 존은 **CDK 밖에서 이미 존재**한다고 가정하고 `fromLookup`.
- 비밀: `/nodi/<env>/GATE_SECRET`, `/nodi/<env>/TURNSTILE_SECRET` — SSM SecureString, 콘솔에서 수동 생성. CDK는 참조만.
- 출력: API URL, 테이블 이름 → `apps/web/.env.local`에 손으로 옮긴다 (자동화 TODO).

### 9.2 호스팅 (Step 1)
Amplify Hosting을 콘솔에서 GitHub 연결로 세팅한다 (모노레포 설정: appRoot `apps/web`, 빌드 `pnpm install --frozen-lockfile && pnpm --filter @nodi/web build`). 환경 변수는 §10. 커스텀 도메인 `<NODI_DOMAIN>` + `www` 리다이렉트. CDK로 옮기는 건 TODO.

### 9.3 비용 가드
DynamoDB 온디맨드, Lambda arm64, CloudWatch 로그 보존 14일(dev) / 90일(prod). 예산 알람 월 $10.

---

## 10. 환경 변수

`.env.example`:
```
# apps/web
NEXT_PUBLIC_SITE_URL=https://nodiworks.example
NEXT_PUBLIC_API_URL=https://api.nodiworks.example
NEXT_PUBLIC_TURNSTILE_SITE_KEY=
NEXT_PUBLIC_YOUTUBE_URL=https://www.youtube.com/@nodiworks
NEXT_PUBLIC_THREADS_URL=https://www.threads.net/@nodiworks
GATE_SECRET=                      # SSM과 동일 값. Amplify 환경변수로 주입
BIZ_NAME=                          # 상호
BIZ_OWNER=                         # 대표
BIZ_REG_NO=                        # 사업자등록번호
BIZ_ADDRESS=
BIZ_EMAIL=contact@cascades.studio

# infra (cdk.context 또는 -c)
NODI_DOMAIN=
NODI_ENV=dev
NOTIFY_EMAIL=contact@cascades.studio
```
사업자 정보는 **비어 있어도 빌드가 되어야** 하고, 비어 있으면 푸터에 `[ ]`가 아니라 해당 줄을 렌더하지 않는다.

---

## 11. Step 1 구현 순서 (체크리스트 = Cursor 작업 단위)

각 항목은 하나의 커밋. 완료 조건(DoD)이 안 맞으면 다음으로 안 넘어간다.

### S1-0 준비 (사람이 먼저, 코드 밖)
- [ ] SES: `mail.<domain>` identity 생성 → **Production access 신청** (오늘)
- [ ] Route53 호스티드 존 존재 확인
- [ ] Cloudflare Turnstile 사이트 생성 → 키 2개
- [ ] SSM에 `GATE_SECRET`(openssl rand -base64 48), `TURNSTILE_SECRET` 저장
- [ ] Pretendard Regular/Bold woff2 확보
- [ ] before/after 이미지, 프로필 이미지, 자료 썸네일 4장

### S1-1 리포 골격
- [x] pnpm workspaces, tsconfig.base, eslint flat config, prettier, vitest 루트 설정
- [x] 5개 워크스페이스 빈 패키지 + 각 `typecheck`/`lint`/`test` 스크립트
- [x] `AGENTS.md`, `.cursor/rules/*` (§12)
- DoD: `pnpm install && pnpm typecheck && pnpm lint` 통과

### S1-2 shared
- [x] `schemas.ts`, `token.ts`(sign/verify + 테스트), `products.ts`, `constants.ts`(쿠키명·만료·slug 목록)
- DoD: token 테스트 — 정상/만료/위조/타입 불일치 4케이스

### S1-3 design-system
- [x] 토큰 CSS 복사 + Pretendard self-host
- [x] 12개 컴포넌트 TSX (§2.2 props) + 각각 스토리 없이 `apps/web/app/_kit/page.tsx`(개발용 킷 페이지, prod에서 404)
- [x] eslint 룰 `no-raw-color`, `no-shadow`
- DoD: 킷 페이지에서 1440/375 두 폭으로 전 컴포넌트 육안 확인, 375 EmailGate 오버플로 없음

### S1-4 web 페이지 (정적 부분)
- [x] 레이아웃(내비·푸터), `/`, `/course`, `/service`, `/privacy`, `/terms`, `/refund`, not-found
- [x] MDX 파이프라인(`@next/mdx` 또는 `next-mdx-remote`), frontmatter 파싱, 목차 생성, 파트 분리
- [x] `content/resources` 4개 슬러그(본문은 2개 실제, 2개 준비 중)
- [x] `/free/[slug]` 잠금 렌더(쿠키 없음 상태), blur 영역
- DoD: `pnpm build` 성공, Lighthouse 모바일 성능 90+, 카피가 §3과 글자 단위로 일치 — **Lighthouse는 배포 후 수동**

### S1-5 infra (data + mail)
- [x] `NodiDataStack`, `NodiMailStack` 코드 — `cdk deploy -c env=dev`는 **사람/자격증명 필요**
- DoD: 테이블 3개 존재, SES identity Verified, DKIM 3레코드 Success — **배포 후 확인**

### S1-6 api
- [x] 핸들러 5개 + `mail/` 템플릿 4종 + `db/` 리포지토리 + Turnstile 클라이언트
- [x] 단위 테스트: subscribe(신규/기존active/허니팟/bot), confirm(정상/만료), inquiry, unsubscribe
- [x] `NodiApiStack` 코드 — 배포·커스텀 도메인은 **사람/자격증명 필요**
- DoD: `curl`로 4개 엔드포인트 시나리오 통과, 실메일 2통 — **배포 후 확인**

### S1-7 web 연결
- [x] EmailGate `onSubmit` → `/subscribe` 호출, 상태 UI 3종(대기/기존/오류)
- [x] `/unlock`, `/unsubscribe` 라우트 핸들러
- [x] `/free/[slug]` 열림 상태 렌더, 다운로드 버튼(presigned는 스텁 `#` — S3 연동 TODO)
- [x] 서비스 폼 → `/inquiry`
- [x] Turnstile 위젯(보이지 않는 모드)
- DoD: E2E 완주 — **API·SES 배포 후 브라우저 확인**

### S1-8 배포·연결
- [x] `amplify.yml` + `DEPLOY.md` 체크리스트 작성
- [ ] Amplify 앱 생성, 도메인 연결, 환경변수 — **사람**
- [ ] prod 스택 배포, SES production access 승인 확인 — **사람**
- [ ] 유튜브 고정댓글 링크 4개를 `/free/<slug>?src=yt-<slug>`로 교체 — **사람**
- [ ] 노션 공개 페이지 2개는 상단에 "새 주소로 옮겼습니다" 한 줄 + 링크만 남기고 본문 삭제 — **사람**
- DoD: 실제 시청자 유입 후 24시간 내 `nodi-events`에 `subscribe.confirmed` 1건 이상

### S1-9 측정 스크립트
- [x] `scripts/report.ts`: 기간별 `subscribe.requested / confirmed / gate.opened` 카운트, slug별, `active` 총수 — 터미널 출력만 (`pnpm report`)
- DoD: 매주 일요일 수동 실행 가능 (테이블 배포 후)

---

## 12. 에이전트 규칙 (`AGENTS.md`, `.cursor/rules`)

`AGENTS.md`(루트, 짧게):
```
- PLAN.md가 기준이다. 범위 밖 기능은 만들지 말고 PLAN.md §13 TODO에 한 줄 추가한다.
- 카피는 PLAN.md §3의 문장을 글자 단위로 쓴다. 문구를 '개선'하지 않는다.
- 색·그림자·폰트: 토큰 변수만. hex 리터럴·box-shadow·Tailwind 금지. 스타일은 vanilla-extract(`*.css.ts`).
- 이메일 원문을 로그·URL·쿠키에 넣지 않는다.
- Next(apps/web)는 AWS SDK를 import하지 않는다. 데이터 접근은 전부 services/api.
- 새 npm 의존성은 추가 전에 이유를 커밋 메시지에 쓴다.
- 커밋 단위는 PLAN.md §11 체크리스트 항목 하나.
```

`.cursor/rules/`:
- `web.mdc` (glob `apps/web/**`): 서버 컴포넌트 기본, 클라이언트는 폼·Turnstile만. vanilla-extract. 이미지는 `next/image`. 한글 `word-break: keep-all`.
- `api.mdc` (glob `services/api/**`): 핸들러 = parse → service → response. 응답 스키마는 shared에서. 콘솔 로그 대신 구조화 로그(JSON). 테스트 필수.
- `infra.mdc` (glob `infra/**`): 스택 4개 이름 고정. `RemovalPolicy.RETAIN`은 prod 테이블만. 시크릿은 코드에 절대 없음.
- `design.mdc` (glob `packages/design-system/**`): props는 §2.2 표와 일치. 새 variant 추가 금지. vanilla-extract.

---

## 13. TODO — Step 2 (VOD 완성 후 착수, 코드 없음)

착수 게이트: **VOD 녹화 완료 + `active` 구독자 300명**. 미만이면 인프런 등 입점을 먼저 검토한다.

- [ ] **회원**: Cognito User Pool, 이메일 OTP 패스워드리스(비밀번호 없음). 첫 로그인 시 `subscribers` 레코드와 `userId` 연결. Amplify Auth + 자체 UI(호스티드 UI 안 씀).
- [ ] **엔타이틀먼트**: `nodi-entitlements` (pk `USER#`, sk `PRODUCT#`) . 회원용 자료·VOD 접근 판정. 1차 쿠키 게이트는 유지하되 로그인 사용자는 쿠키 없이도 열림.
- [ ] **결제**: 토스페이먼츠 결제위젯 → `POST /orders/confirm`(paymentKey 멱등) → `nodi-orders` 원장 → 엔타이틀먼트 기록. 웹훅으로 취소·환불 동기화. 통신판매업 신고·현금영수증 선행.
- [ ] **VOD**: S3 원본 → MediaConvert HLS 3단 → CloudFront 서명 쿠키(엔타이틀먼트 확인 후 6시간) → hls.js. 플레이어 위 회원 이메일 반투명 워터마크.
- [ ] **회원 자료**: S3 프라이빗 + CloudFront 서명 쿠키. 1차 presigned URL 방식을 이걸로 흡수.
- [ ] **견적 상담**: 채팅 만들지 않음. 문의 폼 + 이메일 스레드 + 상담 예약 임베드(Cal.com/whattime).
- [ ] **블로그**: `content/posts/*.mdx`, `draft` 프론트매터가 공개 설정, `next-sitemap`, OG 이미지 자동 생성, JSON-LD. CMS 없음.
- [ ] **캠페인 발송**: `scripts/send.ts` — `active` 대상 SES v2 일괄 발송, 템플릿은 MDX, 발송 로그 `nodi-events`. UI 없음.
- [ ] **운영**: 메일 발송 실패 재시도(SQS DLQ), `ip/ua` 90일 후 삭제 배치, Amplify 호스팅 CDK 이관, CDK 출력 → web env 자동화.
- [ ] **환불 정책·이용약관** 유료 조항 채우기.

## 14. TODO — Step 3 (조건부)

착수 게이트: **VOD 월 매출 500만 이상 + 실제 유출 사례 1건**. 둘 다 아니면 하지 않는다.
- [ ] DRM: MediaPackage + SPEKE + 벤더(PallyCon/EZDRM) Widevine·FairPlay·PlayReady. 비용 월 수십 달러부터. 화면 녹화는 못 막으므로 2차 워터마크가 실질 억제책이라는 전제 유지.

---

## 15. Cursor 첫 실행 프롬프트

```
PLAN.md를 전부 읽어라. 그 다음 §11의 S1-1부터 순서대로 진행한다.
각 체크리스트 항목이 끝날 때마다 (1) 무엇을 만들었는지 3줄, (2) DoD 검증 결과, (3) PLAN.md와 어긋난 점이 있으면 그것만 보고하고 멈춰라.
S1-1을 지금 시작해라. 범위를 넓히지 마라. 카피·색·폰트·구조는 PLAN.md가 정답이고 개선하지 않는다.
design/ 폴더의 dc.html과 _ds는 참고만 하고 그대로 실행하거나 번들을 import하지 않는다.
```
