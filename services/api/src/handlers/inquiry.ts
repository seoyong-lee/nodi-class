import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { InquiryInput } from '@nodi/shared';
import { saveInquiry } from '../db/inquiries.js';
import { putEvent } from '../db/events.js';
import { getEnv } from '../lib/env.js';
import { emailHashField, log } from '../lib/log.js';
import { checkRateLimit } from '../lib/rate-limit.js';
import {
  clientIp,
  isHoneypot,
  parseJsonBody,
  userAgent,
} from '../lib/request.js';
import {
  accepted,
  badRequest,
  forbidden,
  internalError,
  tooManyRequests,
} from '../lib/response.js';
import { checkTurnstile } from '../lib/turnstile.js';
import { notifyInquirySlack } from '../lib/slack.js';
import { sendMail } from '../mail/send.js';
import { inquiryNotifyMail } from '../mail/templates/inquiry-notify.js';
import { inquiryAckMail } from '../mail/templates/inquiry-ack.js';
import type { FooterContext } from '../mail/templates/layout.js';

export async function handler(
  event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyResultV2> {
  try {
    const ip = clientIp(event);
    if (!(await checkRateLimit(ip))) {
      return tooManyRequests();
    }

    const body = parseJsonBody(event);
    if (body === null) return badRequest();

    if (isHoneypot(body)) {
      log('info', 'inquiry.honeypot', { ip });
      return forbidden({ error: 'bot' });
    }

    const parsed = InquiryInput.safeParse(body);
    if (!parsed.success) {
      return badRequest({ error: 'invalid' });
    }

    const env = await getEnv();
    const okTs = await checkTurnstile(
      parsed.data.turnstile,
      ip,
      env.turnstileSecret,
    );
    if (!okTs) {
      log('info', 'inquiry.turnstile_fail', { ip });
      return forbidden({ error: 'bot' });
    }

    const { name, email, resultUrl, blocked } = parsed.data;
    const inquiry = await saveInquiry({
      name,
      email,
      resultUrl,
      blocked,
      ip,
      ua: userAgent(event),
    });

    await putEvent({
      email,
      event: 'inquiry.created',
      meta: { pk: inquiry.pk },
    });

    await sendMail({
      to: env.notifyEmail,
      content: inquiryNotifyMail({
        name,
        email,
        resultUrl,
        blocked,
        inquiryPk: inquiry.pk,
      }),
      template: 'inquiry-notify',
      skipListUnsub: true,
    });

    try {
      await notifyInquirySlack(env.slackInquiryWebhookUrl, {
        name,
        email,
        resultUrl,
        blocked,
        inquiryPk: inquiry.pk,
      });
    } catch (err) {
      log('warn', 'inquiry.slack_fail', {
        err: err instanceof Error ? err.message : 'unknown',
        pk: inquiry.pk,
      });
    }

    const footer: FooterContext = {
      siteUrl: env.siteUrl,
      biz: env.bizInfo,
    };

    await sendMail({
      to: email.trim().toLowerCase(),
      content: inquiryAckMail({ footer }),
      template: 'inquiry-ack',
      skipListUnsub: true,
    });

    log('info', 'inquiry.ok', { ...emailHashField(email), pk: inquiry.pk });
    return accepted({ ok: true });
  } catch (err) {
    log('error', 'inquiry.error', {
      err: err instanceof Error ? err.message : 'unknown',
    });
    return internalError();
  }
}
