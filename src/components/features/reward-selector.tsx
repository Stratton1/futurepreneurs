'use client';

import { RewardTierCard } from './reward-tier-card';

interface Tier {
  id: string;
  title: string;
  description: string;
  min_amount: number;
  max_claims: number | null;
  claimed_count: number;
  approval_status: 'pending' | 'approved' | 'rejected';
  sort_order: number;
}

interface RewardSelectorProps {
  tiers: Tier[];
  projectId: string;
  selectedTierId: string | null;
  onSelect: (tierId: string | null) => void;
  backingAmount: number;
}

export function RewardSelector({ tiers, projectId, selectedTierId, onSelect, backingAmount }: RewardSelectorProps) {
  if (tiers.length === 0) return null;

  // Only show tiers the backer qualifies for based on their amount
  const eligibleTiers = tiers.filter(
    (t) => t.approval_status === 'approved' && backingAmount >= Number(t.min_amount)
  );

  if (eligibleTiers.length === 0 && tiers.some(t => t.approval_status === 'approved')) {
    const lowestAmount = Math.min(...tiers.filter(t => t.approval_status === 'approved').map(t => Number(t.min_amount)));
    return (
      <div className="text-xs text-gray-500 mt-2">
        Back with £{lowestAmount}+ to unlock reward tiers
      </div>
    );
  }

  if (eligibleTiers.length === 0) return null;

  return (
    <div className="mt-4">
      <p className="text-sm font-medium text-gray-700 mb-2">Choose a reward (optional)</p>
      <div className="space-y-2">
        {/* No reward option */}
        <button
          type="button"
          onClick={() => onSelect(null)}
          className={`w-full text-left p-3 rounded-xl border text-sm transition-colors ${
            selectedTierId === null
              ? 'border-emerald-500 bg-emerald-50 ring-1 ring-emerald-500'
              : 'border-gray-200 hover:border-emerald-300'
          }`}
        >
          <span className="font-medium text-gray-700">No reward — just support the project</span>
        </button>

        {eligibleTiers.map((tier) => (
          <RewardTierCard
            key={tier.id}
            tier={tier}
            projectId={projectId}
            selectable
            selected={selectedTierId === tier.id}
            onSelect={() => onSelect(tier.id)}
          />
        ))}
      </div>
    </div>
  );
}
