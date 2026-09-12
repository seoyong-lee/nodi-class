import { GetCommand, PutCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import type { ResourceUpsertInput } from '@nodi/shared';
import { getDocClient } from './client.js';
import { getEnv } from '../lib/env.js';

export type ResourceRecord = {
  pk: string;
  sk: string;
  slug: string;
  title: string;
  series: string;
  summary: string;
  included?: string[];
  youtube?: string;
  freeParts: number;
  publishedAt: string;
  body: string;
  downloads?: { label: string; key: string }[];
  status: 'published' | 'draft';
  gsi1pk: string;
  gsi1sk: string;
  createdAt: string;
  updatedAt: string;
};

export type ResourcePublic = {
  slug: string;
  title: string;
  series: string;
  summary: string;
  included?: string[];
  youtube?: string;
  freeParts: number;
  publishedAt: string;
  body: string;
  downloads?: { label: string; key: string }[];
  status: 'published' | 'draft';
  updatedAt: string;
};

function pk(slug: string): string {
  return `RESOURCE#${slug}`;
}

function toPublic(item: ResourceRecord): ResourcePublic {
  return {
    slug: item.slug,
    title: item.title,
    series: item.series,
    summary: item.summary,
    included: item.included,
    youtube: item.youtube,
    freeParts: item.freeParts,
    publishedAt: item.publishedAt,
    body: item.body,
    downloads: item.downloads,
    status: item.status,
    updatedAt: item.updatedAt,
  };
}

export async function getResourceBySlug(
  slug: string,
): Promise<ResourcePublic | null> {
  const { resourcesTable } = await getEnv();
  const res = await getDocClient().send(
    new GetCommand({
      TableName: resourcesTable,
      Key: { pk: pk(slug), sk: 'META' },
    }),
  );
  if (!res.Item) return null;
  return toPublic(res.Item as ResourceRecord);
}

export async function listPublishedResources(): Promise<ResourcePublic[]> {
  const { resourcesTable } = await getEnv();
  const res = await getDocClient().send(
    new QueryCommand({
      TableName: resourcesTable,
      IndexName: 'gsi1',
      KeyConditionExpression: 'gsi1pk = :pk',
      ExpressionAttributeValues: { ':pk': 'STATUS#published' },
      ScanIndexForward: false,
    }),
  );
  return (res.Items ?? []).map((item) => toPublic(item as ResourceRecord));
}

export async function upsertResource(
  input: ResourceUpsertInput,
): Promise<ResourcePublic> {
  const { resourcesTable } = await getEnv();
  const now = new Date().toISOString();
  const raw = await getDocClient().send(
    new GetCommand({
      TableName: resourcesTable,
      Key: { pk: pk(input.slug), sk: 'META' },
    }),
  );
  const prevCreated =
    typeof raw.Item?.createdAt === 'string' ? raw.Item.createdAt : now;

  const item: ResourceRecord = {
    pk: pk(input.slug),
    sk: 'META',
    slug: input.slug,
    title: input.title,
    series: input.series,
    summary: input.summary,
    included: input.included,
    youtube: input.youtube,
    freeParts: input.freeParts,
    publishedAt: input.publishedAt,
    body: input.body,
    downloads: input.downloads,
    status: input.status,
    gsi1pk: `STATUS#${input.status}`,
    gsi1sk: input.publishedAt,
    createdAt: prevCreated,
    updatedAt: now,
  };

  await getDocClient().send(
    new PutCommand({
      TableName: resourcesTable,
      Item: item,
    }),
  );

  return toPublic(item);
}
