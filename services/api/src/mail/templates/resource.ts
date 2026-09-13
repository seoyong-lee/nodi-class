import type { ResourceAccess } from '@nodi/shared';
import {
  buttonParagraph,
  listParagraph,
  renderMail,
  type FooterContext,
  type MailContent,
} from './layout.js';

export type ResourceMailInput = {
  resourceTitle: string;
  slug: string;
  access: ResourceAccess;
  courseTitle?: string;
  promptCount?: number;
  mailNote?: string;
  confirmUrl: string;
  footer: FooterContext;
};

const FUTURE_RESOURCE_ITEMS = [
  '회사 양식에 맞춰 AI로 PPT 만드는 방법',
  '반복 업무에 쓰는 클로드 설정과 실전 프롬프트',
  'AI로 만든 디자인을 직접 판단하고 고치는 기준',
] as const;

export function resourceMail(input: ResourceMailInput): MailContent {
  const subject = input.promptCount
    ? `${input.resourceTitle} — 링크와 프롬프트 ${input.promptCount}종`
    : `${input.resourceTitle} — 링크`;

  const paragraphs: string[] = [
    '노디 AI 클래스',
    '전자책 신청이 완료되었습니다',
    '아래 버튼을 누르면 바로 확인할 수 있습니다.',
    buttonParagraph(input.confirmUrl, `${input.resourceTitle} 열기`),
  ];

  if (input.promptCount) {
    paragraphs.push('프롬프트는 부록에서 그대로 복사해 쓰시면 됩니다.');
  }
  if (input.mailNote) {
    paragraphs.push(input.mailNote);
  }
  if (input.access === 'free-until-course' && input.courseTitle) {
    paragraphs.push(
      `이 자료는 강의 「${input.courseTitle}」 교재로 들어갈 예정입니다. 강의가 나오면 무료 공개는 끝나지만, 이 주소로 등록하신 분은 그 뒤에도 계속 보실 수 있습니다.`,
    );
  }

  paragraphs.push(
    '한 번 등록하면 다른 전자책도 별도 입력 없이 확인할 수 있습니다.',
    listParagraph(
      '앞으로 이메일로 이런 실전 자료를 계속 공유드려요',
      [...FUTURE_RESOURCE_ITEMS],
    ),
    '새로운 전자책과 클래스가 준비되면\n이메일로 먼저 알려드리겠습니다.',
    '노디 AI 클래스',
    'AI로 직접 만드는 방법을 쉽게 정리합니다.',
  );

  return renderMail({
    subject,
    paragraphs,
    footer: input.footer,
  });
}
