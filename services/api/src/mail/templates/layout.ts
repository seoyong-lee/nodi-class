import { COURSE_WAITLIST_SLUG, RESOURCE_SLUGS } from '@nodi/shared';

const TITLES: Record<string, string> = {
  'claude-ppt-guidebook': '클로드 PPT 실전 가이드북',
  'claude-prompt-set': '클로드 프롬프트 세트',
  'claude-design-landing-checklist': '클로드 디자인 랜딩 체크리스트',
  'ai-design-5-principles': 'AI 디자인 5원칙',
  [COURSE_WAITLIST_SLUG]: '클로드 디자인 실전 출시 알림',
};

export function resourceTitle(slug: string): string {
  return TITLES[slug] ?? slug;
}

export function resourcePath(slug: string): string {
  if (slug === COURSE_WAITLIST_SLUG) return '/course';
  if ((RESOURCE_SLUGS as readonly string[]).includes(slug)) {
    return `/free/${slug}`;
  }
  return `/free/${slug}`;
}

export type MailContent = {
  subject: string;
  text: string;
  html: string;
};

export type FooterContext = {
  siteUrl: string;
  unsubToken: string;
};

const OPERATOR = 'Cascades';
const CONTACT_EMAIL = 'contact@cascades.studio';

export function unsubUrl(siteUrl: string, unsubToken: string): string {
  return `${siteUrl}/unsubscribe?t=${encodeURIComponent(unsubToken)}`;
}

export function listUnsubHeaders(
  siteUrl: string,
  unsubToken: string,
): Record<string, string> {
  const url = unsubUrl(siteUrl, unsubToken);
  return {
    'List-Unsubscribe': `<${url}>`,
    'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
  };
}

export function footerText(ctx: FooterContext): string {
  return [
    `노디 AI 클래스 · 운영 ${OPERATOR}`,
    `상호 ${OPERATOR}`,
    `문의 ${CONTACT_EMAIL}`,
    `수신거부: ${unsubUrl(ctx.siteUrl, ctx.unsubToken)}`,
  ].join('\n');
}

export function footerHtml(ctx: FooterContext): string {
  const rows = [
    `노디 AI 클래스 · 운영 ${OPERATOR}`,
    `상호 ${OPERATOR}`,
    `문의 ${CONTACT_EMAIL}`,
  ];
  const url = unsubUrl(ctx.siteUrl, ctx.unsubToken);
  return `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:32px;border-top:1px solid #e5e5e5;">
  <tr><td style="padding-top:16px;font-size:12px;line-height:1.5;color:#666;">
    ${rows.map((r) => `${escapeHtml(r)}<br>`).join('')}
    <a href="${escapeHtml(url)}" style="color:#666;">수신거부</a>
  </td></tr>
</table>`.trim();
}

export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function mintButton(href: string, label: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px 0;">
  <tr><td style="background:#39CD9B;border-radius:4px;">
    <a href="${escapeHtml(href)}" style="display:inline-block;padding:12px 24px;font-size:16px;font-weight:bold;color:#0a0a0a;text-decoration:none;">${escapeHtml(label)}</a>
  </td></tr>
</table>`;
}

export function wrapHtml(bodyInner: string, ctx: FooterContext): string {
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#ffffff;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;">
  <tr><td align="center" style="padding:24px;">
    <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="width:560px;max-width:100%;font-family:sans-serif;color:#111;font-size:16px;line-height:1.6;">
      <tr><td>${bodyInner}${footerHtml(ctx)}</td></tr>
    </table>
  </td></tr>
</table>
</body></html>`;
}
