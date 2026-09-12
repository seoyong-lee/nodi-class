import {
  type FooterContext,
  type MailContent,
  mintButton,
  wrapHtml,
  footerText,
} from './layout.js';

export function confirmMail(opts: {
  confirmUrl: string;
  footer: FooterContext;
}): MailContent {
  const subject = '[노디 AI 클래스] 자료를 열려면 이 링크를 눌러주세요';
  const text = [
    '아래 링크를 누르면 자료가 열립니다.',
    '',
    opts.confirmUrl,
    '',
    '이 링크는 7일 후 만료됩니다.',
    '',
    footerText(opts.footer),
  ].join('\n');

  const html = wrapHtml(
    [
      '<p>아래 버튼을 누르면 자료가 열립니다.</p>',
      mintButton(opts.confirmUrl, '자료 열기'),
      '<p style="font-size:14px;color:#666;">이 링크는 7일 후 만료됩니다.</p>',
    ].join(''),
    opts.footer,
  );

  return { subject, text, html };
}
