export type ApiEnv = {
  subscribersTable: string;
  inquiriesTable: string;
  eventsTable: string;
  resourcesTable: string;
  gateSecret: string;
  turnstileSecret: string;
  adminApiKey: string;
  siteUrl: string;
  mailFrom: string;
  mailReplyTo: string;
  notifyEmail: string;
  sesConfigurationSet?: string;
  /** Slack Incoming Webhook for /service 검토 요청. Optional. */
  slackInquiryWebhookUrl?: string;
};

const MAIL_REPLY_TO = 'contact@cascades.studio';

export function getEnv(env: NodeJS.ProcessEnv = process.env): ApiEnv {
  const required = [
    'SUBSCRIBERS_TABLE',
    'INQUIRIES_TABLE',
    'EVENTS_TABLE',
    'RESOURCES_TABLE',
    'GATE_SECRET',
    'TURNSTILE_SECRET',
    'SITE_URL',
    'MAIL_FROM',
    'NOTIFY_EMAIL',
  ] as const;

  for (const key of required) {
    if (!env[key]) {
      throw new Error(`Missing env ${key}`);
    }
  }

  const slack = env.SLACK_INQUIRY_WEBHOOK_URL?.trim();

  return {
    subscribersTable: env.SUBSCRIBERS_TABLE!,
    inquiriesTable: env.INQUIRIES_TABLE!,
    eventsTable: env.EVENTS_TABLE!,
    resourcesTable: env.RESOURCES_TABLE!,
    gateSecret: env.GATE_SECRET!,
    turnstileSecret: env.TURNSTILE_SECRET!,
    adminApiKey: env.ADMIN_API_KEY ?? '',
    siteUrl: env.SITE_URL!.replace(/\/$/, ''),
    mailFrom: env.MAIL_FROM!,
    mailReplyTo: env.MAIL_REPLY_TO ?? MAIL_REPLY_TO,
    notifyEmail: env.NOTIFY_EMAIL!,
    sesConfigurationSet: env.SES_CONFIGURATION_SET,
    slackInquiryWebhookUrl: slack || undefined,
  };
}
