import { COURSE_WAITLIST_SLUG, RESOURCE_SLUGS } from '@nodi/shared';
import {
  CONTACT_EMAIL,
  escapeHtml,
  footerHtml,
  footerText,
  type FooterContext,
} from '../footer.js';

export type { FooterContext, BizInfo } from '../footer.js';
export {
  CONTACT_EMAIL,
  escapeHtml,
  footerHtml,
  footerText,
  listUnsubHeaders,
  parseBizInfo,
  unsubUrl,
} from '../footer.js';

export type MailContent = {
  subject: string;
  text: string;
  html: string;
};

export function resourcePath(slug: string): string {
  if (slug === COURSE_WAITLIST_SLUG) return '/course';
  if ((RESOURCE_SLUGS as readonly string[]).includes(slug)) {
    return `/free/${slug}`;
  }
  return `/free/${slug}`;
}

export function mintButton(href: string, label: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px 0;">
  <tr><td style="background:#39CD9B;border-radius:8px;">
    <a href="${escapeHtml(href)}" style="display:inline-block;padding:14px 24px;font-family:sans-serif;font-size:16px;font-weight:bold;line-height:1.2;color:#0B1512;text-decoration:none;">${escapeHtml(label)}</a>
  </td></tr>
</table>`;
}

/** Join body paragraphs without consecutive blank lines. */
export function joinParagraphs(parts: Array<string | null | undefined>): string {
  return parts
    .map((part) => part?.replace(/\s+$/g, '') ?? '')
    .filter((part) => part.length > 0)
    .join('\n\n');
}

export function wrapHtml(bodyInner: string, ctx: FooterContext): string {
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#FFFFFF;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#FFFFFF;">
  <tr><td align="center" style="padding:24px;">
    <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="width:560px;max-width:100%;font-family:sans-serif;color:#1A1A1A;font-size:16px;line-height:1.7;">
      <tr><td style="padding:0;">${bodyInner}${footerHtml(ctx)}</td></tr>
    </table>
  </td></tr>
</table>
</body></html>`;
}

export function paragraphsToHtml(paragraphs: string[]): string {
  return paragraphs
    .map((p) => {
      if (p.startsWith('__BUTTON__')) {
        const [, href = '', label = ''] = p.split('\u0000');
        return mintButton(href, label);
      }
      if (p.startsWith('__LIST__')) {
        const [, intro = '', itemsStr = ''] = p.split('\u0000');
        const items = itemsStr.split('\u0001').filter(Boolean);
        const lis = items
          .map(
            (item) =>
              `<li style="margin:0 0 8px 0;">${escapeHtml(item)}</li>`,
          )
          .join('');
        return `<p style="margin:0 0 8px 0;">${escapeHtml(intro)}</p><ul style="margin:0 0 16px 0;padding-left:20px;">${lis}</ul>`;
      }
      return `<p style="margin:0 0 16px 0;">${escapeHtml(p).replace(/\n/g, '<br>')}</p>`;
    })
    .join('');
}

/** Encode a CTA as a special paragraph token for shared text/html builders. */
export function buttonParagraph(href: string, label: string): string {
  return `__BUTTON__\u0000${href}\u0000${label}`;
}

/** Encode a bullet list with an intro line for shared text/html builders. */
export function listParagraph(intro: string, items: string[]): string {
  return `__LIST__\u0000${intro}\u0000${items.join('\u0001')}`;
}

export function renderMail(opts: {
  subject: string;
  paragraphs: string[];
  footer: FooterContext;
}): MailContent {
  const textParts = opts.paragraphs.map((p) => {
    if (p.startsWith('__BUTTON__')) {
      const [, href = ''] = p.split('\u0000');
      return href;
    }
    if (p.startsWith('__LIST__')) {
      const [, intro = '', itemsStr = ''] = p.split('\u0000');
      const items = itemsStr.split('\u0001').filter(Boolean);
      return [intro, ...items.map((item) => `- ${item}`)].join('\n');
    }
    return p;
  });
  const text = joinParagraphs([...textParts, footerText(opts.footer)]);
  const html = wrapHtml(paragraphsToHtml(opts.paragraphs), opts.footer);
  return { subject: opts.subject, text, html };
}

export { CONTACT_EMAIL as MAIL_CONTACT_EMAIL };
