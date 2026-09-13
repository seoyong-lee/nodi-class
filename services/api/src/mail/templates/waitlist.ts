import {
  buttonParagraph,
  renderMail,
  type FooterContext,
  type MailContent,
} from './layout.js';

export function waitlistMail(opts: {
  courseTitle: string;
  siteUrl: string;
  footer: FooterContext;
}): MailContent {
  return renderMail({
    subject: `「${opts.courseTitle}」 출시 알림을 등록했습니다`,
    paragraphs: [
      '안녕하세요, 노디입니다.',
      `「${opts.courseTitle}」이 나오면 이 주소로 먼저 알려드리고, 얼리버드 가격도 알림 신청자에게 먼저 안내합니다.`,
      '그동안 전자책은 사이트에서 계속 보실 수 있습니다.',
      buttonParagraph(`${opts.siteUrl}/#free`, '전자책 보기'),
      '노디 드림',
    ],
    footer: opts.footer,
  });
}
