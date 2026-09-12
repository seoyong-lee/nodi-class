import { beforeEach, describe, expect, it, vi } from 'vitest';

const send = vi.fn();

vi.mock('../db/client.js', () => ({
  getDocClient: () => ({ send }),
}));

vi.mock('../lib/env.js', () => ({
  getEnv: async () => ({ subscribersTable: 'nodi-class-subscribers' }),
}));

import { claimMailSlot } from '../db/subscribers.js';

describe('claimMailSlot', () => {
  beforeEach(() => {
    send.mockReset();
  });

  it('allows send when lastMailAt is older than 11 minutes', async () => {
    send.mockResolvedValueOnce({});
    await expect(claimMailSlot('user@example.com')).resolves.toBe(true);
    const input = send.mock.calls[0]![0].input;
    const cutoff = new Date(input.ExpressionAttributeValues[':cutoff']).getTime();
    const now = new Date(input.ExpressionAttributeValues[':now']).getTime();
    expect(now - cutoff).toBe(10 * 60 * 1000);
  });

  it('blocks send when DynamoDB condition fails (within 9 minutes)', async () => {
    send.mockRejectedValueOnce(new Error('ConditionalCheckFailedException'));
    await expect(claimMailSlot('user@example.com')).resolves.toBe(false);
  });
});
