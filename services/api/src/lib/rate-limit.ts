import { countRecentIpEvents, putIpRateEvent } from '../db/events.js';
import { log } from './log.js';

const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 10;

export type RateLimitCheck = (ip: string) => Promise<boolean>;

const memoryBuckets = new Map<string, number[]>();

export const memoryRateLimit: RateLimitCheck = async (ip) => {
  const now = Date.now();
  const prev = memoryBuckets.get(ip) ?? [];
  const recent = prev.filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) return false;
  recent.push(now);
  memoryBuckets.set(ip, recent);
  return true;
};

export const dynamoRateLimit: RateLimitCheck = async (ip) => {
  const sinceIso = new Date(Date.now() - WINDOW_MS).toISOString();
  const count = await countRecentIpEvents(ip, sinceIso);
  if (count >= MAX_PER_WINDOW) return false;
  await putIpRateEvent(ip);
  return true;
};

let rateLimitImpl: RateLimitCheck =
  process.env.RATE_LIMIT_MODE === 'memory' ? memoryRateLimit : dynamoRateLimit;

export function setRateLimitCheck(impl: RateLimitCheck): void {
  rateLimitImpl = impl;
}

export function resetRateLimitCheck(): void {
  rateLimitImpl =
    process.env.RATE_LIMIT_MODE === 'memory' ? memoryRateLimit : dynamoRateLimit;
  memoryBuckets.clear();
}

/** Returns true if allowed. */
export async function checkRateLimit(ip: string | undefined): Promise<boolean> {
  const key = ip && ip.length > 0 ? ip : 'unknown';
  try {
    return await rateLimitImpl(key);
  } catch (err) {
    log('warn', 'rate_limit.error', {
      err: err instanceof Error ? err.message : 'unknown',
    });
    return true;
  }
}

export function clearMemoryRateLimit(): void {
  memoryBuckets.clear();
}
