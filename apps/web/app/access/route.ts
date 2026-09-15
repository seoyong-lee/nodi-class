import { NextResponse } from 'next/server';
import { ACCESS_HINT_COOKIE, ACCESS_TTL_SEC } from '@nodi/shared/constants';
import { hasValidAccessCookie } from '../../lib/access';

/**
 * Reports whether the httpOnly access cookie is still valid and backfills the
 * script-readable hint. A prerendered page cannot see the access cookie, so
 * this is how readers who unlocked before the hint existed — or on a device
 * that only has the access cookie — get sent to the unlocked route.
 *
 * Per-reader, so it must never be cached by a CDN.
 */
export async function GET() {
  const unlocked = await hasValidAccessCookie();

  const res = NextResponse.json(
    { ok: true, unlocked },
    { headers: { 'Cache-Control': 'private, no-store, max-age=0' } },
  );
  res.cookies.set(ACCESS_HINT_COOKIE, unlocked ? '1' : '', {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: unlocked ? ACCESS_TTL_SEC : 0,
  });
  return res;
}
