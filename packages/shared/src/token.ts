import { createHash, createHmac, timingSafeEqual } from 'node:crypto';
import {
  ACCESS_TTL_SEC,
  CONFIRM_TTL_SEC,
  GATE_TTL_SEC,
} from './constants.js';

export type ConfirmPayload = { t: 'c'; e: string; s: string; x: number };
export type GatePayload = { t: 'g'; h: string; x: number };
export type AccessPayload = { t: 'k'; h: string; x: number };
export type TokenPayload = ConfirmPayload | GatePayload | AccessPayload;
export type TokenType = TokenPayload['t'];

function b64urlEncode(data: string | Buffer): string {
  return Buffer.from(data).toString('base64url');
}

function signPayload(payloadB64: string, secret: string): Buffer {
  return createHmac('sha256', secret).update(`v1.${payloadB64}`).digest();
}

export function hashEmail(email: string): string {
  return createHash('sha256').update(email.trim().toLowerCase()).digest('hex');
}

export function signToken(payload: TokenPayload, secret: string): string {
  const payloadB64 = b64urlEncode(JSON.stringify(payload));
  const sigB64 = b64urlEncode(signPayload(payloadB64, secret));
  return `v1.${payloadB64}.${sigB64}`;
}

export function verifyToken(
  token: string,
  secret: string,
  expectedType?: TokenType,
): TokenPayload | null {
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const [version, payloadB64, sigB64] = parts;
  if (version !== 'v1' || !payloadB64 || !sigB64) return null;

  let actualSig: Buffer;
  try {
    actualSig = Buffer.from(sigB64, 'base64url');
  } catch {
    return null;
  }

  const expectedSig = signPayload(payloadB64, secret);
  if (
    actualSig.length !== expectedSig.length ||
    !timingSafeEqual(actualSig, expectedSig)
  ) {
    return null;
  }

  let payload: unknown;
  try {
    payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf8'));
  } catch {
    return null;
  }

  if (
    !payload ||
    typeof payload !== 'object' ||
    !('t' in payload) ||
    !('x' in payload) ||
    typeof (payload as { x: unknown }).x !== 'number'
  ) {
    return null;
  }

  const typed = payload as TokenPayload;
  if (expectedType !== undefined && typed.t !== expectedType) return null;

  const now = Math.floor(Date.now() / 1000);
  if (typed.x < now) return null;

  return typed;
}

export function createConfirmToken(
  email: string,
  slug: string,
  secret: string,
  nowSec = Math.floor(Date.now() / 1000),
): string {
  return signToken(
    { t: 'c', e: email.trim().toLowerCase(), s: slug, x: nowSec + CONFIRM_TTL_SEC },
    secret,
  );
}

export function createGateToken(
  email: string,
  secret: string,
  nowSec = Math.floor(Date.now() / 1000),
): string {
  return signToken(
    { t: 'g', h: hashEmail(email), x: nowSec + GATE_TTL_SEC },
    secret,
  );
}

export function createAccessToken(
  email: string,
  secret: string,
  nowSec = Math.floor(Date.now() / 1000),
): string {
  return signToken(
    { t: 'k', h: hashEmail(email), x: nowSec + ACCESS_TTL_SEC },
    secret,
  );
}

export function verifyConfirmToken(
  token: string,
  secret: string,
): ConfirmPayload | null {
  const payload = verifyToken(token, secret, 'c');
  return payload?.t === 'c' ? payload : null;
}

export function verifyGateToken(
  token: string,
  secret: string,
): GatePayload | null {
  const payload = verifyToken(token, secret, 'g');
  return payload?.t === 'g' ? payload : null;
}

export function verifyAccessToken(
  token: string,
  secret: string,
): AccessPayload | null {
  const payload = verifyToken(token, secret, 'k');
  return payload?.t === 'k' ? payload : null;
}
