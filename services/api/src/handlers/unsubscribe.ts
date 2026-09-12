import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { unsubscribeByToken } from '../db/subscribers.js';
import { putEvent } from '../db/events.js';
import { emailHashField, log } from '../lib/log.js';
import { parseJsonBody } from '../lib/request.js';
import { ok } from '../lib/response.js';

function readToken(body: unknown): string | null {
  if (!body || typeof body !== 'object') return null;
  const t = (body as { t?: unknown }).t;
  if (typeof t !== 'string' || t.length < 8 || t.length > 128) return null;
  return t;
}

export async function handler(
  event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyResultV2> {
  try {
    const body = parseJsonBody(event);
    if (body === null) {
      return ok({ ok: true });
    }

    const token = readToken(body);
    if (!token) {
      return ok({ ok: true });
    }

    const sub = await unsubscribeByToken(token);
    if (sub) {
      await putEvent({ email: sub.email, event: 'unsubscribe' });
      log('info', 'unsubscribe.ok', emailHashField(sub.email));
    }

    return ok({ ok: true });
  } catch (err) {
    log('error', 'unsubscribe.error', {
      err: err instanceof Error ? err.message : 'unknown',
    });
    return ok({ ok: true });
  }
}
