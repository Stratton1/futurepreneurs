import { CURRENCY_SYMBOL } from '@/lib/constants';
import { Sparkles } from 'lucide-react';
import type { MatchingPledge, MatchingSponsor } from '@/types/funding';

interface MatchingImpactDisplayProps {
  pledges: (MatchingPledge & { sponsor: MatchingSponsor })[];
}

export function MatchingImpactDisplay({ pledges }: MatchingImpactDisplayProps) {
  if (pledges.length === 0) return null;

  const totalMatched = pledges.reduce(
    (sum, p) => sum + Number(p.matched_amount),
    0
  );

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="h-5 w-5 text-amber-500" />
        <h3 className="text-sm font-semibold text-gray-900">Matched Funding</h3>
      </div>

      {totalMatched > 0 && (
        <div className="bg-emerald-50 rounded-xl p-3 mb-4 text-center">
          <p className="text-2xl font-bold text-emerald-700">
            {CURRENCY_SYMBOL}{totalMatched.toFixed(2)}
          </p>
          <p className="text-xs text-emerald-600">total matched so far</p>
        </div>
      )}

      <div className="space-y-2">
        {pledges.map((pledge) => {
          const isCorporate = pledge.sponsor.sponsor_type === 'corporate';
          return (
            <div
              key={pledge.id}
              className={`rounded-lg p-3 border ${
                isCorporate
                  ? 'bg-amber-50 border-amber-100'
                  : 'bg-purple-50 border-purple-100'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p
                    className={`text-sm font-medium ${
                      isCorporate ? 'text-amber-800' : 'text-purple-800'
                    }`}
                  >
                    {pledge.sponsor.name}
                  </p>
                  <p
                    className={`text-xs ${
                      isCorporate ? 'text-amber-600' : 'text-purple-600'
                    }`}
                  >
                    {pledge.match_ratio}x match &middot; up to{' '}
                    {CURRENCY_SYMBOL}{Number(pledge.max_match_amount).toLocaleString()}
                  </p>
                </div>
                <p
                  className={`text-sm font-semibold ${
                    isCorporate ? 'text-amber-700' : 'text-purple-700'
                  }`}
                >
                  {CURRENCY_SYMBOL}{Number(pledge.matched_amount).toFixed(2)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
