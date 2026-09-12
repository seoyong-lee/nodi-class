import type { App } from 'aws-cdk-lib';

/** Resource name prefix — one environment, one stack (`nodi-class`). */
export const STACK_NAME = 'nodi-class';
export const NAME_PREFIX = 'nodi-class';

/** Production defaults — override with `-c`, env, or `cdk.json` context. */
export const DEFAULT_DOMAIN = 'nodiworks.com';
export const DEFAULT_HOSTED_ZONE_ID = 'Z0846873QT6Q378OHCHK';

function trimOrUndefined(value: string | undefined): string | undefined {
  if (!value || value.trim() === '') return undefined;
  return value.trim();
}

/** Domain: `-c domain=` → env `NODI_DOMAIN` → `nodiworks.com`. */
export function resolveDomain(app: App): string {
  return (
    trimOrUndefined(app.node.tryGetContext('domain') as string | undefined) ??
    trimOrUndefined(app.node.tryGetContext('NODI_DOMAIN') as string | undefined) ??
    trimOrUndefined(process.env.NODI_DOMAIN) ??
    DEFAULT_DOMAIN
  );
}

/** @deprecated use resolveDomain */
export function requireDomain(app: App): string {
  return resolveDomain(app);
}

/** Hosted zone: explicit flag/env → default zone when domain is nodiworks.com. */
export function resolveHostedZoneId(
  app: App,
  domain: string,
): string | undefined {
  const explicit =
    trimOrUndefined(app.node.tryGetContext('hostedZoneId') as string | undefined) ??
    trimOrUndefined(process.env.NODI_HOSTED_ZONE_ID);
  if (explicit) return explicit;
  if (domain === DEFAULT_DOMAIN) return DEFAULT_HOSTED_ZONE_ID;
  return undefined;
}

/** @deprecated use resolveHostedZoneId */
export function optionalHostedZoneId(app: App): string | undefined {
  return resolveHostedZoneId(app, resolveDomain(app));
}

/** Custom API domain on by default; pass `-c enableCustomDomain=false` to disable. */
export function resolveEnableCustomDomain(app: App): boolean {
  const raw = app.node.tryGetContext('enableCustomDomain');
  if (raw === false || raw === 'false') return false;
  return true;
}

export function ssmPath(key: string): string {
  return `/${NAME_PREFIX}/${key}`;
}
