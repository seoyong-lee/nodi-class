import { countRecentIpEvents, putIpRateEvent } from '../db/events.js';
import { log } from './log.js';

const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 10;
/** Tighter limit for reopen/enumeration-sensitive paths. */
const REOPEN_MAX_PER_WINDOW = 3;

export type RateLimitOptions = {
  maxPerWindow?: number;
};

export type RateLimitCheck = (
  ip: string,
  options?: RateLimitOptions,
) => Promise<boolean>;

const memoryBuckets = new Map<string, number[]>();

function bucketKey(ip: string, maxPerWindow: number): string {
  return `${ip}#${maxPerWindow}`;
}

export const memoryRateLimit: RateLimitCheck = async (ip, options) => {
  const maxPerWindow = options?.maxPerWindow ?? MAX_PER_WINDOW;
  const key = bucketKey(ip, maxPerWindow);
  const now = Date.now();
  const prev = memoryBuckets.get(key) ?? [];
  const recent = prev.filter((t) => now - t < WINDOW_MS);
  if (recent.length >= maxPerWindow) return false;
  recent.push(now);
  memoryBuckets.set(key, recent);
  return true;
};

export const dynamoRateLimit: RateLimitCheck = async (ip, options) => {
  const maxPerWindow = options?.maxPerWindow ?? MAX_PER_WINDOW;
  const sinceIso = new Date(Date.now() - WINDOW_MS).toISOString();
  const count = await countRecentIpEvents(ip, sinceIso);
  if (count >= maxPerWindow) return false;
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

/** Returns true if allowed. Fail-open on store errors (logged as error for alarms). */
export async function checkRateLimit(
  ip: string | undefined,
  options?: RateLimitOptions,
): Promise<boolean> {
  const key = ip && ip.length > 0 ? ip : 'unknown';
  try {
    return await rateLimitImpl(key, options);
  } catch (err) {
    log('error', 'rate_limit.error', {
      err: err instanceof Error ? err.message : 'unknown',
    });
    return true;
  }
}

export const REOPEN_RATE_LIMIT = {
  maxPerWindow: REOPEN_MAX_PER_WINDOW,
} as const;

export function clearMemoryRateLimit(): void {
  memoryBuckets.clear();
}
