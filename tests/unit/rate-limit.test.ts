import { describe, it, expect, vi, beforeEach } from 'vitest';
import { isRateLimited, getClientIp } from '@/lib/rate-limit';

describe('isRateLimited', () => {
  beforeEach(() => {
    // Use unique keys per test to avoid state leaks
    vi.useFakeTimers();
  });

  it('allows requests within the limit', () => {
    const key = 'test-allow-' + Math.random();
    expect(isRateLimited(key, 3, 60000)).toBe(false);
    expect(isRateLimited(key, 3, 60000)).toBe(false);
    expect(isRateLimited(key, 3, 60000)).toBe(false);
  });

  it('blocks requests that exceed the limit', () => {
    const key = 'test-block-' + Math.random();
    isRateLimited(key, 2, 60000);
    isRateLimited(key, 2, 60000);
    expect(isRateLimited(key, 2, 60000)).toBe(true);
  });

  it('resets after the time window passes', () => {
    const key = 'test-reset-' + Math.random();
    isRateLimited(key, 1, 1000);
    expect(isRateLimited(key, 1, 1000)).toBe(true); // blocked

    vi.advanceTimersByTime(1001);
    expect(isRateLimited(key, 1, 1000)).toBe(false); // allowed again
  });

  it('uses sliding window (old requests expire)', () => {
    const key = 'test-sliding-' + Math.random();
    isRateLimited(key, 2, 5000); // request at t=0

    vi.advanceTimersByTime(3000);
    isRateLimited(key, 2, 5000); // request at t=3s

    vi.advanceTimersByTime(3000); // now at t=6s, first request expired
    expect(isRateLimited(key, 2, 5000)).toBe(false); // should be allowed
  });

  vi.useRealTimers();
});

describe('getClientIp', () => {
  it('extracts IP from x-forwarded-for header', () => {
    const headers = new Headers({ 'x-forwarded-for': '203.0.113.50, 70.41.3.18' });
    expect(getClientIp(headers)).toBe('203.0.113.50');
  });

  it('falls back to x-real-ip header', () => {
    const headers = new Headers({ 'x-real-ip': '198.51.100.14' });
    expect(getClientIp(headers)).toBe('198.51.100.14');
  });

  it('returns unknown when no IP headers present', () => {
    const headers = new Headers();
    expect(getClientIp(headers)).toBe('unknown');
  });

  it('prefers x-forwarded-for over x-real-ip', () => {
    const headers = new Headers({
      'x-forwarded-for': '203.0.113.50',
      'x-real-ip': '198.51.100.14',
    });
    expect(getClientIp(headers)).toBe('203.0.113.50');
  });
});
