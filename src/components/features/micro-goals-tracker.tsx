'use client';

import { useState } from 'react';
import { CheckCircle, Circle, Star } from 'lucide-react';
import { Confetti } from '@/components/ui/confetti';
import { CURRENCY_SYMBOL } from '@/lib/constants';

interface MicroGoal {
  id: string;
  title: string;
  target_amount: number;
  reached_at: string | null;
  sort_order: number;
}

interface MicroGoalsTrackerProps {
  goals: MicroGoal[];
  totalRaised: number;
  goalAmount: number;
}

export function MicroGoalsTracker({ goals, totalRaised, goalAmount }: MicroGoalsTrackerProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  const [celebratedGoal, setCelebratedGoal] = useState<string | null>(null);

  if (goals.length === 0) return null;

  const handleCelebrate = (goalTitle: string) => {
    setCelebratedGoal(goalTitle);
    setShowConfetti(true);
  };

  const reachedCount = goals.filter((g) => g.reached_at).length;
  const progressPct = goalAmount > 0 ? Math.min(100, (totalRaised / goalAmount) * 100) : 0;

  return (
    <div className="space-y-4">
      {showConfetti && <Confetti onComplete={() => setShowConfetti(false)} />}

      {celebratedGoal && showConfetti && (
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-xl p-4 text-center animate-pulse">
          <Star className="h-6 w-6 text-amber-500 mx-auto mb-1" />
          <p className="text-sm font-semibold text-amber-800">{celebratedGoal}</p>
        </div>
      )}

      {/* Visual progress bar with markers */}
      <div className="relative">
        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 transition-all duration-700"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        {/* Goal markers on the bar */}
        {goals.map((goal) => {
          const markerPct = goalAmount > 0 ? (Number(goal.target_amount) / goalAmount) * 100 : 0;
          const isReached = !!goal.reached_at;

          return (
            <div
              key={goal.id}
              className="absolute top-1/2 -translate-y-1/2"
              style={{ left: `${markerPct}%`, transform: `translateX(-50%) translateY(-50%)` }}
            >
              <div
                className={`w-4 h-4 rounded-full border-2 ${
                  isReached
                    ? 'bg-emerald-500 border-emerald-600'
                    : 'bg-white border-gray-300'
                }`}
              />
            </div>
          );
        })}
      </div>

      {/* Goal list */}
      <div className="space-y-2">
        {goals.map((goal) => {
          const isReached = !!goal.reached_at;
          const isNext = !isReached && goals.filter((g) => !g.reached_at)[0]?.id === goal.id;

          return (
            <div
              key={goal.id}
              className={`flex items-center gap-3 p-3 rounded-xl text-sm transition-colors ${
                isReached
                  ? 'bg-emerald-50'
                  : isNext
                    ? 'bg-blue-50 border border-blue-100'
                    : 'bg-gray-50'
              }`}
            >
              {isReached ? (
                <button
                  type="button"
                  onClick={() => handleCelebrate(goal.title)}
                  className="flex-shrink-0"
                >
                  <CheckCircle className="h-5 w-5 text-emerald-500" />
                </button>
              ) : (
                <Circle className={`h-5 w-5 flex-shrink-0 ${isNext ? 'text-blue-400' : 'text-gray-300'}`} />
              )}
              <div className="flex-1 min-w-0">
                <p className={`font-medium ${isReached ? 'text-emerald-700' : isNext ? 'text-blue-800' : 'text-gray-600'}`}>
                  {goal.title}
                </p>
              </div>
              <span className={`text-xs font-medium flex-shrink-0 ${isReached ? 'text-emerald-600' : 'text-gray-400'}`}>
                {CURRENCY_SYMBOL}{Number(goal.target_amount).toLocaleString('en-GB')}
              </span>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-gray-500 text-center">
        {reachedCount} of {goals.length} micro-goals reached
      </p>
    </div>
  );
}
