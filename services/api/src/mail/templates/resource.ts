import {
  type FooterContext,
  type MailContent,
  mintButton,
  wrapHtml,
  footerText,
  resourceTitle,
} from './layout.js';

/** 자료 전달 메일 — 제목에 (광고) 없음 (PLAN §7.1). */
export function resourceMail(opts: {
  slug: string;
  /** `/confirm?t=` — activates subscriber then redirects to the resource. */
  confirmUrl: string;
  downloadUrl?: string;
  footer: FooterContext;
}): MailContent {
  const title = resourceTitle(opts.slug);
  const subject = `[노디 AI 클래스] ${title}`;
  const lines = [
    `${title}을(를) 요청해 주셔서 감사합니다.`,
    '사이트에서는 이미 열려 있습니다. 아래 링크를 누르면 메일 수신이 확인됩니다.',
    '',
    opts.confirmUrl,
  ];
  if (opts.downloadUrl) {
    lines.push('', `다운로드: ${opts.downloadUrl}`);
  }
  lines.push('', footerText(opts.footer));

  const htmlParts = [
    `<p>${title}을(를) 요청해 주셔서 감사합니다.</p>`,
    '<p>사이트에서는 이미 열려 있습니다. 아래 버튼을 누르면 메일 수신이 확인됩니다.</p>',
    mintButton(opts.confirmUrl, '메일 확인하기'),
  ];
  if (opts.downloadUrl) {
    htmlParts.push(
      `<p style="font-size:14px;"><a href="${opts.downloadUrl}">파일 다운로드</a></p>`,
    );
  }

  return {
    subject,
    text: lines.join('\n'),
    html: wrapHtml(htmlParts.join(''), opts.footer),
  };
}
