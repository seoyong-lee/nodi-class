import { createHash } from 'node:crypto';

/**
 * Campaign / advertising sends must target confirmed subscribers only
 * (정보통신망법 §50 — pending addresses are not verified consent).
 */
export function assertActiveForCampaign(status: string): void {
  if (status !== 'active') {
    throw new Error(
      `campaign_blocked: status=${status} (active only; pending is not verified consent)`,
    );
  }
}

export function emailPseudonym(email: string): string {
  const hash = createHash('sha256')
    .update(email.trim().toLowerCase())
    .digest('hex')
    .slice(0, 16);
  return `anon_${hash}@invalid.local`;
}
