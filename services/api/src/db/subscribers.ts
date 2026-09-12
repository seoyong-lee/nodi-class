import { GetCommand, PutCommand, UpdateCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { randomBytes } from 'node:crypto';
import { CONSENT_VERSION } from '@nodi/shared';
import { getDocClient } from './client.js';
import { getEnv } from '../lib/env.js';

export type SubscriberStatus = 'pending' | 'active' | 'unsubscribed';

export type Subscriber = {
  pk: string;
  sk: string;
  email: string;
  status: SubscriberStatus;
  source: string;
  building?: string;
  tags: string[];
  consentAt: string;
  consentVersion: string;
  confirmedAt?: string;
  unsubscribedAt?: string;
  bounceAt?: string;
  unsubToken: string;
  ip?: string;
  ua?: string;
  createdAt: string;
  updatedAt: string;
  gsi1pk: string;
  gsi1sk: string;
};

export function emailPk(email: string): string {
  return `EMAIL#${email.trim().toLowerCase()}`;
}

function unsubPk(token: string): string {
  return `UNSUB#${token}`;
}

function resourceTag(slug: string): string {
  return slug === 'course-waitlist' ? 'course-waitlist' : `resource:${slug}`;
}

function newUnsubToken(): string {
  return randomBytes(16).toString('hex');
}

export async function getSubscriber(email: string): Promise<Subscriber | null> {
  const { subscribersTable } = getEnv();
  const res = await getDocClient().send(
    new GetCommand({
      TableName: subscribersTable,
      Key: { pk: emailPk(email), sk: 'PROFILE' },
    }),
  );
  return (res.Item as Subscriber | undefined) ?? null;
}

export async function getSubscriberByUnsubToken(
  token: string,
): Promise<Subscriber | null> {
  const { subscribersTable } = getEnv();
  const link = await getDocClient().send(
    new GetCommand({
      TableName: subscribersTable,
      Key: { pk: unsubPk(token), sk: 'LINK' },
    }),
  );
  const subscriberPk = link.Item?.subscriberPk as string | undefined;
  if (!subscriberPk) return null;

  const res = await getDocClient().send(
    new GetCommand({
      TableName: subscribersTable,
      Key: { pk: subscriberPk, sk: 'PROFILE' },
    }),
  );
  return (res.Item as Subscriber | undefined) ?? null;
}

export type UpsertSubscribeInput = {
  email: string;
  slug: string;
  source?: string;
  building?: string;
  ip?: string;
  ua?: string;
};

export type UpsertSubscribeResult = {
  subscriber: Subscriber;
  state: 'pending' | 'active';
  created: boolean;
};

export async function upsertSubscriber(
  input: UpsertSubscribeInput,
): Promise<UpsertSubscribeResult> {
  const { subscribersTable } = getEnv();
  const now = new Date().toISOString();
  const email = input.email.trim().toLowerCase();
  const existing = await getSubscriber(email);
  const tag = resourceTag(input.slug);

  if (existing) {
    const tags = new Set(existing.tags ?? []);
    tags.add(tag);
    const keepActive = existing.status === 'active';
    const status: SubscriberStatus = keepActive
      ? 'active'
      : existing.status === 'unsubscribed'
        ? 'pending'
        : existing.status;

    const updated: Subscriber = {
      ...existing,
      status,
      tags: [...tags],
      building: input.building ?? existing.building,
      source: existing.source || input.source || input.slug,
      consentAt: now,
      consentVersion: CONSENT_VERSION,
      updatedAt: now,
      gsi1pk: `STATUS#${status}`,
      ...(input.ip ? { ip: input.ip } : {}),
      ...(input.ua ? { ua: input.ua } : {}),
      ...(status === 'pending' && existing.status === 'unsubscribed'
        ? { unsubscribedAt: undefined }
        : {}),
    };

    await getDocClient().send(
      new PutCommand({
        TableName: subscribersTable,
        Item: updated,
      }),
    );

    return {
      subscriber: updated,
      state: keepActive ? 'active' : 'pending',
      created: false,
    };
  }

  const unsubToken = newUnsubToken();
  const subscriber: Subscriber = {
    pk: emailPk(email),
    sk: 'PROFILE',
    email,
    status: 'pending',
    source: input.source || input.slug,
    building: input.building,
    tags: [tag],
    consentAt: now,
    consentVersion: CONSENT_VERSION,
    unsubToken,
    ip: input.ip,
    ua: input.ua,
    createdAt: now,
    updatedAt: now,
    gsi1pk: 'STATUS#pending',
    gsi1sk: now,
  };

  await getDocClient().send(
    new PutCommand({
      TableName: subscribersTable,
      Item: subscriber,
      ConditionExpression: 'attribute_not_exists(pk)',
    }),
  );

  await getDocClient().send(
    new PutCommand({
      TableName: subscribersTable,
      Item: {
        pk: unsubPk(unsubToken),
        sk: 'LINK',
        subscriberPk: subscriber.pk,
        createdAt: now,
      },
    }),
  );

  return { subscriber, state: 'pending', created: true };
}

export async function activateSubscriber(email: string): Promise<Subscriber | null> {
  const { subscribersTable } = getEnv();
  const now = new Date().toISOString();
  const pk = emailPk(email);

  try {
    const res = await getDocClient().send(
      new UpdateCommand({
        TableName: subscribersTable,
        Key: { pk, sk: 'PROFILE' },
        UpdateExpression:
          'SET #status = :active, confirmedAt = if_not_exists(confirmedAt, :now), updatedAt = :now, gsi1pk = :gsi1pk',
        ExpressionAttributeNames: { '#status': 'status' },
        ExpressionAttributeValues: {
          ':active': 'active',
          ':now': now,
          ':gsi1pk': 'STATUS#active',
        },
        ConditionExpression: 'attribute_exists(pk)',
        ReturnValues: 'ALL_NEW',
      }),
    );
    return (res.Attributes as Subscriber | undefined) ?? null;
  } catch {
    return null;
  }
}

export async function unsubscribeByToken(
  token: string,
): Promise<Subscriber | null> {
  const sub = await getSubscriberByUnsubToken(token);
  if (!sub) return null;
  await markUnsubscribed(sub.email);
  return sub;
}

export async function markUnsubscribed(
  email: string,
  opts?: { bounceAt?: boolean },
): Promise<void> {
  const { subscribersTable } = getEnv();
  const now = new Date().toISOString();
  const names: Record<string, string> = { '#status': 'status' };
  const values: Record<string, string> = {
    ':status': 'unsubscribed',
    ':now': now,
    ':gsi1pk': 'STATUS#unsubscribed',
  };
  let update =
    'SET #status = :status, unsubscribedAt = :now, updatedAt = :now, gsi1pk = :gsi1pk';
  if (opts?.bounceAt) {
    update += ', bounceAt = :now';
  }

  await getDocClient().send(
    new UpdateCommand({
      TableName: subscribersTable,
      Key: { pk: emailPk(email), sk: 'PROFILE' },
      UpdateExpression: update,
      ExpressionAttributeNames: names,
      ExpressionAttributeValues: values,
      ConditionExpression: 'attribute_exists(pk)',
    }),
  );
}

export async function findByEmailForSes(email: string): Promise<Subscriber | null> {
  return getSubscriber(email);
}

/** Unused but available for STATUS scans. */
export async function queryByStatus(
  status: SubscriberStatus,
  limit = 25,
): Promise<Subscriber[]> {
  const { subscribersTable } = getEnv();
  const res = await getDocClient().send(
    new QueryCommand({
      TableName: subscribersTable,
      IndexName: 'gsi1',
      KeyConditionExpression: 'gsi1pk = :pk',
      ExpressionAttributeValues: { ':pk': `STATUS#${status}` },
      Limit: limit,
    }),
  );
  return (res.Items as Subscriber[] | undefined) ?? [];
}
