'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createStretchGoal } from './actions';
import { CURRENCY_SYMBOL } from '@/lib/constants';

interface StretchGoalFormProps {
  projectId: string;
  goalAmount: number;
}

export function StretchGoalForm({ projectId, goalAmount }: StretchGoalFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const target = Number(targetAmount);
    if (!target || target <= goalAmount) {
      setError(`Target must be greater than ${CURRENCY_SYMBOL}${goalAmount.toFixed(0)}`);
      setSubmitting(false);
      return;
    }

    const result = await createStretchGoal({
      projectId,
      title: title.trim(),
      description: description.trim(),
      targetAmount: target,
    });

    setSubmitting(false);

    if (result.error) {
      setError(result.error);
    } else {
      setTitle('');
      setDescription('');
      setTargetAmount('');
      router.refresh();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="sg-title" className="block text-sm font-medium text-gray-700 mb-1">
          Title
        </label>
        <input
          id="sg-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          maxLength={200}
          placeholder="e.g. Expand to a second location"
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        />
      </div>

      <div>
        <label htmlFor="sg-desc" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          id="sg-desc"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          maxLength={1000}
          rows={3}
          placeholder="What will you do if this stretch goal is unlocked?"
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
        />
      </div>

      <div>
        <label htmlFor="sg-target" className="block text-sm font-medium text-gray-700 mb-1">
          Target amount (must be above {CURRENCY_SYMBOL}{goalAmount.toLocaleString()})
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
            {CURRENCY_SYMBOL}
          </span>
          <input
            id="sg-target"
            type="number"
            value={targetAmount}
            onChange={(e) => setTargetAmount(e.target.value)}
            required
            min={goalAmount + 1}
            step="1"
            placeholder={String(goalAmount + 100)}
            className="w-full border border-gray-200 rounded-lg pl-7 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting || !title.trim() || !description.trim() || !targetAmount}
        className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm px-5 py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? 'Submitting...' : 'Submit for Approval'}
      </button>
    </form>
  );
}
