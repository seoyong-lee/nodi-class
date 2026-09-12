import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { verifyConfirmToken, type ConfirmPayload } from '@nodi/shared';
import { activateSubscriber } from '../db/subscribers.js';
import { putEvent } from '../db/events.js';
import { getEnv } from '../lib/env.js';
import { emailHashField, log } from '../lib/log.js';
import { internalError, redirect } from '../lib/response.js';
import { resourcePath } from '../mail/templates/layout.js';

function peekConfirm(token: string): ConfirmPayload | null {
  const parts = token.split('.');
  if (parts.length !== 3 || parts[0] !== 'v1' || !parts[1]) return null;
  try {
    const payload = JSON.parse(
      Buffer.from(parts[1], 'base64url').toString('utf8'),
    ) as ConfirmPayload;
    if (payload?.t !== 'c' || typeof payload.s !== 'string') return null;
    return payload;
  } catch {
    return null;
  }
}

export async function handler(
  event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyResultV2> {
  try {
    const env = await getEnv();
    const token = event.queryStringParameters?.t;
    if (!token) {
      return redirect(`${env.siteUrl}/`);
    }

    const peeked = peekConfirm(token);
    const verified = verifyConfirmToken(token, env.gateSecret);

    if (!verified) {
      const slug = peeked?.s;
      if (slug) {
        return redirect(`${env.siteUrl}${resourcePath(slug)}?expired=1`);
      }
      return redirect(`${env.siteUrl}/`);
    }

    const { e: email, s: slug } = verified;
    const subscriber = await activateSubscriber(email);
    if (!subscriber) {
      return redirect(`${env.siteUrl}${resourcePath(slug)}?expired=1`);
    }

    await putEvent({ email, event: 'subscribe.confirmed', meta: { slug } });

    log('info', 'confirm.ok', { ...emailHashField(email), slug });

    // List quality only — unlock cookie is issued on form submit via gateToken.
    return redirect(`${env.siteUrl}${resourcePath(slug)}`);
  } catch (err) {
    log('error', 'confirm.error', {
      err: err instanceof Error ? err.message : 'unknown',
    });
    return internalError();
  }
}
