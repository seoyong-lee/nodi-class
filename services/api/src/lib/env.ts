import { GetParameterCommand, SSMClient } from '@aws-sdk/client-ssm';
import { parseBizInfo, type BizInfo } from '../mail/footer.js';

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
  /** Optional business registration lines for mail footers. */
  bizInfo: BizInfo;
};

const MAIL_REPLY_TO = 'contact@cascades.studio';

let ssm: SSMClient | undefined;
let cached: ApiEnv | undefined;

export function resetEnvCache(): void {
  cached = undefined;
}

export function setSsmClient(client: SSMClient | undefined): void {
  ssm = client;
}

async function getSecureParam(name: string): Promise<string> {
  if (!ssm) ssm = new SSMClient({});
  const res = await ssm.send(
    new GetParameterCommand({
      Name: name,
      WithDecryption: true,
    }),
  );
  const value = res.Parameter?.Value;
  if (!value) {
    throw new Error(`SSM parameter empty: ${name}`);
  }
  return value;
}

/**
 * Prefer plain env (tests/local). Else fetch SSM SecureString by `*_PARAM` path.
 * CloudFormation cannot put `ssm-secure` into Lambda environment variables.
 */
async function resolveSecret(
  env: NodeJS.ProcessEnv,
  valueKey: string,
  paramKey: string,
  required: boolean,
): Promise<string> {
  const direct = env[valueKey]?.trim();
  if (direct) return direct;
  const param = env[paramKey]?.trim();
  if (param) {
    try {
      return await getSecureParam(param);
    } catch (err) {
      if (!required) return '';
      throw err;
    }
  }
  if (!required) return '';
  throw new Error(`Missing env ${valueKey} or ${paramKey}`);
}

export async function getEnv(
  env: NodeJS.ProcessEnv = process.env,
): Promise<ApiEnv> {
  if (cached && env === process.env) {
    return cached;
  }

  const required = [
    'SUBSCRIBERS_TABLE',
    'INQUIRIES_TABLE',
    'EVENTS_TABLE',
    'RESOURCES_TABLE',
    'SITE_URL',
    'MAIL_FROM',
    'NOTIFY_EMAIL',
  ] as const;

  for (const key of required) {
    if (!env[key]) {
      throw new Error(`Missing env ${key}`);
    }
  }

  const [gateSecret, turnstileSecret, adminApiKey, slack, bizRaw] =
    await Promise.all([
      resolveSecret(env, 'GATE_SECRET', 'GATE_SECRET_PARAM', true),
      resolveSecret(env, 'TURNSTILE_SECRET', 'TURNSTILE_SECRET_PARAM', true),
      resolveSecret(env, 'ADMIN_API_KEY', 'ADMIN_API_KEY_PARAM', false),
      resolveSecret(
        env,
        'SLACK_INQUIRY_WEBHOOK_URL',
        'SLACK_INQUIRY_WEBHOOK_URL_PARAM',
        false,
      ),
      resolveSecret(env, 'BIZ_INFO', 'BIZ_INFO_PARAM', false),
    ]);

  const resolved: ApiEnv = {
    subscribersTable: env.SUBSCRIBERS_TABLE!,
    inquiriesTable: env.INQUIRIES_TABLE!,
    eventsTable: env.EVENTS_TABLE!,
    resourcesTable: env.RESOURCES_TABLE!,
    gateSecret,
    turnstileSecret,
    adminApiKey,
    siteUrl: env.SITE_URL!.replace(/\/$/, ''),
    mailFrom: env.MAIL_FROM!,
    mailReplyTo: env.MAIL_REPLY_TO ?? MAIL_REPLY_TO,
    notifyEmail: env.NOTIFY_EMAIL!,
    sesConfigurationSet: env.SES_CONFIGURATION_SET,
    slackInquiryWebhookUrl: slack || undefined,
    bizInfo: parseBizInfo(bizRaw),
  };

  if (env === process.env) {
    cached = resolved;
  }
  return resolved;
}
