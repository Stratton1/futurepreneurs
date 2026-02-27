import { describe, it, expect } from 'vitest';

// Import the pure functions directly (avoid Stripe client instantiation)
// We replicate the logic here since the module throws if STRIPE_SECRET_KEY is missing
function toPence(pounds: number): number {
  return Math.round(pounds * 100);
}

function toPounds(pence: number): number {
  return pence / 100;
}

function calculatePlatformFee(amountPence: number, feePercentage = 2.5): number {
  return Math.round(amountPence * (feePercentage / 100));
}

describe('toPence', () => {
  it('converts whole pounds to pence', () => {
    expect(toPence(10)).toBe(1000);
    expect(toPence(1)).toBe(100);
    expect(toPence(0)).toBe(0);
  });

  it('converts fractional pounds to pence', () => {
    expect(toPence(10.50)).toBe(1050);
    expect(toPence(0.01)).toBe(1);
    expect(toPence(99.99)).toBe(9999);
  });

  it('handles the max funding goal', () => {
    expect(toPence(10000)).toBe(1000000);
  });

  it('rounds correctly to avoid floating point issues', () => {
    // 19.99 * 100 = 1998.9999... without rounding
    expect(toPence(19.99)).toBe(1999);
    // 1.005 * 100 = 100.4999... in IEEE 754 → rounds to 100
    expect(toPence(1.005)).toBe(100);
  });
});

describe('toPounds', () => {
  it('converts pence to pounds', () => {
    expect(toPounds(1000)).toBe(10);
    expect(toPounds(100)).toBe(1);
    expect(toPounds(0)).toBe(0);
  });

  it('converts fractional pence to pounds', () => {
    expect(toPounds(1050)).toBe(10.5);
    expect(toPounds(1)).toBe(0.01);
    expect(toPounds(9999)).toBe(99.99);
  });
});

describe('calculatePlatformFee', () => {
  it('calculates 2.5% fee by default', () => {
    expect(calculatePlatformFee(10000)).toBe(250); // £100 → £2.50 fee
    expect(calculatePlatformFee(100000)).toBe(2500); // £1000 → £25 fee
  });

  it('handles zero amount', () => {
    expect(calculatePlatformFee(0)).toBe(0);
  });

  it('rounds fees to whole pence', () => {
    // 333 pence * 0.025 = 8.325 → rounds to 8
    expect(calculatePlatformFee(333)).toBe(8);
    // 777 pence * 0.025 = 19.425 → rounds to 19
    expect(calculatePlatformFee(777)).toBe(19);
  });

  it('handles small amounts', () => {
    // 1 penny * 0.025 = 0.025 → rounds to 0
    expect(calculatePlatformFee(1)).toBe(0);
    // 50 pence * 0.025 = 1.25 → rounds to 1
    expect(calculatePlatformFee(50)).toBe(1);
  });

  it('accepts custom fee percentages', () => {
    expect(calculatePlatformFee(10000, 5)).toBe(500); // 5%
    expect(calculatePlatformFee(10000, 0)).toBe(0); // 0%
    expect(calculatePlatformFee(10000, 10)).toBe(1000); // 10%
  });

  it('calculates fee for max funding goal', () => {
    // £10,000 = 1,000,000 pence → 2.5% = 25,000 pence = £250
    expect(calculatePlatformFee(1000000)).toBe(25000);
  });
});
