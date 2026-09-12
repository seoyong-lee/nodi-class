import { PutCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { hashEmail } from '@nodi/shared';
import { getDocClient } from './client.js';
import { getEnv } from '../lib/env.js';

const EVENT_TTL_SEC = 90 * 24 * 3600;

export type EventName =
  | 'subscribe.requested'
  | 'subscribe.confirmed'
  | 'gate.opened'
  | 'mail.sent'
  | 'mail.failed'
  | 'unsubscribe'
  | 'rate.hit'
  | 'inquiry.created'
  | 'ses.bounce'
  | 'ses.complaint';

export type PutEventInput = {
  email?: string;
  /** For IP rate limiting: pk = IP#<ip> */
  ip?: string;
  event: EventName | string;
  meta?: Record<string, string>;
};

function ttl(): number {
  return Math.floor(Date.now() / 1000) + EVENT_TTL_SEC;
}

export async function putEvent(input: PutEventInput): Promise<void> {
  const { eventsTable } = getEnv();
  const now = new Date().toISOString();
  const pk = input.ip
    ? `IP#${input.ip}`
    : `EMAILHASH#${hashEmail(input.email ?? '')}`;
  const sk = `${now}#${input.event}`;

  await getDocClient().send(
    new PutCommand({
      TableName: eventsTable,
      Item: {
        pk,
        sk,
        event: input.event,
        createdAt: now,
        ttl: ttl(),
        ...(input.meta ?? {}),
      },
    }),
  );
}

export async function putIpRateEvent(ip: string): Promise<void> {
  await putEvent({ ip, event: 'rate.hit' });
}

export async function countRecentIpEvents(
  ip: string,
  sinceIso: string,
): Promise<number> {
  const { eventsTable } = getEnv();
  const res = await getDocClient().send(
    new QueryCommand({
      TableName: eventsTable,
      KeyConditionExpression: 'pk = :pk AND sk >= :since',
      ExpressionAttributeValues: {
        ':pk': `IP#${ip}`,
        ':since': sinceIso,
      },
      Select: 'COUNT',
    }),
  );
  return res.Count ?? 0;
}
