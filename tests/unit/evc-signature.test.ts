import { describe, it, expect } from 'vitest';
import crypto from 'crypto';

function verify(sig: string, body: string, secret: string) {
  const digest = crypto.createHmac('sha256', secret).update(Buffer.from(body)).digest('hex');
  return sig === digest;
}

describe('EVC+ signature verification', () => {
  it('matches HMAC', () => {
    const body = JSON.stringify({ a: 1 });
    const secret = 'x';
    const sig = crypto.createHmac('sha256', secret).update(Buffer.from(body)).digest('hex');
    expect(verify(sig, body, secret)).toBe(true);
  });
});
