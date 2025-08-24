import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

let inMemory = new Map<string, { tokens: number; reset: number }>();

const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL!,
        token: process.env.UPSTASH_REDIS_REST_TOKEN!
      })
    : null;

const limiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, '10 s'),
      analytics: true
    })
  : null;

export async function limit(key: string, max = 10, windowMs = 10000) {
  if (limiter) {
    const res = await limiter.limit(key);
    return { success: res.success, remaining: res.remaining, reset: res.reset };
  }
  // Fallback in-memory
  const now = Date.now();
  const bucket = inMemory.get(key);
  if (!bucket || bucket.reset < now) {
    inMemory.set(key, { tokens: max - 1, reset: now + windowMs });
    return { success: true, remaining: max - 1, reset: now + windowMs };
  }
  if (bucket.tokens <= 0) {
    return { success: false, remaining: 0, reset: bucket.reset };
  }
  bucket.tokens -= 1;
  inMemory.set(key, bucket);
  return { success: true, remaining: bucket.tokens, reset: bucket.reset };
}
