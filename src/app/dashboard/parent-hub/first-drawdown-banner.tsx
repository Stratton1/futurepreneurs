'use client';

import { useState } from 'react';
import { acknowledgeFirstDrawdown } from './actions';
import { AlertTriangle } from 'lucide-react';

interface FirstDrawdownBannerProps {
  pending: { projectId: string; projectTitle: string }[];
}

export function FirstDrawdownBanner({ pending }: FirstDrawdownBannerProps) {
  const [acknowledged, setAcknowledged] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState<string | null>(null);

  if (pending.length === 0) return null;

  const remaining = pending.filter((p) => !acknowledged.has(p.projectId));
  if (remaining.length === 0) return null;

  async function handleAcknowledge(projectId: string) {
    setLoading(projectId);
    const result = await acknowledgeFirstDrawdown(projectId);
    setLoading(null);

    if (!result.error) {
      setAcknowledged((prev) => new Set(prev).add(projectId));
    }
  }

  return (
    <div className="space-y-3">
      {remaining.map((item) => (
        <div
          key={item.projectId}
          className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3"
        >
          <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-amber-900">
              First drawdown pending for &ldquo;{item.projectTitle}&rdquo;
            </p>
            <p className="text-xs text-amber-700 mt-0.5">
              Your child has requested their first drawdown. Please acknowledge before the teacher can approve it.
            </p>
          </div>
          <button
            onClick={() => handleAcknowledge(item.projectId)}
            disabled={loading === item.projectId}
            className="flex-shrink-0 text-sm font-medium bg-amber-500 hover:bg-amber-600 text-white px-4 py-1.5 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading === item.projectId ? 'Saving...' : 'Acknowledge'}
          </button>
        </div>
      ))}
    </div>
  );
}
