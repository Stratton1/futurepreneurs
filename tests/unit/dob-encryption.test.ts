import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { calculateAge, daysUntilAge } from '@/lib/wallet/dob-encryption';

describe('calculateAge', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('calculates age for someone born 18 years ago', () => {
    vi.setSystemTime(new Date('2026-06-15'));
    expect(calculateAge('2008-01-15')).toBe(18);
  });

  it('returns 17 before birthday has passed this year', () => {
    vi.setSystemTime(new Date('2026-06-15'));
    expect(calculateAge('2008-08-20')).toBe(17);
  });

  it('returns correct age on birthday', () => {
    vi.setSystemTime(new Date('2026-06-15'));
    expect(calculateAge('2008-06-15')).toBe(18);
  });

  it('returns correct age the day before birthday', () => {
    vi.setSystemTime(new Date('2026-06-14'));
    expect(calculateAge('2008-06-15')).toBe(17);
  });

  it('handles leap year birthdays', () => {
    // Born Feb 29, 2008 → on March 1, 2026 they are 18 (birthday treated as Feb 28 in non-leap years)
    vi.setSystemTime(new Date('2026-03-01'));
    expect(calculateAge('2008-02-29')).toBe(18);
    // On Feb 28, 2026 they are still 17 (birthday hasn't passed yet)
    vi.setSystemTime(new Date('2026-02-28'));
    expect(calculateAge('2008-02-29')).toBe(17);
  });

  it('handles young students (11-17 range)', () => {
    vi.setSystemTime(new Date('2026-02-27'));
    expect(calculateAge('2015-02-27')).toBe(11);
    expect(calculateAge('2012-01-01')).toBe(14);
    expect(calculateAge('2009-03-01')).toBe(16);
  });
});

describe('daysUntilAge', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('calculates days until 18th birthday', () => {
    vi.setSystemTime(new Date('2026-01-01'));
    // Born 2008-07-01, turns 18 on 2026-07-01 = 181 days from Jan 1
    expect(daysUntilAge('2008-07-01', 18)).toBe(181);
  });

  it('returns 0 on the 18th birthday', () => {
    vi.setSystemTime(new Date('2026-06-15'));
    expect(daysUntilAge('2008-06-15', 18)).toBe(0);
  });

  it('returns negative if target age already reached', () => {
    vi.setSystemTime(new Date('2026-06-15'));
    expect(daysUntilAge('2008-01-01', 18)).toBeLessThan(0);
  });

  it('calculates 90-day warning window', () => {
    vi.setSystemTime(new Date('2026-01-01'));
    const days = daysUntilAge('2008-04-01', 18);
    // Born 2008-04-01, turns 18 on 2026-04-01 = 90 days from Jan 1
    expect(days).toBe(90);
  });
});
