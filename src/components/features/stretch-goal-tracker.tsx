import { Target, Unlock, Lock } from 'lucide-react';
import { CURRENCY_SYMBOL } from '@/lib/constants';
import type { StretchGoal } from '@/types/funding';

interface StretchGoalTrackerProps {
  goals: StretchGoal[];
  totalRaised: number;
}

export function StretchGoalTracker({ goals, totalRaised }: StretchGoalTrackerProps) {
  if (goals.length === 0) return null;

  return (
    <div className="space-y-3">
      {goals.map((goal) => {
        const isUnlocked = goal.status === 'unlocked';
        const progress = Math.min(100, (totalRaised / Number(goal.target_amount)) * 100);

        return (
          <div
            key={goal.id}
            className={`rounded-xl p-4 border ${
              isUnlocked
                ? 'bg-purple-50 border-purple-200'
                : 'bg-gray-50 border-gray-100'
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`mt-0.5 rounded-lg p-1.5 ${
                  isUnlocked ? 'bg-purple-100' : 'bg-gray-200'
                }`}
              >
                {isUnlocked ? (
                  <Unlock className="h-3.5 w-3.5 text-purple-600" />
                ) : (
                  <Lock className="h-3.5 w-3.5 text-gray-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4
                    className={`text-sm font-semibold ${
                      isUnlocked ? 'text-purple-900' : 'text-gray-700'
                    }`}
                  >
                    {goal.title}
                  </h4>
                  <span
                    className={`text-xs font-medium ${
                      isUnlocked ? 'text-purple-600' : 'text-gray-500'
                    }`}
                  >
                    {CURRENCY_SYMBOL}{Number(goal.target_amount).toLocaleString()}
                  </span>
                </div>
                <p
                  className={`text-xs mt-0.5 ${
                    isUnlocked ? 'text-purple-700' : 'text-gray-500'
                  }`}
                >
                  {goal.description}
                </p>

                {!isUnlocked && (
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-1">
                      <div
                        className="h-1 rounded-full bg-emerald-400 transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      {Math.round(progress)}% towards stretch goal
                    </p>
                  </div>
                )}

                {isUnlocked && (
                  <div className="mt-1 flex items-center gap-1">
                    <Target className="h-3 w-3 text-purple-500" />
                    <span className="text-[10px] font-medium text-purple-600">
                      Stretch goal unlocked!
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
