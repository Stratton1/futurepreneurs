'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { createRewardTier } from '@/app/dashboard/projects/[id]/rewards/actions';

interface RewardTierFormProps {
  projectId: string;
  currency: string;
}

export function RewardTierForm({ projectId, currency }: RewardTierFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [minAmount, setMinAmount] = useState('');
  const [maxClaims, setMaxClaims] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);

    const result = await createRewardTier(projectId, {
      title,
      description,
      minAmount: Number(minAmount),
      maxClaims: maxClaims ? Number(maxClaims) : null,
    });

    if (result.error) {
      setError(result.error);
      setSubmitting(false);
      return;
    }

    setTitle('');
    setDescription('');
    setMinAmount('');
    setMaxClaims('');
    setSubmitting(false);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h3 className="font-semibold text-gray-900 mb-4">Add a Reward Tier</h3>

      <div className="space-y-3">
        <Input
          label="Reward Title"
          id="reward-title"
          placeholder="e.g., Thank You Card"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          hint="What will supporters receive?"
        />
        <Textarea
          label="Description"
          id="reward-description"
          placeholder="Describe the reward in more detail..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
        />
        <div className="grid grid-cols-2 gap-3">
          <Input
            label={`Min. Backing (${currency})`}
            id="reward-min-amount"
            type="number"
            min="1"
            step="1"
            placeholder="e.g., 10"
            value={minAmount}
            onChange={(e) => setMinAmount(e.target.value)}
          />
          <Input
            label="Max Claims (optional)"
            id="reward-max-claims"
            type="number"
            min="1"
            step="1"
            placeholder="Unlimited"
            value={maxClaims}
            onChange={(e) => setMaxClaims(e.target.value)}
            hint="Leave blank for unlimited"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <Button
          type="button"
          onClick={handleSubmit}
          isLoading={submitting}
          disabled={!title.trim() || !minAmount || Number(minAmount) <= 0}
          size="sm"
        >
          <Plus className="h-4 w-4 mr-1" /> Add Reward
        </Button>
      </div>
    </div>
  );
}
