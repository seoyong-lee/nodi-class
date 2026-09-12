import type {
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2,
  SNSEvent,
} from 'aws-lambda';
import { markUnsubscribed } from '../db/subscribers.js';
import { putEvent } from '../db/events.js';
import { emailHashField, log } from '../lib/log.js';
import { ok, badRequest, internalError } from '../lib/response.js';

type SesNotification = {
  notificationType?: string;
  eventType?: string;
  mail?: {
    destination?: string[];
  };
  bounce?: { bouncedRecipients?: { emailAddress?: string }[] };
  complaint?: { complainedRecipients?: { emailAddress?: string }[] };
};

function isSnsEvent(event: unknown): event is SNSEvent {
  return (
    !!event &&
    typeof event === 'object' &&
    Array.isArray((event as SNSEvent).Records) &&
    (event as SNSEvent).Records[0]?.EventSource === 'aws:sns'
  );
}

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

async function handleApiGateway(
  event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyResultV2> {
  if (!event.body) return badRequest();
  const raw = event.isBase64Encoded
    ? Buffer.from(event.body, 'base64').toString('utf8')
    : event.body;

  let envelope: {
    Type?: string;
    SubscribeURL?: string;
    Message?: string;
  };
  try {
    envelope = JSON.parse(raw) as typeof envelope;
  } catch {
    return badRequest();
  }

  if (envelope.Type === 'SubscriptionConfirmation' && envelope.SubscribeURL) {
    try {
      await fetch(envelope.SubscribeURL);
      log('info', 'ses.sns_confirmed', {});
    } catch (err) {
      log('warn', 'ses.sns_confirm_failed', {
        err: err instanceof Error ? err.message : 'unknown',
      });
    }
    return ok({ ok: true });
  }

  if (envelope.Type === 'Notification' && envelope.Message) {
    await handleSesPayload(envelope.Message);
  }

  return ok({ ok: true });
}

export async function handler(
  event: SNSEvent | APIGatewayProxyEventV2,
): Promise<APIGatewayProxyResultV2 | void> {
  try {
    if (isSnsEvent(event)) {
      for (const record of event.Records) {
        await handleSesPayload(record.Sns.Message);
      }
      return;
    }
    return await handleApiGateway(event);
  } catch (err) {
    log('error', 'ses-events.error', {
      err: err instanceof Error ? err.message : 'unknown',
    });
    if (isSnsEvent(event)) throw err;
    return internalError();
  }
}
