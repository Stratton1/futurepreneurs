'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { approveStretchGoal, rejectStretchGoal } from '@/app/dashboard/projects/[id]/stretch-goals/actions';
import { CheckCircle2, XCircle } from 'lucide-react';

export function StretchGoalActions({ goalId }: { goalId: string }) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleApprove() {
    setSubmitting(true);
    setError(null);
    const result = await approveStretchGoal(goalId);
    setSubmitting(false);

    if (result.error) {
      setError(result.error);
    } else {
      router.refresh();
    }
  }

  async function handleReject() {
    setSubmitting(true);
    setError(null);
    const result = await rejectStretchGoal(goalId);
    setSubmitting(false);

    if (result.error) {
      setError(result.error);
    } else {
      router.refresh();
    }
  }

  return (
    <div className="flex flex-col items-end gap-2 shrink-0">
      {error && (
        <p className="text-xs text-red-600">{error}</p>
      )}
      <div className="flex items-center gap-2">
        <button
          onClick={handleApprove}
          disabled={submitting}
          className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
        >
          <CheckCircle2 className="h-4 w-4" />
          Approve
        </button>
        <button
          onClick={handleReject}
          disabled={submitting}
          className="inline-flex items-center gap-1.5 bg-white border border-red-200 text-red-600 hover:bg-red-50 text-sm font-medium px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
        >
          <XCircle className="h-4 w-4" />
          Reject
        </button>
      </div>
    </div>
  );
}
