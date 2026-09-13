import type { SNSEvent } from 'aws-lambda';
import { markUnsubscribed } from '../db/subscribers.js';
import { putEvent } from '../db/events.js';
import { emailHashField, log } from '../lib/log.js';

type SesNotification = {
  notificationType?: string;
  eventType?: string;
  mail?: {
    destination?: string[];
  };
  bounce?: { bouncedRecipients?: { emailAddress?: string }[] };
  complaint?: { complainedRecipients?: { emailAddress?: string }[] };
};

function destinations(msg: SesNotification): string[] {
  const fromMail = msg.mail?.destination ?? [];
  const fromBounce =
    msg.bounce?.bouncedRecipients
      ?.map((r) => r.emailAddress)
      .filter((e): e is string => !!e) ?? [];
  const fromComplaint =
    msg.complaint?.complainedRecipients
      ?.map((r) => r.emailAddress)
      .filter((e): e is string => !!e) ?? [];
  return [...new Set([...fromMail, ...fromBounce, ...fromComplaint])];
}

async function handleSesPayload(rawMessage: string): Promise<void> {
  let msg: SesNotification;
  try {
    msg = JSON.parse(rawMessage) as SesNotification;
  } catch {
    return;
  }

  const type = (msg.notificationType ?? msg.eventType ?? '').toLowerCase();
  const isBounce = type.includes('bounce');
  const isComplaint = type.includes('complaint');
  if (!isBounce && !isComplaint) return;

  for (const email of destinations(msg)) {
    try {
      await markUnsubscribed(email, { bounceAt: true });
      await putEvent({
        email,
        event: isBounce ? 'ses.bounce' : 'ses.complaint',
      });
      log('info', isBounce ? 'ses.bounce' : 'ses.complaint', {
        ...emailHashField(email),
      });
    } catch (err) {
      log('warn', 'ses.mark_failed', {
        ...emailHashField(email),
        err: err instanceof Error ? err.message : 'unknown',
      });
    }
  }
}

/** SNS → Lambda only. HTTP /internal/ses-events was removed (unauthenticated). */
export async function handler(event: SNSEvent): Promise<void> {
  try {
    for (const record of event.Records) {
      await handleSesPayload(record.Sns.Message);
    }
  } catch (err) {
    log('error', 'ses-events.error', {
      err: err instanceof Error ? err.message : 'unknown',
    });
    throw err;
  }
}
