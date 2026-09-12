import {
  type FooterContext,
  type MailContent,
  mintButton,
  wrapHtml,
  footerText,
  resourceTitle,
} from './layout.js';

export function resourceMail(opts: {
  slug: string;
  resourceUrl: string;
  downloadUrl?: string;
  footer: FooterContext;
}): MailContent {
  const title = resourceTitle(opts.slug);
  const subject = `[노디 AI 클래스] ${title}`;
  const lines = [
    `${title} 자료 링크입니다.`,
    '',
    opts.resourceUrl,
  ];
  if (opts.downloadUrl) {
    lines.push('', `다운로드: ${opts.downloadUrl}`);
  }
  lines.push('', footerText(opts.footer));

  const htmlParts = [
    `<p>${title} 자료 링크입니다.</p>`,
    mintButton(opts.resourceUrl, '자료 보기'),
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
