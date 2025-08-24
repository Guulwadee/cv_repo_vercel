import { describe, it, expect } from 'vitest';
import { z } from 'zod';

const Localized = z.object({ en: z.string().max(2000).default(''), so: z.string().max(2000).default('') });

describe('Localized validator', () => {
  it('accepts bilingual text', () => {
    const val = Localized.parse({ en: 'Hello', so: 'Salaan' });
    expect(val.en).toBe('Hello');
    expect(val.so).toBe('Salaan');
  });

  it('rejects too long', () => {
    const long = 'a'.repeat(2001);
    expect(() => Localized.parse({ en: long, so: '' })).toThrow();
  });
});
