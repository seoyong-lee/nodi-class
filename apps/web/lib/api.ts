import type { SubscribeResponse as SharedSubscribeResponse } from '@nodi/shared';

export function getApiBaseUrl(): string {
  const base = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (!base) {
    throw new Error('NEXT_PUBLIC_API_URL is not set');
  }
  return base.replace(/\/$/, '');
}

export type SubscribeResponse = SharedSubscribeResponse;

export type ApiErrorBody = {
  error?: string;
};

export async function postSubscribe(
  body: Record<string, unknown>,
): Promise<
  | {
      ok: true;
      state: 'pending' | 'active';
      gateToken: string;
      subscriberHash?: string;
      resent?: boolean;
    }
  | { ok: false; status: number; error?: string }
> {
  const res = await fetch(`${getApiBaseUrl()}/subscribe`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (res.status === 202) {
    const data = (await res.json()) as SubscribeResponse;
    if (!data.gateToken) {
      return { ok: false, status: 502, error: 'missing_gate' };
    }
    return {
      ok: true,
      state: data.state,
      gateToken: data.gateToken,
      subscriberHash: data.subscriberHash,
      resent: data.resent,
    };
  }

  let error: string | undefined;
  try {
    const data = (await res.json()) as ApiErrorBody;
    error = data.error;
  } catch {
    /* ignore */
  }
  return { ok: false, status: res.status, error };
}

export async function postInquiry(
  body: Record<string, unknown>,
): Promise<{ ok: true } | { ok: false; status: number; error?: string }> {
  const res = await fetch(`${getApiBaseUrl()}/inquiry`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (res.status === 202) {
    return { ok: true };
  }

  let error: string | undefined;
  try {
    const data = (await res.json()) as ApiErrorBody;
    error = data.error;
  } catch {
    /* ignore */
  }
  return { ok: false, status: res.status, error };
}

export async function postUnsubscribe(t: string): Promise<void> {
  // API returns 200 even on mismatch (enumeration prevention).
  await fetch(`${getApiBaseUrl()}/unsubscribe`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ t }),
  });
}
