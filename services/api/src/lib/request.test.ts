import { describe, expect, it } from 'vitest';
import type { APIGatewayProxyEventV2 } from 'aws-lambda';
import { clientIp } from './request.js';
import { assertActiveForCampaign } from './campaign-guard.js';

function eventWith(
  sourceIp: string,
  xff?: string,
): APIGatewayProxyEventV2 {
  return {
    version: '2.0',
    routeKey: 'POST /subscribe',
    rawPath: '/subscribe',
    rawQueryString: '',
    headers: xff
      ? { 'x-forwarded-for': xff, 'content-type': 'application/json' }
      : { 'content-type': 'application/json' },
    requestContext: {
      accountId: '1',
      apiId: 'api',
      domainName: 'api.example',
      domainPrefix: 'api',
      http: {
        method: 'POST',
        path: '/subscribe',
        protocol: 'HTTP/1.1',
        sourceIp,
        userAgent: 'vitest',
      },
      requestId: 'r',
      routeKey: 'POST /subscribe',
      stage: '$default',
      time: '',
      timeEpoch: Date.now(),
    },
    isBase64Encoded: false,
  } as APIGatewayProxyEventV2;
}

describe('clientIp', () => {
  it('uses sourceIp and ignores X-Forwarded-For spoofing', () => {
    expect(clientIp(eventWith('9.9.9.9', '1.2.3.4, 9.9.9.9'))).toBe('9.9.9.9');
    expect(clientIp(eventWith('10.0.0.1'))).toBe('10.0.0.1');
  });
});

describe('assertActiveForCampaign', () => {
  it('allows active only', () => {
    expect(() => assertActiveForCampaign('active')).not.toThrow();
    expect(() => assertActiveForCampaign('pending')).toThrow(/campaign_blocked/);
  });
});
