import { CURRENCY_SYMBOL } from '@/lib/constants';

interface FundingProgressBarProps {
  raised: number;
  goal: number;
  backerCount?: number;
  size?: 'sm' | 'md' | 'lg';
  showLabels?: boolean;
}

export function FundingProgressBar({
  raised,
  goal,
  backerCount,
  size = 'md',
  showLabels = true,
}: FundingProgressBarProps) {
  const percentage = goal > 0 ? Math.min((raised / goal) * 100, 100) : 0;
  const isFunded = raised >= goal;

  const barHeight = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  }[size];

  return (
    <div>
      {/* Progress bar */}
      <div className={`w-full bg-gray-100 rounded-full ${barHeight} overflow-hidden`}>
        <div
          className={`${barHeight} rounded-full transition-all duration-500 ${
            isFunded ? 'bg-emerald-500' : 'bg-emerald-400'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {showLabels && (
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-gray-900">
              {CURRENCY_SYMBOL}{raised.toLocaleString('en-GB')}
            </span>
            <span className="text-xs text-gray-500">
              of {CURRENCY_SYMBOL}{goal.toLocaleString('en-GB')} goal
            </span>
          </div>
          <div className="flex items-center gap-3">
            {backerCount !== undefined && (
              <span className="text-xs text-gray-500">
                {backerCount} {backerCount === 1 ? 'supporter' : 'supporters'}
              </span>
            )}
            <span className={`text-xs font-medium ${isFunded ? 'text-emerald-600' : 'text-gray-500'}`}>
              {Math.round(percentage)}%
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
