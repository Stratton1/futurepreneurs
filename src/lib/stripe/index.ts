import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set');
}

/** Server-side Stripe client */
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2026-01-28.clover',
  typescript: true,
});

/** Convert pounds to pence for Stripe (£10 → 1000) */
export function toPence(pounds: number): number {
  return Math.round(pounds * 100);
}

/** Convert pence to pounds (1000 → £10) */
export function toPounds(pence: number): number {
  return pence / 100;
}

/** Platform fee in pence */
export function calculatePlatformFee(amountPence: number, feePercentage = 2.5): number {
  return Math.round(amountPence * (feePercentage / 100));
}
