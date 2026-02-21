import { createAdminClient } from '@/lib/supabase/server';
import { getDailySpendingTotal, getWeeklySpendingTotal } from '@/lib/queries/spending-requests';
import type { VelocityCheckResult } from '@/types/wallet';

/** Default spending limits (can be overridden per card) */
const DEFAULT_DAILY_LIMIT = 50;
const DEFAULT_WEEKLY_LIMIT = 200;
const DEFAULT_PER_TRANSACTION_LIMIT = 100;

/** Check if a spending request amount is within velocity limits. */
export async function checkVelocityLimits(
  custodialAccountId: string,
  projectId: string,
  amount: number
): Promise<VelocityCheckResult> {
  const supabase = createAdminClient();

  // Get the issued card limits (if any) for this project
  const { data: card } = await supabase
    .from('issued_cards')
    .select('spending_limit_daily, spending_limit_weekly, spending_limit_per_transaction')
    .eq('custodial_account_id', custodialAccountId)
    .eq('project_id', projectId)
    .single();

  const dailyLimit = card ? Number(card.spending_limit_daily) : DEFAULT_DAILY_LIMIT;
  const weeklyLimit = card ? Number(card.spending_limit_weekly) : DEFAULT_WEEKLY_LIMIT;
  const perTxLimit = card ? Number(card.spending_limit_per_transaction) : DEFAULT_PER_TRANSACTION_LIMIT;

  // Check per-transaction limit
  if (amount > perTxLimit) {
    return {
      allowed: false,
      reason: `Amount exceeds per-transaction limit of £${perTxLimit.toFixed(2)}`,
      daily_used: 0,
      weekly_used: 0,
      daily_limit: dailyLimit,
      weekly_limit: weeklyLimit,
    };
  }

  // Check daily limit
  const dailyUsed = await getDailySpendingTotal(custodialAccountId, projectId);
  if (dailyUsed + amount > dailyLimit) {
    return {
      allowed: false,
      reason: `Would exceed daily spending limit of £${dailyLimit.toFixed(2)} (£${dailyUsed.toFixed(2)} already spent today)`,
      daily_used: dailyUsed,
      weekly_used: 0,
      daily_limit: dailyLimit,
      weekly_limit: weeklyLimit,
    };
  }

  // Check weekly limit
  const weeklyUsed = await getWeeklySpendingTotal(custodialAccountId, projectId);
  if (weeklyUsed + amount > weeklyLimit) {
    return {
      allowed: false,
      reason: `Would exceed weekly spending limit of £${weeklyLimit.toFixed(2)} (£${weeklyUsed.toFixed(2)} already spent this week)`,
      daily_used: dailyUsed,
      weekly_used: weeklyUsed,
      daily_limit: dailyLimit,
      weekly_limit: weeklyLimit,
    };
  }

  return {
    allowed: true,
    daily_used: dailyUsed,
    weekly_used: weeklyUsed,
    daily_limit: dailyLimit,
    weekly_limit: weeklyLimit,
  };
}
