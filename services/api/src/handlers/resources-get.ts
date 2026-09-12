import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { getResourceBySlug } from '../db/resources.js';
import { json, internalError } from '../lib/response.js';
import { log } from '../lib/log.js';

export async function handler(
  event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyResultV2> {
  try {
    const slug = event.pathParameters?.slug;
    if (!slug || !/^[a-z0-9-]{3,64}$/.test(slug)) {
      return json(400, { ok: false, error: 'invalid' });
    }

    const resource = await getResourceBySlug(slug);
    if (!resource || resource.status !== 'published') {
      return json(404, { ok: false, error: 'not_found' });
    }

    return json(200, { ok: true, resource });
  } catch (err) {
    log('error', 'resources.get.fail', {
      error: err instanceof Error ? err.message : 'unknown',
    });
    return internalError();
  }
}
