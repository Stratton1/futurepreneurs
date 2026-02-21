import { stripe } from './index';

/** Create a virtual card in frozen state under a connected account */
export async function createVirtualCard(
  connectedAccountId: string,
  financialAccountId: string,
  cardholderName: string,
  metadata: { projectId: string; studentId: string }
) {
  // First create a cardholder
  const cardholder = await stripe.issuing.cardholders.create(
    {
      name: cardholderName,
      type: 'individual',
      status: 'active',
      billing: {
        address: {
          line1: 'Platform-managed',
          city: 'London',
          country: 'GB',
          postal_code: 'EC1A 1BB',
        },
      },
      metadata: {
        ...metadata,
        platform: 'futurepreneurs',
      },
    },
    { stripeAccount: connectedAccountId }
  );

  // Create the card in inactive (frozen) state
  const card = await stripe.issuing.cards.create(
    {
      cardholder: cardholder.id,
      currency: 'gbp',
      type: 'virtual',
      status: 'inactive', // frozen by default
      financial_account: financialAccountId,
      metadata: {
        ...metadata,
        platform: 'futurepreneurs',
      },
    },
    { stripeAccount: connectedAccountId }
  );

  return {
    card_id: card.id,
    cardholder_id: cardholder.id,
    last_four: card.last4,
  };
}

/** Unfreeze a card (set to active) */
export async function unfreezeCard(connectedAccountId: string, cardId: string) {
  const card = await stripe.issuing.cards.update(
    cardId,
    { status: 'active' },
    { stripeAccount: connectedAccountId }
  );
  return card;
}

/** Freeze a card (set to inactive) */
export async function freezeCard(connectedAccountId: string, cardId: string) {
  const card = await stripe.issuing.cards.update(
    cardId,
    { status: 'inactive' },
    { stripeAccount: connectedAccountId }
  );
  return card;
}

/** Cancel a card permanently */
export async function cancelCard(connectedAccountId: string, cardId: string) {
  const card = await stripe.issuing.cards.update(
    cardId,
    { status: 'canceled' },
    { stripeAccount: connectedAccountId }
  );
  return card;
}

/** Get card details and current status */
export async function getCardDetails(connectedAccountId: string, cardId: string) {
  const card = await stripe.issuing.cards.retrieve(
    cardId,
    { stripeAccount: connectedAccountId }
  );
  return {
    id: card.id,
    status: card.status,
    last4: card.last4,
    cardholder: card.cardholder,
    spending_controls: card.spending_controls,
  };
}

/** Update spending controls on a card (MCC restrictions, limits) */
export async function setSpendingControls(
  connectedAccountId: string,
  cardId: string,
  controls: {
    blocked_categories?: string[];
    spending_limits?: Array<{
      amount: number;
      interval: 'per_authorization' | 'daily' | 'weekly' | 'monthly';
    }>;
  }
) {
  const card = await stripe.issuing.cards.update(
    cardId,
    {
      spending_controls: {
        blocked_categories: controls.blocked_categories as Stripe.Issuing.CardUpdateParams.SpendingControls.BlockedCategory[],
        spending_limits: controls.spending_limits?.map((l) => ({
          amount: l.amount,
          interval: l.interval,
        })),
      },
    },
    { stripeAccount: connectedAccountId }
  );
  return card;
}

// Re-export Stripe type for use in webhook handler
import type Stripe from 'stripe';
export type { Stripe };
