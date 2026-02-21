import { createClient, createAdminClient } from '@/lib/supabase/server';
import type { WalletBalance, IssuedCard } from '@/types/wallet';

/** Get all wallet balances for a custodial account. Uses RLS. */
export async function getWalletBalancesForAccount(
  custodialAccountId: string
): Promise<WalletBalance[]> {
  const supabase = await createClient();

  const { data } = await supabase
    .from('wallet_balances')
    .select('*')
    .eq('custodial_account_id', custodialAccountId);

  return data ?? [];
}

/** Get wallet balance for a specific project. Uses RLS. */
export async function getWalletBalanceForProject(
  custodialAccountId: string,
  projectId: string
): Promise<WalletBalance | null> {
  const supabase = await createClient();

  const { data } = await supabase
    .from('wallet_balances')
    .select('*')
    .eq('custodial_account_id', custodialAccountId)
    .eq('project_id', projectId)
    .single();

  return data;
}

/** Get or create a wallet balance record. Admin client. */
export async function getOrCreateWalletBalance(
  custodialAccountId: string,
  projectId: string
): Promise<WalletBalance> {
  const supabase = createAdminClient();

  const { data: existing } = await supabase
    .from('wallet_balances')
    .select('*')
    .eq('custodial_account_id', custodialAccountId)
    .eq('project_id', projectId)
    .single();

  if (existing) return existing;

  const { data: created, error } = await supabase
    .from('wallet_balances')
    .insert({
      custodial_account_id: custodialAccountId,
      project_id: projectId,
    })
    .select()
    .single();

  if (error) throw new Error(`Failed to create wallet balance: ${error.message}`);
  return created;
}

/** Add funds to a wallet balance (after drawdown approval). Admin client. */
export async function addFundsToWallet(
  custodialAccountId: string,
  projectId: string,
  amount: number
): Promise<WalletBalance> {
  const wallet = await getOrCreateWalletBalance(custodialAccountId, projectId);
  const supabase = createAdminClient();

  const newBalance = Number(wallet.available_balance) + amount;
  const newDisbursed = Number(wallet.total_disbursed) + amount;

  const { data, error } = await supabase
    .from('wallet_balances')
    .update({
      available_balance: newBalance,
      total_disbursed: newDisbursed,
    })
    .eq('id', wallet.id)
    .select()
    .single();

  if (error) throw new Error(`Failed to update wallet balance: ${error.message}`);
  return data;
}

/** Hold funds in wallet (move from available to held when spending request approved). Admin client. */
export async function holdFundsInWallet(
  walletBalanceId: string,
  amount: number
): Promise<WalletBalance> {
  const supabase = createAdminClient();

  const { data: wallet } = await supabase
    .from('wallet_balances')
    .select('*')
    .eq('id', walletBalanceId)
    .single();

  if (!wallet) throw new Error('Wallet balance not found');
  if (Number(wallet.available_balance) < amount) {
    throw new Error('Insufficient available balance');
  }

  const { data, error } = await supabase
    .from('wallet_balances')
    .update({
      available_balance: Number(wallet.available_balance) - amount,
      held_balance: Number(wallet.held_balance) + amount,
    })
    .eq('id', walletBalanceId)
    .select()
    .single();

  if (error) throw new Error(`Failed to hold funds: ${error.message}`);
  return data;
}

/** Release held funds (after spending request completed or card transaction). Admin client. */
export async function releaseHeldFunds(
  walletBalanceId: string,
  amount: number
): Promise<WalletBalance> {
  const supabase = createAdminClient();

  const { data: wallet } = await supabase
    .from('wallet_balances')
    .select('*')
    .eq('id', walletBalanceId)
    .single();

  if (!wallet) throw new Error('Wallet balance not found');

  const { data, error } = await supabase
    .from('wallet_balances')
    .update({
      held_balance: Math.max(0, Number(wallet.held_balance) - amount),
    })
    .eq('id', walletBalanceId)
    .select()
    .single();

  if (error) throw new Error(`Failed to release funds: ${error.message}`);
  return data;
}

/** Return held funds to available (when spending request declined/expired). Admin client. */
export async function returnHeldFundsToAvailable(
  walletBalanceId: string,
  amount: number
): Promise<WalletBalance> {
  const supabase = createAdminClient();

  const { data: wallet } = await supabase
    .from('wallet_balances')
    .select('*')
    .eq('id', walletBalanceId)
    .single();

  if (!wallet) throw new Error('Wallet balance not found');

  const { data, error } = await supabase
    .from('wallet_balances')
    .update({
      available_balance: Number(wallet.available_balance) + amount,
      held_balance: Math.max(0, Number(wallet.held_balance) - amount),
    })
    .eq('id', walletBalanceId)
    .select()
    .single();

  if (error) throw new Error(`Failed to return funds: ${error.message}`);
  return data;
}

/** Get issued card for a project. Uses RLS. */
export async function getIssuedCardForProject(
  custodialAccountId: string,
  projectId: string
): Promise<IssuedCard | null> {
  const supabase = await createClient();

  const { data } = await supabase
    .from('issued_cards')
    .select('*')
    .eq('custodial_account_id', custodialAccountId)
    .eq('project_id', projectId)
    .single();

  return data;
}

/** Get all issued cards for a custodial account. Uses RLS. */
export async function getIssuedCardsForAccount(
  custodialAccountId: string
): Promise<IssuedCard[]> {
  const supabase = await createClient();

  const { data } = await supabase
    .from('issued_cards')
    .select('*')
    .eq('custodial_account_id', custodialAccountId);

  return data ?? [];
}

/** Get total available balance across all projects for a student. Admin client. */
export async function getTotalAvailableBalance(studentId: string): Promise<number> {
  const supabase = createAdminClient();

  const { data: account } = await supabase
    .from('custodial_accounts')
    .select('id')
    .eq('student_id', studentId)
    .eq('is_active', true)
    .single();

  if (!account) return 0;

  const { data: balances } = await supabase
    .from('wallet_balances')
    .select('available_balance')
    .eq('custodial_account_id', account.id);

  if (!balances || balances.length === 0) return 0;
  return balances.reduce((sum, b) => sum + Number(b.available_balance), 0);
}
