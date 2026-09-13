import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import {
  SubscribeInput,
  createConfirmToken,
  createGateToken,
  COURSE_WAITLIST_SLUG,
  hashEmail,
  products,
} from '@nodi/shared';
import {
  claimMailSlot,
  getSubscriber,
  upsertSubscriber,
} from '../db/subscribers.js';
import { getResourceBySlug } from '../db/resources.js';
import { putEvent } from '../db/events.js';
import { getEnv, type ApiEnv } from '../lib/env.js';
import { emailHashField, log } from '../lib/log.js';
import { checkRateLimit, REOPEN_RATE_LIMIT } from '../lib/rate-limit.js';
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
import { waitlistMail } from '../mail/templates/waitlist.js';
import {
  type FooterContext,
  unsubUrl,
} from '../mail/templates/layout.js';

function footerFrom(env: ApiEnv, unsubToken: string): FooterContext {
  return {
    siteUrl: env.siteUrl,
    unsubscribeUrl: unsubUrl(env.siteUrl, unsubToken),
    biz: env.bizInfo,
  };
}

function confirmApiBase(siteUrl: string): string {
  return (process.env.API_URL ?? siteUrl).replace(/\/$/, '');
}

async function sendSubscribeMail(opts: {
  email: string;
  slug: string;
  unsubToken: string;
  env: ApiEnv;
}): Promise<boolean> {
  const shouldSend = await claimMailSlot(opts.email);
  if (!shouldSend) {
    log('info', 'mail.skipped_throttle', {
      ...emailHashField(opts.email),
      slug: opts.slug,
    });
    return false;
  }

  const footer = footerFrom(opts.env, opts.unsubToken);
  const confirmUrl = `${confirmApiBase(opts.env.siteUrl)}/confirm?t=${encodeURIComponent(
    createConfirmToken(opts.email, opts.slug, opts.env.gateSecret),
  )}`;

  if (opts.slug === COURSE_WAITLIST_SLUG) {
    await sendMail({
      to: opts.email,
      content: waitlistMail({
        courseTitle: products.vod.title,
        siteUrl: opts.env.siteUrl,
        footer,
      }),
      unsubToken: opts.unsubToken,
      template: 'waitlist',
    });
    return true;
  }

  const resource = await getResourceBySlug(opts.slug);
  const resourceTitle = resource?.title ?? opts.slug;
  await sendMail({
    to: opts.email,
    content: resourceMail({
      resourceTitle,
      slug: opts.slug,
      access: resource?.access ?? 'free',
      courseTitle: resource?.courseTitle,
      promptCount: resource?.promptCount,
      mailNote: resource?.mailNote,
      confirmUrl,
      footer,
    }),
    unsubToken: opts.unsubToken,
    template: 'resource',
  });
  return true;
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

    if (parsed.data.intent === 'reopen') {
      if (!(await checkRateLimit(ip, REOPEN_RATE_LIMIT))) {
        return tooManyRequests();
      }
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
      const resent = await sendSubscribeMail({
        email,
        slug,
        unsubToken: existing.unsubToken,
        env,
      });

      await putEvent({
        email,
        event: 'gate.opened',
        meta: { slug, intent: 'reopen', resent: String(resent) },
      });

      return accepted({
        ok: true,
        state: existing.status === 'active' ? 'active' : 'pending',
        gateToken,
        subscriberHash: hashEmail(email),
        resent,
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
    const resent = await sendSubscribeMail({
      email,
      slug,
      unsubToken: result.subscriber.unsubToken,
      env,
    });

    await putEvent({
      email,
      event: 'gate.opened',
      meta: { slug, resent: String(resent) },
    });

    log('info', 'subscribe.ok', {
      ...emailHashField(email),
      state: result.state,
      slug,
      waitlist: slug === COURSE_WAITLIST_SLUG,
      resent,
    });

    return accepted({
      ok: true,
      state: result.state,
      gateToken,
      subscriberHash: hashEmail(email),
      resent,
    });
  } catch (err) {
    log('error', 'subscribe.error', {
      err: err instanceof Error ? err.message : 'unknown',
    });
    return internalError();
  }
}
