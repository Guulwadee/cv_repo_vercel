import { describe, it, expect } from 'vitest';

function watermarkEnabled(isPro: boolean) {
  return !isPro;
}

describe('watermark logic', () => {
  it('free => watermark on', () => {
    expect(watermarkEnabled(false)).toBe(true);
  });
  it('pro => watermark off', () => {
    expect(watermarkEnabled(true)).toBe(false);
  });
});
