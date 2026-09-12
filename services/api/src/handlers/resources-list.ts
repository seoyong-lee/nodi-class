import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { listPublishedResources } from '../db/resources.js';
import { json, internalError } from '../lib/response.js';
import { log } from '../lib/log.js';

export async function handler(
  _event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyResultV2> {
  try {
    const items = await listPublishedResources();
    // List payload omits body to keep responses small.
    const resources = items.map(({ body: _body, ...meta }) => meta);
    return json(200, { ok: true, resources });
  } catch (err) {
    log('error', 'resources.list.fail', {
      error: err instanceof Error ? err.message : 'unknown',
    });
    return internalError();
  }
}
