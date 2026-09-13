import { log } from '../lib/log.js';
import { runPrivacyCleanup } from '../db/leads-ops.js';

/** Weekly EventBridge job — IP/UA 90d strip, unsub 3y anonymize, inquiry 1y delete. */
export async function handler(): Promise<void> {
  try {
    const stats = await runPrivacyCleanup();
    log('info', 'privacy_cleanup.done', stats);
  } catch (err) {
    log('error', 'privacy_cleanup.error', {
      err: err instanceof Error ? err.message : 'unknown',
    });
    throw err;
  }
}
