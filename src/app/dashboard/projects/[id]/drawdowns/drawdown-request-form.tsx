'use client';

import { useState } from 'react';
import { createDrawdownRequest } from '@/app/dashboard/drawdowns/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CURRENCY_SYMBOL } from '@/lib/constants';

interface DrawdownRequestFormProps {
  projectId: string;
  milestoneId: string;
  milestoneTitle: string;
  maxAmount: number;
}

export function DrawdownRequestForm({
  projectId,
  milestoneId,
  maxAmount,
}: DrawdownRequestFormProps) {
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0 || amountNum > maxAmount) {
      setError(`Enter an amount between ${CURRENCY_SYMBOL}1 and ${CURRENCY_SYMBOL}${maxAmount.toFixed(2)}`);
      return;
    }
    setIsSubmitting(true);
    const result = await createDrawdownRequest(
      projectId,
      milestoneId,
      amountNum,
      reason.trim() || null
    );
    setIsSubmitting(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    setAmount('');
    setReason('');
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex flex-wrap items-end gap-3">
        <div className="w-28">
          <Input
            label="Amount"
            type="number"
            min={0.01}
            max={maxAmount}
            step={0.01}
            placeholder={`${CURRENCY_SYMBOL}`}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <div className="flex-1 min-w-[180px]">
          <Input
            label="Reason (optional)"
            type="text"
            placeholder="e.g. Buy ingredients"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>
        <Button type="submit" variant="primary" size="md" disabled={isSubmitting} isLoading={isSubmitting}>
          Request drawdown
        </Button>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </form>
  );
}
