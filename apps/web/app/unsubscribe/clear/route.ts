import { NextResponse } from 'next/server';
import { ACCESS_HINT_COOKIE, COOKIE_NAME } from '@nodi/shared/constants';

/** Clears the access cookie so unsubscribed users lose resource unlock. */
export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
  res.cookies.set(ACCESS_HINT_COOKIE, '', {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
  return res;
}
