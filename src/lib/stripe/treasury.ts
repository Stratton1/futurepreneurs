import { stripe } from './index';

/** Create a Treasury Financial Account under a Connected Account */
export async function createFinancialAccount(connectedAccountId: string) {
  const financialAccount = await stripe.treasury.financialAccounts.create(
    {
      supported_currencies: ['gbp'],
      features: {
        card_issuing: { requested: true },
        deposit_insurance: { requested: true },
        intra_stripe_flows: { requested: true },
        outbound_payments: {
          ach: { requested: true },
          us_domestic_wire: { requested: false },
        },
      },
    },
    { stripeAccount: connectedAccountId }
  );
  return financialAccount;
}

/** Transfer funds from the platform to a Treasury Financial Account */
export async function transferToTreasury(
  connectedAccountId: string,
  financialAccountId: string,
  amountPence: number,
  metadata: { projectId: string; milestoneId?: string }
) {
  // First transfer to the connected account
  const transfer = await stripe.transfers.create({
    amount: amountPence,
    currency: 'gbp',
    destination: connectedAccountId,
    metadata: {
      ...metadata,
      platform: 'futurepreneurs',
      destination_financial_account: financialAccountId,
    },
  });

  // Then move funds into the Treasury Financial Account via ReceivedCredit
  // (Stripe handles this automatically when funds arrive at the connected account)
  return transfer;
}

/** Get the live balance from a Treasury Financial Account */
export async function getFinancialAccountBalance(
  connectedAccountId: string,
  financialAccountId: string
) {
  const account = await stripe.treasury.financialAccounts.retrieve(
    financialAccountId,
    { stripeAccount: connectedAccountId }
  );
  return {
    cash: account.balance.cash,
    inbound_pending: account.balance.inbound_pending,
    outbound_pending: account.balance.outbound_pending,
  };
}

/** Create an outbound payment from Treasury to an external bank account */
export async function createOutboundPayment(
  connectedAccountId: string,
  financialAccountId: string,
  amountPence: number,
  metadata: { projectId: string; spendingRequestId: string }
) {
  const payment = await stripe.treasury.outboundPayments.create(
    {
      financial_account: financialAccountId,
      amount: amountPence,
      currency: 'gbp',
      destination_payment_method_data: {
        type: 'financial_account',
        financial_account: financialAccountId,
      },
      metadata: {
        ...metadata,
        platform: 'futurepreneurs',
      },
    },
    { stripeAccount: connectedAccountId }
  );
  return payment;
}
