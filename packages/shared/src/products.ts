export const products = {
  vod: {
    label: 'VOD · 준비 중',
    title: '클로드 디자인 실전',
    summary: '내 사업에 필요한 디자인을 직접 만들고 개선하는 실전 과정',
    rows: [
      ['추천 대상', '내 사업 페이지를 직접 만들어야 하는 분'],
      ['완성 결과', '재사용할 수 있는 디자인 기준과 랜딩페이지'],
      ['가격', '얼리버드 가격 예정'],
    ],
    cta: { label: '출시 알림 신청하기', href: '/course', variant: 'primary' },
  },
  workshop: {
    label: '워크숍 · 준비 중',
    title: '라이브 첨삭',
    summary: '직접 만든 결과물을 가져와 함께 보며 개선합니다',
    rows: [
      ['추천 대상', 'VOD 수강 후 실제 프로젝트에 적용해보고 있는 분'],
      ['완성 결과', '개선된 결과물 + 이후에도 활용할 수 있는 점검 기준'],
      ['가격', '추후 안내'],
    ],
    cta: { label: '출시 알림 신청하기', href: '/course', variant: 'secondary' },
  },
  service: {
    label: '서비스',
    title: 'AI 결과물 마무리',
    summary: 'AI로 만든 초안을, 고객이 선택하는 결과물로 완성합니다',
    rows: [
      ['추천 대상', '직접 만들어봤지만 완성도를 높이는 데 어려움을 겪고 있는 분'],
      ['완성 결과', '고객에게 보여줄 수 있는 수준의 최종 결과물'],
      ['가격', '300만 원부터'],
    ],
    cta: { label: '프로젝트 검토 요청하기', href: '/service', variant: 'secondary' },
  },
} as const;

export type ProductCardRow = { label: string; value: string };

export function toProductCardRows(
  rows: readonly (readonly [string, string])[],
): ProductCardRow[] {
  return rows.map(([label, value]) => ({ label, value }));
}
