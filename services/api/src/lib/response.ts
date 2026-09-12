import type { APIGatewayProxyResultV2 } from 'aws-lambda';

const JSON_HEADERS = {
  'content-type': 'application/json; charset=utf-8',
};

export function json(
  statusCode: number,
  body: Record<string, unknown>,
): APIGatewayProxyResultV2 {
  return {
    statusCode,
    headers: JSON_HEADERS,
    body: JSON.stringify(body),
  };
}

export function redirect(location: string, statusCode = 302): APIGatewayProxyResultV2 {
  return {
    statusCode,
    headers: { location },
    body: '',
  };
}

export function ok(body: Record<string, unknown> = { ok: true }): APIGatewayProxyResultV2 {
  return json(200, body);
}

export function accepted(
  body: Record<string, unknown> = { ok: true },
): APIGatewayProxyResultV2 {
  return json(202, body);
}

export function badRequest(
  body: Record<string, unknown> = { error: 'invalid' },
): APIGatewayProxyResultV2 {
  return json(400, body);
}

export function forbidden(
  body: Record<string, unknown> = { error: 'bot' },
): APIGatewayProxyResultV2 {
  return json(403, body);
}

export function tooManyRequests(): APIGatewayProxyResultV2 {
  return json(429, { error: 'rate_limited' });
}

export function internalError(): APIGatewayProxyResultV2 {
  return json(500, { error: 'internal' });
}
