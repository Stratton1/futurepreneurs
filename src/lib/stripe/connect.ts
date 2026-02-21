import { stripe } from './index';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

/** Create a Stripe Connect Custom Account for a custodial parent */
export async function createConnectedAccount(
  parentEmail: string,
  parentName: string,
  metadata: { parentId: string; studentId: string }
) {
  const account = await stripe.accounts.create({
    type: 'custom',
    country: 'GB',
    email: parentEmail,
    capabilities: {
      transfers: { requested: true },
      card_issuing: { requested: true },
      treasury: { requested: true },
    },
    business_type: 'individual',
    individual: {
      email: parentEmail,
      first_name: parentName.split(' ')[0],
      last_name: parentName.split(' ').slice(1).join(' ') || parentName,
    },
    business_profile: {
      mcc: '8299', // Education services
      url: APP_URL,
    },
    metadata: {
      parent_id: metadata.parentId,
      student_id: metadata.studentId,
      platform: 'futurepreneurs',
    },
    tos_acceptance: {
      service_agreement: 'full',
    },
  });
  return account;
}

/** Generate a hosted onboarding link for the parent to complete KYC */
export async function createAccountLink(
  connectedAccountId: string,
  refreshUrl?: string,
  returnUrl?: string
) {
  const link = await stripe.accountLinks.create({
    account: connectedAccountId,
    refresh_url: refreshUrl || `${APP_URL}/dashboard/wallet/onboard?refresh=true`,
    return_url: returnUrl || `${APP_URL}/dashboard/wallet/onboard?step=complete`,
    type: 'account_onboarding',
  });
  return link;
}

/** Check Connect account verification status */
export async function getAccountStatus(connectedAccountId: string) {
  const account = await stripe.accounts.retrieve(connectedAccountId);
  const requirementsMet =
    !account.requirements?.currently_due?.length &&
    !account.requirements?.past_due?.length;

  return {
    id: account.id,
    charges_enabled: account.charges_enabled,
    payouts_enabled: account.payouts_enabled,
    requirements_met: requirementsMet,
    currently_due: account.requirements?.currently_due || [],
    past_due: account.requirements?.past_due || [],
    disabled_reason: account.requirements?.disabled_reason || null,
  };
}

/** Create a payout to the connected account's external bank account */
export async function createPayout(
  connectedAccountId: string,
  amountPence: number,
  metadata: { projectId: string; milestoneId?: string; spendingRequestId?: string }
) {
  const transfer = await stripe.transfers.create({
    amount: amountPence,
    currency: 'gbp',
    destination: connectedAccountId,
    metadata: {
      ...metadata,
      platform: 'futurepreneurs',
    },
  });
  return transfer;
}
