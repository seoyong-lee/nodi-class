import { describe, expect, it } from 'vitest';
import {
  createConfirmToken,
  signToken,
  verifyConfirmToken,
  verifyGateToken,
  verifyToken,
} from './token.js';

const SECRET = 'test-gate-secret';

describe('token', () => {
  it('정상: confirm 토큰 서명·검증', () => {
    const token = createConfirmToken('User@Example.com', 'claude-ppt-guidebook', SECRET);
    const payload = verifyConfirmToken(token, SECRET);
    expect(payload).toEqual({
      t: 'c',
      e: 'user@example.com',
      s: 'claude-ppt-guidebook',
      x: expect.any(Number),
    });
    expect(payload!.x).toBeGreaterThan(Math.floor(Date.now() / 1000));
  });

  it('만료: exp가 지나면 검증 실패', () => {
    const expired = signToken(
      {
        t: 'c',
        e: 'user@example.com',
        s: 'claude-ppt-guidebook',
        x: Math.floor(Date.now() / 1000) - 1,
      },
      SECRET,
    );
    expect(verifyToken(expired, SECRET)).toBeNull();
    expect(verifyConfirmToken(expired, SECRET)).toBeNull();
  });

  it('위조: 서명 변조 시 검증 실패', () => {
    const token = createConfirmToken('user@example.com', 'claude-ppt-guidebook', SECRET);
    const [v, p, s] = token.split('.');
    const flipped = s!.endsWith('A') ? `${s!.slice(0, -1)}B` : `${s!.slice(0, -1)}A`;
    const forged = `${v}.${p}.${flipped}`;
    expect(verifyToken(forged, SECRET)).toBeNull();
  });

  it('타입 불일치: confirm을 gate로 검증하면 실패', () => {
    const token = createConfirmToken('user@example.com', 'claude-ppt-guidebook', SECRET);
    expect(verifyGateToken(token, SECRET)).toBeNull();
    expect(verifyToken(token, SECRET, 'g')).toBeNull();
    expect(verifyToken(token, SECRET, 'c')).not.toBeNull();
  });
});
