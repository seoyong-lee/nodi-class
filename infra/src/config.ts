import type { App } from 'aws-cdk-lib';

export type NodiEnv = 'dev' | 'prod';

export function requireNodiEnv(app: App): NodiEnv {
  const value =
    (app.node.tryGetContext('env') as string | undefined) ??
    process.env.NODI_ENV ??
    'dev';

  if (value !== 'dev' && value !== 'prod') {
    throw new Error(`Invalid env "${value}". Use -c env=dev|prod`);
  }
  return value;
}

/** Domain from `-c domain=…`, `-c NODI_DOMAIN=…`, or env `NODI_DOMAIN`. */
export function requireDomain(app: App): string {
  const value =
    (app.node.tryGetContext('domain') as string | undefined) ??
    (app.node.tryGetContext('NODI_DOMAIN') as string | undefined) ??
    process.env.NODI_DOMAIN;

  if (!value || value.trim() === '') {
    throw new Error(
      'Domain required: pass -c domain=example.com or set NODI_DOMAIN',
    );
  }
  return value.trim();
}

export function optionalHostedZoneId(app: App): string | undefined {
  const value = app.node.tryGetContext('hostedZoneId') as string | undefined;
  if (!value || value.trim() === '') return undefined;
  return value.trim();
}
