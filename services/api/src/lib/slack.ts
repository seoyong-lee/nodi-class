import { log } from './log.js';

export type InquirySlackPayload = {
  name: string;
  email: string;
  resultUrl: string;
  blocked: string;
  inquiryPk: string;
};

function resultDomain(resultUrl: string): string {
  try {
    return new URL(resultUrl).hostname;
  } catch {
    return resultUrl;
  }
}

/** Incoming Webhook payload for a /service 검토 요청. No-op if webhookUrl empty. */
export async function notifyInquirySlack(
  webhookUrl: string | undefined,
  opts: InquirySlackPayload,
): Promise<void> {
  const url = webhookUrl?.trim();
  if (!url) {
    log('warn', 'inquiry.slack_unconfigured');
    return;
  }

  const domain = resultDomain(opts.resultUrl);
  const text = `[검토 요청] ${opts.name} · ${domain}`;
  const body = {
    text,
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: '검토 요청',
          emoji: false,
        },
      },
      {
        type: 'section',
        fields: [
          { type: 'mrkdwn', text: `*이름*\n${opts.name}` },
          { type: 'mrkdwn', text: `*이메일*\n${opts.email}` },
        ],
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*결과물*\n<${opts.resultUrl}|${domain}>`,
        },
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*막힌 지점*\n${opts.blocked}`,
        },
      },
      {
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text: `DynamoDB \`${opts.inquiryPk}\``,
          },
        ],
      },
    ],
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    log('warn', 'inquiry.slack_http', {
      status: res.status,
      detail: detail.slice(0, 200),
    });
    throw new Error(`slack webhook ${res.status}`);
  }
}
