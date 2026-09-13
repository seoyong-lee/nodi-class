import type { APIGatewayProxyEventV2 } from 'aws-lambda';

/** API Gateway HTTP API source IP only — never trust X-Forwarded-For. */
export function clientIp(event: APIGatewayProxyEventV2): string | undefined {
  const ip = event.requestContext.http?.sourceIp?.trim();
  return ip && ip.length > 0 ? ip : undefined;
}

export function userAgent(event: APIGatewayProxyEventV2): string | undefined {
  return event.headers['user-agent'] ?? event.headers['User-Agent'];
}

export function parseJsonBody(event: APIGatewayProxyEventV2): unknown {
  if (!event.body) return {};
  const raw = event.isBase64Encoded
    ? Buffer.from(event.body, 'base64').toString('utf8')
    : event.body;
  try {
    return JSON.parse(raw) as unknown;
  } catch {
    return null;
  }
}

/** Honeypot: nonempty website → bot. */
export function isHoneypot(body: unknown): boolean {
  if (!body || typeof body !== 'object') return false;
  const website = (body as { website?: unknown }).website;
  return typeof website === 'string' && website.length > 0;
}
