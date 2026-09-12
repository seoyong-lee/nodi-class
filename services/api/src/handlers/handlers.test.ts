import type { APIGatewayProxyEventV2 } from 'aws-lambda';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  createConfirmToken,
  CONFIRM_TTL_SEC,
  signToken,
} from '@nodi/shared';

vi.mock('../db/subscribers.js', () => ({
  upsertSubscriber: vi.fn(),
  activateSubscriber: vi.fn(),
  unsubscribeByToken: vi.fn(),
  markUnsubscribed: vi.fn(),
}));

vi.mock('../db/inquiries.js', () => ({
  saveInquiry: vi.fn(),
}));

vi.mock('../db/events.js', () => ({
  putEvent: vi.fn().mockResolvedValue(undefined),
  putIpRateEvent: vi.fn(),
  countRecentIpEvents: vi.fn(),
}));

vi.mock('../mail/send.js', () => ({
  sendMail: vi.fn().mockResolvedValue(true),
}));

vi.mock('../lib/slack.js', () => ({
  notifyInquirySlack: vi.fn().mockResolvedValue(undefined),
}));

import { upsertSubscriber, activateSubscriber, unsubscribeByToken } from '../db/subscribers.js';
import { saveInquiry } from '../db/inquiries.js';
import { sendMail } from '../mail/send.js';
import { notifyInquirySlack } from '../lib/slack.js';
import { setTurnstileVerify, resetTurnstileVerify } from '../lib/turnstile.js';
import {
  setRateLimitCheck,
  resetRateLimitCheck,
  memoryRateLimit,
  clearMemoryRateLimit,
} from '../lib/rate-limit.js';
import { handler as subscribe } from '../handlers/subscribe.js';
import { handler as confirm } from '../handlers/confirm.js';
import { handler as inquiry } from '../handlers/inquiry.js';
import { handler as unsubscribe } from '../handlers/unsubscribe.js';

const SECRET = 'test-gate-secret-at-least-32-chars-long!!';
const SITE = 'https://nodi.example';

function setTestEnv(): void {
  process.env.SUBSCRIBERS_TABLE = 'nodi-class-subscribers';
  process.env.INQUIRIES_TABLE = 'nodi-class-inquiries';
  process.env.EVENTS_TABLE = 'nodi-class-events';
  process.env.RESOURCES_TABLE = 'nodi-class-resources';
  process.env.GATE_SECRET = SECRET;
  process.env.TURNSTILE_SECRET = 'ts-secret';
  process.env.ADMIN_API_KEY = 'test-admin-key';
  process.env.SITE_URL = SITE;
  process.env.API_URL = 'https://api.nodi.example';
  process.env.MAIL_FROM = '노디 AI 클래스 <hello@mail.nodi.example>';
  process.env.NOTIFY_EMAIL = 'notify@example.com';
  process.env.RATE_LIMIT_MODE = 'memory';
}

function httpEvent(
  partial: Partial<APIGatewayProxyEventV2> & {
    body?: string;
    query?: Record<string, string>;
  },
): APIGatewayProxyEventV2 {
  return {
    version: '2.0',
    routeKey: 'POST /subscribe',
    rawPath: '/subscribe',
    rawQueryString: '',
    headers: { 'content-type': 'application/json', 'x-forwarded-for': '1.2.3.4' },
    requestContext: {
      accountId: '1',
      apiId: 'api',
      domainName: 'api.nodi.example',
      domainPrefix: 'api',
      http: {
        method: 'POST',
        path: '/subscribe',
        protocol: 'HTTP/1.1',
        sourceIp: '1.2.3.4',
        userAgent: 'vitest',
      },
      requestId: 'req',
      routeKey: 'POST /subscribe',
      stage: '$default',
      time: '',
      timeEpoch: Date.now(),
    },
    isBase64Encoded: false,
    queryStringParameters: partial.query,
    body: partial.body,
    ...partial,
  } as APIGatewayProxyEventV2;
}

const baseSubscribe = {
  email: 'user@example.com',
  slug: 'claude-ppt-guidebook',
  consent: true as const,
  turnstile: 'turnstile-token-ok',
};

describe('subscribe', () => {
  beforeEach(() => {
    setTestEnv();
    vi.clearAllMocks();
    resetTurnstileVerify();
    setTurnstileVerify(async () => true);
    resetRateLimitCheck();
    setRateLimitCheck(memoryRateLimit);
    clearMemoryRateLimit();
  });

  it('returns 202 with gateToken and sends resource mail for new subscriber', async () => {
    vi.mocked(upsertSubscriber).mockResolvedValue({
      created: true,
      state: 'pending',
      subscriber: {
        pk: 'EMAIL#user@example.com',
        sk: 'PROFILE',
        email: 'user@example.com',
        status: 'pending',
        source: 'claude-ppt-guidebook',
        tags: ['resource:claude-ppt-guidebook'],
        consentAt: new Date().toISOString(),
        consentVersion: '2026-09-12',
        unsubToken: 'a'.repeat(32),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        gsi1pk: 'STATUS#pending',
        gsi1sk: new Date().toISOString(),
      },
    });

    const res = await subscribe(
      httpEvent({ body: JSON.stringify(baseSubscribe) }),
    );
    expect(res).toMatchObject({ statusCode: 202 });
    const body = JSON.parse((res as { body: string }).body) as {
      ok: boolean;
      state: string;
      gateToken: string;
    };
    expect(body).toMatchObject({ ok: true, state: 'pending' });
    expect(typeof body.gateToken).toBe('string');
    expect(body.gateToken.length).toBeGreaterThan(10);
    expect(sendMail).toHaveBeenCalledWith(
      expect.objectContaining({ template: 'resource' }),
    );
  });

  it('returns 202 active with gateToken and sends resource mail', async () => {
    vi.mocked(upsertSubscriber).mockResolvedValue({
      created: false,
      state: 'active',
      subscriber: {
        pk: 'EMAIL#user@example.com',
        sk: 'PROFILE',
        email: 'user@example.com',
        status: 'active',
        source: 'claude-ppt-guidebook',
        tags: ['resource:claude-ppt-guidebook'],
        consentAt: new Date().toISOString(),
        confirmedAt: new Date().toISOString(),
        consentVersion: '2026-09-12',
        unsubToken: 'b'.repeat(32),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        gsi1pk: 'STATUS#active',
        gsi1sk: new Date().toISOString(),
      },
    });

    const res = await subscribe(
      httpEvent({ body: JSON.stringify(baseSubscribe) }),
    );
    expect(res).toMatchObject({ statusCode: 202 });
    const body = JSON.parse((res as { body: string }).body) as {
      ok: boolean;
      state: string;
      gateToken: string;
    };
    expect(body).toMatchObject({ ok: true, state: 'active' });
    expect(typeof body.gateToken).toBe('string');
    expect(sendMail).toHaveBeenCalledWith(
      expect.objectContaining({ template: 'resource' }),
    );
  });

  it('returns 403 bot when honeypot website is nonempty', async () => {
    const res = await subscribe(
      httpEvent({
        body: JSON.stringify({ ...baseSubscribe, website: 'http://spam' }),
      }),
    );
    expect(res).toMatchObject({ statusCode: 403 });
    expect(JSON.parse((res as { body: string }).body)).toEqual({
      error: 'bot',
    });
    expect(upsertSubscriber).not.toHaveBeenCalled();
  });

  it('returns 403 bot when turnstile fails', async () => {
    setTurnstileVerify(async () => false);
    const res = await subscribe(
      httpEvent({ body: JSON.stringify(baseSubscribe) }),
    );
    expect(res).toMatchObject({ statusCode: 403 });
    expect(upsertSubscriber).not.toHaveBeenCalled();
  });
});

describe('confirm', () => {
  beforeEach(() => {
    setTestEnv();
    vi.clearAllMocks();
  });

  it('activates and redirects to resource path without sending mail', async () => {
    const token = createConfirmToken(
      'user@example.com',
      'claude-ppt-guidebook',
      SECRET,
    );
    vi.mocked(activateSubscriber).mockResolvedValue({
      pk: 'EMAIL#user@example.com',
      sk: 'PROFILE',
      email: 'user@example.com',
      status: 'active',
      source: 'claude-ppt-guidebook',
      tags: ['resource:claude-ppt-guidebook'],
      consentAt: new Date().toISOString(),
      confirmedAt: new Date().toISOString(),
      consentVersion: '2026-09-12',
      unsubToken: 'c'.repeat(32),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      gsi1pk: 'STATUS#active',
      gsi1sk: new Date().toISOString(),
    });

    const res = await confirm(httpEvent({ query: { t: token } }));
    expect(res).toMatchObject({ statusCode: 302 });
    const location = (res as { headers?: { location?: string } }).headers
      ?.location;
    expect(location).toBe(`${SITE}/free/claude-ppt-guidebook`);
    expect(sendMail).not.toHaveBeenCalled();
  });

  it('redirects to free slug with expired=1 when token expired', async () => {
    const now = Math.floor(Date.now() / 1000);
    const token = signToken(
      {
        t: 'c',
        e: 'user@example.com',
        s: 'claude-ppt-guidebook',
        x: now - CONFIRM_TTL_SEC - 10,
      },
      SECRET,
    );

    const res = await confirm(httpEvent({ query: { t: token } }));
    expect(res).toMatchObject({ statusCode: 302 });
    expect((res as { headers?: { location?: string } }).headers?.location).toBe(
      `${SITE}/free/claude-ppt-guidebook?expired=1`,
    );
    expect(activateSubscriber).not.toHaveBeenCalled();
  });
});

describe('inquiry', () => {
  beforeEach(() => {
    setTestEnv();
    vi.clearAllMocks();
    setTurnstileVerify(async () => true);
    setRateLimitCheck(memoryRateLimit);
    clearMemoryRateLimit();
  });

  it('saves inquiry, sends notify+ack, returns 202', async () => {
    vi.mocked(saveInquiry).mockResolvedValue({
      pk: 'INQ#abc',
      sk: 'META',
      name: '홍길동',
      email: 'a@b.com',
      resultUrl: 'https://result.example/page',
      blocked: '디자인이 깨져서 고치기 어렵습니다',
      status: 'new',
      createdAt: new Date().toISOString(),
      gsi1pk: 'STATUS#new',
      gsi1sk: new Date().toISOString(),
    });

    const res = await inquiry(
      httpEvent({
        body: JSON.stringify({
          name: '홍길동',
          email: 'a@b.com',
          resultUrl: 'https://result.example/page',
          blocked: '디자인이 깨져서 고치기 어렵습니다',
          consent: true,
          turnstile: 'turnstile-token-ok',
        }),
      }),
    );

    expect(res).toMatchObject({ statusCode: 202 });
    expect(sendMail).toHaveBeenCalledTimes(2);
    expect(vi.mocked(sendMail).mock.calls.map((c) => c[0]?.template).sort()).toEqual([
      'inquiry-ack',
      'inquiry-notify',
    ]);
    expect(notifyInquirySlack).toHaveBeenCalledWith(
      undefined,
      expect.objectContaining({
        name: '홍길동',
        email: 'a@b.com',
        resultUrl: 'https://result.example/page',
        inquiryPk: 'INQ#abc',
      }),
    );
  });

  it('still returns 202 when Slack notify fails', async () => {
    vi.mocked(saveInquiry).mockResolvedValue({
      pk: 'INQ#abc',
      sk: 'META',
      name: '홍길동',
      email: 'a@b.com',
      resultUrl: 'https://result.example/page',
      blocked: '디자인이 깨져서 고치기 어렵습니다',
      status: 'new',
      createdAt: new Date().toISOString(),
      gsi1pk: 'STATUS#new',
      gsi1sk: new Date().toISOString(),
    });
    vi.mocked(notifyInquirySlack).mockRejectedValueOnce(new Error('slack down'));

    const res = await inquiry(
      httpEvent({
        body: JSON.stringify({
          name: '홍길동',
          email: 'a@b.com',
          resultUrl: 'https://result.example/page',
          blocked: '디자인이 깨져서 고치기 어렵습니다',
          consent: true,
          turnstile: 'turnstile-token-ok',
        }),
      }),
    );

    expect(res).toMatchObject({ statusCode: 202 });
    expect(sendMail).toHaveBeenCalledTimes(2);
  });
});

describe('unsubscribe', () => {
  beforeEach(() => {
    setTestEnv();
    vi.clearAllMocks();
  });

  it('always returns 200 ok even when token unknown', async () => {
    vi.mocked(unsubscribeByToken).mockResolvedValue(null);
    const res = await unsubscribe(
      httpEvent({ body: JSON.stringify({ t: 'unknown-token-value' }) }),
    );
    expect(res).toMatchObject({ statusCode: 200 });
    expect(JSON.parse((res as { body: string }).body)).toEqual({ ok: true });
  });

  it('unsubscribes when token matches', async () => {
    vi.mocked(unsubscribeByToken).mockResolvedValue({
      pk: 'EMAIL#user@example.com',
      sk: 'PROFILE',
      email: 'user@example.com',
      status: 'unsubscribed',
      source: 'x',
      tags: [],
      consentAt: '',
      consentVersion: '2026-09-12',
      unsubToken: 'd'.repeat(32),
      createdAt: '',
      updatedAt: '',
      gsi1pk: 'STATUS#unsubscribed',
      gsi1sk: '',
    });

    const res = await unsubscribe(
      httpEvent({ body: JSON.stringify({ t: 'd'.repeat(32) }) }),
    );
    expect(res).toMatchObject({ statusCode: 200 });
    expect(unsubscribeByToken).toHaveBeenCalledWith('d'.repeat(32));
  });
});
