import { cookies } from 'next/headers';
import { COOKIE_NAME, verifyAccessToken } from '@nodi/shared';

export async function hasValidAccessCookie(): Promise<boolean> {
  const secret = process.env.GATE_SECRET?.trim();
  if (!secret) return false;

  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  if (!token) return false;

  return verifyAccessToken(token, secret) !== null;
}
