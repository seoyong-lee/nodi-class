import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import {
  SubscribeInput,
  createConfirmToken,
  createGateToken,
  COURSE_WAITLIST_SLUG,
  hashEmail,
} from '@nodi/shared';
import {
  getSubscriber,
  upsertSubscriber,
} from '../db/subscribers.js';
import { putEvent } from '../db/events.js';
import { getEnv, type ApiEnv } from '../lib/env.js';
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
import { resourceMail } from '../mail/templates/resource.js';
import { type FooterContext } from '../mail/templates/layout.js';

function footerFrom(env: ApiEnv, unsubToken: string): FooterContext {
  return {
    siteUrl: env.siteUrl,
    unsubToken,
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

    const env = await getEnv();
    const okTs = await checkTurnstile(
      parsed.data.turnstile,
      ip,
      env.turnstileSecret,
    );
    if (!okTs) {
      log('info', 'subscribe.turnstile_fail', { ip });
      return forbidden({ error: 'bot' });
    }

    const { email, slug, source, building, intent } = parsed.data;

    if (intent === 'reopen') {
      const existing = await getSubscriber(email);
      if (
        !existing ||
        existing.status === 'unsubscribed' ||
        (existing.status !== 'active' && existing.status !== 'pending')
      ) {
        log('info', 'subscribe.reopen_miss', { ...emailHashField(email), slug });
        return badRequest({ error: 'not_registered' });
      }

      const gateToken = createGateToken(email, env.gateSecret);
      const confirmToken = createConfirmToken(email, slug, env.gateSecret);
      const confirmUrl = `${confirmApiBase(env.siteUrl)}/confirm?t=${encodeURIComponent(confirmToken)}`;
      const footer = footerFrom(env, existing.unsubToken);

      await sendMail({
        to: email,
        content: resourceMail({ slug, confirmUrl, footer }),
        unsubToken: existing.unsubToken,
        template: 'resource',
      });

      await putEvent({
        email,
        event: 'gate.opened',
        meta: { slug, intent: 'reopen' },
      });

      return accepted({
        ok: true,
        state: existing.status === 'active' ? 'active' : 'pending',
        gateToken,
        subscriberHash: hashEmail(email),
      });
    }

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

    const gateToken = createGateToken(email, env.gateSecret);
    const confirmToken = createConfirmToken(email, slug, env.gateSecret);
    const confirmUrl = `${confirmApiBase(env.siteUrl)}/confirm?t=${encodeURIComponent(confirmToken)}`;
    const footer = footerFrom(env, result.subscriber.unsubToken);

    await sendMail({
      to: email,
      content: resourceMail({ slug, confirmUrl, footer }),
      unsubToken: result.subscriber.unsubToken,
      template: 'resource',
    });

    await putEvent({
      email,
      event: 'gate.opened',
      meta: { slug },
    });

    log('info', 'subscribe.ok', {
      ...emailHashField(email),
      state: result.state,
      slug,
      waitlist: slug === COURSE_WAITLIST_SLUG,
    });

    return accepted({
      ok: true,
      state: result.state,
      gateToken,
      subscriberHash: hashEmail(email),
    });
  } catch (err) {
    log('error', 'subscribe.error', {
      err: err instanceof Error ? err.message : 'unknown',
    });
    return internalError();
  }
}
