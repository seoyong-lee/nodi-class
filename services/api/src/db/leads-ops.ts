import {
  ScanCommand,
  UpdateCommand,
  DeleteCommand,
  type ScanCommandOutput,
} from '@aws-sdk/lib-dynamodb';
import { getDocClient } from './client.js';
import { getEnv } from '../lib/env.js';
import type { Subscriber } from './subscribers.js';
import type { Inquiry } from './inquiries.js';
import { emailPseudonym } from '../lib/campaign-guard.js';

const DAY_MS = 24 * 60 * 60 * 1000;

async function scanAll<T>(
  tableName: string,
  filter?: {
    FilterExpression: string;
    ExpressionAttributeNames?: Record<string, string>;
    ExpressionAttributeValues?: Record<string, unknown>;
  },
): Promise<T[]> {
  const items: T[] = [];
  let ExclusiveStartKey: ScanCommandOutput['LastEvaluatedKey'];
  do {
    const res = await getDocClient().send(
      new ScanCommand({
        TableName: tableName,
        ExclusiveStartKey,
        ...filter,
      }),
    );
    for (const item of res.Items ?? []) {
      items.push(item as T);
    }
    ExclusiveStartKey = res.LastEvaluatedKey;
  } while (ExclusiveStartKey);
  return items;
}

export async function listUnsyncedSubscribers(): Promise<Subscriber[]> {
  const { subscribersTable } = await getEnv();
  const rows = await scanAll<Subscriber>(subscribersTable, {
    FilterExpression:
      'sk = :sk AND attribute_not_exists(syncedAt)',
    ExpressionAttributeValues: { ':sk': 'PROFILE' },
  });
  return rows;
}

export async function listUnsyncedInquiries(): Promise<Inquiry[]> {
  const { inquiriesTable } = await getEnv();
  return scanAll<Inquiry>(inquiriesTable, {
    FilterExpression: 'sk = :sk AND attribute_not_exists(syncedAt)',
    ExpressionAttributeValues: { ':sk': 'META' },
  });
}

export async function markSubscriberSynced(
  pk: string,
  syncedAt: string,
): Promise<void> {
  const { subscribersTable } = await getEnv();
  await getDocClient().send(
    new UpdateCommand({
      TableName: subscribersTable,
      Key: { pk, sk: 'PROFILE' },
      UpdateExpression: 'SET syncedAt = :s, updatedAt = :s',
      ExpressionAttributeValues: { ':s': syncedAt },
    }),
  );
}

export async function markInquirySynced(
  pk: string,
  syncedAt: string,
): Promise<void> {
  const { inquiriesTable } = await getEnv();
  await getDocClient().send(
    new UpdateCommand({
      TableName: inquiriesTable,
      Key: { pk, sk: 'META' },
      UpdateExpression: 'SET syncedAt = :s',
      ExpressionAttributeValues: { ':s': syncedAt },
    }),
  );
}

export type PrivacyCleanupStats = {
  strippedIpUa: number;
  anonymizedUnsub: number;
  deletedInquiries: number;
};

export async function runPrivacyCleanup(
  now = new Date(),
): Promise<PrivacyCleanupStats> {
  const { subscribersTable, inquiriesTable } = await getEnv();
  const ipCutoff = new Date(now.getTime() - 90 * DAY_MS).toISOString();
  const unsubCutoff = new Date(now.getTime() - 3 * 365 * DAY_MS).toISOString();
  const inquiryCutoff = new Date(now.getTime() - 365 * DAY_MS).toISOString();
  const stats: PrivacyCleanupStats = {
    strippedIpUa: 0,
    anonymizedUnsub: 0,
    deletedInquiries: 0,
  };

  const subscribers = await scanAll<Subscriber>(subscribersTable, {
    FilterExpression: 'sk = :sk',
    ExpressionAttributeValues: { ':sk': 'PROFILE' },
  });

  for (const sub of subscribers) {
    const created = sub.consentAt || sub.createdAt;
    if (
      created &&
      created < ipCutoff &&
      (sub.ip !== undefined || sub.ua !== undefined)
    ) {
      await getDocClient().send(
        new UpdateCommand({
          TableName: subscribersTable,
          Key: { pk: sub.pk, sk: 'PROFILE' },
          UpdateExpression: 'REMOVE ip, ua SET updatedAt = :now',
          ExpressionAttributeValues: { ':now': now.toISOString() },
        }),
      );
      stats.strippedIpUa += 1;
    }

    if (
      sub.status === 'unsubscribed' &&
      sub.unsubscribedAt &&
      sub.unsubscribedAt < unsubCutoff &&
      sub.email &&
      !sub.email.startsWith('anon_')
    ) {
      const pseudo = emailPseudonym(sub.email);
      await getDocClient().send(
        new UpdateCommand({
          TableName: subscribersTable,
          Key: { pk: sub.pk, sk: 'PROFILE' },
          UpdateExpression:
            'SET email = :e, updatedAt = :now REMOVE building, ip, ua',
          ExpressionAttributeValues: {
            ':e': pseudo,
            ':now': now.toISOString(),
          },
        }),
      );
      stats.anonymizedUnsub += 1;
    }
  }

  const inquiries = await scanAll<Inquiry>(inquiriesTable, {
    FilterExpression: 'sk = :sk',
    ExpressionAttributeValues: { ':sk': 'META' },
  });

  for (const inq of inquiries) {
    if (inq.createdAt && inq.createdAt < inquiryCutoff) {
      await getDocClient().send(
        new DeleteCommand({
          TableName: inquiriesTable,
          Key: { pk: inq.pk, sk: 'META' },
        }),
      );
      stats.deletedInquiries += 1;
    } else if (
      inq.createdAt &&
      inq.createdAt < ipCutoff &&
      (inq.ip !== undefined || inq.ua !== undefined)
    ) {
      await getDocClient().send(
        new UpdateCommand({
          TableName: inquiriesTable,
          Key: { pk: inq.pk, sk: 'META' },
          UpdateExpression: 'REMOVE ip, ua',
        }),
      );
      stats.strippedIpUa += 1;
    }
  }

  return stats;
}
