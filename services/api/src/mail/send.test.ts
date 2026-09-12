import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SendEmailCommand } from '@aws-sdk/client-sesv2';
import { resetEnvCache, setSsmClient } from '../lib/env.js';
import { setSesClient, sendMail } from './send.js';

vi.mock('../db/events.js', () => ({
  putEvent: vi.fn().mockResolvedValue(undefined),
}));

describe('sendMail SES headers', () => {
  const send = vi.fn().mockResolvedValue({});

  beforeEach(() => {
    resetEnvCache();
    setSsmClient(undefined);
    process.env.SUBSCRIBERS_TABLE = 't';
    process.env.INQUIRIES_TABLE = 't';
    process.env.EVENTS_TABLE = 't';
    process.env.RESOURCES_TABLE = 't';
    process.env.GATE_SECRET = 'test-gate-secret-at-least-32-chars-long!!';
    process.env.TURNSTILE_SECRET = 'ts';
    process.env.SITE_URL = 'https://nodi.example';
    process.env.MAIL_FROM = '노디 AI 클래스 <hello@mail.nodi.example>';
    process.env.MAIL_REPLY_TO = 'contact@cascades.studio';
    process.env.NOTIFY_EMAIL = 'notify@example.com';
    process.env.SES_CONFIGURATION_SET = 'nodi-class-transactional';
    send.mockClear();
    setSesClient({ send } as never);
  });

  it('passes From display name, Reply-To, and List-Unsubscribe headers', async () => {
    const ok = await sendMail({
      to: 'user@example.com',
      template: 'resource',
      unsubToken: 'abc123',
      content: {
        subject: '제목',
        text: '본문',
        html: '<p>본문</p>',
      },
    });

    expect(ok).toBe(true);
    expect(send).toHaveBeenCalledTimes(1);
    const command = send.mock.calls[0]![0] as SendEmailCommand;
    const input = command.input;
    expect(input.FromEmailAddress).toBe(
      '노디 AI 클래스 <hello@mail.nodi.example>',
    );
    expect(input.ReplyToAddresses).toEqual(['contact@cascades.studio']);
    const headers = input.Content?.Simple?.Headers ?? [];
    expect(headers).toEqual(
      expect.arrayContaining([
        {
          Name: 'List-Unsubscribe',
          Value: '<https://nodi.example/unsubscribe?t=abc123>',
        },
        {
          Name: 'List-Unsubscribe-Post',
          Value: 'List-Unsubscribe=One-Click',
        },
      ]),
    );
  });

  it('skips List-Unsubscribe when skipListUnsub is set', async () => {
    await sendMail({
      to: 'user@example.com',
      template: 'inquiry-ack',
      skipListUnsub: true,
      content: { subject: 's', text: 't', html: '<p>t</p>' },
    });
    const command = send.mock.calls[0]![0] as SendEmailCommand;
    expect(command.input.Content?.Simple?.Headers).toBeUndefined();
  });
});
