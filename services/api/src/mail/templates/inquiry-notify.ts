import type { MailContent } from './layout.js';
import { escapeHtml } from './layout.js';

export function inquiryNotifyMail(opts: {
  name: string;
  email: string;
  resultUrl: string;
  blocked: string;
  inquiryPk: string;
}): MailContent {
  let domain = opts.resultUrl;
  try {
    domain = new URL(opts.resultUrl).hostname;
  } catch {
    /* keep raw */
  }

  const subject = `[검토 요청] ${opts.name} · ${domain}`;
  const text = [
    `이름: ${opts.name}`,
    `이메일: ${opts.email}`,
    `결과물: ${opts.resultUrl}`,
    `막힌 지점:`,
    opts.blocked,
    '',
    `DynamoDB: ${opts.inquiryPk}`,
  ].join('\n');

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"></head>
<body style="font-family:sans-serif;font-size:16px;line-height:1.6;color:#111;">
<table role="presentation" width="560" cellpadding="0" cellspacing="0">
<tr><td>
<p><strong>이름</strong> ${escapeHtml(opts.name)}</p>
<p><strong>이메일</strong> ${escapeHtml(opts.email)}</p>
<p><strong>결과물</strong> <a href="${escapeHtml(opts.resultUrl)}">${escapeHtml(opts.resultUrl)}</a></p>
<p><strong>막힌 지점</strong></p>
<p>${escapeHtml(opts.blocked).replace(/\n/g, '<br>')}</p>
<p style="font-size:12px;color:#666;">DynamoDB: ${escapeHtml(opts.inquiryPk)}</p>
</td></tr></table>
</body></html>`;

  return { subject, text, html };
}
