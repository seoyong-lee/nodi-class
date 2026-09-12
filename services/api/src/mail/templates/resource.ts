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
  const isPptGuide = opts.slug === 'claude-ppt-guidebook';

  const subject = isPptGuide
    ? '클로드 PPT 실전 가이드북 — 링크와 프롬프트 7종'
    : `[노디 AI 클래스] ${title}`;

  const thanks = isPptGuide
    ? '등록해 주셔서 감사합니다. 이 자료는 강의 출시 후 유료로 바뀌지만, 이 주소로 등록하신 분은 계속 열립니다.'
    : `${title}을(를) 요청해 주셔서 감사합니다.`;

  const lines = [
    thanks,
    '사이트에서는 이미 열려 있습니다. 아래 링크를 누르면 메일 수신이 확인됩니다.',
    '',
    opts.confirmUrl,
  ];
  if (opts.downloadUrl) {
    lines.push('', `다운로드: ${opts.downloadUrl}`);
  }
  lines.push('', footerText(opts.footer));

  const htmlParts = [
    `<p>${thanks}</p>`,
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
