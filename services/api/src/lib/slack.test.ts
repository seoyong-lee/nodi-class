import { afterEach, describe, expect, it, vi } from 'vitest';
import { notifyInquirySlack } from './slack.js';

describe('notifyInquirySlack', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('no-ops when webhook url is empty', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    await notifyInquirySlack(undefined, {
      name: 'a',
      email: 'a@b.com',
      resultUrl: 'https://x.example',
      blocked: 'y',
      inquiryPk: 'INQ#1',
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('posts Block Kit payload to Incoming Webhook', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      text: async () => 'ok',
    });
    vi.stubGlobal('fetch', fetchMock);

    await notifyInquirySlack('https://hooks.slack.com/services/T/B/x', {
      name: '홍길동',
      email: 'a@b.com',
      resultUrl: 'https://result.example/page',
      blocked: '레이아웃이 깨집니다',
      inquiryPk: 'INQ#abc',
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0]!;
    expect(url).toBe('https://hooks.slack.com/services/T/B/x');
    expect(init.method).toBe('POST');
    const body = JSON.parse(init.body as string);
    expect(body.text).toContain('검토 요청');
    expect(body.text).toContain('홍길동');
    expect(body.blocks.length).toBeGreaterThan(2);
  });
});
