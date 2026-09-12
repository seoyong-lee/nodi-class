import { log } from './log.js';

export type TurnstileVerify = (
  token: string,
  ip: string | undefined,
  secret: string,
) => Promise<boolean>;

const SITEVERIFY_URL =
  'https://challenges.cloudflare.com/turnstile/v0/siteverify';

export const verifyTurnstile: TurnstileVerify = async (token, ip, secret) => {
  try {
    const body = new URLSearchParams();
    body.set('secret', secret);
    body.set('response', token);
    if (ip) body.set('remoteip', ip);

    const res = await fetch(SITEVERIFY_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body,
    });
    if (!res.ok) {
      log('warn', 'turnstile.http_error', { status: res.status });
      return false;
    }
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch (err) {
    log('error', 'turnstile.verify_failed', {
      err: err instanceof Error ? err.message : 'unknown',
    });
    return false;
  }
};

/** Overridable for unit tests. */
let turnstileImpl: TurnstileVerify = verifyTurnstile;

export function setTurnstileVerify(impl: TurnstileVerify): void {
  turnstileImpl = impl;
}

export function resetTurnstileVerify(): void {
  turnstileImpl = verifyTurnstile;
}

export function checkTurnstile(
  token: string,
  ip: string | undefined,
  secret: string,
): Promise<boolean> {
  return turnstileImpl(token, ip, secret);
}
