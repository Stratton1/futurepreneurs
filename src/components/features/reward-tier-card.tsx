'use client';

import { useState } from 'react';
import { Gift, Trash2, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CURRENCY_SYMBOL } from '@/lib/constants';
import { deleteRewardTier } from '@/app/dashboard/projects/[id]/rewards/actions';

interface RewardTierCardProps {
  tier: {
    id: string;
    title: string;
    description: string;
    min_amount: number;
    max_claims: number | null;
    claimed_count: number;
    approval_status: 'pending' | 'approved' | 'rejected';
    sort_order: number;
  };
  projectId: string;
  canDelete?: boolean;
  showApprovalStatus?: boolean;
  selectable?: boolean;
  selected?: boolean;
  onSelect?: () => void;
}

export function RewardTierCard({
  tier,
  projectId,
  canDelete,
  showApprovalStatus,
  selectable,
  selected,
  onSelect,
}: RewardTierCardProps) {
  const [deleting, setDeleting] = useState(false);
  const isAvailable = !tier.max_claims || tier.claimed_count < tier.max_claims;

  const handleDelete = async () => {
    setDeleting(true);
    await deleteRewardTier(projectId, tier.id);
    setDeleting(false);
  };

  const statusBadge = showApprovalStatus ? (
    <span
      className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
        tier.approval_status === 'approved'
          ? 'bg-emerald-50 text-emerald-700'
          : tier.approval_status === 'rejected'
            ? 'bg-red-50 text-red-700'
            : 'bg-amber-50 text-amber-700'
      }`}
    >
      {tier.approval_status === 'approved' && <CheckCircle className="h-3 w-3" />}
      {tier.approval_status === 'rejected' && <XCircle className="h-3 w-3" />}
      {tier.approval_status === 'pending' && <Clock className="h-3 w-3" />}
      {tier.approval_status}
    </span>
  ) : null;

  const content = (
    <div
      className={`bg-white rounded-xl border p-4 transition-colors ${
        selectable && isAvailable
          ? selected
            ? 'border-emerald-500 bg-emerald-50 ring-1 ring-emerald-500'
            : 'border-gray-200 hover:border-emerald-300 cursor-pointer'
          : 'border-gray-200'
      } ${!isAvailable && selectable ? 'opacity-50' : ''}`}
    >
      <div className="flex items-start gap-3">
        <Gift className="h-5 w-5 text-purple-500 flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-gray-900 text-sm">{tier.title}</h3>
            {statusBadge}
          </div>
          {tier.description && (
            <p className="text-sm text-gray-600 mt-1">{tier.description}</p>
          )}
          <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
            <span className="font-medium text-gray-700">
              {CURRENCY_SYMBOL}{Number(tier.min_amount).toFixed(0)}+ to claim
            </span>
            {tier.max_claims && (
              <span>
                {tier.claimed_count}/{tier.max_claims} claimed
              </span>
            )}
            {!isAvailable && (
              <span className="text-red-600 font-medium">Sold out</span>
            )}
          </div>
        </div>
        {canDelete && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleDelete}
            isLoading={deleting}
            className="flex-shrink-0"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>
    </div>
  );

  if (selectable && isAvailable) {
    return (
      <button type="button" onClick={onSelect} className="w-full text-left">
        {content}
      </button>
    );
  }

  return content;
}
