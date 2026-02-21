'use client';

import { useState } from 'react';
import { CheckCircle, XCircle, Clock, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CURRENCY_SYMBOL } from '@/lib/constants';
import { approveRewardTier, rejectRewardTier } from '@/app/dashboard/projects/[id]/rewards/actions';

interface RewardTierApprovalCardProps {
  tier: {
    id: string;
    title: string;
    description: string;
    min_amount: number;
    max_claims: number | null;
    approval_status: 'pending' | 'approved' | 'rejected';
  };
  projectId: string;
  canApprove: boolean;
}

export function RewardTierApprovalCard({ tier, projectId, canApprove }: RewardTierApprovalCardProps) {
  const [loading, setLoading] = useState(false);

  const handleApprove = async () => {
    setLoading(true);
    await approveRewardTier(projectId, tier.id);
    setLoading(false);
  };

  const handleReject = async () => {
    setLoading(true);
    await rejectRewardTier(projectId, tier.id);
    setLoading(false);
  };

  const statusIcon = tier.approval_status === 'approved'
    ? <CheckCircle className="h-4 w-4 text-emerald-500" />
    : tier.approval_status === 'rejected'
      ? <XCircle className="h-4 w-4 text-red-500" />
      : <Clock className="h-4 w-4 text-amber-500" />;

  return (
    <div className={`bg-gray-50 rounded-lg p-3 ${tier.approval_status === 'rejected' ? 'opacity-60' : ''}`}>
      <div className="flex items-start gap-3">
        <Gift className="h-4 w-4 text-purple-500 flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-medium text-gray-900 text-sm">{tier.title}</p>
            {statusIcon}
          </div>
          {tier.description && (
            <p className="text-xs text-gray-500 mt-0.5">{tier.description}</p>
          )}
          <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
            <span>Min: {CURRENCY_SYMBOL}{Number(tier.min_amount).toFixed(0)}</span>
            {tier.max_claims && <span>Max claims: {tier.max_claims}</span>}
          </div>
        </div>
        {canApprove && tier.approval_status === 'pending' && (
          <div className="flex gap-1 flex-shrink-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleApprove}
              disabled={loading}
              className="text-emerald-600"
            >
              Approve
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleReject}
              disabled={loading}
              className="text-red-600"
            >
              Reject
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
