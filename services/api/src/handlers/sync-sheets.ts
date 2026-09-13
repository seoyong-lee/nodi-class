import {
  GetSecretValueCommand,
  SecretsManagerClient,
} from '@aws-sdk/client-secrets-manager';
import { google } from 'googleapis';
import type { DynamoDBStreamEvent, ScheduledEvent } from 'aws-lambda';
import {
  listUnsyncedInquiries,
  listUnsyncedSubscribers,
  markInquirySynced,
  markSubscriberSynced,
} from '../db/leads-ops.js';
import type { Subscriber } from '../db/subscribers.js';
import type { Inquiry } from '../db/inquiries.js';
import { COURSE_WAITLIST_SLUG } from '@nodi/shared';
import { emailHashField, log } from '../lib/log.js';

const SHEET_VOD = 'VOD사전예약';
const SHEET_FREE = '무료자료';
const SHEET_INQUIRY = '서비스문의';

type SaJson = {
  client_email: string;
  private_key: string;
};

let cachedAuth: Awaited<ReturnType<typeof buildSheets>> | undefined;
let secrets: SecretsManagerClient | undefined;

async function loadServiceAccount(): Promise<SaJson> {
  const arn = process.env.GOOGLE_SA_SECRET_ARN?.trim();
  if (!arn) throw new Error('Missing GOOGLE_SA_SECRET_ARN');
  if (!secrets) secrets = new SecretsManagerClient({});
  const res = await secrets.send(
    new GetSecretValueCommand({ SecretId: arn }),
  );
  const raw = res.SecretString;
  if (!raw) throw new Error('Empty Google SA secret');
  return JSON.parse(raw) as SaJson;
}

async function buildSheets() {
  const sa = await loadServiceAccount();
  const auth = new google.auth.JWT({
    email: sa.client_email,
    key: sa.private_key,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  await auth.authorize();
  return google.sheets({ version: 'v4', auth });
}

async function sheetsClient() {
  if (!cachedAuth) cachedAuth = await buildSheets();
  return cachedAuth;
}

async function appendRows(
  tab: string,
  rows: string[][],
): Promise<void> {
  const sheetId = process.env.GOOGLE_SHEET_ID?.trim();
  if (!sheetId) throw new Error('Missing GOOGLE_SHEET_ID');
  if (rows.length === 0) return;
  const sheets = await sheetsClient();
  await sheets.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range: `'${tab}'!A:D`,
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: rows },
  });
}

function subscriberRows(sub: Subscriber): {
  tab: string;
  row: string[];
}[] {
  const tags = sub.tags ?? [];
  const building = sub.building ?? '';
  const source = sub.source ?? '';
  const created = sub.createdAt ?? '';
  const email = sub.email ?? '';
  const out: { tab: string; row: string[] }[] = [];

  if (tags.includes(COURSE_WAITLIST_SLUG)) {
    out.push({
      tab: SHEET_VOD,
      row: [created, email, building, source],
    });
  }
  const resources = tags.filter((t) => t.startsWith('resource:'));
  if (resources.length > 0) {
    out.push({
      tab: SHEET_FREE,
      row: [created, email, building || resources.join(','), source],
    });
  }
  return out;
}

function inquiryRow(inq: Inquiry): string[] {
  return [
    inq.createdAt ?? '',
    inq.email ?? '',
    inq.name ?? '',
    inq.resultUrl ?? '',
  ];
}

async function syncSubscriber(sub: Subscriber): Promise<boolean> {
  const targets = subscriberRows(sub);
  if (targets.length === 0) {
    await markSubscriberSynced(sub.pk, new Date().toISOString());
    return true;
  }
  try {
    for (const t of targets) {
      await appendRows(t.tab, [t.row]);
    }
    await markSubscriberSynced(sub.pk, new Date().toISOString());
    return true;
  } catch (err) {
    log('warn', 'sync_sheets.subscriber_fail', {
      ...emailHashField(sub.email),
      err: err instanceof Error ? err.message : 'unknown',
    });
    return false;
  }
}

async function syncInquiry(inq: Inquiry): Promise<boolean> {
  try {
    await appendRows(SHEET_INQUIRY, [inquiryRow(inq)]);
    await markInquirySynced(inq.pk, new Date().toISOString());
    return true;
  } catch (err) {
    log('warn', 'sync_sheets.inquiry_fail', {
      pk: inq.pk,
      err: err instanceof Error ? err.message : 'unknown',
    });
    return false;
  }
}

async function runBatch(): Promise<void> {
  const stats = {
    vod: 0,
    free: 0,
    inquiry: 0,
    fail: 0,
  };

  try {
    const subs = await listUnsyncedSubscribers();
    for (const sub of subs) {
      const ok = await syncSubscriber(sub);
      if (!ok) {
        stats.fail += 1;
        continue;
      }
      const tags = sub.tags ?? [];
      if (tags.includes(COURSE_WAITLIST_SLUG)) stats.vod += 1;
      if (tags.some((t) => t.startsWith('resource:'))) stats.free += 1;
    }
  } catch (err) {
    log('error', 'sync_sheets.subscribers_tab_error', {
      err: err instanceof Error ? err.message : 'unknown',
    });
  }

  try {
    const inquiries = await listUnsyncedInquiries();
    for (const inq of inquiries) {
      const ok = await syncInquiry(inq);
      if (ok) stats.inquiry += 1;
      else stats.fail += 1;
    }
  } catch (err) {
    log('error', 'sync_sheets.inquiry_tab_error', {
      err: err instanceof Error ? err.message : 'unknown',
    });
  }

  log('info', 'sync_sheets.done', stats);
}

function isDynamoStream(event: unknown): event is DynamoDBStreamEvent {
  return (
    !!event &&
    typeof event === 'object' &&
    Array.isArray((event as DynamoDBStreamEvent).Records) &&
    (event as DynamoDBStreamEvent).Records[0]?.eventSource ===
      'aws:dynamodb'
  );
}

async function runStream(event: DynamoDBStreamEvent): Promise<void> {
  for (const record of event.Records) {
    if (record.eventName !== 'INSERT' && record.eventName !== 'MODIFY') {
      continue;
    }
    const image = record.dynamodb?.NewImage;
    if (!image?.pk?.S?.startsWith('INQ#') || image.sk?.S !== 'META') {
      continue;
    }
    if (image.syncedAt?.S) continue;
    const inq: Inquiry = {
      pk: image.pk.S,
      sk: 'META',
      name: image.name?.S ?? '',
      email: image.email?.S ?? '',
      resultUrl: image.resultUrl?.S ?? '',
      blocked: image.blocked?.S ?? '',
      status: (image.status?.S as Inquiry['status']) ?? 'new',
      createdAt: image.createdAt?.S ?? new Date().toISOString(),
      gsi1pk: image.gsi1pk?.S ?? '',
      gsi1sk: image.gsi1sk?.S ?? '',
    };
    await syncInquiry(inq);
  }
}

export async function handler(
  event: ScheduledEvent | DynamoDBStreamEvent,
): Promise<void> {
  if (isDynamoStream(event)) {
    await runStream(event);
    return;
  }
  await runBatch();
}
