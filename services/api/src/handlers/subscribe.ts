import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import {
  SubscribeInput,
  createConfirmToken,
  createGateToken,
  COURSE_WAITLIST_SLUG,
} from '@nodi/shared';
import { upsertSubscriber } from '../db/subscribers.js';
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
import { sendMail } from '../mail/send.js';
import { confirmMail } from '../mail/templates/confirm.js';
import { resourceMail } from '../mail/templates/resource.js';
import {
  resourcePath,
  type FooterContext,
} from '../mail/templates/layout.js';

function footerFrom(
  env: ReturnType<typeof getEnv>,
  unsubToken: string,
): FooterContext {
  return {
    siteUrl: env.siteUrl,
    unsubToken,
    bizName: env.bizName,
    bizOwner: env.bizOwner,
    bizAddress: env.bizAddress,
  };
}

function confirmApiBase(siteUrl: string): string {
  return (process.env.API_URL ?? siteUrl).replace(/\/$/, '');
}

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
      log('info', 'subscribe.honeypot', { ip });
      return forbidden({ error: 'bot' });
    }

    const parsed = SubscribeInput.safeParse(body);
    if (!parsed.success) {
      return badRequest({ error: 'invalid' });
    }

    const env = getEnv();
    const okTs = await checkTurnstile(
      parsed.data.turnstile,
      ip,
      env.turnstileSecret,
    );
    if (!okTs) {
      log('info', 'subscribe.turnstile_fail', { ip });
      return forbidden({ error: 'bot' });
    }

    const { email, slug, source, building } = parsed.data;
    const result = await upsertSubscriber({
      email,
      slug,
      source,
      building,
      ip,
      ua: userAgent(event),
    });

    await putEvent({
      email,
      event: 'subscribe.requested',
      meta: { slug, state: result.state },
    });

    const footer = footerFrom(env, result.subscriber.unsubToken);

    if (result.state === 'active') {
      const gateToken = createGateToken(email, env.gateSecret);
      const path = resourcePath(slug);
      const resourceUrl = `${env.siteUrl}/unlock?t=${encodeURIComponent(gateToken)}&next=${encodeURIComponent(path)}`;
      await sendMail({
        to: email,
        content: resourceMail({ slug, resourceUrl, footer }),
        unsubToken: result.subscriber.unsubToken,
        template: 'resource',
      });
    } else {
      const confirmToken = createConfirmToken(email, slug, env.gateSecret);
      const link = `${confirmApiBase(env.siteUrl)}/confirm?t=${encodeURIComponent(confirmToken)}`;
      await sendMail({
        to: email,
        content: confirmMail({ confirmUrl: link, footer }),
        unsubToken: result.subscriber.unsubToken,
        template: 'confirm',
      });
    }

    log('info', 'subscribe.ok', {
      ...emailHashField(email),
      state: result.state,
      slug,
      waitlist: slug === COURSE_WAITLIST_SLUG,
    });

    return accepted({ ok: true, state: result.state });
  } catch (err) {
    log('error', 'subscribe.error', {
      err: err instanceof Error ? err.message : 'unknown',
    });
    return internalError();
  }
}
