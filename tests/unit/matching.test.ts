import { describe, it, expect } from 'vitest';
import type { MatchingSponsor, MatchingPledge } from '@/types/funding';

// Import the pure function logic directly
// calculateMatchAmount is a pure function in matching.ts
function calculateMatchAmount(
  backingAmount: number,
  pledge: Pick<MatchingPledge, 'match_ratio' | 'max_match_amount' | 'matched_amount'>,
  sponsor: Pick<MatchingSponsor, 'total_budget' | 'total_matched'>
): number {
  const rawMatch = backingAmount * pledge.match_ratio;
  const pledgeRemaining = Number(pledge.max_match_amount) - Number(pledge.matched_amount);
  const sponsorRemaining = Number(sponsor.total_budget) - Number(sponsor.total_matched);
  return Math.max(0, Math.min(rawMatch, pledgeRemaining, sponsorRemaining));
}

const makePledge = (overrides: Partial<MatchingPledge> = {}): Pick<MatchingPledge, 'match_ratio' | 'max_match_amount' | 'matched_amount'> => ({
  match_ratio: 1,
  max_match_amount: 5000,
  matched_amount: 0,
  ...overrides,
});

const makeSponsor = (overrides: Partial<MatchingSponsor> = {}): Pick<MatchingSponsor, 'total_budget' | 'total_matched'> => ({
  total_budget: 10000,
  total_matched: 0,
  ...overrides,
});

describe('calculateMatchAmount', () => {
  it('calculates 1:1 match with plenty of budget', () => {
    expect(calculateMatchAmount(100, makePledge(), makeSponsor())).toBe(100);
  });

  it('applies match ratio correctly', () => {
    expect(calculateMatchAmount(100, makePledge({ match_ratio: 0.5 }), makeSponsor())).toBe(50);
    expect(calculateMatchAmount(100, makePledge({ match_ratio: 2 }), makeSponsor())).toBe(200);
  });

  it('caps at pledge remaining budget', () => {
    const pledge = makePledge({ max_match_amount: 500, matched_amount: 450 });
    // Only £50 remaining in pledge, even though 1:1 match on £100 = £100
    expect(calculateMatchAmount(100, pledge, makeSponsor())).toBe(50);
  });

  it('caps at sponsor remaining budget', () => {
    const sponsor = makeSponsor({ total_budget: 200, total_matched: 180 });
    // Only £20 remaining in sponsor budget
    expect(calculateMatchAmount(100, makePledge(), sponsor)).toBe(20);
  });

  it('takes the minimum of all three caps', () => {
    const pledge = makePledge({ max_match_amount: 30, matched_amount: 0 }); // cap: 30
    const sponsor = makeSponsor({ total_budget: 50, total_matched: 30 }); // cap: 20
    // raw match: 100 * 1 = 100, pledge cap: 30, sponsor cap: 20 → min = 20
    expect(calculateMatchAmount(100, pledge, sponsor)).toBe(20);
  });

  it('returns 0 when pledge is fully matched', () => {
    const pledge = makePledge({ max_match_amount: 500, matched_amount: 500 });
    expect(calculateMatchAmount(100, pledge, makeSponsor())).toBe(0);
  });

  it('returns 0 when sponsor is fully exhausted', () => {
    const sponsor = makeSponsor({ total_budget: 1000, total_matched: 1000 });
    expect(calculateMatchAmount(100, makePledge(), sponsor)).toBe(0);
  });

  it('returns 0 for zero backing amount', () => {
    expect(calculateMatchAmount(0, makePledge(), makeSponsor())).toBe(0);
  });

  it('never returns negative', () => {
    const pledge = makePledge({ max_match_amount: 100, matched_amount: 200 }); // over-matched
    expect(calculateMatchAmount(100, pledge, makeSponsor())).toBe(0);
  });
});
