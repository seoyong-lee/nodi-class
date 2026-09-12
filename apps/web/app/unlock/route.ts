import { NextRequest, NextResponse } from 'next/server';
import {
  ACCESS_TTL_SEC,
  COOKIE_NAME,
  createAccessTokenFromHash,
  verifyGateToken,
} from '@nodi/shared';

function isSafeNextPath(next: string): boolean {
  if (next.includes('//') || next.includes('\\') || next.includes('://')) return false;
  if (next.includes('?') || next.includes('#')) return false;
  if (next === '/course' || next === '/course/') return true;
  return /^\/free\/[a-z0-9-]+\/?$/.test(next);
}

function failRedirect(req: NextRequest, nextPath: string): NextResponse {
  const match = /^\/free\/([a-z0-9-]+)/.exec(nextPath);
  if (match?.[1]) {
    return NextResponse.redirect(
      new URL(`/free/${match[1]}?expired=1`, req.url),
    );
  }
  return NextResponse.redirect(new URL('/?expired=1', req.url));
}

export async function GET(req: NextRequest) {
  const t = req.nextUrl.searchParams.get('t');
  const nextRaw = req.nextUrl.searchParams.get('next') ?? '/';
  const secret = process.env.GATE_SECRET?.trim();

  if (!t || !secret) {
    return failRedirect(req, nextRaw);
  }

  const gate = verifyGateToken(t, secret);
  if (!gate) {
    return failRedirect(req, nextRaw);
  }

  // Gate payload has email hash only — mint access cookie from that hash.
  const access = createAccessTokenFromHash(gate.h, secret);
  const destination = isSafeNextPath(nextRaw) ? nextRaw : '/';

  const res = NextResponse.redirect(new URL(destination, req.url));
  res.cookies.set(COOKIE_NAME, access, {
    httpOnly: true,
    // Secure required in prod; off on localhost http so unlock works in dev.
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: ACCESS_TTL_SEC,
  });
  return res;
}
