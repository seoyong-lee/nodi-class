import {
  type FooterContext,
  type MailContent,
  wrapHtml,
  footerText,
} from './layout.js';

export function inquiryAckMail(opts: { footer: FooterContext }): MailContent {
  const subject = '[노디 AI 클래스] 검토 요청을 받았습니다';
  const text = [
    '검토 요청을 받았습니다.',
    '2영업일 내 회신드립니다.',
    '',
    footerText(opts.footer),
  ].join('\n');

  const html = wrapHtml(
    '<p>검토 요청을 받았습니다.</p><p>2영업일 내 회신드립니다.</p>',
    opts.footer,
  );

  return { subject, text, html };
}
