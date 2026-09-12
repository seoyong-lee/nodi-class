/**
 * Weekly conversion report from nodi-events (PLAN.md §11 S1-9).
 *
 * Usage:
 *   AWS_PROFILE=… NODI_ENV=dev \
 *   EVENTS_TABLE=nodi-events-dev SUBSCRIBERS_TABLE=nodi-subscribers-dev \
 *   pnpm report -- --from 2026-09-01 --to 2026-09-12
 *
 * Prints terminal counts only — no dashboard.
 */
import {
  DynamoDBClient,
  ScanCommand,
  type AttributeValue,
} from '@aws-sdk/client-dynamodb';

type Args = { from?: string; to?: string };

function parseArgs(argv: string[]): Args {
  const out: Args = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--from') out.from = argv[++i];
    if (a === '--to') out.to = argv[++i];
  }
  return out;
}

function dayStart(isoDate: string): string {
  return `${isoDate}T00:00:00.000Z`;
}

function dayEnd(isoDate: string): string {
  return `${isoDate}T23:59:59.999Z`;
}

function skTs(sk: string): string {
  // sk = `<isoTs>#<event>` or `<isoTs>#<event>(slug)`
  const hash = sk.indexOf('#');
  return hash === -1 ? sk : sk.slice(0, hash);
}

function eventName(sk: string): string {
  const hash = sk.indexOf('#');
  return hash === -1 ? sk : sk.slice(hash + 1);
}

function slugFromEvent(name: string): string | null {
  const m = /^gate\.opened\(([^)]+)\)$/.exec(name);
  return m?.[1] ?? null;
}

async function scanAll(
  client: DynamoDBClient,
  tableName: string,
): Promise<Record<string, AttributeValue>[]> {
  const items: Record<string, AttributeValue>[] = [];
  let ExclusiveStartKey: Record<string, AttributeValue> | undefined;
  do {
    const res = await client.send(
      new ScanCommand({ TableName: tableName, ExclusiveStartKey }),
    );
    if (res.Items) items.push(...res.Items);
    ExclusiveStartKey = res.LastEvaluatedKey;
  } while (ExclusiveStartKey);
  return items;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const eventsTable = process.env.EVENTS_TABLE;
  const subscribersTable = process.env.SUBSCRIBERS_TABLE;
  if (!eventsTable || !subscribersTable) {
    console.error('Set EVENTS_TABLE and SUBSCRIBERS_TABLE');
    process.exit(1);
  }

  const from = args.from ? dayStart(args.from) : '1970-01-01T00:00:00.000Z';
  const to = args.to ? dayEnd(args.to) : new Date().toISOString();

  const client = new DynamoDBClient({});
  const events = await scanAll(client, eventsTable);
  const subscribers = await scanAll(client, subscribersTable);

  let requested = 0;
  let confirmed = 0;
  let opened = 0;
  const openedBySlug = new Map<string, number>();

  for (const item of events) {
    const sk = item.sk?.S;
    if (!sk) continue;
    const ts = skTs(sk);
    if (ts < from || ts > to) continue;
    // Prefer attribute `event`; sk suffix is fallback (ts#event).
    const name = item.event?.S ?? eventName(sk);
    const metaSlug = item.slug?.S;
    if (name === 'subscribe.requested') {
      requested += 1;
    } else if (name === 'subscribe.confirmed') {
      confirmed += 1;
    } else if (name === 'gate.opened' || name.startsWith('gate.opened')) {
      opened += 1;
      const slug = metaSlug ?? slugFromEvent(name) ?? 'unknown';
      openedBySlug.set(slug, (openedBySlug.get(slug) ?? 0) + 1);
    }
  }

  let active = 0;
  for (const item of subscribers) {
    if (item.sk?.S !== 'PROFILE') continue;
    if (item.status?.S === 'active') active += 1;
  }

  const rate =
    requested === 0 ? 0 : Math.round((confirmed / requested) * 1000) / 10;

  console.log(`nodi-events report  ${from.slice(0, 10)} → ${to.slice(0, 10)}`);
  console.log(`subscribe.requested   ${requested}`);
  console.log(`subscribe.confirmed   ${confirmed}`);
  console.log(`gate.opened           ${opened}`);
  console.log(`confirm rate          ${rate}%`);
  console.log(`active subscribers    ${active}`);
  if (openedBySlug.size) {
    console.log('gate.opened by slug:');
    for (const [slug, n] of [...openedBySlug.entries()].sort((a, b) =>
      a[0].localeCompare(b[0]),
    )) {
      console.log(`  ${slug.padEnd(36)} ${n}`);
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
