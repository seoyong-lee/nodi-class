import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { randomUUID } from 'node:crypto';
import { getDocClient } from './client.js';
import { getEnv } from '../lib/env.js';

export type InquiryStatus = 'new' | 'replied' | 'closed';

export type Inquiry = {
  pk: string;
  sk: string;
  name: string;
  email: string;
  resultUrl: string;
  blocked: string;
  status: InquiryStatus;
  createdAt: string;
  ip?: string;
  ua?: string;
  gsi1pk: string;
  gsi1sk: string;
};

export type SaveInquiryInput = {
  name: string;
  email: string;
  resultUrl: string;
  blocked: string;
  ip?: string;
  ua?: string;
};

export async function saveInquiry(input: SaveInquiryInput): Promise<Inquiry> {
  const { inquiriesTable } = getEnv();
  const now = new Date().toISOString();
  const id = randomUUID();
  const item: Inquiry = {
    pk: `INQ#${id}`,
    sk: 'META',
    name: input.name,
    email: input.email.trim().toLowerCase(),
    resultUrl: input.resultUrl,
    blocked: input.blocked,
    status: 'new',
    createdAt: now,
    ip: input.ip,
    ua: input.ua,
    gsi1pk: 'STATUS#new',
    gsi1sk: now,
  };

  await getDocClient().send(
    new PutCommand({
      TableName: inquiriesTable,
      Item: item,
    }),
  );

  return item;
}
