import { hashEmail } from '@nodi/shared';

export type LogFields = Record<string, unknown>;

export function log(
  level: 'info' | 'warn' | 'error',
  message: string,
  fields: LogFields = {},
): void {
  const line = JSON.stringify({
    level,
    message,
    ts: new Date().toISOString(),
    ...fields,
  });
  if (level === 'error') {
    console.error(line);
  } else if (level === 'warn') {
    console.warn(line);
  } else {
    console.log(line);
  }
}

export function emailHashField(email: string): { emailHash: string } {
  return { emailHash: hashEmail(email) };
}
