export const products = {
  vod: {
    label: 'VOD · 준비 중',
    title: '클로드 디자인 실전',
    summary: '디자이너 없이 내 사업의 페이지를 반복해서 만드는 과정',
    rows: [
      ['누구에게', '내 사업 페이지를 직접 만들어야 하는 분'],
      ['남는 것', '매주 파일 하나'],
      ['가격', '얼리버드 가격 예정'],
    ],
    cta: { label: '출시 알림 받기', href: '/course', variant: 'primary' },
  },
  workshop: {
    label: '워크숍 · 준비 중',
    title: '라이브 첨삭',
    summary: '직접 만든 결과물을 가져오면 화면을 보며 함께 고칩니다',
    rows: [
      ['누구에게', 'VOD 수료 후 실제 프로젝트가 있는 분'],
      ['남는 것', '고친 결과물 + 기준표'],
      ['가격', '추후 안내'],
    ],
    cta: { label: '알림 받기', href: '/course', variant: 'secondary' },
  },
  service: {
    label: '서비스',
    title: 'AI 결과물 마무리',
    summary: 'AI로 만든 초안을, 내놓을 수 있는 결과물로 마무리합니다',
    rows: [
      ['누구에게', '직접 해보다 한계를 느낀 분'],
      ['남는 것', '내놓을 수 있는 완성본'],
      ['가격', '300만원부터'],
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
