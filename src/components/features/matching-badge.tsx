import { Sparkles } from 'lucide-react';

interface MatchingBadgeProps {
  sponsorName: string;
  sponsorType: 'corporate' | 'grant';
  matchRatio: number;
  size?: 'sm' | 'md';
}

export function MatchingBadge({
  sponsorName,
  sponsorType,
  matchRatio,
  size = 'md',
}: MatchingBadgeProps) {
  const isCorporate = sponsorType === 'corporate';
  const multiplier = `${matchRatio + 1}x`;

  if (size === 'sm') {
    return (
      <span
        className={`inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
          isCorporate
            ? 'bg-amber-50 text-amber-700 border border-amber-200'
            : 'bg-purple-50 text-purple-700 border border-purple-200'
        }`}
      >
        <Sparkles className="h-2.5 w-2.5" />
        {multiplier} Matched
      </span>
    );
  }

  return (
    <div
      className={`rounded-xl p-3 border ${
        isCorporate
          ? 'bg-amber-50 border-amber-200'
          : 'bg-purple-50 border-purple-200'
      }`}
    >
      <div className="flex items-center gap-2">
        <div
          className={`rounded-lg p-1.5 ${
            isCorporate ? 'bg-amber-100' : 'bg-purple-100'
          }`}
        >
          <Sparkles
            className={`h-4 w-4 ${
              isCorporate ? 'text-amber-600' : 'text-purple-600'
            }`}
          />
        </div>
        <div>
          <p
            className={`text-sm font-semibold ${
              isCorporate ? 'text-amber-800' : 'text-purple-800'
            }`}
          >
            {matchRatio}x Matched by {sponsorName}
          </p>
          <p
            className={`text-xs ${
              isCorporate ? 'text-amber-600' : 'text-purple-600'
            }`}
          >
            Every £1 becomes £{multiplier}!
          </p>
        </div>
      </div>
    </div>
  );
}
