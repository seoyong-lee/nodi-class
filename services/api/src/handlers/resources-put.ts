import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { ResourceUpsertInput } from '@nodi/shared';
import { upsertResource } from '../db/resources.js';
import { getEnv } from '../lib/env.js';
import { json, internalError } from '../lib/response.js';
import { log } from '../lib/log.js';
import { parseJsonBody } from '../lib/request.js';

async function adminAuthorized(event: APIGatewayProxyEventV2): Promise<boolean> {
  const { adminApiKey } = await getEnv();
  if (!adminApiKey) return false;
  const header =
    event.headers['x-admin-key'] ??
    event.headers['X-Admin-Key'] ??
    event.headers['X-ADMIN-KEY'];
  return typeof header === 'string' && header === adminApiKey;
}

export async function handler(
  event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyResultV2> {
  try {
    if (!(await adminAuthorized(event))) {
      return json(401, { ok: false, error: 'unauthorized' });
    }

    const slug = event.pathParameters?.slug;
    if (!slug || !/^[a-z0-9-]{3,64}$/.test(slug)) {
      return json(400, { ok: false, error: 'invalid' });
    }

    const body = parseJsonBody(event);
    if (body === null || typeof body !== 'object') {
      return json(400, { ok: false, error: 'invalid' });
    }
    const parsed = ResourceUpsertInput.safeParse({ ...body, slug });
    if (!parsed.success) {
      return json(400, { ok: false, error: 'invalid' });
    }

    const resource = await upsertResource(parsed.data);
    log('info', 'resources.put.ok', { slug: resource.slug });
    return json(200, { ok: true, resource });
  } catch (err) {
    log('error', 'resources.put.fail', {
      error: err instanceof Error ? err.message : 'unknown',
    });
    return internalError();
  }
}
