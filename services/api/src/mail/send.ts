import { SESv2Client, SendEmailCommand } from '@aws-sdk/client-sesv2';
import { getEnv } from '../lib/env.js';
import { emailHashField, log } from '../lib/log.js';
import { putEvent } from '../db/events.js';
import { listUnsubHeaders, type MailContent } from './templates/layout.js';

let ses: SESv2Client | undefined;

export function getSesClient(): SESv2Client {
  if (!ses) ses = new SESv2Client({});
  return ses;
}

export function setSesClient(client: SESv2Client | undefined): void {
  ses = client;
}

export type SendMailInput = {
  to: string;
  content: MailContent;
  unsubToken?: string;
  template: string;
  /** Skip List-Unsubscribe (e.g. notify-to-self). */
  skipListUnsub?: boolean;
};

export async function sendMail(input: SendMailInput): Promise<boolean> {
  const env = await getEnv();
  const headers: { Name: string; Value: string }[] = [];
  if (!input.skipListUnsub && input.unsubToken) {
    const h = listUnsubHeaders(env.siteUrl, input.unsubToken);
    for (const [Name, Value] of Object.entries(h)) {
      headers.push({ Name, Value });
    }
  }

  try {
    await getSesClient().send(
      new SendEmailCommand({
        FromEmailAddress: env.mailFrom,
        Destination: { ToAddresses: [input.to] },
        ReplyToAddresses: [env.mailReplyTo],
        ConfigurationSetName: env.sesConfigurationSet,
        Content: {
          Simple: {
            Subject: { Data: input.content.subject, Charset: 'UTF-8' },
            Body: {
              Text: { Data: input.content.text, Charset: 'UTF-8' },
              Html: { Data: input.content.html, Charset: 'UTF-8' },
            },
            Headers: headers.length > 0 ? headers : undefined,
          },
        },
      }),
    );
    await putEvent({
      email: input.to,
      event: 'mail.sent',
      meta: { template: input.template },
    });
    log('info', 'mail.sent', {
      ...emailHashField(input.to),
      template: input.template,
    });
    return true;
  } catch (err) {
    await putEvent({
      email: input.to,
      event: 'mail.failed',
      meta: { template: input.template },
    }).catch(() => undefined);
    log('error', 'mail.failed', {
      ...emailHashField(input.to),
      template: input.template,
      err: err instanceof Error ? err.message : 'unknown',
    });
    return false;
  }
}
