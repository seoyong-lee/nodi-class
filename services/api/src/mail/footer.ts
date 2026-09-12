export type BizInfo = {
  name?: string;
  owner?: string;
  regNo?: string;
  address?: string;
};

export type FooterContext = {
  siteUrl: string;
  unsubscribeUrl?: string;
  biz?: BizInfo;
};

export const CONTACT_EMAIL = 'contact@cascades.studio';

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

export function parseBizInfo(raw: string | undefined): BizInfo {
  if (!raw?.trim()) return {};
  try {
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    const pick = (key: string): string | undefined => {
      const value = parsed[key];
      if (typeof value !== 'string') return undefined;
      const trimmed = value.trim();
      return trimmed || undefined;
    };
    return {
      name: pick('name'),
      owner: pick('owner'),
      regNo: pick('regNo'),
      address: pick('address'),
    };
  } catch {
    return {};
  }
}

function bizLines(biz?: BizInfo): string[] {
  const lines: string[] = [];
  if (biz?.name) {
    lines.push(`노디 AI 클래스 · 운영 ${biz.name}`);
  }
  const detail = [
    biz?.owner ? `대표 ${biz.owner}` : undefined,
    biz?.regNo ? `사업자등록번호 ${biz.regNo}` : undefined,
    biz?.address || undefined,
  ].filter((part): part is string => Boolean(part));
  if (detail.length > 0) {
    lines.push(detail.join(' · '));
  }
  return lines;
}

export function footerText(ctx: FooterContext): string {
  const lines = [
    ...bizLines(ctx.biz),
    `문의 ${CONTACT_EMAIL}`,
  ];
  if (ctx.unsubscribeUrl) {
    lines.push(`수신거부: ${ctx.unsubscribeUrl}`);
  }
  return lines.join('\n');
}

export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function footerHtml(ctx: FooterContext): string {
  const lines = [
    ...bizLines(ctx.biz).map((line) => escapeHtml(line)),
    `문의 ${escapeHtml(CONTACT_EMAIL)}`,
  ];
  if (ctx.unsubscribeUrl) {
    lines.push(
      `수신거부: <a href="${escapeHtml(ctx.unsubscribeUrl)}" style="color:#6B7280;text-decoration:underline;">${escapeHtml(ctx.unsubscribeUrl)}</a>`,
    );
  }

  return `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:32px;border-top:1px solid #E5E7EB;">
  <tr><td style="padding-top:16px;font-size:13px;line-height:1.6;color:#6B7280;">
    ${lines.map((line) => `${line}<br>`).join('')}
  </td></tr>
</table>`.trim();
}
